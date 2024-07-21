# flake8: noqa
import Global
import Log
import actioncommand
import math
import robot
import skills.HeadSkill

from Task import BehaviourTask, TaskState
from roles.Striker import Striker
from skills.WalkToPointV2 import WalkToPointV2
from util import FieldGeometry, TeamStatus
from util.Hysteresis import Hysteresis
from util.TemporalHysteresis import TemporalHysteresis
from util.Timer import Timer
from util.Vector2D import Vector2D

# all states involved in Goalie beahaviour
STATE_RETURNORIGIN = 1  # return goal box center to standby
STATE_ANTICIPATE = 2  # stand by state to cover goal box when ball is far from our goal box
STATE_CLEARBALL = 3  # In this state goalie will become striker to clear the ball near goal box
STATE_DIVE = 4  # decide which direction to dive regarding to speed, angle, distance between ball and goalie position
STATE_LOSTSCAN = 5  # this state is to handle a special situation where the ball is in blind spot of goalie's vision
STATE_COVERGOAL = 6  # rough cover position state when ball is far from goal post
STATE_DYNAMICCOVER = 7  # precise cover position state when ball is close to goal post
STATE_SPIN = 8  # to have Goalie spin for a short while to recover from mis-localisation state

# Hysitersis parameter for states transistion
VOTE_HISTORY_LENGTH = 20  # the origin weight when new state updated
STATE_SWITCH_VOTES_HYSTERESIS = 20  # start to switch a different state when it's reach this threshold

DYNAMICCOVERTHRES = 280
COVERTHRES = 180

CENTER_DIVE_THRES = 150  # absolute value of width between ball and goalie

clamp = lambda n, minn, maxn: max(min(maxn, n), minn)


