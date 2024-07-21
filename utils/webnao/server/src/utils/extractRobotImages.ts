import { Blackboard } from '@common/blackboard';
import { BBox, Point } from '@common/blackboard/definitions/Blackboard';
import { saveTopFrame, saveBottomFrame, IRectangleRegion } from './image';
import { resolve as resolvePath } from 'path';
import { Transform } from 'stream';

export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};
function isSensiblePoint(point?: Point): boolean {
  if (!point) {
    return false;
  }
  return isSensibleCoordinate(point.x) && isSensibleCoordinate(point.y);
}
function isSensibleCoordinate(coord?: number): boolean {
  if (coord === null || coord === undefined) {
    return false;
  }
  if (coord <= 0 || coord > 10000) {
    return false;
  }
  return true;
}
export function isFullPoint(point?: Point): point is Required<Point> {
  return !!point && !!point.x && !!point.y && isSensiblePoint(point);
}
export function isFullBox(box?: BBox): box is DeepRequired<BBox> {
  return !!box && !!box.a && !!box.b && isFullPoint(box.a) && isFullPoint(box.b);
}
function rectangleRegionFromBBox(box?: BBox): IRectangleRegion | undefined {
  if (isFullBox(box)) {
    return {
      left: box.a.x,
      top: box.a.y,
      width: box.b.x - box.a.x,
      height: box.b.y - box.a.y,
    };
  }
  return undefined;
}

export function robotExtractMiddlewareTransform() {
  return new Transform({
    readableObjectMode: true,

    async transform(blackboardBuffer: Buffer, encoding, callback) {
      try {
        await robotExtractMiddleware(blackboardBuffer);
        callback();
      } catch (e) {
        callback(e as Error);
      }
    },
  });
}

export async function robotExtractMiddleware(blackboardBytes: Uint8Array) {
  const bb = Blackboard.decode(blackboardBytes);
  await extractRobotImages(bb, resolvePath(__dirname, '../../.temp/robots'));
}
async function extractRobotImages(bb: Blackboard, folder: string) {
  if (bb.vision?.robots.length) {
    for (let i = 0; i < bb.vision.robots.length; i++) {
      const robotFileName = `${new Date().getTime().toString()}_${i}.png`;
      const robotFilePath = resolvePath(folder, robotFileName);
      const robot = bb.vision.robots[i];
      const regionTop = rectangleRegionFromBBox(robot.topImageCoords);
      try {
        if (regionTop) {
          await saveTopFrame(bb, robotFilePath, regionTop);
        }
        const regionBottom = rectangleRegionFromBBox(robot.botImageCoords);
        if (regionBottom) {
          await saveBottomFrame(bb, robotFilePath, regionBottom);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
