class_<RefereeHandsVisionInfo>("RefereeHandsVisionInfo")
   .def_readonly("left"       , &RefereeHandsVisionInfo::left)
   .def_readonly("right"       , &RefereeHandsVisionInfo::right);

class_<RefereeHand>("RefereeHand")
   .def_readonly("topImageCoords"       , &RefereeHand::topImageCoords);
