# flake8: noqa
import actioncommand
import robot
from util import Global
import Constants
import math
import Log
import random

from util.Constants import LEFT_FOOT, RIGHT_FOOT, LEDColour

from Task import BehaviourTask, TaskState

from util import FieldGeometry
from util import LedOverride
from util import Sonar
from util import TeamStatus
from util.Hysteresis import Hysteresis
from SpatialHysteresis import SpatialHysteresis
from util.Vector2D import Vector2D, angleBetween, makeVector2DCopy, makeVector2DFromDistHeading
from util.MathUtil import angleSignedDiff, angleDiff, normalisedTheta

from body.skills.WalkToPointV2 import WalkToPointV2
from body.skills.LineUpBall import LineUpBall
from body.skills.FindBall import FindBall
from body.skills.ApproachBall import ApproachBall, LineUpState
from body.skills.Dribble import Dribble
from body.skills.Kick import Kick
from body.skills.TurnDribble import TurnDribble
from body.skills.CloseQuarters import CloseQuarters

BALL_LOST_MAX_FRAMES = 45
KICK_ERROR_FACTOR = 0.4
RONALDO_MAX_DISTANCE = 2500

# Corner calculation constants
OUTER_X = Constants.FIELD_LENGTH / 2 - 70
INNER_X = Constants.FIELD_LENGTH / 2 - 170
OUTER_RIGHT = Vector2D(OUTER_X, FieldGeometry.ENEMY_GOAL_OUTER_RIGHT.y - 50)
INNER_RIGHT = Vector2D(INNER_X, FieldGeometry.ENEMY_GOAL_INNER_RIGHT.y)
OUTER_LEFT = Vector2D(OUTER_X, FieldGeometry.ENEMY_GOAL_OUTER_LEFT.y + 50)
INNER_LEFT = Vector2D(INNER_X, FieldGeometry.ENEMY_GOAL_INNER_LEFT.y)


class KickMode(object):
    KICK, DRIBBLE, TURN_DRIBBLE = range(3)


class GoalDistance(object):
    NEAR_GOAL, KICK_RANGE, FAR = range(3)


class FieldSide(object):
    RIGHT, LEFT = range(2)  # When facing the enemy goals


