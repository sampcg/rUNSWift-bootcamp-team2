#pragma once

#include <blackboard/Blackboard.hpp>

#include "Nao.hpp"
#include <utils/Timer.hpp>
#include "Events.hpp"
#include "blackboard/Adapter.hpp"

class TeamTransmitter : Adapter, NaoTransmitter {
   public:
      /**
       * Constructor. Opens a socket for listening.
       */
      TeamTransmitter(Blackboard *bb);

      ~TeamTransmitter() override = default;

      /**
       * One cycle of this thread
       */
      void tick();

   private:
      Timer timer;
      std::vector<std::unique_ptr<EventTracker>> events;
};

