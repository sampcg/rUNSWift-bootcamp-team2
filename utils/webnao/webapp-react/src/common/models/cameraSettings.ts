// From v4l2 controls
const V4L2_CTRL_CLASS_USER = 0x00980000;
const V4L2_CID_BASE = V4L2_CTRL_CLASS_USER | 0x900;
const V4L2_CID_BRIGHTNESS = V4L2_CID_BASE + 0;
const V4L2_CID_CONTRAST = V4L2_CID_BASE + 1;
const V4L2_CID_SATURATION = V4L2_CID_BASE + 2;
const V4L2_CID_DO_WHITE_BALANCE = V4L2_CID_BASE + 13;
const V4L2_CID_EXPOSURE = V4L2_CID_BASE + 17;
const V4L2_CID_GAIN = V4L2_CID_BASE + 19;
const V4L2_CID_SHARPNESS = V4L2_CID_BASE + 27;
const V4L2_CID_BACKLIGHT_COMPENSATION = V4L2_CID_BASE + 28;

export enum CAMERA_ID {
  TOP = 1,
  BOTTOM = 0,
}
export class CameraSetting {
  constructor(
    public id: number,
    public name: string,
    public defaultValue: number,
    public range: [number, number],
  ) {}
}
// From Offnao cameraTab.cpp
export const CameraSettings = {
  exposure: new CameraSetting(V4L2_CID_EXPOSURE, 'Exposure', 1, [2000, 0]),
  brightness: new CameraSetting(V4L2_CID_BRIGHTNESS, 'Brightness', 0, [50, 0]),
  contrast: new CameraSetting(V4L2_CID_CONTRAST, 'Contrast', 16, [255, 0]),
  gain: new CameraSetting(V4L2_CID_GAIN, 'Gain', 35, [1023, 0]),
  // gain: new CameraSetting(19, 'Gain',35,[400, 0]),
  // Note: Saturation ranges from 0 - 255, but anything below 60 is losing its colour
  saturation: new CameraSetting(V4L2_CID_SATURATION, 'Saturation', 60, [255, 0]),
  sharpness: new CameraSetting(V4L2_CID_SHARPNESS, 'Sharpness', 0, [7, 0]),
  backlightCompensation: new CameraSetting(V4L2_CID_BACKLIGHT_COMPENSATION, 'Backlight Compensation', 0, [4, 0]),
  whiteBalance: new CameraSetting(V4L2_CID_DO_WHITE_BALANCE, 'White Balance', 2700, [6500, 0]),
};

export function cameraSettingCommand(camera_id: CAMERA_ID, setting: CameraSetting, value: number): string {
  if (value > setting.range[0] || value < setting.range[1]) {
    throw new Error(`[${value}] is outside of range [${setting.range[1]}, ${setting.range[0]}] for [${setting.name}]`);
  }
  return `${camera_id}:${setting.id}:${value}`;
}

export function cameraSettingCommands(camera_id: CAMERA_ID, settings: Map<CameraSetting, number>) {
  const commands: string[] = [];
  for (const [setting, value] of settings) {
    commands.push(cameraSettingCommand(camera_id, setting, value));
  }
  return commands.join(',');
}
