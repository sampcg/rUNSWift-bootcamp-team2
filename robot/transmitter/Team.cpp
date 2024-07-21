#include "Team.hpp"
#include "blackboard/Blackboard.hpp"
#include "types/SPLStandardMessage.hpp"
#include "utils/incapacitated.hpp"
#include "utils/Timer.hpp"

using namespace boost::asio;
using namespace std;

namespace {
   constexpr auto TOTAL_PACKET_LIMIT = 1200;
}

TeamTransmitter::TeamTransmitter(Blackboard *bb) :
   Adapter(bb),
   NaoTransmitter((bb->config)["network.transmitter_base_port"].as<int>()
                  + (bb->config)["player.team"].as<int>(),
                  (bb->config)["network.transmitter_address"].as<string>())
{
   addBasicEvents(events);
}

void TeamTransmitter::tick() {
   // here we decide if we want to send a packet or not.
   // this could be event based, or the default time if no event occurs
   bool shouldSendMsg = false;
   if (timer.elapsed() > NO_EVENT_SEND_TIME_S) {
      llog(INFO) << "No event has occured for " << timer.elapsed() << " seconds" << endl;
      shouldSendMsg = true;
   }

   for (auto& event : events) {
      if (event->shouldSend(blackboard) && event->timer.elapsed() > event->intervalSecs) {
         llog(INFO) << "Sending event for " << event->name << endl;
         shouldSendMsg = true;
         event->timer.restart();
      }
   }


   if(!shouldSendMsg) {
      return;
   }
   llog(INFO) << "Sending team packet" << endl;
   timer.restart();
   BroadcastData bd((blackboard->config)["player.number"].as<int>(),
                    readFrom(stateEstimation, robotPos),
                    readFrom(stateEstimation, ballPos),
//                    readFrom(stateEstimation, ballPosRR),
//                    readFrom(stateEstimation, sharedStateEstimationBundle),
                   readFrom(behaviour, behaviourSharedData),
                    readFrom(motion, active).body.actionType,
                    readFrom(motion, uptime),
                    readFrom(gameController, gameState));

   // calculate incapacitated
   int playerNum = (blackboard->config)["player.number"].as<int>();
   bool incapacitated = false;
   if (readFrom(gameController, our_team).players[playerNum - 1].penalty
       != PENALTY_NONE) {
      incapacitated = true;
   }

   const ActionCommand::Body::ActionType &acB =
            readFrom(motion, active).body.actionType;
   incapacitated |= isIncapacitated(acB);

   const AbsCoord &robotPos = readFrom(stateEstimation, robotPos);

   SPLStandardMessage m (playerNum,
                         readFrom(gameController, our_team).teamNumber, // team
                         incapacitated, // fallen
                         robotPos,
                         0,
                         readFrom(stateEstimation, ballPos),
                         bd);

   writeTo(stateEstimation, havePendingOutgoingSharedBundle, false);

   // Stop sending team packets when our current budget hit this.
   // if we're in the first half, make the hard limit half the total limit
   u_int16_t packet_hard_limit = readFrom(gameController, data).firstHalf ? TOTAL_PACKET_LIMIT / 2 : 50;
   if (readFrom(gameController, our_team).messageBudget > packet_hard_limit) {
      NaoTransmitter::tick(boost::asio::buffer(&m, sizeof(SPLStandardMessage)));
      for (auto& event : events)
      {
         event->packetSent(blackboard);
      }
   }
   else {
      llog(INFO) << "We've hit our packet limit: " << readFrom(gameController, our_team).messageBudget << "/" <<
         packet_hard_limit << endl;
   }
 }
