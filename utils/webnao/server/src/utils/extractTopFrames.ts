import { resolve as resolvePath } from 'path';
import { Blackboard } from "@common/blackboard";
import { saveTopFrameRGB, saveTopFrameRaw } from './image';
import { Transform } from 'stream';
import { mkdir } from 'fs/promises';
export function topImageExtractMiddlewareTransform() {
    let index = 0;
    return new Transform({
        readableObjectMode: true,

        async transform(blackboardBuffer: Buffer, encoding, callback) {
        try {
            await topImageExtractMiddleware(blackboardBuffer, index++);
            callback();
        } catch (e) {
            callback(e as Error);
        }
        },
    });
  }

export async function topImageExtractMiddleware(blackboardBytes: Uint8Array, index: number) {
    const bb = Blackboard.decode(blackboardBytes);
    await extractTopFrame(bb, resolvePath(__dirname, '../../.temp/topFrames'), index.toFixed(0));
}

async function extractTopFrame(bb: Blackboard, folder: string, prefix?: string) {
    await mkdir(folder, { recursive: true });
    const fileName = `${prefix || bb?.vision?.timestamp || new Date().getTime()}`;
    const filePath = resolvePath(folder, fileName);
    saveTopFrameRaw(bb, `${filePath}.yuyv`);
    saveTopFrameRGB(bb, `${filePath}.rgb`);
}
