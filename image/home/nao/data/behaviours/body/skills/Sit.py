from util.actioncommand import sit, crouch
from util.Timer import WallTimer

from BehaviourTask import BehaviourTask


class Sit(BehaviourTask):
    # Crouch for two seconds before trying to sit
    # Lets the walk generator stop gracefully before the sit motion
    def _tick(self):
        if self._timer.finished():
            self.world.b_request.actions.body = sit()
        else:
            self.world.b_request.actions.body = crouch()

    def _reset(self):
        self._timer = WallTimer(2 * 1000 * 1000)
