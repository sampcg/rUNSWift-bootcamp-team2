from BehaviourTask import BehaviourTask
from util.actioncommand import goalieDiveLeft, goalieStand


class TestDive(BehaviourTask):
    counter = 0

    def _tick(self):
        self.counter += 1
        if self.counter % 500 == 0:
            self.world.b_request.actions.body = goalieDiveLeft()
        else:
            self.world.b_request.actions.body = goalieStand()
