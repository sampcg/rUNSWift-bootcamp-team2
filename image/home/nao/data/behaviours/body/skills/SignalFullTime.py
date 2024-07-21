from BehaviourTask import BehaviourTask
from util.actioncommand import signalFullTime
from robot import say


class SignalFullTime(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = signalFullTime()
        say("Full time")