class Goalie2014(BehaviourTask):
    (ORI_X, ORI_Y, ORI_THETA, POST_Y, BOX_X, BOX_Y, T) = (
        -robot.GOAL_POST_ABS_X,
        0,
        0,
        robot.GOAL_POST_ABS_Y,
        -(robot.FIELD_LENGTH / 2 - robot.GOAL_BOX_LENGTH),
        robot.GOAL_BOX_WIDTH / 2,
        2,
    )

    def init(self):
        self.currentState = STATE_RETURNORIGIN  # STATE_RETURNORIGIN is initial state
        self.TempHysteresis = TemporalHysteresis(
            self.currentState, VOTE_HISTORY_LENGTH, STATE_SWITCH_VOTES_HYSTERESIS
        )  # states transit hystersis
        self.currentSkill = self.getSkillState(self.currentState)
        self.isStriker = False  # a flag to state if Goalie has turn to be striker
        self.kickComplete = False  # a flag to indicate if  kick action already complete
        self.isDive = False  # if goalie is performing dive action
        self.isLost = False  # if goalie is mis-localised
        self.isBend = False  # if goalie is performing pick-up action
        self.see_ball_hystersis = Hysteresis(-30, 3)  # see ball hystersis to filter out noises in vision
        self.spin_timer = Timer(5000000 * 1.5)  # spin state timer

    def tick(self):
        newState = self.getNewState()  # to get the new state according to current situation

        # do not apply state hystersis to dive action because dive need to fast response
        if newState == STATE_DIVE:
            for i in range(0, 20):
                self.TempHysteresis.update(newState)
        """
         Update TempHysteresis with newState to produce next state behaviour
         The general idea of TempHystersis is that buffer the newState and only
         switch to new state when the weight of newState reach STATE_SWITCH_VOTES_HYSTERESIS
         threshold
        """
        self.nextState = self.TempHysteresis.update(newState)

        if self.currentState != self.nextState:
            # Log.info("%20s: %20s -> %s", self.__class__.__name__,
            #                             self.getSkillState(self.currentState).__class__.__name__,
            #                             self.getSkillState(self.nextState).__class__.__name__)
            self.currentState = self.nextState
            self.currentSkill = self.getSkillState(self.currentState)  # return instance of new state
            self.see_ball_hystersis.reset()  # reset see ball hystersis counter

        self.currentSkill.tick()  # execute current skill's action
        skills.HeadSkill.instance.setForwardOnly(True)

    def getSkillState(self, state):
        if state == STATE_RETURNORIGIN:
            return ReturnOrigin(self)
        elif state == STATE_ANTICIPATE:
            return Anticipate(self)
        elif state == STATE_CLEARBALL:
            return ClearBall(self)
        elif state == STATE_DIVE:
            return Dive(self)
        elif state == STATE_COVERGOAL:
            return CoverGoal(self)
        elif state == STATE_DYNAMICCOVER:
            return DynamicCover(self)
        elif state == STATE_SPIN:
            return Spin(self)
        else:
            return LostScan(self)

    #  getNewState function is a decision tree to generate a new state according to circumstance of current state

    def getNewState(self):
        if self.currentState == STATE_RETURNORIGIN:
            if shouldClear() and Global.ballWorldPos().x >= Goalie2014.ORI_X:
                return STATE_CLEARBALL
            elif shouldDynamic():
                return STATE_DYNAMICCOVER
            elif isCloseToOrigin():  # switch to standby state when colse to original point
                return STATE_ANTICIPATE
            else:
                return STATE_RETURNORIGIN

        elif self.currentState == STATE_ANTICIPATE:
            # update see ball hystersis at each anticipate state to filter out vision noise
            self.see_ball_hystersis.adjust(Global.canSeeBall())
            if shouldDive(self.isDive):
                return STATE_DIVE
            elif shouldClear() and Global.ballWorldPos().x >= Goalie2014.ORI_X:
                return STATE_CLEARBALL
            elif shouldDynamic():
                coverpos = getDynamicCoverPos()
                # update the dynamic cover position if the distance between new postion
                # and current is larger than DYNAMICCOVERTHRES move to new postion otherwise
                # stay on current position
                dist2 = math.hypot(coverpos.x - Global.myPose().x, coverpos.y - Global.myPose().y)
                if dist2 >= DYNAMICCOVERTHRES:
                    return STATE_DYNAMICCOVER
                else:
                    return STATE_ANTICIPATE

            elif not ballinEnemyScoreRange() and Global.ballWorldPos().x <= -2000 and Global.ballLostFrames() < 30:
                coverpos = getGoalCoverPos()
                # similar to dynamic cover, update new coverpos and only reponse if distance between two
                # position is greater than threshold
                dist = math.hypot(Global.myPose().x - coverpos.x, Global.myPose().y - coverpos.y)
                if dist >= COVERTHRES:
                    return STATE_COVERGOAL
                else:
                    return STATE_ANTICIPATE

            elif self.isLost and self.see_ball_hystersis.is_min() and not TeamStatus.lonelyPlayer():
                return STATE_SPIN  # spin to recover from mis-localise

            elif (isBallOnOtherSide() and not isCloseToOrigin()) or Global.myPose().x > -3000.0:
                return STATE_RETURNORIGIN  # ball is far from goal post return origin for stand by

            elif Global.ballLostFrames() > 200:
                # goalie did not see a ball for a long time
                if FieldGeometry.isInGoalBox(Global.ballWorldPos()):
                    return STATE_LOSTSCAN  # team ball is in goal box so ball is probably in goalie's blind spot therefore perform lostscan
                elif not isCloseToOrigin():
                    return STATE_RETURNORIGIN  # otherwise return origin
                else:
                    return STATE_ANTICIPATE
            else:
                return STATE_ANTICIPATE

        elif self.currentState == STATE_COVERGOAL:
            if shouldDive(self.isDive):
                return STATE_DIVE
            coverHeading = math.atan2(
                Global.ballWorldPos().y - Goalie2014.ORI_Y, Global.ballWorldPos().x - Goalie2014.ORI_X
            )
            robotHeading = Global.myHeading()
            coverpos = getGoalCoverPos()
            xdiff = abs(Global.myPose().x - coverpos.x)
            dist = math.hypot(Global.myPose().x - coverpos.x, Global.myPose().y - coverpos.y)

            # stop to standby when distance between goalie and ball less than 200 cm and goalie is
            # facing to opponent side
            if dist <= 200 and xdiff <= 100 and abs(Global.ballHeading()) <= math.radians(10):
                return STATE_ANTICIPATE
            elif shouldDynamic():
                coverpos = getDynamicCoverPos()
                dist2 = math.hypot(coverpos.x - Global.myPose().x, coverpos.y - Global.myPose().y)
                if dist2 >= DYNAMICCOVERTHRES:
                    return STATE_DYNAMICCOVER
                else:
                    return STATE_ANTICIPATE
            elif shouldClear():
                return STATE_CLEARBALL
            elif (isBallOnOtherSide() and not isCloseToOrigin()) or Global.myPose().x > -3000.0:
                return STATE_RETURNORIGIN
            else:
                return STATE_COVERGOAL

        elif self.currentState == STATE_DYNAMICCOVER:
            if shouldClear() and Global.ballWorldPos().x >= Goalie2014.ORI_X:
                return STATE_CLEARBALL
            elif shouldDive(self.isDive):
                return STATE_DIVE

            ballPos = Global.ballWorldPos()
            coverpos = getDynamicCoverPos()
            distOri = math.hypot(ballPos.x - Goalie2014.ORI_X, ballPos.y - Goalie2014.ORI_Y)
            dist = math.hypot(coverpos.x - Global.myPose().x, coverpos.y - Global.myPose().y)

            # ball distance to goal post is greater than 3000 cm switch to cover goal state
            if distOri >= 3000:
                return STATE_COVERGOAL
            # stop to stand by when goalie reach to cover pos
            if (
                dist <= 200
                and abs(coverpos.x - Global.myPose().x) <= 100
                and abs(Global.ballHeading()) < math.radians(10)
            ):
                return STATE_ANTICIPATE
            else:
                return STATE_DYNAMICCOVER

        elif self.currentState == STATE_SPIN:
            # increase see ball hystersis when goalie can see ball
            if Global.canSeeBall():
                self.see_ball_hystersis.add(1)
            # stop spin when timer count down finished or goalie can see ball in couple frames
            if self.spin_timer.finished() or self.see_ball_hystersis.true:
                self.isLost = False
                if shouldDynamic():
                    return STATE_DYNAMICCOVER
                else:
                    return STATE_RETURNORIGIN
            else:
                return STATE_SPIN

        elif self.currentState == STATE_DIVE:
            if not self.isDive and shouldDive(self.isDive):
                return STATE_DIVE
            elif shouldClear() and Global.ballWorldPos().x >= Goalie2014.ORI_X:
                self.world.b_request.goalieDiving = False
                return STATE_CLEARBALL
            else:
                self.world.b_request.goalieDiving = False
                return STATE_RETURNORIGIN

        elif self.currentState == STATE_CLEARBALL:
            if self.isStriker and shouldClear() and Global.ballWorldPos().x >= Goalie2014.ORI_X:
                return STATE_CLEARBALL
            else:
                self.isStriker = False  # turn off striker flag
                self.world.b_request.goalieAttacking = False
                return STATE_COVERGOAL

        else:
            # LostScan state update see ball hystersis at each scan frame
            if Global.canSeeBall():
                self.see_ball_hystersis.add(1)

            # if goalie can see ball at certain frames switch to clearball or cover states
            if self.see_ball_hystersis.true:
                if shouldClear() and Global.ballWorldPos().x >= Goalie2014.ORI_X:
                    return STATE_CLEARBALL
                else:
                    return STATE_DYNAMICCOVER
            elif Global.ballLostFrames() > 200 and not isCloseToOrigin():
                # if goalie still cannot see the ball abort scan and return to origin to stand by
                return STATE_RETURNORIGIN
            else:
                return STATE_LOSTSCAN


