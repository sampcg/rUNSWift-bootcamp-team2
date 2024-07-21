from BehaviourTask import BehaviourTask
from math import radians
from body.skills.WalkStraightToPose import WalkStraightToPose
from util.Vector2D import Vector2D
from util.MathUtil import angleDiff
from util.Global import myPos, myHeading


class Patrol(BehaviourTask):
    """
    Executes a patrol through way points on a field.
    self._way_points is a list containing field coordinates in the form
        [x(mm), y(mm), theta(mm)]
    To run, start runswift via 'runswift -s Patrol'.
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"WalkToPose": WalkStraightToPose(self)}

    def _reset(self):
        self._i = 0
        self._current_sub_task = "WalkToPose"

        self._way_points = [
            (-4000, -2000, radians(-180)),
            (-4000, 2000, radians(-90)),
            (-1000, 2000, radians(90)),
            (-1000, -2000, radians(0)),
        ]

    def _tick(self):
        current_way_point = self._way_points[self._i]
        if (
            abs(current_way_point[0] - myPos().x) < 300
            and abs(current_way_point[1] - myPos().y) < 300
            and angleDiff(current_way_point[2], myHeading()) < radians(20)
        ):
            self._i += 1
            if self._i == len(self._way_points):
                self._i = 0
        current_way_point = self._way_points[self._i]

        self._tick_sub_task(
            final_pos=Vector2D(current_way_point[0], current_way_point[1]), final_heading=current_way_point[2]
        )
