from BehaviourTask import BehaviourTask
from head.HeadFixedYawAndPitch import HeadFixedYawAndPitch
from math import radians
from util.Vector2D import Vector2D
from util.FieldGeometry import globalPointToRobotRelativePoint


class HeadLookAtGlobalPoint(BehaviourTask):

    """
    Description:
    A Headskill to look at a global point on the field
    """

    BEHIND_ANGLE = radians(60)

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"FixedYawAndPitch": HeadFixedYawAndPitch(self)}

    def _reset(self):
        self.PITCH_BASIC = radians(19)
        self.PITCH = radians(19 + self.world.blackboard.kinematics.parameters.cameraPitchBottom)
        self._current_sub_task = "FixedYawAndPitch"

    def _tick(self, global_point=Vector2D(0, 0)):
        rr_point = globalPointToRobotRelativePoint(global_point)
        yaw = rr_point.heading()

        if abs(yaw) <= self.BEHIND_ANGLE:
            self._tick_sub_task(yaw=yaw, pitch=self.PITCH, yaw_speed=0.8, pitch_speed=0.2)
        else:
            self._tick_sub_task(yaw=yaw, pitch=self.PITCH_BASIC, yaw_speed=0.8, pitch_speed=0.2)

    def arrived(self):
        return self._sub_tasks[self._current_sub_task].arrived()

    def cant_move_more(self):
        return self._sub_tasks[self._current_sub_task].cant_move_more()
