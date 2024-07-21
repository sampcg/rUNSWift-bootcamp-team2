import cv from '@techstark/opencv-js';
import { CameraFrame, CameraInstance } from '../common/models/cameraFrame';
import { BBox, Vision } from '../common/blackboard/definitions/Blackboard';
import { VisionDetectorSetting } from '../context/VisionDetectorContext';
import { Graphics } from '@pixi/react';
import { ComponentProps } from 'react';
import { isFullBox } from '../common/utils/geomety';

interface IRefereeFeatures {
  redRegions?: BBox[];
  gloves?: GloveCandidate[];
  croppedRegion: BBox;
}

interface RefereePoseDetectorSettings {
  handMinHDistance: number;
  handMaxHDistance: number;
  handMinVDistance: number;
  handMaxVDistance: number;
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  cropBottom: number;
}
function loadRefereePoseDetectorSettings(settings: VisionDetectorSetting[]): RefereePoseDetectorSettings {
  return {
    handMinHDistance: settings.find(s => s.name === 'handMinHDistance')?.value!,
    handMaxHDistance: settings.find(s => s.name === 'handMaxHDistance')?.value!,
    handMinVDistance: settings.find(s => s.name === 'handMinVDistance')?.value!,
    handMaxVDistance: settings.find(s => s.name === 'handMaxVDistance')?.value!,
    cropLeft: settings.find(s => s.name === 'cropLeft')?.value!,
    cropRight: settings.find(s => s.name === 'cropRight')?.value!,
    cropTop: settings.find(s => s.name === 'cropTop')?.value!,
    cropBottom: settings.find(s => s.name === 'cropBottom')?.value!
  }
}

export const refereeDetectorSettings: VisionDetectorSetting[] = [
  { name: 'handMinHDistance', value: 50, min:0, max: 200 },
  { name: 'handMaxHDistance', value: 90, min:0, max: 200 },
  { name: 'handMinVDistance', value: 1, min:0, max: 200 },
  { name: 'handMaxVDistance', value: 10, min:0, max: 200 },
  { name: 'cropLeft', value: 0, min:0, max: 1000 },
  { name: 'cropRight', value: 0, min:0, max: 1000 },
  { name: 'cropTop', value: 0, min:0, max: 1000 },
  { name: 'cropBottom', value: 0, min:0, max: 1000 },
]
export interface RefereePoseExtendedVision extends Vision {
  refereePose: IRefereeFeatures;
}

const yuyvToRgbMat = (yuyvArray: Uint8Array, width: number, height: number): cv.Mat => {
  const rgbMat = new cv.Mat();
  try {
    const yuvMat = new cv.Mat(height, width, cv.CV_8UC2);
    yuvMat.data.set(yuyvArray);
    cv.cvtColor(yuvMat, rgbMat, cv.COLOR_YUV2RGB_YUYV);
    yuvMat.delete();
  } catch (error) {
    if (typeof error === 'number') {
      console.error('yuyvToRgbMat', error, cv.exceptionFromPtr(error));
    } else {
      console.error('yuyvToRgbMat', error);
    }
  } finally {
    return rgbMat;
  }
};

const isolateRedColor = (rgbFrame: cv.Mat, settings: RefereePoseDetectorSettings): { redMask: cv.Mat, croppedRegion: cv.Rect } => {
  const redMask = new cv.Mat();
  const { cropLeft, cropRight, cropTop, cropBottom } = settings;
  const croppedRegion = new cv.Rect(cropLeft, cropTop, rgbFrame.cols - cropLeft - cropRight, rgbFrame.rows - cropTop - cropBottom);
  try {
  
    const croppedFrame = rgbFrame.roi(croppedRegion);
    const hsvFrame = new cv.Mat();
    cv.cvtColor(croppedFrame, hsvFrame, cv.COLOR_RGB2HSV);
    croppedFrame.delete()

    const lowerRed1 = new cv.Mat(hsvFrame.rows, hsvFrame.cols, hsvFrame.type(), [0, 120, 50, 0]);
    const upperRed1 = new cv.Mat(hsvFrame.rows, hsvFrame.cols, hsvFrame.type(), [18, 255, 255, 255]);
    const mask1 = new cv.Mat();
    cv.inRange(hsvFrame, lowerRed1, upperRed1, mask1);
  
    const lowerRed2 = new cv.Mat(hsvFrame.rows, hsvFrame.cols, hsvFrame.type(), [170, 120, 50, 0]);
    const upperRed2 = new cv.Mat(hsvFrame.rows, hsvFrame.cols, hsvFrame.type(), [180, 255, 255, 255]);
    const mask2 = new cv.Mat();
    cv.inRange(hsvFrame, lowerRed2, upperRed2, mask2);
  
    
    cv.bitwise_or(mask1, mask2, redMask);
  
    lowerRed1.delete();
    upperRed1.delete();
    lowerRed2.delete();
    upperRed2.delete();
    mask1.delete();
    mask2.delete();
    hsvFrame.delete();
  } catch (error) {
    if (typeof error === 'number') {
      console.error('isolateRedColor', error, cv.exceptionFromPtr(error));
    } else {
      console.error('isolateRedColor', error);
    }
  } finally {
    return { redMask, croppedRegion };
  }
};
interface GloveCandidate {
  left: cv.Rect;
  right: cv.Rect;
}
interface GlovePositionsResult {
  redRegions: cv.Rect[],
  gloves: GloveCandidate[]
}
const findGlovePositions = (redMask: cv.Mat, settings: RefereePoseDetectorSettings): GlovePositionsResult => {
  const result: { redRegions: cv.Rect[], gloves: GloveCandidate[] } = {
    redRegions: [],
    gloves: []
  };
  try {
    const { cropLeft, cropTop } = settings;
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(redMask, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
    
    const boxes: cv.Rect[] = [];
    for (let i = 0; i < contours.size(); ++i) {
      const boundingBox = cv.boundingRect(contours.get(i));
      const area = boundingBox.width * boundingBox.height;
      if (area >= 300) {
        // Adjust the bounding box position according to the crop offsets
        boundingBox.x += cropLeft;
        boundingBox.y += cropTop;
        boxes.push(boundingBox);
      }
    }
    result.redRegions = boxes;
    const candidates: GloveCandidate[] = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const box1 = boxes[i];
        const box2 = boxes[j];
        
        const deltaX = Math.abs((box1.x + box1.width / 2) - (box2.x + box2.width / 2));
        const deltaY = Math.abs((box1.y + box1.height / 2) - (box2.y + box2.height / 2));
  
        if (
          deltaX > settings.handMinHDistance &&
          deltaX < settings.handMaxHDistance &&
          deltaY > settings.handMinVDistance &&
          deltaY < settings.handMaxVDistance
        ) {
          candidates.push({ left: box1, right: box2 });
        }
      }
    }
    result.gloves = candidates;
    contours.delete();
    hierarchy.delete();
  } catch (error) {
    if (typeof error === 'number') {
      console.error('findGlovePositions', error, cv.exceptionFromPtr(error));
    } else {
      console.error('findGlovePositions', error);
    }
  } finally {
    return result;
  }
};

