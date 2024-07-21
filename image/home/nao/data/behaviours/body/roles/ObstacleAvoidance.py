from BehaviourTask import BehaviourTask

from robot import Foot, ActionType
from math import radians
from util.Hysteresis import Hysteresis

from util.Constants import GOAL_POST_ABS_X, GOAL_POST_ABS_Y, GOAL_WIDTH, PENALTY_CROSS_ABS_X, BALL_RADIUS

from body.skills.Dribble import Dribble
from body.skills.TurnDribble import TurnDribble
from body.skills.ApproachBall import ApproachBall
from body.skills.Stand import Stand
from body.skills.Shoot import Shoot
from body.skills.AdaptiveScan import AdaptiveScan
from util.Global import robotObstaclesList, ballWorldPos, isStiff
from util.Vector2D import Vector2D

VISION_ROBOT_HYSTERESIS_THRESHOLD = 35
ROTATION_ANGLE = 40  # in degrees

ROBOT_DETECTION_MIN_DISTANCE = 1500

DIFF_X = 2 * BALL_RADIUS
DIFF_Y = 2 * BALL_RADIUS

RIGHT_DIR = "RIGHT"
LEFT_DIR = "LEFT"

OFFSET_ALLOWED = 412**2  # Merge two robot hypothesis within OFFSET_ALLOWED units, 825/2 per rule

HYSTERISIS_MIN_FRAMES = 6  # plus 6 for find robot, need 7 frames for comfirmation


class RobotObstaclePos:
    """
    Description:
    class needed for updating more precise obstacle position
    """

    def __init__(self, x, y):
        self.pos = Vector2D(x, y)


