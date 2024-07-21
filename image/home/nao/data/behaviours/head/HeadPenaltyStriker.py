from BehaviourTask import BehaviourTask
from head.HeadTrackBall import HeadTrackBall
from head.HeadPenaltyStrikerLocalise import HeadPenaltyStrikerLocalise
from util.Global import ballLostTime, ballDistance


class HeadPenaltyStriker(BehaviourTask):
    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Localise": HeadPenaltyStrikerLocalise(self), "TrackBall": HeadTrackBall(self)}

    def _reset(self):
        self._current_sub_task = "Localise"

    def _transition(self):
        # If we're near the ball and have not lost the ball, track it
        if ballDistance() < 330 and ballLostTime() < 1.5:
            self._current_sub_task = "TrackBall"
        else:
            self._current_sub_task = "Localise"
