from BehaviourTask import BehaviourTask
from head.HeadFixedYawAndPitch import HeadFixedYawAndPitch
from util.Timer import Timer, WallTimer
from math import radians


class HeadPenaltyStrikerLocalise(BehaviourTask):

    """
    Description:
    A Headskill associated with a penalty striker localising.
    A scan is designed so that it looks at the corners and t-junctions
    of the goal box, as well as the ball
    """

    SEQUENCE = [radians(40), radians(0), radians(-40), radians(0)]

    STARE_SECONDS = 0.7

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"FixedYawAndPitch": HeadFixedYawAndPitch(self)}

    def _reset(self):
        self.PITCH = radians(19 + self.world.blackboard.kinematics.parameters.cameraPitchBottom)
        self._current_sub_task = "FixedYawAndPitch"
        self._timer = Timer(self.STARE_SECONDS * 1000000)  # convert to micro-seconds  # noqa
        self._yaw_aim = 0
        self._sequence_counter = 0
        self._currently_moving = False
        self._timer_since_start = WallTimer()

    def _tick(self):
        # only restart timer when we've reached the position
        if self._currently_moving and (
            self._sub_tasks[self._current_sub_task].arrived()
            or self._sub_tasks[self._current_sub_task].cant_move_more()
        ):
            self._timer.restart()
            self._currently_moving = False

        if not self._currently_moving and self._timer.finished():
            self._increment_sequence_counter()
            self._yaw_aim = self.SEQUENCE[self._sequence_counter]
            self._currently_moving = True

        self._tick_sub_task(yaw=self._yaw_aim, pitch=self.PITCH, yaw_speed=0.8, pitch_speed=0.2)

    def _increment_sequence_counter(self):
        self._sequence_counter += 1
        if self._sequence_counter == len(self.SEQUENCE):
            self._sequence_counter = 0
