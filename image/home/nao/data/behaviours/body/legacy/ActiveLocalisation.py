# flake8: noqa
import actioncommand
import robot
import random
import Sensors
import math
from util.Vector2D import Vector2D
from util import MathUtil
import HeadSkill
import Constants
import Global
import Log


class Landmark:
    def __init__(self, name, weight, position, maxDistance):
        self.name = name
        self.weight = weight  # how good this landmark is for positioning.
        self.position = position  # world coords position
        self.maxDistance = maxDistance


# TODO: dont initialise the landmarks and consts in the contructor, do it as globals.


class ActiveLocalisation(object):
    def __init__(self):
        self.returnYaw = Global.ballHeading()

        self.initialiseLandmarks()
        self.targetLandmark = None
        self.finished = False
        self.panningToLandmark = True
        self.lostBall = True
        self.framesLookingAtLandmark = 0

        self.MAX_ABS_HEADING_DEFLECTION = 80.0
        self.MAX_BALL_HEADING_DEFLECTION = 80.0

        self.HEAD_SPEED = 0.45

        # Once we are within this many degrees of the landmark, we can consider ourselves to be
        # looking at it.
        self.LANDMARK_HEADING_YAW_THRESHOLD = 5.0

        # How many frames to spend looking at the landmark once the heading is within the threshold.
        self.NUM_FRAMES_LANDMARK_GAZE = 5

    def tick(self, blackboard):
        self.lostBall = Global.ballLostFrames() > 10

        request = robot.BehaviourRequest()
        request.actions = robot.All()

        if self.targetLandmark == None:
            # We should never get here.
            Log.error("Error, ActiveLocalise tick() called with no targetLandmark set")
            self.finished = True
            return request

        curPan = Sensors.angles(blackboard)[0]

        # First pan to the landmark heading, once there we count down some number of frames and then start panning back.
        if self.panningToLandmark:
            targetPan = self.targetLandmark[1]
            request.actions.head = actioncommand.head(targetPan, 0.0, False, self.HEAD_SPEED, self.HEAD_SPEED)
            if math.fabs(curPan - targetPan) < math.radians(self.LANDMARK_HEADING_YAW_THRESHOLD):
                self.framesLookingAtLandmark += 1
                if self.framesLookingAtLandmark > self.NUM_FRAMES_LANDMARK_GAZE:
                    self.panningToLandmark = False
        else:
            # Pan back to look in the direction we were looking at before we start to ActiveLocalise.
            # TODO: return the head to point at the global ball, rather than simply back to the previous pan
            targetPan = self.returnYaw
            if math.fabs(curPan - targetPan) < math.radians(self.LANDMARK_HEADING_YAW_THRESHOLD) or Global.canSeeBall():
                self.finished = True

            request.actions.head = actioncommand.head(targetPan, 0.0, False, self.HEAD_SPEED, self.HEAD_SPEED)

        return request

    def isFinished(self):
        return self.finished

    def canActiveLocalise(self):
        return self.targetLandmark != None

    def chooseLandmark(self, blackboard):
        myPose = blackboard.stateEstimation.robotPos
        myHeadingVec = Vector2D(math.cos(myPose.theta), math.sin(myPose.theta))
        toBallVec = Vector2D(math.cos(self.returnYaw + myPose.theta), math.sin(self.returnYaw + myPose.theta))
        myPos = Vector2D(myPose.x, myPose.y)

        reachableLandmarks = []
        for landmark in self.landmarks:
            toLandmark = landmark.position.minus(myPos)
            toLandmark.normalise()

            thetaToLandmark = myHeadingVec.absThetaTo(toLandmark)
            thetaToBall = toLandmark.absThetaTo(toBallVec)

            if (
                thetaToLandmark <= math.radians(self.MAX_ABS_HEADING_DEFLECTION)
                and thetaToBall <= math.radians(self.MAX_BALL_HEADING_DEFLECTION)
                and toLandmark.isShorterThan(landmark.maxDistance)
            ):
                reachableLandmarks.append((landmark, toLandmark))

        if len(reachableLandmarks) == 0:
            self.targetLandmark = None
        else:
            targetLandmark = self.chooseWeightedLandmark(reachableLandmarks)
            yawToLandmark = math.atan2(targetLandmark[1].y, targetLandmark[1].x)
            self.targetLandmark = (targetLandmark, MathUtil.normalisedTheta(yawToLandmark - myPose.theta))

        # We want to oveshoot the heading we return to when coming back from looking at the landmark to
        # give us a better chance of seeing the ball.
        if self.targetLandmark:
            if self.targetLandmark[1] < self.returnYaw:
                self.returnYaw += math.radians(20.0)
            else:
                self.returnYaw -= math.radians(20.0)

    def chooseWeightedLandmark(self, reachableLandmarks):
        weightSum = 0.0
        for landmark in reachableLandmarks:
            weightSum += landmark[0].weight

        # generate a random number between 0 and weightSum
        samplePoint = random.random() * weightSum

        # Now see which landmark this sample point corresponds to
        for landmark in reachableLandmarks:
            if samplePoint <= landmark[0].weight:
                return landmark
            else:
                samplePoint -= landmark[0].weight

        # We should never get here.
        Log.error("ActiveLocalisation: something went wrong in chooseWeightedLandmark()")
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
