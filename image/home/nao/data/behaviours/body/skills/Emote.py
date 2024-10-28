from BehaviourTask import BehaviourTask
from body.skills.Walk import Walk
from body.skills.RaiseArm import RaiseArm
from head.HeadDown import HeadDown
from util.Timer import Timer


class Emote(BehaviourTask):
   # Description: raise arm and then walk in straight line

    def _initialise_sub_tasks(self):
        self._sub_tasks = {"RaiseArm": RaiseArm(self)}

    def _reset(self):
        self._current_sub_task = "RaiseArm"
    
   
    def _tick(self): # In mm/s"
        #self.world.b_request.actions.body = RaiseArm()
        #self.world.b_request.actions.body = RaiseArm(150, 0)
        self._tick_sub_task()
        #self._tick_sub_task(RaiseArm)
      #  if self.my_timer.finished():
      #      self._tick_sub_task = "Walk"
        