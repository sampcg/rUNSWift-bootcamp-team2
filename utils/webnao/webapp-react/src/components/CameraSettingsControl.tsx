import React, { ChangeEvent, SyntheticEvent, useContext, useState } from 'react';
import { Alert, Checkbox, Slider, Stack, TextField, debounce } from '@mui/material';
import { BlackboardContext } from '../context/BlackboardContext';
import { Configurator } from '../common/models/configurator';
import { CameraSettings } from '../common/models/cameraSettings';
import { CameraSetting } from '../common/models/cameraSettings';
import { CameraInstance, cameraInstanceId } from '../common/models/cameraFrame';
interface CameraControlsProps {
  camera: CameraInstance;
}
export default function CameraSettingsControl({ camera }: CameraControlsProps) {
  const blackboardStream = useContext(BlackboardContext);

  // current value of the blackboard settings
  const remoteSettings =
    camera === CameraInstance.top
      ? blackboardStream?.blackboard?.vision?.topCameraSettings
      : blackboardStream?.blackboard?.vision?.botCameraSettings;

  // local settings states, initialised from remote settings on the first time
  const [brightness, setBrightness] = useState<number>(
    remoteSettings?.brightness || CameraSettings.brightness.range[1],
  );
  const [gain, setGain] = useState<number>(remoteSettings?.gain || CameraSettings.gain.range[1]);
  const [contrast, setContrast] = useState<number>(remoteSettings?.contrast || CameraSettings.contrast.range[1]);
  const [exposure, setExposure] = useState<number>(remoteSettings?.exposure || CameraSettings.exposure.range[1]);
  const [saturation, setSaturation] = useState<number>(
    remoteSettings?.saturation || CameraSettings.saturation.range[1],
  );
  const [exposureAuto, setExposureAuto] = useState<number>(remoteSettings?.exposureAuto || 0);
  const [exposureEnabled, setExposureEnabled] = useState<boolean>(exposureAuto === 1);
  const [backlightCompensation, setBacklightCompensation] = useState<number>(
    remoteSettings?.backlightCompensation || CameraSettings.backlightCompensation.range[1],
  );

  const [isDesyncedDueToUpload, setDesyncedDueToUpload] = useState<boolean>(false);

  const isReadonly = false && !blackboardStream?.streamProperties?.isLive;

  const uploadCameraSettings: () => Promise<void> = async () => {
    setDesyncedDueToUpload(true);
    try {
      const configMap = new Map<CameraSetting, number>([
        [CameraSettings.brightness, brightness],
        [CameraSettings.contrast, contrast],
        [CameraSettings.gain, gain],
        [CameraSettings.exposure, exposure],
        [CameraSettings.saturation, saturation],
        [CameraSettings.backlightCompensation, backlightCompensation],
      ]);

      if (!exposureEnabled) {
        configMap.delete(CameraSettings.exposure);
      } else {
        configMap.delete(CameraSettings.backlightCompensation);
      }

      // await new Promise(resolve => setTimeout(resolve, 2000));
      const configItem = Configurator.configureCameraSettings(cameraInstanceId(camera), configMap);

      const config = new Map<string, string>();
      config.set(...configItem);
      const command = Configurator.toCommand(config);

      blackboardStream?.sendCommand(command);
    } catch (e) {
      console.error(e);
    }
  };

  const onSettingChange = (setting: keyof typeof CameraSettings, newValue: number) => {
    switch (setting) {
      case 'brightness':
        setBrightness(newValue);
        break;
      case 'contrast':
        setContrast(newValue);
        break;
      case 'exposure':
        setExposure(newValue);
        break;
      case 'gain':
        setGain(newValue);
        break;
      case 'saturation':
        setSaturation(newValue);
        break;
      case 'backlightCompensation':
        setBacklightCompensation(newValue);
        break;
      default:
        break;
    }
  };

  function onSliderChange(setting: keyof typeof CameraSettings) {
    return (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
      if (typeof newValue === 'number') {
        onSettingChange(setting, newValue);
      }
    };
  }

  function areCameraSettingsSynced(): boolean {
    if (remoteSettings == null) {
      return false;
    }

    if (brightness != remoteSettings.brightness) {
      return false;
    }

    if (contrast != remoteSettings.contrast) {
      return false;
    }

    if (gain != remoteSettings.gain) {
      return false;
    }

    if (exposure != remoteSettings.exposure) {
      return false;
    }

    if (saturation != remoteSettings.saturation) {
      return false;
    }

    if (backlightCompensation != remoteSettings.backlightCompensation) {
      return false;
    }

    if (exposureAuto != remoteSettings.exposureAuto) {
      return false;
    }

    // we are synced, so clear the desynced flag
    if (isDesyncedDueToUpload) {
      setDesyncedDueToUpload(false);
    }

    return true;
  }

  return (
    <React.Fragment>
      <Stack direction="column">
        <h3 style={{ textTransform: 'capitalize' }}>{camera} Camera</h3>

        <Stack direction="column">
          Brightness: {brightness}
          <Stack spacing={2} direction="row">
            <div>{CameraSettings.brightness.range[1]}</div>
            <Slider
              value={brightness}
              disabled={isDesyncedDueToUpload || isReadonly}
              min={CameraSettings.brightness.range[1]}
              max={CameraSettings.brightness.range[0]}
              onChange={onSliderChange('brightness')}
              onChangeCommitted={uploadCameraSettings}
            />
            <div>{CameraSettings.brightness.range[0]}</div>
          </Stack>
        </Stack>
        <Stack direction="column">
          Gain: {gain}
          <Stack spacing={2} direction="row">
            <div>{CameraSettings.gain.range[1]}</div>
            <Slider
              value={gain}
              disabled={isDesyncedDueToUpload || isReadonly}
              min={CameraSettings.gain.range[1]}
              step={25}
              marks={true}
              max={CameraSettings.gain.range[0]}
              onChange={onSliderChange('gain')}
              onChangeCommitted={uploadCameraSettings}
            />
            <div>{CameraSettings.gain.range[0]}</div>
          </Stack>
        </Stack>
        <Stack direction="column">
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            Exposure: {exposure}{' '}
            <Checkbox
              disabled={exposureAuto === 1}
              checked={exposureEnabled}
              onChange={(e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
                setExposureEnabled(checked);
                uploadCameraSettings();
              }}
            />
          </Stack>
          <Stack spacing={2} direction="row">
            <div>{CameraSettings.exposure.range[1]}</div>
            <Slider
              value={exposure}
              disabled={isDesyncedDueToUpload || isReadonly || !exposureEnabled}
              step={10}
              marks={true}
              min={CameraSettings.exposure.range[1]}
              max={CameraSettings.exposure.range[0]}
              onChange={onSliderChange('exposure')}
              onChangeCommitted={uploadCameraSettings}
            />
            <div>{CameraSettings.exposure.range[0]}</div>
          </Stack>
        </Stack>
        <Stack direction="column">
          Contrast: {contrast}
          <Stack spacing={2} direction="row">
            <div>{CameraSettings.contrast.range[1]}</div>
            <Slider
              value={contrast}
              min={CameraSettings.contrast.range[1]}
              step={10}
              marks={true}
              max={CameraSettings.contrast.range[0]}
              disabled={isDesyncedDueToUpload || isReadonly}
              onChange={onSliderChange('contrast')}
              onChangeCommitted={uploadCameraSettings}
            />

            <div>{CameraSettings.contrast.range[0]}</div>
          </Stack>
        </Stack>
        <Stack direction="column">
          Saturation: {saturation}
          <Stack spacing={2} direction="row">
            <div>{CameraSettings.saturation.range[1]}</div>
            <Slider
              value={saturation}
              min={CameraSettings.saturation.range[1]}
              max={CameraSettings.saturation.range[0]}
              step={10}
              marks={true}
              disabled={isDesyncedDueToUpload || isReadonly}
              onChange={onSliderChange('saturation')}
              onChangeCommitted={uploadCameraSettings}
            />

            <div>{CameraSettings.saturation.range[0]}</div>
          </Stack>
        </Stack>
        <Stack direction="column">
          Backlight compensation: {backlightCompensation}
          <Stack spacing={2} direction="row">
            <div>{CameraSettings.backlightCompensation.range[1]}</div>
            <Slider
              value={backlightCompensation}
              min={CameraSettings.backlightCompensation.range[1]}
              max={CameraSettings.backlightCompensation.range[0]}
              step={1}
              marks={true}
              disabled={isDesyncedDueToUpload || isReadonly || !exposureAuto}
              onChange={onSliderChange('backlightCompensation')}
              onChangeCommitted={uploadCameraSettings}
            />

            <div>{CameraSettings.backlightCompensation.range[0]}</div>
          </Stack>
        </Stack>

        {isReadonly ? (
          <Alert severity="info">Read only stream</Alert>
        ) : !areCameraSettingsSynced() ? (
          isDesyncedDueToUpload ? (
            <Alert severity="info">Uploading to robot...</Alert>
          ) : (
            <Alert severity="info">Local changes</Alert>
          )
        ) : (
          <Alert severity="success">Settings synced</Alert>
        )}
      </Stack>
    </React.Fragment>
  );
}
