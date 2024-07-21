# We use this script to run commands inside the docker container representing a robot
# bin/docker_robot.sh whoami
REALPATH=$(realpath "$0")
BIN_DIR=$(dirname "$REALPATH")
ROBOT_ROOT_DIR=$BIN_DIR/../containers/robot

docker run --rm --platform linux/amd64 -it $(docker build --platform linux/amd64 -f $ROBOT_ROOT_DIR/Dockerfile -q -t runswift/v6:latest $ROBOT_ROOT_DIR) "$@"
