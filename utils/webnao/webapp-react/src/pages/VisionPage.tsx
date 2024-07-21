import { Box } from '@mui/material';
import React from 'react';
import CameraControlGroup from '../components/CameraControlGroup';
import CameraViewGroup from '../components/CameraViewGroup';
import DumpPlayerControl from '../components/DumpPlayerControl';
import Title from '../components/Title';

export default function VisionPage() {
  return (
    <React.Fragment>
      <DumpPlayerControl />
      <Title>Vision</Title>
      <Box
        sx={{ display: 'flex', width: '100%', flexDirection: 'row', padding: '5px', justifyContent: 'space-between' }}
      >
        <CameraControlGroup />
        <Box sx={{ flexGrow: 1 }}>
          <CameraViewGroup />
        </Box>
      </Box>
    </React.Fragment>
  );
}
