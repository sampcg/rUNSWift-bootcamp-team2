# We use this script to make the docker container that we use for building code and image
# Just run it every time you changed something in the Dockerfile
$REALPATH = (Resolve-Path $MyInvocation.MyCommand.Definition).Path
$BIN_DIR = Split-Path -Parent $REALPATH
$PROJECT_ROOT_DIR = Split-Path -Parent $BIN_DIR
$flavour = "v6"
# Build the Docker image and run the container
docker build --platform linux/amd64 -t runswift/$flavour:latest $PROJECT_ROOT_DIR
