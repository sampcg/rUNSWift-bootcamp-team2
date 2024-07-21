#include "bbdReader.hpp"

#include <boost/archive/binary_oarchive.hpp>
#include <sstream>

#include "progopts.hpp"

using namespace std;

BBDReader::BBDReader(const QString &fileName) : ifs(), in(){
   // catch if file not found
   ifs.exceptions(ifstream::eofbit | ifstream::failbit | ifstream::badbit);
   ifs.open(qPrintable(fileName), ios::in | ios::binary);
   in.push(ifs);
   ia = new boost::archive::binary_iarchive(in);
}

BBDReader::BBDReader(const QString &fileName, const NaoData &naoData) : 
Reader(naoData), ifs(), in(){
   // catch if file not found
   ifs.exceptions(ifstream::eofbit | ifstream::failbit | ifstream::badbit);
   ifs.open(qPrintable(fileName), ios::in | ios::binary);
   in.push(ifs);
   ia = new boost::archive::binary_iarchive(in);
}

BBDReader::~BBDReader() {
   delete ia;
}

void BBDReader::run() {
   /* Load as many frames as possible until we hit an exception */

   for(;;) {
      try {
         Frame frame;
         frame.blackboard = new Blackboard(config);
         *ia & *frame.blackboard;
         naoData.appendFrame(frame);
      } catch(const std::exception& e) {
         /* Only error if we read no frames */
         if (naoData.getFramesTotal() == 0) {
            QString s("Can not load record: ");
            Q_EMIT disconnectFromNao();
            Q_EMIT showMessage(s + e.what());
            return;
         }
         break;
      }
   }

   stringstream s;
   s << "Finished loading record which consisted of " <<
        naoData.getFramesTotal() << " frames.";
   Q_EMIT showMessage(s.str().c_str(), 5000);
   Q_EMIT newNaoData(&naoData);
   
   int currentIndex = 0;
   isAlive = true;
   while (isAlive) {
      if (!naoData.getIsPaused() &&
         naoData.getCurrentFrameIndex() < naoData.getFramesTotal() - 1) {
         naoData.nextFrame();
         Q_EMIT newNaoData(&naoData);
      } else if (currentIndex != naoData.getCurrentFrameIndex()) {
         Q_EMIT newNaoData(&naoData);
      }
      currentIndex = naoData.getCurrentFrameIndex();
      msleep(500);
   }
   Q_EMIT newNaoData(NULL);
}

