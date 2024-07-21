# flake8: noqa
import math
from util.Vector2D import Vector2D
from util import MathUtil
import Constants
import Log


class Landmark:
    def __init__(self, name, weight, position, maxDistance):
        self.name = name
        self.weight = weight  # how good this landmark is for positioning.
        self.position = position  # world coords position
        self.maxDistance = maxDistance


class GetLandmarks(object):
    def __init__(self):
        self.initialiseLandmarks()

    def getLandmarkPan(self, blackboard, mark):
        myPose = blackboard.stateEstimation.robotPos
        myPos = Vector2D(myPose.x, myPose.y)
        for feature in self.landmarks:
            if mark == feature.name:
                toLandmark = feature.position.minus(myPos)
                toLandmark.normalise()
                yawToLandmark = math.atan2(toLandmark.y, toLandmark.x)
                targetPan = MathUtil.normalisedTheta(yawToLandmark - myPose.theta)
                return targetPan
        Log.error("Can't get a target pan-- wrong name!")
        return None

    def initialiseLandmarks(self):
        self.landmarks = []
        self.landmarks.append(
            Landmark("MY_LEFT_POST", 1.0, Vector2D(-Constants.GOAL_POST_ABS_X, -Constants.GOAL_POST_ABS_Y), 5000.0)
        )
        self.landmarks.append(
            Landmark("MY_RIGHT_POST", 1.0, Vector2D(-Constants.GOAL_POST_ABS_X, Constants.GOAL_POST_ABS_Y), 5000.0)
        )
        self.landmarks.append(
            Landmark("OPPONENT_LEFT_POST", 1.0, Vector2D(Constants.GOAL_POST_ABS_X, Constants.GOAL_POST_ABS_Y), 5000.0)
        )
        self.landmarks.append(
            Landmark(
                "OPPONENT_RIGHT_POST", 1.0, Vector2D(Constants.GOAL_POST_ABS_X, -Constants.GOAL_POST_ABS_Y), 5000.0
            )
        )

        self.landmarks.append(Landmark("CENTRE_CIRCLE", 1.0, Vector2D(0.0, 0.0), 3000.0))
        self.landmarks.append(Landmark("T_LEFT", 0.3, Vector2D(0.0, Constants.FIELD_WIDTH / 2.0), 2000.0))
        self.landmarks.append(Landmark("T_RIGHT", 0.3, Vector2D(0.0, -Constants.FIELD_WIDTH / 2.0), 2000.0))

        self.landmarks.append(
            Landmark(
                "MY_LEFT_CORNER", 0.3, Vector2D(-Constants.FIELD_LENGTH / 2.0, Constants.FIELD_WIDTH / 2.0), 2000.0
            )
        )
        self.landmarks.append(
            Landmark(
                "MY_RIGHT_CORNER", 0.3, Vector2D(-Constants.FIELD_LENGTH / 2.0, -Constants.FIELD_WIDTH / 2.0), 2000.0
            )
        )
        self.landmarks.append(
            Landmark(
                "OPPONENT_LEFT_CORNER",
                0.3,
                Vector2D(Constants.FIELD_LENGTH / 2.0, -Constants.FIELD_WIDTH / 2.0),
                2000.0,
            )
        )
        self.landmarks.append(
            Landmark(
                "OPPONENT_RIGHT_CORNER",
                0.3,
                Vector2D(Constants.FIELD_LENGTH / 2.0, Constants.FIELD_WIDTH / 2.0),
                2000.0,
            )
        )

        self.landmarks.append(
            Landmark(
                "MY_LEFT_GOAL_CORNER",
                0.5,
                Vector2D(-Constants.FIELD_LENGTH / 2.0 + Constants.GOAL_BOX_LENGTH, Constants.GOAL_BOX_WIDTH / 2.0),
                1000.0,
            )
        )

        self.landmarks.append(
            Landmark(
                "MY_RIGHT_GOAL_CORNER",
                0.5,
                Vector2D(-Constants.FIELD_LENGTH / 2.0 + Constants.GOAL_BOX_LENGTH, -Constants.GOAL_BOX_WIDTH / 2.0),
                1000.0,
            )
        )

        self.landmarks.append(
            Landmark(
                "OPPONENT_LEFT_GOAL_CORNER",
                0.5,
                Vector2D(Constants.FIELD_LENGTH / 2.0 - Constants.GOAL_BOX_LENGTH, -Constants.GOAL_BOX_WIDTH / 2.0),
                1000.0,
            )
        )

        self.landmarks.append(
            Landmark(
                "OPPONENT_RIGHT_GOAL_CORNER",
                0.5,
                Vector2D(Constants.FIELD_LENGTH / 2.0 - Constants.GOAL_BOX_LENGTH, Constants.GOAL_BOX_WIDTH / 2.0),
                1000.0,
            )
        )

        self.landmarks.append(
            Landmark("MY_PENALTY_SPOT", 0.75, Vector2D(-Constants.FIELD_LENGTH / 2.0 + 1300.0, 0.0), 1800.0)
        )

        self.landmarks.append(
            Landmark("OPPONENT_PENALTY_SPOT", 0.75, Vector2D(Constants.FIELD_LENGTH / 2.0 - 1300.0, 0.0), 1800.0)
        )

        self.landmarks.append(Landmark("GOAL_KICK_NEGATIVE_SPOT", 0.75, Vector2D(3200.0, -1100.0), 1800.0))

        self.landmarks.append(Landmark("GOAL_KICK_POSITIVE_SPOT", 0.75, Vector2D(3200.0, 1100.0), 1800.0))

        self.landmarks.append(
            Landmark(
                "MY_LEFT_GOAL_KICK_SPOT",
                1.0,
                Vector2D(
                    -(Constants.FIELD_WIDTH / 2.0 - Constants.PENALTY_CROSS_DISTANCE),
                    -Constants.PENALTY_AREA_WIDTH / 2.0,
                ),
                2000.0,
            )
        )

        self.landmarks.append(
            Landmark(
                "MY_RIGHT_GOAL_KICK_SPOT",
                1.0,
                Vector2D(
                    -(Constants.FIELD_WIDTH / 2.0 - Constants.PENALTY_CROSS_DISTANCE),
                    Constants.PENALTY_AREA_WIDTH / 2.0,
                ),
                2000.0,
            )
        )
