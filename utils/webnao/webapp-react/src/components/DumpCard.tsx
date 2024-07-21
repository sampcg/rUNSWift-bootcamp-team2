import React, { useContext } from 'react';
import { BlackboardContext } from '../context/BlackboardContext';
import { Box, IconButton } from '@mui/material';
import { TeamContext } from '../context/TeamContext';
import { DumpRobotInfo } from '~/common/models/robotsInfo';
import { PlayArrow } from '@mui/icons-material';

interface DumpCardProps {
  dump: DumpRobotInfo;
}

export default function DumpCard({ dump }: DumpCardProps) {
  const teamData = useContext(TeamContext);
  const blackboardCtx = useContext(BlackboardContext);
  type connectionHandler = (dumpInfo: DumpRobotInfo) => () => Promise<void>;
  const dumpName = dump.name || dump.path.split(/(\\|\/)/g).pop();
  const play: connectionHandler = (dumpInfo: DumpRobotInfo) => async () => {
    if (teamData) {
      const endpoint = await teamData?.getDumpConnectionEndpoint(dumpInfo.path);
      blackboardCtx?.switchToDump(dumpInfo, endpoint);
    }
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '5px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <div>{dumpName}</div>
          {dump.teamInfo ? (
            <div>
              T{dump.teamInfo?.teamNumber} P{dump.teamInfo?.playerNumber}
            </div>
          ) : null}
          {dump.timestamps ? (
            <div>
              {new Date(dump.timestamps[0] / 1000).toLocaleDateString()}{' '}
              {new Date(dump.timestamps[0] / 1000).toLocaleTimeString()}
            </div>
          ) : null}
          {dump.lengthSeconds ? <div>{dump.lengthSeconds.toFixed(0)}s</div> : null}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="wifi connect"
            onClick={play(dump)}
            sx={{
              marginRight: '36px',
            }}
          >
            <PlayArrow />
          </IconButton>
        </Box>
      </Box>
    </React.Fragment>
  );
}
