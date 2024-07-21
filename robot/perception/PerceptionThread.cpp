#include "perception/PerceptionThread.hpp"

#include <pthread.h>
#include <ctime>
#include <utility>
#include <boost/algorithm/string.hpp>
#include <boost/algorithm/string/classification.hpp>

#include "perception/dumper/PerceptionDumper.hpp"
#include "perception/behaviour/SafetySkill.hpp"
#include <perception/vision/camera/NaoCamera.hpp>
#include "soccer.hpp"
#include "blackboard/Blackboard.hpp"
#include "utils/Logger.hpp"
#include "thread/Thread.hpp"
#include "boost/lexical_cast.hpp"
#include <boost/bind.hpp>
#include <boost/thread/thread.hpp>

using namespace std;
using namespace boost;

PerceptionThread::PerceptionThread(Blackboard *bb)
    : Adapter(bb),
      stateEstimationAdapter(bb),
      behaviourAdapter(bb),
      bb_(bb)
{
    bool simulation = bb->config.count("simulation");
    if (simulation)
       visionAdapter = NULL;
    else
       visionAdapter = new VisionAdapter(bb);
    dumper = NULL;

    releaseLock(serialization);
    if (!simulation) {
       uint8_t const *topFrame = readFrom(vision, topFrame);
       uint8_t const *botFrame = readFrom(vision, botFrame);

       if (topFrame != NULL && botFrame != NULL) {
          string file = "/home/nao/crashframe-" +
                        boost::lexical_cast<string>(time(NULL)) + ".yuv";
          FILE *errorFrameFile = fopen(file.c_str(), "w");
          fwrite(topFrame, 640 * 480 * 2, 1, errorFrameFile);
          fwrite(botFrame, 640 * 480 * 2, 1, errorFrameFile);
          fclose(errorFrameFile);
          file =
             "/usr/bin/tail -n 200 " + bb->config["debug.logpath"].as<string>() + "/*/Perception > " + file + ".log";
          std::system(file.c_str());
       }
    }

    readOptions(bb->config);
    writeTo(thread, configCallbacks[Thread::name],
            boost::function<void(const boost::program_options::variables_map &)>(boost::bind(&PerceptionThread::readOptions, this, _1)));
}

PerceptionThread::~PerceptionThread()
{
    llog(INFO) << __PRETTY_FUNCTION__ << endl;
    writeTo(thread, configCallbacks[Thread::name], boost::function<void(const boost::program_options::variables_map &)>());
    delete visionAdapter;
}

void PerceptionThread::tick()
{
    // Only perform perception thread tick if robot is stiff
    bool isStiff = readFrom(motion, isStiff);
    if (!isStiff) {
        llog_open(VERBOSE) << "Skipping Perception Thread (not stiff)" << endl;
        return;
    }

    llog_open(VERBOSE) << "Perception Thread" << endl;

    Timer timer_thread;
    Timer timer_tick;

    /*
    * Vision Tick
    */
    llog_open(VERBOSE) << "Vision Tick" << endl;
    timer_tick.restart();
    if (visionAdapter)
        visionAdapter->tick();

    uint32_t vision_time = timer_tick.elapsed_us();
    if (vision_time < TICK_MAX_TIME_VISION)
    {
        llog_close(VERBOSE) << "Vision Tick: OK " << vision_time << endl;
    }
    else
    {
        llog_close(ERROR) << "Vision Tick: TOO LONG " << vision_time << endl;
    }

    /*
    * State Estimation Tick
    */
    llog_open(VERBOSE) << "State Estimation Tick" << endl;
    timer_tick.restart();

    stateEstimationAdapter.tick();

    uint32_t state_estimation_time = timer_tick.elapsed_us();
    if (state_estimation_time < TICK_MAX_TIME_STATE_ESTIMATION)
    {
        llog_close(VERBOSE) << "State Estimation Tick: OK " << state_estimation_time << endl;
    }
    else
    {
        llog_close(ERROR) << "State Estimation Tick: TOO LONG " << state_estimation_time << endl;
    }

    /*
    * Behaviour Tick
    */
    llog_open(VERBOSE) << "Behaviour Tick" << endl;
    timer_tick.restart();
    pthread_yield();

    if (time(NULL) - readFrom(remoteControl, time_received) < 60)
    {
        /* we have fresh remote control data, use it */
        int writeBuf = (readFrom(behaviour, readBuf) + 1) % 2;
        writeTo(behaviour, request[writeBuf], readFrom(remoteControl, request));
        writeTo(behaviour, readBuf, writeBuf);
    }
    else
    {
        behaviourAdapter.tick();
    }

    uint32_t behaviour_time = timer_tick.elapsed_us();
    if (behaviour_time < TICK_MAX_TIME_BEHAVIOUR)
    {
        llog_close(VERBOSE) << "Behaviour Tick (and perception yield): OK " << behaviour_time << endl;
    }
    else
    {
        llog_close(ERROR) << "Behaviour Tick (and perception yield): TOO LONG " << behaviour_time << endl;
    }

    /*
    * Finishing Perception
    */
    uint32_t perception_time = timer_thread.elapsed_us();
    if (perception_time < THREAD_MAX_TIME)
    {
        llog_close(VERBOSE) << "Perception Thread: OK " << perception_time << endl;
    }
    else
    {
        llog_close(ERROR) << "Perception Thread: TOO LONG " << perception_time << endl;
    }

    writeTo(perception, vision, vision_time);
    writeTo(perception, stateEstimation, state_estimation_time);
    writeTo(perception, behaviour, behaviour_time);
    writeTo(perception, total, perception_time);

    if (dumper)
    {
        if (dump_timer.elapsed_us() > dump_rate)
        {
            dump_timer.restart();
            try
            {
                bb_->write(&(bb_->mask), bb_->debugMask);
                dumper->dump(bb_);
            }
            catch (const std::exception &e)
            {
                attemptingShutdown = true;
                cout << "Error: " << e.what() << endl;
            }
        }
    }
}

