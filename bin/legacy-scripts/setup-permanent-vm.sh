#!/bin/bash

green=`tput setaf 2`
reset=`tput sgr0`

# creates a public key if it doesn't already exist
if ! ssh-keygen -l -f ~/.ssh/id_ed25519.pub &> /dev/null; then
  if ssh-keygen -l -f ~/.ssh/id_ed25519 &> /dev/null; then
    echo "Recovering public key from existing private key"
    ssh-keygen -y -f ~/.ssh/id_ed25519 > ~/.ssh/id_ed25519.pub
  else
    ssh-keygen -f ~/.ssh/id_ed25519 -N '' -t Ed25519 -q
  fi
  if ! grep -qf ~/.ssh/id_ed25519.pub "$RUNSWIFT_CHECKOUT_DIR"/image/home/nao/.ssh/authorized_keys; then
    echo "${green}Enter your full name:${reset}"
    read name
    echo >> "$RUNSWIFT_CHECKOUT_DIR"/image/home/nao/.ssh/authorized_keys
    echo "# $name's key" >> "$RUNSWIFT_CHECKOUT_DIR"/image/home/nao/.ssh/authorized_keys
    cat ~/.ssh/id_ed25519.pub >> "$RUNSWIFT_CHECKOUT_DIR"/image/home/nao/.ssh/authorized_keys
  fi
fi

echo "Copy and paste the text below in the 'key' section in https://github.com/settings/ssh/new"
echo "${green}#########################################################################################"
cat ~/.ssh/id_ed25519.pub
echo "#########################################################################################${reset}"

# sleep so people have time to notice above message before the page opens
sleep 1
xdg-open "https://github.com/settings/ssh/new"

echo "All done! Please create a pull request with your public key in /image/home/nao/.ssh/authorized_keys"
