from BehaviourTask import BehaviourTask

from body.skills.WalkToPointAndReport import WalkToPointAndReport
from body.skills.ReportBallPos import ReportBallPos

from util.FieldGeometry import OWN_GOAL_CENTER, ENEMY_GOAL_CENTER
from body.skills.Stand import Stand
from util.Vector2D import Vector2D


class AutonomousCalibration(BehaviourTask):
    """
    Description:
    Behaviour file for 2021 Challenge 4 - Autonomous Calibration
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "FindFirstBall": ReportBallPos(self),
            "WalkToOwnGoal": WalkToPointAndReport(self),
            "WalkToKickoff": WalkToPointAndReport(self),
            "FindSecondBall": ReportBallPos(self),
            "WalkToOppGoal": WalkToPointAndReport(self),
            "Stand": Stand(self),
        }

    def _reset(self):
        self._current_sub_task = "FindFirstBall"
        self._destination = OWN_GOAL_CENTER

    def _transition(self):
        if self._current_sub_task == "FindFirstBall" and self._sub_tasks[self._current_sub_task].is_finished:
            self._destination = OWN_GOAL_CENTER
            self._current_sub_task = "WalkToOwnGoal"
        elif self._current_sub_task == "WalkToOwnGoal" and self._sub_tasks[self._current_sub_task].is_finished:
            print("Walking to kickoff position...")
            self._destination = Vector2D(0, 0)
            self._current_sub_task = "WalkToKickoff"
        elif self._current_sub_task == "WalkToKickoff" and self._sub_tasks[self._current_sub_task].is_finished:
            self._current_sub_task = "FindSecondBall"
        elif self._current_sub_task == "FindSecondBall" and self._sub_tasks[self._current_sub_task].is_finished:
            self._destination = ENEMY_GOAL_CENTER
            self._current_sub_task = "WalkToOppGoal"

    def _tick(self):
        if (
            self._current_sub_task == "WalkToOwnGoal"
            or self._current_sub_task == "WalkToKickoff"
            or self._current_sub_task == "WalkToOppGoal"
        ):
            self._tick_sub_task(destination=self._destination)
        else:
            self._tick_sub_task()
