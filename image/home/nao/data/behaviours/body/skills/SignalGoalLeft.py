from BehaviourTask import BehaviourTask
from util.actioncommand import signalGoalLeft
from robot import say


class SignalGoalLeft(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalGoalLeft()
        say("Goal blue team")
