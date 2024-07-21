from math import radians
from copy import deepcopy
from WalkStraightToPose import WalkStraightToPose
from Stand import Stand
from BehaviourTask import BehaviourTask
from util.Constants import HALF_FIELD_LENGTH, FIELD_WIDTH
from util.Vector2D import Vector2D
from util.FieldGeometry import calculateTimeToReachPose
from util.Global import myPos, myHeading
from util.Timer import WallTimer


class SearchHalfField(BehaviourTask):
    """
    Description:
    Walks between the poses in DEFAULT_POSES. Stands and waits for a moment at each pose

    Intended to be used with OneVsOne.py

    """

    UPFIELD_Y = FIELD_WIDTH / 8  # 750 for a full size field
    BASELINE_Y = FIELD_WIDTH / 10  # 600 for a full size field

    DEFAULT_POSES = [
        (Vector2D(-HALF_FIELD_LENGTH + 400, -BASELINE_Y), radians(-45)),
        (Vector2D(-HALF_FIELD_LENGTH + 400, BASELINE_Y), radians(45)),
        (Vector2D(-HALF_FIELD_LENGTH / 2.3, -UPFIELD_Y), radians(-45)),
        (Vector2D(-HALF_FIELD_LENGTH / 2.3, UPFIELD_Y), radians(45)),
    ]

    _sequence = deepcopy(DEFAULT_POSES)
    _timer = WallTimer()
    _fail_count = 0

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "Walk": WalkStraightToPose(self),
            "Stand": Stand(self),
        }

    def _transition(self):
        if (
            self._current_sub_task == "Walk"
            and abs(myHeading() - self._target_heading) < radians(5)
            and self._target_pos.minus(myPos()).length() < 100
        ):
            self._current_sub_task = "Stand"
            self._timer = WallTimer()
        elif self._current_sub_task == "Stand" and self._timer.elapsedSeconds() > 3:
            self._current_sub_task = "Walk"

            # We're reached and stood at one of the positions
            self._sequence.remove((self._target_pos, self._target_heading))
            print("removing pose", self._target_pos)

            # Grab a new pose if it exists, otherwise we're finished
            if len(self._sequence):
                pose = self.cal_next_closest()
                self._fail_count = 0
                self._target_pos, self._target_heading = pose
            else:
                self.finished = True
            self._timer = WallTimer()

    def _tick(self):
        if self._current_sub_task == "Walk":
            self._tick_sub_task(final_pos=self._target_pos, final_heading=self._target_heading)
        else:
            self._tick_sub_task()

    def _reset(self):
        self.finished = False
        self._current_sub_task = "Walk"

        # Keep track of how many times we've switched back to this skill "quickly"
        # (Trying to capture if we're stuck in a loop)
        if self._timer.elapsedSeconds() < 30:
            self._fail_count = self._fail_count + 1

        # If we're flickering between states then give up on this pose. Look for other balls
        if self._fail_count >= 5:
            print("Failed too many times, Giving up on this pose", self._target_pos)
            self._sequence.remove((self._target_pos, self._target_heading))
            self._fail_count = 0

        if len(self._sequence) == 0:
            self._sequence = deepcopy(self.DEFAULT_POSES)

        self._timer = WallTimer()
        self._target_pos, self._target_heading = self.cal_next_closest()

    def cal_next_closest(self):
        closest_time = -1
        closest_pose = None
        for i, p in enumerate(self._sequence):
            time = calculateTimeToReachPose(myPos(), myHeading(), p[0], p[1])
            if closest_time > time or closest_time == -1:
                closest_time = time
                closest_pose = p

        print("Walking to", closest_pose, "sequence is now", self._sequence)
        return closest_pose
