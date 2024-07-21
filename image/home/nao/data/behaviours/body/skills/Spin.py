import math

from body.skills.Stand import Stand
from util.Global import lastSeenEgoBallPosRRC
from util.Timer import Timer
from BehaviourTask import BehaviourTask
from body.skills.Walk import Walk
from util.Global import myHeading


class Spin(BehaviourTask):
    """
    Spin to find the ball (but tries to sync with headfindball if possible)
    """

    waiting = True

    def __init__(self, parent=None, world=None):
        super().__init__(parent, world)

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Walk": Walk(self), "Stand": Stand(self)}

    def _reset(self):
        self._current_sub_task = "Walk"
        self.turning_left = lastSeenEgoBallPosRRC().y > 0
        self.timer = Timer()  # this is some legacy bs, TeamFindBall uses it erroneously, we should remove it when
        # team ball gets redone
        Spin.waiting = True # warning, used in other places
        self._timer = Timer()

    def _transition(self):
        if Spin.waiting:
            self._current_sub_task = "Stand"
        else:
            self._current_sub_task = "Walk"

    def _tick(self):
        # print(self.world.blackboard.motion.sensors.sensors[9])#self.world.blackboard.motion.sensors.sensors[8],self.world.blackboard.motion.sensors.sensors[9])
        if not Spin.waiting and self._timer.elapsed() > 5 * 1e6:
            # met target pos
            Spin.waiting = True
            self._timer.restart()

        if Spin.waiting and self._timer.elapsed() > 5 * 1e6:
            Spin.waiting = False
            self._timer.restart()

        if self._current_sub_task == "Stand":
            self._tick_sub_task()
        else:
            self._tick_sub_task(0, 0, 0.7 if self.turning_left > 0 else -.7)