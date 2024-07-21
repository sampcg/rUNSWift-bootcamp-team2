export enum Joints {
  HeadYaw = 0,
  HeadPitch,
  LShoulderPitch,
  LShoulderRoll,
  LElbowYaw,
  LElbowRoll,
  LWristYaw,
  LHipYawPitch,
  LHipRoll,
  LHipPitch,
  LKneePitch,
  LAnklePitch,
  LAnkleRoll,
  RHipRoll,
  RHipPitch,
  RKneePitch,
  RAnklePitch,
  RAnkleRoll,
  RShoulderPitch,
  RShoulderRoll,
  RElbowYaw,
  RElbowRoll,
  RWristYaw,
  LHand,
  RHand,
  NUMBER_OF_JOINTS,
}

interface CameraInfo {
  width: number;
  height: number;
}

export const RobotCameras: { top: CameraInfo; bottom: CameraInfo } = {
  top: {
    width: 1280,
    height: 960,
  },
  bottom: {
    width: 640,
    height: 480,
  },
};

export interface IStreamMaskFlags {
  blackboard: boolean;
  saliency: boolean;
  rawImage: boolean;
}
export function makeMask(flags: IStreamMaskFlags): number {
  let mask = 0;
  if (flags.blackboard) {
    mask += 1;
  }
  if (flags.saliency) {
    mask += 2;
  }
  if (flags.rawImage) {
    mask += 4;
  }
  return mask;
}
export function maskToFlags(mask: number): IStreamMaskFlags {
  return {
    blackboard: (mask & 1) !== 0,
    saliency: (mask & 2) !== 0,
    rawImage: (mask & 4) !== 0,
  };
}
// credit https://stackoverflow.com/posts/43122214/revisions
function bitCount(n: number) {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}

export function batteryChargeFromEarLEDS(earLEDS: number | undefined) {
  if (earLEDS === undefined) {
    return undefined;
  }
  return bitCount(earLEDS) / 10;
}
