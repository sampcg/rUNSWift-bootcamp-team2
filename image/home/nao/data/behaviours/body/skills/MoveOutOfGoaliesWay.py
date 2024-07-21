from util.TeamStatus import get_teammate_pos
from util.Global import ballWorldPos, myPos
from util.MathUtil import closest_point_on_segment
from BehaviourTask import BehaviourTask
from body.skills.WalkStraightAndTurn import WalkStraightAndTurn
from util.Vector2D import Vector2D, makeVector2DFromDistHeading


class MoveOutOfGoaliesWay(BehaviourTask):
    def _reset(self):
        self.close = False
        self.point_on_segment = Vector2D(0, 0)
        self._current_sub_task = "MovingOut"

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"MovingOut": WalkStraightAndTurn(self)}

    def _tick(self):
        goalie = get_teammate_pos(1)
        ball = ballWorldPos()
        point_on_segment = closest_point_on_segment(myPos(), goalie, ball)

        point_on_segment_to_me = myPos().minus(point_on_segment)
        position = point_on_segment.plus(makeVector2DFromDistHeading(600, point_on_segment_to_me.heading()))

        heading = ballWorldPos().minus(position).heading()
        self._tick_sub_task(position, heading)

        print(point_on_segment.distanceTo(myPos()))
