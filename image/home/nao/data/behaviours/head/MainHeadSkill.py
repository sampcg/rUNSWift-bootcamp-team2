from BehaviourTask import BehaviourTask
from head.HeadCentre import HeadCentre
from head.HeadLocalise import HeadLocalise
from head.HeadDown import HeadDown
from head.HeadLeft import HeadLeft
from head.HeadRight import HeadRight
from head.HeadTrackBall import HeadTrackBall

from util.GameStatus import GameState, GamePhase, game_state, game_phase
from util.Global import usingGameSkill, getCurrentSkill
from util.GameStatus import we_are_kicking_team, penalised
from util.Timer import WallTimer

class MainHeadSkill(BehaviourTask):
    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "Centre": HeadCentre(self),
            "Localise": HeadLocalise(self),
            "Track": HeadTrackBall(self),
            "Left": HeadLeft(self),
            "Right": HeadRight(self),
            "Down": HeadDown(self)
        }

    def _reset(self):
        self._current_sub_task = "Centre"
        self._is_first_time_scan = True
        self._timer = WallTimer(self)

    def _transition(self):
        
        if penalised():
            self._current_sub_task = "Track"
        else:
        
            elapsed = self._timer.elapsedSeconds()
            if elapsed >= 35:
                self._current_sub_task = "Right"
            elif elapsed >= 30:
                self._current_sub_task = "Left"
            elif elapsed >= 25:
                self._current_sub_task = "Down"
            elif elapsed >= 15:
                self._current_sub_task = "Centre"
            elif elapsed >= 13:
                self._current_sub_task = "Right"
            elif elapsed >= 10:
                self._current_sub_task = "Left"
            elif elapsed >= 7:
                self._current_sub_task = "Right"
            elif elapsed >= 4:
                self._current_sub_task = "Left"
            else:
                self._current_sub_task = "Down"

    def _tick(self):
        self._tick_sub_task()