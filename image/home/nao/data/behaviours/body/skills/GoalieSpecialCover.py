from BehaviourTask import BehaviourTask
from body.skills.Anticipate import Anticipate
from math import radians
from util.Global import teamBallWorldPos, myPos


class GoalieSpecialCover(BehaviourTask):
    """
    Description:
    A goalie skill to cover the area that is most
    possible to have a ball
    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Anticipate": Anticipate(self)}

    def _reset(self):
        self._current_sub_task = "Anticipate"
        if teamBallWorldPos().y > myPos().y:
            self._cover_heading = radians(70)
        else:
            self._cover_heading = -radians(70)

    def _tick(self):
        self._tick_sub_task(
            position=myPos(),
            heading=self._cover_heading,
            position_error=100,
            heading_error=radians(13),
            stay_crouched=True,
            dist_to_face_final_heading=1500,
            speed=1.0,
        )
