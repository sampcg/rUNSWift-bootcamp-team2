/**
 * GameController.hpp
 * Description: A thread to recieve game state information from the Game
 * Controller sever and implements the Button Interface. Adapted from 2009 code.
 */

#include <arpa/inet.h>
#include <dirent.h>
#include <netdb.h>
#include <netinet/in.h>
#include <sys/poll.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <time.h>

#include <ctime>
#include <string>

#include "blackboard/Blackboard.hpp"
#include "gamecontroller/GameController.hpp"
#include "utils/Logger.hpp"
#include "utils/speech.hpp"
#include "types/RefereeHandsVisionInfo.hpp"

#define POLL_TIMEOUT 200

using namespace std;

/**
 * Average number of broadcast GameController packets
 * expected to be received per second.
 */
const uint8_t PACKETS_PER_SECOND = 2;

/**
 * Minimum number of seconds to wait before repeating the thank you.
 */
const uint8_t REPEAT_THANKS_SECONDS = 30;

/**
 * To handle spotty WiFi scenarios, allow up to this much network jitter,
 * specifically allow this proportion of packets dropped before leaving the
 * WiFi, as the second required guard to leave the WiFi and kill `runswift`.
 *
 * If set too high, robots will wait longer before actually leaving the WiFi,
 * if set too low, robots will depend more only on the time that the
 * first and last packets were received.
 *
 * Should be set to a value between 0.0 and 1.0
 */
const double JITTER_BUFFER = 0.5;

const uint8_t min_packets =
    JITTER_BUFFER * REPEAT_THANKS_SECONDS * PACKETS_PER_SECOND;

GameController::GameController(Blackboard *bb)
    : Adapter(bb), our_team(NULL), connected(false),service(),
      gcSocket(service, boost::asio::ip::udp::v4()) {
    lastState = STATE_INITIAL;
    myLastPenalty = PENALTY_NONE;
    if (readFrom(gameController, connect)) {
        initialiseConnection();
    }
    actOnRefHandsRaised = (bb->config)["debug.act_on_ref_hands_raised"].as<bool>();
    actOnWhistle = (bb->config)["debug.act_on_whistle"].as<bool>();
    useGetups = (bb->config)["behaviour.use_getups"].as<bool>();
}

GameController::~GameController() { close(sock); }

void GameController::tick() {
    // Notes:
    // gameState represents what we think the game state should be
    // It is the same as data.state unless we hear a whistle
    // If we hear a whistle, set gameState to playing to tell our teammates
    // If the team agrees, then override the official data.state with playing

    // -- Standard Game Controller Packet Update --
    uint8_t previousGameState = readFrom(gameController, gameState);
    data = readFrom(gameController, data);
    teamNumber = readFrom(gameController, our_team).teamNumber;
    playerNumber = readFrom(gameController, player_number);
    setOurTeam();

    if (!connected && readFrom(gameController, connect)) {
        initialiseConnection();
    }
    if (connected) wirelessUpdate();
    buttons = readFrom(motion, buttons);

    buttonUpdate();
    // Not sure why Dave thought it was ok to write to someone else's blackboard
    writeTo(motion, buttons, buttons);

    // -- Extras for Whistle Detection --
    const uint8_t gameState = data.state;

    bool whistleDetected = whistleHeard(3);
    bool refereeDetected = refereeSeen();

    // overwrite playing state if going into ready from goal scored
    // if (gameState == STATE_PLAYING && previousGameState == STATE_READY) {
    //     data.state = STATE_READY;
    // }

    // go into ready if whistle heard and from playing
    // if (gameState == STATE_PLAYING && whistleDetected) {
    //     whistleDetected = true;
    //     data.state = STATE_READY;
    //     llog(INFO) << "Heard whistle, ready"<<endl;
    //     SAY("Heard whistle, ready");
    // }

    // overwrite set state if going into playing from starting whistle
    if (gameState == STATE_SET && previousGameState == STATE_PLAYING) {
        data.state = STATE_PLAYING;
    }

    // playing after whistle heard and from SET
    if (whistleDetected && actOnWhistle && gameState == STATE_SET) {
        data.state = STATE_PLAYING;
        whistleDetected = true;
        llog(INFO) << "Heard whistle, playing"<<endl;
        SAY("Heard whistle, playing");
    }

    // overwrite set state if going into playing from starting whistle
    if (gameState == STATE_STANDBY && previousGameState == STATE_READY) {
        data.state = STATE_READY;
    }

    // standby after whistle heard and from READY
    if (refereeDetected && actOnRefHandsRaised && gameState == STATE_STANDBY) {
        data.state = STATE_READY;
        llog(INFO) << "Detected referee signal, ready"<<endl;
        SAY("Detected referee signal, ready");
    }

    // Enable referee detection in standby
    RefereeHandDetectorSettings settings;
    if (gameState == STATE_STANDBY) {
        writeTo(vision, refereeHandDetectorSettings.enabled, 1);
    } else {
        writeTo(vision, refereeHandDetectorSettings.enabled, 0);
    }

    for (const auto & teamData : readFrom(receiver, data)) {
        if(gameState == STATE_STANDBY && teamData.gameState == STATE_READY && teamData.playerNum != playerNumber && actOnRefHandsRaised) {
            // important for referee detection
            llog(INFO) << std::to_string(teamData.playerNum)<< " thinks we're ready, I'm ready too"<<endl;
            data.state = STATE_READY;
        }
    }

    writeTo(gameController, data, data);
    writeTo(gameController, our_team, *our_team);
    writeTo(gameController, gameState, data.state);
    writeTo(gameController, whistleDetected, whistleDetected);

    sendToGameController();
}

