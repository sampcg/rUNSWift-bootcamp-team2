from math import radians
from util.Global import myPos, myHeading, ballRelPos, ballWorldPos
from BehaviourTask import BehaviourTask
from util.Constants import TOE_CENTRE_X
from util.Vector2D import Vector2D
from util.MathUtil import angleSignedDiff
from util.Hysteresis import Hysteresis
from util.FieldGeometry import ENEMY_GOAL_BEHIND_CENTER
from util import LineUpDataReader
from body.skills.WalkStraightToPose import WalkStraightToPose
from body.skills.PenaltyStrikerLineUp import PenaltyStrikerLineUp
from robot import Foot


class PenaltyStrikerApproachBall(BehaviourTask):

    """
    Description:
    A skill that performs the approachball for a penalty shootout.
    It is a simplified version of ApproachBall, that can line up more
    carefully and precisely, but slower. A specific line up map is
    used that has harsher restrictions than the use line up map.
    """

    line_up_data, line_up_max_x, line_up_max_y = LineUpDataReader.readData("penalty_striker_line_up_data.lud")

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Unobstructed": WalkStraightToPose(self), "LineUp": PenaltyStrikerLineUp(self)}

    def _reset(self):
        self._current_sub_task = "Unobstructed"
        self.sub_task_switch_hysteresis = Hysteresis(0, 2)

        self.close_hysteresis = Hysteresis(0, 40)
        self.position_aligned_hysteresis = Hysteresis(0, 40)
        self.heading_aligned_hysteresis = Hysteresis(0, 40)

        self.close = False
        self.position_aligned = False  # The kick_foot's position is colinear \
        # with the kick_target and ball
        self.heading_aligned = False  # The robot is facing kick_target

    def _tick(
        self,
        target=ENEMY_GOAL_BEHIND_CENTER,
        kick_foot=Foot.LEFT,
        lineup_distance=80,
        heading_error=radians(5),
        close_distance=500,
        kick_side_mm=70,
    ):
        my_pos = myPos()
        my_heading = myHeading()

        # Calculate where we would like to take the eventual kick from

        ball = ballWorldPos()
        kick_vector = target.minus(ball).normalise(lineup_distance)

        toe_vector = Vector2D(TOE_CENTRE_X, kick_side_mm * (1 if kick_foot is Foot.LEFT else -1))
        toe_vector_relative_to_me = toe_vector.clone().rotate(my_heading)
        toe_vector_relative_to_kick = toe_vector.clone().rotate(kick_vector.heading())

        toe_kick_position = ball.minus(kick_vector)
        kick_position = toe_kick_position.minus(toe_vector_relative_to_kick)

        # Calculate possible tangential paths \
        # in order to avoid hitting the ball

        toe_pos = my_pos.plus(toe_vector_relative_to_me)
        ball_vector = ball.minus(toe_pos)

        # Calculate some values to help decide between sub tasks
        rel_theta = angleSignedDiff(kick_vector.heading(), my_heading)

        # Transition to the appropriate sub task
        next_sub_task = None

        if ball_vector.length() > close_distance:
            next_sub_task = "Unobstructed"

        else:
            next_sub_task = "LineUp"

        self.sub_task_switch_hysteresis.adjust(next_sub_task == self._current_sub_task)

        if self.sub_task_switch_hysteresis.is_min():
            self._current_sub_task = next_sub_task
            self.sub_task_switch_hysteresis.reset()

        if self._current_sub_task == "Unobstructed":
            self._tick_sub_task(final_pos=kick_position, final_heading=ball_vector.heading(), speed=0.0)
        elif self._current_sub_task == "LineUp":
            self._tick_sub_task(rel_theta=rel_theta, kick_vector=kick_vector, kick_position=kick_position)

        # divide ballRelPos by 10 to get map x and y positions
        mapPos = ballRelPos().scale(0.1)

        if kick_foot is Foot.LEFT:
            if mapPos.x < 0 or mapPos.x >= self.line_up_max_x or mapPos.y < 0 or mapPos.y >= self.line_up_max_y:
                self.close_hysteresis.adjust(False)
                self.position_aligned_hysteresis.adjust(False)
            elif self.line_up_data[int(mapPos.x)][int(mapPos.y)] in (1, 2):
                self.close_hysteresis.adjust(True, up_amount=self.line_up_data[int(mapPos.x)][int(mapPos.y)])  # noqa
                self.position_aligned_hysteresis.adjust(True)
            else:
                self.close_hysteresis.adjust(False)
                self.position_aligned_hysteresis.adjust(False)
        else:
            if mapPos.x < 0 or mapPos.x >= self.line_up_max_x or mapPos.y > 0 or mapPos.y <= -self.line_up_max_y:
                self.close_hysteresis.adjust(False)
                self.position_aligned_hysteresis.adjust(False)
            elif self.line_up_data[int(mapPos.x)][int(-mapPos.y)] in (1, 2):  # noqa
                self.close_hysteresis.adjust(True, up_amount=self.line_up_data[int(mapPos.x)][int(-mapPos.y)])  # noqa
                self.position_aligned_hysteresis.adjust(True)
            else:
                self.close_hysteresis.adjust(False)
                self.position_aligned_hysteresis.adjust(False)

        self.heading_aligned_hysteresis.adjust(abs(rel_theta) < heading_error)

        self.close = self.close_hysteresis.true
        self.position_aligned = self.position_aligned_hysteresis.true
        self.heading_aligned = self.heading_aligned_hysteresis.true
