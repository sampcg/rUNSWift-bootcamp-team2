import robot
from importlib import import_module
from util.Vector2D import Vector2D
from BehaviourTask import BehaviourTask
from body.skills.FindBall import FindBall
from body.skills.Stand import Stand
from util.Constants import FIELD_LENGTH, PENALTY_AREA_LENGTH, CENTER_CIRCLE_DIAMETER, LEDColour

from util.FieldGeometry import (
    ENEMY_GOAL_BEHIND_CENTER,
    ball_near_our_goal,
    calculateTimeToReachBall,
    calculateTimeToReachPose,
)

from util.Timer import WallTimer
from util import LedOverride

OPPONENT_GOAL_CENTRE = Vector2D(FIELD_LENGTH / 2, 0)
KICK_OFF_MIN_DISTANCE = CENTER_CIRCLE_DIAMETER / 2 - 200
CENTER_DIVE_THRES = 200
DANGEROUS_BALL_THRES = 300
DIVE_VEL_THRES = 50
FREE_KICK_TARGET = ENEMY_GOAL_BEHIND_CENTER.add(Vector2D(0, 200))


class FieldPlayer(BehaviourTask):
    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "Stand": Stand(self),
        }

    def _reset(self):
        self._current_sub_task = "Stand"

    def _transition(self):
        pass

    def _tick(self):
        pass

