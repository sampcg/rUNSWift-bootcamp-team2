// I think 'jimp' here is dead code.
// This is because utils/webnao/server/src/servers/teamServer.ts has a
// `getCommandHandler` fn which does not implement '/dumps', but does implement '/stream'.
// But if I'm wrong, and this code is used/useful, please replace jimp with sharp:
// https://github.com/Experience-Monks/load-bmfont/issues/11
// import Jimp from 'jimp';
// End apology (for now, I know it breaks the next rule, but I'm not sure how much of this file can be cleaned up)
// https://github.com/pzrq/clean-code-javascript?tab=readme-ov-file#only-comment-things-that-have-business-logic-complexity
import { Blackboard } from '@common/blackboard';
import { RobotCameras } from '@common/blackboard/utils';
import { writeFile } from 'fs/promises';

enum YUV2RGBMethod {
  ITURBT601float1 = 'ITURBT601float1',
  ITURBT601float2 = 'ITURBT601float2',
  offnao = 'offnao',
  V6cameraFloat = 'V6cameraFloat',
  V6cameraInt = 'V6cameraInt',
  SO1 = 'SO1',
}
const defaultYUV2RGBMethod = YUV2RGBMethod.V6cameraInt;

export interface IRectangleRegion {
  left: number;
  top: number;
  width: number;
  height: number;
}

type Y1UVY2Chunk = { y1: number; y2: number; u: number; v: number };
type RGBRGBChunk = { r1: number; g1: number; b1: number; r2: number; g2: number; b2: number };
type Y1UVY2ToRGBConverter = (y1uvy2: Y1UVY2Chunk) => RGBRGBChunk;

/**
 * Converts from YUYV to 2 RGB pixels
 * Based on SO1 standard
 */
const Y1UV2ToRGB_SO1: Y1UVY2ToRGBConverter = function ({ y1, y2, u, v }) {
  const r1 = clamp(Math.floor(y1 + 1.4075 * (v - 128)), 0, 255);
  const g1 = clamp(Math.floor(y1 - 0.3455 * (u - 128) - 0.7169 * (v - 128)), 0, 255);
  const b1 = clamp(Math.floor(y1 + 1.779 * (u - 128)), 0, 255);

  const r2 = clamp(Math.floor(y2 + 1.4075 * (v - 128)), 0, 255);
  const g2 = clamp(Math.floor(y2 - 0.3455 * (u - 128) - 0.7169 * (v - 128)), 0, 255);
  const b2 = clamp(Math.floor(y2 + 1.779 * (u - 128)), 0, 255);
  return { r1, g1, b1, r2, g2, b2 };
};

/**
 * Converts from YUYV to 2 RGB pixels
 * Using formula from {@link https://www.waveshare.com/w/upload/c/cb/OV5640_camera_module_software_application_notes_1.3_Sonix.pdf | camera OV5640 (NaoV6) manual}, float version
 */
const Y1UV2ToRGB_V6CameraFloat: Y1UVY2ToRGBConverter = function ({ y1, y2, u, v }) {
  const r1 = clamp(Math.floor(y1 + 1.371 * (v - 128)), 0, 255);
  const g1 = clamp(Math.floor(y1 - 0.698 * (v - 128) + 0.336 * (u - 128)), 0, 255);
  const b1 = clamp(Math.floor(y1 + 1.732 * (u - 128)), 0, 255);

  const r2 = clamp(Math.floor(y2 + 1.371 * (v - 128)), 0, 255);
  const g2 = clamp(Math.floor(y2 - 0.698 * (v - 128) + 0.336 * (u - 128)), 0, 255);
  const b2 = clamp(Math.floor(y2 + 1.732 * (u - 128)), 0, 255);

  return { r1, g1, b1, r2, g2, b2 };
};

/**
 * Converts from YUYV to 2 RGB pixels
 * Using formula from {@link https://www.waveshare.com/w/upload/c/cb/OV5640_camera_module_software_application_notes_1.3_Sonix.pdf |  camera OV5640 (NaoV6) manual}, int version
 */
