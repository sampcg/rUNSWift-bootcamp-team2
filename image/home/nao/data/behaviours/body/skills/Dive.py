from BehaviourTask import BehaviourTask
from util.Hysteresis import Hysteresis
from util.BallMovement import YWhenReachCoronalPlane, timeToReachCoronalPlaneWithFriction
from body.skills.Crouch import Crouch
from util.actioncommand import goalieCentre, goalieDiveLeft, goalieDiveRight


class Dive(BehaviourTask):
    """
    Description:
    A skill that decides which way a goalie dives.
    The hysteresis allows the robot to make a sensible decision
    in regards to which way to dive. However, the length of the
    hysteresis must be short as time is critical when diving
    """

    # Threshold for ball to reach coronal plane and decide to dive in seconds
    DIVE_PERIOD_THRESH = 2.0

    # Threshold to do a side dive rather than a centre dive
    DIVE_SIDE_THRESH = 150

    # Hysteresis length for diving
    DIVE_HYST_LENGTH = 5

    # Hysteresis length for deciding whether to dive sideways
    SIDE_DIVE_HYST_LENGTH = 3

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "DiveCentre": DiveCentre(self),
            "DiveLeft": DiveLeft(self),
            "DiveRight": DiveRight(self),
            "Crouch": Crouch(self),
        }

    def _reset(self):
        self._current_sub_task = "Crouch"
        self._dive_hysteresis = Hysteresis(0, self.DIVE_HYST_LENGTH)
        self._dive_left_hysteresis = Hysteresis(0, self.SIDE_DIVE_HYST_LENGTH)
        self._dive_right_hysteresis = Hysteresis(0, self.SIDE_DIVE_HYST_LENGTH)

    def _transition(self):
        # Update hystereses
        final_y = YWhenReachCoronalPlane()
        period = timeToReachCoronalPlaneWithFriction()
        self._dive_hysteresis.adjust(period < self.DIVE_PERIOD_THRESH)
        self._dive_left_hysteresis.adjust(final_y > self.DIVE_SIDE_THRESH)
        self._dive_right_hysteresis.adjust(final_y < -self.DIVE_SIDE_THRESH)

        if self._dive_hysteresis.is_max():
            if self._dive_left_hysteresis.value > self.SIDE_DIVE_HYST_LENGTH / 2:  # noqa
                self._current_sub_task = "DiveLeft"
            elif self._dive_right_hysteresis.value > self.SIDE_DIVE_HYST_LENGTH / 2:  # noqa
                self._current_sub_task = "DiveRight"
            else:
                self._current_sub_task = "DiveCentre"
        else:
            self._current_sub_task = "Crouch"


class DiveCentre(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = goalieCentre()


class DiveLeft(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = goalieDiveLeft()


class DiveRight(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = goalieDiveRight()
