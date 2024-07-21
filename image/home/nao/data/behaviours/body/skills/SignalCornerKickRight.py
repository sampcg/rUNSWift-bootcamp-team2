from BehaviourTask import BehaviourTask
from util.actioncommand import signalCornerKickRight
from robot import say


class SignalCornerKickRight(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalCornerKickRight()
        say("Corner kick red team")
