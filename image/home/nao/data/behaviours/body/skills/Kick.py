from util import Global
import robot

from BehaviourTask import BehaviourTask
from util.MathUtil import angleSignedDiff
from util.Hysteresis import Hysteresis
from util.FieldGeometry import ENEMY_GOAL_BEHIND_CENTER
from math import radians
from util.actioncommand import kick
from robot import Foot
from util.Global import ballLostTime
from util.MathUtil import clamp


class Kick(BehaviourTask):
    def _reset(self):
        self.is_finished = False
        self.is_kicking = False
        self._abort_hysteresis = Hysteresis(0, 2)

    def _tick(
        self,
        target=ENEMY_GOAL_BEHIND_CENTER,
        foot=Foot.RIGHT,
        hard=True,
        heading_error=radians(20),
        can_abort=False,
        extra_stable=True,
    ):
        power = self._calculate_power(target, hard)
        rel_theta = self._calculate_rel_theta(target)

        self.world.b_request.actions.body = kick(power=power, foot=foot, turn=rel_theta, extraStableKick=extra_stable)

        curAction = self.world.blackboard.motion.active.body.actionType
        # Track whether the kick motion has started
        if not self.is_kicking and curAction is robot.ActionType.KICK:
            self.is_kicking = True
        # Set is finished if no longer kicking
        if self.is_kicking and curAction is not robot.ActionType.KICK:
            self.is_finished = True

        # Set is finished if the ball is out of range
        ballPos = Global.ballRelPos()

        # @ijnek: REMOVE THE FOLLOWING COMMENT ON THE LINE AS IT IS
        # A HACK FOR MONTREAL
        # midy = 60 if foot == Foot.LEFT else -60
        if can_abort:
            if foot == Foot.LEFT:
                if not 20 < ballPos.y < 220:
                    self._abort_hysteresis.up()

            if foot == Foot.RIGHT:
                if not -220 < ballPos.y < -20:
                    self._abort_hysteresis.up()

            if not 70 < ballPos.x < 300:
                self._abort_hysteresis.up()

            # If ball is far, abort. This allows robots to abort when
            # ball is outside the x and y limit stated above.
            if ballPos.length() > 290:
                self._abort_hysteresis.up()

            # If we haven't seen the ball in the last second, abort
            if ballLostTime() > 1.0:
                self._abort_hysteresis.up()

            if not self.is_finished:
                self.is_finished = self._abort_hysteresis.true
                if self.is_finished:
                    robot.say("abort")

        # Notify others we're kicking
        self.world.b_request.behaviourSharedData.kickNotification = True

    def _calculate_power(self, target, hard):
        if hard:
            # Max power for hard kicks
            return 1
        else:
            # Otherwise interpolate based on kickTarget
            target_distance = target.minus(Global.myPos()).length()

            # Numbers derived with... SCIENCE!
            # (actually derived by making the robot with different powers,
            #  and fitting a linear function)
            return clamp(0.00029648 * target_distance - 0.63829, 0.0, 1.0)

    def _calculate_rel_theta(self, target):
        world_theta = target.minus(Global.ballWorldPos()).heading()
        rel_theta = angleSignedDiff(world_theta, Global.myPose().theta)
        return rel_theta
