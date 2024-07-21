from BehaviourTask import BehaviourTask
from util.ObstacleAvoidance import (
    lsonar_clear_seconds,
    rsonar_clear_seconds,
    lfoot_bumper_clear_seconds,
    rfoot_bumper_clear_seconds,
)
from util.actioncommand import stand


class SonarAndBumperTest(BehaviourTask):
    def _tick(self):
        self.world.b_request.actions.body = stand()

        print("lsonar: %s" % lsonar_clear_seconds())
        print("rsonar: %s" % rsonar_clear_seconds())
        print("rfbumper: %s" % lfoot_bumper_clear_seconds())
        print("lfbumper: %s" % rfoot_bumper_clear_seconds())
