from BehaviourTask import BehaviourTask

import robot
from body.skills.RaiseArm import RaiseArm
from body.skills.Stand import Stand
from util.Timer import Timer


class ReportFinishedWalking(BehaviourTask):
    """
    Behaviour for reporting when the robot is done walking.
    Made for evaluation in 2021 Autonomous Calibration challenge.
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "RaiseArm": RaiseArm(self),
            "LowerArm": Stand(self),
        }

    def _reset(self):
        self._current_sub_task = "RaiseArm"
        self._armTimer = Timer(timeTarget=1500000).start()
        self._speakTimer = Timer(timeTarget=6500000)
        self._begun_speaking = False
        self.is_finished = False

    def _transition(self):
        if self._current_sub_task == "RaiseArm" and self._armTimer.finished():
            if not self._begun_speaking:
                s = "Finished walking"
                robot.say(s)
                self._begun_speaking = True
                self._speakTimer.start()
            elif self._speakTimer.finished():
                self._current_sub_task = "LowerArm"
                self._armTimer.restart().start()
        elif self._current_sub_task == "LowerArm" and self._armTimer.finished():
            self.is_finished = True
