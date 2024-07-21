# We use this script to run commands inside the docker container
# For example, we can use it to run the build like this
# bin\docker.ps1 bin/build.sh
# It is highly recommended you instead use WSL and run docker.sh while having Docker Desktop active (enabling WSL support in Docker Desktop)
$REALPATH = (Resolve-Path $MyInvocation.MyCommand.Definition).Path
$BIN_DIR = Split-Path -Parent $REALPATH
$PROJECT_ROOT_DIR = Split-Path -Parent $BIN_DIR
$flavour = "v6"
docker run --rm --platform linux/amd64 -it --privileged -v "${PWD}:/root/dev/rUNSWift" runswift/$flavour:latest $args
