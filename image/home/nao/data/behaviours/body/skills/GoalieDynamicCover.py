from BehaviourTask import BehaviourTask
from body.skills.Anticipate import Anticipate
from math import sqrt, atan2, cos, copysign, sin
from util.Global import ballWorldPos, myPos
from util.Vector2D import Vector2D
from util.Constants import GOAL_POST_ABS_X
from math import radians


class GoalieDynamicCover(BehaviourTask):
    """
    Description:
    A goalie skill associated with dynamically covering the goal.
    An ellipse with limits are used.
    """

    # Default origin x and y
    ORI_X = -GOAL_POST_ABS_X
    ORI_Y = 0

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Anticipate": Anticipate(self)}

    def _reset(self):
        self._current_sub_task = "Anticipate"

    def _tick(self):
        cover_pos = self._calculate_cover_pos()
        to_ball = ballWorldPos().minus(myPos())

        self._tick_sub_task(
            position=cover_pos,
            heading=to_ball.heading(),
            position_error=120,
            heading_error=radians(12),
            stay_crouched=True,
            dist_to_face_final_heading=1500,
            speed=1.0,
        )

    # calculate a precise cover goal position when ball is close to goal
    # post general idea is that generate a oval curve according to size of
    # goal box and then calculate the intercept point between the line from
    # ball to goal center, and oval curve which is the cover point of goalie
    def _calculate_cover_pos(self):
        semi_major = 1000.0  # a
        semi_minor = 250.0  # b

        # the eccentricity of oval curve
        eccentricity = sqrt(1 - (pow(semi_minor, 2) / pow(semi_major, 2)))

        ballPos = ballWorldPos()

        # angle between ball to goal post center
        balltoOriHead = atan2(ballPos.x - self.ORI_X, ballPos.y - self.ORI_Y)

        radi = semi_minor / sqrt((1 - pow(cos(balltoOriHead) * eccentricity, 2)))

        y = radi * cos(balltoOriHead) + self.ORI_Y

        if abs(y) >= 600:
            y = copysign(700, ballPos.y)
            x = self.ORI_X + 250
            return Vector2D(x, y)

        x = radi * sin(balltoOriHead) + self.ORI_X
        return Vector2D(x, y)
