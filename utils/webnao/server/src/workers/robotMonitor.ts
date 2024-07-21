import { Blackboard } from '@common/blackboard';
import { getRobotHostnameSoftbank, getRobotHostnameUbuntu, getRobotWifiIp, robotList } from '@common/dicts/robots';
import { RobotEndpointType, StreamingRobotInfo } from '@common/models/robotsInfo';
import ping from 'ping';
import { getSomeBlackboardsFromHost } from '../utils/blackboardStreaming';
import { batteryChargeFromEarLEDS } from '@common/blackboard/utils';
import md5 from 'md5';

const testRobotWalle: StreamingRobotInfo = {
  name: 'walle',
  batteryPercentage: 70,
  connection: {
    ethernet: {
      reachable: true,
      host: 'walle.local',
    },
    wifi: {
      reachable: false,
      host: '',
    },
  },
  // updatedAt: new Date().getTime(),
  teamInfo: {
    teamNumber: 18,
    playerNumber: 5,
  },
  isTestRobot: true,
};
const testRobotC3PO: StreamingRobotInfo = {
  name: 'c3po',
  batteryPercentage: 20,
  connection: {
    ethernet: {
      reachable: false,
      host: 'c3po.local',
    },
    wifi: {
      reachable: true,
      host: '',
    },
  },
  // updatedAt: new Date().getTime(),
  teamInfo: {
    teamNumber: 18,
    playerNumber: 2,
  },
  isTestRobot: true,
};
const testRobotLocal: StreamingRobotInfo = {
  name: 'local',
  batteryPercentage: 20,
  connection: {
    ethernet: {
      reachable: true,
      host: 'localhost',
    },
    wifi: {
      reachable: false,
      host: '',
    },
  },
  // updatedAt: new Date().getTime(),
  teamInfo: {
    teamNumber: 18,
    playerNumber: 2,
  },
};
export const testRobots = [
  testRobotC3PO,
  testRobotWalle,
  //testRobotLocal
];
export const testRobotMap = new Map<string, StreamingRobotInfo>();
// testRobots.forEach((robot) => testRobotMap.set(robot.name!, robot));

export type RobotMonitorOnChangeCallback = (robots: StreamingRobotInfo[]) => Promise<void>;

export class RobotMonitor {
  public get robotMap() {
    return this._robotMap;
  }
  public get robotState() {
    return Array.from(this._robotMap.values());
  }

  protected _robotMap: Map<string, StreamingRobotInfo>;
  protected robotWSEndpoints: Map<string, string>;
  private interval?: NodeJS.Timer;
  protected onChangeCallbacks: RobotMonitorOnChangeCallback[];
  protected lastUpdateMD5: string;
  constructor(
    protected pingSeconds: number = 3,
    protected allowlistedRobots: string[] = [],
  ) {
    this._robotMap = new Map<string, StreamingRobotInfo>();
    this.robotWSEndpoints = new Map<string, string>();
    this.onChangeCallbacks = [];
    this.lastUpdateMD5 = '';
  }

