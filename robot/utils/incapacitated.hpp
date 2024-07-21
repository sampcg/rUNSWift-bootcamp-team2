#pragma once

#include "gamecontroller/RoboCupGameControlData.hpp"
#include "types/ActionCommand.hpp"

//if no packets are received for <SECS_TILL_INCAPACITATED> seconds, a robot will be considered inactive
//this value should be decided based on the current value for TeamTransmitter fps defined in main.cpp
#define SECS_TILL_INCAPACITATED 7

#define MIN_UPTIME 20

using namespace ActionCommand;

inline bool isIncapacitated(const ActionCommand::Body::ActionType &acB) {
   return
   	  // VWong: If you have fallen over, you're not completely incapacitated
      //acB == Body::GETUP_BACK ||
      //acB == Body::GETUP_FRONT ||
      //acB == Body::TIP_OVER ||
      //acB == Body::LIMP ||
      acB == Body::REF_PICKUP ||
      acB == Body::GOALIE_DIVE_RIGHT ||
      acB == Body::GOALIE_DIVE_LEFT;
}