class ReturnOrigin(TaskState):
    def init(self):
        self.walk2pt = WalkToPointV2(self.world)
        self.keepFacing = False
        self.parent.isBend = False
        self.distTotarget = 0
        self.keepfaceCount = 0

    def tick(self):
        robotPos = Global.myPose()

        # attempt to avoid goal posts by setting a higher x position when we haven't reached y
        targetX = Goalie2014.ORI_X + 300
        if abs(robotPos.y) - 400 > Goalie2014.ORI_Y:
            targetX += 400

        self.distTotarget = math.hypot(targetX - robotPos.x, Goalie2014.ORI_Y - robotPos.y)

        # increase keep face count if dist between goalie and origin is less than 1000 cm
        # otherwise clear the counting
        if self.distTotarget <= 1000 and robotPos.x > targetX and abs(robotPos.y) < 900:
            self.keepfaceCount += 1
        else:
            self.keepfaceCount = 0

        # set keepFacing flag true to have goalie walk backword to origin
        if self.keepfaceCount > 5:
            self.keepFacing = True

        heading = Goalie2014.ORI_THETA
        if self.distTotarget >= 400:
            heading = math.atan2(robotPos.y - Goalie2014.ORI_Y, robotPos.x - targetX)

        self.walk2pt.tick(targetX, Goalie2014.ORI_Y, heading, 1.0, self.keepFacing, useAvoidance=True)

    def transition(self):
        return self


