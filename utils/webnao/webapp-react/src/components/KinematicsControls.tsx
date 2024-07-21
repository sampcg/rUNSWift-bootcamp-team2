import React, { useContext, useState } from 'react';
import { Slider, Stack, debounce } from '@mui/material';
import { BlackboardContext } from '../context/BlackboardContext';
import { Configurator } from '../common/models/configurator';
import { CameraSettings } from '../common/models/cameraSettings';
import { CameraSetting } from '../common/models/cameraSettings';
import { CameraInstance, cameraInstanceId } from '../common/models/cameraFrame';
import { Kinematics_Parameters } from '../common/blackboard/definitions/Blackboard';

interface CameraControlsProps {
  camera: CameraInstance;
}
export default function KinematicsControls() {
  const blackboardStream = useContext(BlackboardContext);
  const currentSettings = blackboardStream?.blackboard?.kinematics?.parameters;
  const kinematicsSettings: Required<Kinematics_Parameters> = {
    cameraPitchTop: currentSettings?.cameraPitchTop || 0,
    cameraYawTop: currentSettings?.cameraYawTop || 0,
    cameraRollTop: currentSettings?.cameraRollTop || 0,
    cameraYawBottom: currentSettings?.cameraYawBottom || 0,
    cameraPitchBottom: currentSettings?.cameraPitchBottom || 0,
    cameraRollBottom: currentSettings?.cameraRollBottom || 0,
    bodyPitch: currentSettings?.bodyPitch || 0,
  };
  const [cameraPitchTop, setCameraPitchTop] = useState<number>(kinematicsSettings.cameraPitchTop);
  const [cameraYawTop, setCameraYawTop] = useState<number>(kinematicsSettings.cameraYawTop);
  const [cameraRollTop, setCameraRollTop] = useState<number>(kinematicsSettings.cameraRollTop);
  const [cameraYawBottom, setCameraYawBottom] = useState<number>(kinematicsSettings.cameraYawBottom);
  const [cameraPitchBottom, setCameraPitchBottom] = useState<number>(kinematicsSettings.cameraPitchBottom);
  const [cameraRollBottom, setCameraRollBottom] = useState<number>(kinematicsSettings.cameraRollBottom);
  const [bodyPitch, setBodyPitch] = useState<number>(kinematicsSettings.bodyPitch);

  const [busy, setBusy] = useState<boolean>(false);

  // TODO: add debounce
  const updateKinematicsSettings: () => Promise<void> = debounce(async () => {
    setBusy(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const configItems = Configurator.configureKinematicsParameters(kinematicsSettings);
      const config = new Map<string, string>();
      for (const configItem of configItems) {
        config.set(...configItem);
      }
      const command = Configurator.toCommand(config);
      blackboardStream?.sendCommand(command);
    } finally {
      setTimeout(() => setBusy(false), 4000);
    }
  }, 2000);

  const onCameraPitchTopChange = async (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setCameraPitchTop(newValue);
      kinematicsSettings.cameraPitchTop = newValue;
      await updateKinematicsSettings();
    }
  };
  const onCameraYawTopChange = async (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setCameraYawTop(newValue);
      kinematicsSettings.cameraYawTop = newValue;
      await updateKinematicsSettings();
    }
  };
  const onCameraRollTopChange = async (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setCameraRollTop(newValue);
      kinematicsSettings.cameraRollTop = newValue;
      await updateKinematicsSettings();
    }
  };
  const onCameraYawBottomChange = async (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setCameraYawBottom(newValue);
      kinematicsSettings.cameraYawBottom = newValue;
      await updateKinematicsSettings();
    }
  };
  const onCameraPitchBottomChange = async (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setCameraPitchBottom(newValue);
      kinematicsSettings.cameraPitchBottom = newValue;
      await updateKinematicsSettings();
    }
  };
  const onCameraRollBottomChange = async (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setCameraRollBottom(newValue);
      kinematicsSettings.cameraRollBottom = newValue;
      await updateKinematicsSettings();
    }
  };
  const onBodyPitchChange = async (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setBodyPitch(newValue);
      kinematicsSettings.bodyPitch = newValue;
      await updateKinematicsSettings();
    }
  };

  return (
    <React.Fragment>
      <Stack direction="column">
        <h3> Parameters</h3>
        <Stack direction="column">
          CameraPitchTop: {cameraPitchTop}
          <Stack spacing={2} direction="row">
            <Slider
              value={cameraPitchTop}
              disabled={busy}
              min={-5}
              max={5}
              step={0.2}
              onChange={onCameraPitchTopChange}
            ></Slider>
          </Stack>
        </Stack>
        <Stack direction="column">
          CameraYawTop: {cameraYawTop}
          <Stack spacing={2} direction="row">
            <Slider
              value={cameraYawTop}
              disabled={busy}
              min={-5}
              max={5}
              step={0.2}
              onChange={onCameraYawTopChange}
            ></Slider>
          </Stack>
        </Stack>
        <Stack direction="column">
          CameraRollTop: {cameraRollTop}
          <Stack spacing={2} direction="row">
            <Slider
              value={cameraRollTop}
              disabled={busy}
              min={-5}
              max={5}
              step={0.2}
              onChange={onCameraRollTopChange}
            ></Slider>
          </Stack>
        </Stack>
        <Stack direction="column">
          CameraYawBottom: {cameraYawBottom}
          <Stack spacing={2} direction="row">
            <Slider
              value={cameraYawBottom}
              disabled={busy}
              min={-5}
              max={5}
              step={0.2}
              onChange={onCameraYawBottomChange}
            ></Slider>
          </Stack>
        </Stack>
        <Stack direction="column">
          CameraPitchBottom: {cameraPitchBottom}
          <Stack spacing={2} direction="row">
            <Slider
              value={cameraPitchBottom}
              disabled={busy}
              min={-5}
              max={5}
              step={0.2}
              onChange={onCameraPitchBottomChange}
            ></Slider>
          </Stack>
        </Stack>
        <Stack direction="column">
          CameraRollBottom: {cameraRollBottom}
          <Stack spacing={2} direction="row">
            <Slider
              value={cameraRollBottom}
              disabled={busy}
              min={-5}
              max={5}
              step={0.2}
              onChange={onCameraRollBottomChange}
            ></Slider>
          </Stack>
        </Stack>
        <Stack direction="column">
          BodyPitch: {bodyPitch}
          <Stack spacing={2} direction="row">
            <Slider value={bodyPitch} disabled={busy} min={-5} max={5} step={0.2} onChange={onBodyPitchChange}></Slider>
          </Stack>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
