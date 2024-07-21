from util.Global import ballRelPos, ballHeading, ballLostTime

from BehaviourTask import BehaviourTask
from body.skills.Walk import Walk
from util.Vector2D import Vector2D

MAX_FORWARD = 250
MAX_LEFT = 200


class Dribble(BehaviourTask):
    max_count = 30

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Walk": Walk(self)}

    def _reset(self):
        self._current_sub_task = "Walk"

        self.is_finished = False

        self.count = 0

    def _tick(self, can_abort=True, dribble_forwards=False):
        ball_pos = ballRelPos()
        speed = self.world.blackboard.behaviour.dribbleSpeed

        if dribble_forwards:
            # If we want to dribble forwards, such as when the ball is in front
            # of our foot and we want to dribble into opponent goal
            dribble_vector = Vector2D(300, 0)
        else:
            # If we want to dribble in direction of ball, such as when we have
            # an opponent in front of us and we don't want to dribble directly
            # into them
            dribble_vector = Vector2D(300, 0).rotate(ballHeading())

        self._tick_sub_task(dribble_vector.x, dribble_vector.y, ballHeading(), speed=speed, cap_speed=True)

        # Allow abort if ball is not in position that we should be in the
        # dribble skill for
        if can_abort:
            if dribble_forwards:
                if not -100 < ball_pos.y < 100:
                    self.is_finished = True

                if not 50 < ball_pos.x < 250:
                    self.is_finished = True

                # If ball is far, abort. This allows robots to abort when
                # ball is outside the x and y limit stated above.
                if ball_pos.length() > 290:
                    self.is_finished = True

                # If we haven't seen the ball in the last second, abort
                if ballLostTime() > 0.5:
                    self.is_finished = True
            else:
                if not -220 < ball_pos.y < 220:
                    self.is_finished = True

                if not 20 < ball_pos.x < 250:
                    self.is_finished = True

                # If ball is far, abort. This allows robots to abort when
                # ball is outside the x and y limit stated above.
                if ball_pos.length() > 290:
                    self.is_finished = True

                # If we haven't seen the ball in the last second, abort
                if ballLostTime() > 0.8:
                    self.is_finished = True

        else:
            self.count += 1
            self.is_finished = self.count >= self.max_count