void GameController::initialiseConnection() {
    llog(INFO) << "GameController: Connecting on port "
               << GAMECONTROLLER_DATA_PORT << endl;
    stringstream s;
    s << GAMECONTROLLER_DATA_PORT;

    struct addrinfo myInfo, *results;
    memset(&myInfo, 0, sizeof myInfo);
    myInfo.ai_family = AF_UNSPEC;
    myInfo.ai_socktype = SOCK_DGRAM;
    myInfo.ai_flags = AI_PASSIVE;  // use my IP

    if (getaddrinfo(NULL, s.str().c_str(), &myInfo, &results) == -1) {
        llog(ERROR) << "GameController: Invalid Address Information" << endl;
        return;
    }

    // loop through all the results and bind to the first we can
    struct addrinfo *p;
    for (p = results; p != NULL; p = p->ai_next) {
        if ((sock = socket(p->ai_family, p->ai_socktype, p->ai_protocol)) ==
            -1) {
            llog(INFO) << "GameController: Cannot use Socket, trying next"
                       << endl;
            continue;
        }

        // set the socket to reuse ports (so we can have multiple instances of
        // rUNSWift listening to the same UDP port ;-) )
        int enable = 1;
        if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &enable, sizeof(int)) !=
            0) {
            llog(ERROR) << "Could not set socket options: " << errno << endl;
            continue;
        }

        if (bind(sock, p->ai_addr, p->ai_addrlen) == -1) {
            close(sock);
            llog(INFO) << "GameController: Cannot Bind, trying next" << endl;
            continue;
        }

        break;
    }
    if (p == NULL) {
        llog(ERROR) << "GameController: Failed to bind socket" << endl;
        return;
    }

    // We don't want memory leaks...
    freeaddrinfo(results);

    llog(INFO) << "GameController: Connected on port - " << s.str() << endl;
    connected = true;
    writeTo(gameController, connected, connected);
}

void GameController::buttonUpdate() {
    if (buttons.remove(ButtonPresses::SINGLE_CHEST_TAP)) {
        llog(INFO) << "button pushed once, switching state" << endl;
        switch (our_team->players[playerNumber - 1].penalty) {
            case PENALTY_NONE:
                our_team->players[playerNumber - 1].penalty = PENALTY_MANUAL;
                SAY("Penalised");
                break;
            default:
                data.state = STATE_PLAYING;
                our_team->players[playerNumber - 1].penalty = PENALTY_NONE;
                SAY("Playing");
        }
    }
}

