import React, { useContext } from 'react';
import Title from './Title';
import { Box, Checkbox, InputLabel } from '@mui/material';
import { TeamContext } from '../context/TeamContext';
import { Button } from '@mui/base';
import RobotCard from './RobotCard';
import { RobotInfo, StreamingRobotInfo } from '../common/models/robotsInfo';

export default function Robots() {
  const teamData = useContext(TeamContext);
  const [showUnreachable, setShowUnreachable] = React.useState(false);
  const [showTest, setShowTest] = React.useState(false);

  const getRobots = async () => {
    const res = await teamData?.sendRequest({
      requestPath: '/robots',
      nonce: new Date().getTime(),
      requestParams: {},
    });
    console.log('res ', res?.response);
  };
  const toggledUnreachable = () => {
    setShowUnreachable(!showUnreachable);
  };
  const toggledTest = () => {
    setShowTest(!showTest);
  };

  const shouldShowRobot = (robot: StreamingRobotInfo) => {
    if (robot.isTestRobot) {
      return showTest;
    }
    if (!showUnreachable) {
      return robot.connection.ethernet.reachable || robot.connection.wifi.reachable;
    }

    return true;
  };
  const sortStrings = (a: string | undefined, b: string | undefined) => {
    if (!a && !b) {
      return 0;
    }
    if (!a && b) {
      return 1;
    }
    if (!b && a) {
      return -1;
    }
    const sorted: string[] = [a!, b!].sort();
    if (sorted[0] === a) {
      return 1;
    } else {
      return -1;
    }
  };
  const sortRobots = (a: StreamingRobotInfo, b: StreamingRobotInfo) => {
    let [aScore, bScore] = [0, 0];
    if (a.isTestRobot) {
      aScore = 10;
    } else {
      aScore = 30;
    }
    if (b.isTestRobot) {
      bScore = 10;
    } else {
      bScore = 30;
    }
    if (a.teamInfo) {
      aScore += 30 * (a.teamInfo.teamNumber || 0) - (a.teamInfo.playerNumber || 0);
    }
    if (b.teamInfo) {
      bScore += 30 * (b.teamInfo.teamNumber || 0) - (b.teamInfo.playerNumber || 0);
    }
    if (aScore === bScore) {
      const delta = sortStrings(a.name, b.name);
      aScore += delta;
      bScore -= delta;
    }
    if (aScore < bScore) {
      return 1;
    } else if (aScore > bScore) {
      return -1;
    }
    return 0;
  };
  return (
    <React.Fragment>
      <Title>Robots</Title>
      <div style={{ display: 'flex', gap: '8px' }}>
        <InputLabel>
          <Checkbox checked={showUnreachable} onChange={toggledUnreachable} />
          Show unreachable
        </InputLabel>
        <InputLabel>
          <Checkbox checked={showTest} onChange={toggledTest} />
          Show test
        </InputLabel>
      </div>

      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', flexGrow: 1 }}>
        {teamData?.robotState
          .filter(shouldShowRobot)
          .sort(sortRobots)
          .map((robot) => <RobotCard robot={robot} key={robot.name} />)}
      </Box>
      <Button onClick={getRobots}>Load</Button>
    </React.Fragment>
  );
}
