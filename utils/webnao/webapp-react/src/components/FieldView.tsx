import React, { ComponentProps, useCallback, useContext, useEffect, useRef, useState } from 'react';
import fieldImage from '../assets/field.png';
import { Stage, Text as PixiText, Sprite } from '@pixi/react';
import { TextStyle } from '@pixi/text';
import { Graphics } from '@pixi/react';
import { RobotTeamInfo } from '../common/models/robotsInfo';

export interface CanvasPoint {
  cX: number;
  cY: number;
}

export interface CanvasPose extends CanvasPoint {
  cOrientation: number;
}

export interface FieldPoint {
  fX: number;
  fY: number;
}

export interface FieldPose extends FieldPoint {
  orientation: number;
}
export interface PoseHypothesis extends FieldPose {
  probability: number;
}
export interface LocationHypothesis extends FieldPoint {
  probability: number;
}

export interface RobotRelativeLocation {
  distance: number;
  heading: number;
  orientation?: number;
}
export interface RobotFieldInfo {
  name: string;
  teamInfo?: RobotTeamInfo;
  locations: PoseHypothesis[];
  ballPositions: LocationHypothesis[];
}

export interface FieldViewProps {
  robots: RobotFieldInfo[];
}
export interface ScreenPoint {
  x: number;
  y: number;
}
interface TextProps {
  text: string;
  x: number;
  y: number;
}
interface TextPropsDictionary {
  [name: string]: TextProps;
}
type Draw = Required<ComponentProps<typeof Graphics>>['draw'];

const fieldLength = 8.95 * 1000;
const fieldWidth = 5.94 * 1000;
const imageWidth = 1740;
const imageHeight = 1164;
const fieldOffset = 50;
const pixelRatio = window.devicePixelRatio || 1;
// const pixelRatio = 1;
const fieldImageWidth = imageWidth / pixelRatio;
const fieldImageHeight = imageHeight / pixelRatio;
const fieldToImageRatio = Math.max(fieldImageWidth / fieldLength, fieldImageHeight / fieldWidth);

function fieldCoordinateToCanvas(fieldC: FieldPoint): CanvasPoint {
  return {
    cX: (fieldC.fX / fieldLength) * fieldImageWidth + fieldImageWidth / 2,
    cY: fieldImageHeight / 2 - (fieldC.fY / fieldWidth) * fieldImageHeight + (fieldOffset / 2),
  };
}
function fieldPoseToCanvas(fieldP: FieldPose): CanvasPose {
  const canvasCoordinate = fieldCoordinateToCanvas(fieldP);
  const d = (-3 * Math.PI) / 2;
  return {
    ...canvasCoordinate,
    cOrientation: fieldP.orientation + d,
  };
}

function getCanvasSize(): { width: number; height: number } | undefined {
  const el = document.getElementsByClassName('field-view').item(0);
  if (el) {
    return {
      width: el.clientWidth,
      height: el.clientHeight,
    };
  }
  return undefined;
}

function screenPointToCanvas(screenPoint: ScreenPoint): CanvasPoint | undefined {
  const canvasSize = getCanvasSize();
  if (!canvasSize) {
    return undefined;
  }
  const { x, y } = screenPoint;
  return {
    cX: (fieldImageWidth * x) / canvasSize.width,
    cY: (fieldImageHeight * y) / canvasSize.height,
  };
}

function canvasPointToField(cPoint: CanvasPoint): FieldPoint {
  return {
    fX: (fieldLength * (cPoint.cX - fieldImageWidth / 2)) / fieldImageWidth,
    fY: (fieldWidth * (fieldImageHeight / 2 - cPoint.cY)) / fieldImageHeight,
  };
}

