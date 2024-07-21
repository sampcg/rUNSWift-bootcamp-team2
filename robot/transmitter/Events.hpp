#pragma once

#include <utils/Timer.hpp>
#include <functional>
#include <limits>
#include <string>
#include "blackboard/Blackboard.hpp"


class EventTracker;
void addBasicEvents(std::vector<std::unique_ptr<EventTracker>>& events);

// the time to wait before sending a packet if no event has occurred
constexpr double NO_EVENT_SEND_TIME_S = 25;

/**
 * Represents an event where we might want to send an event.
 * This is for event-based comms
 */
class EventTracker {
public:
    virtual ~EventTracker() = default;

    EventTracker(std::string_view name, double intervalSecs): EventTracker(name, nullptr, intervalSecs) {
        // trusting shouldSend is overridden
    }

    EventTracker(std::string_view name, const std::function<bool(Blackboard*)>& condition, double intervalSecs)
        : condition(condition),
          intervalSecs(intervalSecs),
          name(name) {
        // we want to be instant the first time regardless of the time we have set
        timer.set_zero();
    }

    /**
     * Run when a packet is sent, only exists in case the event wishes to act differently after a packet is sent
     */
    virtual void packetSent(Blackboard* blackboard) {
    }

    virtual bool shouldSend(Blackboard* blackboard) {
        return condition(blackboard);
    }

    // how often to send a packet if this event is active.
    Timer timer;
    std::string name; // for logging
    // track when to send the next packet. One per event to ensure we correctly send packets as we switch between events
    const double intervalSecs = std::numeric_limits<double>().max();
private:
    const std::function<bool(Blackboard*)> condition = nullptr; // decides if this event is active
};

/**
 * Sends packets if the robot moved a far distance
 */
class DistanceEventTracker : public EventTracker {
public:
    DistanceEventTracker()
        : EventTracker("DistanceTracker", 4){
    }

    void packetSent(Blackboard* blackboard) override;
    bool shouldSend(Blackboard* blackboard) override;
    AbsCoord lastSentPos;
};
/**
 * Sends packets if the ball moved a far distance
 */
class BallEventTracker : public EventTracker {
public:
    BallEventTracker()
        : EventTracker("BallDistanceTracker", 5){
    }

    void packetSent(Blackboard* blackboard) override;
    bool shouldSend(Blackboard* blackboard) override;
    AbsCoord lastSeenBallPos;
};

/**
 * Sends packets if the robot needs assistance (loses ball > 2 sec)
 */
class NeedsAssistanceEventTracker : public EventTracker {
public:
    NeedsAssistanceEventTracker()
        : EventTracker("NeedsAssisance", 2){
    }

    bool shouldSend(Blackboard* blackboard) override;
    bool canAskForAssistance = true;
};