const Y1UV2ToRGB_V6cameraInt: Y1UVY2ToRGBConverter = function ({ y1, y2, u, v }) {
  const rc = (351 * (v - 128)) >> 8;
  const gc = (179 * (v - 128) + 86 * (u - 128)) >> 8;
  const bc = (443 * (u - 128)) >> 8;
  const r1 = clamp(y1 + rc, 0, 255);
  const g1 = clamp(y1 - gc, 0, 255);
  const b1 = clamp(y1 + bc, 0, 255);

  const r2 = clamp(y2 + rc, 0, 255);
  const g2 = clamp(y2 - gc, 0, 255);
  const b2 = clamp(y2 + bc, 0, 255);
  return { r1, g1, b1, r2, g2, b2 };
};

/**
 * Converts from YUYV to 2 RGB pixels
 * using NTSC standard, also used in offnao
 */
const Y1UV2ToRGB_Offnao: Y1UVY2ToRGBConverter = function ({ y1, y2, u, v }) {
  const c1 = y1 - 16;
  const c2 = y2 - 16;
  const d = u - 128;
  const e = v - 128;
  const r1 = clamp((298 * c1 + 409 * e + 128) >> 8, 0, 255);
  const g1 = clamp((298 * c1 - 100 * d - 208 * e + 128) >> 8, 0, 255);
  const b1 = clamp((298 * c1 + 516 * d + 128) >> 8, 0, 255);

  const r2 = clamp((298 * c2 + 409 * e + 128) >> 8, 0, 255);
  const g2 = clamp((298 * c2 - 100 * d - 208 * e + 128) >> 8, 0, 255);
  const b2 = clamp((298 * c2 + 516 * d + 128) >> 8, 0, 255);

  return { r1, g1, b1, r2, g2, b2 };
};

/**
 * Converts from YUYV to 2 RGB pixels
 * Using ITU-R_BT.601 standard, variant 1
 */
const Y1UV2ToRGB_ITURBT601float1: Y1UVY2ToRGBConverter = function ({ y1, y2, u, v }) {
  const r1 = clamp(Math.floor((298.082 * y1 + 0 * u + 408.583 * v) / 256 - 222.921), 0, 255);
  const g1 = clamp(Math.floor((298.082 * y1 - 100.291 * u - 208.12 * v) / 256 + 135.576), 0, 255);
  const b1 = clamp(Math.floor((298.082 * y1 + 516.411 * u + 0 * v) / 256 - 276.836), 0, 255);

  const r2 = clamp(Math.floor((298.082 * y2 + 0 * u + 408.583 * v) / 256 - 222.921), 0, 255);
  const g2 = clamp(Math.floor((298.082 * y2 - 100.291 * u - 208.12 * v) / 256 + 135.576), 0, 255);
  const b2 = clamp(Math.floor((298.082 * y2 + 516.411 * u + 0 * v) / 256 - 276.836), 0, 255);

  return { r1, g1, b1, r2, g2, b2 };
};

/**
 * Converts from YUYV to 2 RGB pixels
 * Using ITU-R_BT.601 standard, variant 2
 */
const Y1UV2ToRGB_ITURBT601float2: Y1UVY2ToRGBConverter = function ({ y1, y2, u, v }) {
  const r1 = clamp(Math.floor(y1 + 1.402 * (v - 128)), 0, 255);
  const g1 = clamp(Math.floor(y1 - 0.344 * (u - 128) - 0.714 * (v - 128)), 0, 255);
  const b1 = clamp(Math.floor(y1 + 1.772 * (u - 128)), 0, 255);

  const r2 = clamp(Math.floor(y2 + 1.402 * (v - 128)), 0, 255);
  const g2 = clamp(Math.floor(y2 - 0.344 * (u - 128) - 0.714 * (v - 128)), 0, 255);
  const b2 = clamp(Math.floor(y2 + 1.772 * (u - 128)), 0, 255);

  return { r1, g1, b1, r2, g2, b2 };
};

