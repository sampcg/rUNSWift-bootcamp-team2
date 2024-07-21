import React, { useState } from 'react';
import Title from '../components/Title';
import { BlackboardContext } from '../context/BlackboardContext';
import { maskToFlags } from '../common/blackboard/utils';
import DumpPlayerControl from '../components/DumpPlayerControl';
import FieldView, { LocationHypothesis, PoseHypothesis, RobotFieldInfo } from '../components/FieldView';
import { RobotInfo, RobotTeamInfo } from '../common/models/robotsInfo';
import { Blackboard } from '../common/blackboard';
import { Box, Button, IconButton, Input, TextareaAutosize } from '@mui/material';
import CameraViewGroup from '../components/CameraViewGroup';
import { Add } from '@mui/icons-material';
import { Typography } from '@mui/material/styles/createTypography';

// Constants - should remove these and replace with some sort of import from JSON for consistency but idk how to do that

namespace FieldFeatures {
  export const ROBOTS_PER_TEAM = 7;

  /** Field line dimensions */
  export const FIELD_LENGTH = 9070; // FIELDJSON_LENGTH
  export const FIELD_WIDTH = 6056; // FIELDJSON_WIDTH
  export const HALF_FIELD_LENGTH = FIELD_LENGTH / 2; // FIELDJSON_LENGTH
  export const HALF_FIELD_WIDTH = FIELD_WIDTH / 2; // FIELDJSON_WIDTH
  export const FIELD_LENGTH_OFFSET = 638; // FIELDJSON_BORDERSTRIPWIDTH
  export const FIELD_WIDTH_OFFSET = 638; // FIELDJSON_BORDERSTRIPWIDTH
  export const OFFNAO_FIELD_LENGTH_OFFSET = FIELD_LENGTH_OFFSET + 30; // FIELDJSON_BORDERSTRIPWIDTH + 30
  export const OFFNAO_FIELD_WIDTH_OFFSET = FIELD_WIDTH_OFFSET + 30; // FIELDJSON_BORDERSTRIPWIDTH + 30
  /** Goal box */
  export const GOAL_BOX_LENGTH = 600; // FIELDJSON_GOALBOXAREALENGTH
  export const GOAL_BOX_WIDTH = 2270; // FIELDJSON_GOALBOXAREAWIDTH
  /** Penalty Cross */
  export const PENALTY_CROSS_DIMENSIONS = 100; // FIELDJSON_PENALTYCROSSSIZE
  export const DIST_GOAL_LINE_TO_PENALTY_CROSS = 1280; // FIELDJSON_PENALTYCROSSDISTANCE
  export const PENALTY_CROSS_DISTANCE = 1280; // FIELDJSON_PENALTYCROSSDISTANCE
  export const PENALTY_CROSS_ABS_X = (FIELD_LENGTH / 2) - DIST_GOAL_LINE_TO_PENALTY_CROSS;
  /** Center Circle */
  export const CENTER_CIRCLE_DIAMETER = 1550; // FIELDJSON_CENTERCIRCLEDIAMETER
  /** Goal Posts */
  export const GOAL_POST_DIAMETER = 100; // FIELDJSON_POSTDIAMETER
  export const GOAL_BAR_DIAMETER = 100; // Double check this once field is built
  export const GOAL_POST_HEIGHT = 800; // FIELDJSON_HEIGHT
  export const GOAL_SUPPORT_DIAMETER = 46;
  export const GOAL_WIDTH = 1500; // FIELDJSON_INNERWIDTH
  export const GOAL_DEPTH = 435; // FIELDJSON_DEPTH
  export const PENALTY_AREA_LENGTH = 1708; // FIELDJSON_PENALTYAREALENGTH
  export const PENALTY_AREA_WIDTH = 4090; // FIELDJSON_PENALTYAREAWIDTH
  export const DISTANCE_OUTSIDE_PENALTY_BOX = PENALTY_AREA_LENGTH - PENALTY_CROSS_DISTANCE;

}

export const PI = Math.PI;

const safeEval = (expression: string): number => {
  // Allowed variables and constants
  const context = {
    PI,
    ...FieldFeatures
  };

  // Create a function that only has access to the allowed context
  const contextKeys = Object.keys(context);
  const contextValues = Object.values(context);

  try {
    // Construct a new function with the context
    const evaluator = new Function(...contextKeys, `return ${expression};`);

    // Execute the function with the context values
    return evaluator(...contextValues);
  } catch (error) {
    console.error('Invalid expression', error);
    return NaN;
  }
};

