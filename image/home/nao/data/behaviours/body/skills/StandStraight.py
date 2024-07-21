from BehaviourTask import BehaviourTask
from util.actioncommand import standStraight


class StandStraight(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = standStraight()
