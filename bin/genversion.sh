#!/bin/bash
# Sometimes we need to make sure we've synced the right version of the binary to the robot.
# We can view version information by running `runswift -v`. 
# This script gets version information from version.sh and embeds it into the code before compilation
REALPATH=$(realpath "$0")
BIN_DIR=$(dirname "$REALPATH")
source "$BIN_DIR/source.sh"

cat << VERSION_CPP
#include "utils/version.hpp"

std::string getVersion() {
  return $(version.sh | sed -r 's/^/"/;s/$/\\n"/');
}
VERSION_CPP
