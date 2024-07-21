import React, { ChangeEvent, useContext } from 'react';
import { BlackboardContext } from '../context/BlackboardContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Checkbox, FormControlLabel, FormGroup, IconButton } from '@mui/material';
import { TeamContext } from '../context/TeamContext';
import { Button } from '@mui/base';
import { StreamingRobotInfo } from '../common/models/robotsInfo';
import BatteryLevel from './BatteryLevel';
import { Cable, NetworkWifi } from '@mui/icons-material';
import { IStreamMaskFlags, makeMask } from '../common/blackboard/utils';

interface RobotCardProps {
  robot: StreamingRobotInfo;
}
interface RobotConnectionRequest {
  robot: StreamingRobotInfo;
  type: 'ethernet' | 'wifi';
  maskFlags: IStreamMaskFlags;
}
export default function RobotCard({ robot }: RobotCardProps) {
  const teamData = useContext(TeamContext);
  const blackboardCtx = useContext(BlackboardContext);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const defaultMaskFlags: IStreamMaskFlags = { blackboard: true, saliency: true, rawImage: false };
  // const connectionRequest: RobotConnectionRequest = {robot, type: 'ethernet', maskFlags: defaultMaskFlags};
  const [connectionRequest, setConnectionRequest] = React.useState<RobotConnectionRequest>({
    robot,
    type: 'ethernet',
    maskFlags: defaultMaskFlags,
  });

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };
  const executeConnectionRequest = async () => {
    setDialogOpen(false);
    if (teamData && connectionRequest) {
      const endpoint = await teamData.getRobotConnectionEndpoint(
        connectionRequest.robot.name!,
        connectionRequest.type,
        makeMask(connectionRequest.maskFlags),
      );
      blackboardCtx?.switchToRobot(robot, endpoint);
    }
  };
  type maskCheckboxHandler = (
    flagName: keyof IStreamMaskFlags,
  ) => (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  const maskChanged: maskCheckboxHandler =
    (flagName: keyof IStreamMaskFlags) => (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      const newRequest: RobotConnectionRequest = { ...connectionRequest };
      newRequest.maskFlags[flagName] = checked;
      setConnectionRequest(newRequest);
    };
  type connectionHandler = (robot: StreamingRobotInfo) => () => Promise<void>;
  const connectViaEthernet: connectionHandler = (robot: StreamingRobotInfo) => async () => {
    setConnectionRequest({ robot, type: 'ethernet', maskFlags: defaultMaskFlags });
    setDialogOpen(true);
  };
  const connectViaWiFi: connectionHandler = (robot: StreamingRobotInfo) => async () => {
    setConnectionRequest({ robot, type: 'wifi', maskFlags: defaultMaskFlags });
    setDialogOpen(true);
  };
  return (
    <React.Fragment>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Connect to {robot.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>What data do you want?</DialogContentText>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={connectionRequest?.maskFlags.blackboard} onChange={maskChanged('blackboard')} />
              }
              label="Blackboard"
            />
            <FormControlLabel
              control={<Checkbox checked={connectionRequest?.maskFlags.saliency} onChange={maskChanged('saliency')} />}
              label="Saliency"
            />
            <FormControlLabel
              control={<Checkbox checked={connectionRequest?.maskFlags.rawImage} onChange={maskChanged('rawImage')} />}
              label="Raw image"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={executeConnectionRequest}>Connect</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '5px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <div>
            {robot.name} T{robot.teamInfo?.teamNumber} P{robot.teamInfo?.playerNumber}
          </div>
          <BatteryLevel batteryPercentage={robot.batteryPercentage} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <IconButton
            disabled={!robot.connection.ethernet.reachable}
            edge="start"
            color="inherit"
            aria-label="ethernet connect"
            onClick={connectViaEthernet(robot)}
            sx={{
              marginRight: '36px',
            }}
          >
            <Cable />
          </IconButton>
          <IconButton
            disabled={!robot.connection.wifi.reachable}
            edge="start"
            color="inherit"
            aria-label="wifi connect"
            onClick={connectViaWiFi(robot)}
            sx={{
              marginRight: '36px',
            }}
          >
            <NetworkWifi />
          </IconButton>
        </Box>
      </Box>
    </React.Fragment>
  );
}
