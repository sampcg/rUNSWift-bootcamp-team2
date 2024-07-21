from util.actioncommand import stand

from BehaviourTask import BehaviourTask


class Stand(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = stand()
