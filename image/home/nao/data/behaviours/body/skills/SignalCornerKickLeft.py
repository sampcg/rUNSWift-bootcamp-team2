from BehaviourTask import BehaviourTask
from util.actioncommand import signalCornerKickLeft
from robot import say


class SignalCornerKickLeft(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalCornerKickLeft()
        say("Corner kick blue team")
