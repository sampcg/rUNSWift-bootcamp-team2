from BehaviourTask import BehaviourTask

from body.skills.Stand import Stand
from body.skills.Sit import Sit
from body.skills.BlockIntercept import BlockIntercept
from body.skills.Crouch import Crouch
from body.skills.P2PPass import P2PPass
from body.skills.ApproachBall import ApproachBall
from body.skills.Dribble import Dribble
from body.skills.FindBall import FindBall
from body.skills.Initial import Initial

from body.skills.AdaptiveScan import AdaptiveScan
from body.skills.WalkToPointFacingFinalHeading import WalkToPointFacingFinalHeading

from util.Global import myPos, myHeading, ballWorldPos, ballLostTime, robotObstaclesList, ballRelVel
from util.TeamStatus import (
    get_active_player_numbers,
    my_player_number,
)
from util.GameStatus import (
    in_penaltyshoot_phase,
    in_initial,
    in_set,
    in_finished,
    penalised,
    game_state,
    prev_game_state,
    GameState,
    secs_till_unpenalised,
)
from util.Vector2D import Vector2D
from util.BallMovement import timeToReachCoronalPlaneWithFriction, YWhenReachCoronalPlane, stopRelPos
from util.Timer import WallTimer
from util.Timer import Timer
from util.Hysteresis import Hysteresis
from robot import Foot
from util.Constants import LEDColour
from audio.whistle_controller import kill_all_python_processes, start_listening_for_whistles

import robot
import math

POSITION_ERROR_MM = 100  # was 1000 which was too large (The anticipated position error allowed)

BLOCK_SIDE_LIMIT_MM = 700  # maximum side length that we can block (mm)
BALL_MOVING_SPEED_THRESH_MM_PER_SEC = 300  # mm /s

RED_ZONE_1_TOP_LEFT = Vector2D(750, 3000)
RED_ZONE_1_BOTTOM_RIGHT = Vector2D(750 + 2450, 550)
POS_A = Vector2D(750 + 600, 550 + 600 * 3)
POS_B = Vector2D(750 + 600 * 2, 550 + 600 * 2)
POS_C = Vector2D(750 + 600 * 3, 550 + 600)

BLUE_ZONE_TOP_LEFT = Vector2D(750, 550)
BLUE_ZONE_BOTTOM_RIGHT = Vector2D(750 + 2450, -550)
POS_D = Vector2D(750 + 600, 0)
POS_E = Vector2D(750 + 600 * 2, 0)
POS_F = Vector2D(750 + 600 * 3, 0)

RED_ZONE_2_TOP_LEFT = Vector2D(750, -550)
RED_ZONE_2_BOTTOM_RIGHT = Vector2D(750 + 2450, -3000)
POS_G = Vector2D(750 + 600, -3000 + 600 * 3)
POS_H = Vector2D(750 + 600 * 2, -3000 + 600 * 2)
POS_I = Vector2D(750 + 600 * 3, -3000 + 600)

# Where to stand to detect D or E
Y_DETECT_OFFSET = 1570  # 1470  # 1000
X_BWN_DE = 1650
X_BWN_EF = 2250
POS2DETECT_DE1 = Vector2D(X_BWN_DE, Y_DETECT_OFFSET)  # in red zone 1
POS2DETECT_DE2 = Vector2D(X_BWN_DE, -Y_DETECT_OFFSET)  # in red zone 2

# Where to stand to detect E or F
POS2DETECT_EF1 = Vector2D(X_BWN_EF, Y_DETECT_OFFSET)  # in red zone 1
POS2DETECT_EF2 = Vector2D(X_BWN_EF, -Y_DETECT_OFFSET)  # in red zone 2

ATTACKER1_INIT_WAIT_POS = POS2DETECT_DE1
ATTACKER2_INIT_WAIT_POS = POS2DETECT_DE2

# The following three values of the variables appear to be important
# for accurate and fast detection of defenders. Tuned. May be fine-tuned in future.
MAX_DIFF2POS2DETECT = 100  # 300 (too large)
MAX_DIFFANGLE2POS2DETECT = 7  # degree
MAX_DIFF2DEFENDER = 200  # mm

MIN_DIST_DIFF = 100  # minimum difference in distance in closest() method. *Not called.

VISION_ROBOT_HYSTERESIS_THRESHOLD = 35

BALL_POS_X_ERROR_ALLOWED_MM = 350  # was 500
BALL_POS_Y_ERROR_ALLOWED_MM = 350  # was 500

SLOPE_DIFF_MINIMUM = 0.1

DefenderPos_Dict = {"D": POS_D, "E": POS_E, "F": POS_F}
Defender_Dict = {"D": 0, "E": 0, "F": 0}  # records no of confirmation that D, E, or F exists
Defender_Dict2 = {"D": 0, "E": 0, "F": 0}  # records no of confirmation that D, E, or F exists
Robot_Dict = {}
Robot_Dict2 = {}

# In Simulation, how to put the defenders exactly in POS_E and POS_F is shown in
# https://runswift.slack.com/archives/C01PP7TGU9X/p1618034455017000
# To make the attackers start playing the ball without detecting the absent defender,
# "D" may be manually removed from the following variables below.
Defender_Set = {"D", "E", "F"}
Defender_Set2 = {"D", "E", "F"}

DETECTION_THERESHOLD = 100  # 2, 5, 10

# print related
LOG_PRT_MAIN = False  # most other printing
LOG_ESSENTIAL = True  # set True to make exceptions when LOG_PRT_MAIN = False
PRINT_LOG_SKIP = 200
print_log_cnt = 0

# defenders are detected using getVisionRobotObstacles().
# FIND_DEFENDER var lets findDefenders() also detect defenders at the same time
FIND_DEFENDER = True

temp_flag = False
Absent_Defender_ID = -1

# Currently, blackboard related codes interfere with detecting defenders (unknown reason)
# BLACKBOARD_RELATED = False  # this var being false may not be enough
# the code between v-SHARE DETECTION and # ^- may need to be commented out

# this value is set by only one player without the ball in the red zone, that first detected defenders
ABSENT_DEFENDER = ""

LINEUP_DISTANCE_DRIBBLE = 100  # mm, the same variable defined in Shoot class. Tried 100.
LINEUP_DISTANCE_KICK = 100  # mm, the same variable defined in Shoot class. Unused.

