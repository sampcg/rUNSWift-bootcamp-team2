import { WebSocketServer, WebSocket, RawData } from 'ws';
import {
  DumpStreamingRequestParams,
  RobotStreamingRequestParams,
  StreamingRequestResponse,
  TeamDataRequest,
  TeamDataResponse,
} from '@common/models/teamAPI';
import { DumpRobotInfo, RobotEndpointType, StreamingRobotInfo } from '@common/models/robotsInfo';
import { RobotMonitor, RobotMonitorOnChangeCallback } from '../workers/robotMonitor';
import { StreamServer } from './streamServer';
import { DumpMonitor, DumpMonitorOnChangeCallback } from '../workers/dumpMonitor';
import { Socket } from 'net';

type WebSocketInternal = WebSocket & { _socket?: Socket };
export class TeamServer {
  protected wss?: WebSocketServer;
  protected dumpState: DumpRobotInfo[];
  protected robotState: StreamingRobotInfo[];
  protected WSClients: WebSocket[];
  constructor(
    protected streamServer: StreamServer,
    protected robotMonitor: RobotMonitor,
    protected dumpMonitor: DumpMonitor,
  ) {
    this.dumpState = [];
    this.robotState = [];
    this.WSClients = [];
  }
  public async start() {
    const [robotState, dumpState] = await Promise.all([this.getRobotsInfo(), this.getDumpInfo()]);
    this.dumpState = dumpState;
    this.robotState = robotState;
    this.wss = new WebSocketServer({ port: 8081 });
    const robotsSubscription: RobotMonitorOnChangeCallback = async (robots) => {
      this.robotState = robots;
      for (const client of this.WSClients) {
        this.updateClient(client);
      }
    };
    this.robotMonitor.subscribe(robotsSubscription);
    const dumpsSubscription: DumpMonitorOnChangeCallback = async (dumpState) => {
      this.dumpState = dumpState;
      for (const client of this.WSClients) {
        this.updateClient(client);
      }
    };
    this.dumpMonitor.subscribe(dumpsSubscription);
    this.wss.on('connection', async (ws) => {
      console.log(`Client [${(ws as WebSocketInternal)._socket?.remoteAddress}] connected to Team server`);
      const handler = this.getCommandHandler(ws);
      this.updateClient(ws);
      this.WSClients.push(ws);
      ws.on('message', handler);
      ws.on('close', () => {
        const clientIndex = this.WSClients.indexOf(ws);
        if (clientIndex > -1) {
          this.WSClients.splice(clientIndex, 1);
        }
        console.log(`Client [${(ws as WebSocketInternal)._socket?.remoteAddress}] disconnected from Team server`);
        ws.removeListener('data', handler);
      });
    });
  }
  protected updateClient(ws: WebSocket) {
    ws.send(
      JSON.stringify(
        {
          robotState: this.robotState,
          dumpState: this.dumpState,
        },
        null,
        2,
      ),
    );
  }
  protected async getRobotsInfo(): Promise<StreamingRobotInfo[]> {
    return Array.from(this.robotMonitor.robotMap.values());
  }
  protected async getDumpInfo(): Promise<DumpRobotInfo[]> {
    return this.dumpMonitor.dumpState;
  }
  protected getCommandHandler(connection: WebSocket) {
    return async (data: RawData, isBinary: boolean) => {
      const robotState = await this.getRobotsInfo();
      const { requestPath, requestParams, nonce }: TeamDataRequest = JSON.parse(data.toString());

      // I'm not sure if this console.log is needed, but if it is intended, perhaps it needs something like
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
      // This version at least prints something more useful than '...[object Object]' e.g.
      // /dumps? TODO: {}
      // /stream? TODO: {"robotName":"shelly","type":"ethernet","mask":7}
      console.log(`${requestPath}? TODO: ${JSON.stringify(requestParams)}`);

      try {
        switch (requestPath) {
          case '/robots': {
            const response: TeamDataResponse<StreamingRobotInfo[]> = {
              nonce,
              requestPath,
              response: robotState,
            };
            connection.send(
              JSON.stringify(
                {
                  robotState,
                  response,
                },
                null,
                2,
              ),
            );
            break;
          }
          case '/stream': {
            const streamRequestParams = requestParams as RobotStreamingRequestParams;
            const robotName = streamRequestParams.robotName;
            const typeString = streamRequestParams.type;
            let type = RobotEndpointType.ethernet;
            if (typeString === RobotEndpointType.wifi) {
              type = RobotEndpointType.wifi;
            }
            const mask = streamRequestParams.mask || 5;
            const wsEndpoint = await this.streamServer.robotStreamEndpoint(robotName, type, mask);
            this.robotMonitor.setRobotWSEndpoint(robotName, wsEndpoint);
            const response: TeamDataResponse<StreamingRequestResponse> = {
              nonce,
              requestPath,
              response: { endpoint: wsEndpoint },
            };
            connection.send(
              JSON.stringify(
                {
                  robotState,
                  response,
                },
                null,
                2,
              ),
            );
            break;
          }
          case '/play': {
            const streamRequestParams = requestParams as DumpStreamingRequestParams;
            const dumpPath = streamRequestParams.dumpPath;
            const wsEndpoint = await this.streamServer.dumpStreamEndpoint(dumpPath);
            this.dumpMonitor.setDumpWSEndpoint(dumpPath, wsEndpoint);
            const response: TeamDataResponse<StreamingRequestResponse> = {
              nonce,
              requestPath,
              response: { endpoint: wsEndpoint },
            };
            connection.send(
              JSON.stringify(
                {
                  robotState,
                  response,
                },
                null,
                2,
              ),
            );
            break;
          }
          default:
            break;
        }
      } catch (error) {
        const response: TeamDataResponse = {
          nonce,
          requestPath,
          response: robotState,
          error: (error as Error).message,
        };
        connection.send(
          JSON.stringify(
            {
              robotState,
              response,
            },
            null,
            2,
          ),
        );
      }
    };
  }
  public async stop() {
    await new Promise<void>((resolve, reject) => {
      if (!this.wss) {
        resolve();
        return;
      }
      this.wss.close((err) => (err ? reject(err) : resolve()));
    });
  }
}
