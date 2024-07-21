# This script uploads the robot system image to the image repository
REALPATH="$(realpath "$0")"
BIN_DIR="$(dirname "$REALPATH")"
IMAGE_PATH="$BIN_DIR/../softwares/image.opn"
rsync -aP $IMAGE_PATH repository@runswift2.cse.unsw.edu.au:/var/www/html/opennao2/build-2.8.5.1x/ubuntu-22.04-ros2.opn