from util.Global import myHeading, myPos
from BehaviourTask import BehaviourTask
from body.skills.WalkStraightToPose import WalkStraightToPose
from body.skills.Crouch import Crouch
from math import radians
from util.MathUtil import angleDiff

# Heading to face when we dived left / right
HEADING_LEFT = radians(100)
HEADING_RIGHT = radians(-100)

HEADING_ERROR = radians(20)


class LookForBallAfterDive(BehaviourTask):
    """
    Turn to face the ball, and crouch
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"WalkStraightToPose": WalkStraightToPose(self), "Crouch": Crouch(self)}

    def _reset(self):
        self._current_sub_task = "WalkStraightToPose"
        self.heading_to_face = 0

    def _transition(self):
        if angleDiff(myHeading(), self.heading_to_face) > HEADING_ERROR:
            self._current_sub_task = "WalkStraightToPose"
        else:
            self._current_sub_task = "Crouch"

    def _tick(self, dived_left=True):
        self.heading_to_face = HEADING_LEFT if dived_left else HEADING_RIGHT

        if self._current_sub_task == "WalkStraightToPose":
            self._tick_sub_task(final_pos=myPos(), final_heading=self.heading_to_face)
        else:
            self._tick_sub_task()