void GameController::wirelessUpdate() {
    // Setup receiving client
    int bytesRecieved;
    struct sockaddr_storage clientAddress;
    socklen_t addr_len = sizeof(clientAddress);

    // Setup buffer to write to
    int dataSize = sizeof(RoboCupGameControlData);
    unsigned char buffer[dataSize + 1];

    // Setup for polling
    struct pollfd ufds[1];
    ufds[0].fd = sock;
    ufds[0].events = POLLIN;  // For incoming packets

    // Congested WiFi: Try to grab several packets in one tick
    // to clear buffers and lower effective latency
    for (int i = 0; i < 5; i++) {
        int rv = poll(ufds, 1, POLL_TIMEOUT);  // Wait up to POLL_TIMEOUT ms

        // Check to see if we've received a packet
        if (rv > 0) {
            bytesRecieved =
                recvfrom(sock, buffer, dataSize, 0,
                         (struct sockaddr *)&clientAddress, &addr_len);
            // Should use inet_ntop, but we don't need IPv6 support so meh
            writeTo(
                gameController, lastGameControllerIPAddress,
                inet_ntoa(((struct sockaddr_in *)&clientAddress)->sin_addr));
            if (bytesRecieved > 0) {
                parseData((RoboCupGameControlData *)buffer);
                handlePenaltyShootoutPacket();
                handleFinishedPacket();
            }
        }
    }
}

void GameController::handlePenaltyShootoutPacket() {
    if (data.gamePhase != GAME_PHASE_PENALTYSHOOT) {
        writeTo(behaviour, useGetups, useGetups);
        return;
    }
    // Hard coded as we've seen goalie dive, save successfully, but
    // hands then fling ball into goal
    if (playerNumber == 1) {
        writeTo(behaviour, useGetups, false);
    }
}

void GameController::handleFinishedPacket() {
    if (data.state != STATE_FINISHED || data.gamePhase != GAME_PHASE_NORMAL) {
        // If not FINISHED, or in a timeout or penalty shootout game state
        finished_times.clear();
        return;
    }
    time_t now = time(0);  // get time now
    finished_times.push_back(now);
    double diff = difftime(finished_times.front(), finished_times.back());
    if (abs(diff) > REPEAT_THANKS_SECONDS &&
        finished_times.size() > min_packets) {
        SAY("THANKS AND SEE YOU LATER");
        finished_times.clear();
    }
}

bool GameController::whistleHeard(int numSeconds) {
    const char *WHISTLE_FILE_FORMAT = "whistle_%Y_%m_%d_%H%M%S.wav";
    const char *NAO_WHISTLE_LOCATION = "/home/nao/whistle/heard_whistles";
    DIR *dir;
    struct dirent *ent;
    struct tm fileDateTime;
    time_t now = time(0);  // get time now
    bool found = false;

    if ((dir = opendir(NAO_WHISTLE_LOCATION)) != NULL) {
        /* go through all the files and directories within directory */
        while ((ent = readdir(dir)) != NULL) {
            strptime(ent->d_name, WHISTLE_FILE_FORMAT, &fileDateTime);
            fileDateTime.tm_isdst = 0;  // Override daylight saving
            double seconds = difftime(now, mktime(&fileDateTime));

            // If file created in last numSeconds
            if (abs(seconds) <= numSeconds) {
                found = true;
            }
        }
        closedir(dir);
    } else {
        /* could not open directory */
    }
    return found;
}

bool GameController::refereeSeen() {
    bool seen = readFrom(vision, refereeSeen);
    if (seen) {
        writeTo(vision, refereeSeen, false);
        return true;
    }
    return false;
}

void GameController::parseData(RoboCupGameControlData *update) {
    if (isValidData(update)) {
        // Heard whistles - if GameController still saying we are in SET
        // but we are already PLAYING, keep PLAYING
        // if (int(update->state) == STATE_SET && data.state == STATE_PLAYING) {
        //     update->state = STATE_PLAYING;
        // }

        // Update the data
        if (!gameDataEqual(update, &data)) {
            memcpy(&data, update, sizeof(RoboCupGameControlData));
            setOurTeam();
        }

        llog(VERBOSE) << "GameController: Valid data" << endl;
        if (data.state != lastState) {
            // Shamelessly copied from:
            // http://stackoverflow.com/a/1995057/1101109
            char comboState[100];
            strcpy(comboState, gameControllerGamePhaseNames[update->gamePhase]);
            strcat(comboState, gameControllerStateNames[data.state]);
            SAY(comboState);
            lastState = data.state;
        }

        unsigned char myPenalty = our_team->players[playerNumber - 1].penalty;

        if (myPenalty != myLastPenalty) {
            if (myPenalty == PENALTY_NONE) {
                SAY("Unpenalised");
            } else {
                SAY((string("Penalised for ") +
                     gameControllerPenaltyNames[myPenalty])
                        .c_str());
            }
            myLastPenalty = myPenalty;
        }
    } else {
        // no need to do anything since we already log an error during
        // validation about why it's invalid and we ignore TCM data
        //        llog(ERROR) << "GameController: Invalid data" << endl;
    }
}

