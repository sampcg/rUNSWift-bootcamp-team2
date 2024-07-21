#!/bin/bash

# This script loops through all the USBs in ext4 format and copies all the
# contents to a specified folder. The USB must have a file called iam_usbX,
# where X is a number.
# This requires macfuse. Setup guide:
# https://www.jeffgeerling.com/blog/2024/mounting-ext4-linux-usb-drive-on-macos-2024
# This only work on MacOS

# Check if the destination directory is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <destination_directory>"
    exit 1
fi

# Set the destination directory from the first command line argument
DESTINATION_DIR="$1"

# Create a temporary mount point
MOUNT_POINT="/tmp/ext4_mount"
mkdir -p "$MOUNT_POINT"

# Function to log messages with timestamps
log() {
    echo "$(date '+%H:%M:%S') - $1"
}

# Find all ext4 formatted USBs
USB_DEVICES=$(diskutil list external | grep "Linux Filesystem" | awk '{print $NF}')

if [ -z "$USB_DEVICES" ]; then
    log "No ext4 formatted USBs found."
    exit 1
fi

for USB in $USB_DEVICES; do
    log "Mounting $USB"
    ~/ext4fuse/ext4fuse /dev/$USB "$MOUNT_POINT" -o allow_other

    if [ $? -ne 0 ]; then
        log "Failed to mount $USB"
        continue
    fi

    USB_ID_FILE="$MOUNT_POINT/iam_usb*"
    USB_ID=$(basename $(ls $USB_ID_FILE 2>/dev/null) 2>/dev/null)

    if [ -z "$USB_ID" ]; then
        log "Failed to find USB ID file on $USB"
        umount "$MOUNT_POINT"
        continue
    fi

    SUBDIR_NAME="${USB_ID#iam_}"
    TARGET_DIR="$DESTINATION_DIR/$SUBDIR_NAME"

    log "Copying contents of $USB to $TARGET_DIR"
    mkdir -p "$TARGET_DIR"
    cp -r "$MOUNT_POINT/"* "$TARGET_DIR/"

    if [ $? -ne 0 ]; then
        log "Failed to copy contents from $USB to $TARGET_DIR"
    else
        log "Successfully copied contents from $USB to $TARGET_DIR"
    fi

    log "Unmounting $USB"
    umount "$MOUNT_POINT"

    if [ $? -ne 0 ]; then
        log "Failed to unmount $USB"
    else
        log "Successfully unmounted $USB"
    fi
done

log "Script completed."
