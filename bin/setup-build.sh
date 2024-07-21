#!/bin/bash

# jayen isn't a fan of `sudo pip install`, so please use `aptinstall` where
# possible.  see flake8 below for an example.  if you absolutely must use `sudo
# pip install`, make a function like `aptinstall`

# TODO: move non-build stuff out of here (e.g., ssh, game controller, pip for nao_sync -s)

# Check the system architecture is compatible
arch=$(uname -m)
if [ "$arch" != "x86_64" ] && [ "$arch" != "amd64" ]; then
    read -p "Unsupported architecture: $arch. Do you want to continue? (y/n): " choice
    case "$choice" in
        y|Y ) echo "Continuing execution...";;
        * ) echo "Exiting script."; exit 1;;
    esac
fi
echo "System architecture is supported: $arch"

# Set up path
REALPATH=$(realpath "$0")
BIN_DIR=$(dirname "$REALPATH")
source "$BIN_DIR/source.sh"

in_docker=${RUNSWIFT_DOCKER:-0}

echo RUNSWIFT_CHECKOUT_DIR is $RUNSWIFT_CHECKOUT_DIR

setupdocker
aptinstall git

# Set up git
cat << USER_CONFIG
If the user info is incorrect, please configure it like:
  git config user.name Jayen
  git config user.email jayen@cse.unsw.edu.au
USER_CONFIG
cd "$RUNSWIFT_CHECKOUT_DIR"
echo -e 'Your user name: \033[33;1m' $(git config user.name) '\033[0m'
echo -e 'Your email:     \033[33;1m' $(git config user.email) '\033[0m'

setupbash

aptinstall wget unzip
cd "$RUNSWIFT_CHECKOUT_DIR"

# Set up Python code autoformatter
aptinstall python3-pip
if [ "$in_docker" -ne "1" ]; then
  tempvirtualenvinstallblack
fi

# Set up Python flake8 linter
if (( $UBUNTU_VER >= 20 )); then
  aptinstall python3-flake8
else
  aptinstall python-flake8
fi

# Set up git pre-commit hook
if [ "$in_docker" -ne "1" ] && [[ ! -L .git/hooks/pre-commit ]]; then
  myecho "Creating .git/hooks/pre-commit symlink..."
  ln -sf "$RUNSWIFT_CHECKOUT_DIR/.githooks/pre-commit" .git/hooks/pre-commit
fi

########### Toolchain ##########
setupnative

############ Building ###########
aptinstall cmake

echo
echo All done! To build, type bin/build-runswift.sh to compile
echo

# Finish
myecho Please close all shells.  Only new shells will have RUNSWIFT_CHECKOUT_DIR set to $RUNSWIFT_CHECKOUT_DIR
myecho 'Alternatively, type `source ~/.runswift.bash` in existing shells.'
echo
