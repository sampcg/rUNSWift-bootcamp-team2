from random import choice
from BehaviourTask import BehaviourTask
from util.FieldGeometry import ENEMY_GOAL_CENTER
from util.Timer import Timer
from body.skills.PenaltyStrikerApproachBall import PenaltyStrikerApproachBall
from body.skills.Kick import Kick
from body.skills.Stand import Stand
from body.skills.Crouch import Crouch
from util.Global import ballDistance
from util.GameStatus import secs_remaining
from util.Vector2D import Vector2D
from robot import Foot


# How much to offset kick when kicking to left side / right side
# We try not to aim too far out, because during the goalie side dive,
# they tend leave a gap between the ground and the torso. We try and
# kick it through that gap!
LEFT_SHOOT_OFFSET = 600
RIGHT_SHOOT_OFFSET = 600

# How many seconds to crouch, during the first localise
FIRST_LOCALISE_SECONDS = 2

# How close to the ball we should get before starting second localise
BALL_DISTANCE_TO_DO_SECOND_LOCALISE = 450

# How many seconds to crouch, during the second localise
SECOND_LOCALISE_SECONDS = 2

# The number of seconds left in the penalty kick, that we should take
# the kick. We want to wait and use up the time so we can handle teams that
# dive early, or perform a false positive dive and gets removed by the referee,
# or fails to getup
# SECONDS_TO_FINISH_TO_KICK = 6  # use to wait until last second before kicking
SECONDS_TO_FINISH_TO_KICK = 20  # use to kick as soon as ready


class PenaltyStriker(BehaviourTask):

    """
    Description:
    A class that is executed for Penalty Striker during a Penalty Shootout.
    It is executed strictly in the following order:
    1. FirstLocalise - attempt to stop and localise the robot
    2. FirstApproachBall - approach the ball until we're at a certain distance
    3. SecondLocalise - attempt to stop and localise the robot better
    4. SecondApproachBall - approach the ball until we're completely lined up
    5. CrouchToBalance - stop walking and crouch, to ensure we're stable
    6. Kick - perform the kick as hard as we can, aim at one side randomly
    7. AfterKick - stand and stop moving
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "FirstLocalise": Crouch(self),
            "FirstApproachBall": PenaltyStrikerApproachBall(self),
            "SecondLocalise": Crouch(self),
            "SecondApproachBall": PenaltyStrikerApproachBall(self),
            "CrouchToBalance": Crouch(self),
            "Kick": Kick(self),
            "AfterKick": Stand(self),
        }

    def _reset(self):
        self._current_sub_task = "FirstLocalise"
        self._first_localise_timer = Timer(FIRST_LOCALISE_SECONDS * 1000000)
        self._second_localise_timer = Timer(SECOND_LOCALISE_SECONDS * 1000000)
        self._target = self._generate_target()

    def _transition(self):
        if self._current_sub_task == "FirstLocalise":
            if self._first_localise_timer.finished():
                self._current_sub_task = "FirstApproachBall"
        elif self._current_sub_task == "FirstApproachBall":
            if ballDistance() < BALL_DISTANCE_TO_DO_SECOND_LOCALISE:
                self._current_sub_task = "SecondLocalise"
                self._second_localise_timer.restart()
        elif self._current_sub_task == "SecondLocalise":
            if self._second_localise_timer.finished():
                self._current_sub_task = "SecondApproachBall"
        elif self._current_sub_task == "SecondApproachBall":
            if (
                self._sub_tasks[self._current_sub_task].close
                and self._sub_tasks[self._current_sub_task].position_aligned
                and self._sub_tasks[self._current_sub_task].heading_aligned  # noqa
            ):
                self._current_sub_task = "CrouchToBalance"
        elif self._current_sub_task == "CrouchToBalance":
            if secs_remaining() < SECONDS_TO_FINISH_TO_KICK:
                self._current_sub_task = "Kick"
        elif self._current_sub_task == "Kick":
            if self._sub_tasks[self._current_sub_task].is_finished:
                self._current_sub_task = "AfterKick"

    def _tick(self):
        if self._current_sub_task in ("FirstApproachBall", "SecondApproachBall"):  # noqa
            if self._direction == "left":
                self._tick_sub_task(target=self._target, kick_foot=Foot.RIGHT)
            else:
                self._tick_sub_task(target=self._target, kick_foot=Foot.LEFT)
        elif self._current_sub_task == "Kick":
            if self._direction == "left":
                self._tick_sub_task(target=self._target, can_abort=False, hard=True, foot=Foot.RIGHT)
            else:
                self._tick_sub_task(target=self._target, can_abort=False, hard=True, foot=Foot.LEFT)
        else:
            self._tick_sub_task()

    def _generate_target(self):
        # self._direction = 'left'
        self._direction = choice(["left", "right"])
        target = ENEMY_GOAL_CENTER.plus(
            Vector2D(0, LEFT_SHOOT_OFFSET if self._direction == "left" else -RIGHT_SHOOT_OFFSET)
        )  # noqa
        return target
