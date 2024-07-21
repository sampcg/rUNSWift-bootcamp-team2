from BehaviourTask import BehaviourTask
from util.actioncommand import signalGoalRight
from robot import say


class SignalGoalRight(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalGoalRight()
        say("Goal red team")
