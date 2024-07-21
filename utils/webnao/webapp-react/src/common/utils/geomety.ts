import { BBox, Point } from '../blackboard/definitions/Blackboard';

export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};

export interface IRectangleRegion {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function isSensiblePoint(point?: Point): boolean {
  if (!point) {
    return false;
  }
  return isSensibleCoordinate(point.x) && isSensibleCoordinate(point.y);
}

function isSensibleCoordinate(coord?: number): boolean {
  if (coord === null || coord === undefined) {
    return false;
  }
  if (coord < 0 || coord > 10000) {
    return false;
  }
  return true;
}
export function isFullPoint(point?: Point): point is Required<Point> {
  return !!point && !Number.isNaN(point.x) && !Number.isNaN(point.y) && isSensiblePoint(point);
}
export function isFullBox(box?: BBox): box is DeepRequired<BBox> {
  return !!box && !!box.a && !!box.b && isFullPoint(box.a) && isFullPoint(box.b);
}
export function rectangleRegionFromBBox(box?: BBox): IRectangleRegion | undefined {
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
