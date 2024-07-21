from BehaviourTask import BehaviourTask
from util.actioncommand import signalKickInRight
from robot import say


class SignalKickInRight(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalKickInRight()
        say("Kick in red team")