export default function FieldView({ robots }: FieldViewProps) {
  const [pointerPosition, setPointerPosition] = useState<FieldPoint | null>(null);
  const [textProps, setTextProps] = useState<TextPropsDictionary>({});
  const updateRobotTextProps = (name: string, newTextProps: TextProps) => {
    setTextProps(prevState => ({
      ...prevState,
      [name]: newTextProps
    }));
  };
    
  const fieldImageCropHeightwise = 0.0914;

  const style = new TextStyle({
    align: 'center',
    fontFamily: 'sans-serif',
    fontSize: 20,
    fontWeight: 'bold',
    fill: ['#000000'],
    stroke: '#ffffff',
    strokeThickness: 1,
    letterSpacing: 5,
  });

  const draw = useCallback<Draw>((g) => {
    g.clear();
    setTextProps({});
    for (const robot of robots) {
      if (robot.locations.length) {
        const sortedLocations = robot.locations.slice().sort((a, b) => {
          if (a.probability === b.probability) {
            return 0;
          }
          if (a.probability > b.probability) {
            return -1
          }
          if (a.probability < b.probability) {
            return 1
          }
          return 0;
        });
        const mainLocation = sortedLocations[0];
        const distinctLocations = sortedLocations.filter(location => {
          if (location === mainLocation) {
            return true;
          }
          const distance = Math.sqrt(Math.pow(location.fX - mainLocation.fX, 2) + Math.pow(location.fY - mainLocation.fY, 2));
          return (distance * fieldToImageRatio) > 30;
        });
        for (const location of distinctLocations) {
          const {cX, cY, cOrientation} = fieldPoseToCanvas(location);
          g.lineStyle(2, 0xffcc00, 1);
          g.beginFill(0xffcc00, location.probability);
          g.drawCircle(cX, cY, 16);
          if (location.orientation !== undefined) {
            const pointerDistance = 20;
            g.drawCircle(cX + pointerDistance * Math.sin(cOrientation), cY + pointerDistance * Math.cos(cOrientation), 4);
          }
          g.endFill();

          updateRobotTextProps(robot.name, { 
            text: `${robot.teamInfo?.playerNumber}`, 
            x: cX - 6, 
            y: cY - 14 
          });
        }
      }

      for (const ball of robot.ballPositions) {
        const { cX, cY } = fieldCoordinateToCanvas(ball);
        g.lineStyle(1, 0x000000, 1);
        g.beginFill(0x000000);
        g.drawCircle(cX, cY, 5);
        g.endFill();
      }
    }
  },
    [robots],
  );
  useEffect(() => {
    const canvasElements = document.getElementsByClassName('field-view');
    const styleOverride = 'width: 100%';
    for (let i = 0; i < canvasElements.length; i++) {
      const canvasElement = canvasElements[i] as HTMLElement;
      if (canvasElement.style.width !== '100%') {
        canvasElement.setAttribute('style', styleOverride);
      }
    }
  }, [robots]);
  const onMouseOver: React.MouseEventHandler = (event) => {
    const elementRect = event.currentTarget.getBoundingClientRect();
    const screenPoint = { x: event.clientX - elementRect.x, y: event.clientY - elementRect.y };
    const canvasPoint = screenPointToCanvas(screenPoint);
    if (canvasPoint) {
      const fieldPoint = canvasPointToField(canvasPoint);
      setPointerPosition(fieldPoint);
      return;
    }
    setPointerPosition(null);
  };
  return (
    <React.Fragment>
      <div style={{ position: 'relative' }} onMouseMove={onMouseOver}>
        <Stage
          width={fieldImageWidth}
          height={fieldImageHeight + fieldOffset}
          className="field-view"
          options={{
            backgroundAlpha: 0,
            resolution: pixelRatio,
            antialias: true,
          }}
        >
          <Sprite width={fieldImageWidth} height={fieldImageHeight} source={fieldImage} y={(fieldOffset / 2)}></Sprite>
          <Graphics draw={draw} />
          {Object.entries(textProps).map(([name, props]) => (
            <PixiText
              key={name}
              text={props.text}
              x={props.x}
              y={props.y}
              style={style}
            />
          ))}
        </Stage>
        ({pointerPosition?.fX}, {pointerPosition?.fY})
      </div>
    </React.Fragment>
  );
}