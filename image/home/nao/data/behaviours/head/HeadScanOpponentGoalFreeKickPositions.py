from BehaviourTask import BehaviourTask
from util.Timer import Timer
from math import radians
from head.HeadLookAtGlobalPoint import HeadLookAtGlobalPoint
from util.Constants import GOAL_KICK_ABS_X, GOAL_KICK_ABS_Y
from util.Vector2D import Vector2D


class HeadScanOpponentGoalFreeKickPositions(BehaviourTask):

    """
    Description:
    A headskill associated with scanning the opponent's two possible
    goal free kick ball positions.
    """

    STARE_SECONDS = 0.7
    PITCH = radians(19)

    BALL_POSITIONS = [
        Vector2D(GOAL_KICK_ABS_X, GOAL_KICK_ABS_Y),
        Vector2D(GOAL_KICK_ABS_X, -GOAL_KICK_ABS_Y),
    ]

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"LookAtGlobalPoint": HeadLookAtGlobalPoint(self)}

    def _reset(self):
        self.PITCH = radians(19 + self.world.blackboard.kinematics.parameters.cameraPitchBottom)
        self._current_sub_task = "LookAtGlobalPoint"
        self._timer = Timer(self.STARE_SECONDS * 1000000)  # convert to micro-seconds  # noqa
        self._global_point = self.BALL_POSITIONS[0]
        self._sequence_counter = 0
        self._currently_moving = True  # Start with moving head

    def _tick(self):
        # restart timer if we've reached the position,
        # or cant move the head more due to joint angle limits
        if self._currently_moving and (
            self._sub_tasks[self._current_sub_task].arrived()
            or self._sub_tasks[self._current_sub_task].cant_move_more()
        ):
            self._timer.restart()
            self._currently_moving = False

        # if finished staring, move to next point
        if not self._currently_moving and self._timer.finished():
            self._increment_sequence_counter()
            self._global_point = self.BALL_POSITIONS[self._sequence_counter]
            self._currently_moving = True

        self._tick_sub_task(global_point=self._global_point)

    def _increment_sequence_counter(self):
        self._sequence_counter += 1
        if self._sequence_counter == len(self.BALL_POSITIONS):
            self._sequence_counter = 0
