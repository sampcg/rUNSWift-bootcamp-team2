import fs from 'fs';
import { dirname, join } from 'path';

export interface iRobotInfo {
  name: string;
  IPLastSegment: number;
}

export const robotList = new Map<string, iRobotInfo>();

const packageJson = process.env.npm_package_json;
if (!packageJson) {
  throw new Error('Error: process.env.npm_package_json must be defined');
}

const robotsCfg = join(dirname(packageJson), '..', '..', '..', 'robots', 'robots.cfg');
const robotsData = fs.readFileSync(robotsCfg, 'utf-8');

robotsData
  .replace(/\w+/, '')
  .split('\n')
  .forEach((line) => {
    const [name, , lan] = line.split(';').map((part) => part.split('=')[1]);
    robotList.set(name, { name, IPLastSegment: Number(lan.split('.').reverse()[0]) });
  });

function formatIp(baseIp: string, ipLastSegment: number): string {
  return `${baseIp}.${ipLastSegment < 10 ? '0' : ''}${ipLastSegment}`;
}

export function getRobotWifiIp(name: string): string {
  const robot = robotList.get(name);
  if (!robot) {
    throw new Error(`Unknown robot [${name}]`);
  }
  return formatIp('10.0.18', robot.IPLastSegment);
}

export function getRobotHostnameSoftbank(name: string): string {
  return `${name}.local`;
}

export function getRobotHostnameUbuntu(name: string): string {
  const robot = robotList.get(name);
  if (!robot) {
    throw new Error(`Unknown robot [${name}]`);
  }
  return formatIp('10.1.18', robot.IPLastSegment);
}
