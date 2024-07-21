from BehaviourTask import BehaviourTask
from body.skills.WalkStraightToPose import WalkStraightToPose
from body.skills.WalkToPointFacingFinalHeading import WalkToPointFacingFinalHeading
from body.skills.Stand import Stand
from body.skills.BlockIntercept import BlockIntercept
from body.skills.CircleToPose import CircleToPose
from body.skills.Crouch import Crouch
from util.Vector2D import Vector2D
from util.Global import myPos, myHeading, ballWorldPos, ballDistance, ballRelVel, ballLostTime, ballWorldVel
from math import radians
from util.BallMovement import timeToReachCoronalPlaneWithFriction, YWhenReachCoronalPlane
from util.GameStatus import in_ready


# Distance margin to prevent flickering of states
DISTANCE_MARGIN = 200

STAY_AWAY_DISTANCE = 800  # how far to stay away from ball (mm)
RADIUS_MARGIN = 100  # margin to prevent flickering when circling ball (mm)

BLOCK_SIDE_LIMIT = 700  # maximum side length that we can block (mm)
BALL_MOVING_SPEED_THRESH = 300  # mm /s


class Anticipate(BehaviourTask):

    """
    Adjust position, and if in correct position, stand.
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "WalkToPose": WalkStraightToPose(self),
            "WalkFacingFinalHeading": WalkToPointFacingFinalHeading(self),
            "Stand": Stand(self),
            "Crouch": Crouch(self),
            "BlockIntercept": BlockIntercept(self),
            "CircleAroundBall": CircleToPose(self),
        }

    def _reset(self):
        self._current_sub_task = "WalkToPose"
        self._position = Vector2D(0, 0)
        self._heading = radians(0)
        self._position_error = 300
        self._heading_error = radians(20)
        self._stay_crouched = False

        # distance from robot to final position, at which
        # the robot turns to face the final heading, and walks
        # towards the position facing final heading
        self._dist_to_face_final_heading = 500

    def _transition(self):
        if self._should_block_intercept():
            self._current_sub_task = "BlockIntercept"
        elif self._should_adjust_position():
            if self._should_circle_around_ball():
                self._current_sub_task = "CircleAroundBall"
            elif self._should_face_final_heading():
                self._current_sub_task = "WalkFacingFinalHeading"
            else:
                self._current_sub_task = "WalkToPose"
        elif self._stay_crouched:
            self._current_sub_task = "Crouch"
        else:
            self._current_sub_task = "Stand"

    def _tick(
        self,
        position=Vector2D(0, 0),
        heading=0,
        position_error=300,
        heading_error=radians(20),
        stay_crouched=False,
        dist_to_face_final_heading=500,
        speed=1.0,
    ):
        self._position = position
        self._heading = heading
        self._position_error = position_error
        self._heading_error = heading_error
        self._stay_crouched = stay_crouched
        self._dist_to_face_final_heading = dist_to_face_final_heading

        if self._current_sub_task == "WalkToPose":
            self._tick_sub_task(final_pos=position, final_heading=heading, speed=speed)
        elif self._current_sub_task == "WalkFacingFinalHeading":
            self._tick_sub_task(final_pos=position, final_heading=heading, speed=speed)
        elif self._current_sub_task == "CircleAroundBall":
            # Figure if we want to adjust to face our final heading
            # during this sub task
            if self._should_face_final_heading():
                circle_final_heading = heading
            else:
                # Face the direction to the final position
                circle_final_heading = myPos().headingTo(position)
            self._tick_sub_task(
                final_position=position, final_heading=circle_final_heading, circle_centre=ballWorldPos(), speed=1.0
            )
        else:
            self._tick_sub_task()

        # Write some debug info
        debug_info = self.world.b_request.behaviourDebugInfo
        debug_info.anticipating = True
        debug_info.anticipateX = self._position.x
        debug_info.anticipateY = self._position.y
        debug_info.anticipateH = self._heading

        # Also transmit to teammates where you're going!
        self.world.b_request.behaviourSharedData.walkingToX = self._position.x
        self.world.b_request.behaviourSharedData.walkingToY = self._position.y
        self.world.b_request.behaviourSharedData.walkingToH = self._heading

    def _should_block_intercept(self):
        t = timeToReachCoronalPlaneWithFriction()
        final_y = YWhenReachCoronalPlane()
        rolling_upfield = abs(ballWorldVel().heading()) < radians(60)

        if (
            ballRelVel().length() > BALL_MOVING_SPEED_THRESH
            and ballLostTime() < 0.5
            and t < 2.0
            and abs(final_y) < BLOCK_SIDE_LIMIT
            and not rolling_upfield
        ):
            return True

        return False

    def _should_adjust_position(self):
        pos_error = myPos().distanceTo(self._position)
        head_error = abs(myHeading() - self._heading)

        # If we're adjusting position, be extra certain
        # that we're in the correct position before switching
        # to "Crouch" or "Stand", so that we don't flicker
        # between the two states. Hence the 0.5 * the errors
        if self._current_sub_task in ("Crouch", "Stand"):
            if pos_error > self._position_error or head_error > self._heading_error:
                return True
        else:
            if pos_error > self._position_error * 0.5 or head_error > self._heading_error * 0.5:
                return True

        return False

    def _should_face_final_heading(self):
        pos_error = myPos().distanceTo(self._position)

        # If we're already in WalkFacingFinalHeading, be a bit more
        # generous about facing the final heading.
        # Otherwise, (if we're not in WalkFacingFinalHeading), be certain
        # that we should face final heading.
        # This is done by having a hysteresis with DISTANCE_MARGIN
        if self._current_sub_task == "WalkFacingFinalHeading":
            if pos_error < self._dist_to_face_final_heading + DISTANCE_MARGIN:
                return True
        else:
            if pos_error < self._dist_to_face_final_heading - DISTANCE_MARGIN:
                return True

        return False

    def _should_circle_around_ball(self):
        if in_ready():
            return False
        dist_to_ball = ballDistance()
        if self._current_sub_task == "CircleAroundBall":
            if dist_to_ball < STAY_AWAY_DISTANCE + RADIUS_MARGIN:
                return True
        else:
            if dist_to_ball < STAY_AWAY_DISTANCE - RADIUS_MARGIN:
                return True
        return False
