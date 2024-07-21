from BehaviourTask import BehaviourTask
from util.actioncommand import signalGoalKickRight
from robot import say


class SignalGoalKickRight(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalGoalKickRight()
        say("Goal kick red team")
