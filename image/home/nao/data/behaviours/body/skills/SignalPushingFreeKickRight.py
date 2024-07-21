from BehaviourTask import BehaviourTask
from util.actioncommand import signalPushingFreeKickRight
from robot import say


class SignalPushingFreeKickRight(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalPushingFreeKickRight()
        say("Pushing free kick red team")
