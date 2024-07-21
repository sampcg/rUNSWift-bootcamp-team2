import React, { useContext, useEffect, useRef, useState } from 'react';
import Title from '../components/Title';
import { BlackboardContext } from '../context/BlackboardContext';
import DumpPlayerControl from '../components/DumpPlayerControl';
import { Box } from '@mui/material';
import { Behaviour_BehaviourRequest } from '../common/blackboard/definitions/Blackboard';


export default function BehaviourPage() {
  const blackboardStream = useContext(BlackboardContext); 
  const [behaviours, setBehaviours] = useState<{ timestamp: number, body: string, head: string, flags: string[] }[]>([]);
  const behaviourListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const behaviourRequest = blackboardStream?.blackboard?.behaviour?.request[0];
    const newBodyBehaviourHierarchy = behaviourRequest?.behaviourDebugInfo?.bodyBehaviourHierarchy;
    const newHeadBehaviourHierarchy = behaviourRequest?.behaviourDebugInfo?.headBehaviourHierarchy;
    const newBehaviourFlags =  [
      behaviourRequest?.behaviourSharedData?.isAssisting ? 'Assisting' : '',
      behaviourRequest?.behaviourSharedData?.isKickedOff ? 'KickedOff' : '',
      behaviourRequest?.behaviourSharedData?.needAssistance? 'Need Assist' : '',
      behaviourRequest?.behaviourSharedData?.playingBall? 'Playing Ball' : '',
      `Role ${behaviourRequest?.behaviourSharedData?.role}`,
      `Last kick ${behaviourRequest?.behaviourSharedData?.secondsSinceLastKick} s`,
      `Walking (${behaviourRequest?.behaviourSharedData?.walkingToX}, ${behaviourRequest?.behaviourSharedData?.walkingToY}, ${behaviourRequest?.behaviourSharedData?.walkingToH})`
    ];
    const newTimestamp = blackboardStream?.blackboard?.vision?.timestamp;
    const prevBehaviourEntry = behaviours[behaviours.length - 1];
    let hierarchyIsDifferent = true;
    let flagsAredifferent = true;
    if (prevBehaviourEntry) {
      hierarchyIsDifferent = prevBehaviourEntry.body !== newBodyBehaviourHierarchy || prevBehaviourEntry.head !== newHeadBehaviourHierarchy;
      flagsAredifferent = prevBehaviourEntry.flags.join('') !== newBehaviourFlags.join('');
    }
    if (newTimestamp && newBodyBehaviourHierarchy && newHeadBehaviourHierarchy && (hierarchyIsDifferent || flagsAredifferent)) {
      setBehaviours(prev => {
        const updatedBehaviours = [...prev, { timestamp: newTimestamp, body: newBodyBehaviourHierarchy, head: newHeadBehaviourHierarchy, flags: newBehaviourFlags }];
        return updatedBehaviours.length > 10 ? updatedBehaviours.slice(-10) : updatedBehaviours;
      });
    }
  }, [blackboardStream?.blackboard]);
  const behs = behaviours.map((entry, index) => (
    <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
      <div>{new Date(entry.timestamp).toLocaleTimeString()}</div>
      <div>H: {entry.head}</div>
      <div>B: {entry.body}</div>
      <div>{entry.flags.join('\n')}</div>
    </div>
  ));
  return (
    <React.Fragment>
      <DumpPlayerControl />
      <Title>Behaviour</Title>
      <Box
        sx={{ display: 'flex', width: '100%', flexDirection: 'column', padding: '5px', justifyContent: 'space-between' }}
      >
        <div>
        {behaviours.length > 0 ? <div style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
      <div>{new Date(behaviours[behaviours.length - 1].timestamp).toLocaleTimeString()}</div>
      <div>{behaviours[behaviours.length - 1].bodyBehaviour}</div>
      <div>{behaviours[behaviours.length - 1].flags.join('\n')}</div>
    </div> : 'No Behaviour'}
      </div>
      <div ref={behaviourListRef} style={{ maxHeight: '900px', overflowY: 'scroll' }}>
        {behs}
      </div>
      </Box>
    </React.Fragment>
  );
}
