from BehaviourTask import BehaviourTask
from body.skills.FindBall import FindBall
from body.skills.Shoot import Shoot
from body.skills.Stand import Stand
from body.skills.Dribble import Dribble
from util.Global import ballLostFrames


class PassingChallenge(BehaviourTask):
    """
    Description:
    Behaviour file for 2021 Challenge 2 - Passing Challenge
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "FindBall": FindBall(self),
            "Shoot": Shoot(self),
            "Stand": Stand(self),
            "Dribble": Dribble(self),
        }

    def _transition(self):
        if ballLostFrames() > 50:
            self._current_sub_task = "FindBall"
        else:
            self._current_sub_task = "Dribble"

    def _reset(self):
        self._current_sub_task = "FindBall"
