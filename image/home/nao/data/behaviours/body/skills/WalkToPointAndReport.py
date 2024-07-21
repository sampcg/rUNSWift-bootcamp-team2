from BehaviourTask import BehaviourTask

from body.skills.WalkToPoint import WalkToPoint
from body.skills.ReportFinishedWalking import ReportFinishedWalking
from util.Vector2D import Vector2D
from util.Global import myPos


class WalkToPointAndReport(BehaviourTask):
    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "Walk": WalkToPoint(self),
            "Report": ReportFinishedWalking(self),
        }

    def _reset(self):
        self._current_sub_task = "Walk"
        self._dist_to_destination = 3000  # Arbitrary distance greater than 50
        self.is_finished = False

    def _transition(self):
        if self._current_sub_task == "Walk" and self._dist_to_destination < 50:
            self._current_sub_task = "Report"

    def _tick(self, destination=Vector2D(0, 0)):
        self._dist_to_destination = destination.distanceTo(myPos())
        if self._current_sub_task == "Walk":
            self._tick_sub_task(final_pos=destination)
        else:
            self._tick_sub_task()
            self.is_finished = self._sub_tasks[self._current_sub_task].is_finished
