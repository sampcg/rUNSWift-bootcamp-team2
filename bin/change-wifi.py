#!/usr/bin/env python3

import argparse
import os
import sys
from dataclasses import dataclass
from multiprocessing.pool import ThreadPool
from typing import List, Optional

import paramiko

script_path = os.path.abspath(__file__)

robots_cfg = os.path.join(os.path.dirname(script_path), '..', 'robots', 'robots.cfg')

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
            if line:
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
    Try both wifi and lan to connect. Remember what worked to make things faster
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


def change_network_settings(robot: Robot, wifi_ssid: str) -> Optional[str]:
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(AcceptAllPolicy())

    def exec(command: str):
        print(robot.name + '>', command)
        cin, cout, cerr = ssh_client.exec_command(command)
        print(robot.name + '>', cout.read().decode())
        print(robot.name + '>', cerr.read().decode())
        exit_status = cout.channel.recv_exit_status()
        if exit_status != 0:
            raise Exception(f'Error running command: {command}')

    try:
        if not try_connect(robot, ssh_client):
            return

        netplan_default = DEFAULT_NETPLAN_TEMPLATE.replace('$LAN', robot.lan)
        netplan_wifi = WIFI_NETPLAN_TEMPLATE.replace('$WLAN', robot.wlan).replace('$WIFI_SSID', wifi_ssid)

        exec('sudo rm -r /etc/netplan/* || true')
        exec(f'sudo sh -c \'echo "{netplan_default}" > /etc/netplan/default.yaml\'')
        exec(f'sudo sh -c \'echo "{netplan_wifi}" > /etc/netplan/wifi.yaml\'')
        exec('sudo chmod 600 /etc/netplan/default.yaml')
        exec('sudo chmod 600 /etc/netplan/wifi.yaml')
        exec('sudo netplan apply')
        return robot.name
    except Exception as e:
        print(f"Failed to change network settings for {robot.name} with error: {e}")
    finally:
        ssh_client.close()


if __name__ == '__main__':
    print("Using robot config path: ", robots_cfg)

    parser = argparse.ArgumentParser(description='Set the network settings for a robot, primarily for changing fields')
    parser.add_argument('robot', type=str, help='Robot to change (hostname or IP).'
                                                'Can be "all" to change all robots on the current network')
    parser.add_argument('wifi', type=str, help='WiFi SSID to set. Set NONE to disconnect from WiFi')

    args = parser.parse_args()
    robots = parse_config_file(robots_cfg)
    robots_to_change = []

    if args.robot.lower() == 'all':
        robots_to_change = robots
    else:
        # lock into the robots we know for safety/simplicity sake
        robots_to_change = [robot for robot in robots if
                            robot.name in args.robot or robot.lan == args.robot or robot.wlan == args.robot]

    if not robots_to_change:
        raise ValueError("No robots found with the name or ip: ", args.robot)
    print("Changing the following robots: ", [robot.name for robot in robots_to_change])

    pool = ThreadPool(processes=len(robots))
    threads = []

    for robot in robots_to_change:
        thread = pool.apply_async(change_network_settings, (robot, args.wifi))
        threads.append(thread)

    succeeded = []
    # Wait for all threads to finish
    pool.close()
    pool.join()
    for thread in threads:
        if thread.get():
            succeeded.append(thread.get())

    print(f"\033[92mChanged network settings for {succeeded}")
