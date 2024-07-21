import React from 'react';
import * as THREE from 'three';
import { SPLFieldDescription } from '../common/dicts/fieldParams';
import { Canvas } from '@react-three/fiber';
import { Line, Circle, Plane,OrbitControls } from '@react-three/drei';

// Utility to convert mm to meters for Three.js
const mmToMeters = (mm: number) => mm / 1000;

// Line material
const lineMaterial = new THREE.LineBasicMaterial({ color: "white" });

// Types for Vector coordinates
interface IVector {
  x: number;
  y: number;
  z: number;
}

const SoccerField = () => {
    const fieldWidth = mmToMeters(SPLFieldDescription.FIELD_WIDTH);
    const fieldLength = mmToMeters(SPLFieldDescription.FIELD_LENGTH)
    const lineWidth = mmToMeters(SPLFieldDescription.FIELD_LINE_WIDTH)
  
    const penaltyBoxWidth = mmToMeters(SPLFieldDescription.GOAL_BOX_WIDTH);
    const penaltyBoxLength = mmToMeters(SPLFieldDescription.GOAL_BOX_LENGTH);
  
    const penaltyAreaWidth = mmToMeters(SPLFieldDescription.PENALTY_AREA_WIDTH);
    const penaltyAreaLength = mmToMeters(SPLFieldDescription.PENALTY_AREA_LENGTH);
    const goalBoxWidth = mmToMeters(SPLFieldDescription.GOAL_BOX_WIDTH);
    const goalBoxLength = mmToMeters(SPLFieldDescription.GOAL_BOX_LENGTH);
    const centerCircleDiameter = mmToMeters(SPLFieldDescription.CENTER_CIRCLE_DIAMETER);
    const centerCircleRadius =  centerCircleDiameter / 2;
    const addHeight = 0.001; // adding a little height to prevent z-fighting
    
    const topRight = new THREE.Vector3(-fieldWidth/2, 0, -fieldLength/2);
    const topLeft = new THREE.Vector3(-fieldWidth/2, 0, fieldLength/2);
    const bottomRight = new THREE.Vector3(fieldWidth/2, 0, -fieldLength/2);
    const bottomLeft = new THREE.Vector3(fieldWidth/2, 0, fieldLength/2);

    // Line material
    const lineMaterial = new THREE.LineBasicMaterial({ color: "white" });
  
    // Line as a thin rectangle to control thickness
    // Function to create a line as a thin rectangle to control thickness
    const createLine = (start: THREE.Vector3, end: THREE.Vector3) => {
      const height = lineWidth; // The "height" here is actually the line thickness
      const length = start.distanceTo(end);
      const angle = Math.atan2(end.z - start.z, end.x - start.x);  // Calculating angle to rotate around Y-axis
    
      return (
        <mesh 
          position={[(start.x + end.x) / 2, 0.001, (start.z + end.z) / 2]}  // Slight elevation to avoid z-fighting
          rotation={[-Math.PI / 2, 0, 0]}  // Rotating around Y-axis to align with start and end
        >
          <planeGeometry args={[length, height]} />
          <meshBasicMaterial color="white" />
        </mesh>
      );
    };
    // Function to create a circle outline using LineLoop
    const createCircleOutline = (outerRadius: number, thickness: number) => {
      const innerRadius = outerRadius - thickness;
    
      return (
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[innerRadius, outerRadius, 64]} />
          <meshBasicMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
      );
    };

    return (
      <Canvas style={{ width: '800px', height: '600px', background: 'grey' }}>
        <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      {/* Field base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fieldWidth, fieldLength]} />
        <meshStandardMaterial attach="material" color="green" />
      </mesh>
      {/* Field perimeter */}
      
      {createLine(topRight, bottomRight)}
      {createLine(topLeft, bottomLeft)}
      {/* {createLine(new THREE.Vector3(-fieldLength/2, 0, fieldWidth/2), new THREE.Vector3(fieldLength/2, 0, fieldWidth/2))}
      {createLine(new THREE.Vector3(-fieldLength/2, 0, -fieldWidth/2), new THREE.Vector3(-fieldLength/2, 0, fieldWidth/2))}
      {createLine(new THREE.Vector3(fieldLength/2, 0, -fieldWidth/2), new THREE.Vector3(fieldLength/2, 0, fieldWidth/2))}
       */}
      {/* Center line */}
      {createLine(new THREE.Vector3(0, 0, -fieldWidth/2), new THREE.Vector3(0, 0, fieldWidth/2))}
      {/* Center circle */}
      {createCircleOutline(centerCircleRadius, lineWidth)}
      {/* Penalty areas */}
      {/* {createLine(new THREE.Vector3(-penaltyAreaWidth/2, 0, -fieldLength/2), new THREE.Vector3(penaltyAreaWidth/2, 0, -fieldLength/2))}
      {createLine(new THREE.Vector3(-penaltyAreaWidth/2, 0, -fieldLength/2 + penaltyAreaLength), new THREE.Vector3(penaltyAreaWidth/2, 0, -fieldLength/2 + penaltyAreaLength))}
      {createLine(new THREE.Vector3(-penaltyAreaWidth/2, 0, -fieldLength/2), new THREE.Vector3(-penaltyAreaWidth/2, 0, -fieldLength/2 + penaltyAreaLength))}
      {createLine(new THREE.Vector3(penaltyAreaWidth/2, 0, -fieldLength/2), new THREE.Vector3(penaltyAreaWidth/2, 0, -fieldLength/2 + penaltyAreaLength))} */}
      {/* Goal boxes */}
      {/* {createLine(new THREE.Vector3(-goalBoxWidth/2, 0, -fieldLength/2), new THREE.Vector3(goalBoxWidth/2, 0, -fieldLength/2))}
      {createLine(new THREE.Vector3(-goalBoxWidth/2, 0, -fieldLength/2 + goalBoxLength), new THREE.Vector3(goalBoxWidth/2, 0, -fieldLength/2 + goalBoxLength))}
      {createLine(new THREE.Vector3(-goalBoxWidth/2, 0, -fieldLength/2), new THREE.Vector3(-goalBoxWidth/2, 0, -fieldLength/2 + goalBoxLength))}
      {createLine(new THREE.Vector3(goalBoxWidth/2, 0, -fieldLength/2), new THREE.Vector3(goalBoxWidth/2, 0, -fieldLength/2 + goalBoxLength))} */}
    </Canvas>
    );
  };
  
  export default SoccerField;