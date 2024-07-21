import React, { useContext } from 'react';
import { BlackboardContext } from '../context/BlackboardContext';
import { VideoViewType } from './CameraView';
import { CameraInstance } from '../common/models/cameraFrame';
import { Box, Stack } from '@mui/material';
import CompositeVideoView from './CompositeVideoView';
import { CameraViewContext } from '../context/CameraViewContext';
import StreamStats from './StreamStats/StreamStats';
import { Stream } from '@mui/icons-material';

interface VisionProps {
  videoViewType: VideoViewType;
  enabledCameras: CameraInstance[];
  showOverlay: boolean;
}

export default function CameraViewer({}: VisionProps) {
  const cameraViewCtx = useContext(CameraViewContext);
  const blackboardData = useContext(BlackboardContext);
  let topCamera = <div>No image</div>;
  if (blackboardData?.blackboard?.vision?.topFrame?.length) {
    topCamera = (
      <>
        <Stack direction="column" >
          <StreamStats camera={CameraInstance.top} />
          <CompositeVideoView
            image={blackboardData?.blackboard?.vision?.topFrame}
            viewType={VideoViewType.camera}
            camera={CameraInstance.top}
            vision={blackboardData?.blackboard?.vision}
            showOverlay={cameraViewCtx?.showOverlay}
          />
        </Stack>
      </>
      
    );
  } else if (blackboardData?.blackboard?.vision?.topFrameJPEG?.length) {
    topCamera = (
      <>
        <Stack direction="column" >
          <StreamStats camera={CameraInstance.top}/>
          <CompositeVideoView
            image={blackboardData?.blackboard?.vision?.topFrameJPEG}
            viewType={VideoViewType.cameraJPEG}
            camera={CameraInstance.top}
            vision={blackboardData.blackboard?.vision}
            showOverlay={cameraViewCtx?.showOverlay}
          />
        </Stack>
      </>
    );
  }
  let bottomCamera = <div>No image</div>;
  if (blackboardData?.blackboard?.vision?.botFrame?.length) {
    bottomCamera = (
      <>
      <Stack direction="column" >
        <StreamStats camera={CameraInstance.bottom}/>
        <CompositeVideoView
          image={blackboardData?.blackboard?.vision?.botFrame}
          viewType={VideoViewType.camera}
          camera={CameraInstance.bottom}
          vision={blackboardData.blackboard?.vision}
          showOverlay={cameraViewCtx?.showOverlay}
        />
        </Stack>
      </>
    );
  } else if (blackboardData?.blackboard?.vision?.botFrameJPEG?.length) {
    bottomCamera = (
      <>
        <StreamStats camera={CameraInstance.bottom}/>
        <CompositeVideoView
          image={blackboardData?.blackboard?.vision?.botFrameJPEG}
          viewType={VideoViewType.cameraJPEG}
          camera={CameraInstance.bottom}
          vision={blackboardData.blackboard?.vision}
          showOverlay={cameraViewCtx?.showOverlay}
        />
      </>
    );
  }
  const topSaliency = blackboardData?.blackboard?.vision?.topSaliency?.length ? (
    <Stack direction="column" >
      <StreamStats camera={CameraInstance.top}/>
      <CompositeVideoView
        image={blackboardData?.blackboard?.vision?.topSaliency}
        viewType={VideoViewType.salience}
        camera={CameraInstance.top}
        vision={blackboardData.blackboard?.vision}
        showOverlay={cameraViewCtx?.showOverlay}
      />
    </Stack>
  ) : (
    <div>No image</div>
  );
  const bottomSaliency = blackboardData?.blackboard?.vision?.botSaliency.length ? (
    <Stack direction="column" >
      <StreamStats camera={CameraInstance.bottom}/>
      <CompositeVideoView
        image={blackboardData?.blackboard?.vision?.botSaliency}
        viewType={VideoViewType.salience}
        camera={CameraInstance.bottom}
        vision={blackboardData?.blackboard?.vision}
        showOverlay={cameraViewCtx?.showOverlay}
      />
    </Stack>
  ) : (
    <div>No image</div>
  );

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {cameraViewCtx?.videoViewType === VideoViewType.camera &&
        cameraViewCtx.enabledCameras.includes(CameraInstance.top)
          ? topCamera
          : null}
        {cameraViewCtx?.videoViewType === VideoViewType.camera &&
        cameraViewCtx.enabledCameras.includes(CameraInstance.bottom)
          ? bottomCamera
          : null}
        {cameraViewCtx?.videoViewType === VideoViewType.salience &&
        cameraViewCtx.enabledCameras.includes(CameraInstance.top)
          ? topSaliency
          : null}
        {cameraViewCtx?.videoViewType === VideoViewType.salience &&
        cameraViewCtx.enabledCameras.includes(CameraInstance.bottom)
          ? bottomSaliency
          : null}
      </Box>
    </React.Fragment>
  );
}
