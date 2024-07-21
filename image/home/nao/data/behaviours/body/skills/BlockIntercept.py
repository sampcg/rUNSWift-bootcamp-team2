from BehaviourTask import BehaviourTask
from util.actioncommand import walk, crouch

# from util import LedOverride
# from util.Constants import LEDColour
from util.BallMovement import timeToReachCoronalPlaneNoFriction, YWhenReachCoronalPlane


class BlockIntercept(BehaviourTask):
    BLOCK_OUTER_LIMIT = 400
    BLOCK_INNER_LIMIT = 70
    WALK_SPEED = 300

    def _reset(self):
        pass

    def _tick(self, time=None):
        if time is None:
            time = timeToReachCoronalPlaneNoFriction()

        if time > 0 and time < 2.0:
            final_y = YWhenReachCoronalPlane()
            if final_y > self.BLOCK_INNER_LIMIT and final_y < self.BLOCK_OUTER_LIMIT:
                # ball rolling to left
                self.world.b_request.actions.body = walk(0, self.WALK_SPEED, 0, blocking=True)
                # LedOverride.override(LedOverride.leftEye, LEDColour.red)
            elif final_y > -self.BLOCK_OUTER_LIMIT and final_y < -self.BLOCK_INNER_LIMIT:
                # ball rolling to right
                self.world.b_request.actions.body = walk(0, -self.WALK_SPEED, 0, blocking=True)
                # LedOverride.override(LedOverride.leftEye, LEDColour.blue)
            elif final_y > -self.BLOCK_INNER_LIMIT and final_y < self.BLOCK_INNER_LIMIT:
                # ball rolling to centre, dont move
                self.world.b_request.actions.body = crouch()
                # LedOverride.override(LedOverride.leftEye, LEDColour.magenta)
            else:
                # ball in unreachable range
                self.world.b_request.actions.body = crouch()
                # LedOverride.override(LedOverride.leftEye, LEDColour.green)
        else:
            # ball not reaching robot soon
            self.world.b_request.actions.body = crouch()
            # LedOverride.override(LedOverride.leftEye, LEDColour.off)
