import React, { useContext } from 'react';
import Title from '../components/Title';
import { BlackboardContext } from '../context/BlackboardContext';

import { maskToFlags } from '../common/blackboard/utils';
import DumpPlayerControl from '../components/DumpPlayerControl';
import FieldView, { LocationHypothesis, PoseHypothesis, RobotFieldInfo } from '../components/FieldView';
import { RobotInfo, RobotTeamInfo } from '../common/models/robotsInfo';
import { Blackboard } from '../common/blackboard';
import { Box } from '@mui/material';
import CameraViewGroup from '../components/CameraViewGroup';

function robotFieldInfoFromBlackboard(blackboard: Blackboard, robotInfo?: RobotInfo): RobotFieldInfo {
  const robotName = robotInfo?.name || blackboard.gameController?.playerNumber || '';
  const teamInfo = robotInfo?.teamInfo || { teamNumber: blackboard.gameController?.ourTeam?.teamNumber, playerNumber: blackboard.gameController?.playerNumber };

  const locations: PoseHypothesis[] = [];
  if (blackboard.stateEstimation?.allRobotPos.length) {
    for (const pos of blackboard.stateEstimation?.allRobotPos) {
      locations.push({
        fX: pos.vec[0],
        fY: pos.vec[1],
        orientation: pos.vec[2] + (blackboard.motion?.active?.head?.yaw || 0),
        probability: pos.weight,
      });
    }
  }
  const ballPositions: LocationHypothesis[] = [];
  if (blackboard.stateEstimation?.ballPos) {
    const pos = blackboard.stateEstimation?.ballPos;
    ballPositions.push({
      fX: pos.vec[0],
      fY: pos.vec[1],
      probability: pos.weight,
    });
  }
  return {
    name: robotName,
    locations,
    ballPositions,
    teamInfo,
  };
}

export default function LocalisationPage() {
  const blackboardStream = useContext(BlackboardContext);
  const robots: RobotFieldInfo[] = [];
  const robotInfo = blackboardStream?.currentRobot?.robotInfo || blackboardStream?.currentDump?.dumpInfo;
  if (blackboardStream?.blackboard) {
    const robot = robotFieldInfoFromBlackboard(blackboardStream?.blackboard, robotInfo);
    robots.push(robot);
  }
  return (
    <React.Fragment>
      <DumpPlayerControl />
      <Title>Localisation</Title>
      <Box
        sx={{ display: 'flex', width: '100%', flexDirection: 'row', padding: '5px', justifyContent: 'space-between' }}
      >
        <FieldView robots={robots} />
        <Box sx={{ flexGrow: 1 }}>
          <CameraViewGroup />
        </Box>
      </Box>
    </React.Fragment>
  );
}