void PerceptionThread::readOptions(const boost::program_options::variables_map &config)
{
    if (visionAdapter)
    {
        // cid-value pairs
        string const &cvs = config["vision.camera_controls"].as<string>();
        vector<string> cvs_split = vector<string>();
        split(cvs_split, cvs, is_any_of(",;"));
        for (vector<string>::const_iterator cv_ci = cvs_split.begin(); cv_ci != cvs_split.end(); ++cv_ci)
        {
            vector<string> cv_split = vector<string>();
            split(cv_split, *cv_ci, is_any_of(":"));
            if (cv_split.size() != 3)
            {
                llog(ERROR) << "controls should be formatted as \"cam:control_id:value\"" << endl;
            }
            else
            {
                Camera *camera;
                long const is_top_camera = strtol(cv_split[0].c_str(), NULL, 10);
                unsigned long const control_id = strtoul(cv_split[1].c_str(), NULL, 10);
                long const value = strtol(cv_split[2].c_str(), NULL, 10);
                if (is_top_camera)
                    camera = CombinedCamera::getCameraTop();
                else
                    camera = CombinedCamera::getCameraBot();

                // a ritual to set manually set gain and exposure
                if (control_id == V4L2_CID_EXPOSURE || control_id == V4L2_CID_EXPOSURE_ABSOLUTE)
                {
                    camera->setControl(V4L2_CID_EXPOSURE_ABSOLUTE, (value + 1) % V6_MAX_EXPOSURE_ABSOLUTE);
                    camera->setControl(V4L2_CID_EXPOSURE_ABSOLUTE, value);
                }
                else if (control_id == V4L2_CID_GAIN)
                {
                    camera->setControl(V4L2_CID_GAIN, (value + 1) % V6_MAX_GAIN);
                    camera->setControl(V4L2_CID_GAIN, value);
                }
                else
                {
                    camera->setControl(control_id, value);
                }

                // update camera settings object
                // only the following settings are currently updated by webnao
                CameraSettings settings = ((NaoCamera *)camera)->cameraSettings;
                // TODO: consolidate this into a member function in the NaoCamera class
                switch (control_id)
                {
                case V4L2_CID_BRIGHTNESS:
                    settings.brightness = value;
                    break;
                case V4L2_CID_CONTRAST:
                    settings.contrast = value;
                    break;
                case V4L2_CID_SATURATION:
                    settings.saturation = value;
                    break;
                case V4L2_CID_DO_WHITE_BALANCE:
                    settings.whiteBalance = value;
                    break;
                case V4L2_CID_EXPOSURE:
                    /* fallthrough */
                case V4L2_CID_EXPOSURE_ABSOLUTE:
                    settings.exposure = value;
                    break;
                case V4L2_CID_GAIN:
                    settings.gain = value;
                    break;
                case V4L2_CID_SHARPNESS:
                    settings.sharpness = value;
                    break;
                case V4L2_CID_BACKLIGHT_COMPENSATION:
                    settings.backlightCompensation = value;
                    break;
                }
                ((NaoCamera *)camera)->cameraSettings = settings;
            }
        }
    }

    const string &dumpPath = config["debug.dump"].as<string>();
    dump_rate = config["vision.dumprate"].as<int>() * 1000;
    bool dump_overwrite = config["debug.dump_overwrite"].as<bool>();
    if (dumpPath == "")
    {
        delete dumper;
        dumper = NULL;
    }
    else
    {
        if (!dumper || dumper->getPath() != dumpPath)
        {
            delete dumper;
            dumper = new PerceptionDumper(dumpPath.c_str(), dump_overwrite);
        }
    }

    // Keep a copy of debugMask on the blackboard so the config need not be read multiple times
    OffNaoMask_t debugMask = config["debug.mask"].as<int>();
    bb_->write(&(bb_->debugMask), debugMask);
}
