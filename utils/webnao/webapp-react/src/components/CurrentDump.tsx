import React, { useContext } from 'react';
import { BlackboardContext, DumpControlState } from '../context/BlackboardContext';
import { Box, IconButton, ListItem, ListItemText } from '@mui/material';
import { TeamContext } from '../context/TeamContext';
import { Close, PauseCircle, PlayCircle, SkipNext, SkipPrevious } from '@mui/icons-material';

export default function CurrentDump() {
  const teamData = useContext(TeamContext);
  const blackboardCtx = useContext(BlackboardContext);
  const currentDump = blackboardCtx?.currentDump;
  const currentDumpInfo = teamData?.dumpState.find((r) => r.path === currentDump?.dumpInfo.path);
  const disconnect = () => {
    blackboardCtx?.disconnect();
  };
  const pause = () => {
    blackboardCtx?.controlDumpStream({ action: 'pause' });
  };
  const resume = () => {
    blackboardCtx?.controlDumpStream({ action: 'play' });
  };
  const previous = () => {
    blackboardCtx?.controlDumpStream({ action: 'previous' });
  };
  const next = () => {
    blackboardCtx?.controlDumpStream({ action: 'next' });
  };
  const dumpName = currentDumpInfo?.name || currentDumpInfo?.path.split(/(\\|\/)/g).pop();
  let controlButtons: React.JSX.Element[] = [];
  if (blackboardCtx?.dumpControlState === DumpControlState.playing) {
    controlButtons = [
      <IconButton edge="start" color="inherit" aria-label="pause" onClick={pause}>
        <PauseCircle />
      </IconButton>,
    ];
  } else {
    controlButtons = [
      <IconButton edge="start" color="inherit" aria-label="previous" onClick={previous}>
        <SkipPrevious />
      </IconButton>,
      <IconButton edge="start" color="inherit" aria-label="resume" onClick={resume}>
        <PlayCircle />
      </IconButton>,
      <IconButton edge="start" color="inherit" aria-label="next" onClick={next}>
        <SkipNext />
      </IconButton>,
    ];
  }
  return (
    <React.Fragment>
      <ListItem>
        {currentDumpInfo ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
              <IconButton edge="start" color="inherit" aria-label="disconnect" onClick={disconnect}>
                <Close />
              </IconButton>{' '}
              {dumpName}
            </div>
            {currentDumpInfo.teamInfo ? (
              <div>
                T{currentDumpInfo.teamInfo?.teamNumber} P{currentDumpInfo.teamInfo?.playerNumber}
              </div>
            ) : null}
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>{controlButtons}</Box>
          </Box>
        ) : (
          <ListItemText>Disconnected</ListItemText>
        )}
      </ListItem>
    </React.Fragment>
  );
}