void GameController::setOurTeam() {  // make our_team point to the my actual
                                     // team, based on teamNumber
    if (data.teams[0].teamNumber == teamNumber) {
        our_team = &(data.teams[0]);
    } else if (data.teams[1].teamNumber == teamNumber) {
        our_team = &(data.teams[1]);
    } else {
        llog(ERROR) << "We are team " << teamNumber << " but GC is sending "
                    << data.teams[0].teamNumber << " and "
                    << data.teams[1].teamNumber << "\n";
    }
}

bool GameController::isValidData(RoboCupGameControlData *gameData) {
    // check the right structure header has come in
    if (!(checkHeader(gameData->header))) {
        // only log an error if it's not for us
        llog(ERROR) << "GameController: DATA HEADER MISMATCH! "
                    << "Expected: " << GAMECONTROLLER_STRUCT_HEADER
                    << " received: " << gameData->header << endl;
        return false;
    }

    // check for partial packets
    // TODO(stuartr): these will always be equal since sizeof(type) is
    // compile-time
    //                based on the type.  use bytesRecieved from wirelessUpdate
    if (sizeof(*gameData) != sizeof(RoboCupGameControlData)) {
        llog(ERROR) << "GameController: RECEIVED PARTIAL PACKET! "
                    << "Expected: " << sizeof(RoboCupGameControlData)
                    << " received: " << sizeof(*gameData) << endl;
        return false;
    }

    // check the right version of the structure is being used
    if (gameData->version != GAMECONTROLLER_STRUCT_VERSION) {
        llog(ERROR) << "GameController: DATA VERSION MISMATCH! "
                    << "Expected: " << GAMECONTROLLER_STRUCT_VERSION
                    << " received: " << gameData->version << endl;
        return false;
    }

    // check whether this packet belongs to this game at all
    if (!isThisGame(gameData)) {
        llog(ERROR) << "GameController: DATA NOT FOR THIS GAME!" << endl;
        return false;
    }

    // Data is valid ^_^
    return true;
}

bool GameController::checkHeader(char *header) {
    for (int i = 0; i < 4; i++) {
        if (header[i] != GAMECONTROLLER_STRUCT_HEADER[i]) return false;
    }
    return true;
}

bool GameController::isThisGame(RoboCupGameControlData *gameData) {
    return gameData->teams[0].teamNumber == teamNumber ||
           gameData->teams[1].teamNumber == teamNumber;
}

bool GameController::gameDataEqual(void *gameData, void *previous) {
    if (!memcmp(previous, gameData, sizeof(RoboCupGameControlData))) {
        return true;
    }
    return false;
}

void GameController::sendToGameController() {
   char* sendToIP = readFrom(gameController, lastGameControllerIPAddress);
   if (sendToIP == nullptr) {
      // sendToIP is only initialised once GameController sends us a packet
      return;
   }

   gameControllerEndpoint.address(boost::asio::ip::address::from_string(sendToIP));
   gameControllerEndpoint.port(GAMECONTROLLER_RETURN_PORT);
   boost::system::error_code ec = boost::system::error_code();
   gcSocket.connect(gameControllerEndpoint, ec);

    RoboCupGameControlReturnData d = RoboCupGameControlReturnData();
    d.teamNum = (blackboard->config)["player.team"].as<int>();
    d.playerNum = (blackboard->config)["player.number"].as<int>();
    d.fallen =  0;
    AbsCoord robotPos = readFrom(stateEstimation, robotPos);
    d.pose[0] = robotPos.x();
    d.pose[1] = robotPos.y();
    d.pose[2] = robotPos.theta();
    RRCoord ballPos = readFrom(stateEstimation, ballPosRR);
    d.ball[0] = ballPos.distance();
    d.ball[1] = ballPos.heading();
    d.version = GAMECONTROLLER_RETURN_STRUCT_VERSION;

   gcSocket.send(boost::asio::buffer(&d, sizeof(RoboCupGameControlReturnData)), 0, ec);

}
