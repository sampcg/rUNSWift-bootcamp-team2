#include "Events.hpp"


namespace {
   constexpr auto ONE_METER_SQUARED_MM=1000*1000;
   constexpr auto TWO_METER_SQUARED_MM=2000*2000;
}

void addBasicEvents(std::vector<std::unique_ptr<EventTracker>>& events) {
    events.push_back(std::make_unique<EventTracker>("GoalOrCornerKick", [](Blackboard* blackboard)
      {
         return readFrom(gameController, data).setPlay == SET_PLAY_GOAL_KICK ||
            readFrom(gameController, data).setPlay == SET_PLAY_CORNER_KICK ||
            readFrom(gameController, data).setPlay == SET_PLAY_PUSHING_FREE_KICK;
         // we only need to send once, so set to max
      }, NO_EVENT_SEND_TIME_S));

    events.push_back(std::make_unique<EventTracker>("ReadySignal", [](Blackboard* blackboard)
    {
       if (readFrom(gameController, data).state == STATE_READY)
       {
          int robotsInReady = 0;
          for (int i = 0; i < ROBOTS_PER_TEAM; ++i)
          {
             if (readFrom(receiver, data)[i].gameState == STATE_READY)
             {
                robotsInReady++;
             }
          }
          // idea here is if we only see ourselves as ready, we should send packets so we can get the game started
          if (robotsInReady == 0)
          {
             return true;
          }
       }
       return false;
       // ready lasts for 45 seconds
    }, 45));

   events.push_back(std::make_unique<EventTracker>("GivingAssistance", [](Blackboard* blackboard)
    {
      return readFrom(behaviour, behaviourSharedData).isAssisting;
    },
    NO_EVENT_SEND_TIME_S));

   events.push_back(std::make_unique<EventTracker>("PlayingBall", [](Blackboard* blackboard)
  {
    return readFrom(behaviour, behaviourSharedData).playingBall;
  },
  NO_EVENT_SEND_TIME_S));

   events.push_back(std::make_unique<NeedsAssistanceEventTracker>());

   events.push_back(std::make_unique<EventTracker>("Kick", [](Blackboard* blackboard)
    {
      return readFrom(behaviour, behaviourSharedData).secondsSinceLastKick < 2;
    },
    3));

   events.push_back(std::make_unique<DistanceEventTracker>());

   events.push_back(std::make_unique<BallEventTracker>());
}

void DistanceEventTracker::packetSent(Blackboard* blackboard) {
   lastSentPos = readFrom(stateEstimation, robotPos);
}

bool DistanceEventTracker::shouldSend(Blackboard* blackboard) {
   const auto distVec = lastSentPos.vec - readFrom(stateEstimation, robotPos).vec;
   const auto distSq = distVec.squaredNorm();
   return distSq > ONE_METER_SQUARED_MM;
}

bool NeedsAssistanceEventTracker::shouldSend(Blackboard* blackboard) {
   if (canAskForAssistance && readFrom(behaviour, behaviourSharedData).needAssistance) {
      canAskForAssistance = false;
      return true;
   } else if (readFrom(vision, balls).size() > 0) {
      canAskForAssistance = true;
   }
   return false;
}

void BallEventTracker::packetSent(Blackboard* blackboard) {
   lastSeenBallPos = readFrom(stateEstimation, ballPos);
}

bool BallEventTracker::shouldSend(Blackboard* blackboard) {
   const auto distVec = lastSeenBallPos.vec - readFrom(stateEstimation, ballPos).vec;
   const auto distSq = distVec.squaredNorm();
   return distSq > TWO_METER_SQUARED_MM;
}
