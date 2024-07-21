#include "PerceptionDumper.hpp"

#include "blackboard/Blackboard.hpp"

PerceptionDumper::PerceptionDumper(const char *path, bool shouldOverwrite)
    : path(path),
      of(path, shouldOverwrite ? std::ios::out : std::ios::app)
{
}

PerceptionDumper::~PerceptionDumper()
{
}

const std::string &PerceptionDumper::getPath() const
{
    return path;
}

void PerceptionDumper::dump(Blackboard *blackboard)
{
    // mask set before dump to attempt to allow multiple clients to stream different things
    blackboard->write(&(blackboard->mask), blackboard->debugMask);
    blackboard->serialise(of);
}
