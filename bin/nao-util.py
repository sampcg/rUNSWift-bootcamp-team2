#!/usr/bin/env python3

"""
This script allows you to do the following:
- Change wifi ssid robots connect to
- Upload local code and compiled binary to the robot
- Shutdown a robot
See Makefile for usage, or do ./nao-util.py --help
Make sure you have paramiko installed with pip install paramiko
"""

import argparse
import enum
import importlib
import os
import sys
from dataclasses import dataclass
from enum import Enum
from multiprocessing.pool import ThreadPool
import time
from typing import List, Optional, Callable

try:
    importlib.import_module('paramiko')
except ImportError:
    raise ImportError(f"Paramiko not found! Please install it with {sys.executable} -m pip install paramiko")

import paramiko

RED_COLOR_CODE = "\033[91m"
RESET_COLOR_CODE = "\033[0m"
GREEN_COLOR_CODE = "\033[0m"
script_path = os.path.abspath(__file__)

robots_cfg = os.path.join(os.path.dirname(script_path), '..', 'robots', 'robots.cfg')

# for logging into the robot via ssh
NAO_USER = 'nao'
NAO_PASS = 'nao'


@dataclass
class Robot:
    name: str
    head_id: str
    lan: str
    wlan: str


class AcceptAllPolicy(paramiko.MissingHostKeyPolicy):
    def missing_host_key(self, client, hostname, key):
        return


def parse_config_file(file_path: str) -> List[Robot]:
    robots = []
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()
            if line and line[0] not in ['#', ';']:
                parts = line.split(';')
                robot_info = {}
                for part in parts:
                    if part.strip() == '':
                        continue
                    key, value = part.strip().split('=')
                    robot_info[key.strip()] = value.strip()
                robot = Robot(**robot_info)
                robots.append(robot)
    return robots


def try_connect(robot: Robot, ssh_client: paramiko.SSHClient, on_wifi: bool = False, try_again: bool = True) -> bool:
    """
    Try both wifi and lan to connect
    """
    try_ip = robot.wlan if on_wifi else robot.lan
    print(f"Trying to connect to {try_ip} ({robot.name})")

    try:
        ssh_client.connect(try_ip, 22, NAO_USER, NAO_PASS, timeout=2)
        return True
    except Exception as e:
        if try_again:
            return try_connect(robot, ssh_client, not on_wifi, False)

        sys.stderr.write(f"Failed to connect to {robot.wlan} ({robot.name}) with error: {e}\n")
        return False


def log_robot(robot: Robot, message: str, *, error: bool = False, out: bool = False):
    if message.strip() == '':
        return

    print(f'{robot.name}{"$OUT" if out else ""}>{RED_COLOR_CODE if error else ""} {message}{RESET_COLOR_CODE}')


def exec(command: str, robot: Robot, ssh_client: paramiko.SSHClient):
    log_robot(robot, command)
    cin, cout, cerr = ssh_client.exec_command(command)
    log_robot(robot, cout.read().decode(), out=True)
    log_robot(robot, cerr.read().decode(), out=True, error=True)
    exit_status = cout.channel.recv_exit_status()
    if exit_status != 0:
        raise Exception(f'Error running command: {command}')


def with_ssh_client(func: Callable):
    """
    Function wrapper for doing an action on a robot.
    """

    def wrapper(robot: Robot, args: argparse.Namespace) -> Optional[str]:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(AcceptAllPolicy())

        try:
            if not try_connect(robot, ssh_client):
                return

            func(robot, ssh_client, args)
            return robot.name
        except Exception as e:
            print(f"{RED_COLOR_CODE}An error occurred for {robot.name}: {e}{RESET_COLOR_CODE}")
        finally:
            ssh_client.close()

    return wrapper


