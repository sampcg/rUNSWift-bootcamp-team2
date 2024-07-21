/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "offnao";

export enum ActionType {
  NONE = 0,
  STAND = 1,
  WALK = 2,
  DRIBBLE = 3,
  TURN_DRIBBLE = 4,
  GETUP_FRONT = 5,
  GETUP_BACK = 6,
  TIP_OVER = 7,
  KICK = 8,
  INITIAL = 9,
  LIMP = 10,
  REF_PICKUP = 11,
  GOALIE_SIT = 12,
  GOALIE_DIVE_RIGHT = 13,
  GOALIE_DIVE_LEFT = 14,
  GOALIE_CENTRE = 15,
  GOALIE_UNCENTRE = 16,
  GOALIE_INITIAL = 17,
  GOALIE_AFTERSIT_INITIAL = 18,
  DEFENDER_CENTRE = 19,
  GOALIE_FAST_SIT = 20,
  MOTION_CALIBRATE = 21,
  STAND_STRAIGHT = 22,
  LINE_UP = 23,
  NUM_ACTION_TYPES = 24,
  TEST_ARMS = 25,
  UKEMI_FRONT = 26,
  UKEMI_BACK = 27,
  UNRECOGNIZED = -1,
}

export function actionTypeFromJSON(object: any): ActionType {
  switch (object) {
    case 0:
    case "NONE":
      return ActionType.NONE;
    case 1:
    case "STAND":
      return ActionType.STAND;
    case 2:
    case "WALK":
      return ActionType.WALK;
    case 3:
    case "DRIBBLE":
      return ActionType.DRIBBLE;
    case 4:
    case "TURN_DRIBBLE":
      return ActionType.TURN_DRIBBLE;
    case 5:
    case "GETUP_FRONT":
      return ActionType.GETUP_FRONT;
    case 6:
    case "GETUP_BACK":
      return ActionType.GETUP_BACK;
    case 7:
    case "TIP_OVER":
      return ActionType.TIP_OVER;
    case 8:
    case "KICK":
      return ActionType.KICK;
    case 9:
    case "INITIAL":
      return ActionType.INITIAL;
    case 10:
    case "LIMP":
      return ActionType.LIMP;
    case 11:
    case "REF_PICKUP":
      return ActionType.REF_PICKUP;
    case 12:
    case "GOALIE_SIT":
      return ActionType.GOALIE_SIT;
    case 13:
    case "GOALIE_DIVE_RIGHT":
      return ActionType.GOALIE_DIVE_RIGHT;
    case 14:
    case "GOALIE_DIVE_LEFT":
      return ActionType.GOALIE_DIVE_LEFT;
    case 15:
    case "GOALIE_CENTRE":
      return ActionType.GOALIE_CENTRE;
    case 16:
    case "GOALIE_UNCENTRE":
      return ActionType.GOALIE_UNCENTRE;
    case 17:
    case "GOALIE_INITIAL":
      return ActionType.GOALIE_INITIAL;
    case 18:
    case "GOALIE_AFTERSIT_INITIAL":
      return ActionType.GOALIE_AFTERSIT_INITIAL;
    case 19:
    case "DEFENDER_CENTRE":
      return ActionType.DEFENDER_CENTRE;
    case 20:
    case "GOALIE_FAST_SIT":
      return ActionType.GOALIE_FAST_SIT;
    case 21:
    case "MOTION_CALIBRATE":
      return ActionType.MOTION_CALIBRATE;
    case 22:
    case "STAND_STRAIGHT":
      return ActionType.STAND_STRAIGHT;
    case 23:
    case "LINE_UP":
      return ActionType.LINE_UP;
    case 24:
    case "NUM_ACTION_TYPES":
      return ActionType.NUM_ACTION_TYPES;
    case 25:
    case "TEST_ARMS":
      return ActionType.TEST_ARMS;
    case 26:
    case "UKEMI_FRONT":
      return ActionType.UKEMI_FRONT;
    case 27:
    case "UKEMI_BACK":
      return ActionType.UKEMI_BACK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ActionType.UNRECOGNIZED;
  }
}

