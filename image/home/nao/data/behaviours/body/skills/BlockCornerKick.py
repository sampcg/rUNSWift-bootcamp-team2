from util.Global import ballWorldPos
from body.skills.BlockFreeKick import BlockFreeKick
from BehaviourTask import BehaviourTask
from util.Vector2D import Vector2D
from util.Constants import CORNER_KICK_ABS_X, CORNER_KICK_ABS_Y
from math import radians


class BlockCornerKick(BehaviourTask):

    """
    Description:
    A skill associated with blocking the opponent's corner kick.
    We choose the blocking position between the ball and our own goal,
    facing the ball. We stand further away than other free kicks,
    because there seems to be no benefit to being very close to the corner.
    """

    FREE_KICK_RULE_RADIUS = 750  # mm
    ADDIIONAL_STAY_AWAY_DIST = 700  # mm
    # Offset from ball position we should stand and block
    STAY_AWAY_DISTANCE = FREE_KICK_RULE_RADIUS + ADDIIONAL_STAY_AWAY_DIST

    CORNER_POSITIONS = [
        Vector2D(-CORNER_KICK_ABS_X, CORNER_KICK_ABS_Y),
        Vector2D(-CORNER_KICK_ABS_X, -CORNER_KICK_ABS_Y),
    ]

    BLOCK_POSITIONS = [
        CORNER_POSITIONS[0].plus(Vector2D(250, -STAY_AWAY_DISTANCE)),
        CORNER_POSITIONS[1].plus(Vector2D(250, STAY_AWAY_DISTANCE)),
    ]

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"BlockFreeKick": BlockFreeKick(self)}

    def _reset(self):
        self._current_sub_task = "BlockFreeKick"
        self._ball_pos = self.CORNER_POSITIONS[0]
        self._blocking_pos = self.BLOCK_POSITIONS[0]
        self._blocking_heading = radians(90)

    def _tick(self):
        # Use ballWorldPos, because it gets reset in corner kicks
        # in stateestimation to closer side the ball was on before
        # the corner kick was called
        if ballWorldPos().distanceTo(self.BLOCK_POSITIONS[0]) < ballWorldPos().distanceTo(self.BLOCK_POSITIONS[1]):
            # Ball on left side
            self._ball_pos = self.CORNER_POSITIONS[0]
            self._blocking_pos = self.BLOCK_POSITIONS[0]
            self._blocking_heading = radians(90)
        else:
            # Ball on right side
            self._ball_pos = self.CORNER_POSITIONS[1]
            self._blocking_pos = self.BLOCK_POSITIONS[1]
            self._blocking_heading = radians(-90)

        self._tick_sub_task(self._ball_pos, self._blocking_pos, self._blocking_heading)
