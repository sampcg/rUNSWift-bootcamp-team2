#!/bin/bash

# Actions to be performed before rosdep install
REALPATH="$(realpath "$0")"
SCRIPTS_DIR="$(dirname "$REALPATH")"
SRC_DIR=$SCRIPTS_DIR/../src

echo "**pre-rosdep: start**"

echo "**pre-rosdep: nao**"
if [ ! -d "$SRC_DIR/nao/nao_description/meshes" ]
then 
    $SRC_DIR/nao/nao_description/install.sh
fi

echo "**pre-rosdep: end**"