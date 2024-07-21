import React, { useContext, useState } from 'react';
import { BlackboardContext } from '../context/BlackboardContext';
import { TeamContext } from '../context/TeamContext';
import { Slider } from '@mui/material';

export default function DumpPlayerControl() {
  const teamData = useContext(TeamContext);
  const blackboardCtx = useContext(BlackboardContext);
  const [position, setPosition] = useState<number | null>(null);

  const currentDump = blackboardCtx?.currentDump;
  const currentDumpInfo = teamData?.dumpState.find((r) => r.path === currentDump?.dumpInfo.path);
  let max = undefined;
  let min = undefined;
  if (currentDumpInfo?.timestamps) {
    max = currentDumpInfo.timestamps[currentDumpInfo.timestamps.length - 1];
    min = currentDumpInfo.timestamps[0];
  }
  const timestampToText = (timestamp: number) => {
    return new Date(timestamp / 1000).toLocaleTimeString();
  };
  const onChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setPosition(newValue);
    }
  };
  const onChangeCommitted = (event: any, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setPosition(newValue);
      blackboardCtx?.controlDumpStream({
        action: 'play',
        from: newValue,
      });
    }
  };
  const value = blackboardCtx?.blackboard?.vision?.timestamp;
  // setPosition(blackboardCtx?.blackboard?.vision?.timestamp || null);
  const shouldDisplay = currentDumpInfo?.timestamps && blackboardCtx?.blackboard?.vision?.timestamp;

  return (
    <React.Fragment>
      {shouldDisplay ? (
        <Slider
          valueLabelDisplay="auto"
          onChangeCommitted={onChangeCommitted}
          valueLabelFormat={timestampToText}
          value={value}
          max={max}
          min={min}
        />
      ) : null}
    </React.Fragment>
  );
}