@with_ssh_client
def change_network_settings(robot: Robot, ssh_client: paramiko.SSHClient, args: argparse.Namespace):
    # jinja is tempting but we need dependencies to stay at a minimum
    # this should match whats in runswift-robotconfig.sh in the image building snippets
    DEFAULT_NETPLAN_TEMPLATE = """
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      optional: true
      addresses:
        - $LAN/16
      dhcp4: false #eth0
      dhcp6: false #eth0
      # gives internet access
      routes:
        - to: 0.0.0.0/0
          via: 10.1.0.1
          metric: 100
      nameservers:
        addresses: [8.8.8.8]
    """

    WIFI_NETPLAN_TEMPLATE = """
network:
  version: 2
  renderer: networkd
  wifis:
    wlan0:
      optional: true
      access-points:
        "$WIFI_SSID":
          auth:
            key-management: "psk"
            password: "Nao!!Nao!!"
      addresses:
        - $WLAN/16
      dhcp4: false
      dhcp6: false
    """
    wifi_ssid: str = args.wifi
    netplan_default = DEFAULT_NETPLAN_TEMPLATE.replace('$LAN', robot.lan)
    netplan_wifi = WIFI_NETPLAN_TEMPLATE.replace('$WLAN', robot.wlan).replace('$WIFI_SSID', wifi_ssid)

    exec('sudo rm -r /etc/netplan/* || true', robot, ssh_client)
    exec(f'sudo sh -c \'echo "{netplan_default}" > /etc/netplan/default.yaml\'', robot, ssh_client)
    exec(f'sudo sh -c \'echo "{netplan_wifi}" > /etc/netplan/wifi.yaml\'', robot, ssh_client)
    exec('sudo chmod 600 /etc/netplan/default.yaml', robot, ssh_client)
    exec('sudo chmod 600 /etc/netplan/wifi.yaml', robot, ssh_client)
    exec('sudo netplan apply', robot, ssh_client)


@with_ssh_client
def shutdown_robot(robot: Robot, ssh_client: paramiko.SSHClient, _):
    # for shutdown we expect it to fail. If a connection was made, means this will work
    try:
        exec('sudo shutdown now', robot, ssh_client)
    except:
        pass

@with_ssh_client
def reboot_robot(robot: Robot, ssh_client: paramiko.SSHClient, _):
    # for shutdown we expect it to fail. If a connection was made, means this will work
    try:
        exec('sudo reboot now', robot, ssh_client)
    except:
        pass

@with_ssh_client
def check_robot(robot: Robot, ssh_client: paramiko.SSHClient, _):
    exec('echo "image build time: $(cat image.build.time)"', robot, ssh_client)
    exec('echo "runswift build time: $(cat runswift.build.time)"', robot, ssh_client)
    exec('echo "image commit sha: $(cat image.commit.sha)"', robot, ssh_client)
    exec('echo "runswift commit sha: $(cat runswift.commit.sha)"', robot, ssh_client)
    exec('cat image.commit.sha', robot, ssh_client)
    exec("cat data/configs/$(hostname).cfg | grep -E 'number|team'", robot, ssh_client)


@with_ssh_client
def sync_robot(robot: Robot, ssh_client: paramiko.SSHClient, _):
    runswift_home = os.path.join(os.path.dirname(script_path), '..')
    image_home = os.path.join(runswift_home, 'image', 'home', 'nao')
    sftp = ssh_client.open_sftp()

    def upload_directory(local_directory: str, remote_directory: str):
        """
        Recursively upload a local directory to a remote directory via SFTP.
        """
        log_robot(robot, f'uploading {local_directory} to {remote_directory}')
        for root, dirs, files in os.walk(local_directory):
            # Create directories on the remote server if they don't exist
            for dir_name in dirs:
                local_path = os.path.join(root, dir_name)
                relative_path = os.path.relpath(local_path, local_directory)
                remote_path = os.path.join(remote_directory, relative_path).replace('\\', '/')
                exec(f"mkdir -p {remote_path}", robot, ssh_client)

            # Upload files
            for file_name in files:
                local_path = os.path.join(root, file_name)
                relative_path = os.path.relpath(local_path, local_directory)
                remote_path = os.path.join(remote_directory, relative_path).replace('\\', '/')
                try:
                    sftp.put(local_path, remote_path)
                except IOError as e:
                    log_robot(robot, f'Error uploading {local_path} to {remote_path}: {e}', error=True)
                    raise e

    exec("systemctl --user stop runswift ; pkill runswift ; true", robot, ssh_client)
    exec("rm -rf /home/nao/data && rm -rf /home/nao/bin && mkdir -p /home/nao/bin", robot, ssh_client)

    upload_directory(os.path.join(image_home, 'bin'), '/home/nao/bin')
    log_robot(robot, 'uploading runswift binary')
    sftp.put(os.path.join(runswift_home, 'build-relwithdebinfo-native', 'robot', 'runswift'), '/home/nao/bin/runswift')
    exec("chmod +x /home/nao/bin/runswift", robot, ssh_client)

    upload_directory(os.path.join(image_home, 'data'), '/home/nao/data')
    upload_directory(os.path.join(image_home, 'whistle'), '/home/nao/whistle')

    log_robot(robot, 'uploading bashrc')
    sftp.put(os.path.join(image_home, '.bashrc_ubuntu'), '/home/nao/.bashrc')

    log_robot(robot, 'uploading tags')
    sftp.put(os.path.join(image_home, 'runswift.commit.sha'), '/home/nao/runswift.commit.sha')
    sftp.put(os.path.join(image_home, 'runswift.build.time'), '/home/nao/runswift.build.time')

    exec(f'sudo date -s @{int(time.time())}', robot, ssh_client)
    exec("systemctl --user start runswift", robot, ssh_client)


