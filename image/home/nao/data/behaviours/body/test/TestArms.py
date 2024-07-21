from BehaviourTask import BehaviourTask
from util.actioncommand import testArms


class TestArms(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = testArms()
