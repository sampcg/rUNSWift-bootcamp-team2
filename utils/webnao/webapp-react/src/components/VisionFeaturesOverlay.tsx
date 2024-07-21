import { Stage } from '@pixi/react';
import { Graphics } from '@pixi/react';
import React, { useCallback, ComponentProps, useEffect } from 'react';
import { Vision, Vision_FieldFeatureInfoType } from '../common/blackboard/definitions/Blackboard';
import { CameraFrame, CameraInstance } from '../common/models/cameraFrame';
import { isFullBox, isSensiblePoint } from '../common/utils/geomety';
import { VideoViewType } from './CameraView';
import { RefereePoseExtendedVision, drawFeatures as drawRefereeFeatures } from '../detectors/RefereePoseDetector';

interface VisionFeaturesViewProps {
  vision: RefereePoseExtendedVision | null;
  camera: CameraInstance;
  type: VideoViewType;
}
type Draw = Required<ComponentProps<typeof Graphics>>['draw'];

const VisionFeaturesOverlay = ({ vision, camera, type }: VisionFeaturesViewProps) => {
  const pixelRatio = window.devicePixelRatio || 1;
  let width: number;
  let height: number;
  let scale: number;
  switch (camera) {
    case CameraInstance.top:
      width = CameraFrame.topCameraWidth;
      height = CameraFrame.topCameraHeight;
      scale = 1.0;
      break;
    case CameraInstance.bottom:
      width = CameraFrame.bottomCameraWidth;
      height = CameraFrame.bottomCameraHeight;
      scale = 1.0;
      break;
  }
  const draw = useCallback<Draw>(
    (g) => {
      g.clear();

      // balls
      const balls = vision?.balls;
      if (balls?.length) {
        g.lineStyle(3, 0xff0000, 1);
        for (const ball of balls) {
          const isInCurrentCamera =
            (ball.topCamera && camera === CameraInstance.top) || (!ball.topCamera && camera === CameraInstance.bottom);
          if (isInCurrentCamera && isSensiblePoint(ball.imageCoords) && ball.radius) {
            g.drawCircle(ball.imageCoords?.x! / scale, ball.imageCoords?.y!, ball.radius / scale);
          }
        }
        g.lineStyle(0, 0xffffff, 0);
      }

      // robots
      if (vision?.robots?.length) {
        for (const robot of vision?.robots) {
          const box = camera === CameraInstance.top ? robot.topImageCoords : robot.botImageCoords;
          if (isFullBox(box)) {
            const x = box.a.x / scale;
            const y = box.a.y / scale;
            const width = box.b.x / scale - x;
            const height = box.b.y / scale - y;
            const yellowProbability = 0.5;
            const navyProbability = 1;
            const bgProbability = 0.3;
            const colourIndicatorSize = width / 4;
            g.lineStyle(3, 0x00ff00, 1);
            g.drawRect(x, y, width, height);
            g.beginFill(0xffffff, 1);
            g.drawRect(x, y - colourIndicatorSize, colourIndicatorSize * 3, colourIndicatorSize);
            g.endFill();
            // g.lineStyle(3, 0x00ff00, 0);
            g.beginFill(0xffcc00, yellowProbability);
            g.drawRect(x, y - colourIndicatorSize, colourIndicatorSize, colourIndicatorSize);
            g.endFill();
            g.beginFill(0x010050, navyProbability);
            g.drawRect(x + colourIndicatorSize, y - colourIndicatorSize, colourIndicatorSize, colourIndicatorSize);
            g.endFill();
            g.beginFill(0x000000, bgProbability);
            g.drawRect(x + colourIndicatorSize * 2, y - colourIndicatorSize, colourIndicatorSize, colourIndicatorSize);
            g.endFill();
          }
        }
        g.lineStyle(0, 0xffffff, 0);
      }

      // regions
      if (vision?.regions.length) {
        g.lineStyle(3, 0x3b8ce7, 1);
        for (const region of vision?.regions || []) {
          const isInCurrentCamera =
            (region.isTopCamera && camera === CameraInstance.top) ||
            (!region.isTopCamera && camera === CameraInstance.bottom);
          if (!isInCurrentCamera) {
            continue;
          }
          const box = region.boundingBoxRaw;
          if (isFullBox(box)) {
            const x = box.a.x / scale;
            const y = box.a.y / scale;
            const width = box.b.x / scale - x;
            const height = box.b.y / scale - y;
            g.drawRect(x, y, width, height);
          }
        }

        g.lineStyle(0, 0xffffff, 0);
      }

      if (vision?.fieldBoundaries) {
        g.lineStyle(2, 0xffcc00, 1);
        for (const boundary of vision?.fieldBoundaries || []) {
          if (boundary.imageBoundary?.p1 && boundary.imageBoundary?.p2) {
            const isInCurrentCamera = camera === CameraInstance.top;
            const line = boundary.imageBoundary;
            if (isInCurrentCamera && line?.t1 && line?.t2 && line.t3) {
              const x1 = 0;
              const y1 = (-1 * line?.t3) / line.t2;
              const x2 = width - 1;
              const y2 = (-line.t3 - line.t1 * (height - 1)) / line.t2;
              g.moveTo(x1, y1);
              g.lineTo(x2, y2);
            }
          }
        }
        g.lineStyle(0, 0xffffff, 0);
    }
    
    // field boundary
    if (vision?.fieldBoundaries) {
      g.lineStyle(2, 0xFFCC00, 1);
      for (const boundary of vision?.fieldBoundaries || []) {
        if (boundary.imageBoundary?.p1 && boundary.imageBoundary?.p2) {
          const isInCurrentCamera = camera === CameraInstance.top;
          const line = boundary.imageBoundary;
          if (isInCurrentCamera && line?.t1 && line?.t2 && line.t3) {
            const x1 = 0;
            const y1 = -1 * line?.t3 / line.t2;
            const x2 = width -1;
            const y2 = ((-line.t3 - line.t1 * (height-1))) / line.t2;
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);
          }
        }
        g.lineStyle(0, 0xffffff, 0);
      }
    }
      if (vision?.cropRegion) {
        g.lineStyle(3, 0xFFCC00, 0.8);
        const box = vision.cropRegion;
        if (isFullBox(box)) {
          const x = box.a.x / scale;
          const y = box.a.y / scale;
          const width = (box.b.x / scale) - x;
          const height = (box.b.y / scale) - y;
          g.drawRect(x, y, width, height);
        }
      }
    
      if (vision?.redRegions.length) {
        g.lineStyle(3, 0xFF0000, 3);
        for (const glove of vision?.redRegions || []) {
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
    
      if (vision?.refereeHands.length) {
        g.lineStyle(3, 0xFFCC00, 1);
        for (const gloveCandidate of vision?.refereeHands || []) {
          if (camera !== CameraInstance.top) {
            continue;
          }
          const centers: {x: number, y: number}[] = [];
          if (gloveCandidate.left && gloveCandidate.right) {
            for (const glove of [gloveCandidate.left, gloveCandidate.right]) {
              const box = glove.topImageCoords;
              if (isFullBox(box)) {
                const x = box.a.x / scale;
                const y = box.a.y / scale;
                const width = (box.b.x / scale) - x;
                const height = (box.b.y / scale) - y;
                centers.push({x: x + width / 2, y: y + height / 2})
                g.drawRect(x, y, width, height);
              }
            }
          }
          
          g.moveTo(centers[0].x, centers[0].y);
          g.lineTo(centers[1].x, centers[1].y);
        }
        
        g.lineStyle(0, 0xffffff, 0);
      }
    },
    [vision],
  );
  useEffect(() => {
    const canvasElements = document.getElementsByClassName('vision-features-overlay');
    const styleOverride = 'position: absolute; width: 100%; height:100%';
    for (let i = 0; i < canvasElements.length; i++) {
      const canvasElement = canvasElements[i] as HTMLElement;
      if (canvasElement.style.width !== '100%') {
        canvasElement.setAttribute('style', styleOverride);
      }
    }
  }, [vision]);
  return (
    <Stage
      width={width}
      height={height}
      className="vision-features-overlay"
      options={{
        backgroundAlpha: 0,
        resolution: pixelRatio,
        antialias: true,
      }}
      style={{
        position: 'absolute',
      }}
    >
      <Graphics draw={draw} />
    </Stage>
  );
};

export default VisionFeaturesOverlay;
