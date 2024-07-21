export interface TeamDataRequest<T = any> {
  requestPath: string;
  nonce: number;
  requestParams: T;
}

export interface TeamDataResponse<T = any> {
  requestPath: string;
  nonce: number;
  response: T;
  error?: string;
}

export interface StreamingRequestResponse {
  endpoint: string;
}
export interface RobotStreamingRequestParams {
  robotName: string;
  type: string;
  mask?: number;
}
export interface DumpStreamingRequestParams {
  dumpPath: string;
}

export interface DumpControlCommand {
  action: 'pause' | 'next' | 'play' | 'previous';
  from?: number;
}
