#!/bin/bash

REALPATH=$(realpath "$0")
BIN_DIR=$(dirname "$REALPATH/../")
source "$BIN_DIR/source.sh"

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
tempvirtualenvinstallblack

# Set up Python flake8 linter
if (( $UBUNTU_VER >= 20 )); then
  aptinstall python3-flake8
else
  aptinstall python-flake8
fi

# Set up git pre-commit hook
if [[ ! -L .git/hooks/pre-commit ]]; then
  myecho "Creating .git/hooks/pre-commit symlink..."
  ln -sf "$RUNSWIFT_CHECKOUT_DIR/.githooks/pre-commit" .git/hooks/pre-commit
fi

########### Toolchain ##########
setupnative



############ Building ###########
aptinstall cmake

echo
echo All done! To build, type build-relwithdebinfo-native.sh to compile
echo

# Finish
myecho Please close all shells.  Only new shells will have RUNSWIFT_CHECKOUT_DIR set to $RUNSWIFT_CHECKOUT_DIR
myecho 'Alternatively, type `source ~/.runswift.bash` in existing shells.'
echo
