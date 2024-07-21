#!/bin/bash
set -e
# We use this script to run commands inside the docker container
# For example, we can use it to run the build like this
# bin/docker.sh bin/build.sh
# Or we can just log into the docker and work inside it
# bin/docker.sh
REALPATH=$(realpath "$0")
BIN_DIR=$(dirname "$REALPATH")
PROJECT_ROOT_DIR=$BIN_DIR/../
CCACHE_DIR=~/.ccache-runswift
mkdir -p $CCACHE_DIR
flavour=v6
# exports DISPLAY, allowing you to run GUI apps in this container (assuming your VM has a X11 server running, or you have a X11 server running on your host and have it set up correctly)
# We also expose your .ssh to support sshing to robots while inside docker, replicating the current host user to ensure no perm issues
docker run --rm --platform linux/amd64 -it --privileged -v $(pwd):/root/dev/rUNSWift -v $CCACHE_DIR:/root/.ccache -e CCACHE_DIR=/root/.ccache \
-e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix -v ~/.ssh:/root/.ssh -e LOCAL_USER_ID=$(id -u) -e LOCAL_GROUP_ID=$(id -g) runswift/$flavour:latest "$@"
# docker run --rm --platform linux/amd64 -it --privileged -v $(pwd):/root/dev/rUNSWift $(docker build --platform linux/amd64 -q -t runswift/$flavour:latest $PROJECT_ROOT_DIR) "$@"
