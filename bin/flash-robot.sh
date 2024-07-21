#!/bin/bash

REALPATH="$(realpath "$0")"
BIN_DIR="$(dirname "$REALPATH")"

CONTROL_SOCKET="/tmp/control_%C"
SSH="ssh -o ControlMaster=auto -o ControlPath=$CONTROL_SOCKET -o ControlPersist=1m"
SCP="scp -o ControlPath=$CONTROL_SOCKET"
IMAGE_FILE="$BIN_DIR/../softwares/image.opn"
DESTINATION_DIR="/home/.image"
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <robot host or ip>"
    echo "Example: $0 aragorn"
    exit 1
fi

hostname="$1"
echo $hostname

cleanup() {
    # Cleanup the control master
    ssh -o ControlPath=$CONTROL_SOCKET -O exit nao@$hostname 2>/dev/null
}

# Register the cleanup function to be called on script exit
trap cleanup EXIT

# Start the control master
$SSH -N -f nao@$hostname
SYSTEM=`$SSH -t nao@$hostname "if [ -d /data ]; then echo "softbank"; else echo "ubuntu"; fi" | tr -d '\r' | tr -d '\n' | xargs`
# SYSTEM="ubuntu"

if [ "$SYSTEM" == "softbank" ]; then
    DESTINATION_DIR="/data/.image"
    echo "Softbank image detected, writing image into $DESTINATION_DIR"
elif [ "$SYSTEM" == "ubuntu" ]; then
    echo "Ubuntu image detected, writing image into $DESTINATION_DIR"
else 
    echo "Unknown system $SYSTEM"
    exit 1
fi

$SSH -t nao@$hostname "sudo rm -rf $DESTINATION_DIR && sudo mkdir -p $DESTINATION_DIR && sudo chown nao:nao $DESTINATION_DIR"
$SCP $IMAGE_FILE nao@$hostname:$DESTINATION_DIR

read -p 'Reboot?[y/n] ' should_reboot
if [ "$should_reboot" = "y" ]; then
    $SSH -t nao@$hostname "sudo reboot now"
    echo "Rebooting $hostname ..."
fi
