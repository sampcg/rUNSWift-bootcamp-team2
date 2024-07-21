import { Blackboard } from '@common/blackboard';
import { Transform } from 'stream';
import snappy from 'snappy';
import { BlackboardRaw } from '@common/blackboard/BlackboardRaw';

function buffersTotalLength(chunks: Buffer[]) {
  return chunks.reduce((previousValue: number, currentValue: Buffer) => previousValue + currentValue.length, 0);
}
export const BB_NUM_HEADER_BYTES = 4;
const SNAPPY_NUM_HEADER_BYTES = 16;

export function getUnsnappy() {
  let chunks: Buffer[] = [];
  return new Transform({
    readableObjectMode: true,

    transform(chunk: Buffer, encoding, callback) {
      chunks.push(chunk);
      do {
        if (chunks[0].length < SNAPPY_NUM_HEADER_BYTES) {
          chunks = [Buffer.concat(chunks)];
          if (chunks[0].length < SNAPPY_NUM_HEADER_BYTES) {
            // still not enough bytes to do anything
            break;
          }
        }
        const headerString: string = chunks[0].subarray(0, 8) as any;
        const compressedSize = parseInt(headerString, 16);
        if (buffersTotalLength(chunks) < SNAPPY_NUM_HEADER_BYTES + compressedSize) {
          break;
        }
        chunks = [Buffer.concat(chunks)];
        const compressedBuffer = chunks[0].subarray(SNAPPY_NUM_HEADER_BYTES, SNAPPY_NUM_HEADER_BYTES + compressedSize);
        const uncompressedBuffer = snappy.uncompressSync(compressedBuffer);
        chunks = [chunks[0].subarray(SNAPPY_NUM_HEADER_BYTES + compressedSize)];
        this.push(uncompressedBuffer);
      } while (buffersTotalLength(chunks) >= SNAPPY_NUM_HEADER_BYTES);
      callback();
    },
  });
}

export function getBlackboardTransform() {
  let chunks: Buffer[] = [];
  return new Transform({
    readableObjectMode: true,

    transform(chunk: Buffer, encoding, callback) {
      // console.log('Got chunk', chunk.length);
      chunks.push(chunk);
      do {
        if (chunks[0].length < BB_NUM_HEADER_BYTES) {
          chunks = [Buffer.concat(chunks)];
          if (chunks[0].length < BB_NUM_HEADER_BYTES) {
            // still not enough bytes to do anything
            break;
          }
        }
        const blackboardSize = chunks[0].readUInt32LE();
        if (buffersTotalLength(chunks) < BB_NUM_HEADER_BYTES + blackboardSize) {
          break;
        }
        chunks = [Buffer.concat(chunks)];
        const blackboardBuffer = chunks[0].subarray(BB_NUM_HEADER_BYTES, BB_NUM_HEADER_BYTES + blackboardSize);
        try {
          const blackboard = Blackboard.decode(blackboardBuffer);
          this.push(blackboard);
        } catch (e) {
          console.log('Error decoding blackboard', e);
        } finally {
          chunks = [chunks[0].subarray(BB_NUM_HEADER_BYTES + blackboardSize)];
        }
      } while (buffersTotalLength(chunks) >= BB_NUM_HEADER_BYTES);
      callback();
    },
  });
}
export function getBlackboardFromBytesTransform() {
  return new Transform({
    readableObjectMode: true,

    transform(blackboardBuffer: Buffer, encoding, callback) {
      try {
        const blackboard = Blackboard.decode(blackboardBuffer);
        this.push(blackboard);
        callback();
      } catch (e) {
        callback(e as Error);
      }
    },
  });
}
export function getBlackboardRawFromBytesTransform() {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(blackboardBuffer: Buffer, encoding, callback) {
      try {
        const blackboardRaw = BlackboardRaw.fromBytes(blackboardBuffer);
        this.push(blackboardRaw);
      } catch (e) {
        console.log('Error decoding blackboard', e);
      } finally {
        callback();
      }
    },
  });
}
export function getFrameIndexTransformFromBytesTransform() {
  let frameIndex = 0;
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(blackboardBuffer: Buffer, encoding, callback) {
      try {
        console.log('.');
        const blackboard = Blackboard.decode(blackboardBuffer);
        const timestamp = blackboard.vision?.timestamp || 0;
        frameIndex = frameIndex + blackboardBuffer.length;
        const index = Buffer.from(new Uint32Array([frameIndex, 0xff, timestamp]));
        this.push(index);
      } catch (e) {
        console.log('Error decoding blackboard', e);
      } finally {
        callback();
      }
    },
  });
}
export function getBlackboardBytesTransform() {
  let chunks: Buffer[] = [];
  return new Transform({
    readableObjectMode: true,

    transform(chunk: Buffer, encoding, callback) {
      chunks.push(chunk);
      do {
        if (chunks[0].length < BB_NUM_HEADER_BYTES) {
          chunks = [Buffer.concat(chunks)];
          if (chunks[0].length < BB_NUM_HEADER_BYTES) {
            // still not enough bytes to do anything
            break;
          }
        }
        const blackboardSize = chunks[0].readUInt32LE();
        if (buffersTotalLength(chunks) < BB_NUM_HEADER_BYTES + blackboardSize) {
          break;
        }
        chunks = [Buffer.concat(chunks)];
        const blackboardBuffer = chunks[0].subarray(BB_NUM_HEADER_BYTES, BB_NUM_HEADER_BYTES + blackboardSize);
        try {
          this.push(blackboardBuffer);
        } catch (e) {
          console.log('Error decoding blackboard', e);
        } finally {
          chunks = [chunks[0].subarray(BB_NUM_HEADER_BYTES + blackboardSize)];
        }
      } while (buffersTotalLength(chunks) >= BB_NUM_HEADER_BYTES);
      callback();
    },
  });
}
