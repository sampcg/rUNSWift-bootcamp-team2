from BehaviourTask import BehaviourTask
from body.skills.FindBall import FindBall
from body.skills.Shoot import Shoot
from body.skills.Stand import Stand
from util.Global import ballLostFrames, ballDistance
from util.TeamStatus import player_number_time_to_reach_ball, my_player_number, get_active_player_numbers
from util.FieldGeometry import timeToReachBall


ballLostFramesCnt_max = 500


class Openday(BehaviourTask):
    def _initialise_sub_tasks(self):
        self._sub_tasks = {"FindBall": FindBall(self), "Shoot": Shoot(self), "Stand": Stand(self)}

    def _transition(self):
        self.world.b_request.behaviourSharedData.timeToReachBall = timeToReachBall()
        if ballLostFrames() > 50:
            self._current_sub_task = "FindBall"
        else:
            if not self._should_play_ball():
                self._current_sub_task = "Stand"
            else:
                self._current_sub_task = "Shoot"

    def _reset(self):
        self._current_sub_task = "FindBall"

    def _should_play_ball(self):
        """
        Whether or not robot should be playing the ball
        """

        for player in get_active_player_numbers():
            if player == my_player_number():
                continue
            if player_number_time_to_reach_ball(player) > timeToReachBall() + 1:
                continue
                # If another robot is playing and is more than 1 seconds
                # closer to the ball then me, return False
            else:
                if player_number_time_to_reach_ball(player) <= timeToReachBall() - 1:
                    return False

                if ballDistance() < 500:
                    if my_player_number() < max(get_active_player_numbers()):
                        return False

        return True
