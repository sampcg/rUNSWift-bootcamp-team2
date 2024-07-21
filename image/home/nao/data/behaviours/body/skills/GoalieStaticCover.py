from BehaviourTask import BehaviourTask
from body.skills.Anticipate import Anticipate
from util.Vector2D import Vector2D
from math import radians
from util.Global import ballWorldPos
from util.Constants import GOAL_POST_ABS_X
from util.DeadZoneHysteresis import DeadZoneHysteresis


class GoalieStaticCover(BehaviourTask):
    """
    Description:
    A goalie skill associated with standing in a static position,
    for when the ball is far away. If the ball is extra far away,
    we stand up to prevent overheating in leg joints.
    """

    # Upper and Lower limit of ball world pos x to stand or crouch
    BALL_X_LOWER = -500  # mm
    BALL_X_UPPER = 500  # mm

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Anticipate": Anticipate(self)}

    def _reset(self):
        self._cover_pos = Vector2D(-GOAL_POST_ABS_X + 250, 0)
        self._current_sub_task = "Anticipate"

        self._ball_x_far_dzh = DeadZoneHysteresis(self.BALL_X_LOWER, self.BALL_X_UPPER)

    def _tick(self):
        should_stand = self._ball_x_far_dzh.evaluate(ballWorldPos().x)

        self._tick_sub_task(
            position=self._cover_pos,
            heading=0,
            position_error=100,
            heading_error=radians(13),
            stay_crouched=not should_stand,
            dist_to_face_final_heading=1500,
            speed=1.0,
        )
