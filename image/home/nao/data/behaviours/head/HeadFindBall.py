from BehaviourTask import BehaviourTask
from head.HeadFixedYawAndPitch import HeadFixedYawAndPitch
from util.Timer import Timer, WallTimer
from math import radians


class HeadFindBall(BehaviourTask):

    """
    Description:
    A Headskill associated with the ball_player looking for the ball
    A narrow scan is performed first, then a wider scan is performed
    The pitch of the search changes between near and far
    """

    SEQUENCE_NARROW = [radians(20), radians(-20)]
    SEQUENCE_WIDE = [radians(-60), radians(-30), radians(30), radians(60), radians(0)]

    PITCH_OPTIONS = [0, 20]  # 0: Straight ahead, 10: slight up and down movement
    PITCH = radians(PITCH_OPTIONS[0])  # initialised variable, overwritten in _reset
    NARROW_PERIOD = 2.0  # seconds

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"FixedYawAndPitch": HeadFixedYawAndPitch(self)}

    def _reset(self):
        self.PITCH = radians(self.PITCH_OPTIONS[0] + self.world.blackboard.kinematics.parameters.cameraPitchBottom)
        self._current_sub_task = "FixedYawAndPitch"
        self._yaw_aim = self.SEQUENCE_NARROW[0]
        self._sequence_counter = 0
        self._sequence_change_counter = 0
        self._timer_since_start = WallTimer()
        self._sequence = self.SEQUENCE_NARROW
        self._yaw_step = radians(1.6)  # Step size for smooth movement
        self._pitch_step = radians(0.5)  # Step size for smooth pitch movement

    def _tick(self):
        self._sequence = self._choose_sequence()

        if self._sequence_counter >= len(self._sequence):
            self._sequence_counter = 0

        target_yaw = self._sequence[self._sequence_counter]
        target_pitch = self._calculate_target_pitch(target_yaw)

        if abs(self._yaw_aim - target_yaw) < abs(self._yaw_step):
            self._yaw_aim = target_yaw
            self._sequence_counter += 1
        else:
            if self._yaw_aim < target_yaw:
                self._yaw_aim += self._yaw_step
            else:
                self._yaw_aim -= self._yaw_step

        if abs(self.PITCH - target_pitch) < abs(self._pitch_step):
            self.PITCH = target_pitch
        else:
            if self.PITCH < target_pitch:
                self.PITCH += self._pitch_step
            else:
                self.PITCH -= self._pitch_step

        self._tick_sub_task(yaw=self._yaw_aim, pitch=self.PITCH, yaw_speed=0.2, pitch_speed=1.0)

    def _calculate_target_pitch(self, target_yaw):
        if target_yaw > self._yaw_aim:
            return radians(self.PITCH_OPTIONS[1])  # Move pitch up
        else:
            return radians(self.PITCH_OPTIONS[0])  # Keep pitch at 0

    def _choose_sequence(self):
        if self._timer_since_start.elapsedSeconds() < self.NARROW_PERIOD:
            return self.SEQUENCE_NARROW
        else:
            return self.SEQUENCE_WIDE