  public async start() {
    this.interval = setInterval(async () => {
      await this.pingRobots();
    }, this.pingSeconds * 1000);
  }
  public async stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  public subscribe(callback: RobotMonitorOnChangeCallback) {
    if (!this.onChangeCallbacks.includes(callback)) {
      this.onChangeCallbacks.push(callback);
    }
  }
  public unsubscribe(callback: RobotMonitorOnChangeCallback) {
    const ind = this.onChangeCallbacks.indexOf(callback);
    if (ind > -1) {
      this.onChangeCallbacks = this.onChangeCallbacks.splice(ind, 1);
    }
  }
  public async setRobotWSEndpoint(robotName: string, endpoint?: string) {
    if (endpoint) {
      this.robotWSEndpoints.set(robotName, endpoint);
    } else {
      this.robotWSEndpoints.delete(robotName);
    }
    await this.updateRobot(robotName);
  }
  public async refreshRobot(robotName: string) {
    await this.updateRobot(robotName);
    await this.notifyIfChanged();
  }
  public streamingEndpoint(robotName: string, type: RobotEndpointType) {
    const robotInfo = this.robotMap.get(robotName);
    if (!robotInfo) {
      throw new Error(`Unknown robot [${robotName}]`);
    }
    switch (type) {
      case RobotEndpointType.wifi: {
        if (robotInfo.connection.wifi.reachable) {
          return robotInfo.connection.wifi.host;
        }
        break;
      }
      case RobotEndpointType.ethernet: {
        if (robotInfo.connection.ethernet.reachable) {
          return robotInfo.connection.ethernet.host;
        }
        break;
      }
    }
    throw new Error(`Unable to reach robot [${robotName}] via [${type}]`);
  }
  protected async notifyIfChanged() {
    const currentMD5 = md5(JSON.stringify(this.robotState));
    if (currentMD5 != this.lastUpdateMD5) {
      this.lastUpdateMD5 = currentMD5;
      await this.notifySubscribers();
    }
  }
  protected async notifySubscribers() {
    await Promise.all(this.onChangeCallbacks.map((callback) => callback(this.robotState)));
  }
  protected async updateRobot(robotName: string): Promise<StreamingRobotInfo> {
    const updatedInfo = await this.getRobotInfo(robotName);
    this.robotMap.set(robotName, updatedInfo);
    return updatedInfo;
  }
  protected async pingRobots() {
    const robotsToPing = this.allowlistedRobots.length
      ? this.allowlistedRobots
      : [...Array.from(robotList.keys()), ...Array.from(testRobotMap.keys())];
    await Promise.all(
      robotsToPing.map(async (robotName) => {
        await this.updateRobot(robotName);
        await this.notifyIfChanged();
      }),
    );
  }
  protected async getRobotInfo(robotName: string): Promise<StreamingRobotInfo> {
    const robotFromDict = robotList.get(robotName);
    const testRobot = testRobotMap.get(robotName);
    const WSEndpoint = this.robotWSEndpoints.get(robotName);
    switch (robotName) {
      default:
        if (robotFromDict) {
          const wifiHost = getRobotWifiIp(robotName);
          const ethernetHostSoftbank = getRobotHostnameSoftbank(robotName);
          const ethernetHostUbuntu = getRobotHostnameUbuntu(robotName);
          const [wifiPing, ethernetPingSoftbank, ethernetPingUbuntu] = await Promise.all([
            ping.promise.probe(wifiHost),
            ping.promise.probe(ethernetHostSoftbank),
            ping.promise.probe(ethernetHostUbuntu),
          ]);
          // console.log(`robot is ${robotName} ubuntu is %d, softbank is %d`, ethernetPingUbuntu.alive, ethernetPingSoftbank.alive)
          let ethernetHost = ethernetHostUbuntu;
          let ethernetPing = ethernetPingUbuntu;
          if (!ethernetPingUbuntu.alive && ethernetPingSoftbank.alive) {
            ethernetHost = ethernetHostSoftbank;
            ethernetPing = ethernetPingSoftbank;
          }
          const robotInfo: StreamingRobotInfo = {
            name: robotName,
            connection: {
              wifi: {
                reachable: wifiPing.alive,
                host: wifiHost,
              },
              ethernet: {
                reachable: ethernetPing.alive,
                host: ethernetHost,
              },
            },
            WSEndpoint,
            // updatedAt: new Date().getTime(),
          };
          let reachableHost: string | undefined;
          if (robotInfo.connection.ethernet.reachable) {
            reachableHost = robotInfo.connection.ethernet.host;
          }
          if (robotInfo.connection.wifi.reachable) {
            reachableHost = robotInfo.connection.wifi.host;
          }
          if (reachableHost) {
            try {
              const bb = await this.probeRobot(reachableHost);
              if (bb) {
                const charge = batteryChargeFromEarLEDS(bb.motion?.active?.leds?.leftEar);
                if (charge !== undefined) {
                  robotInfo.batteryPercentage = charge * 100;
                }
                robotInfo.teamInfo = {
                  playerNumber: bb.gameController?.playerNumber,
                  teamNumber: bb.gameController?.ourTeam?.teamNumber,
                };
              }
            } catch (error) {
              console.error(
                `Failed to probe robot [${robotName}] via [${reachableHost}]]. Error [${(error as Error).message}]`,
              );
            }
          }
          return robotInfo;
        }
        if (testRobot) {
          if (testRobot.name === 'local') {
            const ethernetHost = testRobot.connection.ethernet.host;
            const ethernetPing = await ping.promise.probe(ethernetHost);
            if (ethernetPing.alive) {
              try {
                const bb = await this.probeRobot(ethernetHost);
                const charge = batteryChargeFromEarLEDS(bb.motion?.active?.leds?.leftEar);
                if (charge !== undefined) {
                  testRobot.batteryPercentage = charge * 100;
                }
              } catch (error) {
                throw new Error(
                  `Failed to probe robot [${robotName}] via [${ethernetHost}]]. Error [${(error as Error).message}]`,
                );
              }
            }
          }
          return testRobot;
        }
        throw new Error(`Unknown robot [${robotName}]`);
        break;
    }
  }
  protected async probeRobot(hostName: string): Promise<Blackboard> {
    const blackBoards = await getSomeBlackboardsFromHost({ count: 1, host: hostName, mask: 1 });
    return blackBoards[0];
  }
}
