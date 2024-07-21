class_<BehaviourBlackboard>("BehaviourBlackboard")
   .def_readonly("skill"              , &BehaviourBlackboard::skill)
   .def_readonly("headskill"          , &BehaviourBlackboard::headskill)
   .def_readonly("positioning"          , &BehaviourBlackboard::positioning)
   .def_readonly("walkSpeed", &BehaviourBlackboard::walkSpeed)
   .def_readonly("dribbleSpeed", &BehaviourBlackboard::dribbleSpeed)
   .def_readonly("behaviourSharedData", &BehaviourBlackboard::behaviourSharedData)
   .def_readonly("remoteStiffen", &BehaviourBlackboard::remoteStiffen);
