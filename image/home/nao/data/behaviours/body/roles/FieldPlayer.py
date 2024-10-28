from body.skills.Stand import Stand
from BehaviourTask import BehaviourTask
from body.skills.WalkInLine import WalkInLine
from body.skills.CircularPath import CircularPath
from body.skills.Crouch import Crouch
from body.skills.RaiseArm import RaiseArm
from body.skills.Sit import Sit
from body.skills.ApproachBall import ApproachBall
from util.GameStatus import penalised
from util.Timer import WallTimer
#import os

class FieldPlayer(BehaviourTask):
    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "RaiseArm": RaiseArm(self),
            "Crouch": Crouch(self),
            "Stand": Stand(self),
            "WalkInLine": WalkInLine(self),
            "CircularPath": CircularPath(self),
            "Sit": Sit(self),
            "ApproachBall": ApproachBall(self)
        }

    def _reset(self):
        self._current_sub_task = "Stand"
        self._timer = WallTimer(self)  
        #os.system("aplay \Users\India\Downloads\robotfile.mp3 &")

    def _transition(self):
        if penalised():
            self._current_sub_task = 'ApproachBall'
        else:
        
            elapsed = self._timer.elapsedSeconds()
            if elapsed >= 35:
                self._current_sub_task = "Stand"
            elif elapsed >= 30:
                self._current_sub_task = "Sit"
            elif elapsed >= 25:
                self._current_sub_task = "RaiseArm"                
            elif elapsed >= 20:
                self._current_sub_task = "Crouch"
            elif elapsed >= 15:
                self._current_sub_task = "CircularPath"
            elif elapsed >= 10:
                self._current_sub_task = "RaiseArm"
            elif elapsed >= 7:
                self._current_sub_task = "Stand"
            elif elapsed >= 4:
                self._current_sub_task = "RaiseArm"
            else:
                self._current_sub_task = "WalkInLine"
           
        

    def _tick(self):
        self._tick_sub_task()
