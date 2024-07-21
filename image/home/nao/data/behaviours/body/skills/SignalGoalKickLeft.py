from BehaviourTask import BehaviourTask
from util.actioncommand import signalGoalKickLeft
from robot import say


class SignalGoalKickLeft(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalGoalKickLeft()
        say("Goal kick blue team")
