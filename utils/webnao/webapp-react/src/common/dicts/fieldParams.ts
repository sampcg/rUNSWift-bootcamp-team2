const FIELD_LINE_WIDTH = 50;
const ROBOTS_PER_TEAM = 7;

/** Field line dimensions */
// TODO we could support reading field-dimensions.json in the future
const FIELD_LENGTH = 9010;
const FIELD_WIDTH = 6020;

const FIELD_LENGTH_OFFSET = 700;
const FIELD_WIDTH_OFFSET = 700;

const OFFNAO_FIELD_LENGTH_OFFSET = 730;
const OFFNAO_FIELD_WIDTH_OFFSET = 730;

/** Goal box */
const GOAL_BOX_LENGTH = 615;
const GOAL_BOX_WIDTH = 2220;

/** Penalty Cross */
const PENALTY_CROSS_DIMENSIONS = 100 /* i.e. dimensions of square fitted around it */;
const DIST_GOAL_LINE_TO_PENALTY_CROSS = 1290 /* to middle of closest penalty cross */;
const PENALTY_CROSS_ABS_X = (FIELD_LENGTH / 2 - DIST_GOAL_LINE_TO_PENALTY_CROSS);

/** Center Circle */
const CENTER_CIRCLE_DIAMETER = 1500;

/** Goal Posts */
const GOAL_POST_DIAMETER = 90;
const GOAL_BAR_DIAMETER = 100  // Double check this once field is built;
const GOAL_POST_HEIGHT = 800 // Measured from the bottom of the crossbar to the ground;

const GOAL_SUPPORT_DIAMETER = 46;
const GOAL_WIDTH = 1565 /* top view end-to-end from middle of goal posts */;
const GOAL_DEPTH = 450 /* Measured from the front edge of the crossbar to the centre of the rear bar */;

const PENALTY_AREA_LENGTH = 1650 // Measured from inside of goal line to outside of penalty box;
const PENALTY_AREA_WIDTH = 4000  // Measured from the outside of one side of the penalty box line to the inside of the line on the other side;
const FULL_FIELD_LENGTH = (FIELD_LENGTH + (FIELD_LENGTH_OFFSET * 2));
const OFFNAO_FULL_FIELD_LENGTH = (FIELD_LENGTH + (OFFNAO_FIELD_LENGTH_OFFSET * 2));
const FULL_FIELD_WIDTH = (FIELD_WIDTH + (FIELD_WIDTH_OFFSET * 2));
const OFFNAO_FULL_FIELD_WIDTH = (FIELD_WIDTH + (OFFNAO_FIELD_WIDTH_OFFSET * 2));

/** Ball Dimensions */
const BALL_RADIUS = 50;

/** Post positions in AbsCoord */
const GOAL_POST_ABS_X = (FIELD_LENGTH / 2.0) - (FIELD_LINE_WIDTH / 2.0) + (GOAL_POST_DIAMETER / 2.0)  // the front of the goal post lines up with the line (as shown in spl rule book);
const GOAL_POST_ABS_Y = (GOAL_WIDTH / 2);

/** Goal Free Kick Positions in AbsCoord */
const GOAL_KICK_ABS_X = PENALTY_CROSS_ABS_X;
const GOAL_KICK_ABS_Y = (GOAL_BOX_WIDTH / 2);

/** Corner Kick Positions in AbsCoord */
const CORNER_KICK_ABS_X = (FIELD_LENGTH / 2);
const CORNER_KICK_ABS_Y = (FIELD_WIDTH / 2);

export const SPLFieldDescription = {
    FIELD_LINE_WIDTH, 
    ROBOTS_PER_TEAM, 
    FIELD_LENGTH, 
    FIELD_WIDTH, 
    FIELD_LENGTH_OFFSET, 
    FIELD_WIDTH_OFFSET, 
    OFFNAO_FIELD_LENGTH_OFFSET, 
    OFFNAO_FIELD_WIDTH_OFFSET, 
    GOAL_BOX_LENGTH, 
    GOAL_BOX_WIDTH, 
    PENALTY_CROSS_DIMENSIONS, 
    CENTER_CIRCLE_DIAMETER, 
    GOAL_POST_DIAMETER, 
    GOAL_BAR_DIAMETER, 
    GOAL_POST_HEIGHT, 
    GOAL_SUPPORT_DIAMETER, 
    GOAL_WIDTH, 
    PENALTY_AREA_LENGTH, 
    PENALTY_AREA_WIDTH, 
    FULL_FIELD_LENGTH, 
    OFFNAO_FULL_FIELD_LENGTH, 
    FULL_FIELD_WIDTH, 
    OFFNAO_FULL_FIELD_WIDTH, 
    BALL_RADIUS, 
    GOAL_POST_ABS_X, 
    GOAL_POST_ABS_Y, 
    GOAL_KICK_ABS_X, 
    GOAL_KICK_ABS_Y, 
    CORNER_KICK_ABS_X, 
    CORNER_KICK_ABS_Y, 
}