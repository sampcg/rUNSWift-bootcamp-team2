import robot
from BehaviourTask import BehaviourTask
from body.roles.PenaltyGoalie import PenaltyGoalie
from body.roles.PenaltyStriker import PenaltyStriker
from body.roles.FieldPlayer import FieldPlayer
from body.roles.Goalie import Goalie
from body.skills.Stand import Stand
from body.skills.GoalieStand import GoalieStand
from util.TeamStatus import my_player_number, player_one_is_field_player
from util.GameStatus import (
    in_penaltyshoot_phase,
    in_initial,
    in_finished,
    in_standby,
    penalised,
    we_are_kicking_team,
    game_state,
    prev_game_state,
    GameState,
    whistle_detected,
)
from util.Constants import LEDColour, KICKOFF_MIN_WAIT
from audio.whistle_controller import kill_all_python_processes, start_listening_for_whistles
from util.Timer import Timer
from util.GameStatus import in_set, secs_till_unpenalised


class Game(BehaviourTask):

    """
    Description:
    A skill to deal with a game environment. This task should be specific
    to a game of soccer, using a GameController.

    NOTE:
    We launch and kill the whistle detecor from here, but the cpp side
    detects whether we have detected a whistle and updates the game state.
    That is why there is no logic to do with detecting a whistle here.
    """

    # Colours to display on chest for each GC state.
    GC_STATE_TO_CHEST_LED_MAP = {
        GameState.INITIAL: LEDColour.off,
        GameState.STANDBY: LEDColour.cyan,
        GameState.READY: LEDColour.blue,
        GameState.SET: LEDColour.yellow,
        GameState.PLAYING: LEDColour.green,
        GameState.FINISHED: LEDColour.off,
    }

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "Goalie": Goalie(self),
            "FieldPlayer": FieldPlayer(self),
            "PenaltyGoalie": PenaltyGoalie(self),
            "PenaltyStriker": PenaltyStriker(self),
            "Stand": Stand(self),
            "GoalieStand": GoalieStand(self),
        }

    def _reset(self):
        self._current_sub_task = "Stand"
        self._kick_off_timer = Timer(KICKOFF_MIN_WAIT)
        self._last_said_number = None

    def _transition(self):
        if penalised() or in_initial() or in_standby() or in_finished():
            self._current_sub_task = "Stand"
        elif self._should_be_penalty_striker():
            if in_set():
                self._current_sub_task = "Stand"
            else:
                self._current_sub_task = "PenaltyStriker"
        elif self._should_be_penalty_goalie():
            if in_set():
                self._current_sub_task = "GoalieStand"
            else:
                self._current_sub_task = "PenaltyGoalie"
        elif not player_one_is_field_player() and my_player_number() == 1:
            self._current_sub_task = "Goalie"
        else:
            self._current_sub_task = "FieldPlayer"

    def _tick(self):
        # Chest led must follow the rules in the rulebook
        if penalised():
            self.world.b_request.actions.leds.chestButton = LEDColour.red
            if not in_penaltyshoot_phase():
                if secs_till_unpenalised() == 0:
                    robot.say("Unpenalise me")
                elif secs_till_unpenalised() == 10:
                    robot.say("Unpenalise me in")
                elif secs_till_unpenalised() < 10:
                    if self._last_said_number is not secs_till_unpenalised():
                        robot.say(str(secs_till_unpenalised()))
                        self._last_said_number = secs_till_unpenalised()
        else:
            self.world.b_request.actions.leds.chestButton = self.GC_STATE_TO_CHEST_LED_MAP[game_state()]

        # Use foot leds to indicate if we're kicking off (debugging purpose)
        self.world.b_request.actions.leds.leftFoot = LEDColour.white if we_are_kicking_team() else LEDColour.off
        self.world.b_request.actions.leds.rightFoot = LEDColour.white if we_are_kicking_team() else LEDColour.off

        # Launch or kill whistle detector if necessary (to save CPU)
        if not self._is_state_to_run_whistle_detector(prev_game_state()) and self._is_state_to_run_whistle_detector(
            game_state()
        ):
            start_listening_for_whistles()
        if self._is_state_to_run_whistle_detector(prev_game_state()) and not self._is_state_to_run_whistle_detector(
            game_state()
        ):
            kill_all_python_processes()

        # Update kick off timer
        if prev_game_state() is GameState.SET and game_state() is GameState.PLAYING:
            # If we acted through the whistle, we start a timer
            if whistle_detected():
                self._kick_off_timer.restart()
                self.world.in_kick_off_wait_time = True
            # If we didn't hear a whistle, we got the "PLAYING" packet
            # from GC, we should immediately start playing
            else:
                self.world.in_kick_off_wait_time = False
        if self.world.in_kick_off_wait_time and self._kick_off_timer.finished():
            self.world.in_kick_off_wait_time = False

        # Tick sub task!
        self._tick_sub_task()

    def _should_be_penalty_striker(self):
        return in_penaltyshoot_phase() and we_are_kicking_team()

    def _should_be_penalty_goalie(self):
        return in_penaltyshoot_phase() and not we_are_kicking_team()

    def _is_state_to_run_whistle_detector(self, state):
        return state in (GameState.READY, GameState.SET)
