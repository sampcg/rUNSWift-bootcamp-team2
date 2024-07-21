import React, { ReactNode, createContext, useEffect, useRef, useState } from 'react';
import { DumpRobotInfo, StreamingRobotInfo } from '../common/models/robotsInfo';
import {
  DumpStreamingRequestParams,
  RobotStreamingRequestParams,
  StreamingRequestResponse,
  TeamDataRequest,
  TeamDataResponse,
} from '../common/models/teamAPI';

interface TeamServerResponse<T = object> {
  robotState: StreamingRobotInfo[];
  dumpState: DumpRobotInfo[];
  response: TeamDataResponse<T> | null;
}

interface TeamData extends TeamServerResponse {
  sendRequest: (request: TeamDataRequest) => Promise<TeamDataResponse | undefined>;
  getRobotConnectionEndpoint: (robotName: string, type: string, mask?: number) => Promise<string>;
  getDumpConnectionEndpoint: (dumpPath: string) => Promise<string>;
}

export const TeamContext = createContext<TeamData | null>(null);

interface TeamContextProviderProps {
  serverHostname: string;
  serverPort: number;
  children: ReactNode;
}
interface ExchangeItem {
  req: TeamDataRequest;
  res?: TeamDataResponse;
}

export const TeamContextProvider: React.FC<TeamContextProviderProps> = ({ serverHostname, serverPort, children }) => {
  const [robotState, setRobotState] = useState<StreamingRobotInfo[]>([]);
  const [dumpState, setDumpState] = useState<DumpRobotInfo[]>([]);
  const [response, setResponse] = useState<TeamDataResponse | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const exchange = useRef(new Map<number, ExchangeItem>());
  useEffect(() => {
    const endpoint = `ws://${serverHostname}:${serverPort}`;
    ws.current = new WebSocket(endpoint);

    ws.current.onmessage = async (ev: MessageEvent<string>) => {
      const payload: TeamServerResponse = JSON.parse(ev.data);
      if (payload.robotState) {
        setRobotState(payload.robotState);
      }
      if (payload.dumpState) {
        setDumpState(payload.dumpState);
      }
      if (payload.response) {
        setResponse(payload.response);
        const pendingRequest = exchange.current.get(payload.response.nonce);
        if (pendingRequest) {
          pendingRequest.res = payload.response;
        }
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [serverHostname, serverPort]);
  const getRobotConnectionEndpoint = async (robotName: string, type: string, mask: number = 3) => {
    const request: TeamDataRequest<RobotStreamingRequestParams> = {
      requestPath: '/stream',
      nonce: new Date().getTime(),
      requestParams: {
        robotName: robotName,
        type,
        mask,
      },
    };
    const response: TeamDataResponse<StreamingRequestResponse> | undefined = await sendRequest(request);
    if (!response?.response.endpoint) {
      throw new Error(`Couldn't get connection endpoint for [${robotName}] via [${type}]`);
    }
    return response?.response.endpoint.replace('$serverHostname', serverHostname);
  };
  const getDumpConnectionEndpoint = async (dumpPath: string) => {
    const request: TeamDataRequest<DumpStreamingRequestParams> = {
      requestPath: '/play',
      nonce: new Date().getTime(),
      requestParams: {
        dumpPath,
      },
    };
    const response: TeamDataResponse<StreamingRequestResponse> | undefined = await sendRequest(request);
    if (!response?.response.endpoint) {
      throw new Error(`Couldn't get connection endpoint for [${dumpPath}]`);
    }
    return response?.response.endpoint.replace('$serverHostname', serverHostname);
  };
  const sendRequest = async (request: TeamDataRequest) => {
    if (ws.current) {
      exchange.current.set(request.nonce, { req: request });
      ws.current.send(JSON.stringify(request, null, 2));
      return new Promise<TeamDataResponse>((resolve, reject) => {
        const intervalRef = setInterval(() => {
          try {
            const pendingRequest = exchange.current.get(request.nonce);
            if (pendingRequest?.res) {
              exchange.current.delete(request.nonce);
              clearInterval(intervalRef);
              resolve(pendingRequest.res);
            }
          } catch (error) {
            reject(error);
          }
        }, 100);
      });
    }
  };

  return (
    <TeamContext.Provider
      value={{ robotState, response, sendRequest, getRobotConnectionEndpoint, getDumpConnectionEndpoint, dumpState }}
    >
      {children}
    </TeamContext.Provider>
  );
};