function rectToBBox(r: cv.Rect): BBox {
  return {a: {x: r.x, y: r.y}, b: {x: r.x + r.width, y: r.y + r.height}};
}
function detectFeatures(img: Uint8Array, settings: RefereePoseDetectorSettings): IRefereeFeatures {
  const src = yuyvToRgbMat(img, CameraFrame.topCameraWidth, CameraFrame.topCameraHeight);
  const { redMask, croppedRegion } = isolateRedColor(src, settings);
  src.delete();
  const glovePositions = findGlovePositions(redMask, settings);
  redMask.delete();
  const redRegions = glovePositions.redRegions.map(r => {
    const bbox = rectToBBox(r);
    return bbox;
  });
  return { gloves: glovePositions.gloves, redRegions, croppedRegion: rectToBBox(croppedRegion)};
}
export function detect(img: Uint8Array, vision: Vision, settings: VisionDetectorSetting[]): RefereePoseExtendedVision {
  const detectorSettings = loadRefereePoseDetectorSettings(settings);
  return { ...vision, refereePose: detectFeatures(img, detectorSettings)};
}
type Draw = Required<ComponentProps<typeof Graphics>>['draw'];
type ExtendedDraw = (g: Parameters<Draw>[0], vision: RefereePoseExtendedVision, camera: CameraInstance, scale: number) => void;

export const drawFeatures: ExtendedDraw = (g, vision, camera, scale) => {
  if (vision?.refereePose?.croppedRegion) {
    g.lineStyle(3, 0xFFCC00, 0.8);
    const box = vision.refereePose.croppedRegion;
    if (isFullBox(box)) {
      const x = box.a.x / scale;
      const y = box.a.y / scale;
      const width = (box.b.x / scale) - x;
      const height = (box.b.y / scale) - y;
      g.drawRect(x, y, width, height);
    }
  }

  if (vision?.refereePose?.redRegions?.length) {
    g.lineStyle(3, 0xFFFFFF, 1);
    for (const glove of vision?.refereePose.redRegions || []) {
      if (camera !== CameraInstance.top) {
        continue;
      }
      const box = glove;
      if (isFullBox(box)) {
        const x = box.a.x / scale;
        const y = box.a.y / scale;
        const width = (box.b.x / scale) - x;
        const height = (box.b.y / scale) - y;
        g.drawRect(x, y, width, height);
      }
    }
    
    g.lineStyle(0, 0xffffff, 0);
  }

  if (vision?.refereePose?.gloves?.length) {
    g.lineStyle(3, 0xFFCC00, 1);
    for (const gloveCandidate of vision?.refereePose.gloves || []) {
      if (camera !== CameraInstance.top) {
        continue;
      }
      const centers: {x: number, y: number}[] = [];
      for (const glove of [gloveCandidate.left, gloveCandidate.right]) {
        const box = {a: {x: glove.x, y: glove.y}, b: {x: glove.x + glove.width, y: glove.y + glove.height}};
        if (isFullBox(box)) {
          const x = box.a.x / scale;
          const y = box.a.y / scale;
          const width = (box.b.x / scale) - x;
          const height = (box.b.y / scale) - y;
          centers.push({x: x + width / 2, y: y + height / 2})
          g.drawRect(x, y, width, height);
        }
      }
      g.moveTo(centers[0].x, centers[0].y);
      g.lineTo(centers[1].x, centers[1].y);
    }
    
    g.lineStyle(0, 0xffffff, 0);
  }
}
