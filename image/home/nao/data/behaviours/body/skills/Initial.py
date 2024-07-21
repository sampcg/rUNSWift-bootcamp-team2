from util.actioncommand import initial

from BehaviourTask import BehaviourTask


class Initial(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = initial()
