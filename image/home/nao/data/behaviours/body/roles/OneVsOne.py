from robot import Foot, say
from math import radians
from body.skills.ApproachBall import ApproachBall
from body.skills.Kick import Kick
from util.FieldGeometry import (
    ENEMY_GOAL_BEHIND_CENTER,
    ENEMY_GOAL_INNER_RIGHT,
    ENEMY_GOAL_INNER_LEFT,
)
from util.MathUtil import angleDiff, normalisedTheta
from BehaviourTask import BehaviourTask
from body.skills.SearchHalfField import SearchHalfField
from body.skills.Anticipate import Anticipate
from body.skills.Stand import Stand
from body.skills.Sit import Sit
from util.Timer import WallTimer
from util.Global import ballWorldPos
from util.Constants import HALF_FIELD_WIDTH, HALF_FIELD_LENGTH, GOAL_BOX_WIDTH
from util.Vector2D import Vector2D
from util.GameStatus import (
    in_penaltyshoot_phase,
    in_initial,
    in_ready,
    in_set,
    in_finished,
    penalised,
    game_state,
    prev_game_state,
    GameState,
    secs_till_unpenalised,
)
from util.Constants import LEDColour
from audio.whistle_controller import kill_all_python_processes, start_listening_for_whistles

STARTING_POSITION = Vector2D(-HALF_FIELD_LENGTH + 200, GOAL_BOX_WIDTH / 2)


class OneVsOne(BehaviourTask):
    """
    Description:
    Behaviour file for 2021 Challenge 3 - 1 Vs 1

    This class handles all game controller interactions
    """

    # Colours to display on chest for each GC state.
    GC_STATE_TO_CHEST_LED_MAP = {
        GameState.INITIAL: LEDColour.off,
        GameState.READY: LEDColour.blue,
        GameState.SET: LEDColour.yellow,
        GameState.PLAYING: LEDColour.green,
        GameState.FINISHED: LEDColour.off,
    }

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "Stand": Stand(self),
            "Ready": Anticipate(self),
            "Playing": OneVsOneBase(self),
            "Finish": Sit(self),
        }

    def _transition(self):
        if in_initial() or in_set() or penalised():
            self._current_sub_task = "Stand"
        elif in_ready():
            self._current_sub_task = "Ready"
        elif in_finished():
            self._current_sub_task = "Finish"
        else:
            self._current_sub_task = "Playing"

    def _tick(self):
        # Chest led must follow the rules in the rulebook
        if penalised():
            self.world.b_request.actions.leds.chestButton = LEDColour.red
            if not in_penaltyshoot_phase():
                if secs_till_unpenalised() == 0:
                    say("Unpenalise me")
                elif secs_till_unpenalised() == 10:
                    say("Unpenalise me in")
                elif secs_till_unpenalised() < 10:
                    if self._last_said_number is not secs_till_unpenalised():
                        say(str(secs_till_unpenalised()))
                        self._last_said_number = secs_till_unpenalised()
        else:
            self.world.b_request.actions.leds.chestButton = self.GC_STATE_TO_CHEST_LED_MAP[game_state()]

        # Launch or kill whistle detector if necessary (to save CPU)
        if not self._is_state_to_run_whistle_detector(prev_game_state()) and self._is_state_to_run_whistle_detector(
            game_state()
        ):
            start_listening_for_whistles()
        if self._is_state_to_run_whistle_detector(prev_game_state()) and not self._is_state_to_run_whistle_detector(
            game_state()
        ):
            kill_all_python_processes()

        if self._current_sub_task == "Ready":
            self._tick_sub_task(position=STARTING_POSITION)
        else:
            self._tick_sub_task()

    def _reset(self):
        self._current_sub_task = "Initial"
        self._last_said_number = None

    def _is_state_to_run_whistle_detector(self, state):
        return state in (GameState.READY, GameState.SET)


