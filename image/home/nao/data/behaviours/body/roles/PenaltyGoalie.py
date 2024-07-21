from BehaviourTask import BehaviourTask
from body.skills.GoalieStand import GoalieStand
from body.skills.Dive import DiveCentre, DiveLeft, DiveRight
from util.BallMovement import timeToReachCoronalPlaneNoFriction, YWhenReachCoronalPlane
from util.Hysteresis import Hysteresis
from util.Constants import GOAL_POST_ABS_Y
from util.Global import canSeeBall


class PenaltyGoalie(BehaviourTask):
    CENTRE_DIVE_Y_ABS = 120  # mm
    OUTER_DIVE_Y_ABS = GOAL_POST_ABS_Y + 300  # mm

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "Stand": GoalieStand(self),
            "DiveCentre": DiveCentre(self),
            "DiveLeft": DiveLeft(self),
            "DiveRight": DiveRight(self),
        }

    def _reset(self):
        self._current_sub_task = "Stand"
        self._centre_dive_hyst = Hysteresis(0, 2)
        self._left_dive_hyst = Hysteresis(0, 2)
        self._right_dive_hyst = Hysteresis(0, 2)

    def _transition(self):
        t = timeToReachCoronalPlaneNoFriction()

        if t > 5.0 or t < 0.1:
            self._centre_dive_hyst.down()
            self._left_dive_hyst.down()
            self._right_dive_hyst.down()
        elif canSeeBall():
            y = YWhenReachCoronalPlane()
            if y > -self.CENTRE_DIVE_Y_ABS and y < self.CENTRE_DIVE_Y_ABS:
                self._centre_dive_hyst.up()
            elif y > self.CENTRE_DIVE_Y_ABS and y < self.OUTER_DIVE_Y_ABS:
                self._left_dive_hyst.up()
            elif y > -self.OUTER_DIVE_Y_ABS and y < -self.CENTRE_DIVE_Y_ABS:
                self._right_dive_hyst.up()
            else:
                self._centre_dive_hyst.down()
                self._left_dive_hyst.down()
                self._right_dive_hyst.down()

        if self._centre_dive_hyst.is_max():
            self._current_sub_task = "DiveCentre"
        elif self._left_dive_hyst.is_max():
            self._current_sub_task = "DiveLeft"
        elif self._right_dive_hyst.is_max():
            self._current_sub_task = "DiveRight"
        else:
            self._current_sub_task = "Stand"
