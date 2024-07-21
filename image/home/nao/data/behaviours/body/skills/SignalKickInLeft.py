from BehaviourTask import BehaviourTask
from util.actioncommand import signalKickInLeft
from robot import say


class SignalKickInLeft(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalKickInLeft()
        say("Kick in blue team")
