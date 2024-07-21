from util.actioncommand import goalieStand

from BehaviourTask import BehaviourTask


class GoalieStand(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = goalieStand()