class Anticipate(TaskState):
    def init(self):
        self.req = Global.EmptyBehaviourRequest()
        self.PostLostCount = 0
        self.parent.isDive = False

    def tick(self):
        if len(self.world.blackboard.vision.posts) == 0 or self.world.blackboard.vision.posts[0].rr.distance <= 3000.0:
            self.PostLostCount += 1
        else:
            self.PostLostCount = 0

        # if goalie cannot see goal post or can only see own side goal post last over 400 frames
        # we determin goalie is mis-localised. COMMENTED OUT BY IJNEK - we don't have post detection
        if self.PostLostCount >= 400:
            self.parent.isLost = False  # self.parent.isLost = True

        # ball distance to goalie less than 3000 cm have goalie to crouch to stand by
        # otherwise stand still to save power and release presure to angle motor
        self.req.actions.body = actioncommand.stand()
        if Global.ballDistance() <= 3000:
            self.req.actions.body = actioncommand.crouch()

        self.parent.world.b_request.actions.body = self.req.actions.body

        if not Global.isBallUncertain() and Global.ballLostFrames() > 10:
            skills.HeadSkill.instance.requestState(skills.HeadSkill.HEAD_SKILL_TRACK_BALL)

    def transition(self):
        return self


class ClearBall(TaskState):
    def init(self):
        # call striker module
        self.Striker = Striker(self.world)
        self.Striker.isGoalie = True
        self.parent.isStriker = True
        self.parent.isBend = False

    def tick(self):
        self.world.b_request.goalieAttacking = True
        self.Striker.tick()
        return self.Striker.world.b_request

    def transition(self):
        return self