export function actionTypeToJSON(object: ActionType): string {
  switch (object) {
    case ActionType.NONE:
      return "NONE";
    case ActionType.STAND:
      return "STAND";
    case ActionType.WALK:
      return "WALK";
    case ActionType.DRIBBLE:
      return "DRIBBLE";
    case ActionType.TURN_DRIBBLE:
      return "TURN_DRIBBLE";
    case ActionType.GETUP_FRONT:
      return "GETUP_FRONT";
    case ActionType.GETUP_BACK:
      return "GETUP_BACK";
    case ActionType.TIP_OVER:
      return "TIP_OVER";
    case ActionType.KICK:
      return "KICK";
    case ActionType.INITIAL:
      return "INITIAL";
    case ActionType.LIMP:
      return "LIMP";
    case ActionType.REF_PICKUP:
      return "REF_PICKUP";
    case ActionType.GOALIE_SIT:
      return "GOALIE_SIT";
    case ActionType.GOALIE_DIVE_RIGHT:
      return "GOALIE_DIVE_RIGHT";
    case ActionType.GOALIE_DIVE_LEFT:
      return "GOALIE_DIVE_LEFT";
    case ActionType.GOALIE_CENTRE:
      return "GOALIE_CENTRE";
    case ActionType.GOALIE_UNCENTRE:
      return "GOALIE_UNCENTRE";
    case ActionType.GOALIE_INITIAL:
      return "GOALIE_INITIAL";
    case ActionType.GOALIE_AFTERSIT_INITIAL:
      return "GOALIE_AFTERSIT_INITIAL";
    case ActionType.DEFENDER_CENTRE:
      return "DEFENDER_CENTRE";
    case ActionType.GOALIE_FAST_SIT:
      return "GOALIE_FAST_SIT";
    case ActionType.MOTION_CALIBRATE:
      return "MOTION_CALIBRATE";
    case ActionType.STAND_STRAIGHT:
      return "STAND_STRAIGHT";
    case ActionType.LINE_UP:
      return "LINE_UP";
    case ActionType.NUM_ACTION_TYPES:
      return "NUM_ACTION_TYPES";
    case ActionType.TEST_ARMS:
      return "TEST_ARMS";
    case ActionType.UKEMI_FRONT:
      return "UKEMI_FRONT";
    case ActionType.UKEMI_BACK:
      return "UKEMI_BACK";
    case ActionType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum RobotVisionInfoType {
  rUnknown = 0,
  rBlue = 1,
  rRed = 2,
  UNRECOGNIZED = -1,
}

export function robotVisionInfoTypeFromJSON(object: any): RobotVisionInfoType {
  switch (object) {
    case 0:
    case "rUnknown":
      return RobotVisionInfoType.rUnknown;
    case 1:
    case "rBlue":
      return RobotVisionInfoType.rBlue;
    case 2:
    case "rRed":
      return RobotVisionInfoType.rRed;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RobotVisionInfoType.UNRECOGNIZED;
  }
}

export function robotVisionInfoTypeToJSON(object: RobotVisionInfoType): string {
  switch (object) {
    case RobotVisionInfoType.rUnknown:
      return "rUnknown";
    case RobotVisionInfoType.rBlue:
      return "rBlue";
    case RobotVisionInfoType.rRed:
      return "rRed";
    case RobotVisionInfoType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** first the common shared types */
export interface PairIntInt {
  first?: number | undefined;
  second?: number | undefined;
}

export interface XYZCoord {
  x?: number | undefined;
  y?: number | undefined;
  z?: number | undefined;
}

export interface ActionCommandAll {
  head?: ActionCommandAll_Head | undefined;
  body?: ActionCommandAll_Body | undefined;
  leds?: ActionCommandAll_LED | undefined;
  stiffen?: ActionCommandAll_Stiffen | undefined;
}

/** optional float sonar = 4; */
export enum ActionCommandAll_Stiffen {
  NONE = 0,
  STIFFEN = 1,
  UNRECOGNIZED = -1,
}

export function actionCommandAll_StiffenFromJSON(object: any): ActionCommandAll_Stiffen {
  switch (object) {
    case 0:
    case "NONE":
      return ActionCommandAll_Stiffen.NONE;
    case 1:
    case "STIFFEN":
      return ActionCommandAll_Stiffen.STIFFEN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ActionCommandAll_Stiffen.UNRECOGNIZED;
  }
}

export function actionCommandAll_StiffenToJSON(object: ActionCommandAll_Stiffen): string {
  switch (object) {
    case ActionCommandAll_Stiffen.NONE:
      return "NONE";
    case ActionCommandAll_Stiffen.STIFFEN:
      return "STIFFEN";
    case ActionCommandAll_Stiffen.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ActionCommandAll_Head {
  yaw?: number | undefined;
  pitch?: number | undefined;
  isRelative?: boolean | undefined;
  yawSpeed?: number | undefined;
  pitchSpeed?: number | undefined;
}

export interface ActionCommandAll_Body {
  actionType?: ActionType | undefined;
  forward?: number | undefined;
  left?: number | undefined;
  turn?: number | undefined;
  power?: number | undefined;
  bend?: number | undefined;
  speed?: number | undefined;
  kickDirection?: number | undefined;
  foot?: ActionCommandAll_Body_Foot | undefined;
  isFast?: boolean | undefined;
  misalignedKick?: boolean | undefined;
  useShuffle?: boolean | undefined;
  leftArmBehind?: boolean | undefined;
  rightArmBehind?: boolean | undefined;
  blocking?: boolean | undefined;
}

export enum ActionCommandAll_Body_Foot {
  LEFT = 0,
  RIGHT = 1,
  UNRECOGNIZED = -1,
}

export function actionCommandAll_Body_FootFromJSON(object: any): ActionCommandAll_Body_Foot {
  switch (object) {
    case 0:
    case "LEFT":
      return ActionCommandAll_Body_Foot.LEFT;
    case 1:
    case "RIGHT":
      return ActionCommandAll_Body_Foot.RIGHT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ActionCommandAll_Body_Foot.UNRECOGNIZED;
  }
}

export function actionCommandAll_Body_FootToJSON(object: ActionCommandAll_Body_Foot): string {
  switch (object) {
    case ActionCommandAll_Body_Foot.LEFT:
      return "LEFT";
    case ActionCommandAll_Body_Foot.RIGHT:
      return "RIGHT";
    case ActionCommandAll_Body_Foot.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ActionCommandAll_LED {
  leftEar?: number | undefined;
  rightEar?: number | undefined;
  leftEye?: ActionCommandAll_LED_rgb | undefined;
  rightEye?: ActionCommandAll_LED_rgb | undefined;
  chestButton?: ActionCommandAll_LED_rgb | undefined;
  leftFoot?: ActionCommandAll_LED_rgb | undefined;
  rightFoot?: ActionCommandAll_LED_rgb | undefined;
}

export interface ActionCommandAll_LED_rgb {
  red?: boolean | undefined;
  green?: boolean | undefined;
  blue?: boolean | undefined;
}

/** used for vector<vector<int> > */
export interface RepeatedInt {
  /** TODO: add the sizes to the message */
  values: number[];
}

export interface FloatMatrix {
  size1?: number | undefined;
  size2?: number | undefined;
  data: number[];
}

export interface AbsCoord {
  vec: number[];
  var?: FloatMatrix | undefined;
  weight?: number | undefined;
}

export interface SharedStateEstimationBundle {
  robotPos?: AbsCoord | undefined;
  ballPosRRC?: AbsCoord | undefined;
  ballVelRRC?: AbsCoord | undefined;
  haveBallUpdate?: boolean | undefined;
}

export interface JointValues {
  angles: number[];
  stiffnesses: number[];
  temperatures: number[];
  currents: number[];
}

export interface SensorValues {
  joints?:
    | JointValues
    | undefined;
  /**
   * Sensors like InertialSensor(Angle, Gyro, Accelerometer), FSR, etc are here.
   * For the ordering of sensors, see 'robot/blackboard/serialize.cpp' and look for the 'v6SensorsToV5Sensors()' function on line 183.
   */
  sensors: number[];
}

/** then the messages for each sub-blackboard */
export interface GameController {
  /** removed */
  teamRed?: boolean | undefined;
  playerNumber?: number | undefined;
  ourTeam?: GameController_TeamInfo | undefined;
}

export interface GameController_TeamInfo {
  teamNumber?: number | undefined;
}

export interface Motion {
  sensors?: SensorValues | undefined;
  pose?: Motion_Pose | undefined;
  com?: XYZCoord | undefined;
  odometry?: Motion_Odometry | undefined;
  active?: ActionCommandAll | undefined;
  jointRequest?: JointValues | undefined;
  motionDebugInfo?: Motion_MotionDebugInfo | undefined;
}

export interface Motion_Pose {
  topCameraToWorldTransform?: FloatMatrix | undefined;
  botCameraToWorldTransform?: FloatMatrix | undefined;
  origin?: FloatMatrix | undefined;
  zunit?: FloatMatrix | undefined;
  topCOrigin?: FloatMatrix | undefined;
  botCOrigin?: FloatMatrix | undefined;
  horizon?: PairIntInt | undefined;
  topExclusionArray: number[];
  botExclusionArray: number[];
  neckToWorldTransform?: FloatMatrix | undefined;
}

export interface Motion_Odometry {
  forward?: number | undefined;
  left?: number | undefined;
  turn?: number | undefined;
}

export interface Motion_MotionDebugInfo {
  feetPosition?: Motion_FeetPosition | undefined;
}

export interface Motion_FeetPosition {
  left?: Motion_FootPosition | undefined;
  right?: Motion_FootPosition | undefined;
}

export interface Motion_FootPosition {
  x?: number | undefined;
  y?: number | undefined;
  theta?: number | undefined;
}

export interface Perception {
  behaviour?: number | undefined;
  kinematics?: number | undefined;
  stateEstimation?: number | undefined;
  total?: number | undefined;
  vision?: number | undefined;
}

export interface Kinematics {
  /** repeated RepeatedInt sonarFiltered = 1; */
  parameters?: Kinematics_Parameters | undefined;
}

export interface Kinematics_Parameters {
  cameraPitchTop?: number | undefined;
  cameraYawTop?: number | undefined;
  cameraRollTop?: number | undefined;
  cameraYawBottom?: number | undefined;
  cameraPitchBottom?: number | undefined;
  cameraRollBottom?: number | undefined;
  bodyPitch?: number | undefined;
}

/** looks like a composite type */
export interface Behaviour {
  request: Behaviour_BehaviourRequest[];
}

export interface Behaviour_BehaviourRequest {
  /** optional WhichCamera whichCamera = 1; */
  actions?:
    | ActionCommandAll
    | undefined;
  /**
   * optional bool goalieAttacking = 3;
   * optional bool goalieDiving = 4;
   * optional int32 secondsSinceLastKick = 5;
   * optional bool doingBallLineUp = 6;
   * optional bool isInReadyMode = 7;
   * optional float timeToReachBall = 8;
   * optional float timeToReachDefender = 9;
   * optional float timeToReachMidfielder = 10;
   * optional float timeToReachUpfielder = 11;
   * optional int32 kickoffSide = 12;
   * optional bool wantCrazyBall = 13;
   * optional string behaviourHierarchy = 14;
   * optional int32 currentRole = 15;
   * optional int32 role = 16;
   * optional bool playingBall = 17;
   * optional bool needAssistance = 18;
   * optional bool isAssisting = 19;
   * optional bool isKickedOff = 20;
   * optional bool isFollowing = 21;
   * optional int32 ballLostFrames = 22;
   * optional sint32 readyPositionAllocation0 = 23;
   * optional sint32 readyPositionAllocation1 = 24;
   * optional sint32 readyPositionAllocation2 = 25;
   * optional sint32 readyPositionAllocation3 = 26;
   * optional sint32 readyPositionAllocation4 = 27;
   */
  behaviourDebugInfo?: BehaviourDebugInfo | undefined;
  behaviourSharedData?: BehaviourSharedData | undefined;
}

export interface Point {
  x?: number | undefined;
  y?: number | undefined;
}

export interface BBox {
  a?: Point | undefined;
  b?: Point | undefined;
}

export interface RRCoord {
  vec: number[];
  var?: FloatMatrix | undefined;
}

export interface BehaviourSharedData {
  /**
   * optional bool goalieAttacking = 1;
   * optional bool goalieDiving = 2;
   * optional float timeToReachBall = 3;
   * optional float timeToReachUpfielder = 4;
   * optional float timeToReachMidfielder = 5;
   * optional float timeToReachDefender = 6;
   * optional int32 currentRole = 7;
   */
  role?: number | undefined;
  playingBall?: boolean | undefined;
  needAssistance?: boolean | undefined;
  isAssisting?: boolean | undefined;
  secondsSinceLastKick?:
    | number
    | undefined;
  /** optional bool isFollowing = 13; */
  isKickedOff?:
    | boolean
    | undefined;
  /**
   * optional bool doingBallLineUp = 15;
   * optional bool isInReadyMode = 16;
   * optional ReadySkillPositionAllocation readyPositionAllocation = 17;
   * optional int32 ballLostFrames = 18;
   */
  walkingToX?: number | undefined;
  walkingToY?: number | undefined;
  walkingToH?: number | undefined;
}

export interface Vision {
  /** repeated Ipoint landmarks = 1; */
  timestamp?:
    | number
    | undefined;
  /**
   * optional PostInfoType goalArea = 3; // Not sure what type it is
   * optional float awayGoalProb = 4;
   * optional int32 homeMapSize = 5;
   * optional int32 awayMapSize = 6;
   * repeated FootInfo feet_boxes = 7;
   */
  balls: Vision_BallInfo[];
  /**
   * optional BallHint ballhint = 9;
   * repeated PostInfo posts = 10;
   */
  robots: Vision_RobotVisionInfo[];
  fieldBoundaries: Vision_FieldBoundaryInfo[];
  fieldFeatures: Vision_FieldFeatureInfo[];
  /**
   * optional uint32 missedFrames = 14;
   * optional PairIntInt dxdy = 15;
   */
  regions: Vision_RegionI[];
  topCameraSettings?:
    | Vision_CameraSettings
    | undefined;
  /** optional LastSecondInfo lastSecond = 19; */
  botCameraSettings?: Vision_CameraSettings | undefined;
  topSaliency?: Uint8Array | undefined;
  botSaliency?: Uint8Array | undefined;
  topFrame?: Uint8Array | undefined;
  botFrame?: Uint8Array | undefined;
  horizontalFieldOfView?: number | undefined;
  verticalFieldOfView?: number | undefined;
  topFrameJPEG?: Uint8Array | undefined;
  botFrameJPEG?: Uint8Array | undefined;
  ATWindowSizeTop?: number | undefined;
  ATWindowSizeBot?: number | undefined;
  ATPercentageTop?: number | undefined;
  ATPercentageBot?: number | undefined;
  redRegions: BBox[];
  refereeHands: Vision_RefereeHandsVisionInfo[];
  refereeHandDetectorSettings?: Vision_RefereeHandDetectorSettings | undefined;
  cropRegion?: BBox | undefined;
}

export enum Vision_PostInfoType {
  pNone = 0,
  pLeft = 1,
  pRight = 2,
  pHome = 4,
  pAway = 8,
  pHomeLeft = 5,
  pHomeRight = 6,
  pAwayLeft = 9,
  pAwayRight = 10,
  UNRECOGNIZED = -1,
}

export function vision_PostInfoTypeFromJSON(object: any): Vision_PostInfoType {
  switch (object) {
    case 0:
    case "pNone":
      return Vision_PostInfoType.pNone;
    case 1:
    case "pLeft":
      return Vision_PostInfoType.pLeft;
    case 2:
    case "pRight":
      return Vision_PostInfoType.pRight;
    case 4:
    case "pHome":
      return Vision_PostInfoType.pHome;
    case 8:
    case "pAway":
      return Vision_PostInfoType.pAway;
    case 5:
    case "pHomeLeft":
      return Vision_PostInfoType.pHomeLeft;
    case 6:
    case "pHomeRight":
      return Vision_PostInfoType.pHomeRight;
    case 9:
    case "pAwayLeft":
      return Vision_PostInfoType.pAwayLeft;
    case 10:
    case "pAwayRight":
      return Vision_PostInfoType.pAwayRight;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Vision_PostInfoType.UNRECOGNIZED;
  }
}

export function vision_PostInfoTypeToJSON(object: Vision_PostInfoType): string {
  switch (object) {
    case Vision_PostInfoType.pNone:
      return "pNone";
    case Vision_PostInfoType.pLeft:
      return "pLeft";
    case Vision_PostInfoType.pRight:
      return "pRight";
    case Vision_PostInfoType.pHome:
      return "pHome";
    case Vision_PostInfoType.pAway:
      return "pAway";
    case Vision_PostInfoType.pHomeLeft:
      return "pHomeLeft";
    case Vision_PostInfoType.pHomeRight:
      return "pHomeRight";
    case Vision_PostInfoType.pAwayLeft:
      return "pAwayLeft";
    case Vision_PostInfoType.pAwayRight:
      return "pAwayRight";
    case Vision_PostInfoType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum Vision_PostInfoDirection {
  pToLeftOf = 0,
  pToRightOf = 1,
  pUnknown = 2,
  UNRECOGNIZED = -1,
}

export function vision_PostInfoDirectionFromJSON(object: any): Vision_PostInfoDirection {
  switch (object) {
    case 0:
    case "pToLeftOf":
      return Vision_PostInfoDirection.pToLeftOf;
    case 1:
    case "pToRightOf":
      return Vision_PostInfoDirection.pToRightOf;
    case 2:
    case "pUnknown":
      return Vision_PostInfoDirection.pUnknown;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Vision_PostInfoDirection.UNRECOGNIZED;
  }
}

export function vision_PostInfoDirectionToJSON(object: Vision_PostInfoDirection): string {
  switch (object) {
    case Vision_PostInfoDirection.pToLeftOf:
      return "pToLeftOf";
    case Vision_PostInfoDirection.pToRightOf:
      return "pToRightOf";
    case Vision_PostInfoDirection.pUnknown:
      return "pUnknown";
    case Vision_PostInfoDirection.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum Vision_Cameras {
  TOP_CAMERA = 0,
  BOT_CAMERA = 1,
  BOTH_CAMERAS = 2,
  OLD_DETECTION = 3,
  UNRECOGNIZED = -1,
}

export function vision_CamerasFromJSON(object: any): Vision_Cameras {
  switch (object) {
    case 0:
    case "TOP_CAMERA":
      return Vision_Cameras.TOP_CAMERA;
    case 1:
    case "BOT_CAMERA":
      return Vision_Cameras.BOT_CAMERA;
    case 2:
    case "BOTH_CAMERAS":
      return Vision_Cameras.BOTH_CAMERAS;
    case 3:
    case "OLD_DETECTION":
      return Vision_Cameras.OLD_DETECTION;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Vision_Cameras.UNRECOGNIZED;
  }
}

export function vision_CamerasToJSON(object: Vision_Cameras): string {
  switch (object) {
    case Vision_Cameras.TOP_CAMERA:
      return "TOP_CAMERA";
    case Vision_Cameras.BOT_CAMERA:
      return "BOT_CAMERA";
    case Vision_Cameras.BOTH_CAMERAS:
      return "BOTH_CAMERAS";
    case Vision_Cameras.OLD_DETECTION:
      return "OLD_DETECTION";
    case Vision_Cameras.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum Vision_FieldFeatureInfoType {
  fNone = 0,
  fLine = 1,
  fCorner = 2,
  fTJunction = 3,
  fPenaltySpot = 4,
  fCentreCircle = 5,
  fFieldLinePoint = 6,
  fXJunction = 7,
  fParallelLines = 8,
  fGoalBoxCorner = 9,
  UNRECOGNIZED = -1,
}

export function vision_FieldFeatureInfoTypeFromJSON(object: any): Vision_FieldFeatureInfoType {
  switch (object) {
    case 0:
    case "fNone":
      return Vision_FieldFeatureInfoType.fNone;
    case 1:
    case "fLine":
      return Vision_FieldFeatureInfoType.fLine;
    case 2:
    case "fCorner":
      return Vision_FieldFeatureInfoType.fCorner;
    case 3:
    case "fTJunction":
      return Vision_FieldFeatureInfoType.fTJunction;
    case 4:
    case "fPenaltySpot":
      return Vision_FieldFeatureInfoType.fPenaltySpot;
    case 5:
    case "fCentreCircle":
      return Vision_FieldFeatureInfoType.fCentreCircle;
    case 6:
    case "fFieldLinePoint":
      return Vision_FieldFeatureInfoType.fFieldLinePoint;
    case 7:
    case "fXJunction":
      return Vision_FieldFeatureInfoType.fXJunction;
    case 8:
    case "fParallelLines":
      return Vision_FieldFeatureInfoType.fParallelLines;
    case 9:
    case "fGoalBoxCorner":
      return Vision_FieldFeatureInfoType.fGoalBoxCorner;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Vision_FieldFeatureInfoType.UNRECOGNIZED;
  }
}

export function vision_FieldFeatureInfoTypeToJSON(object: Vision_FieldFeatureInfoType): string {
  switch (object) {
    case Vision_FieldFeatureInfoType.fNone:
      return "fNone";
    case Vision_FieldFeatureInfoType.fLine:
      return "fLine";
    case Vision_FieldFeatureInfoType.fCorner:
      return "fCorner";
    case Vision_FieldFeatureInfoType.fTJunction:
      return "fTJunction";
    case Vision_FieldFeatureInfoType.fPenaltySpot:
      return "fPenaltySpot";
    case Vision_FieldFeatureInfoType.fCentreCircle:
      return "fCentreCircle";
    case Vision_FieldFeatureInfoType.fFieldLinePoint:
      return "fFieldLinePoint";
    case Vision_FieldFeatureInfoType.fXJunction:
      return "fXJunction";
    case Vision_FieldFeatureInfoType.fParallelLines:
      return "fParallelLines";
    case Vision_FieldFeatureInfoType.fGoalBoxCorner:
      return "fGoalBoxCorner";
    case Vision_FieldFeatureInfoType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum Vision_Colour {
  cGREEN = 0,
  cWHITE = 1,
  cBLACK = 2,
  cBACKGROUND = 3,
  cBODY_PART = 4,
  cNUM_COLOURS = 5,
  UNRECOGNIZED = -1,
}

export function vision_ColourFromJSON(object: any): Vision_Colour {
  switch (object) {
    case 0:
    case "cGREEN":
      return Vision_Colour.cGREEN;
    case 1:
    case "cWHITE":
      return Vision_Colour.cWHITE;
    case 2:
    case "cBLACK":
      return Vision_Colour.cBLACK;
    case 3:
    case "cBACKGROUND":
      return Vision_Colour.cBACKGROUND;
    case 4:
    case "cBODY_PART":
      return Vision_Colour.cBODY_PART;
    case 5:
    case "cNUM_COLOURS":
      return Vision_Colour.cNUM_COLOURS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Vision_Colour.UNRECOGNIZED;
  }
}

export function vision_ColourToJSON(object: Vision_Colour): string {
  switch (object) {
    case Vision_Colour.cGREEN:
      return "cGREEN";
    case Vision_Colour.cWHITE:
      return "cWHITE";
    case Vision_Colour.cBLACK:
      return "cBLACK";
    case Vision_Colour.cBACKGROUND:
      return "cBACKGROUND";
    case Vision_Colour.cBODY_PART:
      return "cBODY_PART";
    case Vision_Colour.cNUM_COLOURS:
      return "cNUM_COLOURS";
    case Vision_Colour.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Vision_BallInfo {
  rr?: RRCoord | undefined;
  radius?: number | undefined;
  imageCoords?: Point | undefined;
  neckRelative?:
    | XYZCoord
    | undefined;
  /**
   * optional float visionVar = 6;
   * optional int32 darkestPoint = 7;
   * optional float angleVar = 8;
   * optional int32 ccdRating = 9;
   * optional int32 lastSeen = 10;
   * optional int32 lifetime = 11;
   */
  topCamera?: boolean | undefined;
}

export interface Vision_PostInfo {
  rr?: RRCoord | undefined;
  type?: Vision_PostInfoType | undefined;
  imageCoords?: BBox | undefined;
  wDistance?: number | undefined;
  kDistance?: number | undefined;
  trustDistance?: boolean | undefined;
  dir?: Vision_PostInfoDirection | undefined;
}

export interface Vision_RobotVisionInfo {
  rr?: RRCoord | undefined;
  type?: RobotVisionInfoType | undefined;
  cameras?: Vision_Cameras | undefined;
  imageCoords?: BBox | undefined;
  topImageCoords?: BBox | undefined;
  botImageCoords?: BBox | undefined;
}

export interface Vision_RefereeHandsVisionInfo {
  left?: Vision_RefereeHand | undefined;
  right?: Vision_RefereeHand | undefined;
}

export interface Vision_RefereeHand {
  topImageCoords?: BBox | undefined;
}

export interface Vision_RANSACLine {
  t1?: number | undefined;
  t2?: number | undefined;
  t3?: number | undefined;
  var?: number | undefined;
  p1?: Point | undefined;
  p2?: Point | undefined;
}

export interface Vision_FieldBoundaryInfo {
  rrBoundary?: Vision_RANSACLine | undefined;
  imageBoundary?: Vision_RANSACLine | undefined;
}

export interface Vision_FieldFeatureInfo {
  rr?: RRCoord | undefined;
  type?:
    | Vision_FieldFeatureInfoType
    | undefined;
  /**
   * optional LineInfo tmpLine = 3;
   * optional bool tmpLineUsed = 4;
   * optional CornerInfo tmpCorner = 5;
   * optional TJunctionInfo tmpTJunction = 6;
   * optional PenaltySpotInfo tmpPenaltyspot = 7;
   * optional CentreCircleInfo tmpCentrecircle = 8;
   * optional FieldLinePointInfo tmpFieldlinepoints = 9;
   * optional XJunctionInfo tmpxjunction = 10;
   * optional ParallelLinesInfo tmpparallellines = 11;
   * optional GoalBoxCornerInfo tmpgoal_box_corner = 12;
   */
  p1?: Point | undefined;
  p2?: Point | undefined;
}

export interface Vision_FieldFeatureInfo_FieldLinePointInfo {
  p?: Point | undefined;
  rrp?: Point | undefined;
}

export interface Vision_FieldFeatureInfo_LineInfo {
  p1?: Point | undefined;
  p2?: Point | undefined;
  t1?: number | undefined;
  t2?: number | undefined;
  t3?: number | undefined;
  rr?: RRCoord | undefined;
}

export interface Vision_FieldFeatureInfo_CornerInfo {
  p?: Point | undefined;
  e1?: Point | undefined;
  e2?: Point | undefined;
}

export interface Vision_FieldFeatureInfo_TJunctionInfo {
  p?: Point | undefined;
}

export interface Vision_FieldFeatureInfo_GoalBoxCornerInfo {
  p?: Point | undefined;
  leftCorner?: boolean | undefined;
}

export interface Vision_FieldFeatureInfo_PenaltySpotInfo {
  p?: Point | undefined;
  w?: number | undefined;
  h?: number | undefined;
}

export interface Vision_FieldFeatureInfo_XJunctionInfo {
  p?: Point | undefined;
}

export interface Vision_FieldFeatureInfo_CentreCircleInfo {
}

export interface Vision_FieldFeatureInfo_ParallelLinesInfo {
  l1?: Vision_FieldFeatureInfo_LineInfo | undefined;
  l2?: Vision_FieldFeatureInfo_LineInfo | undefined;
}

export interface Vision_RegionI {
  isTopCamera?: boolean | undefined;
  boundingBoxRel?: BBox | undefined;
  boundingBoxFovea?: BBox | undefined;
  boundingBoxRaw?: BBox | undefined;
  nRawColsInRegion?: number | undefined;
  nRawRowsInRegion?: number | undefined;
  densityToRaw?: number | undefined;
  yOffsetRaw?: number | undefined;
  xOffsetRaw?: number | undefined;
  rawTotalWidth?: number | undefined;
  rawToFoveaDensity?: number | undefined;
  foveaWidth?: number | undefined;
}

export interface Vision_CameraSettings {
  hflip?: number | undefined;
  vflip?: number | undefined;
  brightness?: number | undefined;
  contrast?: number | undefined;
  saturation?: number | undefined;
  hue?: number | undefined;
  sharpness?: number | undefined;
  backlightCompensation?: number | undefined;
  exposure?: number | undefined;
  gain?: number | undefined;
  whiteBalance?: number | undefined;
  exposureAuto?: number | undefined;
  autoWhiteBalance?: number | undefined;
  autoFocus?: number | undefined;
  exposureAlgorithm?: number | undefined;
  aeTargetAvgLuma?: number | undefined;
  aeTargetAvgLumaDark?: number | undefined;
  aeTargetGain?: number | undefined;
  aeMinVirtGain?: number | undefined;
  aeMaxVirtGain?: number | undefined;
  aeMinVirtAGain?: number | undefined;
  aeMaxVirtAGain?: number | undefined;
  aeTargetExposure?: number | undefined;
  aeUseWeightTable?: boolean | undefined;
}

export interface Vision_RefereeHandDetectorSettings {
  handMinHDistance?: number | undefined;
  handMaxHDistance?: number | undefined;
  handMinVDistance?: number | undefined;
  handMaxVDistance?: number | undefined;
  cropLeft?: number | undefined;
  cropRight?: number | undefined;
  cropTop?: number | undefined;
  cropBottom?: number | undefined;
  enabled?: number | undefined;
  area?: number | undefined;
}

export interface Receiver {
  message: Receiver_SPLStandardMessage[];
  data: Receiver_BroadcastData[];
  lastReceived: number[];
  /** TODO: add the sizes to the message */
  incapacitated: boolean[];
}

export interface Receiver_SPLStandardMessage {
  header?: string | undefined;
  version?: number | undefined;
  playerNum?: number | undefined;
  teamNum?: number | undefined;
  fallen?: number | undefined;
  pose: number[];
  ballAge?: number | undefined;
  ball: number[];
  numOfDataBytes?: number | undefined;
  data?: Uint8Array | undefined;
}

export interface Receiver_BroadcastData {
  playerNum?: number | undefined;
  robotPos: number[];
  ballPosAbs?: AbsCoord | undefined;
  ballPosRR?: RRCoord | undefined;
  sharedStateEstimationBundle?: SharedStateEstimationBundle | undefined;
  behaviourSharedData?: BehaviourSharedData | undefined;
  acB?: ActionType | undefined;
  uptime?: number | undefined;
  gameState?: number | undefined;
}

export interface StateEstimation {
  robotObstacles: StateEstimation_RobotObstacle[];
  robotPos?: AbsCoord | undefined;
  allRobotPos: AbsCoord[];
  ballPosRR?: RRCoord | undefined;
  ballPosRRC?: AbsCoord | undefined;
  ballVelRRC?: AbsCoord | undefined;
  ballVel?: AbsCoord | undefined;
  ballPos?: AbsCoord | undefined;
  teamBallPos?: AbsCoord | undefined;
  teamBallVel?: AbsCoord | undefined;
  sharedStateEstimationBundle?: SharedStateEstimationBundle | undefined;
  havePendingOutgoingSharedBundle?:
    | boolean
    | undefined;
  /** TODO: add the sizes to the message */
  havePendingIncomingSharedBundle: boolean[];
}

export interface StateEstimation_RobotObstacle {
  rr?: RRCoord | undefined;
  type?: RobotVisionInfoType | undefined;
  rrc?: AbsCoord | undefined;
  pos?: AbsCoord | undefined;
  tangentHeadingLeft?: number | undefined;
  tangentHeadingRight?: number | undefined;
  evadeVectorLeft?: RRCoord | undefined;
  evadeVectorRight?: RRCoord | undefined;
}

export interface BehaviourDebugInfo {
  bodyBehaviourHierarchy?: string | undefined;
  headBehaviourHierarchy?: string | undefined;
  haveBallManoeuvreTarget?: boolean | undefined;
  ballManoeuvreTargetX?: number | undefined;
  ballManoeuvreTargetY?: number | undefined;
  ballManoeuvreHeadingError?: number | undefined;
  ballManoeuvreType?: string | undefined;
  ballManoeuvreHard?: boolean | undefined;
  anticipating?: boolean | undefined;
  anticipateX?: number | undefined;
  anticipateY?: number | undefined;
  anticipateH?: number | undefined;
}

/** and finally the top-level blackboard */
export interface Blackboard {
  mask?: number | undefined;
  gameController?: GameController | undefined;
  motion?: Motion | undefined;
  behaviour?: Behaviour | undefined;
  perception?: Perception | undefined;
  kinematics?: Kinematics | undefined;
  vision?: Vision | undefined;
  receiver?: Receiver | undefined;
  stateEstimation?: StateEstimation | undefined;
}

function createBasePairIntInt(): PairIntInt {
  return { first: 0, second: 0 };
}

export const PairIntInt = {
  encode(message: PairIntInt, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.first !== undefined && message.first !== 0) {
      writer.uint32(8).sint32(message.first);
    }
    if (message.second !== undefined && message.second !== 0) {
      writer.uint32(16).sint32(message.second);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PairIntInt {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePairIntInt();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.first = reader.sint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.second = reader.sint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PairIntInt {
    return {
      first: isSet(object.first) ? globalThis.Number(object.first) : 0,
      second: isSet(object.second) ? globalThis.Number(object.second) : 0,
    };
  },

  toJSON(message: PairIntInt): unknown {
    const obj: any = {};
    if (message.first !== undefined && message.first !== 0) {
      obj.first = Math.round(message.first);
    }
    if (message.second !== undefined && message.second !== 0) {
      obj.second = Math.round(message.second);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PairIntInt>, I>>(base?: I): PairIntInt {
    return PairIntInt.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PairIntInt>, I>>(object: I): PairIntInt {
    const message = createBasePairIntInt();
    message.first = object.first ?? 0;
    message.second = object.second ?? 0;
    return message;
  },
};

function createBaseXYZCoord(): XYZCoord {
  return { x: 0, y: 0, z: 0 };
}

export const XYZCoord = {
  encode(message: XYZCoord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.x !== undefined && message.x !== 0) {
      writer.uint32(13).float(message.x);
    }
    if (message.y !== undefined && message.y !== 0) {
      writer.uint32(21).float(message.y);
    }
    if (message.z !== undefined && message.z !== 0) {
      writer.uint32(29).float(message.z);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): XYZCoord {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseXYZCoord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.x = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.y = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.z = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): XYZCoord {
    return {
      x: isSet(object.x) ? globalThis.Number(object.x) : 0,
      y: isSet(object.y) ? globalThis.Number(object.y) : 0,
      z: isSet(object.z) ? globalThis.Number(object.z) : 0,
    };
  },

  toJSON(message: XYZCoord): unknown {
    const obj: any = {};
    if (message.x !== undefined && message.x !== 0) {
      obj.x = message.x;
    }
    if (message.y !== undefined && message.y !== 0) {
      obj.y = message.y;
    }
    if (message.z !== undefined && message.z !== 0) {
      obj.z = message.z;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<XYZCoord>, I>>(base?: I): XYZCoord {
    return XYZCoord.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<XYZCoord>, I>>(object: I): XYZCoord {
    const message = createBaseXYZCoord();
    message.x = object.x ?? 0;
    message.y = object.y ?? 0;
    message.z = object.z ?? 0;
    return message;
  },
};

function createBaseActionCommandAll(): ActionCommandAll {
  return { head: undefined, body: undefined, leds: undefined, stiffen: 0 };
}

export const ActionCommandAll = {
  encode(message: ActionCommandAll, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.head !== undefined) {
      ActionCommandAll_Head.encode(message.head, writer.uint32(10).fork()).ldelim();
    }
    if (message.body !== undefined) {
      ActionCommandAll_Body.encode(message.body, writer.uint32(18).fork()).ldelim();
    }
    if (message.leds !== undefined) {
      ActionCommandAll_LED.encode(message.leds, writer.uint32(26).fork()).ldelim();
    }
    if (message.stiffen !== undefined && message.stiffen !== 0) {
      writer.uint32(40).int32(message.stiffen);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActionCommandAll {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActionCommandAll();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.head = ActionCommandAll_Head.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.body = ActionCommandAll_Body.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.leds = ActionCommandAll_LED.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.stiffen = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActionCommandAll {
    return {
      head: isSet(object.head) ? ActionCommandAll_Head.fromJSON(object.head) : undefined,
      body: isSet(object.body) ? ActionCommandAll_Body.fromJSON(object.body) : undefined,
      leds: isSet(object.leds) ? ActionCommandAll_LED.fromJSON(object.leds) : undefined,
      stiffen: isSet(object.stiffen) ? actionCommandAll_StiffenFromJSON(object.stiffen) : 0,
    };
  },

  toJSON(message: ActionCommandAll): unknown {
    const obj: any = {};
    if (message.head !== undefined) {
      obj.head = ActionCommandAll_Head.toJSON(message.head);
    }
    if (message.body !== undefined) {
      obj.body = ActionCommandAll_Body.toJSON(message.body);
    }
    if (message.leds !== undefined) {
      obj.leds = ActionCommandAll_LED.toJSON(message.leds);
    }
    if (message.stiffen !== undefined && message.stiffen !== 0) {
      obj.stiffen = actionCommandAll_StiffenToJSON(message.stiffen);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActionCommandAll>, I>>(base?: I): ActionCommandAll {
    return ActionCommandAll.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActionCommandAll>, I>>(object: I): ActionCommandAll {
    const message = createBaseActionCommandAll();
    message.head = (object.head !== undefined && object.head !== null)
      ? ActionCommandAll_Head.fromPartial(object.head)
      : undefined;
    message.body = (object.body !== undefined && object.body !== null)
      ? ActionCommandAll_Body.fromPartial(object.body)
      : undefined;
    message.leds = (object.leds !== undefined && object.leds !== null)
      ? ActionCommandAll_LED.fromPartial(object.leds)
      : undefined;
    message.stiffen = object.stiffen ?? 0;
    return message;
  },
};

function createBaseActionCommandAll_Head(): ActionCommandAll_Head {
  return { yaw: 0, pitch: 0, isRelative: false, yawSpeed: 0, pitchSpeed: 0 };
}

export const ActionCommandAll_Head = {
  encode(message: ActionCommandAll_Head, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.yaw !== undefined && message.yaw !== 0) {
      writer.uint32(13).float(message.yaw);
    }
    if (message.pitch !== undefined && message.pitch !== 0) {
      writer.uint32(21).float(message.pitch);
    }
    if (message.isRelative !== undefined && message.isRelative !== false) {
      writer.uint32(24).bool(message.isRelative);
    }
    if (message.yawSpeed !== undefined && message.yawSpeed !== 0) {
      writer.uint32(37).float(message.yawSpeed);
    }
    if (message.pitchSpeed !== undefined && message.pitchSpeed !== 0) {
      writer.uint32(45).float(message.pitchSpeed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActionCommandAll_Head {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActionCommandAll_Head();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.yaw = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.pitch = reader.float();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.isRelative = reader.bool();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.yawSpeed = reader.float();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.pitchSpeed = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActionCommandAll_Head {
    return {
      yaw: isSet(object.yaw) ? globalThis.Number(object.yaw) : 0,
      pitch: isSet(object.pitch) ? globalThis.Number(object.pitch) : 0,
      isRelative: isSet(object.isRelative) ? globalThis.Boolean(object.isRelative) : false,
      yawSpeed: isSet(object.yawSpeed) ? globalThis.Number(object.yawSpeed) : 0,
      pitchSpeed: isSet(object.pitchSpeed) ? globalThis.Number(object.pitchSpeed) : 0,
    };
  },

  toJSON(message: ActionCommandAll_Head): unknown {
    const obj: any = {};
    if (message.yaw !== undefined && message.yaw !== 0) {
      obj.yaw = message.yaw;
    }
    if (message.pitch !== undefined && message.pitch !== 0) {
      obj.pitch = message.pitch;
    }
    if (message.isRelative !== undefined && message.isRelative !== false) {
      obj.isRelative = message.isRelative;
    }
    if (message.yawSpeed !== undefined && message.yawSpeed !== 0) {
      obj.yawSpeed = message.yawSpeed;
    }
    if (message.pitchSpeed !== undefined && message.pitchSpeed !== 0) {
      obj.pitchSpeed = message.pitchSpeed;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActionCommandAll_Head>, I>>(base?: I): ActionCommandAll_Head {
    return ActionCommandAll_Head.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActionCommandAll_Head>, I>>(object: I): ActionCommandAll_Head {
    const message = createBaseActionCommandAll_Head();
    message.yaw = object.yaw ?? 0;
    message.pitch = object.pitch ?? 0;
    message.isRelative = object.isRelative ?? false;
    message.yawSpeed = object.yawSpeed ?? 0;
    message.pitchSpeed = object.pitchSpeed ?? 0;
    return message;
  },
};

function createBaseActionCommandAll_Body(): ActionCommandAll_Body {
  return {
    actionType: 0,
    forward: 0,
    left: 0,
    turn: 0,
    power: 0,
    bend: 0,
    speed: 0,
    kickDirection: 0,
    foot: 0,
    isFast: false,
    misalignedKick: false,
    useShuffle: false,
    leftArmBehind: false,
    rightArmBehind: false,
    blocking: false,
  };
}

export const ActionCommandAll_Body = {
  encode(message: ActionCommandAll_Body, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.actionType !== undefined && message.actionType !== 0) {
      writer.uint32(8).int32(message.actionType);
    }
    if (message.forward !== undefined && message.forward !== 0) {
      writer.uint32(16).sint32(message.forward);
    }
    if (message.left !== undefined && message.left !== 0) {
      writer.uint32(24).sint32(message.left);
    }
    if (message.turn !== undefined && message.turn !== 0) {
      writer.uint32(37).float(message.turn);
    }
    if (message.power !== undefined && message.power !== 0) {
      writer.uint32(45).float(message.power);
    }
    if (message.bend !== undefined && message.bend !== 0) {
      writer.uint32(53).float(message.bend);
    }
    if (message.speed !== undefined && message.speed !== 0) {
      writer.uint32(61).float(message.speed);
    }
    if (message.kickDirection !== undefined && message.kickDirection !== 0) {
      writer.uint32(69).float(message.kickDirection);
    }
    if (message.foot !== undefined && message.foot !== 0) {
      writer.uint32(72).int32(message.foot);
    }
    if (message.isFast !== undefined && message.isFast !== false) {
      writer.uint32(80).bool(message.isFast);
    }
    if (message.misalignedKick !== undefined && message.misalignedKick !== false) {
      writer.uint32(88).bool(message.misalignedKick);
    }
    if (message.useShuffle !== undefined && message.useShuffle !== false) {
      writer.uint32(96).bool(message.useShuffle);
    }
    if (message.leftArmBehind !== undefined && message.leftArmBehind !== false) {
      writer.uint32(104).bool(message.leftArmBehind);
    }
    if (message.rightArmBehind !== undefined && message.rightArmBehind !== false) {
      writer.uint32(112).bool(message.rightArmBehind);
    }
    if (message.blocking !== undefined && message.blocking !== false) {
      writer.uint32(120).bool(message.blocking);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActionCommandAll_Body {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActionCommandAll_Body();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.actionType = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.forward = reader.sint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.left = reader.sint32();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.turn = reader.float();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.power = reader.float();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }

          message.bend = reader.float();
          continue;
        case 7:
          if (tag !== 61) {
            break;
          }

          message.speed = reader.float();
          continue;
        case 8:
          if (tag !== 69) {
            break;
          }

          message.kickDirection = reader.float();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.foot = reader.int32() as any;
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.isFast = reader.bool();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.misalignedKick = reader.bool();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.useShuffle = reader.bool();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.leftArmBehind = reader.bool();
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.rightArmBehind = reader.bool();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.blocking = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActionCommandAll_Body {
    return {
      actionType: isSet(object.actionType) ? actionTypeFromJSON(object.actionType) : 0,
      forward: isSet(object.forward) ? globalThis.Number(object.forward) : 0,
      left: isSet(object.left) ? globalThis.Number(object.left) : 0,
      turn: isSet(object.turn) ? globalThis.Number(object.turn) : 0,
      power: isSet(object.power) ? globalThis.Number(object.power) : 0,
      bend: isSet(object.bend) ? globalThis.Number(object.bend) : 0,
      speed: isSet(object.speed) ? globalThis.Number(object.speed) : 0,
      kickDirection: isSet(object.kickDirection) ? globalThis.Number(object.kickDirection) : 0,
      foot: isSet(object.foot) ? actionCommandAll_Body_FootFromJSON(object.foot) : 0,
      isFast: isSet(object.isFast) ? globalThis.Boolean(object.isFast) : false,
      misalignedKick: isSet(object.misalignedKick) ? globalThis.Boolean(object.misalignedKick) : false,
      useShuffle: isSet(object.useShuffle) ? globalThis.Boolean(object.useShuffle) : false,
      leftArmBehind: isSet(object.leftArmBehind) ? globalThis.Boolean(object.leftArmBehind) : false,
      rightArmBehind: isSet(object.rightArmBehind) ? globalThis.Boolean(object.rightArmBehind) : false,
      blocking: isSet(object.blocking) ? globalThis.Boolean(object.blocking) : false,
    };
  },

  toJSON(message: ActionCommandAll_Body): unknown {
    const obj: any = {};
    if (message.actionType !== undefined && message.actionType !== 0) {
      obj.actionType = actionTypeToJSON(message.actionType);
    }
    if (message.forward !== undefined && message.forward !== 0) {
      obj.forward = Math.round(message.forward);
    }
    if (message.left !== undefined && message.left !== 0) {
      obj.left = Math.round(message.left);
    }
    if (message.turn !== undefined && message.turn !== 0) {
      obj.turn = message.turn;
    }
    if (message.power !== undefined && message.power !== 0) {
      obj.power = message.power;
    }
    if (message.bend !== undefined && message.bend !== 0) {
      obj.bend = message.bend;
    }
    if (message.speed !== undefined && message.speed !== 0) {
      obj.speed = message.speed;
    }
    if (message.kickDirection !== undefined && message.kickDirection !== 0) {
      obj.kickDirection = message.kickDirection;
    }
    if (message.foot !== undefined && message.foot !== 0) {
      obj.foot = actionCommandAll_Body_FootToJSON(message.foot);
    }
    if (message.isFast !== undefined && message.isFast !== false) {
      obj.isFast = message.isFast;
    }
    if (message.misalignedKick !== undefined && message.misalignedKick !== false) {
      obj.misalignedKick = message.misalignedKick;
    }
    if (message.useShuffle !== undefined && message.useShuffle !== false) {
      obj.useShuffle = message.useShuffle;
    }
    if (message.leftArmBehind !== undefined && message.leftArmBehind !== false) {
      obj.leftArmBehind = message.leftArmBehind;
    }
    if (message.rightArmBehind !== undefined && message.rightArmBehind !== false) {
      obj.rightArmBehind = message.rightArmBehind;
    }
    if (message.blocking !== undefined && message.blocking !== false) {
      obj.blocking = message.blocking;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActionCommandAll_Body>, I>>(base?: I): ActionCommandAll_Body {
    return ActionCommandAll_Body.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActionCommandAll_Body>, I>>(object: I): ActionCommandAll_Body {
    const message = createBaseActionCommandAll_Body();
    message.actionType = object.actionType ?? 0;
    message.forward = object.forward ?? 0;
    message.left = object.left ?? 0;
    message.turn = object.turn ?? 0;
    message.power = object.power ?? 0;
    message.bend = object.bend ?? 0;
    message.speed = object.speed ?? 0;
    message.kickDirection = object.kickDirection ?? 0;
    message.foot = object.foot ?? 0;
    message.isFast = object.isFast ?? false;
    message.misalignedKick = object.misalignedKick ?? false;
    message.useShuffle = object.useShuffle ?? false;
    message.leftArmBehind = object.leftArmBehind ?? false;
    message.rightArmBehind = object.rightArmBehind ?? false;
    message.blocking = object.blocking ?? false;
    return message;
  },
};

function createBaseActionCommandAll_LED(): ActionCommandAll_LED {
  return {
    leftEar: 0,
    rightEar: 0,
    leftEye: undefined,
    rightEye: undefined,
    chestButton: undefined,
    leftFoot: undefined,
    rightFoot: undefined,
  };
}

export const ActionCommandAll_LED = {
  encode(message: ActionCommandAll_LED, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.leftEar !== undefined && message.leftEar !== 0) {
      writer.uint32(8).uint32(message.leftEar);
    }
    if (message.rightEar !== undefined && message.rightEar !== 0) {
      writer.uint32(16).uint32(message.rightEar);
    }
    if (message.leftEye !== undefined) {
      ActionCommandAll_LED_rgb.encode(message.leftEye, writer.uint32(26).fork()).ldelim();
    }
    if (message.rightEye !== undefined) {
      ActionCommandAll_LED_rgb.encode(message.rightEye, writer.uint32(34).fork()).ldelim();
    }
    if (message.chestButton !== undefined) {
      ActionCommandAll_LED_rgb.encode(message.chestButton, writer.uint32(42).fork()).ldelim();
    }
    if (message.leftFoot !== undefined) {
      ActionCommandAll_LED_rgb.encode(message.leftFoot, writer.uint32(50).fork()).ldelim();
    }
    if (message.rightFoot !== undefined) {
      ActionCommandAll_LED_rgb.encode(message.rightFoot, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActionCommandAll_LED {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActionCommandAll_LED();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.leftEar = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.rightEar = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.leftEye = ActionCommandAll_LED_rgb.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.rightEye = ActionCommandAll_LED_rgb.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.chestButton = ActionCommandAll_LED_rgb.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.leftFoot = ActionCommandAll_LED_rgb.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.rightFoot = ActionCommandAll_LED_rgb.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActionCommandAll_LED {
    return {
      leftEar: isSet(object.leftEar) ? globalThis.Number(object.leftEar) : 0,
      rightEar: isSet(object.rightEar) ? globalThis.Number(object.rightEar) : 0,
      leftEye: isSet(object.leftEye) ? ActionCommandAll_LED_rgb.fromJSON(object.leftEye) : undefined,
      rightEye: isSet(object.rightEye) ? ActionCommandAll_LED_rgb.fromJSON(object.rightEye) : undefined,
      chestButton: isSet(object.chestButton) ? ActionCommandAll_LED_rgb.fromJSON(object.chestButton) : undefined,
      leftFoot: isSet(object.leftFoot) ? ActionCommandAll_LED_rgb.fromJSON(object.leftFoot) : undefined,
      rightFoot: isSet(object.rightFoot) ? ActionCommandAll_LED_rgb.fromJSON(object.rightFoot) : undefined,
    };
  },

  toJSON(message: ActionCommandAll_LED): unknown {
    const obj: any = {};
    if (message.leftEar !== undefined && message.leftEar !== 0) {
      obj.leftEar = Math.round(message.leftEar);
    }
    if (message.rightEar !== undefined && message.rightEar !== 0) {
      obj.rightEar = Math.round(message.rightEar);
    }
    if (message.leftEye !== undefined) {
      obj.leftEye = ActionCommandAll_LED_rgb.toJSON(message.leftEye);
    }
    if (message.rightEye !== undefined) {
      obj.rightEye = ActionCommandAll_LED_rgb.toJSON(message.rightEye);
    }
    if (message.chestButton !== undefined) {
      obj.chestButton = ActionCommandAll_LED_rgb.toJSON(message.chestButton);
    }
    if (message.leftFoot !== undefined) {
      obj.leftFoot = ActionCommandAll_LED_rgb.toJSON(message.leftFoot);
    }
    if (message.rightFoot !== undefined) {
      obj.rightFoot = ActionCommandAll_LED_rgb.toJSON(message.rightFoot);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActionCommandAll_LED>, I>>(base?: I): ActionCommandAll_LED {
    return ActionCommandAll_LED.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActionCommandAll_LED>, I>>(object: I): ActionCommandAll_LED {
    const message = createBaseActionCommandAll_LED();
    message.leftEar = object.leftEar ?? 0;
    message.rightEar = object.rightEar ?? 0;
    message.leftEye = (object.leftEye !== undefined && object.leftEye !== null)
      ? ActionCommandAll_LED_rgb.fromPartial(object.leftEye)
      : undefined;
    message.rightEye = (object.rightEye !== undefined && object.rightEye !== null)
      ? ActionCommandAll_LED_rgb.fromPartial(object.rightEye)
      : undefined;
    message.chestButton = (object.chestButton !== undefined && object.chestButton !== null)
      ? ActionCommandAll_LED_rgb.fromPartial(object.chestButton)
      : undefined;
    message.leftFoot = (object.leftFoot !== undefined && object.leftFoot !== null)
      ? ActionCommandAll_LED_rgb.fromPartial(object.leftFoot)
      : undefined;
    message.rightFoot = (object.rightFoot !== undefined && object.rightFoot !== null)
      ? ActionCommandAll_LED_rgb.fromPartial(object.rightFoot)
      : undefined;
    return message;
  },
};

function createBaseActionCommandAll_LED_rgb(): ActionCommandAll_LED_rgb {
  return { red: false, green: false, blue: false };
}

export const ActionCommandAll_LED_rgb = {
  encode(message: ActionCommandAll_LED_rgb, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.red !== undefined && message.red !== false) {
      writer.uint32(8).bool(message.red);
    }
    if (message.green !== undefined && message.green !== false) {
      writer.uint32(16).bool(message.green);
    }
    if (message.blue !== undefined && message.blue !== false) {
      writer.uint32(24).bool(message.blue);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActionCommandAll_LED_rgb {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActionCommandAll_LED_rgb();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.red = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.green = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.blue = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActionCommandAll_LED_rgb {
    return {
      red: isSet(object.red) ? globalThis.Boolean(object.red) : false,
      green: isSet(object.green) ? globalThis.Boolean(object.green) : false,
      blue: isSet(object.blue) ? globalThis.Boolean(object.blue) : false,
    };
  },

  toJSON(message: ActionCommandAll_LED_rgb): unknown {
    const obj: any = {};
    if (message.red !== undefined && message.red !== false) {
      obj.red = message.red;
    }
    if (message.green !== undefined && message.green !== false) {
      obj.green = message.green;
    }
    if (message.blue !== undefined && message.blue !== false) {
      obj.blue = message.blue;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActionCommandAll_LED_rgb>, I>>(base?: I): ActionCommandAll_LED_rgb {
    return ActionCommandAll_LED_rgb.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActionCommandAll_LED_rgb>, I>>(object: I): ActionCommandAll_LED_rgb {
    const message = createBaseActionCommandAll_LED_rgb();
    message.red = object.red ?? false;
    message.green = object.green ?? false;
    message.blue = object.blue ?? false;
    return message;
  },
};

function createBaseRepeatedInt(): RepeatedInt {
  return { values: [] };
}

export const RepeatedInt = {
  encode(message: RepeatedInt, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.values) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RepeatedInt {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRepeatedInt();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 8) {
            message.values.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.values.push(reader.int32());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RepeatedInt {
    return {
      values: globalThis.Array.isArray(object?.values) ? object.values.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: RepeatedInt): unknown {
    const obj: any = {};
    if (message.values?.length) {
      obj.values = message.values.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RepeatedInt>, I>>(base?: I): RepeatedInt {
    return RepeatedInt.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RepeatedInt>, I>>(object: I): RepeatedInt {
    const message = createBaseRepeatedInt();
    message.values = object.values?.map((e) => e) || [];
    return message;
  },
};

function createBaseFloatMatrix(): FloatMatrix {
  return { size1: 0, size2: 0, data: [] };
}

export const FloatMatrix = {
  encode(message: FloatMatrix, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.size1 !== undefined && message.size1 !== 0) {
      writer.uint32(8).uint32(message.size1);
    }
    if (message.size2 !== undefined && message.size2 !== 0) {
      writer.uint32(16).uint32(message.size2);
    }
    writer.uint32(26).fork();
    for (const v of message.data) {
      writer.float(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FloatMatrix {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFloatMatrix();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.size1 = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.size2 = reader.uint32();
          continue;
        case 3:
          if (tag === 29) {
            message.data.push(reader.float());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.data.push(reader.float());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FloatMatrix {
    return {
      size1: isSet(object.size1) ? globalThis.Number(object.size1) : 0,
      size2: isSet(object.size2) ? globalThis.Number(object.size2) : 0,
      data: globalThis.Array.isArray(object?.data) ? object.data.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: FloatMatrix): unknown {
    const obj: any = {};
    if (message.size1 !== undefined && message.size1 !== 0) {
      obj.size1 = Math.round(message.size1);
    }
    if (message.size2 !== undefined && message.size2 !== 0) {
      obj.size2 = Math.round(message.size2);
    }
    if (message.data?.length) {
      obj.data = message.data;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FloatMatrix>, I>>(base?: I): FloatMatrix {
    return FloatMatrix.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FloatMatrix>, I>>(object: I): FloatMatrix {
    const message = createBaseFloatMatrix();
    message.size1 = object.size1 ?? 0;
    message.size2 = object.size2 ?? 0;
    message.data = object.data?.map((e) => e) || [];
    return message;
  },
};

function createBaseAbsCoord(): AbsCoord {
  return { vec: [], var: undefined, weight: 0 };
}

export const AbsCoord = {
  encode(message: AbsCoord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.vec) {
      writer.float(v);
    }
    writer.ldelim();
    if (message.var !== undefined) {
      FloatMatrix.encode(message.var, writer.uint32(18).fork()).ldelim();
    }
    if (message.weight !== undefined && message.weight !== 0) {
      writer.uint32(29).float(message.weight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AbsCoord {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAbsCoord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 13) {
            message.vec.push(reader.float());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.vec.push(reader.float());
            }

            continue;
          }

          break;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.var = FloatMatrix.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.weight = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AbsCoord {
    return {
      vec: globalThis.Array.isArray(object?.vec) ? object.vec.map((e: any) => globalThis.Number(e)) : [],
      var: isSet(object.var) ? FloatMatrix.fromJSON(object.var) : undefined,
      weight: isSet(object.weight) ? globalThis.Number(object.weight) : 0,
    };
  },

  toJSON(message: AbsCoord): unknown {
    const obj: any = {};
    if (message.vec?.length) {
      obj.vec = message.vec;
    }
    if (message.var !== undefined) {
      obj.var = FloatMatrix.toJSON(message.var);
    }
    if (message.weight !== undefined && message.weight !== 0) {
      obj.weight = message.weight;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AbsCoord>, I>>(base?: I): AbsCoord {
    return AbsCoord.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AbsCoord>, I>>(object: I): AbsCoord {
    const message = createBaseAbsCoord();
    message.vec = object.vec?.map((e) => e) || [];
    message.var = (object.var !== undefined && object.var !== null) ? FloatMatrix.fromPartial(object.var) : undefined;
    message.weight = object.weight ?? 0;
    return message;
  },
};

function createBaseSharedStateEstimationBundle(): SharedStateEstimationBundle {
  return { robotPos: undefined, ballPosRRC: undefined, ballVelRRC: undefined, haveBallUpdate: false };
}

export const SharedStateEstimationBundle = {
  encode(message: SharedStateEstimationBundle, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.robotPos !== undefined) {
      AbsCoord.encode(message.robotPos, writer.uint32(10).fork()).ldelim();
    }
    if (message.ballPosRRC !== undefined) {
      AbsCoord.encode(message.ballPosRRC, writer.uint32(18).fork()).ldelim();
    }
    if (message.ballVelRRC !== undefined) {
      AbsCoord.encode(message.ballVelRRC, writer.uint32(26).fork()).ldelim();
    }
    if (message.haveBallUpdate !== undefined && message.haveBallUpdate !== false) {
      writer.uint32(32).bool(message.haveBallUpdate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SharedStateEstimationBundle {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSharedStateEstimationBundle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.robotPos = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ballPosRRC = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.ballVelRRC = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.haveBallUpdate = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SharedStateEstimationBundle {
    return {
      robotPos: isSet(object.robotPos) ? AbsCoord.fromJSON(object.robotPos) : undefined,
      ballPosRRC: isSet(object.ballPosRRC) ? AbsCoord.fromJSON(object.ballPosRRC) : undefined,
      ballVelRRC: isSet(object.ballVelRRC) ? AbsCoord.fromJSON(object.ballVelRRC) : undefined,
      haveBallUpdate: isSet(object.haveBallUpdate) ? globalThis.Boolean(object.haveBallUpdate) : false,
    };
  },

  toJSON(message: SharedStateEstimationBundle): unknown {
    const obj: any = {};
    if (message.robotPos !== undefined) {
      obj.robotPos = AbsCoord.toJSON(message.robotPos);
    }
    if (message.ballPosRRC !== undefined) {
      obj.ballPosRRC = AbsCoord.toJSON(message.ballPosRRC);
    }
    if (message.ballVelRRC !== undefined) {
      obj.ballVelRRC = AbsCoord.toJSON(message.ballVelRRC);
    }
    if (message.haveBallUpdate !== undefined && message.haveBallUpdate !== false) {
      obj.haveBallUpdate = message.haveBallUpdate;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SharedStateEstimationBundle>, I>>(base?: I): SharedStateEstimationBundle {
    return SharedStateEstimationBundle.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SharedStateEstimationBundle>, I>>(object: I): SharedStateEstimationBundle {
    const message = createBaseSharedStateEstimationBundle();
    message.robotPos = (object.robotPos !== undefined && object.robotPos !== null)
      ? AbsCoord.fromPartial(object.robotPos)
      : undefined;
    message.ballPosRRC = (object.ballPosRRC !== undefined && object.ballPosRRC !== null)
      ? AbsCoord.fromPartial(object.ballPosRRC)
      : undefined;
    message.ballVelRRC = (object.ballVelRRC !== undefined && object.ballVelRRC !== null)
      ? AbsCoord.fromPartial(object.ballVelRRC)
      : undefined;
    message.haveBallUpdate = object.haveBallUpdate ?? false;
    return message;
  },
};

function createBaseJointValues(): JointValues {
  return { angles: [], stiffnesses: [], temperatures: [], currents: [] };
}

export const JointValues = {
  encode(message: JointValues, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.angles) {
      writer.float(v);
    }
    writer.ldelim();
    writer.uint32(18).fork();
    for (const v of message.stiffnesses) {
      writer.float(v);
    }
    writer.ldelim();
    writer.uint32(26).fork();
    for (const v of message.temperatures) {
      writer.float(v);
    }
    writer.ldelim();
    writer.uint32(34).fork();
    for (const v of message.currents) {
      writer.float(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JointValues {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJointValues();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 13) {
            message.angles.push(reader.float());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.angles.push(reader.float());
            }

            continue;
          }

          break;
        case 2:
          if (tag === 21) {
            message.stiffnesses.push(reader.float());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.stiffnesses.push(reader.float());
            }

            continue;
          }

          break;
        case 3:
          if (tag === 29) {
            message.temperatures.push(reader.float());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.temperatures.push(reader.float());
            }

            continue;
          }

          break;
        case 4:
          if (tag === 37) {
            message.currents.push(reader.float());

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.currents.push(reader.float());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): JointValues {
    return {
      angles: globalThis.Array.isArray(object?.angles) ? object.angles.map((e: any) => globalThis.Number(e)) : [],
      stiffnesses: globalThis.Array.isArray(object?.stiffnesses)
        ? object.stiffnesses.map((e: any) => globalThis.Number(e))
        : [],
      temperatures: globalThis.Array.isArray(object?.temperatures)
        ? object.temperatures.map((e: any) => globalThis.Number(e))
        : [],
      currents: globalThis.Array.isArray(object?.currents) ? object.currents.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: JointValues): unknown {
    const obj: any = {};
    if (message.angles?.length) {
      obj.angles = message.angles;
    }
    if (message.stiffnesses?.length) {
      obj.stiffnesses = message.stiffnesses;
    }
    if (message.temperatures?.length) {
      obj.temperatures = message.temperatures;
    }
    if (message.currents?.length) {
      obj.currents = message.currents;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<JointValues>, I>>(base?: I): JointValues {
    return JointValues.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<JointValues>, I>>(object: I): JointValues {
    const message = createBaseJointValues();
    message.angles = object.angles?.map((e) => e) || [];
    message.stiffnesses = object.stiffnesses?.map((e) => e) || [];
    message.temperatures = object.temperatures?.map((e) => e) || [];
    message.currents = object.currents?.map((e) => e) || [];
    return message;
  },
};

function createBaseSensorValues(): SensorValues {
  return { joints: undefined, sensors: [] };
}

export const SensorValues = {
  encode(message: SensorValues, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.joints !== undefined) {
      JointValues.encode(message.joints, writer.uint32(10).fork()).ldelim();
    }
    writer.uint32(18).fork();
    for (const v of message.sensors) {
      writer.float(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SensorValues {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSensorValues();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.joints = JointValues.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag === 21) {
            message.sensors.push(reader.float());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.sensors.push(reader.float());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SensorValues {
    return {
      joints: isSet(object.joints) ? JointValues.fromJSON(object.joints) : undefined,
      sensors: globalThis.Array.isArray(object?.sensors) ? object.sensors.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: SensorValues): unknown {
    const obj: any = {};
    if (message.joints !== undefined) {
      obj.joints = JointValues.toJSON(message.joints);
    }
    if (message.sensors?.length) {
      obj.sensors = message.sensors;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SensorValues>, I>>(base?: I): SensorValues {
    return SensorValues.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SensorValues>, I>>(object: I): SensorValues {
    const message = createBaseSensorValues();
    message.joints = (object.joints !== undefined && object.joints !== null)
      ? JointValues.fromPartial(object.joints)
      : undefined;
    message.sensors = object.sensors?.map((e) => e) || [];
    return message;
  },
};

function createBaseGameController(): GameController {
  return { teamRed: false, playerNumber: 0, ourTeam: undefined };
}

export const GameController = {
  encode(message: GameController, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.teamRed !== undefined && message.teamRed !== false) {
      writer.uint32(8).bool(message.teamRed);
    }
    if (message.playerNumber !== undefined && message.playerNumber !== 0) {
      writer.uint32(16).int32(message.playerNumber);
    }
    if (message.ourTeam !== undefined) {
      GameController_TeamInfo.encode(message.ourTeam, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GameController {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGameController();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.teamRed = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.playerNumber = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.ourTeam = GameController_TeamInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GameController {
    return {
      teamRed: isSet(object.teamRed) ? globalThis.Boolean(object.teamRed) : false,
      playerNumber: isSet(object.playerNumber) ? globalThis.Number(object.playerNumber) : 0,
      ourTeam: isSet(object.ourTeam) ? GameController_TeamInfo.fromJSON(object.ourTeam) : undefined,
    };
  },

  toJSON(message: GameController): unknown {
    const obj: any = {};
    if (message.teamRed !== undefined && message.teamRed !== false) {
      obj.teamRed = message.teamRed;
    }
    if (message.playerNumber !== undefined && message.playerNumber !== 0) {
      obj.playerNumber = Math.round(message.playerNumber);
    }
    if (message.ourTeam !== undefined) {
      obj.ourTeam = GameController_TeamInfo.toJSON(message.ourTeam);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GameController>, I>>(base?: I): GameController {
    return GameController.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GameController>, I>>(object: I): GameController {
    const message = createBaseGameController();
    message.teamRed = object.teamRed ?? false;
    message.playerNumber = object.playerNumber ?? 0;
    message.ourTeam = (object.ourTeam !== undefined && object.ourTeam !== null)
      ? GameController_TeamInfo.fromPartial(object.ourTeam)
      : undefined;
    return message;
  },
};

function createBaseGameController_TeamInfo(): GameController_TeamInfo {
  return { teamNumber: 0 };
}

export const GameController_TeamInfo = {
  encode(message: GameController_TeamInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.teamNumber !== undefined && message.teamNumber !== 0) {
      writer.uint32(8).int32(message.teamNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GameController_TeamInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGameController_TeamInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.teamNumber = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GameController_TeamInfo {
    return { teamNumber: isSet(object.teamNumber) ? globalThis.Number(object.teamNumber) : 0 };
  },

  toJSON(message: GameController_TeamInfo): unknown {
    const obj: any = {};
    if (message.teamNumber !== undefined && message.teamNumber !== 0) {
      obj.teamNumber = Math.round(message.teamNumber);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GameController_TeamInfo>, I>>(base?: I): GameController_TeamInfo {
    return GameController_TeamInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GameController_TeamInfo>, I>>(object: I): GameController_TeamInfo {
    const message = createBaseGameController_TeamInfo();
    message.teamNumber = object.teamNumber ?? 0;
    return message;
  },
};

function createBaseMotion(): Motion {
  return {
    sensors: undefined,
    pose: undefined,
    com: undefined,
    odometry: undefined,
    active: undefined,
    jointRequest: undefined,
    motionDebugInfo: undefined,
  };
}

export const Motion = {
  encode(message: Motion, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sensors !== undefined) {
      SensorValues.encode(message.sensors, writer.uint32(10).fork()).ldelim();
    }
    if (message.pose !== undefined) {
      Motion_Pose.encode(message.pose, writer.uint32(18).fork()).ldelim();
    }
    if (message.com !== undefined) {
      XYZCoord.encode(message.com, writer.uint32(26).fork()).ldelim();
    }
    if (message.odometry !== undefined) {
      Motion_Odometry.encode(message.odometry, writer.uint32(34).fork()).ldelim();
    }
    if (message.active !== undefined) {
      ActionCommandAll.encode(message.active, writer.uint32(42).fork()).ldelim();
    }
    if (message.jointRequest !== undefined) {
      JointValues.encode(message.jointRequest, writer.uint32(50).fork()).ldelim();
    }
    if (message.motionDebugInfo !== undefined) {
      Motion_MotionDebugInfo.encode(message.motionDebugInfo, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Motion {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMotion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sensors = SensorValues.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pose = Motion_Pose.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.com = XYZCoord.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.odometry = Motion_Odometry.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.active = ActionCommandAll.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.jointRequest = JointValues.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.motionDebugInfo = Motion_MotionDebugInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Motion {
    return {
      sensors: isSet(object.sensors) ? SensorValues.fromJSON(object.sensors) : undefined,
      pose: isSet(object.pose) ? Motion_Pose.fromJSON(object.pose) : undefined,
      com: isSet(object.com) ? XYZCoord.fromJSON(object.com) : undefined,
      odometry: isSet(object.odometry) ? Motion_Odometry.fromJSON(object.odometry) : undefined,
      active: isSet(object.active) ? ActionCommandAll.fromJSON(object.active) : undefined,
      jointRequest: isSet(object.jointRequest) ? JointValues.fromJSON(object.jointRequest) : undefined,
      motionDebugInfo: isSet(object.motionDebugInfo)
        ? Motion_MotionDebugInfo.fromJSON(object.motionDebugInfo)
        : undefined,
    };
  },

  toJSON(message: Motion): unknown {
    const obj: any = {};
    if (message.sensors !== undefined) {
      obj.sensors = SensorValues.toJSON(message.sensors);
    }
    if (message.pose !== undefined) {
      obj.pose = Motion_Pose.toJSON(message.pose);
    }
    if (message.com !== undefined) {
      obj.com = XYZCoord.toJSON(message.com);
    }
    if (message.odometry !== undefined) {
      obj.odometry = Motion_Odometry.toJSON(message.odometry);
    }
    if (message.active !== undefined) {
      obj.active = ActionCommandAll.toJSON(message.active);
    }
    if (message.jointRequest !== undefined) {
      obj.jointRequest = JointValues.toJSON(message.jointRequest);
    }
    if (message.motionDebugInfo !== undefined) {
      obj.motionDebugInfo = Motion_MotionDebugInfo.toJSON(message.motionDebugInfo);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Motion>, I>>(base?: I): Motion {
    return Motion.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Motion>, I>>(object: I): Motion {
    const message = createBaseMotion();
    message.sensors = (object.sensors !== undefined && object.sensors !== null)
      ? SensorValues.fromPartial(object.sensors)
      : undefined;
    message.pose = (object.pose !== undefined && object.pose !== null)
      ? Motion_Pose.fromPartial(object.pose)
      : undefined;
    message.com = (object.com !== undefined && object.com !== null) ? XYZCoord.fromPartial(object.com) : undefined;
    message.odometry = (object.odometry !== undefined && object.odometry !== null)
      ? Motion_Odometry.fromPartial(object.odometry)
      : undefined;
    message.active = (object.active !== undefined && object.active !== null)
      ? ActionCommandAll.fromPartial(object.active)
      : undefined;
    message.jointRequest = (object.jointRequest !== undefined && object.jointRequest !== null)
      ? JointValues.fromPartial(object.jointRequest)
      : undefined;
    message.motionDebugInfo = (object.motionDebugInfo !== undefined && object.motionDebugInfo !== null)
      ? Motion_MotionDebugInfo.fromPartial(object.motionDebugInfo)
      : undefined;
    return message;
  },
};

function createBaseMotion_Pose(): Motion_Pose {
  return {
    topCameraToWorldTransform: undefined,
    botCameraToWorldTransform: undefined,
    origin: undefined,
    zunit: undefined,
    topCOrigin: undefined,
    botCOrigin: undefined,
    horizon: undefined,
    topExclusionArray: [],
    botExclusionArray: [],
    neckToWorldTransform: undefined,
  };
}

export const Motion_Pose = {
  encode(message: Motion_Pose, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.topCameraToWorldTransform !== undefined) {
      FloatMatrix.encode(message.topCameraToWorldTransform, writer.uint32(10).fork()).ldelim();
    }
    if (message.botCameraToWorldTransform !== undefined) {
      FloatMatrix.encode(message.botCameraToWorldTransform, writer.uint32(18).fork()).ldelim();
    }
    if (message.origin !== undefined) {
      FloatMatrix.encode(message.origin, writer.uint32(26).fork()).ldelim();
    }
    if (message.zunit !== undefined) {
      FloatMatrix.encode(message.zunit, writer.uint32(34).fork()).ldelim();
    }
    if (message.topCOrigin !== undefined) {
      FloatMatrix.encode(message.topCOrigin, writer.uint32(42).fork()).ldelim();
    }
    if (message.botCOrigin !== undefined) {
      FloatMatrix.encode(message.botCOrigin, writer.uint32(50).fork()).ldelim();
    }
    if (message.horizon !== undefined) {
      PairIntInt.encode(message.horizon, writer.uint32(58).fork()).ldelim();
    }
    writer.uint32(66).fork();
    for (const v of message.topExclusionArray) {
      writer.sint32(v);
    }
    writer.ldelim();
    writer.uint32(74).fork();
    for (const v of message.botExclusionArray) {
      writer.sint32(v);
    }
    writer.ldelim();
    if (message.neckToWorldTransform !== undefined) {
      FloatMatrix.encode(message.neckToWorldTransform, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Motion_Pose {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMotion_Pose();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.topCameraToWorldTransform = FloatMatrix.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.botCameraToWorldTransform = FloatMatrix.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.origin = FloatMatrix.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.zunit = FloatMatrix.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.topCOrigin = FloatMatrix.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.botCOrigin = FloatMatrix.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.horizon = PairIntInt.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag === 64) {
            message.topExclusionArray.push(reader.sint32());

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.topExclusionArray.push(reader.sint32());
            }

            continue;
          }

          break;
        case 9:
          if (tag === 72) {
            message.botExclusionArray.push(reader.sint32());

            continue;
          }

          if (tag === 74) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.botExclusionArray.push(reader.sint32());
            }

            continue;
          }

          break;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.neckToWorldTransform = FloatMatrix.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Motion_Pose {
    return {
      topCameraToWorldTransform: isSet(object.topCameraToWorldTransform)
        ? FloatMatrix.fromJSON(object.topCameraToWorldTransform)
        : undefined,
      botCameraToWorldTransform: isSet(object.botCameraToWorldTransform)
        ? FloatMatrix.fromJSON(object.botCameraToWorldTransform)
        : undefined,
      origin: isSet(object.origin) ? FloatMatrix.fromJSON(object.origin) : undefined,
      zunit: isSet(object.zunit) ? FloatMatrix.fromJSON(object.zunit) : undefined,
      topCOrigin: isSet(object.topCOrigin) ? FloatMatrix.fromJSON(object.topCOrigin) : undefined,
      botCOrigin: isSet(object.botCOrigin) ? FloatMatrix.fromJSON(object.botCOrigin) : undefined,
      horizon: isSet(object.horizon) ? PairIntInt.fromJSON(object.horizon) : undefined,
      topExclusionArray: globalThis.Array.isArray(object?.topExclusionArray)
        ? object.topExclusionArray.map((e: any) => globalThis.Number(e))
        : [],
      botExclusionArray: globalThis.Array.isArray(object?.botExclusionArray)
        ? object.botExclusionArray.map((e: any) => globalThis.Number(e))
        : [],
      neckToWorldTransform: isSet(object.neckToWorldTransform)
        ? FloatMatrix.fromJSON(object.neckToWorldTransform)
        : undefined,
    };
  },

  toJSON(message: Motion_Pose): unknown {
    const obj: any = {};
    if (message.topCameraToWorldTransform !== undefined) {
      obj.topCameraToWorldTransform = FloatMatrix.toJSON(message.topCameraToWorldTransform);
    }
    if (message.botCameraToWorldTransform !== undefined) {
      obj.botCameraToWorldTransform = FloatMatrix.toJSON(message.botCameraToWorldTransform);
    }
    if (message.origin !== undefined) {
      obj.origin = FloatMatrix.toJSON(message.origin);
    }
    if (message.zunit !== undefined) {
      obj.zunit = FloatMatrix.toJSON(message.zunit);
    }
    if (message.topCOrigin !== undefined) {
      obj.topCOrigin = FloatMatrix.toJSON(message.topCOrigin);
    }
    if (message.botCOrigin !== undefined) {
      obj.botCOrigin = FloatMatrix.toJSON(message.botCOrigin);
    }
    if (message.horizon !== undefined) {
      obj.horizon = PairIntInt.toJSON(message.horizon);
    }
    if (message.topExclusionArray?.length) {
      obj.topExclusionArray = message.topExclusionArray.map((e) => Math.round(e));
    }
    if (message.botExclusionArray?.length) {
      obj.botExclusionArray = message.botExclusionArray.map((e) => Math.round(e));
    }
    if (message.neckToWorldTransform !== undefined) {
      obj.neckToWorldTransform = FloatMatrix.toJSON(message.neckToWorldTransform);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Motion_Pose>, I>>(base?: I): Motion_Pose {
    return Motion_Pose.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Motion_Pose>, I>>(object: I): Motion_Pose {
    const message = createBaseMotion_Pose();
    message.topCameraToWorldTransform =
      (object.topCameraToWorldTransform !== undefined && object.topCameraToWorldTransform !== null)
        ? FloatMatrix.fromPartial(object.topCameraToWorldTransform)
        : undefined;
    message.botCameraToWorldTransform =
      (object.botCameraToWorldTransform !== undefined && object.botCameraToWorldTransform !== null)
        ? FloatMatrix.fromPartial(object.botCameraToWorldTransform)
        : undefined;
    message.origin = (object.origin !== undefined && object.origin !== null)
      ? FloatMatrix.fromPartial(object.origin)
      : undefined;
    message.zunit = (object.zunit !== undefined && object.zunit !== null)
      ? FloatMatrix.fromPartial(object.zunit)
      : undefined;
    message.topCOrigin = (object.topCOrigin !== undefined && object.topCOrigin !== null)
      ? FloatMatrix.fromPartial(object.topCOrigin)
      : undefined;
    message.botCOrigin = (object.botCOrigin !== undefined && object.botCOrigin !== null)
      ? FloatMatrix.fromPartial(object.botCOrigin)
      : undefined;
    message.horizon = (object.horizon !== undefined && object.horizon !== null)
      ? PairIntInt.fromPartial(object.horizon)
      : undefined;
    message.topExclusionArray = object.topExclusionArray?.map((e) => e) || [];
    message.botExclusionArray = object.botExclusionArray?.map((e) => e) || [];
    message.neckToWorldTransform = (object.neckToWorldTransform !== undefined && object.neckToWorldTransform !== null)
      ? FloatMatrix.fromPartial(object.neckToWorldTransform)
      : undefined;
    return message;
  },
};

function createBaseMotion_Odometry(): Motion_Odometry {
  return { forward: 0, left: 0, turn: 0 };
}

export const Motion_Odometry = {
  encode(message: Motion_Odometry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.forward !== undefined && message.forward !== 0) {
      writer.uint32(13).float(message.forward);
    }
    if (message.left !== undefined && message.left !== 0) {
      writer.uint32(21).float(message.left);
    }
    if (message.turn !== undefined && message.turn !== 0) {
      writer.uint32(29).float(message.turn);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Motion_Odometry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMotion_Odometry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.forward = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.left = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.turn = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Motion_Odometry {
    return {
      forward: isSet(object.forward) ? globalThis.Number(object.forward) : 0,
      left: isSet(object.left) ? globalThis.Number(object.left) : 0,
      turn: isSet(object.turn) ? globalThis.Number(object.turn) : 0,
    };
  },

  toJSON(message: Motion_Odometry): unknown {
    const obj: any = {};
    if (message.forward !== undefined && message.forward !== 0) {
      obj.forward = message.forward;
    }
    if (message.left !== undefined && message.left !== 0) {
      obj.left = message.left;
    }
    if (message.turn !== undefined && message.turn !== 0) {
      obj.turn = message.turn;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Motion_Odometry>, I>>(base?: I): Motion_Odometry {
    return Motion_Odometry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Motion_Odometry>, I>>(object: I): Motion_Odometry {
    const message = createBaseMotion_Odometry();
    message.forward = object.forward ?? 0;
    message.left = object.left ?? 0;
    message.turn = object.turn ?? 0;
    return message;
  },
};

function createBaseMotion_MotionDebugInfo(): Motion_MotionDebugInfo {
  return { feetPosition: undefined };
}

export const Motion_MotionDebugInfo = {
  encode(message: Motion_MotionDebugInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.feetPosition !== undefined) {
      Motion_FeetPosition.encode(message.feetPosition, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Motion_MotionDebugInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMotion_MotionDebugInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.feetPosition = Motion_FeetPosition.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Motion_MotionDebugInfo {
    return { feetPosition: isSet(object.feetPosition) ? Motion_FeetPosition.fromJSON(object.feetPosition) : undefined };
  },

  toJSON(message: Motion_MotionDebugInfo): unknown {
    const obj: any = {};
    if (message.feetPosition !== undefined) {
      obj.feetPosition = Motion_FeetPosition.toJSON(message.feetPosition);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Motion_MotionDebugInfo>, I>>(base?: I): Motion_MotionDebugInfo {
    return Motion_MotionDebugInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Motion_MotionDebugInfo>, I>>(object: I): Motion_MotionDebugInfo {
    const message = createBaseMotion_MotionDebugInfo();
    message.feetPosition = (object.feetPosition !== undefined && object.feetPosition !== null)
      ? Motion_FeetPosition.fromPartial(object.feetPosition)
      : undefined;
    return message;
  },
};

function createBaseMotion_FeetPosition(): Motion_FeetPosition {
  return { left: undefined, right: undefined };
}

export const Motion_FeetPosition = {
  encode(message: Motion_FeetPosition, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.left !== undefined) {
      Motion_FootPosition.encode(message.left, writer.uint32(10).fork()).ldelim();
    }
    if (message.right !== undefined) {
      Motion_FootPosition.encode(message.right, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Motion_FeetPosition {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMotion_FeetPosition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.left = Motion_FootPosition.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.right = Motion_FootPosition.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Motion_FeetPosition {
    return {
      left: isSet(object.left) ? Motion_FootPosition.fromJSON(object.left) : undefined,
      right: isSet(object.right) ? Motion_FootPosition.fromJSON(object.right) : undefined,
    };
  },

  toJSON(message: Motion_FeetPosition): unknown {
    const obj: any = {};
    if (message.left !== undefined) {
      obj.left = Motion_FootPosition.toJSON(message.left);
    }
    if (message.right !== undefined) {
      obj.right = Motion_FootPosition.toJSON(message.right);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Motion_FeetPosition>, I>>(base?: I): Motion_FeetPosition {
    return Motion_FeetPosition.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Motion_FeetPosition>, I>>(object: I): Motion_FeetPosition {
    const message = createBaseMotion_FeetPosition();
    message.left = (object.left !== undefined && object.left !== null)
      ? Motion_FootPosition.fromPartial(object.left)
      : undefined;
    message.right = (object.right !== undefined && object.right !== null)
      ? Motion_FootPosition.fromPartial(object.right)
      : undefined;
    return message;
  },
};

function createBaseMotion_FootPosition(): Motion_FootPosition {
  return { x: 0, y: 0, theta: 0 };
}

export const Motion_FootPosition = {
  encode(message: Motion_FootPosition, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.x !== undefined && message.x !== 0) {
      writer.uint32(13).float(message.x);
    }
    if (message.y !== undefined && message.y !== 0) {
      writer.uint32(21).float(message.y);
    }
    if (message.theta !== undefined && message.theta !== 0) {
      writer.uint32(29).float(message.theta);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Motion_FootPosition {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMotion_FootPosition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.x = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.y = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.theta = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Motion_FootPosition {
    return {
      x: isSet(object.x) ? globalThis.Number(object.x) : 0,
      y: isSet(object.y) ? globalThis.Number(object.y) : 0,
      theta: isSet(object.theta) ? globalThis.Number(object.theta) : 0,
    };
  },

  toJSON(message: Motion_FootPosition): unknown {
    const obj: any = {};
    if (message.x !== undefined && message.x !== 0) {
      obj.x = message.x;
    }
    if (message.y !== undefined && message.y !== 0) {
      obj.y = message.y;
    }
    if (message.theta !== undefined && message.theta !== 0) {
      obj.theta = message.theta;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Motion_FootPosition>, I>>(base?: I): Motion_FootPosition {
    return Motion_FootPosition.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Motion_FootPosition>, I>>(object: I): Motion_FootPosition {
    const message = createBaseMotion_FootPosition();
    message.x = object.x ?? 0;
    message.y = object.y ?? 0;
    message.theta = object.theta ?? 0;
    return message;
  },
};

function createBasePerception(): Perception {
  return { behaviour: 0, kinematics: 0, stateEstimation: 0, total: 0, vision: 0 };
}

export const Perception = {
  encode(message: Perception, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.behaviour !== undefined && message.behaviour !== 0) {
      writer.uint32(8).uint32(message.behaviour);
    }
    if (message.kinematics !== undefined && message.kinematics !== 0) {
      writer.uint32(16).uint32(message.kinematics);
    }
    if (message.stateEstimation !== undefined && message.stateEstimation !== 0) {
      writer.uint32(24).uint32(message.stateEstimation);
    }
    if (message.total !== undefined && message.total !== 0) {
      writer.uint32(32).uint32(message.total);
    }
    if (message.vision !== undefined && message.vision !== 0) {
      writer.uint32(40).uint32(message.vision);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Perception {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePerception();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.behaviour = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.kinematics = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.stateEstimation = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.total = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.vision = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Perception {
    return {
      behaviour: isSet(object.behaviour) ? globalThis.Number(object.behaviour) : 0,
      kinematics: isSet(object.kinematics) ? globalThis.Number(object.kinematics) : 0,
      stateEstimation: isSet(object.stateEstimation) ? globalThis.Number(object.stateEstimation) : 0,
      total: isSet(object.total) ? globalThis.Number(object.total) : 0,
      vision: isSet(object.vision) ? globalThis.Number(object.vision) : 0,
    };
  },

  toJSON(message: Perception): unknown {
    const obj: any = {};
    if (message.behaviour !== undefined && message.behaviour !== 0) {
      obj.behaviour = Math.round(message.behaviour);
    }
    if (message.kinematics !== undefined && message.kinematics !== 0) {
      obj.kinematics = Math.round(message.kinematics);
    }
    if (message.stateEstimation !== undefined && message.stateEstimation !== 0) {
      obj.stateEstimation = Math.round(message.stateEstimation);
    }
    if (message.total !== undefined && message.total !== 0) {
      obj.total = Math.round(message.total);
    }
    if (message.vision !== undefined && message.vision !== 0) {
      obj.vision = Math.round(message.vision);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Perception>, I>>(base?: I): Perception {
    return Perception.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Perception>, I>>(object: I): Perception {
    const message = createBasePerception();
    message.behaviour = object.behaviour ?? 0;
    message.kinematics = object.kinematics ?? 0;
    message.stateEstimation = object.stateEstimation ?? 0;
    message.total = object.total ?? 0;
    message.vision = object.vision ?? 0;
    return message;
  },
};

function createBaseKinematics(): Kinematics {
  return { parameters: undefined };
}

export const Kinematics = {
  encode(message: Kinematics, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parameters !== undefined) {
      Kinematics_Parameters.encode(message.parameters, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Kinematics {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKinematics();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.parameters = Kinematics_Parameters.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Kinematics {
    return { parameters: isSet(object.parameters) ? Kinematics_Parameters.fromJSON(object.parameters) : undefined };
  },

  toJSON(message: Kinematics): unknown {
    const obj: any = {};
    if (message.parameters !== undefined) {
      obj.parameters = Kinematics_Parameters.toJSON(message.parameters);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Kinematics>, I>>(base?: I): Kinematics {
    return Kinematics.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Kinematics>, I>>(object: I): Kinematics {
    const message = createBaseKinematics();
    message.parameters = (object.parameters !== undefined && object.parameters !== null)
      ? Kinematics_Parameters.fromPartial(object.parameters)
      : undefined;
    return message;
  },
};

function createBaseKinematics_Parameters(): Kinematics_Parameters {
  return {
    cameraPitchTop: 0,
    cameraYawTop: 0,
    cameraRollTop: 0,
    cameraYawBottom: 0,
    cameraPitchBottom: 0,
    cameraRollBottom: 0,
    bodyPitch: 0,
  };
}

export const Kinematics_Parameters = {
  encode(message: Kinematics_Parameters, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cameraPitchTop !== undefined && message.cameraPitchTop !== 0) {
      writer.uint32(13).float(message.cameraPitchTop);
    }
    if (message.cameraYawTop !== undefined && message.cameraYawTop !== 0) {
      writer.uint32(21).float(message.cameraYawTop);
    }
    if (message.cameraRollTop !== undefined && message.cameraRollTop !== 0) {
      writer.uint32(29).float(message.cameraRollTop);
    }
    if (message.cameraYawBottom !== undefined && message.cameraYawBottom !== 0) {
      writer.uint32(37).float(message.cameraYawBottom);
    }
    if (message.cameraPitchBottom !== undefined && message.cameraPitchBottom !== 0) {
      writer.uint32(45).float(message.cameraPitchBottom);
    }
    if (message.cameraRollBottom !== undefined && message.cameraRollBottom !== 0) {
      writer.uint32(53).float(message.cameraRollBottom);
    }
    if (message.bodyPitch !== undefined && message.bodyPitch !== 0) {
      writer.uint32(61).float(message.bodyPitch);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Kinematics_Parameters {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKinematics_Parameters();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.cameraPitchTop = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.cameraYawTop = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.cameraRollTop = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.cameraYawBottom = reader.float();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.cameraPitchBottom = reader.float();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }

          message.cameraRollBottom = reader.float();
          continue;
        case 7:
          if (tag !== 61) {
            break;
          }

          message.bodyPitch = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Kinematics_Parameters {
    return {
      cameraPitchTop: isSet(object.cameraPitchTop) ? globalThis.Number(object.cameraPitchTop) : 0,
      cameraYawTop: isSet(object.cameraYawTop) ? globalThis.Number(object.cameraYawTop) : 0,
      cameraRollTop: isSet(object.cameraRollTop) ? globalThis.Number(object.cameraRollTop) : 0,
      cameraYawBottom: isSet(object.cameraYawBottom) ? globalThis.Number(object.cameraYawBottom) : 0,
      cameraPitchBottom: isSet(object.cameraPitchBottom) ? globalThis.Number(object.cameraPitchBottom) : 0,
      cameraRollBottom: isSet(object.cameraRollBottom) ? globalThis.Number(object.cameraRollBottom) : 0,
      bodyPitch: isSet(object.bodyPitch) ? globalThis.Number(object.bodyPitch) : 0,
    };
  },

  toJSON(message: Kinematics_Parameters): unknown {
    const obj: any = {};
    if (message.cameraPitchTop !== undefined && message.cameraPitchTop !== 0) {
      obj.cameraPitchTop = message.cameraPitchTop;
    }
    if (message.cameraYawTop !== undefined && message.cameraYawTop !== 0) {
      obj.cameraYawTop = message.cameraYawTop;
    }
    if (message.cameraRollTop !== undefined && message.cameraRollTop !== 0) {
      obj.cameraRollTop = message.cameraRollTop;
    }
    if (message.cameraYawBottom !== undefined && message.cameraYawBottom !== 0) {
      obj.cameraYawBottom = message.cameraYawBottom;
    }
    if (message.cameraPitchBottom !== undefined && message.cameraPitchBottom !== 0) {
      obj.cameraPitchBottom = message.cameraPitchBottom;
    }
    if (message.cameraRollBottom !== undefined && message.cameraRollBottom !== 0) {
      obj.cameraRollBottom = message.cameraRollBottom;
    }
    if (message.bodyPitch !== undefined && message.bodyPitch !== 0) {
      obj.bodyPitch = message.bodyPitch;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Kinematics_Parameters>, I>>(base?: I): Kinematics_Parameters {
    return Kinematics_Parameters.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Kinematics_Parameters>, I>>(object: I): Kinematics_Parameters {
    const message = createBaseKinematics_Parameters();
    message.cameraPitchTop = object.cameraPitchTop ?? 0;
    message.cameraYawTop = object.cameraYawTop ?? 0;
    message.cameraRollTop = object.cameraRollTop ?? 0;
    message.cameraYawBottom = object.cameraYawBottom ?? 0;
    message.cameraPitchBottom = object.cameraPitchBottom ?? 0;
    message.cameraRollBottom = object.cameraRollBottom ?? 0;
    message.bodyPitch = object.bodyPitch ?? 0;
    return message;
  },
};

function createBaseBehaviour(): Behaviour {
  return { request: [] };
}

export const Behaviour = {
  encode(message: Behaviour, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.request) {
      Behaviour_BehaviourRequest.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Behaviour {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBehaviour();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.request.push(Behaviour_BehaviourRequest.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Behaviour {
    return {
      request: globalThis.Array.isArray(object?.request)
        ? object.request.map((e: any) => Behaviour_BehaviourRequest.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Behaviour): unknown {
    const obj: any = {};
    if (message.request?.length) {
      obj.request = message.request.map((e) => Behaviour_BehaviourRequest.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Behaviour>, I>>(base?: I): Behaviour {
    return Behaviour.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Behaviour>, I>>(object: I): Behaviour {
    const message = createBaseBehaviour();
    message.request = object.request?.map((e) => Behaviour_BehaviourRequest.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBehaviour_BehaviourRequest(): Behaviour_BehaviourRequest {
  return { actions: undefined, behaviourDebugInfo: undefined, behaviourSharedData: undefined };
}

export const Behaviour_BehaviourRequest = {
  encode(message: Behaviour_BehaviourRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.actions !== undefined) {
      ActionCommandAll.encode(message.actions, writer.uint32(18).fork()).ldelim();
    }
    if (message.behaviourDebugInfo !== undefined) {
      BehaviourDebugInfo.encode(message.behaviourDebugInfo, writer.uint32(226).fork()).ldelim();
    }
    if (message.behaviourSharedData !== undefined) {
      BehaviourSharedData.encode(message.behaviourSharedData, writer.uint32(234).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Behaviour_BehaviourRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBehaviour_BehaviourRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.actions = ActionCommandAll.decode(reader, reader.uint32());
          continue;
        case 28:
          if (tag !== 226) {
            break;
          }

          message.behaviourDebugInfo = BehaviourDebugInfo.decode(reader, reader.uint32());
          continue;
        case 29:
          if (tag !== 234) {
            break;
          }

          message.behaviourSharedData = BehaviourSharedData.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Behaviour_BehaviourRequest {
    return {
      actions: isSet(object.actions) ? ActionCommandAll.fromJSON(object.actions) : undefined,
      behaviourDebugInfo: isSet(object.behaviourDebugInfo)
        ? BehaviourDebugInfo.fromJSON(object.behaviourDebugInfo)
        : undefined,
      behaviourSharedData: isSet(object.behaviourSharedData)
        ? BehaviourSharedData.fromJSON(object.behaviourSharedData)
        : undefined,
    };
  },

  toJSON(message: Behaviour_BehaviourRequest): unknown {
    const obj: any = {};
    if (message.actions !== undefined) {
      obj.actions = ActionCommandAll.toJSON(message.actions);
    }
    if (message.behaviourDebugInfo !== undefined) {
      obj.behaviourDebugInfo = BehaviourDebugInfo.toJSON(message.behaviourDebugInfo);
    }
    if (message.behaviourSharedData !== undefined) {
      obj.behaviourSharedData = BehaviourSharedData.toJSON(message.behaviourSharedData);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Behaviour_BehaviourRequest>, I>>(base?: I): Behaviour_BehaviourRequest {
    return Behaviour_BehaviourRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Behaviour_BehaviourRequest>, I>>(object: I): Behaviour_BehaviourRequest {
    const message = createBaseBehaviour_BehaviourRequest();
    message.actions = (object.actions !== undefined && object.actions !== null)
      ? ActionCommandAll.fromPartial(object.actions)
      : undefined;
    message.behaviourDebugInfo = (object.behaviourDebugInfo !== undefined && object.behaviourDebugInfo !== null)
      ? BehaviourDebugInfo.fromPartial(object.behaviourDebugInfo)
      : undefined;
    message.behaviourSharedData = (object.behaviourSharedData !== undefined && object.behaviourSharedData !== null)
      ? BehaviourSharedData.fromPartial(object.behaviourSharedData)
      : undefined;
    return message;
  },
};

function createBasePoint(): Point {
  return { x: 0, y: 0 };
}

export const Point = {
  encode(message: Point, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.x !== undefined && message.x !== 0) {
      writer.uint32(8).sint32(message.x);
    }
    if (message.y !== undefined && message.y !== 0) {
      writer.uint32(16).sint32(message.y);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Point {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoint();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.x = reader.sint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.y = reader.sint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Point {
    return {
      x: isSet(object.x) ? globalThis.Number(object.x) : 0,
      y: isSet(object.y) ? globalThis.Number(object.y) : 0,
    };
  },

  toJSON(message: Point): unknown {
    const obj: any = {};
    if (message.x !== undefined && message.x !== 0) {
      obj.x = Math.round(message.x);
    }
    if (message.y !== undefined && message.y !== 0) {
      obj.y = Math.round(message.y);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Point>, I>>(base?: I): Point {
    return Point.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Point>, I>>(object: I): Point {
    const message = createBasePoint();
    message.x = object.x ?? 0;
    message.y = object.y ?? 0;
    return message;
  },
};

function createBaseBBox(): BBox {
  return { a: undefined, b: undefined };
}

export const BBox = {
  encode(message: BBox, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.a !== undefined) {
      Point.encode(message.a, writer.uint32(10).fork()).ldelim();
    }
    if (message.b !== undefined) {
      Point.encode(message.b, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BBox {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBBox();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.a = Point.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.b = Point.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BBox {
    return {
      a: isSet(object.a) ? Point.fromJSON(object.a) : undefined,
      b: isSet(object.b) ? Point.fromJSON(object.b) : undefined,
    };
  },

  toJSON(message: BBox): unknown {
    const obj: any = {};
    if (message.a !== undefined) {
      obj.a = Point.toJSON(message.a);
    }
    if (message.b !== undefined) {
      obj.b = Point.toJSON(message.b);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BBox>, I>>(base?: I): BBox {
    return BBox.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BBox>, I>>(object: I): BBox {
    const message = createBaseBBox();
    message.a = (object.a !== undefined && object.a !== null) ? Point.fromPartial(object.a) : undefined;
    message.b = (object.b !== undefined && object.b !== null) ? Point.fromPartial(object.b) : undefined;
    return message;
  },
};

function createBaseRRCoord(): RRCoord {
  return { vec: [], var: undefined };
}

export const RRCoord = {
  encode(message: RRCoord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.vec) {
      writer.float(v);
    }
    writer.ldelim();
    if (message.var !== undefined) {
      FloatMatrix.encode(message.var, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RRCoord {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRRCoord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 13) {
            message.vec.push(reader.float());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.vec.push(reader.float());
            }

            continue;
          }

          break;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.var = FloatMatrix.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RRCoord {
    return {
      vec: globalThis.Array.isArray(object?.vec) ? object.vec.map((e: any) => globalThis.Number(e)) : [],
      var: isSet(object.var) ? FloatMatrix.fromJSON(object.var) : undefined,
    };
  },

  toJSON(message: RRCoord): unknown {
    const obj: any = {};
    if (message.vec?.length) {
      obj.vec = message.vec;
    }
    if (message.var !== undefined) {
      obj.var = FloatMatrix.toJSON(message.var);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RRCoord>, I>>(base?: I): RRCoord {
    return RRCoord.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RRCoord>, I>>(object: I): RRCoord {
    const message = createBaseRRCoord();
    message.vec = object.vec?.map((e) => e) || [];
    message.var = (object.var !== undefined && object.var !== null) ? FloatMatrix.fromPartial(object.var) : undefined;
    return message;
  },
};

function createBaseBehaviourSharedData(): BehaviourSharedData {
  return {
    role: 0,
    playingBall: false,
    needAssistance: false,
    isAssisting: false,
    secondsSinceLastKick: 0,
    isKickedOff: false,
    walkingToX: 0,
    walkingToY: 0,
    walkingToH: 0,
  };
}

export const BehaviourSharedData = {
  encode(message: BehaviourSharedData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.role !== undefined && message.role !== 0) {
      writer.uint32(64).int32(message.role);
    }
    if (message.playingBall !== undefined && message.playingBall !== false) {
      writer.uint32(72).bool(message.playingBall);
    }
    if (message.needAssistance !== undefined && message.needAssistance !== false) {
      writer.uint32(80).bool(message.needAssistance);
    }
    if (message.isAssisting !== undefined && message.isAssisting !== false) {
      writer.uint32(88).bool(message.isAssisting);
    }
    if (message.secondsSinceLastKick !== undefined && message.secondsSinceLastKick !== 0) {
      writer.uint32(96).int32(message.secondsSinceLastKick);
    }
    if (message.isKickedOff !== undefined && message.isKickedOff !== false) {
      writer.uint32(112).bool(message.isKickedOff);
    }
    if (message.walkingToX !== undefined && message.walkingToX !== 0) {
      writer.uint32(157).float(message.walkingToX);
    }
    if (message.walkingToY !== undefined && message.walkingToY !== 0) {
      writer.uint32(165).float(message.walkingToY);
    }
    if (message.walkingToH !== undefined && message.walkingToH !== 0) {
      writer.uint32(173).float(message.walkingToH);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BehaviourSharedData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBehaviourSharedData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 8:
          if (tag !== 64) {
            break;
          }

          message.role = reader.int32();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.playingBall = reader.bool();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.needAssistance = reader.bool();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.isAssisting = reader.bool();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.secondsSinceLastKick = reader.int32();
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.isKickedOff = reader.bool();
          continue;
        case 19:
          if (tag !== 157) {
            break;
          }

          message.walkingToX = reader.float();
          continue;
        case 20:
          if (tag !== 165) {
            break;
          }

          message.walkingToY = reader.float();
          continue;
        case 21:
          if (tag !== 173) {
            break;
          }

          message.walkingToH = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BehaviourSharedData {
    return {
      role: isSet(object.role) ? globalThis.Number(object.role) : 0,
      playingBall: isSet(object.playingBall) ? globalThis.Boolean(object.playingBall) : false,
      needAssistance: isSet(object.needAssistance) ? globalThis.Boolean(object.needAssistance) : false,
      isAssisting: isSet(object.isAssisting) ? globalThis.Boolean(object.isAssisting) : false,
      secondsSinceLastKick: isSet(object.secondsSinceLastKick) ? globalThis.Number(object.secondsSinceLastKick) : 0,
      isKickedOff: isSet(object.isKickedOff) ? globalThis.Boolean(object.isKickedOff) : false,
      walkingToX: isSet(object.walkingToX) ? globalThis.Number(object.walkingToX) : 0,
      walkingToY: isSet(object.walkingToY) ? globalThis.Number(object.walkingToY) : 0,
      walkingToH: isSet(object.walkingToH) ? globalThis.Number(object.walkingToH) : 0,
    };
  },

  toJSON(message: BehaviourSharedData): unknown {
    const obj: any = {};
    if (message.role !== undefined && message.role !== 0) {
      obj.role = Math.round(message.role);
    }
    if (message.playingBall !== undefined && message.playingBall !== false) {
      obj.playingBall = message.playingBall;
    }
    if (message.needAssistance !== undefined && message.needAssistance !== false) {
      obj.needAssistance = message.needAssistance;
    }
    if (message.isAssisting !== undefined && message.isAssisting !== false) {
      obj.isAssisting = message.isAssisting;
    }
    if (message.secondsSinceLastKick !== undefined && message.secondsSinceLastKick !== 0) {
      obj.secondsSinceLastKick = Math.round(message.secondsSinceLastKick);
    }
    if (message.isKickedOff !== undefined && message.isKickedOff !== false) {
      obj.isKickedOff = message.isKickedOff;
    }
    if (message.walkingToX !== undefined && message.walkingToX !== 0) {
      obj.walkingToX = message.walkingToX;
    }
    if (message.walkingToY !== undefined && message.walkingToY !== 0) {
      obj.walkingToY = message.walkingToY;
    }
    if (message.walkingToH !== undefined && message.walkingToH !== 0) {
      obj.walkingToH = message.walkingToH;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BehaviourSharedData>, I>>(base?: I): BehaviourSharedData {
    return BehaviourSharedData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BehaviourSharedData>, I>>(object: I): BehaviourSharedData {
    const message = createBaseBehaviourSharedData();
    message.role = object.role ?? 0;
    message.playingBall = object.playingBall ?? false;
    message.needAssistance = object.needAssistance ?? false;
    message.isAssisting = object.isAssisting ?? false;
    message.secondsSinceLastKick = object.secondsSinceLastKick ?? 0;
    message.isKickedOff = object.isKickedOff ?? false;
    message.walkingToX = object.walkingToX ?? 0;
    message.walkingToY = object.walkingToY ?? 0;
    message.walkingToH = object.walkingToH ?? 0;
    return message;
  },
};

function createBaseVision(): Vision {
  return {
    timestamp: 0,
    balls: [],
    robots: [],
    fieldBoundaries: [],
    fieldFeatures: [],
    regions: [],
    topCameraSettings: undefined,
    botCameraSettings: undefined,
    topSaliency: new Uint8Array(0),
    botSaliency: new Uint8Array(0),
    topFrame: new Uint8Array(0),
    botFrame: new Uint8Array(0),
    horizontalFieldOfView: 0,
    verticalFieldOfView: 0,
    topFrameJPEG: new Uint8Array(0),
    botFrameJPEG: new Uint8Array(0),
    ATWindowSizeTop: 0,
    ATWindowSizeBot: 0,
    ATPercentageTop: 0,
    ATPercentageBot: 0,
    redRegions: [],
    refereeHands: [],
    refereeHandDetectorSettings: undefined,
    cropRegion: undefined,
  };
}

export const Vision = {
  encode(message: Vision, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== undefined && message.timestamp !== 0) {
      writer.uint32(16).int64(message.timestamp);
    }
    for (const v of message.balls) {
      Vision_BallInfo.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    for (const v of message.robots) {
      Vision_RobotVisionInfo.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    for (const v of message.fieldBoundaries) {
      Vision_FieldBoundaryInfo.encode(v!, writer.uint32(98).fork()).ldelim();
    }
    for (const v of message.fieldFeatures) {
      Vision_FieldFeatureInfo.encode(v!, writer.uint32(106).fork()).ldelim();
    }
    for (const v of message.regions) {
      Vision_RegionI.encode(v!, writer.uint32(130).fork()).ldelim();
    }
    if (message.topCameraSettings !== undefined) {
      Vision_CameraSettings.encode(message.topCameraSettings, writer.uint32(138).fork()).ldelim();
    }
    if (message.botCameraSettings !== undefined) {
      Vision_CameraSettings.encode(message.botCameraSettings, writer.uint32(146).fork()).ldelim();
    }
    if (message.topSaliency !== undefined && message.topSaliency.length !== 0) {
      writer.uint32(162).bytes(message.topSaliency);
    }
    if (message.botSaliency !== undefined && message.botSaliency.length !== 0) {
      writer.uint32(170).bytes(message.botSaliency);
    }
    if (message.topFrame !== undefined && message.topFrame.length !== 0) {
      writer.uint32(178).bytes(message.topFrame);
    }
    if (message.botFrame !== undefined && message.botFrame.length !== 0) {
      writer.uint32(186).bytes(message.botFrame);
    }
    if (message.horizontalFieldOfView !== undefined && message.horizontalFieldOfView !== 0) {
      writer.uint32(197).float(message.horizontalFieldOfView);
    }
    if (message.verticalFieldOfView !== undefined && message.verticalFieldOfView !== 0) {
      writer.uint32(205).float(message.verticalFieldOfView);
    }
    if (message.topFrameJPEG !== undefined && message.topFrameJPEG.length !== 0) {
      writer.uint32(210).bytes(message.topFrameJPEG);
    }
    if (message.botFrameJPEG !== undefined && message.botFrameJPEG.length !== 0) {
      writer.uint32(218).bytes(message.botFrameJPEG);
    }
    if (message.ATWindowSizeTop !== undefined && message.ATWindowSizeTop !== 0) {
      writer.uint32(224).uint32(message.ATWindowSizeTop);
    }
    if (message.ATWindowSizeBot !== undefined && message.ATWindowSizeBot !== 0) {
      writer.uint32(232).uint32(message.ATWindowSizeBot);
    }
    if (message.ATPercentageTop !== undefined && message.ATPercentageTop !== 0) {
      writer.uint32(240).int32(message.ATPercentageTop);
    }
    if (message.ATPercentageBot !== undefined && message.ATPercentageBot !== 0) {
      writer.uint32(248).int32(message.ATPercentageBot);
    }
    for (const v of message.redRegions) {
      BBox.encode(v!, writer.uint32(258).fork()).ldelim();
    }
    for (const v of message.refereeHands) {
      Vision_RefereeHandsVisionInfo.encode(v!, writer.uint32(266).fork()).ldelim();
    }
    if (message.refereeHandDetectorSettings !== undefined) {
      Vision_RefereeHandDetectorSettings.encode(message.refereeHandDetectorSettings, writer.uint32(274).fork())
        .ldelim();
    }
    if (message.cropRegion !== undefined) {
      BBox.encode(message.cropRegion, writer.uint32(282).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 16) {
            break;
          }

          message.timestamp = longToNumber(reader.int64() as Long);
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.balls.push(Vision_BallInfo.decode(reader, reader.uint32()));
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.robots.push(Vision_RobotVisionInfo.decode(reader, reader.uint32()));
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.fieldBoundaries.push(Vision_FieldBoundaryInfo.decode(reader, reader.uint32()));
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.fieldFeatures.push(Vision_FieldFeatureInfo.decode(reader, reader.uint32()));
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.regions.push(Vision_RegionI.decode(reader, reader.uint32()));
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.topCameraSettings = Vision_CameraSettings.decode(reader, reader.uint32());
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.botCameraSettings = Vision_CameraSettings.decode(reader, reader.uint32());
          continue;
        case 20:
          if (tag !== 162) {
            break;
          }

          message.topSaliency = reader.bytes();
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.botSaliency = reader.bytes();
          continue;
        case 22:
          if (tag !== 178) {
            break;
          }

          message.topFrame = reader.bytes();
          continue;
        case 23:
          if (tag !== 186) {
            break;
          }

          message.botFrame = reader.bytes();
          continue;
        case 24:
          if (tag !== 197) {
            break;
          }

          message.horizontalFieldOfView = reader.float();
          continue;
        case 25:
          if (tag !== 205) {
            break;
          }

          message.verticalFieldOfView = reader.float();
          continue;
        case 26:
          if (tag !== 210) {
            break;
          }

          message.topFrameJPEG = reader.bytes();
          continue;
        case 27:
          if (tag !== 218) {
            break;
          }

          message.botFrameJPEG = reader.bytes();
          continue;
        case 28:
          if (tag !== 224) {
            break;
          }

          message.ATWindowSizeTop = reader.uint32();
          continue;
        case 29:
          if (tag !== 232) {
            break;
          }

          message.ATWindowSizeBot = reader.uint32();
          continue;
        case 30:
          if (tag !== 240) {
            break;
          }

          message.ATPercentageTop = reader.int32();
          continue;
        case 31:
          if (tag !== 248) {
            break;
          }

          message.ATPercentageBot = reader.int32();
          continue;
        case 32:
          if (tag !== 258) {
            break;
          }

          message.redRegions.push(BBox.decode(reader, reader.uint32()));
          continue;
        case 33:
          if (tag !== 266) {
            break;
          }

          message.refereeHands.push(Vision_RefereeHandsVisionInfo.decode(reader, reader.uint32()));
          continue;
        case 34:
          if (tag !== 274) {
            break;
          }

          message.refereeHandDetectorSettings = Vision_RefereeHandDetectorSettings.decode(reader, reader.uint32());
          continue;
        case 35:
          if (tag !== 282) {
            break;
          }

          message.cropRegion = BBox.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision {
    return {
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      balls: globalThis.Array.isArray(object?.balls) ? object.balls.map((e: any) => Vision_BallInfo.fromJSON(e)) : [],
      robots: globalThis.Array.isArray(object?.robots)
        ? object.robots.map((e: any) => Vision_RobotVisionInfo.fromJSON(e))
        : [],
      fieldBoundaries: globalThis.Array.isArray(object?.fieldBoundaries)
        ? object.fieldBoundaries.map((e: any) => Vision_FieldBoundaryInfo.fromJSON(e))
        : [],
      fieldFeatures: globalThis.Array.isArray(object?.fieldFeatures)
        ? object.fieldFeatures.map((e: any) => Vision_FieldFeatureInfo.fromJSON(e))
        : [],
      regions: globalThis.Array.isArray(object?.regions)
        ? object.regions.map((e: any) => Vision_RegionI.fromJSON(e))
        : [],
      topCameraSettings: isSet(object.topCameraSettings)
        ? Vision_CameraSettings.fromJSON(object.topCameraSettings)
        : undefined,
      botCameraSettings: isSet(object.botCameraSettings)
        ? Vision_CameraSettings.fromJSON(object.botCameraSettings)
        : undefined,
      topSaliency: isSet(object.topSaliency) ? bytesFromBase64(object.topSaliency) : new Uint8Array(0),
      botSaliency: isSet(object.botSaliency) ? bytesFromBase64(object.botSaliency) : new Uint8Array(0),
      topFrame: isSet(object.topFrame) ? bytesFromBase64(object.topFrame) : new Uint8Array(0),
      botFrame: isSet(object.botFrame) ? bytesFromBase64(object.botFrame) : new Uint8Array(0),
      horizontalFieldOfView: isSet(object.horizontalFieldOfView) ? globalThis.Number(object.horizontalFieldOfView) : 0,
      verticalFieldOfView: isSet(object.verticalFieldOfView) ? globalThis.Number(object.verticalFieldOfView) : 0,
      topFrameJPEG: isSet(object.topFrameJPEG) ? bytesFromBase64(object.topFrameJPEG) : new Uint8Array(0),
      botFrameJPEG: isSet(object.botFrameJPEG) ? bytesFromBase64(object.botFrameJPEG) : new Uint8Array(0),
      ATWindowSizeTop: isSet(object.ATWindowSizeTop) ? globalThis.Number(object.ATWindowSizeTop) : 0,
      ATWindowSizeBot: isSet(object.ATWindowSizeBot) ? globalThis.Number(object.ATWindowSizeBot) : 0,
      ATPercentageTop: isSet(object.ATPercentageTop) ? globalThis.Number(object.ATPercentageTop) : 0,
      ATPercentageBot: isSet(object.ATPercentageBot) ? globalThis.Number(object.ATPercentageBot) : 0,
      redRegions: globalThis.Array.isArray(object?.redRegions)
        ? object.redRegions.map((e: any) => BBox.fromJSON(e))
        : [],
      refereeHands: globalThis.Array.isArray(object?.refereeHands)
        ? object.refereeHands.map((e: any) => Vision_RefereeHandsVisionInfo.fromJSON(e))
        : [],
      refereeHandDetectorSettings: isSet(object.refereeHandDetectorSettings)
        ? Vision_RefereeHandDetectorSettings.fromJSON(object.refereeHandDetectorSettings)
        : undefined,
      cropRegion: isSet(object.cropRegion) ? BBox.fromJSON(object.cropRegion) : undefined,
    };
  },

  toJSON(message: Vision): unknown {
    const obj: any = {};
    if (message.timestamp !== undefined && message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.balls?.length) {
      obj.balls = message.balls.map((e) => Vision_BallInfo.toJSON(e));
    }
    if (message.robots?.length) {
      obj.robots = message.robots.map((e) => Vision_RobotVisionInfo.toJSON(e));
    }
    if (message.fieldBoundaries?.length) {
      obj.fieldBoundaries = message.fieldBoundaries.map((e) => Vision_FieldBoundaryInfo.toJSON(e));
    }
    if (message.fieldFeatures?.length) {
      obj.fieldFeatures = message.fieldFeatures.map((e) => Vision_FieldFeatureInfo.toJSON(e));
    }
    if (message.regions?.length) {
      obj.regions = message.regions.map((e) => Vision_RegionI.toJSON(e));
    }
    if (message.topCameraSettings !== undefined) {
      obj.topCameraSettings = Vision_CameraSettings.toJSON(message.topCameraSettings);
    }
    if (message.botCameraSettings !== undefined) {
      obj.botCameraSettings = Vision_CameraSettings.toJSON(message.botCameraSettings);
    }
    if (message.topSaliency !== undefined && message.topSaliency.length !== 0) {
      obj.topSaliency = base64FromBytes(message.topSaliency);
    }
    if (message.botSaliency !== undefined && message.botSaliency.length !== 0) {
      obj.botSaliency = base64FromBytes(message.botSaliency);
    }
    if (message.topFrame !== undefined && message.topFrame.length !== 0) {
      obj.topFrame = base64FromBytes(message.topFrame);
    }
    if (message.botFrame !== undefined && message.botFrame.length !== 0) {
      obj.botFrame = base64FromBytes(message.botFrame);
    }
    if (message.horizontalFieldOfView !== undefined && message.horizontalFieldOfView !== 0) {
      obj.horizontalFieldOfView = message.horizontalFieldOfView;
    }
    if (message.verticalFieldOfView !== undefined && message.verticalFieldOfView !== 0) {
      obj.verticalFieldOfView = message.verticalFieldOfView;
    }
    if (message.topFrameJPEG !== undefined && message.topFrameJPEG.length !== 0) {
      obj.topFrameJPEG = base64FromBytes(message.topFrameJPEG);
    }
    if (message.botFrameJPEG !== undefined && message.botFrameJPEG.length !== 0) {
      obj.botFrameJPEG = base64FromBytes(message.botFrameJPEG);
    }
    if (message.ATWindowSizeTop !== undefined && message.ATWindowSizeTop !== 0) {
      obj.ATWindowSizeTop = Math.round(message.ATWindowSizeTop);
    }
    if (message.ATWindowSizeBot !== undefined && message.ATWindowSizeBot !== 0) {
      obj.ATWindowSizeBot = Math.round(message.ATWindowSizeBot);
    }
    if (message.ATPercentageTop !== undefined && message.ATPercentageTop !== 0) {
      obj.ATPercentageTop = Math.round(message.ATPercentageTop);
    }
    if (message.ATPercentageBot !== undefined && message.ATPercentageBot !== 0) {
      obj.ATPercentageBot = Math.round(message.ATPercentageBot);
    }
    if (message.redRegions?.length) {
      obj.redRegions = message.redRegions.map((e) => BBox.toJSON(e));
    }
    if (message.refereeHands?.length) {
      obj.refereeHands = message.refereeHands.map((e) => Vision_RefereeHandsVisionInfo.toJSON(e));
    }
    if (message.refereeHandDetectorSettings !== undefined) {
      obj.refereeHandDetectorSettings = Vision_RefereeHandDetectorSettings.toJSON(message.refereeHandDetectorSettings);
    }
    if (message.cropRegion !== undefined) {
      obj.cropRegion = BBox.toJSON(message.cropRegion);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision>, I>>(base?: I): Vision {
    return Vision.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision>, I>>(object: I): Vision {
    const message = createBaseVision();
    message.timestamp = object.timestamp ?? 0;
    message.balls = object.balls?.map((e) => Vision_BallInfo.fromPartial(e)) || [];
    message.robots = object.robots?.map((e) => Vision_RobotVisionInfo.fromPartial(e)) || [];
    message.fieldBoundaries = object.fieldBoundaries?.map((e) => Vision_FieldBoundaryInfo.fromPartial(e)) || [];
    message.fieldFeatures = object.fieldFeatures?.map((e) => Vision_FieldFeatureInfo.fromPartial(e)) || [];
    message.regions = object.regions?.map((e) => Vision_RegionI.fromPartial(e)) || [];
    message.topCameraSettings = (object.topCameraSettings !== undefined && object.topCameraSettings !== null)
      ? Vision_CameraSettings.fromPartial(object.topCameraSettings)
      : undefined;
    message.botCameraSettings = (object.botCameraSettings !== undefined && object.botCameraSettings !== null)
      ? Vision_CameraSettings.fromPartial(object.botCameraSettings)
      : undefined;
    message.topSaliency = object.topSaliency ?? new Uint8Array(0);
    message.botSaliency = object.botSaliency ?? new Uint8Array(0);
    message.topFrame = object.topFrame ?? new Uint8Array(0);
    message.botFrame = object.botFrame ?? new Uint8Array(0);
    message.horizontalFieldOfView = object.horizontalFieldOfView ?? 0;
    message.verticalFieldOfView = object.verticalFieldOfView ?? 0;
    message.topFrameJPEG = object.topFrameJPEG ?? new Uint8Array(0);
    message.botFrameJPEG = object.botFrameJPEG ?? new Uint8Array(0);
    message.ATWindowSizeTop = object.ATWindowSizeTop ?? 0;
    message.ATWindowSizeBot = object.ATWindowSizeBot ?? 0;
    message.ATPercentageTop = object.ATPercentageTop ?? 0;
    message.ATPercentageBot = object.ATPercentageBot ?? 0;
    message.redRegions = object.redRegions?.map((e) => BBox.fromPartial(e)) || [];
    message.refereeHands = object.refereeHands?.map((e) => Vision_RefereeHandsVisionInfo.fromPartial(e)) || [];
    message.refereeHandDetectorSettings =
      (object.refereeHandDetectorSettings !== undefined && object.refereeHandDetectorSettings !== null)
        ? Vision_RefereeHandDetectorSettings.fromPartial(object.refereeHandDetectorSettings)
        : undefined;
    message.cropRegion = (object.cropRegion !== undefined && object.cropRegion !== null)
      ? BBox.fromPartial(object.cropRegion)
      : undefined;
    return message;
  },
};

function createBaseVision_BallInfo(): Vision_BallInfo {
  return { rr: undefined, radius: 0, imageCoords: undefined, neckRelative: undefined, topCamera: false };
}

export const Vision_BallInfo = {
  encode(message: Vision_BallInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rr !== undefined) {
      RRCoord.encode(message.rr, writer.uint32(10).fork()).ldelim();
    }
    if (message.radius !== undefined && message.radius !== 0) {
      writer.uint32(16).int32(message.radius);
    }
    if (message.imageCoords !== undefined) {
      Point.encode(message.imageCoords, writer.uint32(26).fork()).ldelim();
    }
    if (message.neckRelative !== undefined) {
      XYZCoord.encode(message.neckRelative, writer.uint32(34).fork()).ldelim();
    }
    if (message.topCamera !== undefined && message.topCamera !== false) {
      writer.uint32(40).bool(message.topCamera);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_BallInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_BallInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.rr = RRCoord.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.radius = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.imageCoords = Point.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.neckRelative = XYZCoord.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.topCamera = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_BallInfo {
    return {
      rr: isSet(object.rr) ? RRCoord.fromJSON(object.rr) : undefined,
      radius: isSet(object.radius) ? globalThis.Number(object.radius) : 0,
      imageCoords: isSet(object.imageCoords) ? Point.fromJSON(object.imageCoords) : undefined,
      neckRelative: isSet(object.neckRelative) ? XYZCoord.fromJSON(object.neckRelative) : undefined,
      topCamera: isSet(object.topCamera) ? globalThis.Boolean(object.topCamera) : false,
    };
  },

  toJSON(message: Vision_BallInfo): unknown {
    const obj: any = {};
    if (message.rr !== undefined) {
      obj.rr = RRCoord.toJSON(message.rr);
    }
    if (message.radius !== undefined && message.radius !== 0) {
      obj.radius = Math.round(message.radius);
    }
    if (message.imageCoords !== undefined) {
      obj.imageCoords = Point.toJSON(message.imageCoords);
    }
    if (message.neckRelative !== undefined) {
      obj.neckRelative = XYZCoord.toJSON(message.neckRelative);
    }
    if (message.topCamera !== undefined && message.topCamera !== false) {
      obj.topCamera = message.topCamera;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_BallInfo>, I>>(base?: I): Vision_BallInfo {
    return Vision_BallInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_BallInfo>, I>>(object: I): Vision_BallInfo {
    const message = createBaseVision_BallInfo();
    message.rr = (object.rr !== undefined && object.rr !== null) ? RRCoord.fromPartial(object.rr) : undefined;
    message.radius = object.radius ?? 0;
    message.imageCoords = (object.imageCoords !== undefined && object.imageCoords !== null)
      ? Point.fromPartial(object.imageCoords)
      : undefined;
    message.neckRelative = (object.neckRelative !== undefined && object.neckRelative !== null)
      ? XYZCoord.fromPartial(object.neckRelative)
      : undefined;
    message.topCamera = object.topCamera ?? false;
    return message;
  },
};

function createBaseVision_PostInfo(): Vision_PostInfo {
  return { rr: undefined, type: 0, imageCoords: undefined, wDistance: 0, kDistance: 0, trustDistance: false, dir: 0 };
}

export const Vision_PostInfo = {
  encode(message: Vision_PostInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rr !== undefined) {
      RRCoord.encode(message.rr, writer.uint32(10).fork()).ldelim();
    }
    if (message.type !== undefined && message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.imageCoords !== undefined) {
      BBox.encode(message.imageCoords, writer.uint32(26).fork()).ldelim();
    }
    if (message.wDistance !== undefined && message.wDistance !== 0) {
      writer.uint32(37).float(message.wDistance);
    }
    if (message.kDistance !== undefined && message.kDistance !== 0) {
      writer.uint32(45).float(message.kDistance);
    }
    if (message.trustDistance !== undefined && message.trustDistance !== false) {
      writer.uint32(48).bool(message.trustDistance);
    }
    if (message.dir !== undefined && message.dir !== 0) {
      writer.uint32(56).int32(message.dir);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_PostInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_PostInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.rr = RRCoord.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.imageCoords = BBox.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.wDistance = reader.float();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.kDistance = reader.float();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.trustDistance = reader.bool();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.dir = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_PostInfo {
    return {
      rr: isSet(object.rr) ? RRCoord.fromJSON(object.rr) : undefined,
      type: isSet(object.type) ? vision_PostInfoTypeFromJSON(object.type) : 0,
      imageCoords: isSet(object.imageCoords) ? BBox.fromJSON(object.imageCoords) : undefined,
      wDistance: isSet(object.wDistance) ? globalThis.Number(object.wDistance) : 0,
      kDistance: isSet(object.kDistance) ? globalThis.Number(object.kDistance) : 0,
      trustDistance: isSet(object.trustDistance) ? globalThis.Boolean(object.trustDistance) : false,
      dir: isSet(object.dir) ? vision_PostInfoDirectionFromJSON(object.dir) : 0,
    };
  },

  toJSON(message: Vision_PostInfo): unknown {
    const obj: any = {};
    if (message.rr !== undefined) {
      obj.rr = RRCoord.toJSON(message.rr);
    }
    if (message.type !== undefined && message.type !== 0) {
      obj.type = vision_PostInfoTypeToJSON(message.type);
    }
    if (message.imageCoords !== undefined) {
      obj.imageCoords = BBox.toJSON(message.imageCoords);
    }
    if (message.wDistance !== undefined && message.wDistance !== 0) {
      obj.wDistance = message.wDistance;
    }
    if (message.kDistance !== undefined && message.kDistance !== 0) {
      obj.kDistance = message.kDistance;
    }
    if (message.trustDistance !== undefined && message.trustDistance !== false) {
      obj.trustDistance = message.trustDistance;
    }
    if (message.dir !== undefined && message.dir !== 0) {
      obj.dir = vision_PostInfoDirectionToJSON(message.dir);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_PostInfo>, I>>(base?: I): Vision_PostInfo {
    return Vision_PostInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_PostInfo>, I>>(object: I): Vision_PostInfo {
    const message = createBaseVision_PostInfo();
    message.rr = (object.rr !== undefined && object.rr !== null) ? RRCoord.fromPartial(object.rr) : undefined;
    message.type = object.type ?? 0;
    message.imageCoords = (object.imageCoords !== undefined && object.imageCoords !== null)
      ? BBox.fromPartial(object.imageCoords)
      : undefined;
    message.wDistance = object.wDistance ?? 0;
    message.kDistance = object.kDistance ?? 0;
    message.trustDistance = object.trustDistance ?? false;
    message.dir = object.dir ?? 0;
    return message;
  },
};

function createBaseVision_RobotVisionInfo(): Vision_RobotVisionInfo {
  return {
    rr: undefined,
    type: 0,
    cameras: 2,
    imageCoords: undefined,
    topImageCoords: undefined,
    botImageCoords: undefined,
  };
}

export const Vision_RobotVisionInfo = {
  encode(message: Vision_RobotVisionInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rr !== undefined) {
      RRCoord.encode(message.rr, writer.uint32(10).fork()).ldelim();
    }
    if (message.type !== undefined && message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.cameras !== undefined && message.cameras !== 2) {
      writer.uint32(24).int32(message.cameras);
    }
    if (message.imageCoords !== undefined) {
      BBox.encode(message.imageCoords, writer.uint32(34).fork()).ldelim();
    }
    if (message.topImageCoords !== undefined) {
      BBox.encode(message.topImageCoords, writer.uint32(42).fork()).ldelim();
    }
    if (message.botImageCoords !== undefined) {
      BBox.encode(message.botImageCoords, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_RobotVisionInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_RobotVisionInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.rr = RRCoord.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.cameras = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.imageCoords = BBox.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.topImageCoords = BBox.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.botImageCoords = BBox.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_RobotVisionInfo {
    return {
      rr: isSet(object.rr) ? RRCoord.fromJSON(object.rr) : undefined,
      type: isSet(object.type) ? robotVisionInfoTypeFromJSON(object.type) : 0,
      cameras: isSet(object.cameras) ? vision_CamerasFromJSON(object.cameras) : 2,
      imageCoords: isSet(object.imageCoords) ? BBox.fromJSON(object.imageCoords) : undefined,
      topImageCoords: isSet(object.topImageCoords) ? BBox.fromJSON(object.topImageCoords) : undefined,
      botImageCoords: isSet(object.botImageCoords) ? BBox.fromJSON(object.botImageCoords) : undefined,
    };
  },

  toJSON(message: Vision_RobotVisionInfo): unknown {
    const obj: any = {};
    if (message.rr !== undefined) {
      obj.rr = RRCoord.toJSON(message.rr);
    }
    if (message.type !== undefined && message.type !== 0) {
      obj.type = robotVisionInfoTypeToJSON(message.type);
    }
    if (message.cameras !== undefined && message.cameras !== 2) {
      obj.cameras = vision_CamerasToJSON(message.cameras);
    }
    if (message.imageCoords !== undefined) {
      obj.imageCoords = BBox.toJSON(message.imageCoords);
    }
    if (message.topImageCoords !== undefined) {
      obj.topImageCoords = BBox.toJSON(message.topImageCoords);
    }
    if (message.botImageCoords !== undefined) {
      obj.botImageCoords = BBox.toJSON(message.botImageCoords);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_RobotVisionInfo>, I>>(base?: I): Vision_RobotVisionInfo {
    return Vision_RobotVisionInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_RobotVisionInfo>, I>>(object: I): Vision_RobotVisionInfo {
    const message = createBaseVision_RobotVisionInfo();
    message.rr = (object.rr !== undefined && object.rr !== null) ? RRCoord.fromPartial(object.rr) : undefined;
    message.type = object.type ?? 0;
    message.cameras = object.cameras ?? 2;
    message.imageCoords = (object.imageCoords !== undefined && object.imageCoords !== null)
      ? BBox.fromPartial(object.imageCoords)
      : undefined;
    message.topImageCoords = (object.topImageCoords !== undefined && object.topImageCoords !== null)
      ? BBox.fromPartial(object.topImageCoords)
      : undefined;
    message.botImageCoords = (object.botImageCoords !== undefined && object.botImageCoords !== null)
      ? BBox.fromPartial(object.botImageCoords)
      : undefined;
    return message;
  },
};

function createBaseVision_RefereeHandsVisionInfo(): Vision_RefereeHandsVisionInfo {
  return { left: undefined, right: undefined };
}

export const Vision_RefereeHandsVisionInfo = {
  encode(message: Vision_RefereeHandsVisionInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.left !== undefined) {
      Vision_RefereeHand.encode(message.left, writer.uint32(10).fork()).ldelim();
    }
    if (message.right !== undefined) {
      Vision_RefereeHand.encode(message.right, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_RefereeHandsVisionInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_RefereeHandsVisionInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.left = Vision_RefereeHand.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.right = Vision_RefereeHand.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_RefereeHandsVisionInfo {
    return {
      left: isSet(object.left) ? Vision_RefereeHand.fromJSON(object.left) : undefined,
      right: isSet(object.right) ? Vision_RefereeHand.fromJSON(object.right) : undefined,
    };
  },

  toJSON(message: Vision_RefereeHandsVisionInfo): unknown {
    const obj: any = {};
    if (message.left !== undefined) {
      obj.left = Vision_RefereeHand.toJSON(message.left);
    }
    if (message.right !== undefined) {
      obj.right = Vision_RefereeHand.toJSON(message.right);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_RefereeHandsVisionInfo>, I>>(base?: I): Vision_RefereeHandsVisionInfo {
    return Vision_RefereeHandsVisionInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_RefereeHandsVisionInfo>, I>>(
    object: I,
  ): Vision_RefereeHandsVisionInfo {
    const message = createBaseVision_RefereeHandsVisionInfo();
    message.left = (object.left !== undefined && object.left !== null)
      ? Vision_RefereeHand.fromPartial(object.left)
      : undefined;
    message.right = (object.right !== undefined && object.right !== null)
      ? Vision_RefereeHand.fromPartial(object.right)
      : undefined;
    return message;
  },
};

function createBaseVision_RefereeHand(): Vision_RefereeHand {
  return { topImageCoords: undefined };
}

export const Vision_RefereeHand = {
  encode(message: Vision_RefereeHand, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.topImageCoords !== undefined) {
      BBox.encode(message.topImageCoords, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_RefereeHand {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_RefereeHand();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.topImageCoords = BBox.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_RefereeHand {
    return { topImageCoords: isSet(object.topImageCoords) ? BBox.fromJSON(object.topImageCoords) : undefined };
  },

  toJSON(message: Vision_RefereeHand): unknown {
    const obj: any = {};
    if (message.topImageCoords !== undefined) {
      obj.topImageCoords = BBox.toJSON(message.topImageCoords);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_RefereeHand>, I>>(base?: I): Vision_RefereeHand {
    return Vision_RefereeHand.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_RefereeHand>, I>>(object: I): Vision_RefereeHand {
    const message = createBaseVision_RefereeHand();
    message.topImageCoords = (object.topImageCoords !== undefined && object.topImageCoords !== null)
      ? BBox.fromPartial(object.topImageCoords)
      : undefined;
    return message;
  },
};

function createBaseVision_RANSACLine(): Vision_RANSACLine {
  return { t1: 0, t2: 0, t3: 0, var: 0, p1: undefined, p2: undefined };
}

export const Vision_RANSACLine = {
  encode(message: Vision_RANSACLine, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.t1 !== undefined && message.t1 !== 0) {
      writer.uint32(8).sint64(message.t1);
    }
    if (message.t2 !== undefined && message.t2 !== 0) {
      writer.uint32(16).sint64(message.t2);
    }
    if (message.t3 !== undefined && message.t3 !== 0) {
      writer.uint32(24).sint64(message.t3);
    }
    if (message.var !== undefined && message.var !== 0) {
      writer.uint32(37).float(message.var);
    }
    if (message.p1 !== undefined) {
      Point.encode(message.p1, writer.uint32(42).fork()).ldelim();
    }
    if (message.p2 !== undefined) {
      Point.encode(message.p2, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_RANSACLine {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_RANSACLine();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.t1 = longToNumber(reader.sint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.t2 = longToNumber(reader.sint64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.t3 = longToNumber(reader.sint64() as Long);
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.var = reader.float();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.p1 = Point.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.p2 = Point.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_RANSACLine {
    return {
      t1: isSet(object.t1) ? globalThis.Number(object.t1) : 0,
      t2: isSet(object.t2) ? globalThis.Number(object.t2) : 0,
      t3: isSet(object.t3) ? globalThis.Number(object.t3) : 0,
      var: isSet(object.var) ? globalThis.Number(object.var) : 0,
      p1: isSet(object.p1) ? Point.fromJSON(object.p1) : undefined,
      p2: isSet(object.p2) ? Point.fromJSON(object.p2) : undefined,
    };
  },

  toJSON(message: Vision_RANSACLine): unknown {
    const obj: any = {};
    if (message.t1 !== undefined && message.t1 !== 0) {
      obj.t1 = Math.round(message.t1);
    }
    if (message.t2 !== undefined && message.t2 !== 0) {
      obj.t2 = Math.round(message.t2);
    }
    if (message.t3 !== undefined && message.t3 !== 0) {
      obj.t3 = Math.round(message.t3);
    }
    if (message.var !== undefined && message.var !== 0) {
      obj.var = message.var;
    }
    if (message.p1 !== undefined) {
      obj.p1 = Point.toJSON(message.p1);
    }
    if (message.p2 !== undefined) {
      obj.p2 = Point.toJSON(message.p2);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_RANSACLine>, I>>(base?: I): Vision_RANSACLine {
    return Vision_RANSACLine.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_RANSACLine>, I>>(object: I): Vision_RANSACLine {
    const message = createBaseVision_RANSACLine();
    message.t1 = object.t1 ?? 0;
    message.t2 = object.t2 ?? 0;
    message.t3 = object.t3 ?? 0;
    message.var = object.var ?? 0;
    message.p1 = (object.p1 !== undefined && object.p1 !== null) ? Point.fromPartial(object.p1) : undefined;
    message.p2 = (object.p2 !== undefined && object.p2 !== null) ? Point.fromPartial(object.p2) : undefined;
    return message;
  },
};

function createBaseVision_FieldBoundaryInfo(): Vision_FieldBoundaryInfo {
  return { rrBoundary: undefined, imageBoundary: undefined };
}

export const Vision_FieldBoundaryInfo = {
  encode(message: Vision_FieldBoundaryInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rrBoundary !== undefined) {
      Vision_RANSACLine.encode(message.rrBoundary, writer.uint32(10).fork()).ldelim();
    }
    if (message.imageBoundary !== undefined) {
      Vision_RANSACLine.encode(message.imageBoundary, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldBoundaryInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldBoundaryInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.rrBoundary = Vision_RANSACLine.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.imageBoundary = Vision_RANSACLine.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldBoundaryInfo {
    return {
      rrBoundary: isSet(object.rrBoundary) ? Vision_RANSACLine.fromJSON(object.rrBoundary) : undefined,
      imageBoundary: isSet(object.imageBoundary) ? Vision_RANSACLine.fromJSON(object.imageBoundary) : undefined,
    };
  },

  toJSON(message: Vision_FieldBoundaryInfo): unknown {
    const obj: any = {};
    if (message.rrBoundary !== undefined) {
      obj.rrBoundary = Vision_RANSACLine.toJSON(message.rrBoundary);
    }
    if (message.imageBoundary !== undefined) {
      obj.imageBoundary = Vision_RANSACLine.toJSON(message.imageBoundary);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldBoundaryInfo>, I>>(base?: I): Vision_FieldBoundaryInfo {
    return Vision_FieldBoundaryInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldBoundaryInfo>, I>>(object: I): Vision_FieldBoundaryInfo {
    const message = createBaseVision_FieldBoundaryInfo();
    message.rrBoundary = (object.rrBoundary !== undefined && object.rrBoundary !== null)
      ? Vision_RANSACLine.fromPartial(object.rrBoundary)
      : undefined;
    message.imageBoundary = (object.imageBoundary !== undefined && object.imageBoundary !== null)
      ? Vision_RANSACLine.fromPartial(object.imageBoundary)
      : undefined;
    return message;
  },
};

function createBaseVision_FieldFeatureInfo(): Vision_FieldFeatureInfo {
  return { rr: undefined, type: 0, p1: undefined, p2: undefined };
}

export const Vision_FieldFeatureInfo = {
  encode(message: Vision_FieldFeatureInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rr !== undefined) {
      RRCoord.encode(message.rr, writer.uint32(10).fork()).ldelim();
    }
    if (message.type !== undefined && message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.p1 !== undefined) {
      Point.encode(message.p1, writer.uint32(106).fork()).ldelim();
    }
    if (message.p2 !== undefined) {
      Point.encode(message.p2, writer.uint32(114).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.rr = RRCoord.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.p1 = Point.decode(reader, reader.uint32());
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.p2 = Point.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldFeatureInfo {
    return {
      rr: isSet(object.rr) ? RRCoord.fromJSON(object.rr) : undefined,
      type: isSet(object.type) ? vision_FieldFeatureInfoTypeFromJSON(object.type) : 0,
      p1: isSet(object.p1) ? Point.fromJSON(object.p1) : undefined,
      p2: isSet(object.p2) ? Point.fromJSON(object.p2) : undefined,
    };
  },

  toJSON(message: Vision_FieldFeatureInfo): unknown {
    const obj: any = {};
    if (message.rr !== undefined) {
      obj.rr = RRCoord.toJSON(message.rr);
    }
    if (message.type !== undefined && message.type !== 0) {
      obj.type = vision_FieldFeatureInfoTypeToJSON(message.type);
    }
    if (message.p1 !== undefined) {
      obj.p1 = Point.toJSON(message.p1);
    }
    if (message.p2 !== undefined) {
      obj.p2 = Point.toJSON(message.p2);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo>, I>>(base?: I): Vision_FieldFeatureInfo {
    return Vision_FieldFeatureInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo>, I>>(object: I): Vision_FieldFeatureInfo {
    const message = createBaseVision_FieldFeatureInfo();
    message.rr = (object.rr !== undefined && object.rr !== null) ? RRCoord.fromPartial(object.rr) : undefined;
    message.type = object.type ?? 0;
    message.p1 = (object.p1 !== undefined && object.p1 !== null) ? Point.fromPartial(object.p1) : undefined;
    message.p2 = (object.p2 !== undefined && object.p2 !== null) ? Point.fromPartial(object.p2) : undefined;
    return message;
  },
};

function createBaseVision_FieldFeatureInfo_FieldLinePointInfo(): Vision_FieldFeatureInfo_FieldLinePointInfo {
  return { p: undefined, rrp: undefined };
}

export const Vision_FieldFeatureInfo_FieldLinePointInfo = {
  encode(message: Vision_FieldFeatureInfo_FieldLinePointInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.p !== undefined) {
      Point.encode(message.p, writer.uint32(10).fork()).ldelim();
    }
    if (message.rrp !== undefined) {
      Point.encode(message.rrp, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo_FieldLinePointInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo_FieldLinePointInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.p = Point.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.rrp = Point.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldFeatureInfo_FieldLinePointInfo {
    return {
      p: isSet(object.p) ? Point.fromJSON(object.p) : undefined,
      rrp: isSet(object.rrp) ? Point.fromJSON(object.rrp) : undefined,
    };
  },

  toJSON(message: Vision_FieldFeatureInfo_FieldLinePointInfo): unknown {
    const obj: any = {};
    if (message.p !== undefined) {
      obj.p = Point.toJSON(message.p);
    }
    if (message.rrp !== undefined) {
      obj.rrp = Point.toJSON(message.rrp);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_FieldLinePointInfo>, I>>(
    base?: I,
  ): Vision_FieldFeatureInfo_FieldLinePointInfo {
    return Vision_FieldFeatureInfo_FieldLinePointInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_FieldLinePointInfo>, I>>(
    object: I,
  ): Vision_FieldFeatureInfo_FieldLinePointInfo {
    const message = createBaseVision_FieldFeatureInfo_FieldLinePointInfo();
    message.p = (object.p !== undefined && object.p !== null) ? Point.fromPartial(object.p) : undefined;
    message.rrp = (object.rrp !== undefined && object.rrp !== null) ? Point.fromPartial(object.rrp) : undefined;
    return message;
  },
};

function createBaseVision_FieldFeatureInfo_LineInfo(): Vision_FieldFeatureInfo_LineInfo {
  return { p1: undefined, p2: undefined, t1: 0, t2: 0, t3: 0, rr: undefined };
}

export const Vision_FieldFeatureInfo_LineInfo = {
  encode(message: Vision_FieldFeatureInfo_LineInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.p1 !== undefined) {
      Point.encode(message.p1, writer.uint32(10).fork()).ldelim();
    }
    if (message.p2 !== undefined) {
      Point.encode(message.p2, writer.uint32(18).fork()).ldelim();
    }
    if (message.t1 !== undefined && message.t1 !== 0) {
      writer.uint32(24).sint32(message.t1);
    }
    if (message.t2 !== undefined && message.t2 !== 0) {
      writer.uint32(32).sint32(message.t2);
    }
    if (message.t3 !== undefined && message.t3 !== 0) {
      writer.uint32(40).sint32(message.t3);
    }
    if (message.rr !== undefined) {
      RRCoord.encode(message.rr, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo_LineInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo_LineInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.p1 = Point.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.p2 = Point.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.t1 = reader.sint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.t2 = reader.sint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.t3 = reader.sint32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.rr = RRCoord.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldFeatureInfo_LineInfo {
    return {
      p1: isSet(object.p1) ? Point.fromJSON(object.p1) : undefined,
      p2: isSet(object.p2) ? Point.fromJSON(object.p2) : undefined,
      t1: isSet(object.t1) ? globalThis.Number(object.t1) : 0,
      t2: isSet(object.t2) ? globalThis.Number(object.t2) : 0,
      t3: isSet(object.t3) ? globalThis.Number(object.t3) : 0,
      rr: isSet(object.rr) ? RRCoord.fromJSON(object.rr) : undefined,
    };
  },

  toJSON(message: Vision_FieldFeatureInfo_LineInfo): unknown {
    const obj: any = {};
    if (message.p1 !== undefined) {
      obj.p1 = Point.toJSON(message.p1);
    }
    if (message.p2 !== undefined) {
      obj.p2 = Point.toJSON(message.p2);
    }
    if (message.t1 !== undefined && message.t1 !== 0) {
      obj.t1 = Math.round(message.t1);
    }
    if (message.t2 !== undefined && message.t2 !== 0) {
      obj.t2 = Math.round(message.t2);
    }
    if (message.t3 !== undefined && message.t3 !== 0) {
      obj.t3 = Math.round(message.t3);
    }
    if (message.rr !== undefined) {
      obj.rr = RRCoord.toJSON(message.rr);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_LineInfo>, I>>(
    base?: I,
  ): Vision_FieldFeatureInfo_LineInfo {
    return Vision_FieldFeatureInfo_LineInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_LineInfo>, I>>(
    object: I,
  ): Vision_FieldFeatureInfo_LineInfo {
    const message = createBaseVision_FieldFeatureInfo_LineInfo();
    message.p1 = (object.p1 !== undefined && object.p1 !== null) ? Point.fromPartial(object.p1) : undefined;
    message.p2 = (object.p2 !== undefined && object.p2 !== null) ? Point.fromPartial(object.p2) : undefined;
    message.t1 = object.t1 ?? 0;
    message.t2 = object.t2 ?? 0;
    message.t3 = object.t3 ?? 0;
    message.rr = (object.rr !== undefined && object.rr !== null) ? RRCoord.fromPartial(object.rr) : undefined;
    return message;
  },
};

function createBaseVision_FieldFeatureInfo_CornerInfo(): Vision_FieldFeatureInfo_CornerInfo {
  return { p: undefined, e1: undefined, e2: undefined };
}

export const Vision_FieldFeatureInfo_CornerInfo = {
  encode(message: Vision_FieldFeatureInfo_CornerInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.p !== undefined) {
      Point.encode(message.p, writer.uint32(10).fork()).ldelim();
    }
    if (message.e1 !== undefined) {
      Point.encode(message.e1, writer.uint32(18).fork()).ldelim();
    }
    if (message.e2 !== undefined) {
      Point.encode(message.e2, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo_CornerInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo_CornerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.p = Point.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.e1 = Point.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.e2 = Point.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldFeatureInfo_CornerInfo {
    return {
      p: isSet(object.p) ? Point.fromJSON(object.p) : undefined,
      e1: isSet(object.e1) ? Point.fromJSON(object.e1) : undefined,
      e2: isSet(object.e2) ? Point.fromJSON(object.e2) : undefined,
    };
  },

  toJSON(message: Vision_FieldFeatureInfo_CornerInfo): unknown {
    const obj: any = {};
    if (message.p !== undefined) {
      obj.p = Point.toJSON(message.p);
    }
    if (message.e1 !== undefined) {
      obj.e1 = Point.toJSON(message.e1);
    }
    if (message.e2 !== undefined) {
      obj.e2 = Point.toJSON(message.e2);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_CornerInfo>, I>>(
    base?: I,
  ): Vision_FieldFeatureInfo_CornerInfo {
    return Vision_FieldFeatureInfo_CornerInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_CornerInfo>, I>>(
    object: I,
  ): Vision_FieldFeatureInfo_CornerInfo {
    const message = createBaseVision_FieldFeatureInfo_CornerInfo();
    message.p = (object.p !== undefined && object.p !== null) ? Point.fromPartial(object.p) : undefined;
    message.e1 = (object.e1 !== undefined && object.e1 !== null) ? Point.fromPartial(object.e1) : undefined;
    message.e2 = (object.e2 !== undefined && object.e2 !== null) ? Point.fromPartial(object.e2) : undefined;
    return message;
  },
};

function createBaseVision_FieldFeatureInfo_TJunctionInfo(): Vision_FieldFeatureInfo_TJunctionInfo {
  return { p: undefined };
}

export const Vision_FieldFeatureInfo_TJunctionInfo = {
  encode(message: Vision_FieldFeatureInfo_TJunctionInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.p !== undefined) {
      Point.encode(message.p, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo_TJunctionInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo_TJunctionInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.p = Point.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldFeatureInfo_TJunctionInfo {
    return { p: isSet(object.p) ? Point.fromJSON(object.p) : undefined };
  },

  toJSON(message: Vision_FieldFeatureInfo_TJunctionInfo): unknown {
    const obj: any = {};
    if (message.p !== undefined) {
      obj.p = Point.toJSON(message.p);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_TJunctionInfo>, I>>(
    base?: I,
  ): Vision_FieldFeatureInfo_TJunctionInfo {
    return Vision_FieldFeatureInfo_TJunctionInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_TJunctionInfo>, I>>(
    object: I,
  ): Vision_FieldFeatureInfo_TJunctionInfo {
    const message = createBaseVision_FieldFeatureInfo_TJunctionInfo();
    message.p = (object.p !== undefined && object.p !== null) ? Point.fromPartial(object.p) : undefined;
    return message;
  },
};

function createBaseVision_FieldFeatureInfo_GoalBoxCornerInfo(): Vision_FieldFeatureInfo_GoalBoxCornerInfo {
  return { p: undefined, leftCorner: false };
}

export const Vision_FieldFeatureInfo_GoalBoxCornerInfo = {
  encode(message: Vision_FieldFeatureInfo_GoalBoxCornerInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.p !== undefined) {
      Point.encode(message.p, writer.uint32(10).fork()).ldelim();
    }
    if (message.leftCorner !== undefined && message.leftCorner !== false) {
      writer.uint32(16).bool(message.leftCorner);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo_GoalBoxCornerInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo_GoalBoxCornerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.p = Point.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.leftCorner = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldFeatureInfo_GoalBoxCornerInfo {
    return {
      p: isSet(object.p) ? Point.fromJSON(object.p) : undefined,
      leftCorner: isSet(object.leftCorner) ? globalThis.Boolean(object.leftCorner) : false,
    };
  },

  toJSON(message: Vision_FieldFeatureInfo_GoalBoxCornerInfo): unknown {
    const obj: any = {};
    if (message.p !== undefined) {
      obj.p = Point.toJSON(message.p);
    }
    if (message.leftCorner !== undefined && message.leftCorner !== false) {
      obj.leftCorner = message.leftCorner;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_GoalBoxCornerInfo>, I>>(
    base?: I,
  ): Vision_FieldFeatureInfo_GoalBoxCornerInfo {
    return Vision_FieldFeatureInfo_GoalBoxCornerInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_GoalBoxCornerInfo>, I>>(
    object: I,
  ): Vision_FieldFeatureInfo_GoalBoxCornerInfo {
    const message = createBaseVision_FieldFeatureInfo_GoalBoxCornerInfo();
    message.p = (object.p !== undefined && object.p !== null) ? Point.fromPartial(object.p) : undefined;
    message.leftCorner = object.leftCorner ?? false;
    return message;
  },
};

function createBaseVision_FieldFeatureInfo_PenaltySpotInfo(): Vision_FieldFeatureInfo_PenaltySpotInfo {
  return { p: undefined, w: 0, h: 0 };
}

export const Vision_FieldFeatureInfo_PenaltySpotInfo = {
  encode(message: Vision_FieldFeatureInfo_PenaltySpotInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.p !== undefined) {
      Point.encode(message.p, writer.uint32(10).fork()).ldelim();
    }
    if (message.w !== undefined && message.w !== 0) {
      writer.uint32(16).sint32(message.w);
    }
    if (message.h !== undefined && message.h !== 0) {
      writer.uint32(24).sint32(message.h);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo_PenaltySpotInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo_PenaltySpotInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.p = Point.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.w = reader.sint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.h = reader.sint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldFeatureInfo_PenaltySpotInfo {
    return {
      p: isSet(object.p) ? Point.fromJSON(object.p) : undefined,
      w: isSet(object.w) ? globalThis.Number(object.w) : 0,
      h: isSet(object.h) ? globalThis.Number(object.h) : 0,
    };
  },

  toJSON(message: Vision_FieldFeatureInfo_PenaltySpotInfo): unknown {
    const obj: any = {};
    if (message.p !== undefined) {
      obj.p = Point.toJSON(message.p);
    }
    if (message.w !== undefined && message.w !== 0) {
      obj.w = Math.round(message.w);
    }
    if (message.h !== undefined && message.h !== 0) {
      obj.h = Math.round(message.h);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_PenaltySpotInfo>, I>>(
    base?: I,
  ): Vision_FieldFeatureInfo_PenaltySpotInfo {
    return Vision_FieldFeatureInfo_PenaltySpotInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_PenaltySpotInfo>, I>>(
    object: I,
  ): Vision_FieldFeatureInfo_PenaltySpotInfo {
    const message = createBaseVision_FieldFeatureInfo_PenaltySpotInfo();
    message.p = (object.p !== undefined && object.p !== null) ? Point.fromPartial(object.p) : undefined;
    message.w = object.w ?? 0;
    message.h = object.h ?? 0;
    return message;
  },
};

function createBaseVision_FieldFeatureInfo_XJunctionInfo(): Vision_FieldFeatureInfo_XJunctionInfo {
  return { p: undefined };
}

export const Vision_FieldFeatureInfo_XJunctionInfo = {
  encode(message: Vision_FieldFeatureInfo_XJunctionInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.p !== undefined) {
      Point.encode(message.p, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo_XJunctionInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo_XJunctionInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.p = Point.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldFeatureInfo_XJunctionInfo {
    return { p: isSet(object.p) ? Point.fromJSON(object.p) : undefined };
  },

  toJSON(message: Vision_FieldFeatureInfo_XJunctionInfo): unknown {
    const obj: any = {};
    if (message.p !== undefined) {
      obj.p = Point.toJSON(message.p);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_XJunctionInfo>, I>>(
    base?: I,
  ): Vision_FieldFeatureInfo_XJunctionInfo {
    return Vision_FieldFeatureInfo_XJunctionInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_XJunctionInfo>, I>>(
    object: I,
  ): Vision_FieldFeatureInfo_XJunctionInfo {
    const message = createBaseVision_FieldFeatureInfo_XJunctionInfo();
    message.p = (object.p !== undefined && object.p !== null) ? Point.fromPartial(object.p) : undefined;
    return message;
  },
};

function createBaseVision_FieldFeatureInfo_CentreCircleInfo(): Vision_FieldFeatureInfo_CentreCircleInfo {
  return {};
}

export const Vision_FieldFeatureInfo_CentreCircleInfo = {
  encode(_: Vision_FieldFeatureInfo_CentreCircleInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo_CentreCircleInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo_CentreCircleInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): Vision_FieldFeatureInfo_CentreCircleInfo {
    return {};
  },

  toJSON(_: Vision_FieldFeatureInfo_CentreCircleInfo): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_CentreCircleInfo>, I>>(
    base?: I,
  ): Vision_FieldFeatureInfo_CentreCircleInfo {
    return Vision_FieldFeatureInfo_CentreCircleInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_CentreCircleInfo>, I>>(
    _: I,
  ): Vision_FieldFeatureInfo_CentreCircleInfo {
    const message = createBaseVision_FieldFeatureInfo_CentreCircleInfo();
    return message;
  },
};

function createBaseVision_FieldFeatureInfo_ParallelLinesInfo(): Vision_FieldFeatureInfo_ParallelLinesInfo {
  return { l1: undefined, l2: undefined };
}

export const Vision_FieldFeatureInfo_ParallelLinesInfo = {
  encode(message: Vision_FieldFeatureInfo_ParallelLinesInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.l1 !== undefined) {
      Vision_FieldFeatureInfo_LineInfo.encode(message.l1, writer.uint32(10).fork()).ldelim();
    }
    if (message.l2 !== undefined) {
      Vision_FieldFeatureInfo_LineInfo.encode(message.l2, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_FieldFeatureInfo_ParallelLinesInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_FieldFeatureInfo_ParallelLinesInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.l1 = Vision_FieldFeatureInfo_LineInfo.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.l2 = Vision_FieldFeatureInfo_LineInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_FieldFeatureInfo_ParallelLinesInfo {
    return {
      l1: isSet(object.l1) ? Vision_FieldFeatureInfo_LineInfo.fromJSON(object.l1) : undefined,
      l2: isSet(object.l2) ? Vision_FieldFeatureInfo_LineInfo.fromJSON(object.l2) : undefined,
    };
  },

  toJSON(message: Vision_FieldFeatureInfo_ParallelLinesInfo): unknown {
    const obj: any = {};
    if (message.l1 !== undefined) {
      obj.l1 = Vision_FieldFeatureInfo_LineInfo.toJSON(message.l1);
    }
    if (message.l2 !== undefined) {
      obj.l2 = Vision_FieldFeatureInfo_LineInfo.toJSON(message.l2);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_ParallelLinesInfo>, I>>(
    base?: I,
  ): Vision_FieldFeatureInfo_ParallelLinesInfo {
    return Vision_FieldFeatureInfo_ParallelLinesInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_FieldFeatureInfo_ParallelLinesInfo>, I>>(
    object: I,
  ): Vision_FieldFeatureInfo_ParallelLinesInfo {
    const message = createBaseVision_FieldFeatureInfo_ParallelLinesInfo();
    message.l1 = (object.l1 !== undefined && object.l1 !== null)
      ? Vision_FieldFeatureInfo_LineInfo.fromPartial(object.l1)
      : undefined;
    message.l2 = (object.l2 !== undefined && object.l2 !== null)
      ? Vision_FieldFeatureInfo_LineInfo.fromPartial(object.l2)
      : undefined;
    return message;
  },
};

function createBaseVision_RegionI(): Vision_RegionI {
  return {
    isTopCamera: false,
    boundingBoxRel: undefined,
    boundingBoxFovea: undefined,
    boundingBoxRaw: undefined,
    nRawColsInRegion: 0,
    nRawRowsInRegion: 0,
    densityToRaw: 0,
    yOffsetRaw: 0,
    xOffsetRaw: 0,
    rawTotalWidth: 0,
    rawToFoveaDensity: 0,
    foveaWidth: 0,
  };
}

export const Vision_RegionI = {
  encode(message: Vision_RegionI, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isTopCamera !== undefined && message.isTopCamera !== false) {
      writer.uint32(8).bool(message.isTopCamera);
    }
    if (message.boundingBoxRel !== undefined) {
      BBox.encode(message.boundingBoxRel, writer.uint32(18).fork()).ldelim();
    }
    if (message.boundingBoxFovea !== undefined) {
      BBox.encode(message.boundingBoxFovea, writer.uint32(26).fork()).ldelim();
    }
    if (message.boundingBoxRaw !== undefined) {
      BBox.encode(message.boundingBoxRaw, writer.uint32(34).fork()).ldelim();
    }
    if (message.nRawColsInRegion !== undefined && message.nRawColsInRegion !== 0) {
      writer.uint32(40).int32(message.nRawColsInRegion);
    }
    if (message.nRawRowsInRegion !== undefined && message.nRawRowsInRegion !== 0) {
      writer.uint32(48).int32(message.nRawRowsInRegion);
    }
    if (message.densityToRaw !== undefined && message.densityToRaw !== 0) {
      writer.uint32(56).int32(message.densityToRaw);
    }
    if (message.yOffsetRaw !== undefined && message.yOffsetRaw !== 0) {
      writer.uint32(64).int32(message.yOffsetRaw);
    }
    if (message.xOffsetRaw !== undefined && message.xOffsetRaw !== 0) {
      writer.uint32(72).int32(message.xOffsetRaw);
    }
    if (message.rawTotalWidth !== undefined && message.rawTotalWidth !== 0) {
      writer.uint32(80).int32(message.rawTotalWidth);
    }
    if (message.rawToFoveaDensity !== undefined && message.rawToFoveaDensity !== 0) {
      writer.uint32(88).int32(message.rawToFoveaDensity);
    }
    if (message.foveaWidth !== undefined && message.foveaWidth !== 0) {
      writer.uint32(96).int32(message.foveaWidth);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_RegionI {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_RegionI();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.isTopCamera = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.boundingBoxRel = BBox.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.boundingBoxFovea = BBox.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.boundingBoxRaw = BBox.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.nRawColsInRegion = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.nRawRowsInRegion = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.densityToRaw = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.yOffsetRaw = reader.int32();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.xOffsetRaw = reader.int32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.rawTotalWidth = reader.int32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.rawToFoveaDensity = reader.int32();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.foveaWidth = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_RegionI {
    return {
      isTopCamera: isSet(object.isTopCamera) ? globalThis.Boolean(object.isTopCamera) : false,
      boundingBoxRel: isSet(object.boundingBoxRel) ? BBox.fromJSON(object.boundingBoxRel) : undefined,
      boundingBoxFovea: isSet(object.boundingBoxFovea) ? BBox.fromJSON(object.boundingBoxFovea) : undefined,
      boundingBoxRaw: isSet(object.boundingBoxRaw) ? BBox.fromJSON(object.boundingBoxRaw) : undefined,
      nRawColsInRegion: isSet(object.nRawColsInRegion) ? globalThis.Number(object.nRawColsInRegion) : 0,
      nRawRowsInRegion: isSet(object.nRawRowsInRegion) ? globalThis.Number(object.nRawRowsInRegion) : 0,
      densityToRaw: isSet(object.densityToRaw) ? globalThis.Number(object.densityToRaw) : 0,
      yOffsetRaw: isSet(object.yOffsetRaw) ? globalThis.Number(object.yOffsetRaw) : 0,
      xOffsetRaw: isSet(object.xOffsetRaw) ? globalThis.Number(object.xOffsetRaw) : 0,
      rawTotalWidth: isSet(object.rawTotalWidth) ? globalThis.Number(object.rawTotalWidth) : 0,
      rawToFoveaDensity: isSet(object.rawToFoveaDensity) ? globalThis.Number(object.rawToFoveaDensity) : 0,
      foveaWidth: isSet(object.foveaWidth) ? globalThis.Number(object.foveaWidth) : 0,
    };
  },

  toJSON(message: Vision_RegionI): unknown {
    const obj: any = {};
    if (message.isTopCamera !== undefined && message.isTopCamera !== false) {
      obj.isTopCamera = message.isTopCamera;
    }
    if (message.boundingBoxRel !== undefined) {
      obj.boundingBoxRel = BBox.toJSON(message.boundingBoxRel);
    }
    if (message.boundingBoxFovea !== undefined) {
      obj.boundingBoxFovea = BBox.toJSON(message.boundingBoxFovea);
    }
    if (message.boundingBoxRaw !== undefined) {
      obj.boundingBoxRaw = BBox.toJSON(message.boundingBoxRaw);
    }
    if (message.nRawColsInRegion !== undefined && message.nRawColsInRegion !== 0) {
      obj.nRawColsInRegion = Math.round(message.nRawColsInRegion);
    }
    if (message.nRawRowsInRegion !== undefined && message.nRawRowsInRegion !== 0) {
      obj.nRawRowsInRegion = Math.round(message.nRawRowsInRegion);
    }
    if (message.densityToRaw !== undefined && message.densityToRaw !== 0) {
      obj.densityToRaw = Math.round(message.densityToRaw);
    }
    if (message.yOffsetRaw !== undefined && message.yOffsetRaw !== 0) {
      obj.yOffsetRaw = Math.round(message.yOffsetRaw);
    }
    if (message.xOffsetRaw !== undefined && message.xOffsetRaw !== 0) {
      obj.xOffsetRaw = Math.round(message.xOffsetRaw);
    }
    if (message.rawTotalWidth !== undefined && message.rawTotalWidth !== 0) {
      obj.rawTotalWidth = Math.round(message.rawTotalWidth);
    }
    if (message.rawToFoveaDensity !== undefined && message.rawToFoveaDensity !== 0) {
      obj.rawToFoveaDensity = Math.round(message.rawToFoveaDensity);
    }
    if (message.foveaWidth !== undefined && message.foveaWidth !== 0) {
      obj.foveaWidth = Math.round(message.foveaWidth);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_RegionI>, I>>(base?: I): Vision_RegionI {
    return Vision_RegionI.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_RegionI>, I>>(object: I): Vision_RegionI {
    const message = createBaseVision_RegionI();
    message.isTopCamera = object.isTopCamera ?? false;
    message.boundingBoxRel = (object.boundingBoxRel !== undefined && object.boundingBoxRel !== null)
      ? BBox.fromPartial(object.boundingBoxRel)
      : undefined;
    message.boundingBoxFovea = (object.boundingBoxFovea !== undefined && object.boundingBoxFovea !== null)
      ? BBox.fromPartial(object.boundingBoxFovea)
      : undefined;
    message.boundingBoxRaw = (object.boundingBoxRaw !== undefined && object.boundingBoxRaw !== null)
      ? BBox.fromPartial(object.boundingBoxRaw)
      : undefined;
    message.nRawColsInRegion = object.nRawColsInRegion ?? 0;
    message.nRawRowsInRegion = object.nRawRowsInRegion ?? 0;
    message.densityToRaw = object.densityToRaw ?? 0;
    message.yOffsetRaw = object.yOffsetRaw ?? 0;
    message.xOffsetRaw = object.xOffsetRaw ?? 0;
    message.rawTotalWidth = object.rawTotalWidth ?? 0;
    message.rawToFoveaDensity = object.rawToFoveaDensity ?? 0;
    message.foveaWidth = object.foveaWidth ?? 0;
    return message;
  },
};

function createBaseVision_CameraSettings(): Vision_CameraSettings {
  return {
    hflip: 0,
    vflip: 0,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    sharpness: 0,
    backlightCompensation: 0,
    exposure: 0,
    gain: 0,
    whiteBalance: 0,
    exposureAuto: 0,
    autoWhiteBalance: 0,
    autoFocus: 0,
    exposureAlgorithm: 0,
    aeTargetAvgLuma: 0,
    aeTargetAvgLumaDark: 0,
    aeTargetGain: 0,
    aeMinVirtGain: 0,
    aeMaxVirtGain: 0,
    aeMinVirtAGain: 0,
    aeMaxVirtAGain: 0,
    aeTargetExposure: 0,
    aeUseWeightTable: false,
  };
}

export const Vision_CameraSettings = {
  encode(message: Vision_CameraSettings, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hflip !== undefined && message.hflip !== 0) {
      writer.uint32(8).uint32(message.hflip);
    }
    if (message.vflip !== undefined && message.vflip !== 0) {
      writer.uint32(16).uint32(message.vflip);
    }
    if (message.brightness !== undefined && message.brightness !== 0) {
      writer.uint32(24).uint32(message.brightness);
    }
    if (message.contrast !== undefined && message.contrast !== 0) {
      writer.uint32(32).uint32(message.contrast);
    }
    if (message.saturation !== undefined && message.saturation !== 0) {
      writer.uint32(40).uint32(message.saturation);
    }
    if (message.hue !== undefined && message.hue !== 0) {
      writer.uint32(48).uint32(message.hue);
    }
    if (message.sharpness !== undefined && message.sharpness !== 0) {
      writer.uint32(56).uint32(message.sharpness);
    }
    if (message.backlightCompensation !== undefined && message.backlightCompensation !== 0) {
      writer.uint32(64).uint32(message.backlightCompensation);
    }
    if (message.exposure !== undefined && message.exposure !== 0) {
      writer.uint32(72).uint32(message.exposure);
    }
    if (message.gain !== undefined && message.gain !== 0) {
      writer.uint32(80).uint32(message.gain);
    }
    if (message.whiteBalance !== undefined && message.whiteBalance !== 0) {
      writer.uint32(88).uint32(message.whiteBalance);
    }
    if (message.exposureAuto !== undefined && message.exposureAuto !== 0) {
      writer.uint32(96).uint32(message.exposureAuto);
    }
    if (message.autoWhiteBalance !== undefined && message.autoWhiteBalance !== 0) {
      writer.uint32(104).uint32(message.autoWhiteBalance);
    }
    if (message.autoFocus !== undefined && message.autoFocus !== 0) {
      writer.uint32(112).uint32(message.autoFocus);
    }
    if (message.exposureAlgorithm !== undefined && message.exposureAlgorithm !== 0) {
      writer.uint32(120).uint32(message.exposureAlgorithm);
    }
    if (message.aeTargetAvgLuma !== undefined && message.aeTargetAvgLuma !== 0) {
      writer.uint32(128).uint32(message.aeTargetAvgLuma);
    }
    if (message.aeTargetAvgLumaDark !== undefined && message.aeTargetAvgLumaDark !== 0) {
      writer.uint32(136).uint32(message.aeTargetAvgLumaDark);
    }
    if (message.aeTargetGain !== undefined && message.aeTargetGain !== 0) {
      writer.uint32(144).uint32(message.aeTargetGain);
    }
    if (message.aeMinVirtGain !== undefined && message.aeMinVirtGain !== 0) {
      writer.uint32(152).uint32(message.aeMinVirtGain);
    }
    if (message.aeMaxVirtGain !== undefined && message.aeMaxVirtGain !== 0) {
      writer.uint32(160).uint32(message.aeMaxVirtGain);
    }
    if (message.aeMinVirtAGain !== undefined && message.aeMinVirtAGain !== 0) {
      writer.uint32(168).uint32(message.aeMinVirtAGain);
    }
    if (message.aeMaxVirtAGain !== undefined && message.aeMaxVirtAGain !== 0) {
      writer.uint32(176).uint32(message.aeMaxVirtAGain);
    }
    if (message.aeTargetExposure !== undefined && message.aeTargetExposure !== 0) {
      writer.uint32(184).uint32(message.aeTargetExposure);
    }
    if (message.aeUseWeightTable !== undefined && message.aeUseWeightTable !== false) {
      writer.uint32(192).bool(message.aeUseWeightTable);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_CameraSettings {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_CameraSettings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.hflip = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.vflip = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.brightness = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.contrast = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.saturation = reader.uint32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.hue = reader.uint32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.sharpness = reader.uint32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.backlightCompensation = reader.uint32();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.exposure = reader.uint32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.gain = reader.uint32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.whiteBalance = reader.uint32();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.exposureAuto = reader.uint32();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.autoWhiteBalance = reader.uint32();
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.autoFocus = reader.uint32();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.exposureAlgorithm = reader.uint32();
          continue;
        case 16:
          if (tag !== 128) {
            break;
          }

          message.aeTargetAvgLuma = reader.uint32();
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }

          message.aeTargetAvgLumaDark = reader.uint32();
          continue;
        case 18:
          if (tag !== 144) {
            break;
          }

          message.aeTargetGain = reader.uint32();
          continue;
        case 19:
          if (tag !== 152) {
            break;
          }

          message.aeMinVirtGain = reader.uint32();
          continue;
        case 20:
          if (tag !== 160) {
            break;
          }

          message.aeMaxVirtGain = reader.uint32();
          continue;
        case 21:
          if (tag !== 168) {
            break;
          }

          message.aeMinVirtAGain = reader.uint32();
          continue;
        case 22:
          if (tag !== 176) {
            break;
          }

          message.aeMaxVirtAGain = reader.uint32();
          continue;
        case 23:
          if (tag !== 184) {
            break;
          }

          message.aeTargetExposure = reader.uint32();
          continue;
        case 24:
          if (tag !== 192) {
            break;
          }

          message.aeUseWeightTable = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_CameraSettings {
    return {
      hflip: isSet(object.hflip) ? globalThis.Number(object.hflip) : 0,
      vflip: isSet(object.vflip) ? globalThis.Number(object.vflip) : 0,
      brightness: isSet(object.brightness) ? globalThis.Number(object.brightness) : 0,
      contrast: isSet(object.contrast) ? globalThis.Number(object.contrast) : 0,
      saturation: isSet(object.saturation) ? globalThis.Number(object.saturation) : 0,
      hue: isSet(object.hue) ? globalThis.Number(object.hue) : 0,
      sharpness: isSet(object.sharpness) ? globalThis.Number(object.sharpness) : 0,
      backlightCompensation: isSet(object.backlightCompensation) ? globalThis.Number(object.backlightCompensation) : 0,
      exposure: isSet(object.exposure) ? globalThis.Number(object.exposure) : 0,
      gain: isSet(object.gain) ? globalThis.Number(object.gain) : 0,
      whiteBalance: isSet(object.whiteBalance) ? globalThis.Number(object.whiteBalance) : 0,
      exposureAuto: isSet(object.exposureAuto) ? globalThis.Number(object.exposureAuto) : 0,
      autoWhiteBalance: isSet(object.autoWhiteBalance) ? globalThis.Number(object.autoWhiteBalance) : 0,
      autoFocus: isSet(object.autoFocus) ? globalThis.Number(object.autoFocus) : 0,
      exposureAlgorithm: isSet(object.exposureAlgorithm) ? globalThis.Number(object.exposureAlgorithm) : 0,
      aeTargetAvgLuma: isSet(object.aeTargetAvgLuma) ? globalThis.Number(object.aeTargetAvgLuma) : 0,
      aeTargetAvgLumaDark: isSet(object.aeTargetAvgLumaDark) ? globalThis.Number(object.aeTargetAvgLumaDark) : 0,
      aeTargetGain: isSet(object.aeTargetGain) ? globalThis.Number(object.aeTargetGain) : 0,
      aeMinVirtGain: isSet(object.aeMinVirtGain) ? globalThis.Number(object.aeMinVirtGain) : 0,
      aeMaxVirtGain: isSet(object.aeMaxVirtGain) ? globalThis.Number(object.aeMaxVirtGain) : 0,
      aeMinVirtAGain: isSet(object.aeMinVirtAGain) ? globalThis.Number(object.aeMinVirtAGain) : 0,
      aeMaxVirtAGain: isSet(object.aeMaxVirtAGain) ? globalThis.Number(object.aeMaxVirtAGain) : 0,
      aeTargetExposure: isSet(object.aeTargetExposure) ? globalThis.Number(object.aeTargetExposure) : 0,
      aeUseWeightTable: isSet(object.aeUseWeightTable) ? globalThis.Boolean(object.aeUseWeightTable) : false,
    };
  },

  toJSON(message: Vision_CameraSettings): unknown {
    const obj: any = {};
    if (message.hflip !== undefined && message.hflip !== 0) {
      obj.hflip = Math.round(message.hflip);
    }
    if (message.vflip !== undefined && message.vflip !== 0) {
      obj.vflip = Math.round(message.vflip);
    }
    if (message.brightness !== undefined && message.brightness !== 0) {
      obj.brightness = Math.round(message.brightness);
    }
    if (message.contrast !== undefined && message.contrast !== 0) {
      obj.contrast = Math.round(message.contrast);
    }
    if (message.saturation !== undefined && message.saturation !== 0) {
      obj.saturation = Math.round(message.saturation);
    }
    if (message.hue !== undefined && message.hue !== 0) {
      obj.hue = Math.round(message.hue);
    }
    if (message.sharpness !== undefined && message.sharpness !== 0) {
      obj.sharpness = Math.round(message.sharpness);
    }
    if (message.backlightCompensation !== undefined && message.backlightCompensation !== 0) {
      obj.backlightCompensation = Math.round(message.backlightCompensation);
    }
    if (message.exposure !== undefined && message.exposure !== 0) {
      obj.exposure = Math.round(message.exposure);
    }
    if (message.gain !== undefined && message.gain !== 0) {
      obj.gain = Math.round(message.gain);
    }
    if (message.whiteBalance !== undefined && message.whiteBalance !== 0) {
      obj.whiteBalance = Math.round(message.whiteBalance);
    }
    if (message.exposureAuto !== undefined && message.exposureAuto !== 0) {
      obj.exposureAuto = Math.round(message.exposureAuto);
    }
    if (message.autoWhiteBalance !== undefined && message.autoWhiteBalance !== 0) {
      obj.autoWhiteBalance = Math.round(message.autoWhiteBalance);
    }
    if (message.autoFocus !== undefined && message.autoFocus !== 0) {
      obj.autoFocus = Math.round(message.autoFocus);
    }
    if (message.exposureAlgorithm !== undefined && message.exposureAlgorithm !== 0) {
      obj.exposureAlgorithm = Math.round(message.exposureAlgorithm);
    }
    if (message.aeTargetAvgLuma !== undefined && message.aeTargetAvgLuma !== 0) {
      obj.aeTargetAvgLuma = Math.round(message.aeTargetAvgLuma);
    }
    if (message.aeTargetAvgLumaDark !== undefined && message.aeTargetAvgLumaDark !== 0) {
      obj.aeTargetAvgLumaDark = Math.round(message.aeTargetAvgLumaDark);
    }
    if (message.aeTargetGain !== undefined && message.aeTargetGain !== 0) {
      obj.aeTargetGain = Math.round(message.aeTargetGain);
    }
    if (message.aeMinVirtGain !== undefined && message.aeMinVirtGain !== 0) {
      obj.aeMinVirtGain = Math.round(message.aeMinVirtGain);
    }
    if (message.aeMaxVirtGain !== undefined && message.aeMaxVirtGain !== 0) {
      obj.aeMaxVirtGain = Math.round(message.aeMaxVirtGain);
    }
    if (message.aeMinVirtAGain !== undefined && message.aeMinVirtAGain !== 0) {
      obj.aeMinVirtAGain = Math.round(message.aeMinVirtAGain);
    }
    if (message.aeMaxVirtAGain !== undefined && message.aeMaxVirtAGain !== 0) {
      obj.aeMaxVirtAGain = Math.round(message.aeMaxVirtAGain);
    }
    if (message.aeTargetExposure !== undefined && message.aeTargetExposure !== 0) {
      obj.aeTargetExposure = Math.round(message.aeTargetExposure);
    }
    if (message.aeUseWeightTable !== undefined && message.aeUseWeightTable !== false) {
      obj.aeUseWeightTable = message.aeUseWeightTable;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_CameraSettings>, I>>(base?: I): Vision_CameraSettings {
    return Vision_CameraSettings.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_CameraSettings>, I>>(object: I): Vision_CameraSettings {
    const message = createBaseVision_CameraSettings();
    message.hflip = object.hflip ?? 0;
    message.vflip = object.vflip ?? 0;
    message.brightness = object.brightness ?? 0;
    message.contrast = object.contrast ?? 0;
    message.saturation = object.saturation ?? 0;
    message.hue = object.hue ?? 0;
    message.sharpness = object.sharpness ?? 0;
    message.backlightCompensation = object.backlightCompensation ?? 0;
    message.exposure = object.exposure ?? 0;
    message.gain = object.gain ?? 0;
    message.whiteBalance = object.whiteBalance ?? 0;
    message.exposureAuto = object.exposureAuto ?? 0;
    message.autoWhiteBalance = object.autoWhiteBalance ?? 0;
    message.autoFocus = object.autoFocus ?? 0;
    message.exposureAlgorithm = object.exposureAlgorithm ?? 0;
    message.aeTargetAvgLuma = object.aeTargetAvgLuma ?? 0;
    message.aeTargetAvgLumaDark = object.aeTargetAvgLumaDark ?? 0;
    message.aeTargetGain = object.aeTargetGain ?? 0;
    message.aeMinVirtGain = object.aeMinVirtGain ?? 0;
    message.aeMaxVirtGain = object.aeMaxVirtGain ?? 0;
    message.aeMinVirtAGain = object.aeMinVirtAGain ?? 0;
    message.aeMaxVirtAGain = object.aeMaxVirtAGain ?? 0;
    message.aeTargetExposure = object.aeTargetExposure ?? 0;
    message.aeUseWeightTable = object.aeUseWeightTable ?? false;
    return message;
  },
};

function createBaseVision_RefereeHandDetectorSettings(): Vision_RefereeHandDetectorSettings {
  return {
    handMinHDistance: 0,
    handMaxHDistance: 0,
    handMinVDistance: 0,
    handMaxVDistance: 0,
    cropLeft: 0,
    cropRight: 0,
    cropTop: 0,
    cropBottom: 0,
    enabled: 0,
    area: 0,
  };
}

export const Vision_RefereeHandDetectorSettings = {
  encode(message: Vision_RefereeHandDetectorSettings, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.handMinHDistance !== undefined && message.handMinHDistance !== 0) {
      writer.uint32(8).int32(message.handMinHDistance);
    }
    if (message.handMaxHDistance !== undefined && message.handMaxHDistance !== 0) {
      writer.uint32(16).int32(message.handMaxHDistance);
    }
    if (message.handMinVDistance !== undefined && message.handMinVDistance !== 0) {
      writer.uint32(24).int32(message.handMinVDistance);
    }
    if (message.handMaxVDistance !== undefined && message.handMaxVDistance !== 0) {
      writer.uint32(32).int32(message.handMaxVDistance);
    }
    if (message.cropLeft !== undefined && message.cropLeft !== 0) {
      writer.uint32(40).int32(message.cropLeft);
    }
    if (message.cropRight !== undefined && message.cropRight !== 0) {
      writer.uint32(48).int32(message.cropRight);
    }
    if (message.cropTop !== undefined && message.cropTop !== 0) {
      writer.uint32(56).int32(message.cropTop);
    }
    if (message.cropBottom !== undefined && message.cropBottom !== 0) {
      writer.uint32(64).int32(message.cropBottom);
    }
    if (message.enabled !== undefined && message.enabled !== 0) {
      writer.uint32(72).int32(message.enabled);
    }
    if (message.area !== undefined && message.area !== 0) {
      writer.uint32(80).int32(message.area);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vision_RefereeHandDetectorSettings {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVision_RefereeHandDetectorSettings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.handMinHDistance = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.handMaxHDistance = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.handMinVDistance = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.handMaxVDistance = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.cropLeft = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.cropRight = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.cropTop = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.cropBottom = reader.int32();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.enabled = reader.int32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.area = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vision_RefereeHandDetectorSettings {
    return {
      handMinHDistance: isSet(object.handMinHDistance) ? globalThis.Number(object.handMinHDistance) : 0,
      handMaxHDistance: isSet(object.handMaxHDistance) ? globalThis.Number(object.handMaxHDistance) : 0,
      handMinVDistance: isSet(object.handMinVDistance) ? globalThis.Number(object.handMinVDistance) : 0,
      handMaxVDistance: isSet(object.handMaxVDistance) ? globalThis.Number(object.handMaxVDistance) : 0,
      cropLeft: isSet(object.cropLeft) ? globalThis.Number(object.cropLeft) : 0,
      cropRight: isSet(object.cropRight) ? globalThis.Number(object.cropRight) : 0,
      cropTop: isSet(object.cropTop) ? globalThis.Number(object.cropTop) : 0,
      cropBottom: isSet(object.cropBottom) ? globalThis.Number(object.cropBottom) : 0,
      enabled: isSet(object.enabled) ? globalThis.Number(object.enabled) : 0,
      area: isSet(object.area) ? globalThis.Number(object.area) : 0,
    };
  },

  toJSON(message: Vision_RefereeHandDetectorSettings): unknown {
    const obj: any = {};
    if (message.handMinHDistance !== undefined && message.handMinHDistance !== 0) {
      obj.handMinHDistance = Math.round(message.handMinHDistance);
    }
    if (message.handMaxHDistance !== undefined && message.handMaxHDistance !== 0) {
      obj.handMaxHDistance = Math.round(message.handMaxHDistance);
    }
    if (message.handMinVDistance !== undefined && message.handMinVDistance !== 0) {
      obj.handMinVDistance = Math.round(message.handMinVDistance);
    }
    if (message.handMaxVDistance !== undefined && message.handMaxVDistance !== 0) {
      obj.handMaxVDistance = Math.round(message.handMaxVDistance);
    }
    if (message.cropLeft !== undefined && message.cropLeft !== 0) {
      obj.cropLeft = Math.round(message.cropLeft);
    }
    if (message.cropRight !== undefined && message.cropRight !== 0) {
      obj.cropRight = Math.round(message.cropRight);
    }
    if (message.cropTop !== undefined && message.cropTop !== 0) {
      obj.cropTop = Math.round(message.cropTop);
    }
    if (message.cropBottom !== undefined && message.cropBottom !== 0) {
      obj.cropBottom = Math.round(message.cropBottom);
    }
    if (message.enabled !== undefined && message.enabled !== 0) {
      obj.enabled = Math.round(message.enabled);
    }
    if (message.area !== undefined && message.area !== 0) {
      obj.area = Math.round(message.area);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vision_RefereeHandDetectorSettings>, I>>(
    base?: I,
  ): Vision_RefereeHandDetectorSettings {
    return Vision_RefereeHandDetectorSettings.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vision_RefereeHandDetectorSettings>, I>>(
    object: I,
  ): Vision_RefereeHandDetectorSettings {
    const message = createBaseVision_RefereeHandDetectorSettings();
    message.handMinHDistance = object.handMinHDistance ?? 0;
    message.handMaxHDistance = object.handMaxHDistance ?? 0;
    message.handMinVDistance = object.handMinVDistance ?? 0;
    message.handMaxVDistance = object.handMaxVDistance ?? 0;
    message.cropLeft = object.cropLeft ?? 0;
    message.cropRight = object.cropRight ?? 0;
    message.cropTop = object.cropTop ?? 0;
    message.cropBottom = object.cropBottom ?? 0;
    message.enabled = object.enabled ?? 0;
    message.area = object.area ?? 0;
    return message;
  },
};

function createBaseReceiver(): Receiver {
  return { message: [], data: [], lastReceived: [], incapacitated: [] };
}

export const Receiver = {
  encode(message: Receiver, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.message) {
      Receiver_SPLStandardMessage.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.data) {
      Receiver_BroadcastData.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    writer.uint32(26).fork();
    for (const v of message.lastReceived) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(34).fork();
    for (const v of message.incapacitated) {
      writer.bool(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Receiver {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReceiver();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.message.push(Receiver_SPLStandardMessage.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.data.push(Receiver_BroadcastData.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag === 24) {
            message.lastReceived.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.lastReceived.push(reader.int32());
            }

            continue;
          }

          break;
        case 4:
          if (tag === 32) {
            message.incapacitated.push(reader.bool());

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.incapacitated.push(reader.bool());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Receiver {
    return {
      message: globalThis.Array.isArray(object?.message)
        ? object.message.map((e: any) => Receiver_SPLStandardMessage.fromJSON(e))
        : [],
      data: globalThis.Array.isArray(object?.data)
        ? object.data.map((e: any) => Receiver_BroadcastData.fromJSON(e))
        : [],
      lastReceived: globalThis.Array.isArray(object?.lastReceived)
        ? object.lastReceived.map((e: any) => globalThis.Number(e))
        : [],
      incapacitated: globalThis.Array.isArray(object?.incapacitated)
        ? object.incapacitated.map((e: any) => globalThis.Boolean(e))
        : [],
    };
  },

  toJSON(message: Receiver): unknown {
    const obj: any = {};
    if (message.message?.length) {
      obj.message = message.message.map((e) => Receiver_SPLStandardMessage.toJSON(e));
    }
    if (message.data?.length) {
      obj.data = message.data.map((e) => Receiver_BroadcastData.toJSON(e));
    }
    if (message.lastReceived?.length) {
      obj.lastReceived = message.lastReceived.map((e) => Math.round(e));
    }
    if (message.incapacitated?.length) {
      obj.incapacitated = message.incapacitated;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Receiver>, I>>(base?: I): Receiver {
    return Receiver.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Receiver>, I>>(object: I): Receiver {
    const message = createBaseReceiver();
    message.message = object.message?.map((e) => Receiver_SPLStandardMessage.fromPartial(e)) || [];
    message.data = object.data?.map((e) => Receiver_BroadcastData.fromPartial(e)) || [];
    message.lastReceived = object.lastReceived?.map((e) => e) || [];
    message.incapacitated = object.incapacitated?.map((e) => e) || [];
    return message;
  },
};

function createBaseReceiver_SPLStandardMessage(): Receiver_SPLStandardMessage {
  return {
    header: "",
    version: 0,
    playerNum: 0,
    teamNum: 0,
    fallen: 0,
    pose: [],
    ballAge: 0,
    ball: [],
    numOfDataBytes: 0,
    data: new Uint8Array(0),
  };
}

export const Receiver_SPLStandardMessage = {
  encode(message: Receiver_SPLStandardMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.header !== undefined && message.header !== "") {
      writer.uint32(10).string(message.header);
    }
    if (message.version !== undefined && message.version !== 0) {
      writer.uint32(16).uint32(message.version);
    }
    if (message.playerNum !== undefined && message.playerNum !== 0) {
      writer.uint32(24).uint32(message.playerNum);
    }
    if (message.teamNum !== undefined && message.teamNum !== 0) {
      writer.uint32(32).uint32(message.teamNum);
    }
    if (message.fallen !== undefined && message.fallen !== 0) {
      writer.uint32(40).uint32(message.fallen);
    }
    writer.uint32(50).fork();
    for (const v of message.pose) {
      writer.float(v);
    }
    writer.ldelim();
    if (message.ballAge !== undefined && message.ballAge !== 0) {
      writer.uint32(61).float(message.ballAge);
    }
    writer.uint32(66).fork();
    for (const v of message.ball) {
      writer.float(v);
    }
    writer.ldelim();
    if (message.numOfDataBytes !== undefined && message.numOfDataBytes !== 0) {
      writer.uint32(72).uint32(message.numOfDataBytes);
    }
    if (message.data !== undefined && message.data.length !== 0) {
      writer.uint32(82).bytes(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Receiver_SPLStandardMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReceiver_SPLStandardMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.header = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.version = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.playerNum = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.teamNum = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.fallen = reader.uint32();
          continue;
        case 6:
          if (tag === 53) {
            message.pose.push(reader.float());

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.pose.push(reader.float());
            }

            continue;
          }

          break;
        case 7:
          if (tag !== 61) {
            break;
          }

          message.ballAge = reader.float();
          continue;
        case 8:
          if (tag === 69) {
            message.ball.push(reader.float());

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.ball.push(reader.float());
            }

            continue;
          }

          break;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.numOfDataBytes = reader.uint32();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.data = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Receiver_SPLStandardMessage {
    return {
      header: isSet(object.header) ? globalThis.String(object.header) : "",
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
      playerNum: isSet(object.playerNum) ? globalThis.Number(object.playerNum) : 0,
      teamNum: isSet(object.teamNum) ? globalThis.Number(object.teamNum) : 0,
      fallen: isSet(object.fallen) ? globalThis.Number(object.fallen) : 0,
      pose: globalThis.Array.isArray(object?.pose) ? object.pose.map((e: any) => globalThis.Number(e)) : [],
      ballAge: isSet(object.ballAge) ? globalThis.Number(object.ballAge) : 0,
      ball: globalThis.Array.isArray(object?.ball) ? object.ball.map((e: any) => globalThis.Number(e)) : [],
      numOfDataBytes: isSet(object.numOfDataBytes) ? globalThis.Number(object.numOfDataBytes) : 0,
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0),
    };
  },

  toJSON(message: Receiver_SPLStandardMessage): unknown {
    const obj: any = {};
    if (message.header !== undefined && message.header !== "") {
      obj.header = message.header;
    }
    if (message.version !== undefined && message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    if (message.playerNum !== undefined && message.playerNum !== 0) {
      obj.playerNum = Math.round(message.playerNum);
    }
    if (message.teamNum !== undefined && message.teamNum !== 0) {
      obj.teamNum = Math.round(message.teamNum);
    }
    if (message.fallen !== undefined && message.fallen !== 0) {
      obj.fallen = Math.round(message.fallen);
    }
    if (message.pose?.length) {
      obj.pose = message.pose;
    }
    if (message.ballAge !== undefined && message.ballAge !== 0) {
      obj.ballAge = message.ballAge;
    }
    if (message.ball?.length) {
      obj.ball = message.ball;
    }
    if (message.numOfDataBytes !== undefined && message.numOfDataBytes !== 0) {
      obj.numOfDataBytes = Math.round(message.numOfDataBytes);
    }
    if (message.data !== undefined && message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Receiver_SPLStandardMessage>, I>>(base?: I): Receiver_SPLStandardMessage {
    return Receiver_SPLStandardMessage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Receiver_SPLStandardMessage>, I>>(object: I): Receiver_SPLStandardMessage {
    const message = createBaseReceiver_SPLStandardMessage();
    message.header = object.header ?? "";
    message.version = object.version ?? 0;
    message.playerNum = object.playerNum ?? 0;
    message.teamNum = object.teamNum ?? 0;
    message.fallen = object.fallen ?? 0;
    message.pose = object.pose?.map((e) => e) || [];
    message.ballAge = object.ballAge ?? 0;
    message.ball = object.ball?.map((e) => e) || [];
    message.numOfDataBytes = object.numOfDataBytes ?? 0;
    message.data = object.data ?? new Uint8Array(0);
    return message;
  },
};

function createBaseReceiver_BroadcastData(): Receiver_BroadcastData {
  return {
    playerNum: 0,
    robotPos: [],
    ballPosAbs: undefined,
    ballPosRR: undefined,
    sharedStateEstimationBundle: undefined,
    behaviourSharedData: undefined,
    acB: 0,
    uptime: 0,
    gameState: 0,
  };
}

export const Receiver_BroadcastData = {
  encode(message: Receiver_BroadcastData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.playerNum !== undefined && message.playerNum !== 0) {
      writer.uint32(8).int32(message.playerNum);
    }
    writer.uint32(18).fork();
    for (const v of message.robotPos) {
      writer.float(v);
    }
    writer.ldelim();
    if (message.ballPosAbs !== undefined) {
      AbsCoord.encode(message.ballPosAbs, writer.uint32(26).fork()).ldelim();
    }
    if (message.ballPosRR !== undefined) {
      RRCoord.encode(message.ballPosRR, writer.uint32(34).fork()).ldelim();
    }
    if (message.sharedStateEstimationBundle !== undefined) {
      SharedStateEstimationBundle.encode(message.sharedStateEstimationBundle, writer.uint32(42).fork()).ldelim();
    }
    if (message.behaviourSharedData !== undefined) {
      BehaviourSharedData.encode(message.behaviourSharedData, writer.uint32(50).fork()).ldelim();
    }
    if (message.acB !== undefined && message.acB !== 0) {
      writer.uint32(56).int32(message.acB);
    }
    if (message.uptime !== undefined && message.uptime !== 0) {
      writer.uint32(69).float(message.uptime);
    }
    if (message.gameState !== undefined && message.gameState !== 0) {
      writer.uint32(72).uint32(message.gameState);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Receiver_BroadcastData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReceiver_BroadcastData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.playerNum = reader.int32();
          continue;
        case 2:
          if (tag === 21) {
            message.robotPos.push(reader.float());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.robotPos.push(reader.float());
            }

            continue;
          }

          break;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.ballPosAbs = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.ballPosRR = RRCoord.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.sharedStateEstimationBundle = SharedStateEstimationBundle.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.behaviourSharedData = BehaviourSharedData.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.acB = reader.int32() as any;
          continue;
        case 8:
          if (tag !== 69) {
            break;
          }

          message.uptime = reader.float();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.gameState = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Receiver_BroadcastData {
    return {
      playerNum: isSet(object.playerNum) ? globalThis.Number(object.playerNum) : 0,
      robotPos: globalThis.Array.isArray(object?.robotPos) ? object.robotPos.map((e: any) => globalThis.Number(e)) : [],
      ballPosAbs: isSet(object.ballPosAbs) ? AbsCoord.fromJSON(object.ballPosAbs) : undefined,
      ballPosRR: isSet(object.ballPosRR) ? RRCoord.fromJSON(object.ballPosRR) : undefined,
      sharedStateEstimationBundle: isSet(object.sharedStateEstimationBundle)
        ? SharedStateEstimationBundle.fromJSON(object.sharedStateEstimationBundle)
        : undefined,
      behaviourSharedData: isSet(object.behaviourSharedData)
        ? BehaviourSharedData.fromJSON(object.behaviourSharedData)
        : undefined,
      acB: isSet(object.acB) ? actionTypeFromJSON(object.acB) : 0,
      uptime: isSet(object.uptime) ? globalThis.Number(object.uptime) : 0,
      gameState: isSet(object.gameState) ? globalThis.Number(object.gameState) : 0,
    };
  },

  toJSON(message: Receiver_BroadcastData): unknown {
    const obj: any = {};
    if (message.playerNum !== undefined && message.playerNum !== 0) {
      obj.playerNum = Math.round(message.playerNum);
    }
    if (message.robotPos?.length) {
      obj.robotPos = message.robotPos;
    }
    if (message.ballPosAbs !== undefined) {
      obj.ballPosAbs = AbsCoord.toJSON(message.ballPosAbs);
    }
    if (message.ballPosRR !== undefined) {
      obj.ballPosRR = RRCoord.toJSON(message.ballPosRR);
    }
    if (message.sharedStateEstimationBundle !== undefined) {
      obj.sharedStateEstimationBundle = SharedStateEstimationBundle.toJSON(message.sharedStateEstimationBundle);
    }
    if (message.behaviourSharedData !== undefined) {
      obj.behaviourSharedData = BehaviourSharedData.toJSON(message.behaviourSharedData);
    }
    if (message.acB !== undefined && message.acB !== 0) {
      obj.acB = actionTypeToJSON(message.acB);
    }
    if (message.uptime !== undefined && message.uptime !== 0) {
      obj.uptime = message.uptime;
    }
    if (message.gameState !== undefined && message.gameState !== 0) {
      obj.gameState = Math.round(message.gameState);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Receiver_BroadcastData>, I>>(base?: I): Receiver_BroadcastData {
    return Receiver_BroadcastData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Receiver_BroadcastData>, I>>(object: I): Receiver_BroadcastData {
    const message = createBaseReceiver_BroadcastData();
    message.playerNum = object.playerNum ?? 0;
    message.robotPos = object.robotPos?.map((e) => e) || [];
    message.ballPosAbs = (object.ballPosAbs !== undefined && object.ballPosAbs !== null)
      ? AbsCoord.fromPartial(object.ballPosAbs)
      : undefined;
    message.ballPosRR = (object.ballPosRR !== undefined && object.ballPosRR !== null)
      ? RRCoord.fromPartial(object.ballPosRR)
      : undefined;
    message.sharedStateEstimationBundle =
      (object.sharedStateEstimationBundle !== undefined && object.sharedStateEstimationBundle !== null)
        ? SharedStateEstimationBundle.fromPartial(object.sharedStateEstimationBundle)
        : undefined;
    message.behaviourSharedData = (object.behaviourSharedData !== undefined && object.behaviourSharedData !== null)
      ? BehaviourSharedData.fromPartial(object.behaviourSharedData)
      : undefined;
    message.acB = object.acB ?? 0;
    message.uptime = object.uptime ?? 0;
    message.gameState = object.gameState ?? 0;
    return message;
  },
};

function createBaseStateEstimation(): StateEstimation {
  return {
    robotObstacles: [],
    robotPos: undefined,
    allRobotPos: [],
    ballPosRR: undefined,
    ballPosRRC: undefined,
    ballVelRRC: undefined,
    ballVel: undefined,
    ballPos: undefined,
    teamBallPos: undefined,
    teamBallVel: undefined,
    sharedStateEstimationBundle: undefined,
    havePendingOutgoingSharedBundle: false,
    havePendingIncomingSharedBundle: [],
  };
}

export const StateEstimation = {
  encode(message: StateEstimation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.robotObstacles) {
      StateEstimation_RobotObstacle.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.robotPos !== undefined) {
      AbsCoord.encode(message.robotPos, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.allRobotPos) {
      AbsCoord.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.ballPosRR !== undefined) {
      RRCoord.encode(message.ballPosRR, writer.uint32(34).fork()).ldelim();
    }
    if (message.ballPosRRC !== undefined) {
      AbsCoord.encode(message.ballPosRRC, writer.uint32(42).fork()).ldelim();
    }
    if (message.ballVelRRC !== undefined) {
      AbsCoord.encode(message.ballVelRRC, writer.uint32(50).fork()).ldelim();
    }
    if (message.ballVel !== undefined) {
      AbsCoord.encode(message.ballVel, writer.uint32(58).fork()).ldelim();
    }
    if (message.ballPos !== undefined) {
      AbsCoord.encode(message.ballPos, writer.uint32(66).fork()).ldelim();
    }
    if (message.teamBallPos !== undefined) {
      AbsCoord.encode(message.teamBallPos, writer.uint32(74).fork()).ldelim();
    }
    if (message.teamBallVel !== undefined) {
      AbsCoord.encode(message.teamBallVel, writer.uint32(82).fork()).ldelim();
    }
    if (message.sharedStateEstimationBundle !== undefined) {
      SharedStateEstimationBundle.encode(message.sharedStateEstimationBundle, writer.uint32(90).fork()).ldelim();
    }
    if (message.havePendingOutgoingSharedBundle !== undefined && message.havePendingOutgoingSharedBundle !== false) {
      writer.uint32(96).bool(message.havePendingOutgoingSharedBundle);
    }
    writer.uint32(106).fork();
    for (const v of message.havePendingIncomingSharedBundle) {
      writer.bool(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StateEstimation {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStateEstimation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.robotObstacles.push(StateEstimation_RobotObstacle.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.robotPos = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.allRobotPos.push(AbsCoord.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.ballPosRR = RRCoord.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.ballPosRRC = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.ballVelRRC = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.ballVel = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.ballPos = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.teamBallPos = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.teamBallVel = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.sharedStateEstimationBundle = SharedStateEstimationBundle.decode(reader, reader.uint32());
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.havePendingOutgoingSharedBundle = reader.bool();
          continue;
        case 13:
          if (tag === 104) {
            message.havePendingIncomingSharedBundle.push(reader.bool());

            continue;
          }

          if (tag === 106) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.havePendingIncomingSharedBundle.push(reader.bool());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StateEstimation {
    return {
      robotObstacles: globalThis.Array.isArray(object?.robotObstacles)
        ? object.robotObstacles.map((e: any) => StateEstimation_RobotObstacle.fromJSON(e))
        : [],
      robotPos: isSet(object.robotPos) ? AbsCoord.fromJSON(object.robotPos) : undefined,
      allRobotPos: globalThis.Array.isArray(object?.allRobotPos)
        ? object.allRobotPos.map((e: any) => AbsCoord.fromJSON(e))
        : [],
      ballPosRR: isSet(object.ballPosRR) ? RRCoord.fromJSON(object.ballPosRR) : undefined,
      ballPosRRC: isSet(object.ballPosRRC) ? AbsCoord.fromJSON(object.ballPosRRC) : undefined,
      ballVelRRC: isSet(object.ballVelRRC) ? AbsCoord.fromJSON(object.ballVelRRC) : undefined,
      ballVel: isSet(object.ballVel) ? AbsCoord.fromJSON(object.ballVel) : undefined,
      ballPos: isSet(object.ballPos) ? AbsCoord.fromJSON(object.ballPos) : undefined,
      teamBallPos: isSet(object.teamBallPos) ? AbsCoord.fromJSON(object.teamBallPos) : undefined,
      teamBallVel: isSet(object.teamBallVel) ? AbsCoord.fromJSON(object.teamBallVel) : undefined,
      sharedStateEstimationBundle: isSet(object.sharedStateEstimationBundle)
        ? SharedStateEstimationBundle.fromJSON(object.sharedStateEstimationBundle)
        : undefined,
      havePendingOutgoingSharedBundle: isSet(object.havePendingOutgoingSharedBundle)
        ? globalThis.Boolean(object.havePendingOutgoingSharedBundle)
        : false,
      havePendingIncomingSharedBundle: globalThis.Array.isArray(object?.havePendingIncomingSharedBundle)
        ? object.havePendingIncomingSharedBundle.map((e: any) => globalThis.Boolean(e))
        : [],
    };
  },

  toJSON(message: StateEstimation): unknown {
    const obj: any = {};
    if (message.robotObstacles?.length) {
      obj.robotObstacles = message.robotObstacles.map((e) => StateEstimation_RobotObstacle.toJSON(e));
    }
    if (message.robotPos !== undefined) {
      obj.robotPos = AbsCoord.toJSON(message.robotPos);
    }
    if (message.allRobotPos?.length) {
      obj.allRobotPos = message.allRobotPos.map((e) => AbsCoord.toJSON(e));
    }
    if (message.ballPosRR !== undefined) {
      obj.ballPosRR = RRCoord.toJSON(message.ballPosRR);
    }
    if (message.ballPosRRC !== undefined) {
      obj.ballPosRRC = AbsCoord.toJSON(message.ballPosRRC);
    }
    if (message.ballVelRRC !== undefined) {
      obj.ballVelRRC = AbsCoord.toJSON(message.ballVelRRC);
    }
    if (message.ballVel !== undefined) {
      obj.ballVel = AbsCoord.toJSON(message.ballVel);
    }
    if (message.ballPos !== undefined) {
      obj.ballPos = AbsCoord.toJSON(message.ballPos);
    }
    if (message.teamBallPos !== undefined) {
      obj.teamBallPos = AbsCoord.toJSON(message.teamBallPos);
    }
    if (message.teamBallVel !== undefined) {
      obj.teamBallVel = AbsCoord.toJSON(message.teamBallVel);
    }
    if (message.sharedStateEstimationBundle !== undefined) {
      obj.sharedStateEstimationBundle = SharedStateEstimationBundle.toJSON(message.sharedStateEstimationBundle);
    }
    if (message.havePendingOutgoingSharedBundle !== undefined && message.havePendingOutgoingSharedBundle !== false) {
      obj.havePendingOutgoingSharedBundle = message.havePendingOutgoingSharedBundle;
    }
    if (message.havePendingIncomingSharedBundle?.length) {
      obj.havePendingIncomingSharedBundle = message.havePendingIncomingSharedBundle;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StateEstimation>, I>>(base?: I): StateEstimation {
    return StateEstimation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StateEstimation>, I>>(object: I): StateEstimation {
    const message = createBaseStateEstimation();
    message.robotObstacles = object.robotObstacles?.map((e) => StateEstimation_RobotObstacle.fromPartial(e)) || [];
    message.robotPos = (object.robotPos !== undefined && object.robotPos !== null)
      ? AbsCoord.fromPartial(object.robotPos)
      : undefined;
    message.allRobotPos = object.allRobotPos?.map((e) => AbsCoord.fromPartial(e)) || [];
    message.ballPosRR = (object.ballPosRR !== undefined && object.ballPosRR !== null)
      ? RRCoord.fromPartial(object.ballPosRR)
      : undefined;
    message.ballPosRRC = (object.ballPosRRC !== undefined && object.ballPosRRC !== null)
      ? AbsCoord.fromPartial(object.ballPosRRC)
      : undefined;
    message.ballVelRRC = (object.ballVelRRC !== undefined && object.ballVelRRC !== null)
      ? AbsCoord.fromPartial(object.ballVelRRC)
      : undefined;
    message.ballVel = (object.ballVel !== undefined && object.ballVel !== null)
      ? AbsCoord.fromPartial(object.ballVel)
      : undefined;
    message.ballPos = (object.ballPos !== undefined && object.ballPos !== null)
      ? AbsCoord.fromPartial(object.ballPos)
      : undefined;
    message.teamBallPos = (object.teamBallPos !== undefined && object.teamBallPos !== null)
      ? AbsCoord.fromPartial(object.teamBallPos)
      : undefined;
    message.teamBallVel = (object.teamBallVel !== undefined && object.teamBallVel !== null)
      ? AbsCoord.fromPartial(object.teamBallVel)
      : undefined;
    message.sharedStateEstimationBundle =
      (object.sharedStateEstimationBundle !== undefined && object.sharedStateEstimationBundle !== null)
        ? SharedStateEstimationBundle.fromPartial(object.sharedStateEstimationBundle)
        : undefined;
    message.havePendingOutgoingSharedBundle = object.havePendingOutgoingSharedBundle ?? false;
    message.havePendingIncomingSharedBundle = object.havePendingIncomingSharedBundle?.map((e) => e) || [];
    return message;
  },
};

function createBaseStateEstimation_RobotObstacle(): StateEstimation_RobotObstacle {
  return {
    rr: undefined,
    type: 0,
    rrc: undefined,
    pos: undefined,
    tangentHeadingLeft: 0,
    tangentHeadingRight: 0,
    evadeVectorLeft: undefined,
    evadeVectorRight: undefined,
  };
}

export const StateEstimation_RobotObstacle = {
  encode(message: StateEstimation_RobotObstacle, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rr !== undefined) {
      RRCoord.encode(message.rr, writer.uint32(10).fork()).ldelim();
    }
    if (message.type !== undefined && message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.rrc !== undefined) {
      AbsCoord.encode(message.rrc, writer.uint32(26).fork()).ldelim();
    }
    if (message.pos !== undefined) {
      AbsCoord.encode(message.pos, writer.uint32(34).fork()).ldelim();
    }
    if (message.tangentHeadingLeft !== undefined && message.tangentHeadingLeft !== 0) {
      writer.uint32(41).double(message.tangentHeadingLeft);
    }
    if (message.tangentHeadingRight !== undefined && message.tangentHeadingRight !== 0) {
      writer.uint32(49).double(message.tangentHeadingRight);
    }
    if (message.evadeVectorLeft !== undefined) {
      RRCoord.encode(message.evadeVectorLeft, writer.uint32(58).fork()).ldelim();
    }
    if (message.evadeVectorRight !== undefined) {
      RRCoord.encode(message.evadeVectorRight, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StateEstimation_RobotObstacle {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStateEstimation_RobotObstacle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.rr = RRCoord.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.rrc = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.pos = AbsCoord.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 41) {
            break;
          }

          message.tangentHeadingLeft = reader.double();
          continue;
        case 6:
          if (tag !== 49) {
            break;
          }

          message.tangentHeadingRight = reader.double();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.evadeVectorLeft = RRCoord.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.evadeVectorRight = RRCoord.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StateEstimation_RobotObstacle {
    return {
      rr: isSet(object.rr) ? RRCoord.fromJSON(object.rr) : undefined,
      type: isSet(object.type) ? robotVisionInfoTypeFromJSON(object.type) : 0,
      rrc: isSet(object.rrc) ? AbsCoord.fromJSON(object.rrc) : undefined,
      pos: isSet(object.pos) ? AbsCoord.fromJSON(object.pos) : undefined,
      tangentHeadingLeft: isSet(object.tangentHeadingLeft) ? globalThis.Number(object.tangentHeadingLeft) : 0,
      tangentHeadingRight: isSet(object.tangentHeadingRight) ? globalThis.Number(object.tangentHeadingRight) : 0,
      evadeVectorLeft: isSet(object.evadeVectorLeft) ? RRCoord.fromJSON(object.evadeVectorLeft) : undefined,
      evadeVectorRight: isSet(object.evadeVectorRight) ? RRCoord.fromJSON(object.evadeVectorRight) : undefined,
    };
  },

  toJSON(message: StateEstimation_RobotObstacle): unknown {
    const obj: any = {};
    if (message.rr !== undefined) {
      obj.rr = RRCoord.toJSON(message.rr);
    }
    if (message.type !== undefined && message.type !== 0) {
      obj.type = robotVisionInfoTypeToJSON(message.type);
    }
    if (message.rrc !== undefined) {
      obj.rrc = AbsCoord.toJSON(message.rrc);
    }
    if (message.pos !== undefined) {
      obj.pos = AbsCoord.toJSON(message.pos);
    }
    if (message.tangentHeadingLeft !== undefined && message.tangentHeadingLeft !== 0) {
      obj.tangentHeadingLeft = message.tangentHeadingLeft;
    }
    if (message.tangentHeadingRight !== undefined && message.tangentHeadingRight !== 0) {
      obj.tangentHeadingRight = message.tangentHeadingRight;
    }
    if (message.evadeVectorLeft !== undefined) {
      obj.evadeVectorLeft = RRCoord.toJSON(message.evadeVectorLeft);
    }
    if (message.evadeVectorRight !== undefined) {
      obj.evadeVectorRight = RRCoord.toJSON(message.evadeVectorRight);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StateEstimation_RobotObstacle>, I>>(base?: I): StateEstimation_RobotObstacle {
    return StateEstimation_RobotObstacle.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StateEstimation_RobotObstacle>, I>>(
    object: I,
  ): StateEstimation_RobotObstacle {
    const message = createBaseStateEstimation_RobotObstacle();
    message.rr = (object.rr !== undefined && object.rr !== null) ? RRCoord.fromPartial(object.rr) : undefined;
    message.type = object.type ?? 0;
    message.rrc = (object.rrc !== undefined && object.rrc !== null) ? AbsCoord.fromPartial(object.rrc) : undefined;
    message.pos = (object.pos !== undefined && object.pos !== null) ? AbsCoord.fromPartial(object.pos) : undefined;
    message.tangentHeadingLeft = object.tangentHeadingLeft ?? 0;
    message.tangentHeadingRight = object.tangentHeadingRight ?? 0;
    message.evadeVectorLeft = (object.evadeVectorLeft !== undefined && object.evadeVectorLeft !== null)
      ? RRCoord.fromPartial(object.evadeVectorLeft)
      : undefined;
    message.evadeVectorRight = (object.evadeVectorRight !== undefined && object.evadeVectorRight !== null)
      ? RRCoord.fromPartial(object.evadeVectorRight)
      : undefined;
    return message;
  },
};

function createBaseBehaviourDebugInfo(): BehaviourDebugInfo {
  return {
    bodyBehaviourHierarchy: "",
    headBehaviourHierarchy: "",
    haveBallManoeuvreTarget: false,
    ballManoeuvreTargetX: 0,
    ballManoeuvreTargetY: 0,
    ballManoeuvreHeadingError: 0,
    ballManoeuvreType: "",
    ballManoeuvreHard: false,
    anticipating: false,
    anticipateX: 0,
    anticipateY: 0,
    anticipateH: 0,
  };
}

export const BehaviourDebugInfo = {
  encode(message: BehaviourDebugInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bodyBehaviourHierarchy !== undefined && message.bodyBehaviourHierarchy !== "") {
      writer.uint32(10).string(message.bodyBehaviourHierarchy);
    }
    if (message.headBehaviourHierarchy !== undefined && message.headBehaviourHierarchy !== "") {
      writer.uint32(18).string(message.headBehaviourHierarchy);
    }
    if (message.haveBallManoeuvreTarget !== undefined && message.haveBallManoeuvreTarget !== false) {
      writer.uint32(24).bool(message.haveBallManoeuvreTarget);
    }
    if (message.ballManoeuvreTargetX !== undefined && message.ballManoeuvreTargetX !== 0) {
      writer.uint32(37).float(message.ballManoeuvreTargetX);
    }
    if (message.ballManoeuvreTargetY !== undefined && message.ballManoeuvreTargetY !== 0) {
      writer.uint32(45).float(message.ballManoeuvreTargetY);
    }
    if (message.ballManoeuvreHeadingError !== undefined && message.ballManoeuvreHeadingError !== 0) {
      writer.uint32(53).float(message.ballManoeuvreHeadingError);
    }
    if (message.ballManoeuvreType !== undefined && message.ballManoeuvreType !== "") {
      writer.uint32(58).string(message.ballManoeuvreType);
    }
    if (message.ballManoeuvreHard !== undefined && message.ballManoeuvreHard !== false) {
      writer.uint32(64).bool(message.ballManoeuvreHard);
    }
    if (message.anticipating !== undefined && message.anticipating !== false) {
      writer.uint32(72).bool(message.anticipating);
    }
    if (message.anticipateX !== undefined && message.anticipateX !== 0) {
      writer.uint32(85).float(message.anticipateX);
    }
    if (message.anticipateY !== undefined && message.anticipateY !== 0) {
      writer.uint32(93).float(message.anticipateY);
    }
    if (message.anticipateH !== undefined && message.anticipateH !== 0) {
      writer.uint32(101).float(message.anticipateH);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BehaviourDebugInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBehaviourDebugInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.bodyBehaviourHierarchy = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.headBehaviourHierarchy = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.haveBallManoeuvreTarget = reader.bool();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.ballManoeuvreTargetX = reader.float();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.ballManoeuvreTargetY = reader.float();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }

          message.ballManoeuvreHeadingError = reader.float();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.ballManoeuvreType = reader.string();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.ballManoeuvreHard = reader.bool();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.anticipating = reader.bool();
          continue;
        case 10:
          if (tag !== 85) {
            break;
          }

          message.anticipateX = reader.float();
          continue;
        case 11:
          if (tag !== 93) {
            break;
          }

          message.anticipateY = reader.float();
          continue;
        case 12:
          if (tag !== 101) {
            break;
          }

          message.anticipateH = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BehaviourDebugInfo {
    return {
      bodyBehaviourHierarchy: isSet(object.bodyBehaviourHierarchy)
        ? globalThis.String(object.bodyBehaviourHierarchy)
        : "",
      headBehaviourHierarchy: isSet(object.headBehaviourHierarchy)
        ? globalThis.String(object.headBehaviourHierarchy)
        : "",
      haveBallManoeuvreTarget: isSet(object.haveBallManoeuvreTarget)
        ? globalThis.Boolean(object.haveBallManoeuvreTarget)
        : false,
      ballManoeuvreTargetX: isSet(object.ballManoeuvreTargetX) ? globalThis.Number(object.ballManoeuvreTargetX) : 0,
      ballManoeuvreTargetY: isSet(object.ballManoeuvreTargetY) ? globalThis.Number(object.ballManoeuvreTargetY) : 0,
      ballManoeuvreHeadingError: isSet(object.ballManoeuvreHeadingError)
        ? globalThis.Number(object.ballManoeuvreHeadingError)
        : 0,
      ballManoeuvreType: isSet(object.ballManoeuvreType) ? globalThis.String(object.ballManoeuvreType) : "",
      ballManoeuvreHard: isSet(object.ballManoeuvreHard) ? globalThis.Boolean(object.ballManoeuvreHard) : false,
      anticipating: isSet(object.anticipating) ? globalThis.Boolean(object.anticipating) : false,
      anticipateX: isSet(object.anticipateX) ? globalThis.Number(object.anticipateX) : 0,
      anticipateY: isSet(object.anticipateY) ? globalThis.Number(object.anticipateY) : 0,
      anticipateH: isSet(object.anticipateH) ? globalThis.Number(object.anticipateH) : 0,
    };
  },

  toJSON(message: BehaviourDebugInfo): unknown {
    const obj: any = {};
    if (message.bodyBehaviourHierarchy !== undefined && message.bodyBehaviourHierarchy !== "") {
      obj.bodyBehaviourHierarchy = message.bodyBehaviourHierarchy;
    }
    if (message.headBehaviourHierarchy !== undefined && message.headBehaviourHierarchy !== "") {
      obj.headBehaviourHierarchy = message.headBehaviourHierarchy;
    }
    if (message.haveBallManoeuvreTarget !== undefined && message.haveBallManoeuvreTarget !== false) {
      obj.haveBallManoeuvreTarget = message.haveBallManoeuvreTarget;
    }
    if (message.ballManoeuvreTargetX !== undefined && message.ballManoeuvreTargetX !== 0) {
      obj.ballManoeuvreTargetX = message.ballManoeuvreTargetX;
    }
    if (message.ballManoeuvreTargetY !== undefined && message.ballManoeuvreTargetY !== 0) {
      obj.ballManoeuvreTargetY = message.ballManoeuvreTargetY;
    }
    if (message.ballManoeuvreHeadingError !== undefined && message.ballManoeuvreHeadingError !== 0) {
      obj.ballManoeuvreHeadingError = message.ballManoeuvreHeadingError;
    }
    if (message.ballManoeuvreType !== undefined && message.ballManoeuvreType !== "") {
      obj.ballManoeuvreType = message.ballManoeuvreType;
    }
    if (message.ballManoeuvreHard !== undefined && message.ballManoeuvreHard !== false) {
      obj.ballManoeuvreHard = message.ballManoeuvreHard;
    }
    if (message.anticipating !== undefined && message.anticipating !== false) {
      obj.anticipating = message.anticipating;
    }
    if (message.anticipateX !== undefined && message.anticipateX !== 0) {
      obj.anticipateX = message.anticipateX;
    }
    if (message.anticipateY !== undefined && message.anticipateY !== 0) {
      obj.anticipateY = message.anticipateY;
    }
    if (message.anticipateH !== undefined && message.anticipateH !== 0) {
      obj.anticipateH = message.anticipateH;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BehaviourDebugInfo>, I>>(base?: I): BehaviourDebugInfo {
    return BehaviourDebugInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BehaviourDebugInfo>, I>>(object: I): BehaviourDebugInfo {
    const message = createBaseBehaviourDebugInfo();
    message.bodyBehaviourHierarchy = object.bodyBehaviourHierarchy ?? "";
    message.headBehaviourHierarchy = object.headBehaviourHierarchy ?? "";
    message.haveBallManoeuvreTarget = object.haveBallManoeuvreTarget ?? false;
    message.ballManoeuvreTargetX = object.ballManoeuvreTargetX ?? 0;
    message.ballManoeuvreTargetY = object.ballManoeuvreTargetY ?? 0;
    message.ballManoeuvreHeadingError = object.ballManoeuvreHeadingError ?? 0;
    message.ballManoeuvreType = object.ballManoeuvreType ?? "";
    message.ballManoeuvreHard = object.ballManoeuvreHard ?? false;
    message.anticipating = object.anticipating ?? false;
    message.anticipateX = object.anticipateX ?? 0;
    message.anticipateY = object.anticipateY ?? 0;
    message.anticipateH = object.anticipateH ?? 0;
    return message;
  },
};

function createBaseBlackboard(): Blackboard {
  return {
    mask: 0,
    gameController: undefined,
    motion: undefined,
    behaviour: undefined,
    perception: undefined,
    kinematics: undefined,
    vision: undefined,
    receiver: undefined,
    stateEstimation: undefined,
  };
}

export const Blackboard = {
  encode(message: Blackboard, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mask !== undefined && message.mask !== 0) {
      writer.uint32(8).uint64(message.mask);
    }
    if (message.gameController !== undefined) {
      GameController.encode(message.gameController, writer.uint32(18).fork()).ldelim();
    }
    if (message.motion !== undefined) {
      Motion.encode(message.motion, writer.uint32(26).fork()).ldelim();
    }
    if (message.behaviour !== undefined) {
      Behaviour.encode(message.behaviour, writer.uint32(34).fork()).ldelim();
    }
    if (message.perception !== undefined) {
      Perception.encode(message.perception, writer.uint32(42).fork()).ldelim();
    }
    if (message.kinematics !== undefined) {
      Kinematics.encode(message.kinematics, writer.uint32(50).fork()).ldelim();
    }
    if (message.vision !== undefined) {
      Vision.encode(message.vision, writer.uint32(58).fork()).ldelim();
    }
    if (message.receiver !== undefined) {
      Receiver.encode(message.receiver, writer.uint32(66).fork()).ldelim();
    }
    if (message.stateEstimation !== undefined) {
      StateEstimation.encode(message.stateEstimation, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Blackboard {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBlackboard();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.mask = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.gameController = GameController.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.motion = Motion.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.behaviour = Behaviour.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.perception = Perception.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.kinematics = Kinematics.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.vision = Vision.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.receiver = Receiver.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.stateEstimation = StateEstimation.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Blackboard {
    return {
      mask: isSet(object.mask) ? globalThis.Number(object.mask) : 0,
      gameController: isSet(object.gameController) ? GameController.fromJSON(object.gameController) : undefined,
      motion: isSet(object.motion) ? Motion.fromJSON(object.motion) : undefined,
      behaviour: isSet(object.behaviour) ? Behaviour.fromJSON(object.behaviour) : undefined,
      perception: isSet(object.perception) ? Perception.fromJSON(object.perception) : undefined,
      kinematics: isSet(object.kinematics) ? Kinematics.fromJSON(object.kinematics) : undefined,
      vision: isSet(object.vision) ? Vision.fromJSON(object.vision) : undefined,
      receiver: isSet(object.receiver) ? Receiver.fromJSON(object.receiver) : undefined,
      stateEstimation: isSet(object.stateEstimation) ? StateEstimation.fromJSON(object.stateEstimation) : undefined,
    };
  },

  toJSON(message: Blackboard): unknown {
    const obj: any = {};
    if (message.mask !== undefined && message.mask !== 0) {
      obj.mask = Math.round(message.mask);
    }
    if (message.gameController !== undefined) {
      obj.gameController = GameController.toJSON(message.gameController);
    }
    if (message.motion !== undefined) {
      obj.motion = Motion.toJSON(message.motion);
    }
    if (message.behaviour !== undefined) {
      obj.behaviour = Behaviour.toJSON(message.behaviour);
    }
    if (message.perception !== undefined) {
      obj.perception = Perception.toJSON(message.perception);
    }
    if (message.kinematics !== undefined) {
      obj.kinematics = Kinematics.toJSON(message.kinematics);
    }
    if (message.vision !== undefined) {
      obj.vision = Vision.toJSON(message.vision);
    }
    if (message.receiver !== undefined) {
      obj.receiver = Receiver.toJSON(message.receiver);
    }
    if (message.stateEstimation !== undefined) {
      obj.stateEstimation = StateEstimation.toJSON(message.stateEstimation);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Blackboard>, I>>(base?: I): Blackboard {
    return Blackboard.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Blackboard>, I>>(object: I): Blackboard {
    const message = createBaseBlackboard();
    message.mask = object.mask ?? 0;
    message.gameController = (object.gameController !== undefined && object.gameController !== null)
      ? GameController.fromPartial(object.gameController)
      : undefined;
    message.motion = (object.motion !== undefined && object.motion !== null)
      ? Motion.fromPartial(object.motion)
      : undefined;
    message.behaviour = (object.behaviour !== undefined && object.behaviour !== null)
      ? Behaviour.fromPartial(object.behaviour)
      : undefined;
    message.perception = (object.perception !== undefined && object.perception !== null)
      ? Perception.fromPartial(object.perception)
      : undefined;
    message.kinematics = (object.kinematics !== undefined && object.kinematics !== null)
      ? Kinematics.fromPartial(object.kinematics)
      : undefined;
    message.vision = (object.vision !== undefined && object.vision !== null)
      ? Vision.fromPartial(object.vision)
      : undefined;
    message.receiver = (object.receiver !== undefined && object.receiver !== null)
      ? Receiver.fromPartial(object.receiver)
      : undefined;
    message.stateEstimation = (object.stateEstimation !== undefined && object.stateEstimation !== null)
      ? StateEstimation.fromPartial(object.stateEstimation)
      : undefined;
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
