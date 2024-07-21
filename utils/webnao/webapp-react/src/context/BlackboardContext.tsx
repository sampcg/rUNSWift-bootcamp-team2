import React, { ReactNode, createContext, useEffect, useRef, useState } from 'react';
import { Blackboard } from '../common/blackboard';
import { Commands } from '../common/blackboard/definitions/Commands';
import { DumpRobotInfo, StreamingRobotInfo } from '../common/models/robotsInfo';
import { DumpControlCommand } from '../common/models/teamAPI';
import { Vision_Cameras } from '../common/blackboard/definitions/Blackboard';

interface BlackboardData {
  blackboard: Blackboard | null;
  endpoint: string | null;
  currentRobot: BlackboardStreamingRobot | null;
  currentDump: BlackboardStreamingDump | null;
  dumpControlState: DumpControlState | null;
  streamProperties: BlackboardStreamProperties | null;
  sendCommand: (command: Commands) => void;
  switchToRobot: (robotInfo: StreamingRobotInfo, endpoint: string) => void;
  switchToDump: (dumpInfo: DumpRobotInfo, endpoint: string) => void;
  controlDumpStream: (controlCommand: DumpControlCommand) => void;
  disconnect: () => void;
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}
export const BlackboardContext = createContext<BlackboardData | null>(null);

