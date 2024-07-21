from BehaviourTask import BehaviourTask
from head.HeadTrackBall import HeadTrackBall
from util.Global import myPosUncertainty, myHeadingUncertainty, myPoseHypothesesCount, timeSinceLastTeamBallUpdate
from head.HeadGlobalFindBall import HeadGlobalFindBall
from head.HeadLocalise import HeadLocalise
from math import radians
from util.TeamStatus import kick_notified


class HeadSkillAnticipate(BehaviourTask):
    """
    NOTE: this skill only runs if the robot
    is running the Game Body Skill (set by default), or
    unless the head behaviour skill is specified to this.
    """

    POS_UNCERTAINTY = 700 * 700
    HEADING_UNCERTAINTY = radians(25)
    TEAM_BALL_LOST_SECONDS = 2.0
    NUM_POSE_HYPOTHESES = 1

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "TrackBall": HeadTrackBall(self),
            "GlobalFindBall": HeadGlobalFindBall(self),
            "Localise": HeadLocalise(self),
        }

    def _reset(self):
        self._current_sub_task = "GlobalFindBall"

    def _transition(self):
        if kick_notified():
            self._current_sub_task = "TrackBall"
        elif (
            myPosUncertainty() > self.POS_UNCERTAINTY
            or myHeadingUncertainty() > self.HEADING_UNCERTAINTY
            or myPoseHypothesesCount() > self.NUM_POSE_HYPOTHESES
        ):
            self._current_sub_task = "Localise"
        elif timeSinceLastTeamBallUpdate() > self.TEAM_BALL_LOST_SECONDS:
            self._current_sub_task = "GlobalFindBall"
        else:
            self._current_sub_task = "TrackBall"
