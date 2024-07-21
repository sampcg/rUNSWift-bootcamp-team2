from BehaviourTask import BehaviourTask
from util.actioncommand import head
from math import radians
from util.Global import ballHeading


class HeadTrackBallPenaltyGoalie(BehaviourTask):
    PITCH = radians(30)

    def _tick(self):
        self.world.b_request.actions.head = head(ballHeading(), self.PITCH, False, 0.50, 0.2)