const parseVector2DInput = (input: string): RobotFieldInfo[] => {
  const regex = /Vector2D\s*\(\s*((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\s*\)/g;
  const robots: RobotFieldInfo[] = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    const content = match[1].trim(); // Content inside Vector2D(...)
    const [fXExpr, fYExpr] = content.split(',').map(expr => expr.trim());

    // Evaluate expressions for fX and fY
    const fX = safeEval(fXExpr);
    const fY = safeEval(fYExpr);

    robots.push({
      locations: [{ fX, fY, probability: 1, orientation: 0 }],
      ballPositions: [],
      name: `Robot ${robots.length + 1}`,
      teamInfo: {
        playerNumber: robots.length + 1,
      },
    });
  }
  return robots;
};


export default function PositioningPage() {
  const [robots, setRobots] = useState<RobotFieldInfo[]>([]);
  const [startingRobots, setStartingRobots] = useState<RobotFieldInfo[]>([]);
  const [vectorInput, setVectorInput] = useState<string>("");

  const addRobot = () => {
    const nextIndex = robots.length + 1;
    robots.push({
      locations: [{ fX: 0, fY: 0, probability: 1, orientation: 0 }],
      ballPositions: [],
      name: `Robot ${nextIndex}`,
      teamInfo: {
        playerNumber: nextIndex,
      },
    });
    setRobots([...robots]);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedRobots = robots.map((robot, i) => {
      if (i === index) {
        const updatedLocations = [{ ...robot.locations[0], [field]: value }];
        return { ...robot, locations: updatedLocations };
      }
      return robot;
    });
    setRobots(updatedRobots);
  };

  const handleInputBlur = (index: number, field: string, value: string) => {
    let parsedValue = 0;
    try {
      parsedValue = safeEval(value);
    } catch (error) {
      console.error('Invalid expression', error);
    }

    const updatedRobots = robots.map((robot, i) => {
      if (i === index) {
        const updatedLocations = [{ ...robot.locations[0], [field]: parsedValue }];
        return { ...robot, locations: updatedLocations };
      }
      return robot;
    });
    setRobots(updatedRobots);
  };

  const handleVectorInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setVectorInput(value);
    //const parsedRobots = parseVector2DInput(value);
    //setRobots(parsedRobots);
  };

  const handleApplyInput = () => {
    const parsedRobots = parseVector2DInput(vectorInput);
    setRobots(parsedRobots);
  }
  
  const INITIAL_POSES = [
    { x: -3900, y: 3000, theta: -Math.PI / 2 },
    { x: -3240, y: -3000, theta: Math.PI / 2 },
    { x: -2810, y: 3000, theta: -Math.PI / 2 },
    { x: -2160, y: -3000, theta: Math.PI / 2 },
    { x: -1700, y: 3000, theta: -Math.PI / 2 },
    { x: -1200, y: -3000, theta: Math.PI / 2 },
    { x: -700, y: 3000, theta: -Math.PI / 2 }
  ];

  const parseTransitionPoses = () => {
    const startingRobots: RobotFieldInfo[] = [];

    for (const startingRobot of INITIAL_POSES) {

      startingRobots.push({
        locations: [{fX:startingRobot.x, fY:startingRobot.y, probability: 1, orientation: startingRobot.theta }],
        ballPositions: [],
        name: `Robot ${startingRobots.length + 1}`,
        teamInfo: {
          playerNumber: startingRobots.length + 1,
        },
      });
    }
    return startingRobots;
  };

  
  const loadStarting = () => {
    setRobots(parseTransitionPoses());
  }
  const updateStarting = () => {

  }
  const overlayStarting = () => {

  }

  return (
    <React.Fragment>
      <DumpPlayerControl />
      <Title>Positioning</Title>
      <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', padding: '5px', justifyContent: 'space-between' }}>
        <Box sx={{ width: '82%', flexDirection: 'column' }}>
          <FieldView robots={robots} />
          Robot Positions Input:
          <Box>
            <TextareaAutosize
              minRows={10}
              style={{ width: '95%' }}
              value={vectorInput}
              onChange={handleVectorInputChange}
            />
            <Box sx={{ marginTop: '10px' }}>
            <Button variant="contained" color="primary" onClick={handleApplyInput}>
              Update
            </Button>
            <Button variant="contained" color="primary" onClick={loadStarting}>
              Load starting
            </Button>
            <Button variant="contained" color="primary" onClick={updateStarting}>
              Update starting
            </Button>
            <Button variant="contained" color="primary" onClick={overlayStarting}>
              Overlay Starting
            </Button>
          </Box>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          Robots:
          <IconButton
            edge="start"
            color="inherit"
            aria-label="add robot"
            onClick={addRobot}
          >
            <Add />
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {robots.map((r, index) => (
              <div key={r.name}>
                {r.name}:
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Input
                    value={r.locations[0].fX}
                    onChange={(e) => handleInputChange(index, 'fX', e.target.value)}
                    onBlur={(e) => handleInputBlur(index, 'fX', e.target.value)}
                    type="text"
                  />
                  <Input
                    value={r.locations[0].fY}
                    onChange={(e) => handleInputChange(index, 'fY', e.target.value)}
                    onBlur={(e) => handleInputBlur(index, 'fY', e.target.value)}
                    type="text"
                  />
                  <Input
                    value={r.locations[0].orientation}
                    onChange={(e) => handleInputChange(index, 'orientation', e.target.value)}
                    onBlur={(e) => handleInputBlur(index, 'orientation', e.target.value)}
                    type="text"
                  />
                </Box>
              </div>
            ))}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
