from util.Global import ballWorldPos, ballDistance, teamBallWorldPos, myPos
from BehaviourTask import BehaviourTask
from body.skills.WalkStraightToPose import WalkStraightToPose
from body.skills.Spin import Spin
from util.GameStatus import in_corner_kick, we_are_kicking_team, in_goal_kick, in_kick_in, in_pushing_free_kick


SPINNING_COUNT_DOWN = 7 * 1000 * 1000


class FindBall(BehaviourTask):
    """
    Skill associated mainly with the BallPlayer doing a local
    find ball when it loses the ball for a short period. It
    goes to where it thinks the ball is, then spins.
    In the case of set plays, we go and check where the teamball
    is first (which is updated when a gamecontroller signal is
    received about a set play, such as corner kicks)
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "FB_GoToBall": FB_GoToBall(self),
            "FB_Spin": Spin(self),
            "FB_GoToTeamBall": FB_GoToTeamBall(self),
        }

    def _reset(self):
        self._current_sub_task = "FB_GoToBall"

    def _transition(self):
        if (in_corner_kick() or in_goal_kick()) and we_are_kicking_team():
            # We hard code the team ball position when transitioning to
            # corner kicks and goal free kicks, so we should go have a look at
            # where the teamball is first for a good chance of finding it
            self._current_sub_task = "FB_GoToTeamBall"
        elif self._should_go_to_ball():
            self._current_sub_task = "FB_GoToBall"
        else:
            self._current_sub_task = "FB_Spin"

    def _should_go_to_ball(self):
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

    def _should_go_to_home_position(self):
        if self._home_position is None:
            return False
        home_distance = self._home_position.minus(myPos()).length()
        if home_distance > 500:
            return True
        return False

    def _tick(self):
        self._tick_sub_task()


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
