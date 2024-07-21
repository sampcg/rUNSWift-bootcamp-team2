import React, { ChangeEvent, useContext, useState } from 'react';
import { Alert, Slider, Stack, TextField, debounce } from '@mui/material';
import { VisionDetectorContext, VisionDetectorSetting } from '../context/VisionDetectorContext';
import { Configurator } from '../common/models/configurator';
import { Vision_RefereeHandDetectorSettings } from '../common/blackboard/definitions/Blackboard';
import { BlackboardContext } from '../context/BlackboardContext';

export default function VisionDetectorControl() {
const detectorContext = useContext(VisionDetectorContext);
  const [busy, setBusy] = useState<boolean>(false);
  const blackboardStream = useContext(BlackboardContext);

  // current value of the blackboard settings
  const remoteSettings = blackboardStream?.blackboard?.vision?.refereeHandDetectorSettings;

  const [handMinHDistance, setHandMinHDistance] = useState<number | undefined>(remoteSettings?.handMinHDistance);
  const [handMaxHDistance, setHandMaxHDistance] = useState<number | undefined>(remoteSettings?.handMaxHDistance);
  const [handMinVDistance, setHandMinVDistance] = useState<number | undefined>(remoteSettings?.handMinVDistance);
  const [handMaxVDistance, setHandMaxVDistance] = useState<number | undefined>(remoteSettings?.handMaxVDistance);
  const [cropLeft, setCropLeft] = useState<number | undefined>(remoteSettings?.cropLeft);
  const [cropRight, setCropRight] = useState<number | undefined>(remoteSettings?.cropRight);
  const [cropTop, setCropTop] = useState<number | undefined>(remoteSettings?.cropTop);
  const [cropBottom, setCropBottom] = useState<number | undefined>(remoteSettings?.cropBottom);
  const [enabled, setEnabled] = useState<number | undefined>(remoteSettings?.enabled);
  const [area, setArea] = useState<number | undefined>(remoteSettings?.area);
  
  const [isDesyncedDueToUpload, setDesyncedDueToUpload] = useState<boolean>(false);
  const isReadonly = false && !blackboardStream?.streamProperties?.isLive;

  const uploadDetectorSettings: () => Promise<void> = async () => {
    setDesyncedDueToUpload(true);
    try {
      const settings: Partial<Vision_RefereeHandDetectorSettings> = {
        handMinHDistance,
        handMaxHDistance,
        handMinVDistance,
        handMaxVDistance,
        cropLeft,
        cropRight,
        cropTop,
        cropBottom,
        enabled,
        area
      };

      // await new Promise(resolve => setTimeout(resolve, 2000));
      const config = Configurator.configureRefereeDetectionSettings(settings);

      const command = Configurator.toCommand(config);

      blackboardStream?.sendCommand(command);
    } catch (e) {
      console.error(e);
    }
  };

  const onSettingChange = (setting: keyof Vision_RefereeHandDetectorSettings, newValue: number) => {
    switch (setting) {
        case 'handMinHDistance': {
            setHandMinHDistance(newValue);
        }
        break;
        case 'handMaxHDistance': {
            setHandMaxHDistance(newValue);
        }
        break;
        case 'handMinVDistance': {
            setHandMinVDistance(newValue);
        }
        break;
        case 'handMaxVDistance': {
            setHandMaxVDistance(newValue);
        }
        break;
        case 'cropLeft': {
            setCropLeft(newValue);
        }
        break;
        case 'cropRight': {
            setCropRight(newValue);
        }
        break;
        case 'cropTop': {
            setCropTop(newValue);
        }
        break;
        case 'cropBottom': {
            setCropBottom(newValue);
        }
        break;
        case 'enabled': {
            setEnabled(newValue);
        }
        break;
        case 'area': {
            setArea(newValue);
        }
        break;
        default:
        break;
      
    }
  };
  const onSliderChange = (settingName: keyof Vision_RefereeHandDetectorSettings) =>  (event: Event, newValue: number | number[]) => {
    if (typeof(newValue) === 'number') {
      onSettingChange(settingName, newValue);
    }
  };
  function areDetectorSettingsSynced(): boolean {
    if (!remoteSettings) {
      return false;
    }

    if (handMinHDistance !== remoteSettings.handMinHDistance) { return false; }
    if (handMaxHDistance !== remoteSettings.handMaxHDistance) { return false; }
    if (handMinVDistance !== remoteSettings.handMinVDistance) { return false; }
    if (handMaxVDistance !== remoteSettings.handMaxVDistance) { return false; }
    if (cropLeft !== remoteSettings.cropLeft) { return false; }
    if (cropRight !== remoteSettings.cropRight) { return false; }
    if (cropTop !== remoteSettings.cropTop) { return false; }
    if (cropBottom !== remoteSettings.cropBottom) { return false; }
    if (enabled !== remoteSettings.enabled) { return false; }
    if (area !== remoteSettings.area) { return false; }

    // we are synced, so clear the desynced flag
    if (isDesyncedDueToUpload) {
      setDesyncedDueToUpload(false);
    }

    return true;
  }
  return (
    <React.Fragment>
      <Stack direction='column'>
        <h3 style={{textTransform: 'capitalize'}}>Detector: {detectorContext.visionDetector}</h3>
        <Stack direction='column'>
        <Stack direction="column">
            handMinHDistance : {handMinHDistance }
            <Stack spacing={2} direction="row">
                <Slider
                value={handMinHDistance }
                disabled={isDesyncedDueToUpload || isReadonly}
                min={0}
                max={1500}
                onChange={onSliderChange('handMinHDistance')}
                onChangeCommitted={uploadDetectorSettings}
                />
            </Stack>
        </Stack>

        <Stack direction="column">
            handMaxHDistance : {handMaxHDistance }
            <Stack spacing={2} direction="row">
                <Slider
                value={handMaxHDistance }
                disabled={isDesyncedDueToUpload || isReadonly}
                min={0}
                max={1500}
                onChange={onSliderChange('handMaxHDistance')}
                onChangeCommitted={uploadDetectorSettings}
                />
            </Stack>
        </Stack>

        <Stack direction="column">
            handMinVDistance : {handMinVDistance }
            <Stack spacing={2} direction="row">
                <Slider
                value={handMinVDistance }
                disabled={isDesyncedDueToUpload || isReadonly}
                min={0}
                max={1500}
                onChange={onSliderChange('handMinVDistance')}
                onChangeCommitted={uploadDetectorSettings}
                />
            </Stack>
        </Stack>

        <Stack direction="column">
            handMaxVDistance : {handMaxVDistance }
            <Stack spacing={2} direction="row">
                <Slider
                value={handMaxVDistance }
                disabled={isDesyncedDueToUpload || isReadonly}
                min={0}
                max={1500}
                onChange={onSliderChange('handMaxVDistance')}
                onChangeCommitted={uploadDetectorSettings}
                />
            </Stack>
        </Stack>

        <Stack direction="column">
            cropLeft : {cropLeft }
            <Stack spacing={2} direction="row">
                <Slider
                value={cropLeft }
                disabled={isDesyncedDueToUpload || isReadonly}
                min={0}
                max={1500}
                onChange={onSliderChange('cropLeft')}
                onChangeCommitted={uploadDetectorSettings}
                />
            </Stack>
        </Stack>

        <Stack direction="column">
            cropRight : {cropRight }
            <Stack spacing={2} direction="row">
                <Slider
                value={cropRight }
                disabled={isDesyncedDueToUpload || isReadonly}
                min={0}
                max={1500}
                onChange={onSliderChange('cropRight')}
                onChangeCommitted={uploadDetectorSettings}
                />
            </Stack>
        </Stack>

        <Stack direction="column">
            cropTop : {cropTop }
            <Stack spacing={2} direction="row">
                <Slider
                value={cropTop }
                disabled={isDesyncedDueToUpload || isReadonly}
                min={0}
                max={1500}
                onChange={onSliderChange('cropTop')}
                onChangeCommitted={uploadDetectorSettings}
                />
            </Stack>
        </Stack>

        <Stack direction="column">
            cropBottom: {cropBottom}
            <Stack spacing={2} direction="row">
                <Slider
                value={cropBottom}
                disabled={isDesyncedDueToUpload || isReadonly}
                min={0}
                max={1500}
                onChange={onSliderChange('cropBottom')}
                onChangeCommitted={uploadDetectorSettings}
                />
            </Stack>
        </Stack>
        <Stack direction="column">
            min red area: {area}
            <Stack spacing={2} direction="row">
                <Slider
                value={area}
                disabled={isDesyncedDueToUpload || isReadonly}
                min={1}
                max={1500}
                onChange={onSliderChange('area')}
                onChangeCommitted={uploadDetectorSettings}
                />
            </Stack>
        </Stack>

          {/* { // TODO this would be nicer
            (detectorContext.settings as VisionDetectorSetting<keyof Vision_RefereeHandDetectorSettings>[]).map(setting => {
              return (
                <>{setting.name}: {setting.value}
                <Stack spacing={2} direction='row'>
                  {
                  }
                  <div>{setting.min}</div>
                  <Slider 
                    value={setting.value} 
                    disabled={busy}
                    min={setting.min}
                    max={setting.max}
                    onChange={onSliderChange(setting.name)}
                    ></Slider>
                  <div>{setting.max}</div>
                </Stack></>
              );
            })
          } */}
        </Stack>
      </Stack>
      {
        !enabled && (<Alert severity="warning">Detector is disabled</Alert>)
      }
      {isReadonly ? (
          <Alert severity="info">Read only stream</Alert>
        ) : !areDetectorSettingsSynced() ? (
          isDesyncedDueToUpload ? (
            <Alert severity="info">Uploading to robot...</Alert>
          ) : (
            <Alert severity="info">Local changes</Alert>
          )
        ) : (
          <Alert severity="success">Settings synced</Alert>
        )}
    </React.Fragment>
  );
}
