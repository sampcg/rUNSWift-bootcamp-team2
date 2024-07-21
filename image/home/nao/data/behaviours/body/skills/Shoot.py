import math
import random
import sys
from robot import Foot, say
from math import radians
from util.Global import ballWorldPos, robotObstaclesList, myPos, myHeading
from util.Global import myPosUncertainty, myHeadingUncertainty, myPoseHypothesesCount

from util.Sonar import hasNearbySonarObject
from BehaviourTask import BehaviourTask
from util.Hysteresis import Hysteresis
from body.skills.ApproachBall import ApproachBall
from body.skills.Kick import Kick
from body.skills.Dribble import Dribble
from util.Vector2D import Vector2D
from util.FieldGeometry import (
    angleToPoint,
    ball_in_front_of_enemy_goal,
    ENEMY_GOAL_BEHIND_CENTER,
    ENEMY_GOAL_OUTER_RIGHT,
    ENEMY_GOAL_INNER_RIGHT,
    ENEMY_GOAL_OUTER_LEFT,
    ENEMY_GOAL_INNER_LEFT,
    ENEMY_LEFT_POST,
    ENEMY_RIGHT_POST,
)
from util.Constants import FIELD_LENGTH, HALF_FIELD_WIDTH
from util.GameStatus import in_goal_kick, in_pushing_free_kick, in_corner_kick, in_kick_in
from util.MathUtil import angleDiff, normalisedTheta, clamp
from util.DeadZoneHysteresis import DeadZoneHysteresis

# Corner calculation constants
OUTER_X = FIELD_LENGTH / 2 - 70
INNER_X = FIELD_LENGTH / 2 - 170
OUTER_RIGHT = Vector2D(OUTER_X, ENEMY_GOAL_OUTER_RIGHT.y - 50)
INNER_RIGHT = Vector2D(INNER_X, ENEMY_GOAL_INNER_RIGHT.y)
OUTER_LEFT = Vector2D(OUTER_X, ENEMY_GOAL_OUTER_LEFT.y + 50)
INNER_LEFT = Vector2D(INNER_X, ENEMY_GOAL_INNER_LEFT.y)

VISION_ROBOT_HYSTERESIS_THRESHOLD = 35

# Upper and Lower limit of ball distance to post to dribble around goal
# dribble into opponent goal
DIST_TO_POST_HYST_LOWER = 250  # mm
DIST_TO_POST_HYST_UPPER = 400  # mm

LINEUP_DISTANCE_DRIBBLE = 40  # mm
LINEUP_DISTANCE_KICK = 100  # mm

ROBOT_DETECTION_MIN_DISTANCE = 1500  # mm

NEAR_FIELD_EDGE_X = 3000  # mm
NEAR_FIELD_EDGE_Y = 2700  # mm


class GoalDistance(object):
    NEAR_GOAL, KICK_RANGE, FAR = range(3)


