"""
signal behaviour names based on which hand the robot uses
"""

from BehaviourTask import BehaviourTask
from body.skills.Stand import Stand
from audio.whistle_controller import start_listening_for_whistles
from body.skills.SignalKickInRight import SignalKickInRight
from body.skills.SignalKickInLeft import SignalKickInLeft
from body.skills.SignalGoalKickRight import SignalGoalKickRight
from body.skills.SignalGoalKickLeft import SignalGoalKickLeft
from body.skills.SignalCornerKickRight import SignalCornerKickRight
from body.skills.SignalCornerKickLeft import SignalCornerKickLeft
from body.skills.SignalGoalRight import SignalGoalRight
from body.skills.SignalGoalLeft import SignalGoalLeft
from body.skills.SignalPushingFreeKickRight import SignalPushingFreeKickRight
from body.skills.SignalPushingFreeKickLeft import SignalPushingFreeKickLeft
from body.skills.SignalFullTime import SignalFullTime

import os
from datetime import datetime

NAO_WHISTLE_LOCATION = os.path.join(os.environ["HOME"], "whistle/heard_whistles")
WHISTLE_FILE_FORMAT = "whistle_%Y_%m_%d_%H%M%S.wav"


class VisualReferee(BehaviourTask):
    """
    Description:
    Behaviour for the Visual Referee challenge 2022

        - Listens to whistle
        - Scans for an image
        - Says and does a specific signal

    """

    def _initialise_sub_tasks(self):
        self._sub_tasks = {
            "ListenWhistle": Stand(self),
            "IdentifySignal": Stand(self),
            "SignalKickInRight": SignalKickInRight(self),
            "SignalKickInLeft": SignalKickInLeft(self),
            "SignalGoalKickRight": SignalGoalKickRight(self),
            "SignalGoalKickLeft": SignalGoalKickLeft(self),
            "SignalCornerKickRight": SignalCornerKickRight(self),
            "SignalCornerKickLeft": SignalCornerKickLeft(self),
            "SignalGoalRight": SignalGoalRight(self),
            "SignalGoalLeft": SignalGoalLeft(self),
            "SignalPushingFreeKickRight": SignalPushingFreeKickRight(self),
            "SignalPushingFreeKickLeft": SignalPushingFreeKickLeft(self),
            "SignalFullTime": SignalFullTime(self),
        }

    def _reset(self):
        self._prev_sub_task = "ListenWhistle"
        self._current_sub_task = "ListenWhistle"
        self._whistle_heard = False
        self._current_signal = None
        start_listening_for_whistles()

    def _tick(self):
        if self._current_sub_task == "ListenWhistle":
            if whistle_heard(num_seconds=10):
                self._whistle_heard = True
            self._tick_sub_task()

        elif self._current_sub_task == "IdentifySignal":
            self.identify_signal()
            self._tick_sub_task()

        else:
            self._tick_sub_task()

    def _transition(self):
        if self._current_sub_task == "ListenWhistle" and self._whistle_heard:
            self._current_sub_task = "IdentifySignal"
            self._prev_sub_task = "ListenWhistle"
        elif self._current_sub_task == "IdentifySignal" and self._current_signal:
            self.set_signal_sub_task()
            self._prev_sub_task = "IdentifySignal"

    def identify_signal(self):
        # TO DO : add signal determination logic here
        self._current_signal = "SignalKickInRight"

    def set_signal_sub_task(self):
        print("current signal")
        print(self._current_signal)
        self._current_sub_task = self._current_signal


def whistle_heard(num_seconds):
    """
    from whistle_detector.py
    :return: True if a whistle file was created in the last num_seconds.
    """
    now = datetime.now()

    # Ensure folder exists
    if not os.path.exists(NAO_WHISTLE_LOCATION):
        os.makedirs(NAO_WHISTLE_LOCATION)
    file_names = sorted(os.listdir(NAO_WHISTLE_LOCATION))

    deltas = [now - datetime.strptime(file_name, WHISTLE_FILE_FORMAT) for file_name in file_names]
    # Note: Check both abs() and non-abs() so we ignore future whistles
    return any(abs(delta.total_seconds()) < num_seconds and delta.total_seconds() < num_seconds for delta in deltas)
