from util.Global import ballWorldPos
from body.skills.BlockFreeKick import BlockFreeKick
from BehaviourTask import BehaviourTask
from util.Vector2D import Vector2D
from util.FieldGeometry import OWN_GOAL_BEHIND_CENTER


class BlockPushingFreeKick(BehaviourTask):

    """
    Description:
    A skill associated with blocking the opponent's pushing free kick.
    We choose the blocking position between the ball and our own goal,
    facing the ball. We stand at a close distance to not get penalised.
    """

    FREE_KICK_RULE_RADIUS = 750  # mm
    ADDIIONAL_SAFETY_DIST = 200  # mm

    # Offset from ball position we should stand and block
    STAY_AWAY_DISTANCE = FREE_KICK_RULE_RADIUS + ADDIIONAL_SAFETY_DIST
    BEHIND_BALL = Vector2D(-STAY_AWAY_DISTANCE, 0)

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"BlockFreeKick": BlockFreeKick(self)}

    def _reset(self):
        self._current_sub_task = "BlockFreeKick"
        self._ball_pos = ballWorldPos()
        self._blocking_heading = self._calculate_blocking_heading()
        self._blocking_pos = self._calculate_blocking_pos()

    def _tick(self):
        self._ball_pos = ballWorldPos()
        self._blocking_pos = self._calculate_blocking_pos()
        self._blocking_heading = self._calculate_blocking_heading()

        self._tick_sub_task(self._ball_pos, self._blocking_pos, self._blocking_heading)

    def _calculate_blocking_pos(self):
        return self._ball_pos.plus(self.BEHIND_BALL.rotated(self._blocking_heading))

    def _calculate_blocking_heading(self):
        our_goal_to_ball = self._ball_pos.minus(OWN_GOAL_BEHIND_CENTER)
        return our_goal_to_ball.heading()
