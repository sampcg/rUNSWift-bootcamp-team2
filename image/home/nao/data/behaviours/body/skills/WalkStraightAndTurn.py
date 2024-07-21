from BehaviourTask import BehaviourTask
from body.skills.Walk import Walk
from util.Vector2D import Vector2D
from util.Global import myPos, myHeading
from math import radians, pi
from util.ObstacleAvoidance import walk_vec_with_avoidance


class WalkStraightAndTurn(BehaviourTask):

    """
    Description:
    A skill to walk straight to a point, while turning to the final
    heading at a constant rate.
    """

    WALK_SPEED = 300  # mm/s
    WALK_VEC = Vector2D(WALK_SPEED, 0)

    DISTANCE_CLOSE = 30
    HEADING_CLOSE = radians(3)

    OBVIOUSLY_CLOSER_TURN = pi / 4

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Walk": Walk(self)}

    def _reset(self):
        self._current_sub_task = "Walk"

    # f_p is final position
    def _tick(self, final_position=Vector2D(0, 0), final_heading=radians(0), clockwise=None, speed=1.0):
        # Calculate forward and left (walkVec)
        me_to_f_p = final_position.minus(myPos())
        distance_to_f_p = me_to_f_p.length()
        if distance_to_f_p > self.DISTANCE_CLOSE:
            walkVec = self.WALK_VEC.rotated(me_to_f_p.heading()).rotated(-myHeading())  # noqa
        else:
            # set small forward to ensure the robot doesn't stand up
            walkVec = Vector2D(0, 0)

        # Slow down if we're close to the final position
        # (to prevent overshooting)
        if distance_to_f_p < 200:
            walkVec.scale(0.5)

        # Calculate turn rate
        turn_diff = final_heading - myHeading()

        # unless its OBVIOUSLY closer to turn in a certain direction,
        # we force clockwise / anticlockwise
        if clockwise is not None:
            if clockwise:
                while turn_diff > self.OBVIOUSLY_CLOSER_TURN:
                    turn_diff -= 2 * pi
            else:
                while turn_diff < -self.OBVIOUSLY_CLOSER_TURN:
                    turn_diff += 2 * pi
        else:
            clockwise = turn_diff > 0

        time_to_f_p = abs(distance_to_f_p / self.WALK_SPEED)

        # do this to avoid turn_rate becoming too high
        time_to_f_p = max(time_to_f_p, 1.0)

        if abs(turn_diff) > self.HEADING_CLOSE:
            turn_rate = turn_diff / time_to_f_p
        else:
            turn_rate = 0

        # Use some avoidance, if necessary
        walkVec = walk_vec_with_avoidance(walkVec)

        self._tick_sub_task(forward=walkVec.x, left=walkVec.y, turn=turn_rate, speed=speed)
