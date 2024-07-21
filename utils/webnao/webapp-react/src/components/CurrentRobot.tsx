import React, { useContext } from 'react';
import { BlackboardContext } from '../context/BlackboardContext';
import { Box, IconButton, ListItem, ListItemText } from '@mui/material';
import { TeamContext } from '../context/TeamContext';
import BatteryLevel from './BatteryLevel';
import { Close } from '@mui/icons-material';

export default function CurrentRobot() {
  const teamData = useContext(TeamContext);
  const blackboardCtx = useContext(BlackboardContext);
  const currentRobot = blackboardCtx?.currentRobot;
  const currentRobotInfo = teamData?.robotState.find((r) => r.name === currentRobot?.robotInfo.name);
  const disconnect = () => {
    blackboardCtx?.disconnect();
  };
  return (
    <React.Fragment>
      <ListItem>
        {currentRobotInfo ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div>
              {currentRobot?.robotInfo.name} T
              {currentRobot?.robotInfo.blackboardSnapshot?.gameController?.ourTeam?.teamNumber}P
              {currentRobot?.robotInfo.blackboardSnapshot?.gameController?.playerNumber}{' '}
            </div>
            <BatteryLevel batteryPercentage={currentRobotInfo?.batteryPercentage} />
            <IconButton
              edge="start"
              color="inherit"
              aria-label="disconnect"
              onClick={disconnect}
              sx={{
                marginRight: '36px',
              }}
            >
              <Close />
            </IconButton>
          </Box>
        ) : (
          <ListItemText>Disconnected</ListItemText>
        )}
      </ListItem>
    </React.Fragment>
  );
}