class Dive(TaskState):
    def init(self):
        self.req = Global.EmptyBehaviourRequest()
        # filter out first 5 dive action decision to avoid noise
        self.DiveHytersis = Hysteresis(0, 5)

    def tick(self):
        period = ballTimeToPassGoalie()
        ballPos = Global.ballWorldPos()
        ballPosRRC = Global.ballRelPos()
        ballVel = Global.ballRelVel()
        ballNextRRPos = ballPosRRC.plus(ballVel)
        destY = ballPosRRC.y + ballVel.y * period

        # Log.debug("BallDist:%.2f, period:%.2f", Global.ballDistance(),period)
        # Log.debug("RRVelX:%.2f, RRVelY:%.2f, destY:%.2f", ballVel.x,ballVel.y,destY)
        # Log.debug("RRX:%.2f, RRY:%.2f, BallHead:%.2f", ballNextRRPos.x, ballNextRRPos.y, math.degrees(Global.ballHeading()))

        if abs(destY) <= CENTER_DIVE_THRES:
            # perform center dive if ball's final y coordinate if less than center dive threshold
            # Log.debug("Dive Center")
            self.DiveHytersis.add(1)
            if self.DiveHytersis.is_max():
                self.req.actions.body = actioncommand.goalieCentre()
                # robot.say("Center")
                self.parent.isDive = True
                self.world.b_request.goalieDiving = True
        elif destY < -CENTER_DIVE_THRES and abs(destY) < 900:
            # dive right if ball is at goale right hand side and ball distance is less than 900 cm
            # Log.debug("Dive Right")
            self.DiveHytersis.add(1)
            if self.DiveHytersis.is_max():
                self.req.actions.body = actioncommand.goalieDiveRight()
                # robot.say("Right")
                self.parent.isDive = True
                self.world.b_request.goalieDiving = True
        elif destY > CENTER_DIVE_THRES and abs(destY) < 900:
            # dive right if ball is at goale left hand side and ball distance is less than 900 cm
            # Log.debug("Dive Left")
            self.DiveHytersis.add(1)
            if self.DiveHytersis.is_max():
                self.req.actions.body = actioncommand.goalieDiveLeft()
                # robot.say("Left")
                self.parent.isDive = True
                self.world.b_request.goalieDiving = True
        else:
            # ball distance is greater than 900 cm and goalie cannot reach the ball even though to dive
            # Log.debug("Not Dive")
            self.req.actions.body = actioncommand.crouch()
        self.parent.world.b_request.actions.body = self.req.actions.body

    def transition(self):
        return self


class LostScan(TaskState):
    def init(self):
        self.startTime = self.world.blackboard.vision.timestamp
        self.move = False
        self.waitPeriod = 2000000
        self.turnDirection = 1
        self.posts_hysister = Hysteresis(0, 5)
        self.turn_hysister = Hysteresis(-25, 25)

    def tick(self):
        req = Global.EmptyBehaviourRequest()

        if not self.move:
            # scanning during waited peroid
            req.actions.body = actioncommand.crouch()
            self.posts_hysister.reset()
            self.turn_hysister.reset()
            # turn to inverse direction when stop time greater than waitperiod
            if self.world.blackboard.vision.timestamp - self.startTime > self.waitPeriod:
                self.startTime = self.world.blackboard.vision.timestamp
                self.turnDirection *= -1
                self.move = True

        if self.move:
            req.actions.body = actioncommand.walk(turn=self.turnDirection)
            if self.turnDirection == 1:
                # turn left
                self.turn_hysister.add(1)
                skills.HeadSkill.instance.requestState(skills.HeadSkill.HEAD_SKILL_LOOK_LEFT)
            else:
                # turn right
                self.turn_hysister.add(1)
                skills.HeadSkill.instance.requestState(skills.HeadSkill.HEAD_SKILL_LOOK_RIGHT)

            if (
                len(self.world.blackboard.vision.posts) != 0
                and self.world.blackboard.vision.posts[0].rr.distance <= 2500.0
            ):
                # update see own side post hystersis
                self.posts_hysister.add(1)
            else:
                self.posts_hysister.reset()

            # stop turning when goalie see the goal post and scan for lost ball
            if self.posts_hysister.true and self.turn_hysister.is_max():
                self.startTime = self.world.blackboard.vision.timestamp
                self.move = False
                self.posts_hysister.reset()
                self.turn_hysister.reset()

        self.parent.world.b_request.actions.body = req.actions.body

    def transition(self):
        return self


class Spin(TaskState):
    def init(self):
        self.parent.spin_timer.restart().start()
        # spin around for a few seconds to recover from mis-localise

    def tick(self):
        self.parent.world.b_request.actions.body = actioncommand.walk(turn=1)

    def transition(self):
        return self


