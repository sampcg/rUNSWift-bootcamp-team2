import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IStreamMaskFlags, maskToFlags } from '../common/blackboard/utils';
import { CameraInstance } from '../common/models/cameraFrame';
import { VideoViewType } from '../components/CameraView';

interface CameraViewData {
  videoStreamAvailable: boolean;
  setVideoStreamAvailable: Dispatch<SetStateAction<boolean>>;
  enabledCameras: CameraInstance[];
  setEnabledCameras: Dispatch<SetStateAction<CameraInstance[]>>;
  videoViewType: VideoViewType | null;
  setVideoViewType: Dispatch<SetStateAction<VideoViewType | null>>;
  showOverlay: boolean;
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
}

interface CameraViewContextProviderProps {
  children: ReactNode;
}

export const CameraViewContext = createContext<CameraViewData | null>(null);

export const CameraViewContextProvider: React.FC<CameraViewContextProviderProps> = ({ children }) => {
  const [videoStreamAvailable, setVideoStreamAvailable] = useState<boolean>(false);
  const [enabledCameras, setEnabledCameras] = useState<CameraInstance[]>([]);
  const [videoViewType, setVideoViewType] = useState<VideoViewType | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  return (
    <CameraViewContext.Provider
      value={{
        videoStreamAvailable,
        setVideoStreamAvailable,
        enabledCameras,
        setEnabledCameras,
        videoViewType,
        setVideoViewType,
        showOverlay,
        setShowOverlay,
      }}
    >
      {children}
    </CameraViewContext.Provider>
  );
};
