from BehaviourTask import BehaviourTask

from body.skills.RaiseArm import RaiseArm
from body.skills.Stand import Stand
from body.skills.FindBall import FindBall
from util.Global import ballWorldPos, canSeeBall
from util.Timer import Timer

import robot


# Attempts to find the ball, raise its arm, saying the ball coordinates, and lower its arm
# Made for evaluation of 2021 Autonomous Calibration challenge
class ReportBallPos(BehaviourTask):
    """
    Attempts to find the ball, raise its arm, saying the ball coordinates, and lower its arm

    Made for evaluation of 2021 Autonomous Calibration challenge
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "FindBall": FindBall(self),
            "RaiseArm": RaiseArm(self),
            "LowerArm": Stand(self),
        }

    def _reset(self):
        self._current_sub_task = "FindBall"
        self._searchTimer = Timer(timeTarget=10000000).start()
        self._armTimer = Timer(timeTarget=2500000)
        self._speakTimer = Timer(timeTarget=6500000)
        self._begun_speaking = False
        self.is_finished = False

    def _transition(self):
        if self._current_sub_task == "FindBall" and (canSeeBall() or self._searchTimer.finished()):
            self._current_sub_task = "RaiseArm"
            self._armTimer.start()
        elif self._current_sub_task == "RaiseArm" and self._armTimer.finished():
            if not self._begun_speaking:
                ball_world_pos = ballWorldPos()
                s = "The ball is at " + str(int(ball_world_pos.x)) + " " + str(int(ball_world_pos.y))
                robot.say(s)
                self._begun_speaking = True
                self._speakTimer.start()
            elif self._speakTimer.finished():
                self._current_sub_task = "LowerArm"
                self._armTimer.restart().start()
        elif self._current_sub_task == "LowerArm" and self._armTimer.finished():
            self.is_finished = True
