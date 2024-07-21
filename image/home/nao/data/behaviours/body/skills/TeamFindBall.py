from util.Global import ballWorldPos, ballDistance, myPos, teamBallWorldPos
from BehaviourTask import BehaviourTask
from body.skills.WalkStraightToPose import WalkStraightToPose
from body.skills.Spin import Spin
from positioning.PositioningFindBall import PositioningFindBall
from util.GameStatus import in_corner_kick, we_are_kicking_team, in_goal_kick, in_kick_in, in_pushing_free_kick
from util.TeamStatus import i_saw_ball_last


SPINNING_COUNT_DOWN = 7 * 1000 * 1000


class TeamFindBall(BehaviourTask):
    """
    Skill associated with a findball amongst
    teammates, when we have lost the ball for a long period
    amongst all teammates. This case can happen if many robots
    are in the same area, and the ball is far from them.
    All robots locate the closest team find ball position, as
    defined in PositioningFindBall, go there, and then spin (forever)

    An exception to this is the robot that most recently saw the ball.
    This robot goes to where its last estimate of the ball is, spins,
    and if it cannot find the ball, joints the team find ball
    positioning. This it to account for when a robot kicks the ball,
    then loses sight of it, but we need that robot to keep chasing it
    because there is a high chance that the ball is in that direction.
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "FB_GoToBall": FB_GoToBall(self),
            "FB_Spin": Spin(self),
            "FB_GoToTeamBall": FB_GoToTeamBall(self),
            "FB_GoToPosition": FB_GoToPosition(self),
        }

    def _reset(self):
        self._current_sub_task = "FB_GoToBall"
        self.can_not_find_ball = False
        self._position = None
        self._positioning = PositioningFindBall()

    def _transition(self):
        if (in_corner_kick() or in_goal_kick()) and we_are_kicking_team() and i_saw_ball_last():
            # We hard code the team ball position when transitioning to
            # corner kicks and goal free kicks, so we should go have a look at
            # where the teamball is first for a good chance of finding it
            self._current_sub_task = "FB_GoToTeamBall"
        elif self._should_go_to_ball() and not self.can_not_find_ball:
            self._current_sub_task = "FB_GoToBall"
        elif not self.can_not_find_ball and i_saw_ball_last():
            self._current_sub_task = "FB_Spin"
        elif self._should_go_to_position():
            self._current_sub_task = "FB_GoToPosition"
        else:
            self._current_sub_task = "FB_Spin"

    def _should_go_to_ball(self):
        # only robot that saw ball last shoud go for ball
        if not i_saw_ball_last():
            return False

        # We should only ever have gotoball run once
        if self._current_sub_task != "FB_GoToBall":
            return False

        ball_distance = ballDistance()

        # If we're in a free kick and opponent is kicking, and we
        # go into findball, dont go to within 1000mm of where
        # you think the ball is
        # https://youtu.be/8IOcv4ZqKu4?t=2185
        if in_goal_kick() or in_corner_kick() or in_kick_in() or in_pushing_free_kick():
            if not we_are_kicking_team():
                if ball_distance < 1000:
                    return False

        # If we've got close to the ball, no need to go to
        # ball anymore
        if ball_distance < 500:
            return False
        return True

    def _should_go_to_position(self):
        if self._position is None:
            return False
        distance = self._position.minus(myPos()).length()
        if distance > 500:
            return True
        return False

    def _tick(self):
        self._positioning.evaluate()
        self._position = self._positioning.get_position()

        self.world.b_request.behaviourSharedData.role = self._positioning.get_my_role_enum()

        if self._current_sub_task == "FB_Spin":
            if self._sub_tasks[self._current_sub_task].timer.finished():
                self.can_not_find_ball = True
            self._tick_sub_task()
        elif self._current_sub_task == "FB_GoToPosition":
            self._tick_sub_task(self._position)
        else:
            self._tick_sub_task()

        # Write some debug info
        debug_info = self.world.b_request.behaviourDebugInfo
        debug_info.anticipating = True
        debug_info.anticipateX = self._position.x
        debug_info.anticipateY = self._position.y
        debug_info.anticipateH = 0

        # Also transmit to teammates where you're going!
        self.world.b_request.behaviourSharedData.walkingToX = self._position.x
        self.world.b_request.behaviourSharedData.walkingToY = self._position.y
        self.world.b_request.behaviourSharedData.walkingToH = 0


class FB_GoToBall(BehaviourTask):
    """
    Go to where we believe the ball is
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"WalkStraightToPose": WalkStraightToPose(self)}

    def _reset(self):
        self._current_sub_task = "WalkStraightToPose"

    def _tick(self):
        ball_world_pos = ballWorldPos()
        self._tick_sub_task(ball_world_pos, 0, speed=1.0)  # TODO we should have an option of no specific heading


class FB_GoToTeamBall(BehaviourTask):
    """
    Go to where we believe the ball is
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"WalkStraightToPose": WalkStraightToPose(self)}

    def _reset(self):
        self._current_sub_task = "WalkStraightToPose"

    def _tick(self):
        ball_world_pos = teamBallWorldPos()
        self._tick_sub_task(ball_world_pos, 0, speed=1.0)  # TODO we should have an option of no specific heading


class FB_GoToPosition(BehaviourTask):
    """
    Go to position
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"WalkStraightToPose": WalkStraightToPose(self)}

    def _reset(self):
        self._current_sub_task = "WalkStraightToPose"

    def _tick(self, position):
        self._tick_sub_task(position, 0, speed=1.0)  # TODO we should have an option of no specific heading