class CoverGoal(TaskState):
    def init(self):
        self.coverpos = getGoalCoverPos()
        self.walk2pt = WalkToPointV2(self.world)

    def tick(self):
        ballPos = Global.ballWorldPos()
        robotPos = Global.myPose()
        toBall = ballPos.minus(robotPos)
        toBallHeading = math.atan2(toBall.y, toBall.x)
        self.coverpos = getGoalCoverPos()  # update cover goal position
        dist = math.hypot(ballPos.x - robotPos.x, ballPos.y - robotPos.y)

        # when ball distance is less than 3000 cm facing to the ball
        facingtoBall = False
        if dist <= 3000:
            facingtoBall = True
        self.walk2pt.tick(self.coverpos.x, self.coverpos.y, toBallHeading, 1.0, facingtoBall, useAvoidance=True)

        if not Global.isBallUncertain() and Global.ballLostFrames() > 10:
            skills.HeadSkill.instance.requestState(skills.HeadSkill.HEAD_SKILL_TRACK_BALL)

    def transition(self):
        return self


class DynamicCover(TaskState):
    def init(self):
        self.coverpos = getDynamicCoverPos()
        self.walk2pt = WalkToPointV2(self.world)

    def tick(self):
        ballPos = Global.ballWorldPos()
        robotPos = Global.myPose()
        self.coverpos = getDynamicCoverPos()
        toBall = ballPos.minus(robotPos)
        toBallHeading = math.atan2(toBall.y, toBall.x)

        facingtoBall = True  # keep facing to ball
        self.walk2pt.tick(self.coverpos.x, self.coverpos.y, toBallHeading, 1.0, facingtoBall, useAvoidance=True)

        if not Global.isBallUncertain() and Global.ballLostFrames() > 10:
            skills.HeadSkill.instance.requestState(skills.HeadSkill.HEAD_SKILL_TRACK_BALL)

    def transition(self):
        return self


###############################
# HELPER FUNCTION              #
###############################


def isCloseToOrigin():
    robotPos = Global.myPose()
    dist = math.hypot(robotPos.x - (Goalie2014.ORI_X + 300), robotPos.y - Goalie2014.ORI_Y)
    return dist < 200 and robotPos.x >= Goalie2014.ORI_X + 200 and abs(Global.myHeading()) < math.radians(10)


# judge if ball is in enermy's score range according to the ball's position


def ballinEnemyScoreRange(buff=0):
    ball = Global.ballWorldPos()

    if abs(ball.y) >= 1500:
        return False

    # top triangle:
    p1x = -4000 + buff  # half of our side
    p1y = 1200 + buff  # side field edge
    p2x = p1x + 1200  # penalty spot
    p2y = 0
    p3x = p1x
    p3y = -p1y
    sign1 = (p2y - p1y) * (ball.x - p1x) - (ball.y - p1y) * (p2x - p1x)
    sign2 = (p3y - p2y) * (ball.x - p2x) - (ball.y - p2y) * (p3x - p2x)
    # goal box
    sign3 = math.fabs(p1y) - math.fabs(ball.y)
    sign4 = -(Goalie2014.ORI_X - 200 - ball.x)
    return (sign1 >= 0) and (sign2 >= 0) and (sign3 >= 0) and (sign4 >= 0)


# dynamic goal box cover condition
def shouldDynamic():
    # return true if the ball is in our side and the distance between ball and goal box is greater than
    # 2700 cm and goalie see the ball is last 30 frames
    if not isBallOnOtherSide() and Global.ballWorldPos().x <= -2700 and Global.ballLostFrames() < 30:
        return True
    else:
        return False


# dive is currently disabled, set isDive to False to re-enable
def shouldDive(isDive=True):
    """
    dive condition. isDive is an dive action enable flag
    when isDive is set true, dive action will be banned
    can be used to save robot when do not develop dive skill
    """
    period = ballTimeToPassGoalie()  # how long the ball will reach goalie
    ballPos = Global.ballWorldPos()
    ballwordVel = Global.ballWorldVelHighConfidence(0.05)  # ball velocity in world model
    ballNextPos = ballPos.plus(ballwordVel)  # rough predition of ball's next position considering with its speed
    ballDist = math.hypot(
        ballNextPos.x - Global.myPose().x, ballNextPos.y - Global.myPose().y
    )  # distance between ball and goalie

    return period < 4 and ballDist <= 2000 and abs(ballNextPos.y) <= 1000 and not isDive


