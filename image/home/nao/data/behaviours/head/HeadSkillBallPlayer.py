from BehaviourTask import BehaviourTask
from head.HeadTrackBall import HeadTrackBall
from head.HeadFindBall import HeadFindBall
from head.HeadDefensiveGoalFreeKick import HeadDefensiveGoalFreeKick
from util.Global import ballLostTime, ballWorldPos, getCurrentSkill
from util.GameStatus import in_goal_kick, we_are_kicking_team


class HeadSkillBallPlayer(BehaviourTask):
    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "TrackBall": HeadTrackBall(self),
            "FindBall": HeadFindBall(self),
            "HeadDefensiveGoalFreeKick": HeadDefensiveGoalFreeKick(self),
        }

    def _reset(self):
        self._current_sub_task = "FindBall"
        self._should_stay_in_own_half = getCurrentSkill() == "OneVsOne"

    def _transition(self):
        if in_goal_kick() and not we_are_kicking_team():
            self._current_sub_task = "HeadDefensiveGoalFreeKick"
        elif self._should_stay_in_own_half and ballLostTime() < 0.5 and ballWorldPos().x > 10:
            # for 1v1 don't look at balls on the other side of the field
            self._current_sub_task = "FindBall"
        elif ballLostTime() < 0.5:
            self._current_sub_task = "TrackBall"
        else:
            self._current_sub_task = "FindBall"
