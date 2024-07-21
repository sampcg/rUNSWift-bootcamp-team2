import { Stage } from '@pixi/react';
import { Graphics } from '@pixi/react';
import React, { useCallback, ComponentProps } from 'react';
import { Vision } from '../common/blackboard/definitions/Blackboard';
import { CameraFrame, CameraInstance } from '../common/models/cameraFrame';
import { VideoViewType } from './CameraView';

interface VisionFeaturesViewProps {
  vision: Vision | null;
  camera: CameraInstance;
  type: VideoViewType;
}
type Draw = Required<ComponentProps<typeof Graphics>>['draw'];

const KinematicsOverlay = ({ vision, camera, type }: VisionFeaturesViewProps) => {
  const pixelRatio = window.devicePixelRatio || 1;
  let width: number;
  let height: number;
  let scale: number;
  switch (camera) {
    case CameraInstance.top:
      width = CameraFrame.topCameraWidth;
      height = CameraFrame.topCameraHeight;
      scale = 2.0;
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

      g.lineStyle(3, 0xff0000, 1);
      g.moveTo(0, 0);
      g.lineTo(100, 100);
      // balls
    },
    [vision],
  );

  return (
    <Stage
      width={width}
      height={height}
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

export default KinematicsOverlay;
