import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import URDFLoader, { URDFRobot } from 'urdf-loader';
import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { BlackboardContext } from './BlackboardContext';
import { Joints } from '../common/blackboard';

interface RobotPose {
  position: THREE.Vector3;
  orientation: THREE.Vector3;
}
interface RobotHandle {
  robot: URDFRobot | null;
  jointAngles: number[] | null;
  setTargetPose: (pose: RobotPose) => void;
}
const RobotModelContext = createContext<RobotHandle | null>(null);
interface RobotModelProviderProps {
    children: ReactNode;
    urdfPath: string;
}
export const RobotModelProvider: React.FC<RobotModelProviderProps> = ({ children, urdfPath }) => {
  const initialPose: RobotPose =  {
    position: new THREE.Vector3(0, 0, 0),
    orientation: new THREE.Vector3(0, 0, 0),
  }
  const initialJoints = Array<number>(Joints.NUMBER_OF_JOINTS).fill(0); 
  const scene = new THREE.Scene();
  const [robot, setRobot] = useState<URDFRobot | null>(null);
  const [targetPose, setTargetPose] = useState<RobotPose>(initialPose);
  const [jointAngles, setJointAngles] = useState<number[]>(initialJoints);
  const blackboardStream = useContext(BlackboardContext);
  useEffect(() => {
      // Update robot whenever joint values change
      updateRobotPosition();
  }, [jointAngles, targetPose]);
  useEffect(() => {
    // Update robot whenever joint values change
    const currentJointAngles = blackboardStream?.blackboard?.motion?.sensors?.joints?.angles;
    if (currentJointAngles) {
      setJointAngles(currentJointAngles);
    }
  }, [blackboardStream?.blackboard, targetPose]);

  const updateRobotPosition = () => {
      if (robot) {
          if (jointAngles?.length) {
            for (const [i, angle] of jointAngles.entries()) {
              const jointName = Joints[i];
              const joint = robot.joints[jointName];
              if (joint) {
                joint.setJointValue(angle);
              }
            }
          }
          // Important: Update the robot's world matrix after changing joint values
          robot.updateMatrixWorld(true);

          // Get the target link and adjust the robot's position
          const link = robot.links['r_sole'];
          if (link) {
              const linkWorldPosition = new THREE.Vector3();
              link.getWorldPosition(linkWorldPosition);

              const offset = new THREE.Vector3().subVectors(targetPose.position, linkWorldPosition);
              robot.position.add(offset);

              robot.updateMatrixWorld(true); // Update again to apply new position
          }
      }
  };
  useEffect(() => {
    const loader = new URDFLoader();
    loader.loadMeshCb = (path: string, manager: THREE.LoadingManager, done: Function) => {
      const extension = path.split('.').pop()?.toLowerCase();

      // Use the appropriate loader based on the file type
      if (extension === 'obj') {
        const mtlLoader = new MTLLoader(manager);
        // mtlLoader.setPath(basePath); // Set the base path for .mtl files and textures

        // Assuming the .mtl file has the same base name as the .obj file
        const mtlFileName = path.replace('.obj', '.mtl');
        mtlLoader.load(mtlFileName, materials => {
            materials.preload();
            const objLoader = new OBJLoader(manager);
            objLoader.setMaterials(materials);
            // objLoader.setPath(basePath);
            objLoader.load(path, object => {
                done(object);
            });
        });
      } else {
        console.error('Unsupported file type:', extension);
      }
    };

    loader.load(urdfPath, (robot) => {
        console.log("Loaded Robot:", robot);
        scene.add(robot);
        setRobot(robot);
        updateRobotPosition();
        // Assuming setJointValues is a method on robot that takes a joint configuration object
        // This is pseudocode; you might need to adjust it based on the actual URDF-loader API
    });
  }, [urdfPath]);

  return (
    <RobotModelContext.Provider value={{robot, jointAngles, setTargetPose}}>
      {children}
    </RobotModelContext.Provider>
  );
};

export const useRobotModel = () => useContext(RobotModelContext);
