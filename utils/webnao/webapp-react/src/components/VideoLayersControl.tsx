import { ArrowDownward, ArrowUpward, CameraEnhance, CameraFront, FeaturedVideo } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import { CameraInstance } from '../common/models/cameraFrame';
import { VideoViewType } from './CameraView';
import { CameraViewContext } from '../context/CameraViewContext';
import { BlackboardContext } from '../context/BlackboardContext';
import { maskToFlags } from '../common/blackboard/utils';

export default function VideoLayersControl() {
  const cameraViewCtx = useContext(CameraViewContext);
  const blackboardStream = useContext(BlackboardContext);

  const maskFlags = maskToFlags(blackboardStream?.blackboard?.mask || 0);
  const videoStreamAvailable = maskFlags.rawImage || maskFlags.saliency;

  function isCameraEnabled(camera: CameraInstance): boolean {
    // does the enabledCameras list contain the `which` camera?
    return !!cameraViewCtx?.enabledCameras.find((c) => c == camera);
  }

  function setCameraEnabled(camera: CameraInstance, enabled: boolean) {
    if (cameraViewCtx == null) {
      return;
    }

    let newEnabledCameras: CameraInstance[] = [];

    if (enabled) {
      if (!isCameraEnabled(camera)) {
        // if the enabled cameras list doesn't contain the camera we want,
        // append it via list comprehension
        newEnabledCameras = [...cameraViewCtx.enabledCameras, camera];
      }
    } else {
      // remove top
      newEnabledCameras = cameraViewCtx.enabledCameras.filter((c) => c != camera);
    }

    // perform the state update
    // warning: does NOT immediately update the value of cameraViewCtx.enabledCameras
    // so do not use it in this function below this line
    cameraViewCtx.setEnabledCameras(newEnabledCameras);

    if (newEnabledCameras.length === 0) {
      // no enabled cameras
      return;
    }

    if (cameraViewCtx.videoViewType) {
      // videoViewType already set
      return;
    }

    if (maskFlags.rawImage) {
      cameraViewCtx.setVideoViewType(VideoViewType.camera);
    } else if (maskFlags.saliency) {
      cameraViewCtx.setVideoViewType(VideoViewType.salience);
    }
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch value={isCameraEnabled(CameraInstance.top)} />}
          onChange={(_, isOn) => setCameraEnabled(CameraInstance.top, isOn)}
          disabled={!videoStreamAvailable}
          label={'Show Top Camera'}
        />

        <FormControlLabel
          control={<Switch value={isCameraEnabled(CameraInstance.bottom)} />}
          onChange={(_, isOn) => setCameraEnabled(CameraInstance.bottom, isOn)}
          disabled={!videoStreamAvailable}
          label={'Show Bottom Camera'}
        />

        <FormControlLabel
          control={<Switch checked={cameraViewCtx?.showOverlay} />}
          disabled={!maskFlags.blackboard}
          onChange={(_, isOn) => cameraViewCtx?.setShowOverlay(isOn)}
          label={'Overlay CV'}
        />

        <Typography
          sx={{
            color: (theme) => (videoStreamAvailable ? theme.palette.text.primary : theme.palette.text.disabled),
            paddingRight: 1,
          }}
        >
          View Layer
        </Typography>

        <Select
          value={cameraViewCtx?.videoViewType ?? VideoViewType.salience}
          disabled={!videoStreamAvailable}
          onChange={(event, _) => cameraViewCtx?.setVideoViewType(event.target.value as VideoViewType)}
        >
          <MenuItem value={VideoViewType.camera} disabled={!maskFlags.rawImage}>
            Camera
          </MenuItem>
          <MenuItem value={VideoViewType.salience} disabled={!maskFlags.saliency}>
            Saliency
          </MenuItem>
        </Select>
      </Box>
    </React.Fragment>
  );
}