class ObstacleAvoidance(BehaviourTask):
    """
    Description:
    Behaviour file for 2021 Challenge 1 - Obstacle Avoidance
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "ApproachBall": ApproachBall(self),
            "Dribble": Dribble(self),
            "TurnDribble": TurnDribble(self),
            "Shoot": Shoot(self),
            "Stand": Stand(self),
            "ScanAllRobot": AdaptiveScan(self),
            "Wait": Stand(self),
        }

    def _reset(self):
        self._prev_sub_task = "ApproachBall"
        self._current_sub_task = "Wait"
        self._foot = Foot.LEFT
        self._turn = radians(ROTATION_ANGLE)
        self.leftVisionRobotClearHysteresis = Hysteresis(0, VISION_ROBOT_HYSTERESIS_THRESHOLD)
        self.rightVisionRobotClearHysteresis = Hysteresis(0, VISION_ROBOT_HYSTERESIS_THRESHOLD)
        self.initial_robot_obstacle_map = list()
        self.initial_candidate_robot_obstacle_with_HYSTERESIS = list()  # [(obs, HYSTERESIS)]

    def _tick(self):
        if self._current_sub_task == "Dribble":
            dribble_forwards = True
            self._tick_sub_task(dribble_forwards=dribble_forwards)

        elif self._current_sub_task == "TurnDribble":
            self._tick_sub_task(turn=self._turn, foot=self._foot)

        elif self._current_sub_task == "ApproachBall":
            self._tick_sub_task(use_line_up_map=True, kick_foot=self._foot)

        elif self._current_sub_task == "ScanAllRobot":
            self._tick_sub_task()
            self._construct_robot_obstacle_map()

        else:
            self._tick_sub_task()

    def _transition(self):
        # OVERALL PLAN :
        # ApproachBall --> Dribble
        # REPEAT :
        #   IF     within goal
        #           Stand
        #   ELSEIF within penalty cross and no obstacles
        #           Shoot
        #   ELSE
        #           IF obstacle :
        #               ApproachBall --> TurnDribble --> ApproachBall
        #           ELSE :
        #               Dribble
        _nearest_robot_obstacles = self.getVisionRobotObstacles()

        curAction = self.world.blackboard.motion.active.body.actionType

        if self.is_goal():
            self._prev_sub_task = self._current_sub_task
            self._current_sub_task = "Stand"
        elif self._current_sub_task == "Wait":
            if isStiff():
                self._prev_sub_task = self._current_sub_task
                self._current_sub_task = "ScanAllRobot"
                self._sub_tasks[self._current_sub_task]._reset()
        elif self._current_sub_task == "ScanAllRobot":
            if self._sub_tasks[self._current_sub_task]._is_finished:
                self._prev_sub_task = self._current_sub_task
                self._current_sub_task = "ApproachBall"
                self._check_true_positive()
        elif self.is_shoot_allowed() and _nearest_robot_obstacles is None:
            self._prev_sub_task = self._current_sub_task
            self._current_sub_task = "Shoot"
        elif self._current_sub_task == "ApproachBall":
            if (
                self._sub_tasks[self._current_sub_task].close
                and self._sub_tasks[self._current_sub_task].position_aligned
                and self._sub_tasks[self._current_sub_task].heading_aligned
            ):
                if _nearest_robot_obstacles is not None:
                    self._current_sub_task = "TurnDribble"
                    self.decide_obstacle_avoidance_params(_nearest_robot_obstacles)
                else:
                    self._current_sub_task = "Dribble"
                self._prev_sub_task = "ApproachBall"
        elif self._current_sub_task == "Dribble":
            if _nearest_robot_obstacles is not None:
                self._current_sub_task = "ApproachBall"
                self._prev_sub_task = "Dribble"

        elif self._current_sub_task == "TurnDribble":
            if self._prev_sub_task == "ApproachBall" and curAction is not ActionType.TURN_DRIBBLE:
                self._current_sub_task = "ApproachBall"
                self._prev_sub_task = "TurnDribble"
        else:
            self._prev_sub_task = self._current_sub_task
            self._current_sub_task = "ApproachBall"

    def decide_obstacle_avoidance_params(self, _nearest_robot_obstacles):
        if _nearest_robot_obstacles == LEFT_DIR:
            self._foot = Foot.RIGHT
            self._turn = radians(-1 * ROTATION_ANGLE)
        else:
            self._foot = Foot.LEFT
            self._turn = radians(ROTATION_ANGLE)

    def is_shoot_allowed(self):
        return not self.is_goal() and ballWorldPos().x > PENALTY_CROSS_ABS_X + DIFF_X

    def is_goal(self):
        return (
            ballWorldPos().x > GOAL_POST_ABS_X + DIFF_X
            and ballWorldPos().y + DIFF_Y < GOAL_POST_ABS_Y
            and ballWorldPos().y - DIFF_Y > GOAL_POST_ABS_Y - GOAL_WIDTH
        )

    def getVisionRobotObstacles(self):
        _obs_list = robotObstaclesList()
        if len(_obs_list) == 0:
            self.leftVisionRobotClearHysteresis.down()
            self.rightVisionRobotClearHysteresis.down()
        else:
            # allow distance for visual robot detection to work, so we don't
            # overreact on robot detection
            _min_distance = ROBOT_DETECTION_MIN_DISTANCE
            _closest_obs = None
            for obs in _obs_list:
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
            return RIGHT_DIR
        elif self.leftVisionRobotClearHysteresis.value > 0:
            return LEFT_DIR
        else:
            return None

    def _construct_robot_obstacle_map(self):
        _obs_list = robotObstaclesList()
        self.initial_candidate_robot_obstacle_with_HYSTERESIS = self._merging_robot_hypothesis(
            _obs_list, self.initial_candidate_robot_obstacle_with_HYSTERESIS
        )  # noqa
        for _, hysteresis in self.initial_candidate_robot_obstacle_with_HYSTERESIS:
            if not hysteresis.is_max():  # not too certain yet
                hysteresis.down()

    def _merging_robot_hypothesis(self, observation, memory):
        new_robot_detected_list = list()
        for obs in observation:
            new_obs_detected = True
            for mem, hysteresis in memory:
                distance = (obs.pos.x - mem.pos.x) ** 2 + (obs.pos.y - mem.pos.y) ** 2
                if distance < OFFSET_ALLOWED:  # already in memory, adjusting HYSTERESIS
                    new_obs_detected = False
                    updated_x = (obs.pos.x + mem.pos.x) / 2  # update the pos using mean value
                    updated_y = (obs.pos.y + mem.pos.y) / 2
                    hysteresis.add(HYSTERISIS_MIN_FRAMES)
                    new_robot_detected_list.append((RobotObstaclePos(updated_x, updated_y), hysteresis))
                    break
            if new_obs_detected:
                new_robot_detected_list.append(
                    (RobotObstaclePos(obs.pos.x, obs.pos.y), Hysteresis(0, VISION_ROBOT_HYSTERESIS_THRESHOLD))
                )

        return new_robot_detected_list

    def _check_true_positive(self):
        for obs, hysteresis in self.initial_candidate_robot_obstacle_with_HYSTERESIS:
            if hysteresis.is_max():  # true positive
                self.initial_robot_obstacle_map.append(obs)
