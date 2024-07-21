#!/bin/bash
set -e
# We use this script to make the docker container that we use for building code and image
# Just run it every time you changed something in the Dockerfile
REALPATH=$(realpath "$0")
BIN_DIR=$(dirname "$REALPATH")
PROJECT_ROOT_DIR=$BIN_DIR/../
CCACHE_DIR=~/.ccache-runswift
mkdir -p $CCACHE_DIR
flavour=v6
docker build --platform linux/amd64 -t runswift/$flavour:latest $PROJECT_ROOT_DIR
