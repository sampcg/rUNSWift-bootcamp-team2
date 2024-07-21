#!/bin/bash
set -e
# used by docker to match host user before executing anything
# ensures no perm messups happen once outside docker, and gives docker the ability to use sensitive files (such as .ssh) internally
# We don't run this on Mac as Mac perms don't play nicely with linux perms when using docker mounts

err_handler() {
  echo "Failed to match host permissions. Are you on a Mac?"
  echo "Continuing without matching host permissions."
  exec "$@"
}

trap 'err_handler $@' ERR

# Create a group with the same GID
groupadd -g $LOCAL_GROUP_ID hostgroup

# Create a user with the same UID and add to the group
useradd -u $LOCAL_USER_ID -g hostgroup -M -d /root hostuser

# Grant the new user sudo privileges without password requirement
echo "hostuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Set the user to match the host user for the current process
export HOME=/root/
chown -R hostuser:hostgroup /root/
exec sudo -E -u hostuser "$@"