class Striker(BehaviourTask):
    def init(self):
        self.foot_hysteresis = Hysteresis(-30, 30)
        self.distance_from_goal_hysteresis = SpatialHysteresis([1250, 5000], 250)
        self.side_of_field_hysteresis = SpatialHysteresis([0], 250)

        self.kick_target = FieldGeometry.ENEMY_GOAL_BEHIND_CENTER
        self.kick_mode = KickMode.DRIBBLE
        self.kick_foot = LEFT_FOOT
        self.kick_hard = True
        self.kick_debug = "No strategy"

        self.distance_error = 50
        self.heading_error = 0.2

        self.close_ball_distance = 200

        # Strategy
        self.kick_off = None
        self.wait = False
        self.avoid = False
        self.avoid_hysteresis = Hysteresis(0, 10)
        self.angle_to_goal_shot = 0
        self.angle_to_goal_shot_hysteresis = Hysteresis(-30, 30)
        self.evade_kick = None
        self.evade_hysteresis = Hysteresis(0, 10)
        self.contention_hysteresis = Hysteresis(0, 20)
        self.blocking_angles = []
        self.goal_blocking_angles = []
        self.in_corner = False
        self.is_penalty = False
        self.penalty_direction = 1  # random.choice((-1, 1))
        self.isGoalie = False
        self.kickComplete = False
        self.crazy_ball_sonar_hysteresis = Hysteresis(0, 5)

        self.current_state = ApproachBallState(self)
        self.turn_dribble_foot = None
        self.leftSonarClearHysteresis = Hysteresis(0, 50)
        self.rightSonarClearHysteresis = Hysteresis(0, 50)

    def transition(self):
        BehaviourTask.transition(self)

    def _tick(self):
        self.adjust_hystereses()
        post_headings = self.get_post_headings()

        fancy = self.strategise(post_headings)
        if fancy:
            self.avoid_close_enemies()
            if not self.avoid:
                self.ronaldo(post_headings)
                self.contention()

        self.choose_foot()
        self.set_errors()

        # Allow vision to know if we want crazy ball detector
        self.world.b_request.wantCrazyBall = self.want_crazy_ball()

        self.current_state.tick()

    def choose_target(self):
        # Look for the best player to pass to in the "pass area"
        # Pass area is anything in front of the goal, back as far as -500x

        """
        maxPose = None
        for i in TeamStatus.getFieldPlayerIndices():
            pose = TeamStatus.getTeammatePose(i)[0]
            if TeamStatus.isTeammateActive(i) and \
               TeamStatus.getTeammatePlayerNum(i) != TeamStatus.my_player_number() and \
               pose.x > 1000 and abs(pose.y) < 1500:
                # We have a teammate in the "pass area"
                # Take the furthest forward
                if maxPose == None:
                    maxPose = pose
                elif pose.x > maxPose.x:
                    maxPose = pose
        if maxPose is not None:
            maxPose.x += 500
            maxPose.x = min(3000, maxPose.x)
            self.kick_debug = "Passing to team mate"
            if maxPose.y != 0:
                offset = -1 * math.copysign(100, maxPose.y)
                maxPose.y += offset
            return maxPose
        """

        ball = Global.ballWorldPos()

        ball_to_goal = FieldGeometry.ENEMY_GOAL_BEHIND_CENTER.minus(ball)
        goal_distance = ball_to_goal.length()

        target_default = Vector2D(goal_distance // 2, 0)
        target_default.rotate(ball_to_goal.heading())
        target_default.add(ball)

        return target_default

    def safe_kick(self):
        ball = Global.ballWorldPos()
        target = self.choose_target()
        kick_vector = target.minus(ball)
        new_distance = max(1000, kick_vector.length())
        kick_vector.normalise(new_distance)
        return ball.plus(kick_vector)

    def adjust_hystereses(self):
        self.check_corner()

        ball = Global.ballWorldPos()

        ball_to_goal = FieldGeometry.ENEMY_GOAL_BEHIND_CENTER.minus(ball)
        goal_distance = ball_to_goal.length()

        self.distance_from_goal_hysteresis.update(goal_distance)
        self.side_of_field_hysteresis.update(ball.y)

        self.angle_to_goal_shot = angleSignedDiff(ball_to_goal.heading(), Global.myPose().theta)
        self.angle_to_goal_shot_hysteresis.adjust(self.angle_to_goal_shot > 0)

    def get_post_headings(self):
        ball = Global.ballWorldPos()

        # TODO: Use goalie detection to adjust kick target?
        left_point = FieldGeometry.ENEMY_GOAL_INNER_LEFT
        right_point = FieldGeometry.ENEMY_GOAL_INNER_RIGHT

        left_heading = min(math.pi, angleBetween(left_point, ball))
        right_heading = max(-math.pi, angleBetween(right_point, ball))

        return (left_heading, right_heading)

    def choose_foot(self):
        # Select the kicking foot.  We would like this to be the foot that is closest to the ball
        # after turning to face our target

        ball = Global.ballWorldPos()
        kick_vector = self.kick_target.minus(ball)
        ball_vector = ball.minus(Global.myPos())
        target_theta = angleSignedDiff(kick_vector.heading(), ball_vector.heading())

        # Interestingly, the best foot to kick with while dribbling is the opposite of the best foot
        # to kick with when kicking.
        adjust = -math.copysign(1, target_theta) * (-1 if self.kick_mode == KickMode.DRIBBLE else 1)

        # We only care about target_thetas close to +-90, to avoid switching
        if abs(abs(target_theta) - math.pi / 2) > math.pi / 3:
            adjust = 0
        self.foot_hysteresis.add(adjust)

        # Always use left foot for kicks
        if self.kick_mode == KickMode.KICK:
            self.kick_foot = LEFT_FOOT

        # Don't switch the foot when we're lining up/shooting
        elif type(self.current_state) in [ApproachBallState, FindBallState]:
            if self.foot_hysteresis.is_max():
                self.kick_foot = LEFT_FOOT

            elif self.foot_hysteresis.is_min():
                self.kick_foot = RIGHT_FOOT

    def strategise(self, post_headings):
        if self.is_penalty:
            self.kick_debug = "Penalty kick"
            if self.penalty_direction == -1:
                self.kick_debug += " right"
            elif self.penalty_direction == 1:
                self.kick_debug += " left"

            shot_offset = Vector2D(0, self.penalty_direction * 400)

            self.kick_mode = KickMode.KICK
            self.kick_target = FieldGeometry.ENEMY_GOAL_CENTER.plus(shot_offset)
            self.kick_hard = True

            return False

        ball = Global.ballWorldPos()
        kickoffMinDistance = Constants.CENTER_CIRCLE_DIAMETER / 2 + 200
        if self.kick_off is not None:
            # If timer is up, or we're close enough to tell that the ball has moved into play,
            # or ball is clearly out of the circle, then it's no longer kick off.

            defender_timeout = self.kick_off is False and not self.world.inKickOffWaitTime
            defender_ball_touched = self.kick_off is False and Global.ballDistance() < 1000 and ball.isLongerThan(400.0)
            outside_centre_circle = Global.ballDistance() < 1000 and ball.isLongerThan(kickoffMinDistance)

            can_enter_circle = defender_timeout or outside_centre_circle  # or defender_ball_touched

            # if (defender_ball_touched):
            # Log.info("I think the defender touched the ball in kickoff")
            # if (can_enter_circle):
            #    self.kick_off = None
            #    self.wait = False
            if outside_centre_circle or self.world.kickOffWaitTimeElapsed > 20.0:
                self.kick_off = None
                self.wait = False

            if defender_timeout:
                self.kick_off = True
                self.wait = False

            # We check for True/False to avoid the None case when kick off is no longer relevant.
            if self.kick_off is True:  # Attacking kick-off play.
                # Kick towards left corner - hopefully where a supporting player will be.
                self.kick_debug = "Kickoff play"
                self.kick_mode = KickMode.KICK
                self.kick_target = TeamStatus.getSharedKickoffTarget()
                # self.kick_mode = KickMode.DRIBBLE #KickMode.KICK
                # self.kick_target = Vector2D(1000, -1000) #TeamStatus.getSharedKickoffTarget()
                self.kick_hard = False

                # Wait until time is almost up before kicking. (ijnek) Got rid of this because its too slow
                # self.wait = self.world.kickOffWaitTimeElapsed < 5.0
                self.wait = False

                return False

            if self.kick_off is False:  # Defending kick-off play.
                # Wait outside the centre circle until time is up.
                if Global.myPos().isShorterThan(kickoffMinDistance + 300):
                    self.wait = True
                    return False

        if self.shouldCrossDribble() is not None:
            self.kick_debug = "Cross dribble"
            self.kick_mode = KickMode.DRIBBLE
            """  # commented out by ijnek because turn dribble line up is slow
            self.kick_mode = KickMode.TURN_DRIBBLE
            # if Sonar.hasNearbySonarObject(0):
            if self.shouldCrossDribble() == 'LEFT':
                self.turn_dribble_foot = 'right'
            else:
                self.turn_dribble_foot = 'left'
            """
            self.kick_hard = False
            self.kick_target = FieldGeometry.ENEMY_PENALTY_CENTER
            return False
        else:
            self.turn_dribble_foot = None

        if self.in_corner:  # Corner play.
            # If we're in the corners on either side of the goals, kick back towards penalty spot.
            self.kick_debug = "Corner play"
            self.kick_mode = KickMode.DRIBBLE
            self.kick_target = FieldGeometry.ENEMY_PENALTY_CENTER
            self.kick_hard = False

            return True

        if self.distance_from_goal_hysteresis.state == GoalDistance.FAR:
            self.kick_debug = "Passing upfield"
            self.kick_mode = KickMode.KICK
            self.kick_target = self.safe_kick()
            self.kick_hard = False

            return True

        #
        # GO FOR GOAL
        #

        if self.distance_from_goal_hysteresis.state == GoalDistance.NEAR_GOAL:
            self.kick_mode = KickMode.DRIBBLE
        else:
            self.kick_mode = KickMode.KICK
        self.set_errors()  # So that we get a heading_error to work with

        total_kick_heading_error = self.heading_error + KICK_ERROR_FACTOR

        (left_heading, right_heading) = post_headings

        # Kick straight for the centre, we need accuracy
        if angleDiff(left_heading, right_heading) < total_kick_heading_error * 2:
            # Following lines commented out because they aim for the sides of the goal,
            # having less chance of scoring against an empty goal

            # self.kick_debug = "Goal centre"
            # kick_vector = makeVector2DFromDistHeading(4500, (left_heading + right_heading)/2)
            # Log.info("heading left %s right %s", left_heading * 57.2, right_heading * 57.2)
            # self.kick_target = ball.plus(kick_vector)
            # self.kick_hard = True

            self.kick_debug = "Goal centre"
            self.kick_target = FieldGeometry.ENEMY_GOAL_BEHIND_CENTER
            self.kick_hard = True

        # Be lazy and adjust our heading as little as possible to make the kick
        else:
            self.kick_debug = "Goal lazy angle"

            kick_heading = Global.myHeading()

            left_angle_diff = angleSignedDiff(kick_heading, left_heading)
            right_angle_diff = angleSignedDiff(kick_heading, right_heading)

            if left_angle_diff > -total_kick_heading_error:
                kick_heading = normalisedTheta(left_heading - total_kick_heading_error)
                self.kick_debug += " (adjusted right)"

            if right_angle_diff < total_kick_heading_error:
                kick_heading = normalisedTheta(right_heading + total_kick_heading_error)
                self.kick_debug += " (adjusted left)"

            kick_vector = Vector2D(4500, 0).rotate(kick_heading)

            self.kick_target = ball.plus(kick_vector)
            self.kick_hard = True

        if self.distance_from_goal_hysteresis.state == GoalDistance.NEAR_GOAL:
            # Cut the fancy shit, just go go go.
            return False
        else:
            return True

    def shouldCrossDribble(self):
        return self.getSonarObstacles()

    def getSonarObstacles(self):
        LEFT, RIGHT = 0, 1
        if Sonar.hasNearbySonarObject(LEFT):
            self.leftSonarClearHysteresis.reset()
        else:
            self.leftSonarClearHysteresis.up()

        if Sonar.hasNearbySonarObject(RIGHT):
            self.rightSonarClearHysteresis.reset()
        else:
            self.rightSonarClearHysteresis.up()

        if not self.leftSonarClearHysteresis.is_max():
            return "LEFT"
        if not self.rightSonarClearHysteresis.is_max():
            return "RIGHT"

        return None

    def set_errors(self):
        # Need some tighter thresholds for kicks
        if self.kick_mode == KickMode.KICK:
            self.distance_error = 100
            self.heading_error = 0.05
            if self.kick_debug == "Passing upfield":
                self.calculate_passing_error_update_target()
        else:
            self.distance_error = 100
            self.heading_error = 0.2

    def calculate_passing_error_update_target(self):
        left_lim_pos = Vector2D(3000, 1500)
        right_lim_pos = Vector2D(3000, -1500)
        ball = Global.ballWorldPos()

        ball_to_goal = FieldGeometry.ENEMY_GOAL_BEHIND_CENTER.minus(ball)
        goal_distance = ball_to_goal.length()

        left_vector = left_lim_pos.minus(ball)
        right_vector = right_lim_pos.minus(ball)

        error_theta = abs(right_vector.heading() - left_vector.heading()) / 2
        self.heading_error = error_theta
        self.kick_target = right_lim_pos.rotate(error_theta).normalise(goal_distance // 2)

    def avoid_close_enemies(self):
        CLOSE_ENEMY_DISTANCE = 1000
        LINEUP_ENEMY_DISTANCE = 500
        CONTENTION_ANGLE = 60

        ball = Global.ballWorldPos()
        robots = Global.robotObstaclesList()

        self.blocking_angles = []
        self.goal_blocking_angles = []
        close_robots = 0

        for robot in robots:
            if TeamStatus.isTeamMate(robot):
                continue

            robot_abs = makeVector2DCopy(robot.pos)
            robot_to_ball = ball.minus(makeVector2DCopy(robot.pos))

            if robot_to_ball.isShorterThan(LINEUP_ENEMY_DISTANCE):
                self.blocking_angles.append(robot_to_ball.heading())
                enemy_angle_to_shot = angleSignedDiff(robot.rr.heading, self.angle_to_goal_shot)
                self.goal_blocking_angles.append(enemy_angle_to_shot)

            if abs(robot.rr.heading) > math.radians(CONTENTION_ANGLE):
                continue

            if robot_to_ball.isShorterThan(CLOSE_ENEMY_DISTANCE):
                close_robots += 1

        myPose = Global.myPose()
        if myPose.x < -Constants.PENALTY_CROSS_ABS_X and abs(myPose.theta) > math.radians(45):
            self.avoid_hysteresis.down()
        else:
            self.avoid_hysteresis.adjust(len(self.blocking_angles) > 0)

        self.avoid = self.avoid_hysteresis.true

        self.contention_hysteresis.adjust(close_robots > 0)

    def ronaldo(self, post_headings):
        alternate_kick_target = self.evade_opponent()
        if alternate_kick_target != None:
            self.kick_debug = "Ronaldo"
            self.kick_target = alternate_kick_target

            # If our shot is blocked but they blocking player is far, kick upfield
            if self.evade_kick.isLongerThan(RONALDO_MAX_DISTANCE):
                self.kick_debug = "Passing upfield"
                self.kick_target = self.safe_kick()
                self.kick_hard = False

                return

            evade_kick_heading = self.evade_kick.heading()
            (left_heading, right_heading) = post_headings

            # Our kick is not aimed at the goal, be gentle
            if evade_kick_heading > left_heading or evade_kick_heading < right_heading:
                self.kick_debug += " (dribble)"
                self.kick_mode = KickMode.DRIBBLE
                self.kick_hard = False

                return

    def contention(self):
        if self.contention_hysteresis.true:
            self.kick_mode = KickMode.DRIBBLE
            self.kick_debug += " (contended)"

    # Adjusts an existing kick_target such that we avoid the closest kick-obstructing opponent
    def evade_opponent(self):
        EVADE_DISTANCE = 150.0
        MIN_DRIBBLE_DISTANCE = 1000.0
        ADDITIONAL_EVASION_HEADING = 0.3

        robots = Global.robotObstaclesList()

        ball = Global.ballWorldPos()
        kick_vector = self.kick_target.minus(ball)
        kick_heading = kick_vector.heading()

        # Find the closest robot which obstructs our desired kick

        closest_heading = None
        closest_distance = None
        closest_tangent_angle = None

        for robot in robots:
            # dont ronaldo against teammates
            if TeamStatus.isTeamMate(robot):
                continue

            robot_abs = makeVector2DCopy(robot.pos)
            ball_to_robot = robot_abs.minus(ball)
            robot_distance = ball_to_robot.length()
            robot_heading = ball_to_robot.heading()

            tangent_angle = math.asin(min(1.0, EVADE_DISTANCE / robot_distance))

            if angleDiff(kick_heading, robot_heading) < tangent_angle and (
                closest_distance == None or robot_distance < closest_distance
            ):
                closest_heading = robot_heading
                closest_distance = robot_distance
                closest_tangent_angle = tangent_angle

        # If there was an obstructing robot, calculate how we should kick around them

        if closest_distance != None:
            heading_adjustment = min(
                math.pi / 2, closest_tangent_angle + self.heading_error + ADDITIONAL_EVASION_HEADING
            )

            # Kick the ball towards the centre, away from the opponent
            new_kick_heading = closest_heading + heading_adjustment
            if self.side_of_field_hysteresis.state == FieldSide.LEFT:
                new_kick_heading = closest_heading - heading_adjustment

            kick_length = max(MIN_DRIBBLE_DISTANCE, closest_distance)
            self.evade_kick = makeVector2DFromDistHeading(kick_length, new_kick_heading)

        # If we've had an evasive kick prepared for long enough, go ahead with it

        self.evade_hysteresis.adjust(closest_distance != None)

        if self.evade_hysteresis.true and self.evade_kick != None:
            return ball.plus(self.evade_kick)
        else:
            return None

    def check_corner(self):
        # If the ball is outside of the goal post and at a sharp angle, it's in the corner.
        # We add some hysteresis to make sure it's inside the goal post or no longer
        # at a sharp angle before switching out of the corner. We calculate the angle to a
        # point inwards from the goal line to avoid getting stuck next against the post.
        # Note the following diagram is not to scale. Also \ was the sharpest angle I could draw.
        #
        #        -----(GP)---------------(GP)-----
        #             |  |               |  |
        #  CORNER <<  /  / >> !CORNER << \  \  >> CORNER
        #            /  /                 \  \
        #           /  /                   \  \
        #          /  /                     \  \
        ballPos = Global.ballWorldPos()
        if not self.in_corner and (
            FieldGeometry.angleToPoint(OUTER_RIGHT, ballPos) > math.radians(65)
            or FieldGeometry.angleToPoint(OUTER_LEFT, ballPos) < -math.radians(65)
        ):
            self.in_corner = True
        elif (
            self.in_corner
            and FieldGeometry.angleToPoint(INNER_RIGHT, ballPos) < math.radians(65)
            and FieldGeometry.angleToPoint(INNER_LEFT, ballPos) > -math.radians(65)
        ):
            self.in_corner = False

    # Check if we want to notify vision to use crazy ball detector
    def want_crazy_ball(self):
        # enable crazy ball if inkickoffwaittime and ball is at centre
        if self.world.inKickOffWaitTime and Global.ballWorldPos().length() < Constants.CENTER_CIRCLE_DIAMETER / 2:
            return True

        ball_is_at_feet = False
        obstacle_in_front = False

        if Global.ballDistance < 400 and abs(Global.ballHeading()) < math.radians(70):
            ball_is_at_feet = True

        LEFT, RIGHT = 0, 1
        if Sonar.hasNearbySonarObject(LEFT) or Sonar.hasNearbySonarObject(RIGHT):
            self.crazy_ball_sonar_hysteresis.up()
        else:
            self.crazy_ball_sonar_hysteresis.down()

        if self.crazy_ball_sonar_hysteresis.is_max():
            obstacle_in_front = True

        if ball_is_at_feet and obstacle_in_front:
            return True

        return False


class FindBallState(TaskState):
    def init(self):
        self.find_ball_skill = FindBall(self.world)

    def transition(self):
        if Global.canSeeBall():
            return ApproachBallState(self.parent)

        return self

    def tick(self):
        self.find_ball_skill.tick()


class WaitState(TaskState):
    def transition(self):
        if not self.parent.wait:
            if self.parent.kick_off:
                return ShootState(self.parent)
            else:
                return ApproachBallState(self.parent)

        return self

    def tick(self):
        self.world.b_request.actions.body = actioncommand.crouch()


class WatchState(TaskState):  # For watching the ball while goalie is being striker.
    def init(self):
        self.walk_to_point_skill = WalkToPointV2(self.world)
        self.side_adjustment = 0
        self.side_direction_hysteresis = Hysteresis(-20, 20)

    def transition(self):
        if Global.ballLostFrames() > BALL_LOST_MAX_FRAMES / 2:
            return FindBallState(self.parent)

        if not TeamStatus.isGoalieAttacking():
            return ApproachBallState(self.parent)

        return self

    def tick(self):
        ball = Global.ballWorldPos()
        pose = Global.myPose()

        # Stay roughly 600 away from the ball.
        forward = Global.ballDistance() - 600
        # Calculate if we're in the way of the goalie's shot and what relative direction we should move to.
        side_diff = pose.y - ball.y
        self.side_direction_hysteresis.adjust(side_diff > 0)
        self.side_direction = 1 if self.side_direction_hysteresis.true else -1
        # If we're facing the ball from the opposite side we need to flip our relative direction.
        if pose.x > ball.x:
            self.side_direction *= -1

        # If we're in the way, give sidestep priority and halve forward.
        if abs(side_diff) < 300:
            self.side_adjustment = self.side_direction * 175
            forward /= 2
        elif abs(side_diff) > 500:
            self.side_adjustment = 0

        # Turn to the ball to make sure you can still see it.
        self.walk_to_point_skill.tick(
            forward, self.side_adjustment, Global.ballHeading(), keepFacing=True, relative=True
        )


class ApproachBallState(TaskState):
    def init(self, chasing=False):
        self.approach_ball_skill = ApproachBall(self.world, slow=self.parent.is_penalty)

        # activated after kicking ball, ball is far away and we don't want to go into findball
        self.chasing = chasing

    def transition(self):
        if Global.ballLostFrames() > BALL_LOST_MAX_FRAMES:
            if not self.chasing:
                return FindBallState(self.parent)

        if self.parent.wait and self.parent.kick_off is False:
            return WaitState(self.parent)

        if TeamStatus.isGoalieAttacking() and not self.parent.isGoalie:
            return WatchState(self.parent)

        if self.parent.avoid:
            return CloseQuartersState(self.parent)

        elif self.parent.kick_mode == KickMode.DRIBBLE:
            if self.approach_ball_skill.close and self.approach_ball_skill.position_aligned:
                if self.parent.wait and self.parent.kick_off:
                    return WaitState(self.parent)
                else:
                    return ShootState(self.parent)

        else:
            if type(self.approach_ball_skill.current_state) == LineUpState and self.approach_ball_skill.heading_aligned:
                if self.parent.wait and self.parent.kick_off:
                    return WaitState(self.parent)
                else:
                    return ShootState(self.parent)

        return self

    def tick(self):
        if self.chasing:
            # if the striker is within the area where the ball should be stop chasing
            if Global.ballDistance() <= 300:
                self.chasing = False

        self.approach_ball_skill.tick(
            self.parent.kick_target,
            self.parent.kick_foot,
            heading_error=self.parent.heading_error,
            distance_error=self.parent.distance_error,
            evade_distance=170 if self.parent.kick_mode == KickMode.DRIBBLE else 170,
            lineup_distance=150 if self.parent.kick_mode == KickMode.DRIBBLE else 200,
        )


class CloseQuartersState(TaskState):
    def init(self):
        self.close_quarters_skill = CloseQuarters(self.world)
        self.near_field_border_hysteresis = Hysteresis(-10, 10)
        if FieldGeometry.nearFieldBorder():
            self.near_field_border_hysteresis.resetMax()

    def transition(self):
        if Global.ballLostFrames() > BALL_LOST_MAX_FRAMES / 2:
            return FindBallState(self.parent)

        if not self.parent.avoid:
            return ApproachBallState(self.parent)

        return self

    def tick(self):
        # Default to avoiding towards the goal.
        kick_foot = robot.Foot.LEFT if self.parent.angle_to_goal_shot_hysteresis.true else robot.Foot.RIGHT

        self.near_field_border_hysteresis.adjust(FieldGeometry.nearFieldBorder())
        # If we're not near the field border, we can afford to do some better avoidance.
        if not self.near_field_border_hysteresis.true:
            # Avoid to opposite side if there is a robot on the side.
            if len(self.parent.goal_blocking_angles) > 0:
                if self.parent.goal_blocking_angles[0] > math.radians(25):
                    kick_foot = robot.Foot.RIGHT
                elif self.parent.goal_blocking_angles[0] < math.radians(-25):
                    kick_foot = robot.Foot.LEFT
            # Avoid to opposite side if there is something near us in sonar.
            LEFT, RIGHT = 0, 1
            nearbyObject = [Sonar.hasNearbySonarObject(LEFT), Sonar.hasNearbySonarObject(RIGHT)]
            if nearbyObject[LEFT] and not nearbyObject[RIGHT]:
                kick_foot = robot.Foot.RIGHT
            elif nearbyObject[RIGHT] and not nearbyObject[LEFT]:
                kick_foot = robot.Foot.LEFT

        self.close_quarters_skill.tick(
            evade_distance=150, blocking_angles=self.parent.blocking_angles, kick_foot=kick_foot
        )


class ShootState(TaskState):
    # TODO: Don't reference parent parameters if switching is a problem
    def init(self):
        self.kick_mode = self.parent.kick_mode

        if self.kick_mode == KickMode.DRIBBLE:
            self.dribble_skill = Dribble(self.world)

        elif self.kick_mode == KickMode.KICK:
            foot = robot.Foot.LEFT if self.parent.kick_foot == LEFT_FOOT else robot.Foot.RIGHT
            self.kick_skill = Kick(
                self.world, 0, foot, self.parent.kick_target, self.parent.kick_hard, self.parent.heading_error
            )

        elif self.kick_mode == KickMode.TURN_DRIBBLE:
            if self.parent.turn_dribble_foot == None:
                foot = robot.Foot.LEFT if self.parent.angle_to_goal_shot_hysteresis.true else robot.Foot.RIGHT
            elif self.parent.turn_dribble_foot == "left":
                foot = robot.Foot.LEFT
            else:
                foot = robot.Foot.RIGHT
            self.turn_dribble_skill = TurnDribble(self.world, kickFoot=foot)

        self.complete = False

        robot.say(self.parent.kick_debug)

        Log.info(
            "Kick: %s %s %s %s",
            self.parent.kick_debug,
            self.parent.kick_target,
            self.parent.kick_target.minus(Global.ballWorldPos()).heading(),
            Global.myHeading(),
        )

        Log.info(
            "Hystereses: %s, %s, %s",
            self.parent.avoid_hysteresis.value,
            self.parent.evade_hysteresis.value,
            self.parent.contention_hysteresis.value,
        )

    def tick(self):
        if self.kick_mode == KickMode.DRIBBLE:
            self.dribble_skill.tick(
                kick_foot=self.parent.kick_foot,
                kick_target=self.parent.kick_target,
                kick_hard=self.parent.kick_hard,
                heading_error=self.parent.heading_error,
            )

            self.complete = self.dribble_skill.complete

        elif self.kick_mode == KickMode.KICK:
            self.kick_skill.tick(self.parent.kick_target)
            self.complete = self.kick_skill.isFinished
            # If we're not kicking yet and we need to avoid instead, stop now.
            if (
                not self.kick_skill.isKicking
                and self.parent.avoid
                and self.parent.kick_mode == KickMode.TURN_DRIBBLE
                and not self.parent.isGoalie
            ):
                self.complete = True

        elif self.kick_mode == KickMode.TURN_DRIBBLE:
            self.turn_dribble_skill.tick()
            self.complete = self.turn_dribble_skill.isFinished or not self.parent.avoid
            if self.complete:
                self.parent.avoid = False
                self.parent.avoid_hysteresis.reset()

        self.parent.kickComplete = self.complete
        self.world.b_request.actions.leds.leftEye = Constants.LEDColour.red

    def transition(self):
        if self.complete:
            # finished shooting, chasing ball.
            return ApproachBallState(self.parent, chasing=True)

        return self
