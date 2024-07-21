import React, { ReactNode, createContext, useState } from 'react';
import { refereeDetectorSettings } from '../detectors/RefereePoseDetector';

export interface VisionDetectorSetting<T extends string = string> {
  name: T;
  value: number;
  min?: number;
  max?: number;
}

interface VisionDetectorConfiguration {
  visionDetector: VisionDetectorType | null;
  settings: VisionDetectorSetting[];
}
enum VisionDetectorType {
  refereePose = 'refereePose'
}
interface VisionDetectorContextProviderProps {
  children: ReactNode;
}
interface VisionDetectorContextItem extends VisionDetectorConfiguration {
  setSettings: (settings:VisionDetectorSetting[]) => void;
  setDetector: (detector: VisionDetectorType) => void;
}

export const VisionDetectorContext = createContext<VisionDetectorContextItem>({settings: refereeDetectorSettings, visionDetector: VisionDetectorType.refereePose, setSettings: () => {}, setDetector: () => {}});

export const VisionDetectorContextProvider: React.FC<VisionDetectorContextProviderProps> = ({children}) => {
  const [settings, setSettings] = useState<VisionDetectorSetting[]>(refereeDetectorSettings);
  const [detector, setDetector] = useState<VisionDetectorType | null>( VisionDetectorType.refereePose);
  return (
    <VisionDetectorContext.Provider value={{ visionDetector: detector, settings, setSettings, setDetector }} >
        {children}
    </VisionDetectorContext.Provider>
  );
};
