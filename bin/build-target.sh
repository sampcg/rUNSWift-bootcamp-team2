#!/bin/bash

# Usage:
# ./bin/build-target.sh [target] [build_type]
#
# target: The specific target to build (e.g., runswift). Default is 'runswift'.
#         If 'all' is specified, all targets will be built.
# build_type: The type of build to perform (e.g., debug, relwithdebinfo). Default is 'relwithdebinfo'.

REALPATH=$(realpath "$0")
BIN_DIR=$(dirname "$REALPATH")
source "$BIN_DIR/source.sh"

cd ${RUNSWIFT_CHECKOUT_DIR}

CTC_VERSION=native

# Determine target (default to runswift)
if [ $# -eq 0 ]; then
    target="runswift"
else
    target="$1"
    shift # Remove the first argument from the list of arguments
fi

# Determine build type (default to relwithdebinfo)
if [ $# -eq 0 ]; then
    i="relwithdebinfo"
else
    i="$1"
    shift # Remove the first argument from the list of arguments
fi

BUILD_DIR=build-$i-$CTC_VERSION
mkdir -p $BUILD_DIR
cd $(readlink -f $BUILD_DIR)

# We should always run the cmake prepare steps, trusting cmake to skip if everything is already ready
echo "CMAKE!!!"
if (( $UBUNTU_VER >= 20 )); then
    echo "custom magic for Ubuntu 20.04 and above"
    cmake "$RUNSWIFT_CHECKOUT_DIR" -DCMAKE_BUILD_TYPE=$i \
    -D CMAKE_CXX_COMPILER_LAUNCHER=ccache \
    -D FULL_DEB_INFO="$([[ "$i" == "debug" ]] && echo "ON" || echo "OFF")" \
    -D PYTHON_INCLUDE_DIR=$(python3 -c "from distutils.sysconfig import get_python_inc; print(get_python_inc())")  \
    -D PYTHON_LIBRARY=/usr/local/lib/python3.10 \
    -D CMAKE_PREFIX_PATH=/usr/lib/x86_64-linux-gnu/qt5/bin:/usr/share/qt4
else
    cmake "$RUNSWIFT_CHECKOUT_DIR" -DCMAKE_BUILD_TYPE=$i
fi

git config --global --add safe.directory /root/dev/rUNSWift

# Get the number of available cores
cores=$(nproc)

# Calculate cores to use for make (cores - 1)
make_cores=$((cores - 1))

if [ "$make_cores" -lt 1 ]; then
    make_cores=1
fi

echo "Building with $make_cores cores"

# Handle 'all' target specially
if [ "$target" == "all" ]; then
    cmake --build . -- -j$make_cores
else
    cmake --build . --target $target -- -j$make_cores
fi

git rev-parse HEAD > ${RUNSWIFT_CHECKOUT_DIR}/image/home/nao/runswift.commit.sha
date > ${RUNSWIFT_CHECKOUT_DIR}/image/home/nao/runswift.build.time
