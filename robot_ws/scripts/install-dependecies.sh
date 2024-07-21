#!/bin/bash

# dependencies installation script

REALPATH="$(realpath "$0")"
SCRIPTS_DIR="$(dirname "$REALPATH")"
SRC_DIR=$SCRIPTS_DIR/../src

$SCRIPTS_DIR/pre-vcs.sh
vcs import $SRC_DIR < $SRC_DIR/runswift-sandbox/dependencies.repos --recursive
$SCRIPTS_DIR/post-vcs.sh

$SCRIPTS_DIR/pre-rosdep.sh
rosdep install --from-paths $SRC_DIR --ignore-src -r -y
$SCRIPTS_DIR/post-rosdep.sh
