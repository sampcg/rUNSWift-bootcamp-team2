from util.actioncommand import stand

from BehaviourTask import BehaviourTask
from util.Timer import Timer


class AdaptiveScan(BehaviourTask):
    SCAN_PERIOD_SECONDS = 4

    def _reset(self):
        self._is_finished = False
        self._timer = Timer(self.SCAN_PERIOD_SECONDS * 1000000)

    def _tick(self):
        # print(self._is_finished)
        if self._timer.finished():
            self._is_finished = True
        self.world.b_request.actions.body = stand()
