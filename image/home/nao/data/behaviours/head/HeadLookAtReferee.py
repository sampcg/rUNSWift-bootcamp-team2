from BehaviourTask import BehaviourTask
from head.HeadFixedYawAndPitch import HeadFixedYawAndPitch
from util.TeamStatus import my_player_number

class HeadLookAtReferee(BehaviourTask):

    REF_NEGATIVE_Y_POS = [
        (0, 0),
        (0.5, 0),
        (-1.6, -0.15),
        (0.4, 0),
        (-1.6, -0.35),
        (0.22, 0),
        (-1.5, -1.0),
        (0.1, 0)
    ]

    REF_POSITIVE_Y_POS = [
        (0, 0),
        (1.6, -0.1),
        (-0.5, 0),
        (1.6, -0.3),
        (-0.36, 0),
        (1.6, -0.8),
        (-0.23, 0),
        (1.5, -1.0)
    ]

    player_number = my_player_number()

    if (player_number % 2 == 0):
        YAW, PITCH = REF_POSITIVE_Y_POS[player_number]
    else:
        YAW, PITCH = REF_NEGATIVE_Y_POS[player_number]

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"HeadFixedYawAndPitch": HeadFixedYawAndPitch(self)}

    def _reset(self):
        self._current_sub_task = "HeadFixedYawAndPitch"

    def _tick(self):
        self._tick_sub_task(self.YAW, self.PITCH)
