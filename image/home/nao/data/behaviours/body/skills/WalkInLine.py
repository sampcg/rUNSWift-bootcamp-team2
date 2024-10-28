from BehaviourTask import BehaviourTask
from body.skills.Walk import Walk
class WalkInLine(BehaviourTask):

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"Walk": Walk(self)}

    def _reset(self):
        self._current_sub_task = "Walk"
    
    def _tick(self):
        self._tick_sub_task(forward=50)