#pragma once

#include <string>
#include <fstream>

class Blackboard;

class PerceptionDumper
{
   public:
      PerceptionDumper(const char *path, bool shouldOverwrite = false);
      virtual ~PerceptionDumper();

      void dump(Blackboard *blackboard);

      const std::string &getPath() const;

   private:
      std::string path;
      std::ofstream of;
};
