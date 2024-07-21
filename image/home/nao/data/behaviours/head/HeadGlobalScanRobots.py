from BehaviourTask import BehaviourTask
from head.HeadFixedYawAndPitch import HeadFixedYawAndPitch
from math import radians


class HeadGlobalScanRobots(BehaviourTask):

    """
    Description:
    A Headskill associated with scanning all possible robots on field
    """

    SEQUENCE = [
        radians(30),
        radians(-30),
        radians(30),
        radians(-30),
    ]

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"FixedYawAndPitch": HeadFixedYawAndPitch(self)}

    def _reset(self):
        self.PITCH_HIGH = radians(19)
        self.PITCH_LOW = radians(19 + self.world.blackboard.kinematics.parameters.cameraPitchBottom)
        self._current_sub_task = "FixedYawAndPitch"
        self._yaw_aim = 0
        self._sequence_counter = 0
        self._is_finished = False
        self._currently_moving = False
        self.START_LOWER_SCAN_SEQ = 2

    def _tick(self):
        if self._currently_moving and (
            self._sub_tasks[self._current_sub_task].arrived()
            or self._sub_tasks[self._current_sub_task].cant_move_more()
        ):
            self._currently_moving = False

        if not self._currently_moving:
            self._increment_sequence_counter()
            self._yaw_aim = self.SEQUENCE[self._sequence_counter]
            self._currently_moving = True

        if abs(self._sequence_counter) < self.START_LOWER_SCAN_SEQ:
            self._tick_sub_task(yaw=self._yaw_aim, pitch=self.PITCH_HIGH, yaw_speed=0.2, pitch_speed=0.2)
        else:
            self._tick_sub_task(yaw=self._yaw_aim, pitch=self.PITCH_LOW, yaw_speed=0.2, pitch_speed=0.2)

    def _increment_sequence_counter(self):
        self._sequence_counter += 1
        if self._sequence_counter == len(self.SEQUENCE):
            self._sequence_counter = 0
            self._is_finished = True
