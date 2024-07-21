from BehaviourTask import BehaviourTask
from util.FieldGeometry import calculateTimeToReachBall, isInOurGoalBox
from body.skills.GoalieStaticCover import GoalieStaticCover
from body.skills.GoalieDynamicCover import GoalieDynamicCover
from body.skills.GoalieSpecialCover import GoalieSpecialCover
from body.skills.Ready import Ready
from body.skills.Stand import Stand
from body.skills.Dive import Dive
from body.skills.Boot import Boot
from body.skills.Shoot import Shoot
from body.skills.LookForBallAfterDive import LookForBallAfterDive
from util.Global import teamBallWorldPos, ballWorldPos, ballLostTime, egoBallWorldVel, myPos, myHeading
from util.DeadZoneHysteresis import DeadZoneHysteresis
from util.GameStatus import (
    in_ready,
    in_set,
    in_goal_kick,
    in_pushing_free_kick,
    we_are_kicking_team,
    in_kick_in,
    in_corner_kick,
    secondary_time,
)
from util.BallMovement import timeToReachCoronalPlaneWithFriction, egoBallStopWorldPos, egoBallYWhenReachOurGoalBaseLine
from util.Constants import GOAL_POST_ABS_X, GOAL_POST_ABS_Y, LEDColour
from util.TeamStatus import get_active_player_numbers, my_player_number, pose_of_player_number
from util.FieldGeometry import closest_our_goal_point, OUR_GOAL_BEHIND_CENTRE
from util import LedOverride
from robot import ActionType
from util.Timer import Timer
from util.Global import numBallsSeenInLastXFrames

DEBUGGING_DIVE = False  # enable to see why goalie didn't dive

# Upper and Lower limit of ball world pos x to do dynamic cover
DYNAMIC_COVER_BALL_X_LOWER = -3500  # mm
DYNAMIC_COVER_BALL_X_UPPER = -2500  # mm

# Look at the direction we dived in for some time, to look
# for the ball before facing back forwards. 10 seconds
# includes the dive and getup time
SECONDS_TO_LOOK_FOR_BALL_AFTER_DIVE = 10  # seconds