interface BlackboardContextProviderProps {
  children: ReactNode;
}
interface BlackboardFrameObservation {
  ballSeenTop: boolean;
  robotSeenTop: boolean;
  fieldFeatureSeenTop: boolean;
  ballSeenBottom: boolean;
  regionsSeenBottom: boolean;
  regionsSeenTop: boolean;
  robotSeenBottom: boolean;
  fieldFeatureSeenBottom: boolean;
  centerCircleSeenTop: boolean;
  centerCircleSeenBottom: boolean;
  frameDeltaTimeMs: number;
}
interface BlackboardStreamStats {
  ballPercentageTop: number;
  robotPercentageTop: number;
  regionsPercentageTop: number;
  regionsPercentageBottom: number;
  fieldFeaturePercentageTop: number;
  centerCirclePercentageTop: number;
  ballPercentageBottom: number;
  robotPercentageBottom: number;
  fieldFeaturePercentageBottom: number;
  centerCirclePercentageBottom: number;
  FPS: number;
}
interface BlackboardStreamProperties {
  isLive: boolean;
  statCalculationFrames: number;
  stats?: BlackboardStreamStats;
  frame: {
    observation: BlackboardFrameObservation;
    delay: number;
    timestampMs: number;
    dropped: boolean;
  };
}
interface BlackboardStreamingRobot {
  robotInfo: StreamingRobotInfo;
}
export enum DumpControlState {
  paused = 'paused',
  playing = 'playing',
}
interface BlackboardStreamingDump {
  dumpInfo: DumpRobotInfo;
}
function calculateStreamStats(observations: BlackboardFrameObservation[]): BlackboardStreamStats {
  let [ballFramesTop, robotFramesTop, fieldFeatureFramesTop, framesTimeTotalMs, centerCircleFramesTop] = [0, 0, 0, 0, 0];
  let [ballFramesBottom, robotFramesBottom, fieldFeatureFramesBottom, centerCircleFramesBottom] = [0, 0, 0, 0, 0];
  let [regionFramesTop, regionFramesBottom] = [0, 0];
  for (const observation of observations) {
    ballFramesTop += observation.ballSeenTop ? 1 : 0;
    robotFramesTop += observation.robotSeenTop ? 1 : 0;
    fieldFeatureFramesTop += observation.fieldFeatureSeenTop ? 1 : 0;
    centerCircleFramesTop += observation.centerCircleSeenTop ? 1 : 0;
    ballFramesBottom += observation.ballSeenBottom ? 1 : 0;
    regionFramesTop += observation.regionsSeenTop ? 1 : 0;
    regionFramesBottom += observation.regionsSeenBottom ? 1 : 0;
    robotFramesBottom += observation.robotSeenBottom ? 1 : 0;
    fieldFeatureFramesBottom += observation.fieldFeatureSeenBottom ? 1 : 0;
    centerCircleFramesBottom += observation.centerCircleSeenBottom ? 1 : 0;
    framesTimeTotalMs += observation.frameDeltaTimeMs;
  }
  const total = observations.length;
  return {
    ballPercentageTop: (100 * ballFramesTop) / total,
    robotPercentageTop: (100 * robotFramesTop) / total,
    fieldFeaturePercentageTop: (100 * fieldFeatureFramesTop) / total,
    centerCirclePercentageTop: (100 * centerCircleFramesTop) / total,
    regionsPercentageBottom: (100 * regionFramesBottom) / total,
    regionsPercentageTop: (100 * regionFramesTop) / total,
    ballPercentageBottom: (100 * ballFramesBottom) / total,
    robotPercentageBottom: (100 * robotFramesBottom) / total,
    fieldFeaturePercentageBottom: (100 * fieldFeatureFramesBottom) / total,
    centerCirclePercentageBottom: (100 * centerCircleFramesBottom) / total,
    FPS: total / (framesTimeTotalMs / 1000),
  };
}
function addObservation(
  observations: BlackboardFrameObservation[],
  observation: BlackboardFrameObservation,
  limit: number,
) {
  observations.unshift(observation);
  while (observations.length > limit) {
    observations.pop();
  }
  return observations;
}
export const BlackboardContextProvider: React.FC<BlackboardContextProviderProps> = ({ children }) => {
  const [blackboard, setBlackboard] = useState<Blackboard | null>(null);
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [currentRobot, setCurrentRobot] = useState<BlackboardStreamingRobot | null>(null);
  const [currentDump, setCurrentDump] = useState<BlackboardStreamingDump | null>(null);
  const [dumpControlState, setDumpControlState] = useState<DumpControlState | null>(null);
  const [streamProperties, setStreamProperties] = useState<BlackboardStreamProperties | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const currentDumpControlState = useRef<DumpControlState | null>(null);
  const statCalculationFrames = 30;
  const streamFrameMaxDelayMs = 10000;
  const dumpMaxFPS = 10;

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);
  const sendCommand = (command: Commands) => {
    if (ws.current) {
      const commandsBytes = Commands.encode(command).finish();
      ws.current.send(commandsBytes);
    }
  };
  const controlDumpStream = (controlCommand: DumpControlCommand) => {
    switch (controlCommand.action) {
      case 'play': {
        if (ws.current) {
          const cmd: DumpControlCommand = { action: 'next', from: controlCommand.from };
          ws.current.send(JSON.stringify(cmd));
          if (controlCommand.from && dumpControlState !== DumpControlState.playing) {
            setDumpControlState(DumpControlState.paused);
            currentDumpControlState.current = DumpControlState.paused;
          } else {
            setDumpControlState(DumpControlState.playing);
            currentDumpControlState.current = DumpControlState.playing;
          }
        }
        break;
      }
      case 'pause':
        setDumpControlState(DumpControlState.paused);
        currentDumpControlState.current = DumpControlState.paused;
        break;
      case 'previous':
        setDumpControlState(DumpControlState.paused);
        currentDumpControlState.current = DumpControlState.paused;
        if (ws.current) {
          const cmd: DumpControlCommand = { action: 'previous' };
          ws.current.send(JSON.stringify(cmd));
        }
        break;
      case 'next':
        setDumpControlState(DumpControlState.paused);
        currentDumpControlState.current = DumpControlState.paused;
        if (ws.current) {
          const cmd: DumpControlCommand = { action: 'next' };
          ws.current.send(JSON.stringify(cmd));
        }
        break;
      default:
        break;
    }
  };
  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
    }
    setBlackboard(null);
    setEndpoint(null);
    setCurrentRobot(null);
    setCurrentDump(null);
    setStreamProperties(null);
  };
  const determineStreamProperties = (
    currentBlackboard: Blackboard,
    observations: BlackboardFrameObservation[],
    isLive: boolean,
    frameStartTimeMs: number,
    frameTimeMs: number,
  ) => {
    const frameDeltaTimeMs = frameStartTimeMs === 0 ? 0 : frameTimeMs - frameStartTimeMs;
    frameStartTimeMs = frameTimeMs;
    let delay = 0;
    const timestampMs = (currentBlackboard.vision?.timestamp || 0) / 1000;
    if (timestampMs > 0) {
      delay = frameTimeMs - timestampMs;
    }
    const observation: BlackboardFrameObservation = {
      ballSeenTop: !!currentBlackboard.vision?.balls.filter(b => b.topCamera).length,
      robotSeenTop: !!currentBlackboard.vision?.robots.filter(b => b.cameras === Vision_Cameras.TOP_CAMERA).length,
      ballSeenBottom: !!currentBlackboard.vision?.balls.filter(b => !b.topCamera).length,
      robotSeenBottom: !!currentBlackboard.vision?.robots.filter(b => b.cameras !== Vision_Cameras.TOP_CAMERA).length,
      fieldFeatureSeenTop: !!currentBlackboard.vision?.fieldFeatures.length,
      centerCircleSeenTop: !!(currentBlackboard.vision?.fieldFeatures || []).filter((f) => f.type === 2).length,
      regionsSeenTop: !!(currentBlackboard.vision?.regions || []).filter(f => f.isTopCamera).length,
      regionsSeenBottom: !!(currentBlackboard.vision?.regions || []).filter(f => !f.isTopCamera).length,
      fieldFeatureSeenBottom: !!currentBlackboard.vision?.fieldFeatures.length,
      centerCircleSeenBottom: !!(currentBlackboard.vision?.fieldFeatures || []).filter((f) => f.type === 2).length,
      frameDeltaTimeMs,
    };
    addObservation(observations, observation, statCalculationFrames);
    const streamProperties: BlackboardStreamProperties = {
      isLive,
      statCalculationFrames,
      frame: {
        observation,
        delay,
        dropped: isLive && delay > streamFrameMaxDelayMs,
        timestampMs,
      },
    };
    if (observations.length === statCalculationFrames) {
      streamProperties.stats = calculateStreamStats(observations);
    }
    return streamProperties;
  };
  const switchToRobot = (robotInfo: StreamingRobotInfo, endpoint: string) => {
    if (ws.current) {
      ws.current.close();
    }
    ws.current = new WebSocket(endpoint);
    let frameStartTimeMs = 0;
    const observations: BlackboardFrameObservation[] = [];
    ws.current.onmessage = async (ev) => {
      const buffer = await (ev.data as Blob).arrayBuffer();
      const data = new Uint8Array(buffer);
      let currentBlackboard: Blackboard | undefined;
      try {
        currentBlackboard = Blackboard.decode(data);
      } catch (error) {
        console.error('Error decoding blacckboard', error);
      }
      if (currentBlackboard) {
        if (currentBlackboard.vision?.redRegions?.length) {
          console.log('Red regions detected');
        }
        if (currentBlackboard.vision?.refereeHands?.length) {
          console.log('Referee hands detected');
        }
        const frameTimeMs = new Date().getTime();
        const streamProperties = determineStreamProperties(
          currentBlackboard,
          observations,
          true,
          frameStartTimeMs,
          frameTimeMs,
        );
        setStreamProperties(streamProperties);
        frameStartTimeMs = frameTimeMs;
        setCurrentRobot({ robotInfo });
        if (!streamProperties.frame.dropped) {
          setBlackboard(currentBlackboard);
        } else {
          console.warn(`DELAY:${streamProperties.frame.delay}ms`);
        }
      }
    };
    setEndpoint(endpoint);
    setCurrentRobot({ robotInfo });
    setCurrentDump(null);
  };

  const switchToDump = (dumpInfo: DumpRobotInfo, endpoint: string) => {
    if (ws.current) {
      ws.current.close();
    }
    ws.current = new WebSocket(endpoint);
    let frameStartTimeMs = new Date().getTime();
    const observations: BlackboardFrameObservation[] = [];
    controlDumpStream({ action: 'pause' });
    ws.current.onmessage = async (ev) => {
      const buffer = await (ev.data as Blob).arrayBuffer();
      const data = new Uint8Array(buffer);
      let currentBlackboard: Blackboard | undefined;
      try {
        currentBlackboard = Blackboard.decode(data);
      } catch (error) {
        console.error('Error decoding blacckboard', error);
      }
      if (currentBlackboard) {
        const frameTimeMs = new Date().getTime();
        const streamProperties = determineStreamProperties(
          currentBlackboard,
          observations,
          false,
          frameStartTimeMs,
          frameTimeMs,
        );
        setStreamProperties(streamProperties);
        frameStartTimeMs = frameTimeMs;
        const elapsedMs = observations[0].frameDeltaTimeMs;

        const deltaMs = 1000 / dumpMaxFPS - elapsedMs;
        if (deltaMs > 10) {
          await wait(deltaMs);
        }
        setBlackboard(currentBlackboard);
        if (currentDumpControlState.current === DumpControlState.playing) {
          controlDumpStream({ action: 'play' });
        }
      }
    };
    setEndpoint(endpoint);
    setCurrentRobot(null);
    setCurrentDump({ dumpInfo });
  };

  return (
    <BlackboardContext.Provider
      value={{
        blackboard,
        endpoint,
        currentRobot,
        currentDump,
        dumpControlState,
        streamProperties,
        sendCommand,
        switchToRobot,
        disconnect,
        controlDumpStream,
        switchToDump,
      }}
    >
      {children}
    </BlackboardContext.Provider>
  );
};
