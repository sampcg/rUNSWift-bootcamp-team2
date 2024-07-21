#!/bin/bash

REALPATH=$(realpath "$0")
ROBOT_DIR=$(dirname "$REALPATH")

# Define the shared folder path
SHARED_FOLDER=$ROBOT_DIR/dev

# Specify the desired camera index and resolutions
TOP_CAMERA_INDEX=0
TOP_RESOLUTION="1280x720"

BOTTOM_CAMERA_INDEX=2
BOTTOM_RESOLUTION="640x480"

# Function to capture video continuously
capture_video() {
  local camera_index=$1
  local resolution=$2
  local output_file=$3

  ffmpeg -f avfoundation -video_size "$resolution" -framerate 30 -i "$camera_index" \
         -pix_fmt yuyv422 -f rawvideo -y "$output_file" &
}

# Capture video continuously for both cameras
# capture_video "$TOP_CAMERA_INDEX" "$TOP_RESOLUTION" "$SHARED_FOLDER/video0.yuv"
capture_video "$BOTTOM_CAMERA_INDEX" "$BOTTOM_RESOLUTION" "$SHARED_FOLDER/video1.yuv"

# Wait for background processes to finish
wait
