from util.Vector2D import Vector2D
from body.skills.Walk import Walk
from BehaviourTask import BehaviourTask
from util import Global


class PenaltyStrikerLineUp(BehaviourTask):

    """
    Description:
    A similar skill to LineUp, but used by PenaltyStriker to perform
    a slow, precise line up that ensures the robot doesn't accidentally
    touch the ball
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Walk": Walk(self)}

    def _reset(self):
        self._current_sub_task = "Walk"

    def _tick(self, rel_theta=0, kick_vector=Vector2D(0, 0), kick_position=Vector2D(0, 0)):
        move_vector = kick_position.minus(Global.myPos()).rotate(-Global.myHeading())  # noqa
        move_vector.fitLimits(Vector2D(100, 75), grow=False)  # noqa

        self._tick_sub_task(move_vector.x, move_vector.y, rel_theta, speed=0)
