import robot
from BehaviourTask import BehaviourTask

from util.Vector2D import Vector2D
from body.skills.Anticipate import Anticipate
from util.Constants import (
    HALF_FIELD_LENGTH,
    HALF_FIELD_WIDTH,
    PENALTY_AREA_LENGTH,
    PENALTY_AREA_WIDTH,
    PENALTY_CROSS_DISTANCE,
    GOAL_BOX_LENGTH,
    GOAL_BOX_WIDTH,
    CENTER_CIRCLE_DIAMETER,
)
from util.TeamStatus import my_player_number, get_active_player_numbers
from util.GameStatus import in_penalty_kick, we_are_kicking_team, secondary_time
from math import radians
from util.Global import myPos


class Ready(BehaviourTask):
    # Kick off positions in priority order!
    # (have these scalable against the size of the field)
    OFFENSE_POSITIONS = [
        Vector2D(-HALF_FIELD_LENGTH + 300.0, 0),  # goalkeeper
        Vector2D(
            -HALF_FIELD_LENGTH + (PENALTY_AREA_LENGTH + GOAL_BOX_LENGTH) * 0.5, -HALF_FIELD_WIDTH * 0.875 + 1500
        ),  # defender  # noqa
        Vector2D(-HALF_FIELD_LENGTH + PENALTY_AREA_LENGTH, PENALTY_AREA_WIDTH * 0.5),  # defender2  # noqa
        Vector2D(-HALF_FIELD_LENGTH * 0.50 + 300, -HALF_FIELD_WIDTH * 0.50 + 1050),  # upfielder  # noqa
        Vector2D(-HALF_FIELD_LENGTH * 0.40, HALF_FIELD_WIDTH * 0.30),  # midfielder2 # newPos P5
        Vector2D(-HALF_FIELD_LENGTH * 0.16, -HALF_FIELD_WIDTH * 0.60),  # midfield1  # noqa
        Vector2D(-HALF_FIELD_LENGTH * 0.07, 0),  # kickoff player  # noqa
    ]
    DEFENSE_POSITIONS = [
        Vector2D(-HALF_FIELD_LENGTH + 300.0, 0),  # goalkeeper
        Vector2D(-HALF_FIELD_LENGTH + PENALTY_AREA_LENGTH - 100, -(GOAL_BOX_WIDTH * 0.5) + 60.00),  # defender  # noqa
        Vector2D(-HALF_FIELD_LENGTH + PENALTY_AREA_LENGTH - 70, (GOAL_BOX_WIDTH * 0.5) - 60.00),  # defender2  # noqa
        Vector2D(-HALF_FIELD_LENGTH * 0.45, -300),  # upfielder  # noqa
        Vector2D(-HALF_FIELD_LENGTH * 0.25, HALF_FIELD_WIDTH * 0.15),  # upfielder2  # noqa
        Vector2D(-HALF_FIELD_LENGTH * 0.25, -HALF_FIELD_WIDTH * 0.75),  # midfield1  # noqa
        Vector2D(-HALF_FIELD_LENGTH * 0.20, HALF_FIELD_WIDTH * 0.75),  # kickoff player  # noqa
    ]

    # Position of the robot closest to the ball (kick off player)
    KICK_OFF_PLAYER_OFFENSE_POSITION = Vector2D(-HALF_FIELD_LENGTH * 0.07, 0)
    KICK_OFF_PLAYER_DEFENSE_POSITION = Vector2D(-HALF_FIELD_LENGTH * 0.25, HALF_FIELD_WIDTH * 0.75)

    # distance a robot needs to be from the penalty box
    # currently set equal to distance between penalty cross and penalty box
    DISTANCE_OUTSIDE_PENALTY_BOX = PENALTY_AREA_LENGTH - PENALTY_CROSS_DISTANCE

    # Position of the robot closest to the ball while going for a penalty kick
    # positioning on the penalty cross is illegal position,
    # so taking a safe distance and positioning at start of penalty box
    KICK_OFF_PLAYER_PENALTY_OFFENSE_POSITION = Vector2D(
        HALF_FIELD_LENGTH - 1.5 * PENALTY_AREA_LENGTH, PENALTY_AREA_WIDTH / 2.0 + DISTANCE_OUTSIDE_PENALTY_BOX
    )

    # position around the penalty box at DISTANCE_OUTSIDE_PENALTY_BOX distance
    # so as to keep the ball near opponent goal
    PENALTY_OFFENSE_POSITIONS = [
        Vector2D(-HALF_FIELD_LENGTH + 300.0, 0),  # goalkeeper
        Vector2D(HALF_FIELD_LENGTH - PENALTY_AREA_LENGTH - DISTANCE_OUTSIDE_PENALTY_BOX, GOAL_BOX_WIDTH / 2.0),
        Vector2D(HALF_FIELD_LENGTH - GOAL_BOX_LENGTH, PENALTY_AREA_WIDTH / 2.0 + DISTANCE_OUTSIDE_PENALTY_BOX),
        Vector2D(HALF_FIELD_LENGTH - GOAL_BOX_LENGTH, -PENALTY_AREA_WIDTH / 2.0 - DISTANCE_OUTSIDE_PENALTY_BOX),
        Vector2D(HALF_FIELD_LENGTH - PENALTY_AREA_LENGTH - DISTANCE_OUTSIDE_PENALTY_BOX, -GOAL_BOX_WIDTH / 2.0),
        Vector2D(HALF_FIELD_LENGTH - PENALTY_AREA_LENGTH - 2 * DISTANCE_OUTSIDE_PENALTY_BOX, 0),
        Vector2D(
            HALF_FIELD_LENGTH - 1.5 * PENALTY_AREA_LENGTH, PENALTY_AREA_WIDTH / 2.0 + DISTANCE_OUTSIDE_PENALTY_BOX
        ),
    ]
    # position few robots near our penalty area,
    # and few closer to center circle so as to pass the ball away from our goal
    PENALTY_DEFENSE_POSITIONS = [
        Vector2D(-HALF_FIELD_LENGTH, 0),  # goalkeeper
        Vector2D(-HALF_FIELD_LENGTH + PENALTY_AREA_LENGTH + DISTANCE_OUTSIDE_PENALTY_BOX, GOAL_BOX_WIDTH / 2.0),
        Vector2D(-HALF_FIELD_LENGTH + GOAL_BOX_LENGTH, -PENALTY_AREA_WIDTH / 2.0 - DISTANCE_OUTSIDE_PENALTY_BOX),
        Vector2D(-HALF_FIELD_LENGTH + PENALTY_AREA_LENGTH + DISTANCE_OUTSIDE_PENALTY_BOX, -GOAL_BOX_WIDTH / 2.0),
        Vector2D(-CENTER_CIRCLE_DIAMETER / 2.0, 0),
        Vector2D(-CENTER_CIRCLE_DIAMETER / 2.0, PENALTY_AREA_WIDTH / 2.0 + DISTANCE_OUTSIDE_PENALTY_BOX),
        Vector2D(-HALF_FIELD_LENGTH + GOAL_BOX_LENGTH, PENALTY_AREA_WIDTH / 2.0 + DISTANCE_OUTSIDE_PENALTY_BOX),
    ]

    # Error we allow in position and heading, for robot to stand
    STRICT_POS_ERROR = 100
    STRICT_HEADING_ERROR = radians(10)
    NON_STRICT_POS_ERROR = 200
    NON_STRICT_HEADING_ERROR = radians(10)
    GOALIE_POS_ERROR = 100
    GOALIE_HEADING_ERROR = radians(10)

    # Flexible assigning time
    FLEXIBLE_KICK_OFF_PLAYER_ASSIGNING_TIME = 20

    # Default kick off player number
    DEFAULT_KICK_OFF_PLAYER_NUMBER = 7

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Anticipate": Anticipate(self)}

    def _reset(self):
        self._current_sub_task = "Anticipate"
        self._i_am_kickoff_player = False

        # Initialise kick off player number with highest number active,
        # unless no one else is active, and am not goalie
        if not get_active_player_numbers():
            if my_player_number() == 1:
                self._kick_off_player_number = self.DEFAULT_KICK_OFF_PLAYER_NUMBER  # noqa
            else:
                self._kick_off_player_number = my_player_number()
        else:
            self._kick_off_player_number = max(get_active_player_numbers())

    def _tick(self):
        self._kick_off_player_number = self._decide_kick_off_player()
        print("kick_off_player_number: ", self._kick_off_player_number)
        self._i_am_kickoff_player = self._kick_off_player_number == my_player_number()

        final_pos = self._decide_where_to_go()
        position_error = self._decide_position_error()
        heading_error = self._decide_heading_error()

        self._tick_sub_task(final_pos, 0, position_error=position_error, heading_error=heading_error, speed=0.0)

    def _decide_kick_off_player(self):
        # If no-wifi, player 5 is kick off player
        if len(get_active_player_numbers()) == 0:
            robot.say("no wifi!")
            return self.DEFAULT_KICK_OFF_PLAYER_NUMBER

        # If we've only got goalie, 5 is kick off player
        if max(get_active_player_numbers()) == 1:
            robot.say("only got goalie!")
            return self.DEFAULT_KICK_OFF_PLAYER_NUMBER

        # If we've got enough time,
        if secondary_time() > self.FLEXIBLE_KICK_OFF_PLAYER_ASSIGNING_TIME:
            print("flexible assigning!")
            # The player of the largest active number should kick off
            return max(get_active_player_numbers())

        # If we have don't have that much time left in ready,
        return self._kick_off_player_number

    def _decide_where_to_go(self):
        my_position_index = my_player_number() - 1

        if in_penalty_kick():
            if we_are_kicking_team():
                if self._i_am_kickoff_player:
                    return self.KICK_OFF_PLAYER_PENALTY_OFFENSE_POSITION
                return self.PENALTY_OFFENSE_POSITIONS[my_position_index]
            return self.PENALTY_DEFENSE_POSITIONS[my_position_index]
        else:
            if we_are_kicking_team():
                if self._i_am_kickoff_player:
                    return self.KICK_OFF_PLAYER_OFFENSE_POSITION
                return self.OFFENSE_POSITIONS[my_position_index]
            else:
                if self._i_am_kickoff_player:
                    return self.KICK_OFF_PLAYER_DEFENSE_POSITION
                return self.DEFENSE_POSITIONS[my_position_index]

    def _decide_position_error(self):
        if self._i_am_kickoff_player:
            return self.STRICT_POS_ERROR
        elif my_player_number() == 1:
            return self.GOALIE_POS_ERROR
        elif myPos().x > -1000:
            # If robot is near centre line, be strict so we don't step on the
            # centre line
            return self.STRICT_POS_ERROR

        else:
            return self.NON_STRICT_POS_ERROR

    def _decide_heading_error(self):
        if self._i_am_kickoff_player:
            return self.STRICT_HEADING_ERROR
        elif my_player_number() == 1:
            return self.GOALIE_HEADING_ERROR
        elif myPos().x > -1000:
            # If robot is near centre line, be strict about heading so
            # we can do a good kick off / kick off charge
            return self.STRICT_HEADING_ERROR
        else:
            return self.NON_STRICT_HEADING_ERROR
