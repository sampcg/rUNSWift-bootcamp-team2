import React from 'react';
import Title from '../components/Title';
import { Stack } from '@mui/material';
import RobotScene from '../components/RobotViewer';
import { RobotModelProvider } from '../context/RobotModelContext';


export default function RobotPage() {
  const urdfPath = '/assets/softbank/nao.urdf';
  
  return (
    <React.Fragment>
      <Title>Kinematics</Title>
      <Stack direction='row' style={{ width: '100%', height: '100vh', padding: '20px' }}>
      <RobotModelProvider urdfPath={urdfPath}>
        <RobotScene urdfPath={urdfPath} />
      </RobotModelProvider>
      {/* <SoccerField></SoccerField> */}
      </Stack>
    </React.Fragment>
  );
}
