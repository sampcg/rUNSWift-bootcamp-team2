import React, { useContext } from 'react';
import { CameraViewContext } from '../context/CameraViewContext';
import { Alert, AlertColor, Box } from '@mui/material';
import VideoLayersControl from './VideoLayersControl';
import StreamStats from './StreamStats/StreamStats';
import CameraViewer from './CameraViewer';
import { BlackboardContext } from '../context/BlackboardContext';
import { maskToFlags } from '../common/blackboard/utils';

export default function CameraViewGroup() {
  const cameraViewCtx = useContext(CameraViewContext);
  const blackboardCtx = useContext(BlackboardContext);

  const maskFlags = maskToFlags(blackboardCtx?.blackboard?.mask || 0);

  function getAlert() {
    let errorSeverity: AlertColor = 'warning';
    let errorMessages = [];

    if (!(maskFlags.blackboard || maskFlags.rawImage || maskFlags.saliency)) {
      if (blackboardCtx?.currentRobot == null) {
        errorMessages = ['No vision data is available. Import a dump or connect to a robot.'];
      } else {
        const robotName = blackboardCtx?.currentRobot.robotInfo.name;
        errorMessages = [
          `You are connected to ${robotName}, but no vision data is available. Make sure ${robotName} is stiffened!`,
        ];
      }

      errorSeverity = 'error';
    } else {
      if (!maskFlags.blackboard) {
        errorMessages.push('Blackboard stream is unavailable.');
      }

      if (!maskFlags.rawImage) {
        errorMessages.push('Raw camera stream is unavailable.');
      }

      if (!maskFlags.saliency) {
        errorMessages.push('Saliency camera stream is unavailable.');
      }
    }

    if (errorMessages.length === 0) {
      return null;
    }

    return (
      <Alert severity={errorSeverity}>
        {errorMessages.flatMap((msg) => {
          return [msg, <br />];
        })}
      </Alert>
    );
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '5px' }}>
        {getAlert()}

        <VideoLayersControl />
        {cameraViewCtx?.videoViewType != null ? (
          <CameraViewer
            enabledCameras={cameraViewCtx?.enabledCameras}
            videoViewType={cameraViewCtx?.videoViewType}
            showOverlay={cameraViewCtx?.showOverlay}
          />
        ) : null}
      </Box>
    </React.Fragment>
  );
}
