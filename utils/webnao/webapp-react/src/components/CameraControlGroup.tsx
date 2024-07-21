import React, { useContext } from 'react';
import { CameraViewContext } from '../context/CameraViewContext';
import CameraSettingsControl from './CameraSettingsControl';
import { Box, Typography } from '@mui/material';
import VisionDetectorControl from './VisionDetectorControl';

export default function CameraControlGroup() {
  const cameraViewCtx = useContext(CameraViewContext);
  const cameraControls = cameraViewCtx?.enabledCameras.map((camera) => (
    <CameraSettingsControl key={camera} camera={camera}></CameraSettingsControl>
  ));

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '5px', minWidth: '300px' }}>
        <Typography component="h4" variant="h6" color="primary" gutterBottom>
          Controls
        </Typography>
        {cameraControls}
        <VisionDetectorControl/>
      </Box>
    </React.Fragment>
  );
}
