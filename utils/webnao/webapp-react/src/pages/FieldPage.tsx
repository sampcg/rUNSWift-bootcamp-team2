import React, { useContext } from 'react';
import Title from '../components/Title';
import { Stack } from '@mui/material';


export default function FieldPage() {
  return (
    <React.Fragment>
      <Title>Field</Title>
      <Stack direction='row' style={{ width: '100%', height: '100vh', padding: '20px' }}>
      {/* <SoccerField></SoccerField> */}
      </Stack>
      
    </React.Fragment>
  );
}
