import React, { useContext } from 'react';
import { BlackboardContext } from '../context/BlackboardContext';
import { ListItem, ListItemText } from '@mui/material';
import CurrentRobot from './CurrentRobot';
import CurrentDump from './CurrentDump';

export default function CurrentStream() {
  const blackboardCtx = useContext(BlackboardContext);
  const activeRobotStream = !!blackboardCtx?.currentRobot;
  const activeDumpStream = !!blackboardCtx?.currentDump;
  let currentStreamControl = <ListItemText>Disconnected</ListItemText>;
  if (activeRobotStream) {
    currentStreamControl = <CurrentRobot />;
  } else if (activeDumpStream) {
    currentStreamControl = <CurrentDump />;
  }
  return (
    <React.Fragment>
      <ListItem>{currentStreamControl}</ListItem>
    </React.Fragment>
  );
}