class Goalie(BehaviourTask):

    """
    Description:

    NOTE:
    - Goalie can estimate ball velocity more accurately when crouching and
      standing.
    - DynamicCover allows the robot to be near the ball if it decides to boot.
    """

    # Threshold in global coordinates for robot to dive
    DIVE_THRESH_ABS_Y = GOAL_POST_ABS_Y + 100
    DIVE_THRESH_ABS_X = -GOAL_POST_ABS_X + 100

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "StaticCover": GoalieStaticCover(self),
            "DynamicCover": GoalieDynamicCover(self),
            "Ready": Ready(self),
            "Set": Stand(self),
            "Dive": Dive(self),
            "Boot": Boot(self),
            "Shoot": Shoot(self),
            "LookForBallAfterDive": LookForBallAfterDive(self),
            "SpecialCover": GoalieSpecialCover(self),
        }

    def _reset(self):
        self._current_sub_task = "StaticCover"

        self._dc_ball_x_far_dzh = DeadZoneHysteresis(DYNAMIC_COVER_BALL_X_LOWER, DYNAMIC_COVER_BALL_X_UPPER)

        self._timer_since_last_dive = None
        self._dived_left_last = None

    def _transition(self):
        if in_ready():
            self._current_sub_task = "Ready"
        elif in_set():
            self._current_sub_task = "Set"
        elif self._should_shoot():
            self._current_sub_task = "Shoot"
        elif self._should_look_for_ball_after_dive():
            self._current_sub_task = "LookForBallAfterDive"
        elif self._should_dive():
            self._current_sub_task = "Dive"
        elif self._should_boot():
            self._current_sub_task = "Boot"
        elif self._should_special_cover():
            self._current_sub_task = "SpecialCover"
        elif self._should_dynamic_cover():
            self._current_sub_task = "DynamicCover"
        else:
            self._current_sub_task = "StaticCover"

    def _tick(self):
        if self._current_sub_task in ("Shoot", "Boot"):
            self.world.b_request.behaviourSharedData.playingBall = True
            LedOverride.override(LedOverride.leftEye, LEDColour.red)
        else:
            LedOverride.override(LedOverride.leftEye, LEDColour.off)

        if self._current_sub_task == "LookForBallAfterDive":
            self._tick_sub_task(dived_left=self._dived_left_last)
        else:
            self._tick_sub_task()

        # Update flag and time about which way we dived last
        if self.world.b_request.actions.body.actionType == ActionType.GOALIE_DIVE_LEFT:
            self._dived_left_last = True
            self._timer_since_last_dive = Timer()
        if self.world.b_request.actions.body.actionType == ActionType.GOALIE_DIVE_RIGHT:
            self._dived_left_last = False
            self._timer_since_last_dive = Timer()
        if self.world.b_request.actions.body.actionType == ActionType.GOALIE_CENTRE:
            self._dived_left_last = None
            self._timer_since_last_dive = Timer()

    def _should_dynamic_cover(self):
        # If we're in our free kick, return False
        if (in_goal_kick() or in_pushing_free_kick() or in_kick_in() or in_corner_kick()) and we_are_kicking_team():
            return False

        # If ball x is large, dont dynamic cover
        ball_far = self._dc_ball_x_far_dzh.evaluate(ballWorldPos().x)
        if ball_far:
            return False

        # If i have not seen the ball recently, dont dynamic cover
        if ballLostTime() > 2.0:
            return False

        return True

    def _should_dive(self):
        # If we're in our free kick, return False
        if (in_goal_kick() or in_pushing_free_kick() or in_kick_in() or in_corner_kick()) and we_are_kicking_team():
            return False

        period = timeToReachCoronalPlaneWithFriction()

        # If ball is not going to reach me in two seconds, don't dive
        if period > 2.0:
            if DEBUGGING_DIVE:
                print("period>2.0")
            return False

        # If i haven't seen the ball recently, don't dive
        if ballLostTime() > 0.5:
            if DEBUGGING_DIVE:
                print("ballLostTime() > 0.5")
            return False

        # If ball is moving in positive x direction, don't dive
        if egoBallWorldVel().x > 0:
            if DEBUGGING_DIVE:
                print("egoBallWorldVel().x > 0")
            return False

        # If ball is not going to end up behind goal base line don't dive
        if egoBallStopWorldPos().x > self.DIVE_THRESH_ABS_X:
            if DEBUGGING_DIVE:
                print("egoBallStopWorldPos().x > self.DIVE_THRESH_ABS_X")
            return False

        # If ball reaching our goal base line outside the goal don't dive
        if abs(egoBallYWhenReachOurGoalBaseLine()) > self.DIVE_THRESH_ABS_Y:
            if DEBUGGING_DIVE:
                print("abs(egoBallYWhenReachOurGoalBaseLine()) > self.DIVE_THRESH_ABS_Y")  # noqa
            return False

        # If we haven't seen at least 4 frames of the ball in the last 45 frames, don't dive  # noqa
        if numBallsSeenInLastXFrames(30) < 4:
            return False

        return True

    def _should_boot(self):
        """
        Whether or not goalie should boot the ball
        """

        # If we're in free kick, return False
        if in_goal_kick() or in_pushing_free_kick() or in_kick_in() or in_corner_kick():
            return False

        # If I haven't seen the ball recently, return False
        if ballLostTime() > 1.0:
            return False

        for player in get_active_player_numbers():
            # If its me, ignore it.
            if player is my_player_number():
                continue

            # If we're in boot, and another player is almost or more
            # closer to the ball than I am, return False
            pos, head = pose_of_player_number(player)

            if (
                pos.distanceTo(OUR_GOAL_BEHIND_CENTRE) + 500 > myPos().distanceTo(OUR_GOAL_BEHIND_CENTRE)
                and calculateTimeToReachBall(pos, head) < calculateTimeToReachBall(myPos(), myHeading()) + 1
            ):
                return False

        if self._current_sub_task == "Boot":
            if (
                closest_our_goal_point().distanceTo(ballWorldPos()) > 1800
                or abs(ballWorldPos().y) > GOAL_POST_ABS_Y + 1800
                or ballWorldPos().x < -GOAL_POST_ABS_X - 150
            ):
                return False

        if self._current_sub_task != "Boot":
            if abs(ballWorldPos().y) > GOAL_POST_ABS_Y + 500:
                return False

            if closest_our_goal_point().distanceTo(ballWorldPos()) > 1000:
                return False

        return True

    def _should_shoot(self):
        # If we're in our goal or pushing free kick, consider shooting
        if (in_goal_kick() or in_pushing_free_kick()) and we_are_kicking_team():
            # Let someone else take the kick if we have more than 15 seconds
            if secondary_time() > 15:
                return False

            for player_number in get_active_player_numbers():
                # If its me, ignore it.
                if player_number is my_player_number():
                    continue

                pos, head = pose_of_player_number(player_number)
                if calculateTimeToReachBall(pos, head) < calculateTimeToReachBall(myPos(), myHeading()) + 2:
                    # If another robot is up to only 2 seconds further to the
                    # ball, let them take it
                    return False

            # Otherwise, I should shoot the ball!
            return True

        return False

    def _should_look_for_ball_after_dive(self):
        # If we've dived recently, and haven't seen the ball, we should face
        # in the direction we saw the ball last
        if (
            self._timer_since_last_dive is not None
            and (self._timer_since_last_dive.elapsed() < SECONDS_TO_LOOK_FOR_BALL_AFTER_DIVE * 1000000)
            and ballLostTime() > 3.0
            and self._dived_left_last is not None
        ):
            return True

        return False

    def _should_special_cover(self):
        if (
            ballLostTime() > 1.5
            and isInOurGoalBox(teamBallWorldPos(), 200, 200)
            and teamBallWorldPos().x < myPos().x + 200
            and isInOurGoalBox(myPos())
        ):
            return True
        return False