# The sender dribble to the centre of largest gap if the difference
# between the x coordinates of the gap and the ball is not less than DRIBBLE_THRESHOLD_X.
# DRIBBLE_THRESHOLD_X may require to be smaller if the absolute value of y coordinate of the ball is smaller
DRIBBLE_THRESHOLD_X = 300  # 300=>350: because dribbling to left and right too often
# =>300 to reduce the chance hit the defender
DRIBBLE_THRESHOLD_Y = 1750  # 2000. 1800 can make the robot dribble the ball too near the blue zone
# 2100=>1900: dribble closer to BZ and pass => decrease the chance to hit a defender
# 1900=>1850: dribble more closer to BZ and pass => decrease the chance to hit a defender

# - tends to be inaccurate (hitting the defenders)
DRIBBLE_THRESHOLD_BZ_Y = 200  # not used

LARGEST_GAP_ONLY = True


class P2PPassing2021(BehaviourTask):
    """
    Description:
    Behaviour file for 2021 Passing Challenge
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
            "Initial": Initial(self),
            "Stand": Stand(self),
            "Set": Stand(self),
            "Playing": P2PPassing2021Base(self),
            "Finish": Sit(self),
        }

    def _transition(self):
        # print("GAME STATE: " + str(game_state()))
        if in_initial():
            self._current_sub_task = "Initial"
        elif in_set() or penalised():
            self._current_sub_task = "Stand"
        elif in_finished():
            self._current_sub_task = "Finish"
        else:
            self._current_sub_task = "Playing"

    def _tick(self):
        self.world.blackboard.stop_scan_var = False

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

        # Launch or kill whistle detector if necessary (to save CPU)
        if not self._is_state_to_run_whistle_detector(prev_game_state()) and self._is_state_to_run_whistle_detector(
            game_state()
        ):
            start_listening_for_whistles()
        if self._is_state_to_run_whistle_detector(prev_game_state()) and not self._is_state_to_run_whistle_detector(
            game_state()
        ):
            kill_all_python_processes()

        self._tick_sub_task()

    def _reset(self):
        self._current_sub_task = "Initial"

    def _is_state_to_run_whistle_detector(self, state):
        return state in (GameState.READY, GameState.SET)


class P2PPassing2021Base(BehaviourTask):
    """
    Acknowledgement: The coding for P2PPassing2021Base Class was initially based on P2PPassing Class @
    https://github.com/UNSWComputing/rUNSWift/blob/959a7d0b02ca3e84f7b8df7338ccaf7e4c7f8ec0/image/home/nao/data/
    behaviours/body/test/P2PPassing.py (184 lines)
    which was extremely useful and helped kick-start the coding for P2PPassing2021.py (1000+ lines)
    customised for the Passing Challenge of RoboCup 2021.

    Note: To complete the fine-tuned passing logic, if statement related to DRIBBLE_THRESHOLD_X in should_dribble()
    called by _transition() should be adjusted according to if statement related to DRIBBLE_THRESHOLD_X
    in _decide_parameters(self) called by _tick()

    If there is only one attacker, it just crouches (stand still).

    DETECTING THE DEFENDERS
    Initially the detection of the defenders is done before passing the ball.
    a) Each robot goes to a position between D & E and then to another position between E & F.
    b) Each robot uses AdaptiveScan headskill to detect the defenders.
       After two defenders are confirmed, one absent defender is removed from Defender_Set2.

    (An issue to solve) However, the robot looks at the ball during the detection stage.
    This causes the detection inaccurate (not reliable at all).
    The coding has been done using self.world.blackboard.stop_scan_var.

    Removing one defender may happen instantly but sometimes a few seconds.

    The following 1> and 2> happen at the same time.
    1> lets the robots to stand in the right positions for detection
    We rely on 2>'s detection. If 1> is removed, 2> does not work well and becomes less reliable.

    1> Initially, Defender_Set is filled with three defenders {"D", "E", "F"}.
    The attacker with no ball in its red zone detects the defenders.
    This attacker stands between D and E to collect information using getVisionRobotObstacles()
    Once done, this attacker stands between E and F to collect information using getVisionRobotObstacles()

    2> Defender_Set2 is filled with three defenders {"D", "E", "F"}.
    findDefenders() records the closest one among D, E, and F
    if the robot in the robotObstaclesList() is inside Blue Zone.
    One absent defender is from the list, that attacker starts other skills (e.g., the FindBall skill)

    Currently, P2PPassing2021 is configured to use 2>'s detection result.

    In the following, 1) is related to 1> but may influence or help 2>
    because the attackers stand in the two different spots good for the detection.
    1) Two attackers can detect the defenders at the same time by:
            letAttacker2Detect = True
            letAttacker1Detect = True  # was False
            if self.WhereIsBall(ball) == "r2":  # then let attacker 1 detect defenders
                letAttacker2Detect = True   # was False
                letAttacker1Detect = True
    in _tick method.

    2) The attacker with no ball in its red zone can share the absent defender ID (1: D, 2: E, 3: F)
            This feature is not working.
            The relevant code is removed at the moment.

    PLAYING THE PASSING CHALLENGE
    When the attacker is the sender:
    the sender dribble toward the blue zone if the ball is too far from it
    the sender dribble to the centre of largest gap if the difference
    between the x coordinates of the gap and the ball is not less than DRIBBLE_THRESHOLD_X.
    The sender pass the ball through the centre of the largest gap.

    When the attacker is the receiver:
    it moves to self.get_anticipate_position().
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "BlockIntercept": BlockIntercept(self),
            "Crouch": Crouch(self),
            "Pass": P2PPass(self),
            "Dribble": Dribble(self),
            "GoToAnticipatePosition": WalkToPointFacingFinalHeading(self),
            "ApproachBall": ApproachBall(self),
            "FindBall": FindBall(self),
            "AdaptiveScan": AdaptiveScan(self),
        }

    def _reset(self):
        self._current_sub_task = "Crouch"
        self._kick_timer = None
        self.leftVisionRobotClearHysteresis = Hysteresis(0, VISION_ROBOT_HYSTERESIS_THRESHOLD)
        self.rightVisionRobotClearHysteresis = Hysteresis(0, VISION_ROBOT_HYSTERESIS_THRESHOLD)
        self._should_play_ball = False
        self._GoToTimer = Timer(timeTarget=5000000).start()

    def _transition(self):
        global Defender_Set
        global Defender_Set2
        global print_log_cnt
        self.player_numbers = get_active_player_numbers()
        self.player_numbers.sort()
        self.num_players = len(self.player_numbers)

        if not self._GoToTimer.finished():
            self.anticipate_position = self.get_anticipate_position()
            self._current_sub_task = "GoToAnticipatePosition"
            self._should_play_ball = False
        elif self.get_my_zone_no() > 0:
            if len(Defender_Set2) > 2:
                self.anticipate_position = self.get_anticipate_position()
                self._current_sub_task = "GoToAnticipatePosition"
                self._should_play_ball = False
            elif len(Defender_Set2) == 2:
                self._should_play_ball = self.should_play_ball()
                if not self._should_play_ball:
                    self.anticipate_position = self.get_anticipate_position()
            else:
                self._should_play_ball = False

            if FIND_DEFENDER:
                if len(Defender_Set2) > 2:
                    self.findDefenders()
                else:
                    self.world.blackboard.stop_scan_var = True

            if self.num_players in (0, 1):
                self._current_sub_task = "Crouch"
            elif len(Defender_Set2) == 2 and self._should_play_ball:  # should_play_ball():  #
                if self.should_block_intercept():
                    self._current_sub_task = "BlockIntercept"
                else:
                    # adding Dribble
                    # if required to dribble to the center, the task should be ApproachBall<=>Dribble
                    # until the ball is near the centre.
                    if (
                        ballLostTime() > 10 and self.get_my_zone_no() > 0 and self.inside_my_zone()
                    ):  # when it was 5, the robots seemed not behaviouring normally.
                        self._current_sub_task = "FindBall"
                    elif self.should_dribble():
                        if self._current_sub_task == "ApproachBall":
                            if (
                                self._sub_tasks[self._current_sub_task].close
                                and self._sub_tasks[self._current_sub_task].position_aligned
                                and self._sub_tasks[self._current_sub_task].heading_aligned
                            ):
                                self._current_sub_task = "Dribble"
                        elif self._current_sub_task == "Dribble":
                            if self._sub_tasks[self._current_sub_task].is_finished:
                                self._current_sub_task = "ApproachBall"
                        else:
                            self._current_sub_task = "ApproachBall"
                    else:
                        self._current_sub_task = "Pass"
            elif not self.close_to_anticipate_position():
                if len(Defender_Set2) > 2:
                    self._current_sub_task = "GoToAnticipatePosition"
                elif ballLostTime() > 10 and self.get_my_zone_no() > 0 and self.inside_my_zone():
                    self._current_sub_task = "FindBall"
                else:
                    self._current_sub_task = "GoToAnticipatePosition"
            else:
                if len(Defender_Set2) > 2:
                    if self.close_to_anticipate_position():
                        self._current_sub_task = "AdaptiveScan"  # "GoToAnticipatePosition"  # "Spin"
                    else:
                        self._current_sub_task = "GoToAnticipatePosition"
                else:
                    self._current_sub_task = "FindBall"

    def should_dribble(self):
        dribble = False
        gap = DefenderPos_Dict[self.AbsentDefender(Defender_Set2)]
        if abs(ballWorldPos().x - gap.x) >= DRIBBLE_THRESHOLD_X or abs(ballWorldPos().y) >= DRIBBLE_THRESHOLD_Y:
            dribble = True
        return dribble

    def should_kick_hard(self):
        kick_hard = False
        if abs(ballWorldPos().y) >= 2200:  # when 2000, kick was too hard and the ball went outside
            kick_hard = True
        return kick_hard

    def _tick(self):
        (
            target,
            foot,
            hard,
            heading_error,
            distance_error,
            lineup_distance,
            use_line_up_map,
            dribble_forwards,
            extra_stable,
        ) = self._decide_parameters()

        global Defender_Dict
        global Defender_Set
        global Defender_Set2
        global Defender_Dict2
        global Robot_Dict
        global ATTACKER1_INIT_WAIT_POS
        global ATTACKER2_INIT_WAIT_POS
        global temp_flag
        global Absent_Defender_ID
        global ABSENT_DEFENDER
        global print_log_cnt

        if LOG_PRT_MAIN or LOG_ESSENTIAL:
            print_log_cnt += 1
            if print_log_cnt >= PRINT_LOG_SKIP:
                print_log_cnt = 0
                print("sub task: " + self._current_sub_task)
                print(
                    "defenders: "
                    + str(Defender_Set)
                    + " "
                    + str(Defender_Set2)
                    + " for player "
                    + str(self.player_numbers.index(my_player_number()))
                )
                print(
                    "defenders count: "
                    + str(Defender_Dict)
                    + " "
                    + str(Defender_Dict2)
                    + " for player "
                    + str(self.player_numbers.index(my_player_number()))
                )

        if len(Defender_Set2) > 2:
            self.world.blackboard.stop_scan_var = False
        else:
            self.world.blackboard.stop_scan_var = True

        if my_player_number() not in get_active_player_numbers():
            return

        if len(Defender_Set2) > 2:
            if FIND_DEFENDER:
                self.findDefenders()

        # -v detecting absence and presence of defenders
        if len(Defender_Set2) > 2:
            if my_player_number() not in get_active_player_numbers():
                return
            my_index = self.player_numbers.index(my_player_number())

            # Let attacker 2 detect defenders (if the ball is with Attacker 1)
            # At the moment, both are detecting defenders at the same time.
            # So, both letAttacker1Detect and letAttacker2Detect are True
            letAttacker2Detect = True
            letAttacker1Detect = True  # was False
            # determine whether the ball is in redzone 1 or 2
            if self.WhereIsBall(ballWorldPos()) == "r2":  # then let attacker 1 detect defenders
                letAttacker2Detect = True  # was False
                letAttacker1Detect = True

            # currently player 1 (index 0) is assumed in RZ1.
            if ATTACKER1_INIT_WAIT_POS == POS2DETECT_DE1:
                if my_index % 2 == 0 and letAttacker1Detect:
                    _nearest_robot_obstacles = self.getVisionRobotObstacles()
                    if self.closedistance(myPos(), ATTACKER1_INIT_WAIT_POS) and self.closeangle(myHeading(), -90):
                        if _nearest_robot_obstacles == "LEFT":  # E is detected. if POS_D is closer, D does not exist.
                            Defender_Dict["E"] += 1
                            Robot_Dict["D^E E" + str(Defender_Dict["E"])] = _nearest_robot_obstacles
                        elif _nearest_robot_obstacles == "RIGHT":
                            Defender_Dict["D"] += 1
                            Robot_Dict["D^E D" + str(Defender_Dict["D"])] = _nearest_robot_obstacles
                elif letAttacker2Detect:
                    _nearest_robot_obstacles2 = self.getVisionRobotObstacles()
                    if self.closedistance(myPos(), ATTACKER2_INIT_WAIT_POS) and self.closeangle(myHeading(), 90):
                        if _nearest_robot_obstacles2 == "LEFT":  # D is detected. if POS_E is closer, E does not exist.
                            Defender_Dict["D"] += 1
                            Robot_Dict["D^E D" + str(Defender_Dict["D"])] = _nearest_robot_obstacles2
                        elif _nearest_robot_obstacles2 == "RIGHT":
                            Defender_Dict["E"] += 1
                            Robot_Dict["D^E E" + str(Defender_Dict["E"])] = _nearest_robot_obstacles2
                if (
                    Defender_Dict["D"] >= DETECTION_THERESHOLD or Defender_Dict["E"] >= DETECTION_THERESHOLD
                ):  # these number may be fine-tuned.
                    # Now, let the attacker stand between E and F.
                    ATTACKER1_INIT_WAIT_POS = POS2DETECT_EF1
                    ATTACKER2_INIT_WAIT_POS = POS2DETECT_EF2
            else:  # if ATTACKER1_INIT_WAIT_POS == POS2DETECT_EF1:
                if my_index % 2 == 0 and letAttacker1Detect:
                    _nearest_robot_obstacles = self.getVisionRobotObstacles()
                    if self.closedistance(myPos(), ATTACKER1_INIT_WAIT_POS) and self.closeangle(myHeading(), -90):
                        if _nearest_robot_obstacles == "LEFT":  # E is detected. if POS_D is closer, D does not exist.
                            Defender_Dict["F"] += 1
                            Robot_Dict["E^F F" + str(Defender_Dict["F"])] = _nearest_robot_obstacles
                        elif _nearest_robot_obstacles == "RIGHT":
                            Defender_Dict["E"] += 1
                            Robot_Dict["E^F E" + str(Defender_Dict["E"])] = _nearest_robot_obstacles
                elif letAttacker2Detect:
                    _nearest_robot_obstacles2 = self.getVisionRobotObstacles()
                    if self.closedistance(myPos(), ATTACKER2_INIT_WAIT_POS) and self.closeangle(myHeading(), 90):
                        if _nearest_robot_obstacles2 == "LEFT":  # D is detected. if POS_E is closer, E does not exist.
                            Defender_Dict["E"] += 1
                            Robot_Dict["E^F E" + str(Defender_Dict["E"])] = _nearest_robot_obstacles2
                        elif _nearest_robot_obstacles2 == "RIGHT":
                            Defender_Dict["F"] += 1
                            Robot_Dict["E^F F" + str(Defender_Dict["F"])] = _nearest_robot_obstacles2
                if Defender_Dict["F"] >= DETECTION_THERESHOLD or Defender_Dict["E"] >= DETECTION_THERESHOLD * 2:
                    # determine abscent defender
                    if not self.TwoOrMoreZeroCounts(Defender_Dict, Defender_Set):
                        if Defender_Dict["D"] == 0:
                            Defender_Set.remove("D")
                        elif Defender_Dict["E"] == 0:
                            Defender_Set.remove("E")
                        elif Defender_Dict["F"] == 0:
                            Defender_Set.remove("F")
                        # if there are still three defenders, remove one with the smallest count
                        self.RemoveLeastCount(Defender_Dict, Defender_Set)

                        if len(Defender_Set) == 2:
                            temp_flag = True
        else:
            if LOG_PRT_MAIN:
                print(
                    "!!!!!!!!!!!!!!!!!!!!!!!!! One absent defender removed. Playing normally against two defenders ("
                    + str(Defender_Set)
                    + ")"
                )

        if not self._GoToTimer.finished():
            self.anticipate_position = self.get_anticipate_position()
            self._current_sub_task = "GoToAnticipatePosition"
            self._should_play_ball = False
            self._tick_sub_task(
                final_pos=self.anticipate_position,
                final_heading=myPos().headingTo(Vector2D(ATTACKER1_INIT_WAIT_POS.x, 0)),
            )  # ATTACKER1_INIT_WAIT_POS.x == ATTACKER2_INIT_WAIT_POS.x. To face each other (90, -90 degree)
        elif self._should_play_ball and self._current_sub_task == "Pass":
            pass_directional_aim_pos = self.get_direction_to_closest_largest_gap()
            if pass_directional_aim_pos is not None:
                myzone = self.get_my_zone()
                pass_directional_aim_pos = Vector2D(pass_directional_aim_pos.x, -(myzone[0].y + myzone[1].y) / 3.65)

                lineup_dist = LINEUP_DISTANCE_KICK  # 100

                # decide to kick hard or not
                kickhard = self.should_kick_hard()
                if kickhard:
                    lineup_dist = LINEUP_DISTANCE_KICK + 50  # kick hard is too hard so make foot distant

                self._tick_sub_task(pass_target=pass_directional_aim_pos, lineup_dist=lineup_dist, kickhard=kickhard)
        elif self._current_sub_task == "GoToAnticipatePosition":
            if len(Defender_Set2) > 2:
                self._tick_sub_task(
                    final_pos=self.anticipate_position,
                    final_heading=myPos().headingTo(Vector2D(ATTACKER1_INIT_WAIT_POS.x, 0)),
                )  # ATTACKER1_INIT_WAIT_POS.x == ATTACKER2_INIT_WAIT_POS.x. To face each other (90, -90 degree)
            elif len(Defender_Set2) == 2:
                self._tick_sub_task(final_pos=self.anticipate_position, final_heading=myPos().headingTo(ballWorldPos()))
        elif self._should_play_ball and self._current_sub_task == "ApproachBall":
            self._tick_sub_task(
                target=target,
                kick_foot=foot,
                heading_error=heading_error,
                distance_error=distance_error,
                lineup_distance=lineup_distance,
                use_line_up_map=use_line_up_map,
            )
        elif self._should_play_ball and self._current_sub_task == "Dribble":
            self._tick_sub_task(dribble_forwards=dribble_forwards)  # , can_abort=True)
        else:
            self._tick_sub_task()  # including AdaptiveScan, FindBall

        if self._should_play_ball:
            self.world.b_request.behaviourSharedData.playingBall = True

        if self._current_sub_task == "Pass":  # "Kick":
            if self._sub_tasks[self._current_sub_task].has_finished_kick:  # is_finished:
                self._kick_timer = WallTimer()  # this resets the timer

        # If kick timer is None, we haven't kicked yet. The defaults values of
        # these variables assume the ball hasn't been kicked yet, so we should
        # overwrite them if we have kicked the ball
        if self._kick_timer:
            self.world.b_request.behaviourSharedData.secondsSinceLastKick = int(self._kick_timer.elapsedSeconds())
            # Keep notifying others if we have kicked in the last two seconds.
            # Check if the kickNotification has already been set by skills such
            # as Kick.py or ApproachBall.py
            if not self.world.b_request.behaviourSharedData.kickNotification:
                self.world.b_request.behaviourSharedData.kickNotification = self._kick_timer.elapsedSeconds() < 1.0

    def _decide_parameters(self):
        # @ijnek: TODO implement logic here
        target = ""  # either the middle of the largest gap (x', 0) or (x', y') which y' is the sender's y coordinate
        foot = Foot.LEFT
        hard = False  # was True for Shoot
        heading_error = math.radians(10)  # what happens if reduced..?
        distance_error = 50  # was 40 for kick in shoot.py. Tried 30.
        lineup_distance = LINEUP_DISTANCE_DRIBBLE  # LINEUP_DISTANCE_KICK
        use_line_up_map = True
        dribble_forwards = True
        extra_stable = False  # what happens if True..?

        # check ball is near the center of a nearest gap
        # give direction to dribble to the centre of a gap
        if len(Defender_Set2) == 2:
            if self.should_play_ball():
                gap = DefenderPos_Dict[self.AbsentDefender(Defender_Set2)]
                x = 0
                y = 0
                dif = gap.x - ballWorldPos().x
                if self.AbsentDefender(Defender_Set2) == "D":  # allow to pass from near the left edge
                    # if abs(ballWorldPos().y) >= DRIBBLE_THRESHOLD_Y:
                    if abs(ballWorldPos().y) >= DRIBBLE_THRESHOLD_Y:
                        if ballWorldPos().y > 0:  # the ball is on the top red zone
                            y = -150
                        elif ballWorldPos().y < 0:  # the ball is on the bottom red zone
                            y = 150
                    # if abs(gap.x - ballWorldPos().x) >= DRIBBLE_THRESHOLD_X:
                    if dif < 0 and dif <= -DRIBBLE_THRESHOLD_X + 100 or dif >= 0 and dif >= DRIBBLE_THRESHOLD_X + 200:
                        if gap.x < ballWorldPos().x:  # the ball is on the right side of the gap
                            x = -150
                        elif gap.x > ballWorldPos().x:  # the ball is on the left side of the gap
                            x = 150
                elif self.AbsentDefender(Defender_Set2) == "F":  # allow to pass from near the right edge
                    if abs(ballWorldPos().y) >= DRIBBLE_THRESHOLD_Y:
                        if ballWorldPos().y > 0:  # the ball is on the top red zone
                            y = -150
                        elif ballWorldPos().y < 0:  # the ball is on the bottom red zone
                            y = 150
                    # if abs(gap.x - ballWorldPos().x) >= DRIBBLE_THRESHOLD_X:
                    if dif < 0 and dif <= -DRIBBLE_THRESHOLD_X - 200 or dif >= 0 and dif >= DRIBBLE_THRESHOLD_X - 100:
                        if gap.x < ballWorldPos().x:  # the ball is on the right side of the gap
                            x = -150
                        elif gap.x > ballWorldPos().x:  # the ball is on the left side of the gap
                            x = 150
                else:  # 'E'
                    if abs(ballWorldPos().y) >= DRIBBLE_THRESHOLD_Y:
                        if ballWorldPos().y > 0:  # the ball is on the top red zone
                            y = -150
                        elif ballWorldPos().y < 0:  # the ball is on the bottom red zone
                            y = 150
                    if abs(gap.x - ballWorldPos().x) >= DRIBBLE_THRESHOLD_X + 50:
                        if gap.x < ballWorldPos().x:  # the ball is on the right side of the gap
                            x = -150
                        elif gap.x > ballWorldPos().x:  # the ball is on the left side of the gap
                            x = 150
                foot = Foot.LEFT
                target = Vector2D(x, y)  # what happens if using larger y value than -1000..?
                target.add(ballWorldPos())
                use_line_up_map = False  # False
                dribble_forwards = False  # False
        return (
            target,
            foot,
            hard,
            heading_error,
            distance_error,
            lineup_distance,
            use_line_up_map,
            dribble_forwards,
            extra_stable,
        )

    def should_play_ball(self):
        """
        Whether or not robot should be playing the ball, depending
        on whether the ball is in my red zone.
        """
        play = False
        if my_player_number() not in get_active_player_numbers():
            return play

        for player in get_active_player_numbers():
            # If its me, ignore it.
            if player is my_player_number():
                continue

            ball = ballWorldPos()

            # play only if ball is in my red zone
            # check ball is in my red zone

            # Blue Zone should be taken into account more carefully
            # (The robot shouldn't enter BZ and collide with the defenders)
            # if not (
            #    myzone[0].x - BALL_POS_X_ERROR_ALLOWED_MM <= ball.x <= myzone[1].x + BALL_POS_X_ERROR_ALLOWED_MM
            #    and myzone[1].y - BALL_POS_Y_ERROR_ALLOWED_MM <= ball.y <= myzone[0].y + BALL_POS_Y_ERROR_ALLOWED_MM
            # ):
            zoneno = self.get_my_zone_no()
            if zoneno == 1:
                myzone = self.get_my_zone()
                if (
                    myzone[0].x - BALL_POS_X_ERROR_ALLOWED_MM <= ball.x <= myzone[1].x + BALL_POS_X_ERROR_ALLOWED_MM
                    and myzone[1].y - BALL_POS_Y_ERROR_ALLOWED_MM / 9
                    <= ball.y
                    <= myzone[0].y + BALL_POS_Y_ERROR_ALLOWED_MM
                ):
                    play = True
            elif zoneno == 2:
                myzone = self.get_my_zone()
                if (
                    myzone[0].x - BALL_POS_X_ERROR_ALLOWED_MM <= ball.x <= myzone[1].x + BALL_POS_X_ERROR_ALLOWED_MM
                    and myzone[1].y - BALL_POS_Y_ERROR_ALLOWED_MM
                    <= ball.y
                    <= myzone[0].y + BALL_POS_Y_ERROR_ALLOWED_MM / 9
                ):
                    play = True

        # play only if the ball is in my red zone
        return play

    def get_anticipate_position(self):
        if self.num_players in (0, 1):
            return POS_B
        elif my_player_number() not in self.player_numbers:
            return POS_B
        else:
            if my_player_number() not in get_active_player_numbers():
                return
            my_index = self.player_numbers.index(my_player_number())

            # -v while detecting defenders, let the attackers stay in a right position (=wait_here)
            if len(Defender_Set2) > 2:
                if my_index % 2 == 0:
                    wait_here = ATTACKER1_INIT_WAIT_POS
                else:
                    wait_here = ATTACKER2_INIT_WAIT_POS
                return wait_here
            # -^
            elif ballRelVel().length() > BALL_MOVING_SPEED_THRESH_MM_PER_SEC:  # Is ball moving in speed?
                wait_here_x = stopRelPos().x
                wait_here_y = stopRelPos().y
            else:
                if my_index % 2 == 0:
                    wait_here_y = POS_B.y
                else:
                    wait_here_y = POS_H.y
                ball = ballWorldPos()
                pass_directional_aim_pos = self.get_direction_to_closest_largest_gap()
                if pass_directional_aim_pos is None:
                    return
                if LARGEST_GAP_ONLY:
                    wait_here_x = pass_directional_aim_pos.x
                elif abs(ball.x - pass_directional_aim_pos.x) > 0:
                    slope = (ball.y - pass_directional_aim_pos.y) / (ball.x - pass_directional_aim_pos.x)
                    coefficient = -slope * pass_directional_aim_pos.x + pass_directional_aim_pos.y
                    wait_here_x = (wait_here_y - coefficient) / slope
                else:
                    wait_here_x = pass_directional_aim_pos.x
                myzone = self.get_my_zone()
                if wait_here_x <= myzone[0].x:
                    wait_here_x = myzone[0].x
                if wait_here_x >= myzone[1].x:
                    wait_here_x = myzone[1].x

            return Vector2D(wait_here_x, wait_here_y)

    def get_my_zone(self):
        if self.num_players in (0, 1):
            return [RED_ZONE_1_TOP_LEFT, RED_ZONE_1_BOTTOM_RIGHT]
        elif my_player_number() not in self.player_numbers:
            return [RED_ZONE_1_TOP_LEFT, RED_ZONE_1_BOTTOM_RIGHT]
        else:
            my_index = self.player_numbers.index(my_player_number())
            if my_index % 2 == 0:
                return [RED_ZONE_1_TOP_LEFT, RED_ZONE_1_BOTTOM_RIGHT]
            else:
                return [RED_ZONE_2_TOP_LEFT, RED_ZONE_2_BOTTOM_RIGHT]

    def get_my_zone_no(self):
        if self.num_players in (0, 1):
            return 0
        elif my_player_number() not in self.player_numbers:
            return 0
        else:
            my_index = self.player_numbers.index(my_player_number())
            if my_index % 2 == 0:
                return 1
            else:
                return 2

    def inside_my_zone(self):
        inside = False
        no = self.get_my_zone_no()
        myzone = self.get_my_zone()
        # if myzone[0].x  <= myPos() <= myzone[1].x and myzone[1].y <= myPos() <= myzone[0].y:
        if no == 1:
            if (
                myzone[0].x - BALL_POS_X_ERROR_ALLOWED_MM <= myPos().x <= myzone[1].x + BALL_POS_X_ERROR_ALLOWED_MM
                and myzone[1].y - BALL_POS_Y_ERROR_ALLOWED_MM / 12.5
                <= myPos().y
                <= myzone[0].y + BALL_POS_Y_ERROR_ALLOWED_MM
            ):
                inside = True
        elif no == 2:
            if (
                myzone[0].x - BALL_POS_X_ERROR_ALLOWED_MM <= myPos().x <= myzone[1].x + BALL_POS_X_ERROR_ALLOWED_MM
                and myzone[1].y - BALL_POS_Y_ERROR_ALLOWED_MM
                <= myPos().y
                <= myzone[0].y + BALL_POS_Y_ERROR_ALLOWED_MM / 12.5
            ):
                inside = True
        return inside

    def get_your_zone(self):
        if self.num_players in (0, 1):
            return [RED_ZONE_1_TOP_LEFT, RED_ZONE_1_BOTTOM_RIGHT]
        elif my_player_number() not in self.player_numbers:
            return [RED_ZONE_1_TOP_LEFT, RED_ZONE_1_BOTTOM_RIGHT]
        else:
            my_index = self.player_numbers.index(my_player_number())
            if my_index % 2 == 1:
                return [RED_ZONE_1_TOP_LEFT, RED_ZONE_1_BOTTOM_RIGHT]
            else:
                return [RED_ZONE_2_TOP_LEFT, RED_ZONE_2_BOTTOM_RIGHT]

    def get_blue_zone(self):
        return [BLUE_ZONE_TOP_LEFT, BLUE_ZONE_BOTTOM_RIGHT]

    def RemoveLeastCount(self, Defender_Dict, Defender_Set):
        if len(Defender_Set) > 2:
            D = Defender_Dict["D"]
            E = Defender_Dict["E"]
            F = Defender_Dict["F"]
            if D < E:
                if F < D:
                    Defender_Set.remove("F")
                else:
                    Defender_Set.remove("D")
            elif F < E:
                Defender_Set.remove("F")
            else:
                Defender_Set.remove("E")

    def TwoOrMoreZeroCounts(self, Defender_Dict, Defender_Set):
        if len(Defender_Set) > 2:
            D = Defender_Dict["D"]
            E = Defender_Dict["E"]
            F = Defender_Dict["F"]
            if D + E == 0 or E + F == 0 or D + F == 0:
                return True
            return False
        return False

    def AbsentDefenderID(self, Defender_Set):
        absentdefender = self.AbsentDefender(self, Defender_Set)
        if absentdefender == "D":
            return 1
        if absentdefender == "E":
            return 2
        if absentdefender == "F":
            return 3
        else:
            return 0

    def AbsentDefender(self, Defender_Set):
        if len(Defender_Set) == 2:
            if "D" not in Defender_Set:
                return "D"
            if "E" not in Defender_Set:
                return "E"
            if "F" not in Defender_Set:
                return "F"
        else:
            return ""

    def RemoveDefenderID(self, Defender_Set, id):
        if len(Defender_Set) == 3:
            if id == 1:
                Defender_Set.remove("D")
            elif id == 2:
                Defender_Set.remove("E")
            elif id == 3:
                Defender_Set.remove("F")
            if len(Defender_Set) == 2:
                return True
        return False

    def get_direction_to_closest_largest_gap(self):
        global Defender_Set2
        closest_x_dist = 10000
        closest_x_defender = None
        if my_player_number() not in get_active_player_numbers():
            return  # (caution) check what happens nothing is returned.
        if len(Defender_Set2) == 2:
            if LARGEST_GAP_ONLY:  # if wanting to pass the ball through the largest gap
                gap = DefenderPos_Dict[self.AbsentDefender(Defender_Set2)]
                aim = Vector2D(gap.x, 0)
                return aim
            else:
                gap_set = {"D", "E", "F"}

                for ds in Defender_Set2:
                    gap_set.remove(ds)
                    dist = abs(DefenderPos_Dict[ds].x - ballWorldPos().x)
                    if dist < closest_x_dist:
                        closest_x_dist = dist
                        closest_x_defender = ds

                for gs in gap_set:
                    dist = abs(DefenderPos_Dict[gs].x - ballWorldPos().x)
                    if dist < closest_x_dist:
                        # condition 1
                        aim = Vector2D(DefenderPos_Dict[gs].x, 0)
                        return aim
                    elif gs == "E":  # if gap is in the middle, pass through the gap
                        # condition 2
                        aim = Vector2D(DefenderPos_Dict[gs].x, 0)
                        return aim
                    else:  # if gap is "D" or "F", pass conditionally
                        # condition 3
                        if closest_x_defender == "D":  # gap is "F". Pass through between "D" and "E".
                            # condition 3-1
                            aim = Vector2D((DefenderPos_Dict["D"].x + DefenderPos_Dict["E"].x) / 2, 0)
                            return aim
                        elif closest_x_defender == "E":
                            another_defender = "D"  # When the gap is "F"

                            # The Strategy A to pass the ball when the gap is "D" or "F"
                            # check the slopes of two pass directions
                            # and use the gap that makes abs(slope) larger.
                            # When two slopes are similar
                            # pass to the direction where the other attacker is waiting.
                            # In simulation, Strategy A appears to work better than Strategy B.
                            # That is, more successful passes in 5 minutes.
                            # In the actual field, Strategy A worked better than Strategy B.

                            # (this Strategy A part of the code was here.) The code was put aside in a file.

                            # The errors of the kick of the robot were obvious
                            # and cause the danger to use the smaller gaps.
                            # Using the largest gap became necessary.
                            # As a result, the simpler and staight-forward Strategy B would be better.

                            # -v- following lines will not be executed if Strategy A is not removed or not commented out

                            # To execute the following lines (Strategy B),
                            # the code for Strategy A in the above should be commented out

                            # The Strategy B to pass the ball when the gap is "D" or "F"
                            if gs == "D":  # When the gap caused by the absent defender is "D"
                                another_defender = "F"
                                # When the gap is D, if the ball.x is not larger than E.x, pass the ball through the gap
                                if ballWorldPos().x <= DefenderPos_Dict["E"].x + BALL_POS_X_ERROR_ALLOWED_MM / 3:
                                    return Vector2D(DefenderPos_Dict[gs].x, 0)
                            else:
                                # When the gap is F, if the ball.x is
                                # not smaller than E.x, pass the ball through the gap
                                if ballWorldPos().x >= DefenderPos_Dict["E"].x - BALL_POS_X_ERROR_ALLOWED_MM / 3:
                                    return Vector2D(DefenderPos_Dict[gs].x, 0)
                            return Vector2D((DefenderPos_Dict[another_defender].x + DefenderPos_Dict["E"].x) / 2, 0)
                            # -^ following lines will not be executed if Strategy A is not removed or not commented out

                        else:  # closest_x_defender == "F" and gap is "D". Pass through between "E" and "F".
                            # condition 4
                            aim = Vector2D((DefenderPos_Dict["E"].x + DefenderPos_Dict["F"].x) / 2, 0)
                            return aim

        # The following lines should never be executed ideally
        if self.player_numbers.index(my_player_number()) % 2 == 0:
            print("ALERT 1. Undesirable lines of the code in get_direction_to_closest_largest_gap were executed.")
            return  # POS_H
        print("ALERT 2. Undesirable lines of the code in get_direction_to_closest_largest_gap were executed.")
        return  # POS_B

    def close_to_anticipate_position(self):
        """
        Whether or not robot is close to its own anticipating position.
        """
        error = myPos().distanceTo(self.anticipate_position)
        return error < POSITION_ERROR_MM

    def should_block_intercept(self):
        final_y = YWhenReachCoronalPlane()

        if (
            ballRelVel().length() > BALL_MOVING_SPEED_THRESH_MM_PER_SEC
            and ballLostTime() < 0.5
            and timeToReachCoronalPlaneWithFriction() < 2.0
            and abs(final_y) < BLOCK_SIDE_LIMIT_MM
        ):
            return True

        return False

    def findDefenders(self):
        # Defender positions are fixed.
        # So, this method figures out where two defenders are actually placed among D, E, and F.
        global Defender_Set2
        global Defender_Dict2
        global Robot_Dict2
        _obs_list = robotObstaclesList()
        if len(_obs_list) > 0:
            bluezone = self.get_blue_zone()
            for obs in _obs_list:
                # if an obstacle is not inside blue zone, ignore it.
                # if not (
                #   bluezone[0].x - BALL_POS_X_ERROR_ALLOWED_MM/2
                #   <= obs.pos.x
                #   <= bluezone[1].x + BALL_POS_X_ERROR_ALLOWED_MM/2
                #   and bluezone[1].y - BALL_POS_Y_ERROR_ALLOWED_MM/2
                #   <= obs.pos.y
                #   <= bluezone[0].y + BALL_POS_Y_ERROR_ALLOWED_MM/2
                # ):
                if not (bluezone[0].x <= obs.pos.x <= bluezone[1].x and bluezone[1].y <= obs.pos.y <= bluezone[0].y):
                    continue
                elif len(Defender_Set2) > 2:  # in this case, figure out whether defenders are placed in  D, E, or F.
                    closest = None
                    # closest_dist = 10000
                    dist2D = math.sqrt((POS_D.x - obs.pos.x) ** 2 + (POS_D.y - obs.pos.y) ** 2)
                    dist2E = math.sqrt((POS_E.x - obs.pos.x) ** 2 + (POS_E.y - obs.pos.y) ** 2)
                    dist2F = math.sqrt((POS_F.x - obs.pos.x) ** 2 + (POS_F.y - obs.pos.y) ** 2)
                    if dist2D < dist2E:
                        closest = "D"
                        if dist2F < dist2D:
                            closest = "F"
                    else:
                        closest = "E"
                        if dist2F < dist2E:
                            closest = "F"
                    if closest:
                        Defender_Dict2[closest] += 1  # closest_dist
                        Robot_Dict2[closest + str(Defender_Dict2[closest])] = (
                            "(" + str(obs.pos.x) + "," + str(obs.pos.y) + ")"
                        )
                    if (
                        Defender_Dict2["D"] > DETECTION_THERESHOLD
                        and Defender_Dict2["E"] > DETECTION_THERESHOLD * 2
                        or Defender_Dict2["D"] > DETECTION_THERESHOLD
                        and Defender_Dict2["F"] > DETECTION_THERESHOLD
                        or Defender_Dict2["E"] > DETECTION_THERESHOLD * 2
                        and Defender_Dict2["F"] > DETECTION_THERESHOLD
                    ):
                        self.RemoveLeastCount(Defender_Dict2, Defender_Set2)

    def closedistance(self, pos1, pos2):
        return self.distance(pos1, pos2) < MAX_DIFF2POS2DETECT

    def distance(self, pos1, pos2):
        return math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)

    def close2defender(self, pos):
        return (
            self.distance(pos, POS_D) < MAX_DIFF2DEFENDER
            or self.distance(pos, POS_E) < MAX_DIFF2DEFENDER
            or self.distance(pos, POS_F) < MAX_DIFF2DEFENDER
        )

    # indicate which one among pos2 and pos3 is closer to pos1
    def closest(self, pos1, pos2, pos3, mindiff=MIN_DIST_DIFF):
        dist1 = math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
        dist2 = math.sqrt((pos1.x - pos3.x) ** 2 + (pos1.y - pos3.y) ** 2)
        diff = abs(dist1 - dist2)
        if diff < mindiff:  # if difference is small, non-deterministic
            return -1
        if dist1 < dist2:
            return 0
        elif dist2 < dist1:
            return 1
        else:  # non-deterministic
            return -1

    def closeangle(self, rad1, deg):
        ang = abs(math.degrees(rad1) - deg)
        ang = (ang + 180) % 360 - 180
        return ang < MAX_DIFFANGLE2POS2DETECT

    def WhereIsBall(self, ball):
        if (
            RED_ZONE_1_TOP_LEFT.x <= ball.x <= RED_ZONE_1_BOTTOM_RIGHT.x
            and RED_ZONE_1_BOTTOM_RIGHT.y <= ball.y <= RED_ZONE_1_TOP_LEFT.y
        ):
            return "r1"  # red zone 1
        elif (
            BLUE_ZONE_TOP_LEFT.x <= ball.x <= BLUE_ZONE_BOTTOM_RIGHT.x
            and BLUE_ZONE_BOTTOM_RIGHT.y <= ball.y <= BLUE_ZONE_TOP_LEFT.y
        ):
            return "b"  # blue zone
        elif (
            RED_ZONE_2_TOP_LEFT.x <= ball.x <= RED_ZONE_2_BOTTOM_RIGHT.x
            and RED_ZONE_2_BOTTOM_RIGHT.y <= ball.y <= RED_ZONE_2_TOP_LEFT.y
        ):
            return "r2"  # red zone 2
        else:
            return "o"  # outside of any zone

    def getVisionRobotObstacles(self):
        _obs_list = robotObstaclesList()
        if len(_obs_list) == 0:
            self.leftVisionRobotClearHysteresis.down()
            self.rightVisionRobotClearHysteresis.down()
        else:
            # allow distance for visual robot detection to work, so we don't
            # overreact on robot detection
            _min_distance = 1750  # 2000 could detect the other attacker. To futher refine.
            _closest_obs = None
            for obs in _obs_list:
                if obs.pos.x > 3000 or obs.pos.x < -3000 or obs.pos.y > 2700 or obs.pos.y < -2700:  # noqa
                    continue
                if not self.close2defender(obs.pos):  # ignore if the object is not possibly one of defenders
                    # Note that all objects inside blue zone was considered in findDefenders()
                    # and the detection was found successful in a recent test for D and F.
                    continue
                if obs.rr.distance < _min_distance:
                    _min_distance = obs.rr.distance
                    _closest_obs = obs
            if _closest_obs is None:
                self.leftVisionRobotClearHysteresis.down()
                self.rightVisionRobotClearHysteresis.down()
            elif _closest_obs.rr.heading > 0:
                self.leftVisionRobotClearHysteresis.add(VISION_ROBOT_HYSTERESIS_THRESHOLD)  # noqa
            else:
                self.rightVisionRobotClearHysteresis.add(VISION_ROBOT_HYSTERESIS_THRESHOLD)  # noqa
        if (
            self.rightVisionRobotClearHysteresis.value > 0
            and self.rightVisionRobotClearHysteresis.value >= self.leftVisionRobotClearHysteresis.value
        ):
            return "RIGHT"
        if self.leftVisionRobotClearHysteresis.value > 0:
            return "LEFT"
        return None
