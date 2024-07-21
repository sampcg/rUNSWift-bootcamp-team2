from BehaviourTask import BehaviourTask
from util.actioncommand import walk
from util.Timer import Timer
from math import pi


class WalkTestRoutine(BehaviourTask):
    """
    Executes a walk routine in a specified order.
    self.movement is a list containing walk movements lists in the form
        [forward(mm/s), left(mm/s), turn(rad/s), duration (in us)]
    To run, start runswift via 'runswift -s WalkTestRoutine'.
    """

    def _reset(self):
        self._timer = Timer()
        self._i = 0

        self._movement = [
            [250, 0, 0, 10 * 1000000],  # forward 10 seconds
            [0, 0, pi / 5, 7.5 * 1000000],  # left 5 seconds
            [250, 0, 0, 10 * 1000000],  # backward 5 seconds
            [0, 0, pi / 5, 7.5 * 1000000]
            # [0, 0, pi/5,10 * 1000000],  # Left waltz 5 seconds
            # [300, 0, 0, 10 * 1000000],  # forward 5 seconds
            # [0, 0, 1, 10 * 1000000],  # turn 5 seconds
        ]

    def _tick(self):
        if self._timer.elapsed() > self._movement[self._i][3]:
            self._timer.restart()
            self._i += 1
            if self._i == len(self._movement):
                self._i = 0

        self.world.b_request.actions.body = walk(
            self._movement[self._i][0],
            self._movement[self._i][1],
            self._movement[self._i][2],
            speed=0.4
            # blocking=True, power=1
        )