class OneVsOneBase(BehaviourTask):
    """
    Description:
    Behaviour file for 2021 Challenge 3 - 1 Vs 1
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "Shoot": Shoot(self),
            "FindBall": SearchHalfField(self),
            "NoBall": Anticipate(self),
        }

    def _transition(self):
        curr_task = self._current_sub_task
        if ballWorldPos().x < 0:
            self._current_sub_task = "Shoot"
        elif self._current_sub_task == "Shoot" and ballWorldPos().x >= 0:
            self._current_sub_task = "FindBall"
        elif self._current_sub_task == "FindBall" and self._sub_tasks[self._current_sub_task].finished:
            self._current_sub_task = "NoBall"
        elif self._current_sub_task == "NoBall" and self._timer.elapsedSeconds() > 40:
            self._current_sub_task = "FindBall"
        print("Current sub task:", self._current_sub_task, "Ball world pos:", ballWorldPos())

        if curr_task != self._current_sub_task:
            self._timer = WallTimer()

    def _tick(self):
        self.world.b_request.behaviourSharedData.playingBall = True  # OneVsOne so we're always the ball player...
        if self._current_sub_task == "Shoot":
            self._tick_sub_task()
        elif self._current_sub_task == "FindBall":
            self._tick_sub_task()
        elif self._current_sub_task == "NoBall":
            self._tick_sub_task(position=Vector2D(-HALF_FIELD_LENGTH + 100, 0))

    def _reset(self):
        self._current_sub_task = "Shoot"


LINEUP_DISTANCE_DRIBBLE = 40  # mm
LINEUP_DISTANCE_KICK = 100  # mm


class Shoot(BehaviourTask):
    """
    Go to the ball and shoot
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"ApproachBall": ApproachBall(self), "Kick": Kick(self)}

    def _reset(self):
        self._current_sub_task = "ApproachBall"
        self.has_finished_kick = False
        self.in_corner = False
        self._last_foot = Foot.LEFT

    def _transition(self):
        if self._current_sub_task == "ApproachBall":
            self.has_finished_kick = False
            if (
                self._sub_tasks[self._current_sub_task].close
                and self._sub_tasks[self._current_sub_task].position_aligned
                and self._sub_tasks[self._current_sub_task].heading_aligned  # noqa
            ):
                self._current_sub_task = "Kick"

        elif self._current_sub_task == "Kick":
            if self._sub_tasks[self._current_sub_task].is_finished:
                self._current_sub_task = "ApproachBall"
                self.has_finished_kick = True

    def _tick(self):
        target = ENEMY_GOAL_BEHIND_CENTER
        foot = Foot.LEFT
        hard = True
        heading_error = radians(10)

        # TODO: just kick with whichever foot is closest
        # in general, want to kick with the left foot if on left side and
        # vice-versa so we cover the in side with our body.
        # set default here then can override below if in specific
        # situation
        if self._last_foot is Foot.LEFT:
            if ballWorldPos().y < -0.05 * HALF_FIELD_WIDTH:
                foot = Foot.RIGHT
            else:
                foot = Foot.LEFT
        elif self._last_foot is Foot.RIGHT:
            if ballWorldPos().y > 0.05 * HALF_FIELD_WIDTH:
                foot = Foot.LEFT
            else:
                foot = Foot.RIGHT

        if ballWorldPos().x < min(-2000, -HALF_FIELD_LENGTH / 2):
            # Kick the ball towards the center circle so we
            # can score goals more reliably
            target = Vector2D(-800, 0)
            hard = False

        else:
            # Always aim for the goal
            angle_to_left_post = ENEMY_GOAL_INNER_LEFT.minus(ballWorldPos()).heading()
            angle_to_right_post = ENEMY_GOAL_INNER_RIGHT.minus(ballWorldPos()).heading()
            heading_error = angleDiff(angle_to_left_post, angle_to_right_post) / 2

            target_angle = normalisedTheta(angle_to_left_post + angle_to_right_post) / 2
            target = ballWorldPos().plus(Vector2D(1000, 0).rotate(target_angle))
            hard = True

        # back up foot choice
        self._last_foot = foot

        # Write some debug info
        debug_info = self.world.b_request.behaviourDebugInfo
        debug_info.haveBallManoeuvreTarget = True
        debug_info.ballManoeuvreTargetX = target.x
        debug_info.ballManoeuvreTargetY = target.y
        debug_info.ballManoeuvreHeadingError = heading_error
        debug_info.ballManoeuvreHard = hard

        if self._current_sub_task == "ApproachBall":
            self._tick_sub_task(
                target=target,
                kick_foot=foot,
                heading_error=heading_error,
                distance_error=40,
                lineup_distance=LINEUP_DISTANCE_KICK,
                use_line_up_map=True,
            )

        elif self._current_sub_task == "Kick":
            self._tick_sub_task(
                target=target,
                foot=foot,
                hard=hard,
                heading_error=heading_error,
                can_abort=True,
                extra_stable=False,
            )
