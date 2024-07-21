from BehaviourTask import BehaviourTask
from body.skills.WalkToPoint import WalkToPoint
from body.skills.WalkStraightAndTurn import WalkStraightAndTurn
from math import radians
from util.Global import myPos, myHeading, getCurrentSkill
from util.Vector2D import Vector2D
from util.MathUtil import normalisedTheta


class WalkStraightToPose(BehaviourTask):

    """
    Description:
    A skill associated with walking to a global pose (position
    and heading) on the field.
    1. Robot walks to the point
    2. Robot keeps walking towards the point, while changing its heading
    """

    CLOSE_DISTANCE = 500
    NOT_CLOSE_DISTANCE = 700

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"WalkToPoint": WalkToPoint(self), "WalkStraightAndTurn": WalkStraightAndTurn(self)}

    def _reset(self):
        self._current_sub_task = "WalkToPoint"
        self._final_pos = Vector2D(0, 0)
        self._final_heading = radians(0)
        self._should_stay_in_own_half = getCurrentSkill() == "OneVsOne"

    def _transition(self):
        if self._should_walk_straight_and_turn():
            self._current_sub_task = "WalkStraightAndTurn"
        else:
            self._current_sub_task = "WalkToPoint"

    def _tick(self, final_pos=Vector2D(0, 0), final_heading=radians(0), speed=1):
        self._final_pos = final_pos
        self._final_heading = final_heading

        if self._should_stay_in_own_half and self._final_pos.x > -50:
            print("WARNING - trying to walk onto the other side of the field")
            self._final_pos = Vector2D(-50, self._final_pos.y)

        if self._current_sub_task == "WalkToPoint":
            self._tick_sub_task(final_pos=self._final_pos, speed=speed)
        elif self._current_sub_task == "WalkStraightAndTurn":
            clockwise_turn = normalisedTheta(self._final_heading - myHeading()) < 0

            self._tick_sub_task(
                final_position=self._final_pos, final_heading=self._final_heading, clockwise=clockwise_turn, speed=speed
            )

    def _should_walk_straight_and_turn(self):
        if self._current_sub_task == "WalkStraightAndTurn":
            if self._final_pos.minus(myPos()).length() < self.NOT_CLOSE_DISTANCE:  # noqa
                return True
        else:
            if self._final_pos.minus(myPos()).length() < self.CLOSE_DISTANCE:
                return True
        return False
