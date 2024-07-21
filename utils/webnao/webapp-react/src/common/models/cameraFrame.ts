import { CAMERA_ID } from './cameraSettings';

export enum CameraInstance {
  top = 'top',
  bottom = 'bottom',
}
export function cameraInstanceId(camera: CameraInstance) {
  switch (camera) {
    case CameraInstance.top:
      return CAMERA_ID.TOP;
    case CameraInstance.bottom:
      return CAMERA_ID.BOTTOM;
    default:
      throw new Error(`Unknown camera [${camera}]`);
  }
}
interface ICameraFrame {
  topCameraWidth: number;
  topCameraHeight: number;
  bottomCameraWidth: number;
  bottomCameraHeight: number;

  topSaliencyWidth: number;
  topSaliencyHeight: number;
  bottomSaliencyWidth: number;
  bottomSaliencyHeight: number;
}

export const CameraFrame: ICameraFrame = {
  topCameraWidth: 1280,
  topCameraHeight: 960,

  bottomCameraWidth: 640,
  bottomCameraHeight: 480,

  topSaliencyWidth: 320,
  topSaliencyHeight: 240,

  bottomSaliencyWidth: 80,
  bottomSaliencyHeight: 60,
};
