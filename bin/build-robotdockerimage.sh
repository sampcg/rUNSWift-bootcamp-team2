# This scripts builds the docker robot image
# based on the nao image
# we are using root.tgz which is an output of build-naoimage.sh
# so if doesn't exist, please run it first
REALPATH="$(realpath "$0")"
BIN_DIR="$(dirname "$REALPATH")"
BASE_IMAGE_FILE="$BIN_DIR/../softwares/NaoImage/root.tgz"
if [[ ! -f $BASE_IMAGE_FILE ]]; then
  echo "root robot system not found, try running build-naoimage.sh first"
  exit 1
fi
docker import --platform=linux/amd64 softwares/NaoImage/root.tgz runswift/v6_base:latest