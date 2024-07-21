from BehaviourTask import BehaviourTask
from head.HeadTrackBallPenaltyGoalie import HeadTrackBallPenaltyGoalie
from head.HeadDown import HeadDown
from util.Global import ballLostTime


class HeadPenaltyGoalie(BehaviourTask):
    def _initialise_sub_tasks(self):
        self._sub_tasks = {"TrackBall": HeadTrackBallPenaltyGoalie(self), "Down": HeadDown(self)}

    def _reset(self):
        self._current_sub_task = "Down"

    def _transition(self):
        if ballLostTime() < 3.0:
            self._current_sub_task = "TrackBall"
        else:
            self._current_sub_task = "Down"
