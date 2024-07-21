import { Blackboard } from '@common/blackboard';
import { Commands } from '@common/blackboard/definitions/Commands';
import { createReadStream } from 'fs';
import { Socket, connect } from 'net';
import snappy from 'snappy';
import { Transform } from 'stream';
import { getBlackboardBytesTransform, getBlackboardFromBytesTransform, getUnsnappy } from './blackboardTransforms';

export function streamBlackboardsFromBBD2File(filePath: string): Transform {
  const stream = streamBlackboardBytesFromBBD2File(filePath);
  return stream.pipe(getBlackboardFromBytesTransform());
}

export function streamBlackboardBytesFromBBD2File(filePath: string): Transform {
  const stream = createReadStream(filePath);
  return stream.pipe(getBlackboardBytesTransform());
}

export function streamBlackboardsFromSocket({
  host,
  mask = 7,
  port = 10125,
}: {
  host: string;
  mask?: number;
  port?: number;
}): Transform {
  return streamBlackboardBytesFromHost({ host, mask, port }).pipe(getBlackboardFromBytesTransform());
}

export function streamBlackboardBytesFromSocket({ socket }: { socket: Socket }): Transform {
  return socket.pipe(getUnsnappy()).pipe(getBlackboardBytesTransform());
}

export async function getSomeBlackboardsFromHost({
  host,
  mask,
  port,
  count = 1,
  timeout = 10000,
}: {
  host: string;
  mask?: number;
  port?: number;
  count?: number;
  timeout?: number;
}): Promise<Blackboard[]> {
  const socket = await connectToHost({ host, mask, port });
  const stream = streamBlackboardBytesFromSocket({ socket }).pipe(getBlackboardFromBytesTransform());
  const blackboards: Blackboard[] = [];
  let done = false;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!done) {
        reject(new Error('Failed to get blackboard due to timeout'));
      }
    }, timeout);
    stream.on('data', (blackboard: Blackboard) => {
      blackboards.push(blackboard);
      if (blackboards.length >= count) {
        socket.destroy();
        done = true;
        resolve(blackboards);
      }
    });
    stream.on('error', (error) => {
      socket.destroy();
      done = true;
      reject(error);
    });
  });
}
export async function getSomeBlackboardsFile({
  filePath,
  count = 1,
  timeout = 10000,
}: {
  filePath: string;
  count?: number;
  timeout?: number;
}): Promise<Blackboard[]> {
  const fileStream = createReadStream(filePath);
  const stream = streamBlackboardBytesFromBBD2File(filePath).pipe(getBlackboardFromBytesTransform());
  const blackboards: Blackboard[] = [];
  let done = false;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!done) {
        console.error(new Error('Failed to get blackboard due to timeout'));
      }
    }, timeout);
    stream.on('data', (blackboard: Blackboard) => {
      blackboards.push(blackboard);
      if (blackboards.length >= count) {
        fileStream.close();
        done = true;
        resolve(blackboards);
      }
    });
    stream.on('error', (error) => {
      fileStream.close();
      done = true;
      reject(error);
    });
  });
}
export function connectToHost({ host, mask, port }: { host: string; mask?: number; port?: number }): Promise<Socket> {
  const streamMask = mask || 7;
  return new Promise((resolve, reject) => {
    port = port || 10125;
    const socket = connect({ port, host, family: 4 });
    socket.on('connect', () => {
      setMask(socket, streamMask);
      resolve(socket);
    });
    socket.on('error', reject);
  });
}

export function streamBlackboardBytesFromHost({
  host,
  mask,
  port,
}: {
  host: string;
  mask?: number;
  port?: number;
}): Transform {
  port = port || 10125;
  const streamMask = mask || 7;
  const socket = connect({ port, host });
  socket.on('connect', () => {
    setMask(socket, streamMask);
  });
  return socket.pipe(getUnsnappy()).pipe(getBlackboardBytesTransform());
}
function configCommand(config: Map<string, string>) {
  const argv: string[] = [];
  for (const [key, value] of config) {
    argv.push(...[key, value]);
  }
  return Commands.fromPartial({ argv });
}
function setMaskCommand(mask: number) {
  return Commands.fromPartial({ sendingMask: mask });
}
export function setMask(socket: Socket, mask: number) {
  return sendCommand(setMaskCommand(mask), socket);
}
function setConfig(socket: Socket, config: Map<string, string>) {
  return sendCommand(configCommand(config), socket);
}
function sendCommand(command: Commands, socket: Socket) {
  const commandsBytes = Commands.encode(command).finish();
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

export async function loadBlackboardsFromBBD2File(filePath: string): Promise<Blackboard[]> {
  console.log(`Reading from [${filePath}]`);

  const stream = streamBlackboardsFromBBD2File(filePath);
  return await new Promise((resolve, reject) => {
    const blackboards: Blackboard[] = [];
    const onEnd = () => {
      resolve(blackboards);
    };
    stream
      .on('data', (blackboard) => {
        blackboards.push(blackboard);
      })
      .on('end', onEnd)
      .on('close', onEnd)
      .on('error', (error) => {
        reject(error);
      });
  });
}