def ballTimeToPassGoalie():
    ballPos = Global.ballRelPos()
    ballVel = Global.ballRelVel()
    carpet_fiction = 200.0  # carpet deceleration (found by trial and error)
    # delta x = + v * t + 1/2 * a * t^2(uniform speed linear motion formula)
    # assume ball is moved as uniform speed linear motion

    det = ballVel.x * ballVel.x - 2.0 * carpet_fiction * ballPos.x  # final speed's square when ball reach goale
    if det >= 0:
        time = (-ballVel.x - math.sqrt(det)) / carpet_fiction  # average time cost
    else:
        time = 1000  # if det less than 0 the ball is moving away to goalie
    if time < 0 or math.isnan(time):
        time = 1000  # safety check

    # consider how much i can cover
    bally = ballPos.y
    vely = ballVel.y
    destY = bally + vely * time
    # don't dive for balls too far away as a safety check
    if math.fabs(destY) > Goalie2014.POST_Y * 1.1:
        time = 1000
    # don't dive for balls too far away as a safety check
    if ballPos.x > 3000:
        time = 1000

    return time


def isBallOnOtherSide():
    return Global.ballWorldPos().x > -700.0


# calculate rough cover goal postion when ball is far from goal post
# only three position (Goalie2014.ORI_X + 250,0), (Goalie2014.ORI_X + 250,200)
# (Goalie2014.ORI_X + 250,-200) the y coordinate if decided regard to bally postion


def getGoalCoverPos():
    ballPos = Global.ballWorldPos()
    robotPos = Global.myPose()

    if abs(ballPos.y) >= 200.0:
        covery = math.copysign(200.0, ballPos.y)
    else:
        covery = 0.0

    coverx = Goalie2014.ORI_X + 250

    return Vector2D(coverx, covery)


# calculate a more precise cover goal position when ball is close to goal post
# general idea is that generate a oval curve according to size of goal box
# and then calculate the intercept point between the line from ball to goal center,
# and oval curve which is the cover point of goalie


def getDynamicCoverPos():
    semi_major = 1000.0  # a
    semi_minor = 500.0  # b

    # the eccentricity of oval curve
    eccentricity = math.sqrt(1 - (math.pow(semi_minor, 2) / math.pow(semi_major, 2)))

    ballPos = Global.ballWorldPos()

    # angle between ball to goal post center
    balltoOriHead = math.atan2(ballPos.x - Goalie2014.ORI_X, ballPos.y - Goalie2014.ORI_Y)

    radi = semi_minor / math.sqrt((1 - math.pow(math.cos(balltoOriHead) * eccentricity, 2)))

    y = radi * math.cos(balltoOriHead) + Goalie2014.ORI_Y
    if abs(y) <= 100:
        y = 0
        x = -4000
        return Vector2D(x, y)

    if abs(y) >= 700:
        y = math.copysign(700, ballPos.y)
        x = Goalie2014.ORI_X + 200
        return Vector2D(x, y)

    x = radi * math.sin(balltoOriHead) + Goalie2014.ORI_X
    return Vector2D(x, y)


def shouldClear(printi=False):
    # return true when goalie is closest to ball and the ball distance is less than 1200 cm and Goalie see the ball is last 30 frames
    if FieldGeometry.calculateTimeToReachBall() < TeamStatus.minTeammateDistToBall() and Global.ballLostFrames() < 30:
        return (
            ballinEnemyScoreRange() or FieldGeometry.isInGoalBox(Global.ballWorldPos()) or Global.ballDistance() <= 1200
        )
    else:
        return False
