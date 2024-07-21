import { WebSocketServer } from 'ws';
import {
  connectToHost,
  setMask,
  streamBlackboardBytesFromBBD2File,
  streamBlackboardBytesFromSocket,
} from '../utils/blackboardStreaming';
import { Stream } from 'stream';
import { robotList } from '@common/dicts/robots';
import { RobotMonitor, testRobotMap } from '../workers/robotMonitor';
import { RobotEndpointType } from '@common/models/robotsInfo';
import { Socket } from 'net';
import { ReadStream } from 'fs';
import snappy from 'snappy';
import { DumpMonitor } from '../workers/dumpMonitor';
import { BB_NUM_HEADER_BYTES } from '../utils/blackboardTransforms';
import { DumpControlCommand } from '@common/models/teamAPI';
import { open, FileHandle, stat } from 'node:fs/promises';

interface IStreamInfo {
  server: WebSocketServer;
  port: number;
  clients: number;
}
interface RobotStreamInfo extends IStreamInfo {
  socket?: Socket;
  host: string;
  type: RobotEndpointType;
  currentMask: number;
  requiedMask: number;
}
interface DumpStreamInfo extends IStreamInfo {
  fileStream?: ReadStream;
  fileHandle?: FileHandle;
  filePath: string;
  clients: number;
}

