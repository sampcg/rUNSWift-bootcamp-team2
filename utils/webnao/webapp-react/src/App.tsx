import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Dashboard from './components/Dashboard';
import { TeamContext, TeamContextProvider } from './context/TeamContext';
import { BlackboardContextProvider } from './context/BlackboardContext';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://runswift.readthedocs.io/">
        rUNSWift
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  const hostname = window.location.hostname;
  const teamServerPort = 8081;
  return (
    <TeamContextProvider serverHostname={hostname} serverPort={teamServerPort}>
      <BlackboardContextProvider>
        <Dashboard />
      </BlackboardContextProvider>
    </TeamContextProvider>
  );
}
