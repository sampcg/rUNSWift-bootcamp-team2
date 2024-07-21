from BehaviourTask import BehaviourTask
from head.HeadLocalise import HeadLocalise
from head.HeadFindBall import HeadFindBall

from util.GameStatus import ChallengePhase  # , challenge_phase


class AutoCalibrationHeadSkill(BehaviourTask):
    """Head skill behaviour for 2021 AutonomousCalibration challenge"""

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"FindBall": HeadFindBall, "Localise": HeadLocalise}

    def _reset(self):
        self._current_sub_task = "FindBall"

    def _transition(self):
        # phase = challenge_phase() # Read what part of the challenge we're up to, from blackboard - TODO
        phase = ChallengePhase.AUTO_CALIBRATION_PHASE_2_1  # Temporary until challenge phase is updated on blackboard

        if phase in [ChallengePhase.AUTO_CALIBRATION_PHASE_2_1, ChallengePhase.AUTO_CALIBRATION_PHASE_2_4]:
            self._current_sub_task = "FindBall"  # If searching for the ball to report, use findBall head skill
        else:
            self._current_sub_task = "Localise"  # Otherwise, try to localise better
        return