export class StreamServer {
  protected activeRobotStreams: Map<string, RobotStreamInfo>;
  protected activeDumpStreams: Map<string, DumpStreamInfo>;
  protected wss1?: WebSocketServer;
  protected wss2?: WebSocketServer;
  constructor(
    protected settings: { dumpFilePath: string },
    protected robotMonitor: RobotMonitor,
    protected dumpMonitor: DumpMonitor,
  ) {
    this.activeRobotStreams = new Map<string, RobotStreamInfo>();
    this.activeDumpStreams = new Map<string, DumpStreamInfo>();
  }
  public async dumpStreamEndpoint(dumpPath: string): Promise<string> {
    const streamKey = dumpPath;
    let dumpWSStream = this.activeDumpStreams.get(streamKey);
    if (!dumpWSStream) {
      const dumpInfo = this.dumpMonitor.dumpState.find((d) => d.path === dumpPath);
      if (!dumpInfo) {
        throw new Error(`Unknown dump [${dumpPath}]`);
      }
      const port = this.findAvailableDumpPort(8500);
      const websocketServer = new WebSocketServer({ port });
      websocketServer.on('connection', async (ws) => {
        dumpWSStream = this.activeDumpStreams.get(streamKey);
        if (!dumpWSStream) {
          throw new Error(`Lost dump WSStream for [${dumpPath}]`);
        }
        const dumpIndex = await this.dumpMonitor.getDumpIndex(dumpPath);
        let currentTimestamp: number | undefined = dumpIndex.firstKey;
        dumpWSStream.clients++;
        if (!dumpWSStream.fileHandle) {
          dumpWSStream.fileHandle = await open(this.dumpMonitor.resolveDumpPath(dumpPath));
        }
        console.log(`Client is streaming dump from [${dumpPath}]`);
        ws.on('message', async (rawCommand: string) => {
          dumpWSStream = this.activeDumpStreams.get(streamKey);
          if (!dumpWSStream) {
            throw new Error(`Lost dump WSStream for [${dumpPath}]`);
          }
          const parsedCommand: DumpControlCommand = JSON.parse(rawCommand);
          switch (parsedCommand.action) {
            case 'next': {
              let nextTimestamp: number | undefined;
              if (parsedCommand.from) {
                nextTimestamp = dumpIndex.getClosestKey(parsedCommand.from);
              } else if (currentTimestamp) {
                nextTimestamp = dumpIndex.getNextKey(currentTimestamp);
              } else {
                console.error('[SNH]: lost playhead pointer');
              }
              if (nextTimestamp) {
                const frame = await this.getFrame(dumpPath, nextTimestamp);
                ws.send(frame);
                currentTimestamp = nextTimestamp;
              } else {
                // reached the end of the stream
                // TODO: handle this on the client
                ws.send(Buffer.from(new Uint8Array([0])));
              }
              break;
            }
            case 'previous': {
              let previousTimestamp: number | undefined;
              if (currentTimestamp) {
                previousTimestamp = dumpIndex.getPreviousKey(currentTimestamp);
              }
              if (previousTimestamp) {
                const frame = await this.getFrame(dumpPath, previousTimestamp);
                ws.send(frame);
                currentTimestamp = previousTimestamp;
              } else {
                console.error('[SNH]: could not determine previous frame');
              }
              break;
            }
            default:
              throw new Error(`Unexpected dump control action [${parsedCommand.action}]`);
              break;
          }
        });
        ws.on('close', async () => {
          console.log(`Client diconnected from dump [${dumpPath}]`);
          dumpWSStream = this.activeDumpStreams.get(streamKey);
          if (!dumpWSStream) {
            throw new Error(`Lost WSStream for [${dumpPath}]`);
          }
          dumpWSStream.clients--;
          if (dumpWSStream.clients <= 0) {
            if (dumpWSStream.fileStream) {
              console.log(`No more clients for dump [${dumpPath}], closing stream`);
              dumpWSStream.fileStream.close();
              dumpWSStream.fileStream = undefined;
            }
            if (dumpWSStream.fileHandle) {
              console.log(`No more clients for dump [${dumpPath}], closing the file`);
              await dumpWSStream.fileHandle.close();
              dumpWSStream.fileHandle = undefined;
            }
          }
        });
      });
      dumpWSStream = {
        server: websocketServer,
        port,
        filePath: dumpPath,
        clients: 0,
      };

      this.activeDumpStreams.set(streamKey, dumpWSStream);
    }
    if (!dumpWSStream) {
      throw new Error(`Failed to stream from [${dumpPath}]`);
    }
    return `ws://$serverHostname:${dumpWSStream.port}`;
  }
  public async robotStreamEndpoint(robotName: string, type: RobotEndpointType, streamMask?: number): Promise<string> {
    const defaultMask = 5;
    const mask = streamMask || defaultMask;
    const streamKey = `${robotName}_${type}`;
    let robotWSStream = this.activeRobotStreams.get(streamKey);
    if (robotWSStream) {
      if (robotWSStream.currentMask !== mask) {
        robotWSStream.requiedMask = mask;
        if (robotWSStream.socket) {
          setMask(robotWSStream.socket, mask);
          robotWSStream.currentMask = mask;
        }
      }
    }
    if (!robotWSStream) {
      const robot = robotList.get(robotName);
      let port = 8100;
      if (robot) {
        port = 8100 + robot.IPLastSegment + (type === RobotEndpointType.wifi ? 200 : 0);
      } else {
        const testRobotIdx = Array.from(testRobotMap.keys()).indexOf(robotName);
        if (testRobotIdx === -1) {
          throw new Error(`Unknown robot[${robotName}]`);
        }
        port = 8201 + testRobotIdx;
      }
      const websocketServer = new WebSocketServer({ port });
      const host = this.robotMonitor.streamingEndpoint(robotName, type);
      let robotStream: Stream;
      let socket: Socket | undefined = undefined;
      websocketServer.on('connection', async (ws) => {
        if (robotName !== 'local' && Array.from(testRobotMap.keys()).includes(robotName)) {
          robotStream = streamBlackboardBytesFromBBD2File(this.settings.dumpFilePath);
        } else {
          robotWSStream = this.activeRobotStreams.get(streamKey);
          if (!robotWSStream) {
            throw new Error(`Lost robotWsStream for [${robotName}]`);
          }
          robotWSStream.clients++;
          if (!socket || socket.destroyed) {
            socket = await connectToHost({ host, mask: robotWSStream.requiedMask });
            robotWSStream.currentMask = robotWSStream.requiedMask;
            robotWSStream.socket = socket;
            robotStream = streamBlackboardBytesFromSocket({ socket });
          } else if (robotWSStream.currentMask != robotWSStream.requiedMask) {
            setMask(socket, robotWSStream.requiedMask);
            robotWSStream.currentMask = mask;
          }
          if (!robotStream) {
            robotStream = streamBlackboardBytesFromSocket({ socket });
          }
        }
        console.log(`Client connected to [${robotName}] via [${type}]`);
        const listener = (blackboardBytes: Uint8Array) => {
          // console.log('.');
          ws.send(blackboardBytes);
        };
        robotStream.on('data', listener);
        ws.on('close', () => {
          console.log('Client disconnected from WSS1');
          ws.removeListener('data', listener);
          console.log(`Client diconnected from [${robotName}]`);
          robotWSStream = this.activeRobotStreams.get(streamKey);
          if (!robotWSStream) {
            throw new Error(`Lost robotWsStream for [${robotName}]`);
          }
          robotWSStream.clients--;
          if (robotWSStream.clients <= 0) {
            if (robotWSStream.socket) {
              console.log(`No more clients for [${robotName}], closing connection`);
              robotWSStream.socket.destroy();
            }
          }
        });
        ws.on('message', (commandsBytes: Uint8Array) => {
          // TODO: compress and proxy commands to the robot's TCP socket
          // const command = Commands.decode(data);
          if (socket) {
            const commandsHeader = Buffer.alloc(4);
            commandsHeader.writeUInt32LE(commandsBytes.length, 0);
            const uncompressedBuffer = Buffer.concat([commandsHeader, commandsBytes]);
            const uncompressedSize = uncompressedBuffer.length.toString(16).padStart(8);
            const compressedBuffer = snappy.compressSync(uncompressedBuffer);
            const compressedSize = compressedBuffer.length.toString(16).padStart(8);
            socket.write(compressedSize);
            socket.write(uncompressedSize);
            socket.write(compressedBuffer);
          }
        });
      });
      robotWSStream = {
        server: websocketServer,
        socket,
        host,
        port,
        type,
        currentMask: mask,
        requiedMask: mask,
        clients: 0,
      };

      this.activeRobotStreams.set(streamKey, robotWSStream);
    }
    if (!robotWSStream) {
      throw new Error(`Failed to establish stream to [${robotName}]`);
    }
    return `ws://$serverHostname:${robotWSStream.port}`;
  }
  public async start() {
    this.wss2 = new WebSocketServer({ port: 8082 });
    this.wss2.on('connection', (ws) => {
      console.log('Client connected to WSS2');

      const stream = streamBlackboardBytesFromBBD2File(this.settings.dumpFilePath);
      stream.on('data', (blackboardBytes: Uint8Array) => {
        ws.send(blackboardBytes);
      });
    });
    // stream.on('data', (blackboardBytes: Uint8Array) => {
    //   robotExtractMiddleware(blackboardBytes);
    // });
  }
  public async stop() {
    await Promise.all(
      [this.wss1, this.wss2].map(
        (wss) =>
          new Promise<void>((resolve, reject) => {
            if (!wss) {
              resolve();
              return;
            }
            wss.close((err) => (err ? reject(err) : resolve()));
          }),
      ),
    );
  }
  protected findAvailableDumpPort(startAt: number) {
    const existingPorts = Array.from(this.activeDumpStreams.values()).map((s) => s.port);
    for (let port = startAt; port++; port <= 65000) {
      if (!existingPorts.includes(port)) {
        return port;
      }
    }
    throw new Error("Can't find any available ports");
  }
  protected async getFrame(dumpPath: string, timestamp: number) {
    const index = await this.dumpMonitor.getDumpIndex(dumpPath);
    const fullDumpPath = this.dumpMonitor.resolveDumpPath(dumpPath);
    const address = index.get(timestamp);
    let nextAddress: number | undefined;
    const nextTimestamp = index.getNextKey(timestamp);
    if (nextTimestamp) {
      nextAddress = index.get(nextTimestamp);
    }
    if (address === undefined) {
      throw new Error(`Can't find frame with timestamp [${timestamp}] in dump [${dumpPath}]`);
    }
    const stream = this.activeDumpStreams.get(dumpPath);
    if (!stream) {
      throw new Error(`Can't find active WS stream for dump [${dumpPath}]`);
    }
    if (stream.fileHandle === undefined) {
      throw new Error(`Can't find file handle for dump [${dumpPath}]`);
    }
    let readResult: Buffer;
    if (nextAddress) {
      readResult = await readBytesFromFile(stream.fileHandle, address, nextAddress - address - BB_NUM_HEADER_BYTES);
    } else {
      const { size } = await stat(fullDumpPath);
      readResult = await readBytesFromFile(stream.fileHandle, address, size - address);
    }
    return readResult.buffer;
  }
}

async function readBytesFromFile(file: FileHandle, from: number, length: number) {
  const chunkSize = 16384; // 16Kb, length of the file read static buffer
  const buffer = Buffer.alloc(length);
  let offset = 0;
  let index = from;
  let remaining = length - (index - from);
  while (remaining > 0) {
    const bytesToRead = remaining < chunkSize ? remaining : chunkSize;
    const result = await file.read({ buffer, offset, position: index, length: bytesToRead });
    offset += result.bytesRead;
    index += result.bytesRead;
    remaining = length - (index - from);
  }
  return buffer;
}
