import React, { useContext, useEffect, useRef, useState } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import URDFLoader, { URDFRobot } from 'urdf-loader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { BlackboardContext } from '../context/BlackboardContext';
import { Joints } from '../common/blackboard';
import { CameraInstance } from '../common/models/cameraFrame';
import { useRobotModel } from '../context/RobotModelContext';
// Extend the JSX namespace to include THREE OrbitControls
// extend({ OrbitControls: OrbitControlsImpl });

interface RobotViewerProps {
  urdfPath: string;
  targetPosition: THREE.Vector3;
}
const DefaultCamera: React.FC<{position: THREE.Vector3}> = ({position}) => {
  const { camera } = useThree();
  return (
      <>
          <PerspectiveCamera makeDefault position={position} />
          <OrbitControls camera={camera} enableZoom={true} />
      </>
  );
};

interface RobotCameraProps {
  robot: URDFRobot;
  cam: CameraInstance;
}
const RobotCamera: React.FC<RobotCameraProps> = ({ robot, cam }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const { scene } = useThree(); 
  useEffect(() => {
      if (robot && cameraRef.current) {
          const cameraLink = robot.getObjectByName('CameraTop_optical_frame');
          if (cameraLink) {
              const camera = cameraRef.current;
              const cameraLinkPosition = new THREE.Vector3();
              const cameraLinkQuaternion = new THREE.Quaternion();
              // camera.position.setFromMatrixPosition(cameraLink.matrixWorld);
              cameraLink.getWorldPosition(cameraLinkPosition);
              cameraLink.getWorldQuaternion(cameraLinkQuaternion);
              camera.setRotationFromQuaternion(cameraLinkQuaternion);
              const rotation = new THREE.Euler().setFromRotationMatrix(cameraLink.matrixWorld);
              camera.rotation.set(rotation.x, rotation.y, rotation.z);
              camera.updateProjectionMatrix();
              scene.add(camera);
          }
      }
      return () => {
        const camera = cameraRef.current;
        if (camera) {
          scene.remove(camera);
        }
      }
  }, [robot, scene]);
  useFrame((state) => {
    if (cameraRef.current) {
      state.gl.render(state.scene, cameraRef.current);
    }
  }, 1);
  return (
    <perspectiveCamera ref={cameraRef} fov={50} aspect={window.innerWidth / window.innerHeight} near={0.1} far={1000} />
  );
};
interface RobotPlacerProps {
  robot: URDFRobot;
}
const RobotPlacer: React.FC<RobotPlacerProps> = ({robot}) => {
  const { scene } = useThree();
  useEffect(() => {
    scene.add(robot);
    return () => {
      scene.remove(robot);
    }
  }, [scene])
  return null;
};

interface RobotSceneProps {
  urdfPath: string;
}

const RobotScene: React.FC<RobotSceneProps> = ({ urdfPath }) => {
  const robotModel = useRobotModel();
  const position = new THREE.Vector3(0,0,0);
    return (
        <Canvas style={{ width: '800px', height: '600px', background: 'grey' }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            {/* <OrbitControls args={[new THREE.PerspectiveCamera()]} /> */}
            {robotModel?.robot && (
              <>
                <RobotPlacer robot={robotModel?.robot}></RobotPlacer>
                <RobotCamera robot={robotModel.robot} cam={CameraInstance.top}></RobotCamera>
              </>
            )}
            <Box position={[1,0,0]} scale={[.1,.1,.1]}>
              <meshStandardMaterial attach="material" color="blue" />
            </Box>
        </Canvas>
    );
};

export default RobotScene;
