from BehaviourTask import BehaviourTask
from util.actioncommand import turnDribble
import robot


class TurnDribble(BehaviourTask):

    """
    Description:
    trying out turn dribble
    """

    def _tick(self, turn=0, foot=robot.Foot.LEFT):
        self.world.b_request.actions.body = turnDribble(turn=turn, foot=foot)
