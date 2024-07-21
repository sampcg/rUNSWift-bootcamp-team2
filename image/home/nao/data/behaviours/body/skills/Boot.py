from BehaviourTask import BehaviourTask
from body.skills.ApproachBall import ApproachBall
from body.skills.Kick import Kick
from body.skills.Dribble import Dribble
from util.Vector2D import Vector2D
from math import radians
from util.Global import ballWorldPos, myHeading, ballHeading
from util.BodyGeometry import toePos
from util.MathUtil import clamp
from util.DeadZoneHysteresis import DeadZoneHysteresis
from util.FieldGeometry import OUR_LEFT_POST, OUR_RIGHT_POST
from robot import Foot
from util.Constants import HALF_FIELD_WIDTH

LINEUP_DISTANCE_DRIBBLE = 40  # mm
LINEUP_DISTANCE_KICK = 100  # mm


class Boot(BehaviourTask):
    # Upper and Lower limit of ball distance to post to do circular
    # clearing away from goal
    DIST_TO_POST_HYST_LOWER = 250  # mm
    DIST_TO_POST_HYST_UPPER = 400  # mm

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"ApproachBall": ApproachBall(self), "Kick": Kick(self), "Dribble": Dribble(self)}

    def _reset(self):
        self._current_sub_task = "ApproachBall"
        self._mode = "Kick"
        self.has_finished_kick = False
        self._last_foot = Foot.LEFT
        self._ball_not_close_to_left_post_hyst = DeadZoneHysteresis(
            self.DIST_TO_POST_HYST_LOWER, self.DIST_TO_POST_HYST_UPPER, True
        )
        self._ball_not_close_to_right_post_hyst = DeadZoneHysteresis(
            self.DIST_TO_POST_HYST_LOWER, self.DIST_TO_POST_HYST_UPPER, True
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
            use_line_up_map,
            lineup_distance,
        ) = self._decide_boot_parameters()

        self._mode = mode

        # Write some debug info
        debug_info = self.world.b_request.behaviourDebugInfo
        debug_info.haveBallManoeuvreTarget = True
        debug_info.ballManoeuvreTargetX = target.x
        debug_info.ballManoeuvreTargetY = target.y
        debug_info.ballManoeuvreHeadingError = heading_error
        debug_info.ballManoeuvreType = "KICK" if mode == "Kick" else "DRIBBLE"
        debug_info.ballManoeuvreHard = hard

        if self._current_sub_task == "ApproachBall":
            self._tick_sub_task(
                target=target,
                kick_foot=foot,
                lineup_distance=lineup_distance,
                distance_error=distance_error,
                heading_error=heading_error,
                use_line_up_map=use_line_up_map,
            )

        elif self._current_sub_task == "Kick":
            self._tick_sub_task(target=target, foot=foot, hard=hard, heading_error=heading_error, can_abort=True)

        elif self._current_sub_task == "Dribble":
            self._tick_sub_task(dribble_forwards=False, can_abort=True)

    def _decide_boot_parameters(self):
        ball_near_left_post = not self._ball_not_close_to_left_post_hyst.evaluate(  # noqa
            ballWorldPos().distanceTo(OUR_LEFT_POST)
        )

        ball_near_right_post = not self._ball_not_close_to_right_post_hyst.evaluate(  # noqa
            ballWorldPos().distanceTo(OUR_RIGHT_POST)
        )

        hard = True

        if ball_near_left_post:
            # Dribble ball out anti-clockwise around left post with left foot
            mode = "Dribble"
            foot = Foot.LEFT
            post_to_ball = ballWorldPos().minus(OUR_LEFT_POST)
            target = Vector2D(1000, 0).rotate(post_to_ball.rotate(radians(120)).heading())  # noqa
            target.add(ballWorldPos())
            heading_error = radians(20)
            distance_error = 100
            use_line_up_map = False
            lineup_distance = LINEUP_DISTANCE_DRIBBLE

        elif ball_near_right_post:
            # Dribble ball out clockwise around right post with right foot
            mode = "Dribble"
            foot = Foot.RIGHT
            post_to_ball = ballWorldPos().minus(OUR_RIGHT_POST)
            target = Vector2D(1000, 0).rotate(post_to_ball.rotate(radians(-120)).heading())  # noqa
            target.add(ballWorldPos())
            heading_error = radians(20)
            distance_error = 100
            use_line_up_map = False
            lineup_distance = LINEUP_DISTANCE_DRIBBLE

        else:
            # Kick in an outwards direction between heading -70 and 70
            mode = "Kick"

            # Kick using outside foot to help cover the goal mor
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
            self._last_foot = foot

            # If we're directly infront of the goal, then we just want to kick (forward-ish) as quickly
            # as possible, dont care about direction.
            min_angle = -70
            max_angle = 70

            # If we're just near goal, but not in front then we don't want to kick ball in front of goal
            if ballWorldPos().y > OUR_LEFT_POST.y / 2:
                min_angle = 20
            elif ballWorldPos().y < OUR_RIGHT_POST.y / 2:
                max_angle = -20

            # If we're facing the ball, kick in the direction we're facing.
            if abs(ballHeading()) < radians(20):
                target_heading = clamp(myHeading(), radians(min_angle), radians(max_angle))
            # If we're not facing the ball, kick in direction of ball
            # from the foot we want to kick with
            else:
                target_heading = clamp(
                    ballWorldPos().minus(toePos(foot)).heading(), radians(min_angle), radians(max_angle)
                )
            target = Vector2D(4000, 0).rotate(target_heading).add(ballWorldPos())
            hard = True
            distance_error = 40
            heading_error = radians(20)
            use_line_up_map = True
            lineup_distance = LINEUP_DISTANCE_KICK

        return (mode, target, foot, hard, heading_error, distance_error, use_line_up_map, lineup_distance)
