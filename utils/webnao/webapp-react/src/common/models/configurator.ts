import { Kinematics_Parameters, Vision_RefereeHandDetectorSettings } from '../blackboard/definitions/Blackboard';
import { Commands } from '../blackboard/definitions/Commands';
import { CAMERA_ID, CameraSetting, cameraSettingCommands } from './cameraSettings';

export type IConfigCommand = [string, string];
export class Configurator {
  public static configureCameraSettings(camera_id: CAMERA_ID, settings: Map<CameraSetting, number>): IConfigCommand {
    return ['--vision.camera_controls', cameraSettingCommands(camera_id, settings)];
  }
  public static configureKickCalbiration(
    isOn: boolean,
    foot: 'LEFT' | 'RIGHT',
    leanL: number,
    leanR: number,
  ): IConfigCommand[] {
    const params: IConfigCommand[] = [];
    if (isOn) {
      params.push(['--calibration.kick', '1']);
      params.push(['--kick.foot', foot]);
      params.push(['--kick.leanOffsetL', leanL.toFixed(1)]);
      params.push(['--kick.leanOffsetR', leanR.toFixed(1)]);
    } else {
      params.push(['--calibration.kick', '0']);
    }
    return params;
  }
  public static configureKinematicsParameters(parameters: Partial<Kinematics_Parameters>): IConfigCommand[] {
    const params: IConfigCommand[] = [];

    if (parameters.cameraPitchTop !== undefined) {
      params.push(['--kinematics.cameraPitchTop', parameters.cameraPitchTop.toFixed(1)]);
    }
    if (parameters.cameraYawTop !== undefined) {
      params.push(['--kinematics.cameraYawTop', parameters.cameraYawTop.toFixed(1)]);
    }
    if (parameters.cameraRollTop !== undefined) {
      params.push(['--kinematics.cameraRollTop', parameters.cameraRollTop.toFixed(1)]);
    }
    if (parameters.cameraYawBottom !== undefined) {
      params.push(['--kinematics.cameraYawBottom', parameters.cameraYawBottom.toFixed(1)]);
    }
    if (parameters.cameraPitchBottom !== undefined) {
      params.push(['--kinematics.cameraPitchBottom', parameters.cameraPitchBottom.toFixed(1)]);
    }
    if (parameters.cameraRollBottom !== undefined) {
      params.push(['--kinematics.cameraRollBottom', parameters.cameraRollBottom.toFixed(1)]);
    }
    if (parameters.bodyPitch !== undefined) {
      params.push(['--kinematics.bodyPitch', parameters.bodyPitch.toFixed(1)]);
    }
    return params;
  }
  public static configureRefereeDetectionSettings(parameters: Partial<Vision_RefereeHandDetectorSettings>): Map<string, string> {
    const params = new Map<string, string>();
    if (parameters.handMinHDistance !== undefined) {
      params.set('--vision.top.refereehands.handminhdistance', parameters.handMinHDistance.toFixed(0));
    }
    if (parameters.handMaxHDistance !== undefined) {
      params.set('--vision.top.refereehands.handmaxhdistance', parameters.handMaxHDistance.toFixed(0));
    }
    if (parameters.handMinVDistance !== undefined) {
      params.set('--vision.top.refereehands.handminvdistance', parameters.handMinVDistance.toFixed(0));
    }
    if (parameters.handMaxVDistance !== undefined) {
      params.set('--vision.top.refereehands.handmaxvdistance', parameters.handMaxVDistance.toFixed(0));
    }
    if (parameters.cropLeft !== undefined) {
      params.set('--vision.top.refereehands.cropleft', parameters.cropLeft.toFixed(0));
    }
    if (parameters.cropRight !== undefined) {
      params.set('--vision.top.refereehands.cropright', parameters.cropRight.toFixed(0));
    }
    if (parameters.cropTop !== undefined) {
      params.set('--vision.top.refereehands.croptop', parameters.cropTop.toFixed(0));
    }
    if (parameters.cropBottom !== undefined) {
      params.set('--vision.top.refereehands.cropbottom', parameters.cropBottom.toFixed(0));
    }
    if (parameters.area !== undefined) {
      params.set('--vision.top.refereehands.area', parameters.area.toFixed(0));
    }

    return params;
  }
  public static toCommand(config: Map<string, string>): Commands {
    const argv: string[] = [];
    for (const [key, value] of config) {
      argv.push(...[key, value]);
    }
    return Commands.fromPartial({ argv });
  }
}
