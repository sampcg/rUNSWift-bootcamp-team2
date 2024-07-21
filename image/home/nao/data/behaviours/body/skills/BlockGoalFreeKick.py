from util.Global import myPos, ballWorldPos, ballLostTime
from body.skills.BlockFreeKick import BlockFreeKick
from BehaviourTask import BehaviourTask
from util.Vector2D import Vector2D
from util.Constants import GOAL_KICK_ABS_X, GOAL_KICK_ABS_Y


class BlockGoalFreeKick(BehaviourTask):

    """
    Description:
    A skill associated with blocking the opponent's goal free kick.
    Robot takes a best guess of where the ball is, given the set free kick
    positions and ballLostTime
    """

    FREE_KICK_RULE_RADIUS = 750  # mm
    ADDIIONAL_SAFETY_DIST = 200  # mm

    BALL_POSITIONS = [
        Vector2D(GOAL_KICK_ABS_X, GOAL_KICK_ABS_Y),
        Vector2D(GOAL_KICK_ABS_X, -GOAL_KICK_ABS_Y),
    ]

    # Offset from ball position we should stand and block
    STAY_AWAY_DISTANCE = FREE_KICK_RULE_RADIUS + ADDIIONAL_SAFETY_DIST
    BEHIND_BALL = Vector2D(-STAY_AWAY_DISTANCE, 0)

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"BlockFreeKick": BlockFreeKick(self)}

    def _reset(self):
        self._current_sub_task = "BlockFreeKick"
        self._ball_pos = self.BALL_POSITIONS[0]
        self._blocking_pos = self._ball_pos.plus(self.BEHIND_BALL)
        self._blocking_heading = 0

    def _tick(self):
        # Decide on the ball pos and blocking pos, depending on whether
        # the robot has seen the ball recently. If the robot hasn't seen
        # the ball recently, we choose the closer possible goal kick position.
        if ballLostTime() < 2.0:
            self._ball_pos = ballWorldPos()
            self._blocking_pos = self._ball_pos.plus(self.BEHIND_BALL)
        else:
            self._ball_pos = self._closer_ball_pos()
            self._blocking_pos = self._ball_pos.plus(self.BEHIND_BALL)

        self._tick_sub_task(self._ball_pos, self._blocking_pos, self._blocking_heading)

    # Find the closer possible ball position from robot's position
    def _closer_ball_pos(self):
        my_pos = myPos()
        distances = [my_pos.minus(pos).length() for pos in self.BALL_POSITIONS]  # noqa
        return self.BALL_POSITIONS[distances.index(min(distances))]
