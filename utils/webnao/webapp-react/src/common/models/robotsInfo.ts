import { Blackboard } from '../blackboard';

interface RobotConnectionDetails {
  reachable: boolean;
  streamingEndpoint?: string;
  networkID?: string;
  host: string;
}
export enum RobotEndpointType {
  wifi = 'wifi',
  ethernet = 'ethernet',
}
export interface RobotTeamInfo {
  teamNumber?: number;
  playerNumber?: number;
}
export interface RobotInfo {
  name?: string;
  WSEndpoint?: string;
  teamInfo?: RobotTeamInfo;
}
export interface StreamingRobotInfo extends RobotInfo {
  connection: {
    ethernet: RobotConnectionDetails;
    wifi: RobotConnectionDetails;
  };
  batteryPercentage?: number;
  isTestRobot?: boolean;
  updatedAt?: number;
}
export interface GamePartInfo {
  teamA: string;
  teamB: string;
  part: number;
  startedAt: number;
}
export interface DumpRobotInfo extends RobotInfo {
  gamePart?: GamePartInfo;
  path: string;
  mask?: number;
  lengthSeconds?: number;
  sizeGbs: number;
  timestamps?: number[];
}
