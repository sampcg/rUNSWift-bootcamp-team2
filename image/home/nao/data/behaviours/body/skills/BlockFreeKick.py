from util.Global import myPos, myHeading, ballRelVel
from body.skills.BlockIntercept import BlockIntercept
from BehaviourTask import BehaviourTask
from body.skills.WalkToPoint import WalkToPoint
from body.skills.CircleToPose import CircleToPose
from util.Vector2D import Vector2D
from util.ObstacleAvoidance import calculate_tangent_point
from util.MathUtil import angleDiff
from math import radians


class BlockFreeKick(BehaviourTask):

    """
    Description:
    A skill associated with blocking the opponent's free kick, given
    - Ball global position (Vector2D(mm, mm))
    - Blocking global position (Vector2D(mm, mm))
    - Blocking global heading (rad)
    """

    CLOSE_POS = 100  # mm
    NOT_CLOSE_POS = 200  # mm
    CLOSE_HEADING = radians(8)  # rad
    NOT_CLOSE_HEADING = radians(15)  # rad

    RADIUS_OFFSET_TO_CIRCLE = 100  # mm
    RADIUS_OFFSET_TO_NOT_CIRCLE = 400  # mm

    BALL_MOVING_SPEED_THRESH = 200  # mm /s

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "BlockIntercept": BlockIntercept(self),
            "StraightToBlockPos": WalkToPoint(self),
            "WalkToTangent": WalkToPoint(self),
            "CircleToPose": CircleToPose(self),
        }

    def _reset(self):
        self._current_sub_task = "StraightToBlockPos"
        self._ball_pos = Vector2D(0, 0)
        self._blocking_pos = Vector2D(-1000, 0)
        self._blocking_heading = 0
        self._stay_away_distance = self._ball_pos.minus(self._blocking_pos).length()

    def _transition(self):
        if self._should_block_intercept():
            self._current_sub_task = "BlockIntercept"
        elif self._should_circle_to_pose():
            self._current_sub_task = "CircleToPose"
        elif self._should_walk_straight_to_block_pos():
            self._current_sub_task = "StraightToBlockPos"
        else:
            self._current_sub_task = "WalkToTangent"

    def _tick(self, ball_position=Vector2D(0, 0), blocking_position=Vector2D(-1000, 0), blocking_heading=radians(0)):
        self._ball_pos = ball_position
        self._blocking_pos = blocking_position
        self._blocking_heading = blocking_heading
        self._stay_away_distance = self._ball_pos.minus(self._blocking_pos).length()

        if self._current_sub_task == "StraightToBlockPos":
            self._tick_sub_task(self._blocking_pos, speed=1.0)
        elif self._current_sub_task == "WalkToTangent":
            tangent_point_1 = calculate_tangent_point(self._ball_pos, self._stay_away_distance, True)
            tangent_point_2 = calculate_tangent_point(self._ball_pos, self._stay_away_distance, False)

            if tangent_point_1 is not None and tangent_point_2 is not None:
                tp1_to_block_pos = tangent_point_1.minus(self._blocking_pos)
                tp2_to_block_pos = tangent_point_2.minus(self._blocking_pos)
                chosen_tp = (
                    tangent_point_1 if (tp1_to_block_pos.length() < tp2_to_block_pos.length()) else tangent_point_2
                )  # noqa

                self._tick_sub_task(chosen_tp, speed=1.0)
            else:
                # safety measure, incase tangent is None
                self._tick_sub_task(myPos())
        elif self._current_sub_task == "CircleToPose":
            self._tick_sub_task(
                final_position=self._blocking_pos,
                final_heading=self._blocking_heading,
                circle_centre=self._ball_pos,
                speed=1.0,
            )
        else:
            self._tick_sub_task()

    def _pos_error(self):
        return self._blocking_pos.minus(myPos()).length()

    def _heading_error(self):
        return angleDiff(self._blocking_heading, myHeading())

    def _should_block_intercept(self):
        if self._current_sub_task == "BlockIntercept":
            # if the ball is moving, we should be ready to block-intercept
            if ballRelVel().length() > self.BALL_MOVING_SPEED_THRESH:
                return True

            # if ball is stationary and we're in the wrong position,
            # we should adjust
            if self._heading_error() < self.NOT_CLOSE_HEADING and self._pos_error() < self.NOT_CLOSE_POS:
                return True

        if self._current_sub_task != "BlockIntercept":
            if self._heading_error() < self.CLOSE_HEADING and self._pos_error() < self.CLOSE_POS:
                return True
        return False

    def _should_walk_straight_to_block_pos(self):
        # This condition checks if the robot is anywhere behind blocking pos,
        # with "forwards" being the direction from blocking pos towards ball.
        # This means we can walk straight (unobstructed) to the block pos.
        blocking_pos_to_ball_pos = self._ball_pos.minus(self._blocking_pos)
        my_pos_to_blocking_pos = self._blocking_pos.minus(myPos())

        return angleDiff(blocking_pos_to_ball_pos.heading(), my_pos_to_blocking_pos.heading()) < radians(90)  # noqa

    def _should_circle_to_pose(self):
        dist_to_ball = self._distance_to_ball_belief()
        if self._current_sub_task == "CircleToPose":
            if dist_to_ball < self._stay_away_distance + self.RADIUS_OFFSET_TO_NOT_CIRCLE:  # noqa
                return True
        if self._current_sub_task != "CircleToPose":
            if dist_to_ball < self._stay_away_distance + self.RADIUS_OFFSET_TO_CIRCLE:  # noqa
                return True
        return False

    def _distance_to_ball_belief(self):
        return self._ball_pos.minus(myPos()).length()
