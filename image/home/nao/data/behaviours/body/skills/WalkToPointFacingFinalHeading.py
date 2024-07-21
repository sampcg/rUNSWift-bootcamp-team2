from BehaviourTask import BehaviourTask
from body.skills.Walk import Walk
from math import radians
from util.Global import myPos, myHeading
from util.MathUtil import normalisedTheta
from util.Vector2D import Vector2D
from util.ObstacleAvoidance import walk_vec_with_avoidance


class WalkToPointFacingFinalHeading(BehaviourTask):

    """
    Description:
    A skill associated with walking to a global point on the field.
    Robot walks omnidirectional, adjusting the turn depending on the error
    between the robot's heading and the final heading
    """

    WALK_SPEED = 300  # mm / s
    TURN_RATE = radians(50)  # rad / s

    TIME_TO_FIX_HEADING = 1.0  # how much time we allow to align our heading

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Walk": Walk(self)}

    def _reset(self):
        self._current_sub_task = "Walk"
        self._final_heading = 0
        self._final_heading = 0

    def _tick(self, final_pos=Vector2D(0, 0), final_heading=0, speed=0.0):
        self._my_pos_to_final_pos = final_pos.minus(myPos())
        self._final_heading = final_heading

        walk_vector = self._my_pos_to_final_pos.rotate(-myHeading()).normalised(self.WALK_SPEED)

        # Aim to correct the heading error over an amount of time
        turn = self._heading_error() / self.TIME_TO_FIX_HEADING

        # Use some avoidance, if necessary
        walk_vector = walk_vec_with_avoidance(walk_vector)

        self._tick_sub_task(walk_vector.x, walk_vector.y, turn, speed=speed)

    def _heading_error(self):
        return normalisedTheta(self._final_heading - myHeading())