export function yvyu2rgbrgb({ y1, y2, u, v }: Y1UVY2Chunk, method: YUV2RGBMethod = defaultYUV2RGBMethod): RGBRGBChunk {
  let converter: Y1UVY2ToRGBConverter;
  switch (method) {
    case YUV2RGBMethod.ITURBT601float1:
      converter = Y1UV2ToRGB_ITURBT601float1;
      break;
    case YUV2RGBMethod.ITURBT601float2:
      converter = Y1UV2ToRGB_ITURBT601float2;
      break;
    case YUV2RGBMethod.offnao:
      converter = Y1UV2ToRGB_Offnao;
      break;
    case YUV2RGBMethod.V6cameraInt:
      converter = Y1UV2ToRGB_V6cameraInt;
      break;
    case YUV2RGBMethod.V6cameraFloat:
      converter = Y1UV2ToRGB_V6CameraFloat;
      break;
    case YUV2RGBMethod.SO1:
      converter = Y1UV2ToRGB_SO1;
      break;
    default:
      throw new Error(`Unknown YUV -> RGB method [${method}]`);
  }
  if (!converter) {
    throw new Error(`Couldn't find YUV -> RGB converter for method [${method}]`);
  }
  return converter({ y1, y2, u, v });
}

export function yvyu2rgbBuffer(yuv: Uint8Array, method: YUV2RGBMethod = defaultYUV2RGBMethod): Uint8Array {
  // 0xY’Y’UUYYVV
  const res = new Uint8Array(yuv.length * 1.5);
  for (let i = 0; i < yuv.length; i += 4) {
    const y1 = yuv[i]; // Y'
    const u = yuv[i + 1]; // U
    const y2 = yuv[i + 2]; // Y
    const v = yuv[i + 3]; // V

    const { r1, b1, g1, r2, b2, g2 } = yvyu2rgbrgb({ y1, y2, u, v }, method);

    const resIndex = (i / 2) * 3;

    // first pixel
    res[resIndex] = r1;
    res[resIndex + 1] = g1;
    res[resIndex + 2] = b1;
    // second pixel
    res[resIndex + 3] = r2;
    res[resIndex + 4] = g2;
    res[resIndex + 5] = b2;
  }
  return res;
}

export async function saveTopFrame(bb: Blackboard, path: string, region?: IRectangleRegion) {
  if (bb.vision?.topFrame?.length) {
    const width = RobotCameras.top.width;
    const height = RobotCameras.top.height;
    const imageBytes = bb.vision?.topFrame;
    const rgbBytes = yvyu2rgbBuffer(imageBytes);
    // const jimg = new Jimp({data: rgbBytes, width, height});
    // if (region) {
    //   console.debug('Cropping top', region);
    //   jimg.crop(region.left, region.top, region.width, region.height);
    // }
    // await jimg.writeAsync(path);
  }
}

export async function saveTopFrameRaw(bb: Blackboard, path: string) {
  if (bb.vision?.topFrame?.length) {
    const width = RobotCameras.top.width;
    const height = RobotCameras.top.height;
    const imageBytes = bb.vision?.topFrame;
    await writeFile(path, Buffer.from(imageBytes), 'binary');
  }
}
export async function saveTopFrameRGB(bb: Blackboard, path: string) {
  if (bb.vision?.topFrame?.length) {
    const width = RobotCameras.top.width;
    const height = RobotCameras.top.height;
    const imageBytes = bb.vision?.topFrame;
    const rgbBytes = yvyu2rgbBuffer(imageBytes);
    await writeFile(path, Buffer.from(rgbBytes), 'binary');
  }
}

export async function saveBottomFrame(bb: Blackboard, path: string, region?: IRectangleRegion) {
  if (bb.vision?.botFrame?.length) {
    const width = RobotCameras.bottom.width;
    const height = RobotCameras.bottom.height;
    const imageBytes = bb.vision?.botFrame;
    const rgbBytes = yvyu2rgbBuffer(imageBytes);
    // const jimg = new Jimp({ data: rgbBytes, width, height });
    // if (region) {
    //   console.log('Cropping bottom', region);
    //   jimg.crop(region.left, region.top, region.width, region.height);
    // }
    // await jimg.writeAsync(path);
  }
}

function clamp(n: number, low: number, high: number) {
  if (n < low) {
    return low;
  }
  if (n > high) {
    return high;
  }
  return n;
}