class Mode(Enum):
    SHUTDOWN = enum.auto()
    CHANGE_WIFI = enum.auto()
    SYNC = enum.auto()
    CHECK = enum.auto()
    REBOOT = enum.auto()


MODE_TO_FUNCTION = {Mode.SHUTDOWN: shutdown_robot, Mode.CHANGE_WIFI: change_network_settings, Mode.SYNC: sync_robot, Mode.CHECK: check_robot, Mode.REBOOT: reboot_robot}

if __name__ == '__main__':
    print("Using robot config path: ", robots_cfg)

    parser = argparse.ArgumentParser(description='Set the network settings for a robot, primarily for changing fields')
    parser.add_argument('robot', type=str, help='Robot to change (hostname or IP).'
                                                'Can be "all" to change all robots on the current network')
    parser.add_argument('--wifi', type=str, required=False,
                        help="WiFi SSID to set. Set NONE to disconnect from WiFi. Syncing won't be performed with this set")
    parser.add_argument('--shutdown', action='store_true',
                        help="Shut down the robot. No other step will be performed.")
    parser.add_argument('--sync', action='store_true',
                        help="Sync the code and runswift binary on your PC to the robot. Make sure to build beforehand.")
    parser.add_argument('--check', action='store_true',
                        help="Check commit hash and build time for all robots")
    parser.add_argument('--reboot', action='store_true',
                        help="Reboot robot")

    args = parser.parse_args()
    robots = parse_config_file(robots_cfg)
    robots_to_change: List[Robot] = []
    mode: Optional[Mode] = None


    def set_mode(decided_mode: Mode):
        global mode
        if mode:
            raise ValueError(f"You cannot do two actions at once: {mode}, {decided_mode}")
        mode = decided_mode


    # decide the mode
    if args.shutdown:
        set_mode(Mode.SHUTDOWN)
    if args.wifi:
        set_mode(Mode.CHANGE_WIFI)
    if args.sync:
        set_mode(Mode.SYNC)
    if args.check:
        set_mode(Mode.CHECK)
    if args.reboot:
        set_mode(Mode.REBOOT)

    if mode is None:
        raise ValueError("No mode was given")

    # decide robots being worked on
    if args.robot.lower() == 'all':
        robots_to_change = robots
    else:
        args_robots = args.robot.split(',')
        # lock into the robots we know for safety/simplicity sake
        robots_to_change = [robot for robot in robots if
                            robot.name in args_robots or robot.lan in args_robots or robot.wlan in args_robots]

    if not robots_to_change:
        raise ValueError("No robots found with the name or ip: ", args.robot)
    print("Changing the following robots: ", [robot.name for robot in robots_to_change])

    pool = ThreadPool(processes=len(robots))
    threads = []

    for robot in robots_to_change:
        thread = pool.apply_async(MODE_TO_FUNCTION[mode], (robot, args))
        threads.append(thread)

    succeeded = set()
    changed_robot_names = {robot.name for robot in robots_to_change}
    # Wait for all threads to finish
    pool.close()
    pool.join()
    for thread in threads:
        if thread.get():
            succeeded.add(thread.get())
    if succeeded:
        print(f"{GREEN_COLOR_CODE}Succeeded {mode} on {succeeded}{RESET_COLOR_CODE}")
    if len(succeeded) != len(robots_to_change):
        print(f"{RED_COLOR_CODE}Failed {mode} on {changed_robot_names - succeeded}{RESET_COLOR_CODE}")
