from BehaviourTask import BehaviourTask
from head.HeadSkillBallPlayer import HeadSkillBallPlayer
from head.HeadSkillAnticipate import HeadSkillAnticipate
from head.HeadCentre import HeadCentre
from head.HeadLocalise import HeadLocalise
from head.HeadPenaltyStriker import HeadPenaltyStriker
from head.HeadPenaltyGoalie import HeadPenaltyGoalie
from head.HeadGlobalScanRobots import HeadGlobalScanRobots
from head.HeadLookAtReferee import HeadLookAtReferee
from util.GameStatus import GameState, GamePhase, game_state, game_phase
from util.Global import usingGameSkill, getCurrentSkill
from util.GameStatus import we_are_kicking_team, penalised


class MainHeadSkill(BehaviourTask):
    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "SkillBallPlayer": HeadSkillBallPlayer(self),
            "SkillAnticipate": HeadSkillAnticipate(self),
            "Centre": HeadCentre(self),
            "Localise": HeadLocalise(self),
            "PenaltyStriker": HeadPenaltyStriker(self),
            "PenaltyGoalie": HeadPenaltyGoalie(self),
            "ScanRobot": HeadGlobalScanRobots(self),
            "LookAtReferee": HeadLookAtReferee(self),
        }

    def _reset(self):
        self._current_sub_task = "SkillBallPlayer"
        self._is_first_time_scan = True

    def _transition(self):
        if getCurrentSkill() == "P2PPassing2021" and self._is_first_time_scan:
            self._current_sub_task = "ScanRobot"
            if self.world.blackboard.stop_scan_var:
                self._is_first_time_scan = False
        elif getCurrentSkill() == "ObstacleAvoidance" and self._is_first_time_scan:
            self._current_sub_task = "ScanRobot"
            if self._sub_tasks[self._current_sub_task]._is_finished:
                self._is_first_time_scan = False
        elif getCurrentSkill() == "VisualReferee":
            self._current_sub_task = "Centre"
        elif not usingGameSkill():
            # We're running a skill with '-s', we usually want ballplayer head
            self._current_sub_task = "SkillBallPlayer"
        elif penalised():
            self._current_sub_task = "Centre"
        elif game_state() in (GameState.INITIAL, GameState.FINISHED):
            self._current_sub_task = "Centre"
        elif game_state() is GameState.STANDBY:
            self._current_sub_task = "LookAtReferee"
        elif game_state() is GameState.READY:
            self._current_sub_task = "Localise"
        elif game_phase() is GamePhase.GAME_PHASE_PENALTYSHOOT:
            self._current_sub_task = "PenaltyStriker" if we_are_kicking_team() else "PenaltyGoalie"  # noqa
        elif (
            self.world.b_request.behaviourSharedData.playingBall or self.world.b_request.behaviourSharedData.isAssisting
        ):
            self._current_sub_task = "SkillBallPlayer"
        else:
            self._current_sub_task = "SkillAnticipate"