class Shoot(BehaviourTask):
    """
    Go to the ball and shoot
    """

    POS_UNCERTAINTY = 700 * 700
    HEADING_UNCERTAINTY = radians(25)
    NUM_POSE_HYPOTHESES = 1
    USE_PATCHED_KICK = True

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"ApproachBall": ApproachBall(self), "Kick": Kick(self), "Dribble": Dribble(self)}

    def _reset(self):
        self._current_sub_task = "ApproachBall"
        self._mode = "Kick"
        self.has_finished_kick = False
        self.in_corner = False
        self._last_foot = Foot.LEFT

        self.leftSonarClearHysteresis = Hysteresis(0, 50)
        self.rightSonarClearHysteresis = Hysteresis(0, 50)
        self.leftSonarClearHysteresis.add(50)
        self.rightSonarClearHysteresis.add(50)

        self.leftVisionRobotClearHysteresis = Hysteresis(0, VISION_ROBOT_HYSTERESIS_THRESHOLD)
        self.rightVisionRobotClearHysteresis = Hysteresis(0, VISION_ROBOT_HYSTERESIS_THRESHOLD)

        self._ball_not_close_to_left_post_hyst = DeadZoneHysteresis(
            DIST_TO_POST_HYST_LOWER, DIST_TO_POST_HYST_UPPER, True
        )
        self._ball_not_close_to_right_post_hyst = DeadZoneHysteresis(
            DIST_TO_POST_HYST_LOWER, DIST_TO_POST_HYST_UPPER, True
        )

    def _transition(self):
        if self._current_sub_task == "ApproachBall":
            self.has_finished_kick = False
            if (
                self._sub_tasks[self._current_sub_task].close
                and self._sub_tasks[self._current_sub_task].position_aligned
                and self._sub_tasks[self._current_sub_task].heading_aligned  # noqa
            ):
                self._current_sub_task = self._mode

        elif self._current_sub_task == "Kick":
            if self._sub_tasks[self._current_sub_task].is_finished:
                self._current_sub_task = "ApproachBall"
                self.has_finished_kick = True

        elif self._current_sub_task == "Dribble":
            if self._sub_tasks[self._current_sub_task].is_finished:
                self._current_sub_task = "ApproachBall"
                self.has_finished_kick = True

    def _tick(self):
        (
            mode,
            target,
            foot,
            hard,
            heading_error,
            distance_error,
            lineup_distance,
            use_line_up_map,
            dribble_forwards,
            extra_stable,
        ) = self._decide_shoot_parameters()

        self._mode = mode

        # Write some debug info
        debug_info = self.world.b_request.behaviourDebugInfo
        debug_info.haveBallManoeuvreTarget = True
        debug_info.ballManoeuvreTargetX = target.x
        debug_info.ballManoeuvreTargetY = target.y
        debug_info.ballManoeuvreHeadingError = heading_error
        debug_info.ballManoeuvreType = "KICK" if mode == "Kick" else "DRIBBLE"
        debug_info.ballManoeuvreHard = hard

        print(">SHOOT", mode, debug_info.ballManoeuvreType, debug_info.ballManoeuvreHard)
        sys.stdout.flush()
        if self._current_sub_task == "ApproachBall":
            self._tick_sub_task(
                target=target,
                kick_foot=foot,
                heading_error=heading_error,
                distance_error=distance_error,
                lineup_distance=lineup_distance,
                use_line_up_map=use_line_up_map,
            )

        elif self._current_sub_task == "Kick":
            self._tick_sub_task(
                target=target,
                foot=foot,
                hard=hard,
                heading_error=heading_error,
                can_abort=True,
                extra_stable=extra_stable,
            )

        elif self._current_sub_task == "Dribble":
            self._tick_sub_task(dribble_forwards=dribble_forwards, can_abort=True)

    def _decide_shoot_parameters(self):
        # @ijnek: TODO implement logic here

        mode = self._mode

        target = ENEMY_GOAL_BEHIND_CENTER
        foot = Foot.LEFT
        hard = True
        heading_error = radians(10)
        distance_error = 40
        lineup_distance = LINEUP_DISTANCE_KICK
        use_line_up_map = True
        dribble_forwards = True
        extra_stable = False

        self.adjust_hystereses()
        contentionDirection = self.shouldCrossDribble()
        _nearest_robot_obstacles = self.getVisionRobotObstacles()

        ball_near_left_post = not self._ball_not_close_to_left_post_hyst.evaluate(  # noqa
            ballWorldPos().distanceTo(ENEMY_LEFT_POST)
        )

        ball_near_right_post = not self._ball_not_close_to_right_post_hyst.evaluate(  # noqa
            ballWorldPos().distanceTo(ENEMY_RIGHT_POST)
        )

        # in general, want to kick with the left foot if on left side and
        # vice-versa so we cover the in side with our body.
        # set default here then can override below if in specific
        # situation
        if self._last_foot is Foot.LEFT:
            if ballWorldPos().y < -0.05 * HALF_FIELD_WIDTH:
                foot = Foot.RIGHT
            else:
                foot = Foot.LEFT
        elif self._last_foot is Foot.RIGHT:
            if ballWorldPos().y > 0.05 * HALF_FIELD_WIDTH:
                foot = Foot.LEFT
            else:
                foot = Foot.RIGHT

        if in_corner_kick():
            # cross the ball to near near the penalty box
            target = Vector2D(FIELD_LENGTH / 2 - 500, 0)
            mode = "Kick"
            heading_error = radians(10)
            hard = False
            distance_error = 20
            use_line_up_map = True
            extra_stable = True
            print("++in_corner_kick")

        elif in_pushing_free_kick() or in_kick_in() or in_goal_kick():
            # Aim to kick half way between left and right side of goal
            target = ENEMY_GOAL_BEHIND_CENTER
            heading_error = radians(10)
            distance_error = 20
            hard = True
            mode = "Kick"
            foot = Foot.LEFT
            extra_stable = True
            print("++in_pushing_free_kick")

        elif ball_near_left_post:
            # Dribble ball out anti-clockwise around left post with left foot
            mode = "Dribble"
            foot = Foot.LEFT
            post_to_ball = ballWorldPos().minus(ENEMY_LEFT_POST)
            target = Vector2D(1000, 0).rotate(post_to_ball.rotate(radians(120)).heading())  # noqa
            target.add(ballWorldPos())
            heading_error = radians(20)
            distance_error = 50
            use_line_up_map = False
            lineup_distance = LINEUP_DISTANCE_DRIBBLE
            dribble_forwards = True
            print("++ball_near_left_post")

        elif ball_near_right_post:
            # Dribble ball out clockwise around right post with right foot
            mode = "Dribble"
            foot = Foot.RIGHT
            post_to_ball = ballWorldPos().minus(ENEMY_RIGHT_POST)
            target = Vector2D(1000, 0).rotate(post_to_ball.rotate(radians(-120)).heading())  # noqa
            target.add(ballWorldPos())
            heading_error = radians(20)
            distance_error = 50
            use_line_up_map = False
            lineup_distance = LINEUP_DISTANCE_DRIBBLE
            dribble_forwards = True
            print("++ball_near_right_post")

        elif ball_in_front_of_enemy_goal():
            mode = "Dribble"
            distance_error = 100

            # Aim to dribble anywhere between left and right side of goal
            angle_to_left_post = ENEMY_GOAL_INNER_LEFT.minus(ballWorldPos()).heading()
            angle_to_right_post = ENEMY_GOAL_INNER_RIGHT.minus(ballWorldPos()).heading()
            heading_error = angleDiff(angle_to_left_post, angle_to_right_post) / 2

            target_angle = normalisedTheta(angle_to_left_post + angle_to_right_post) / 2
            target = ballWorldPos().plus(Vector2D(1000, 0).rotate(target_angle))

            use_line_up_map = False
            lineup_distance = LINEUP_DISTANCE_DRIBBLE

            # Dribble with closer foot
            if ballWorldPos().minus(myPos()).y > 0:
                foot = Foot.LEFT
            else:
                foot = Foot.RIGHT
            dribble_forwards = True
            print("++ball_in_front_of_enemy_goal")

        elif contentionDirection is not None:
            mode = "Dribble"
            target_heading = clamp(myHeading(), radians(-50), radians(50))
            target = Vector2D(4000, 0).rotate(target_heading).add(ballWorldPos())  # noqa
            heading_error = radians(20)
            distance_error = 150
            use_line_up_map = False
            lineup_distance = LINEUP_DISTANCE_DRIBBLE
            dribble_forwards = False
            print("++contentionDirection is none")

        elif _nearest_robot_obstacles is not None and myPos().x < 2000 and myPos().x > -3000:
            say(_nearest_robot_obstacles + ", robot")
            mode = "Dribble"
            target_heading = clamp(myHeading(), radians(-50), radians(50))
            target = Vector2D(4000, 0).rotate(target_heading).add(ballWorldPos())  # noqa
            heading_error = radians(20)
            distance_error = 150
            use_line_up_map = False
            lineup_distance = LINEUP_DISTANCE_DRIBBLE
            dribble_forwards = False
            print("++_nearest_robot_obstacles is not none")

        elif self.in_corner:  # Corner play.
            # If we're in the corners on either side of the goals, kick back
            # towards near the penalty box
            target = Vector2D(FIELD_LENGTH / 2 - 500, 0)
            if ballWorldPos().distanceTo(target) < 2000:
                mode = "Dribble"
                heading_error = radians(10)
                distance_error = 100
                use_line_up_map = False
                dribble_forwards = True
            else:
                mode = "Kick"
                heading_error = radians(10)
                hard = False
                distance_error = 40
                use_line_up_map = True
            print("++in_corner")

        elif ballWorldPos().distanceTo(ENEMY_GOAL_BEHIND_CENTER) > 4000:
            # Care less if we're far away from goal
            mode = "Kick"
            heading_error = radians(10)
            hard = True
            print("++ENEMY_GOAL_BEHIND_CENTER", self.USE_PATCHED_KICK)

            # if robot is mislocalised, we can't use the global coordinates
            # for the targeting and we rather just kick in a one of the pre-set directions
            if self.USE_PATCHED_KICK and (
                myPosUncertainty() > self.POS_UNCERTAINTY
                or myHeadingUncertainty() > self.HEADING_UNCERTAINTY
                or myPoseHypothesesCount() > self.NUM_POSE_HYPOTHESES
            ):
                c_target_angle = target.minus(ballWorldPos()).heading()
                rand_position = random.randrange(-1, 1)
                print("*+*Going to shoot at random", rand_position)
                best_guess_angle = normalisedTheta(c_target_angle + ((math.pi / 6) * rand_position))
                target = ballWorldPos().plus(Vector2D(1000, 0).rotate(best_guess_angle))
            else:
                print("*+*Going to shoot to target")

        else:
            print("++fallback")
            # Aim to kick half way between left and right side of goal
            angle_to_left_post = ENEMY_GOAL_INNER_LEFT.minus(ballWorldPos()).heading()
            angle_to_right_post = ENEMY_GOAL_INNER_RIGHT.minus(ballWorldPos()).heading()
            heading_error = angleDiff(angle_to_left_post, angle_to_right_post) / 2

            target_angle = normalisedTheta(angle_to_left_post + angle_to_right_post) / 2

            target = ballWorldPos().plus(Vector2D(1000, 0).rotate(target_angle))

            hard = True
            mode = "Kick"

        # back up foot choice
        self._last_foot = foot
        sys.stdout.flush()
        return (
            mode,
            target,
            foot,
            hard,
            heading_error,
            distance_error,
            lineup_distance,
            use_line_up_map,
            dribble_forwards,
            extra_stable,
        )

    def adjust_hystereses(self):
        self.check_corner()

    def check_corner(self):
        # If the ball is outside of the goal post and at a sharp angle,
        # it's in the corner.
        # We add some hysteresis to make sure it's inside the goal post or
        # no longer at a sharp angle before switching out of the corner.
        # We calculate the angle to a point inwards from the goal line to
        # avoid getting stuck next against the post.
        # Note the following diagram is not to scale. Also \ was the sharpest
        # angle I could draw.
        #
        #        -----(GP)---------------(GP)-----
        #             |  |               |  |
        #  CORNER <<  /  / >> !CORNER << \  \  >> CORNER
        #            /  /                 \  \
        #           /  /                   \  \
        #          /  /                     \  \
        ballPos = ballWorldPos()
        if not self.in_corner and (
            angleToPoint(OUTER_RIGHT, ballPos) > radians(65) or angleToPoint(OUTER_LEFT, ballPos) < -radians(65)
        ):
            self.in_corner = True
        elif self.in_corner and (
            angleToPoint(INNER_RIGHT, ballPos) < radians(65) and angleToPoint(INNER_LEFT, ballPos) > -radians(65)
        ):
            self.in_corner = False

    def shouldCrossDribble(self):
        return self.getSonarObstacles()

    def getSonarObstacles(self):
        LEFT, RIGHT = 0, 1
        if hasNearbySonarObject(LEFT):
            self.leftSonarClearHysteresis.reset()
        else:
            self.leftSonarClearHysteresis.up()

        if hasNearbySonarObject(RIGHT):
            self.rightSonarClearHysteresis.reset()
        else:
            self.rightSonarClearHysteresis.up()
        if not self.leftSonarClearHysteresis.is_max():
            return "LEFT"
        if not self.rightSonarClearHysteresis.is_max():
            return "RIGHT"

        return None

    def getVisionRobotObstacles(self):
        _obs_list = robotObstaclesList()
        if len(_obs_list) == 0:
            self.leftVisionRobotClearHysteresis.down()
            self.rightVisionRobotClearHysteresis.down()
        else:
            # allow distance for visual robot detection to work, so we don't
            # overreact on robot detection
            _min_distance = ROBOT_DETECTION_MIN_DISTANCE
            _closest_obs = None
            for obs in _obs_list:
                if abs(obs.pos.x) > NEAR_FIELD_EDGE_X or abs(obs.pos.y) > NEAR_FIELD_EDGE_Y:
                    continue
                if obs.rr.distance < _min_distance:
                    _min_distance = obs.rr.distance
                    _closest_obs = obs
            if _closest_obs is None:
                self.leftVisionRobotClearHysteresis.down()
                self.rightVisionRobotClearHysteresis.down()
            elif _closest_obs.rr.heading > 0:
                self.leftVisionRobotClearHysteresis.add(VISION_ROBOT_HYSTERESIS_THRESHOLD)  # noqa
            else:
                self.rightVisionRobotClearHysteresis.add(VISION_ROBOT_HYSTERESIS_THRESHOLD)  # noqa
        if (
            self.rightVisionRobotClearHysteresis.value > 0
            and self.rightVisionRobotClearHysteresis.value >= self.leftVisionRobotClearHysteresis.value
        ):
            return "RIGHT"
        if self.leftVisionRobotClearHysteresis.value > 0:
            return "LEFT"
        return None
