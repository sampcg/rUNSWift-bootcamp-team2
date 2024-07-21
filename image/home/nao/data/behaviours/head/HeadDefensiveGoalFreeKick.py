from BehaviourTask import BehaviourTask
from head.HeadScanOpponentGoalFreeKickPositions import HeadScanOpponentGoalFreeKickPositions
from head.HeadTrackBall import HeadTrackBall
from util.Global import ballLostTime


class HeadDefensiveGoalFreeKick(BehaviourTask):

    """
    Description:
    A headskill associated with defending the opponent's goal free kick.
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "ScanFreeKickPositions": HeadScanOpponentGoalFreeKickPositions(self),  # noqa
            "TrackBall": HeadTrackBall(self),
        }

    def _reset(self):
        self._current_sub_task = "ScanFreeKickPositions"

    def _transition(self):
        if ballLostTime() < 3.0:
            self._current_sub_task = "TrackBall"
        else:
            self._current_sub_task = "ScanFreeKickPositions"
