import React, { useContext } from 'react';
import { BlackboardContext } from '../../context/BlackboardContext';
import { SportsFootball, SportsSoccer, WarningAmber } from '@mui/icons-material';
import { Box } from '@mui/material';
import './StreamStats.css';
import { CameraInstance } from '../../common/models/cameraFrame';

interface IStreamStatsProps {
  camera: CameraInstance
}

export default function StreamStats({camera}: IStreamStatsProps) {
  const blackboardStream = useContext(BlackboardContext);
  const stats = blackboardStream?.streamProperties?.stats;
  const ballPercentageTop = stats?.ballPercentageTop?.toFixed(1);
  const robotPercentageTop = stats?.robotPercentageTop?.toFixed(1);
  const fieldFeaturePercentageTop = stats?.fieldFeaturePercentageTop?.toFixed(1);
  const centerCirclePercentageTop = stats?.centerCirclePercentageTop?.toFixed(1);
  const regionsPercentageTop = stats?.regionsPercentageTop?.toFixed(1);
  const regionsPercentageBottom = stats?.regionsPercentageBottom?.toFixed(1);
  const ballPercentageBottom = stats?.ballPercentageBottom?.toFixed(1);
  const robotPercentageBottom = stats?.robotPercentageBottom?.toFixed(1);
  const fieldFeaturePercentageBottom = stats?.fieldFeaturePercentageBottom?.toFixed(1);
  const centerCirclePercentageBottom = stats?.centerCirclePercentageBottom?.toFixed(1);

  const FPS = stats?.FPS.toFixed(0);
  const frame = blackboardStream?.streamProperties?.frame;
  const frameDropped = frame?.dropped;
  const delay = frame?.delay;

  const isLive = blackboardStream?.streamProperties?.isLive;

  let delayInfo = null;
  if (isLive && frameDropped) {
    delayInfo = '⚠️';
  }
  return (
    <React.Fragment>
      {camera === CameraInstance.top ? (
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div className={frame?.observation.ballSeenTop ? 'emphasized' : ''}>⚽️ {ballPercentageTop}%&nbsp;</div>
        <div className={frame?.observation.robotSeenTop ? 'emphasized' : ''}>🤖 {robotPercentageTop}%&nbsp;</div>
        <div className={frame?.observation.fieldFeatureSeenTop ? 'emphasized' : ''}>
          🔍 {fieldFeaturePercentageTop}%&nbsp;
        </div>
        <div className={frame?.observation.fieldFeatureSeenBottom ? 'emphasized' : ''}>
          🔲 {regionsPercentageTop}%&nbsp;
        </div>
        <div className={frame?.observation.centerCircleSeenTop ? 'emphasized' : ''}>
          ⭕️ {centerCirclePercentageTop}%&nbsp;
        </div>
        <div>
          {FPS} FPS {delayInfo}&nbsp;
        </div>
      </Box>
      ) :(
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div className={frame?.observation.ballSeenBottom ? 'emphasized' : ''}>⚽️ {ballPercentageBottom}%&nbsp;</div>
        <div className={frame?.observation.robotSeenBottom ? 'emphasized' : ''}>🤖 {robotPercentageBottom}%&nbsp;</div>
        <div className={frame?.observation.fieldFeatureSeenBottom ? 'emphasized' : ''}>
          🔍 {fieldFeaturePercentageBottom}%&nbsp;
        </div>
        <div className={frame?.observation.fieldFeatureSeenBottom ? 'emphasized' : ''}>
          🔲 {regionsPercentageBottom}%&nbsp;
        </div>
        <div className={frame?.observation.centerCircleSeenBottom ? 'emphasized' : ''}>
          ⭕️ {centerCirclePercentageBottom}%&nbsp;
        </div>
        <div>
          {FPS} FPS {delayInfo}&nbsp;
        </div>
      </Box>
      )}
      
    </React.Fragment>
  );
}
