//
// Created by jayen on 6/03/19.
//

#include "speech.hpp"

#include "utils/home_nao.hpp"

using namespace std;

namespace{
constexpr size_t MAX_SAY_SIZE = 1000;
}
int ret;
char sayMessage[MAX_SAY_SIZE];
const char* ESPEAK_PRE = "espeak -a 100 -vf5 -p75 -g20 -m \"";
const char* ESPEAK_POST = "\" &";  // non-blocking system call

Speech &Speech::instance() {
    static Speech instance;
    return instance;
}

void Speech::say(const char *text) {
    if (sayTimer.elapsed_ms() < 3000) {
        llog(DEBUG) << "SAY (dropped):\t\t" << text << endl;
        return;
    }
    sayTimer.restart();

    if((strlen(ESPEAK_PRE) + strlen(text) + strlen(ESPEAK_POST)) >= MAX_SAY_SIZE) {
       llog(ERROR) << "Speak text request is too long!" << endl;
       return;
    }

    strcpy(sayMessage,ESPEAK_PRE);
    strcat(sayMessage,text);
    strcat(sayMessage,ESPEAK_POST);
    ret = system(sayMessage);
    if (ret != 0) {
       llog(ERROR) << "SAY FAILED:\t\t" << text << endl;
       return;
    }
    llog(INFO) << "SAY:\t\t" << text << endl;
    std::cout << "SAY:\t\t" << text << std::endl;
}

Speech::Speech() {}

Speech::~Speech() {}