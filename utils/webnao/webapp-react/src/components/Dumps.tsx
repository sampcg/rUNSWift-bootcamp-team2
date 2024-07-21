import React, { useContext } from 'react';
import Title from './Title';
import { Box } from '@mui/material';
import { TeamContext } from '../context/TeamContext';
import { Button } from '@mui/base';
import DumpCard from './DumpCard';

export default function Dumps() {
  const teamData = useContext(TeamContext);
  const getDumps = async () => {
    const res = await teamData?.sendRequest({
      requestPath: '/dumps',
      nonce: new Date().getTime(),
      requestParams: {},
    });
    console.log('res ', res?.response);
  };
  return (
    <React.Fragment>
      <Title>Dumps</Title>

      <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', flexGrow: 1 }}>
        {teamData?.dumpState.map((dump) => <DumpCard dump={dump} key={dump.path} />)}
      </Box>
      <Button onClick={getDumps}>Load</Button>
    </React.Fragment>
  );
}
