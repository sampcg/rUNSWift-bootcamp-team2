from BehaviourTask import BehaviourTask
from util.actioncommand import signalPushingFreeKickLeft
from robot import say


class SignalPushingFreeKickLeft(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalPushingFreeKickLeft()
        say("Pushing free kick blue team")
