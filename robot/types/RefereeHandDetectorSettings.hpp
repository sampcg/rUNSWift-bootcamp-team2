#pragma once
#ifndef Q_MOC_RUN
#include <boost/serialization/version.hpp>
#endif

struct RefereeHandDetectorSettings {
    explicit RefereeHandDetectorSettings();
    int handMinHDistance;
    int handMaxHDistance;
    int handMinVDistance;
    int handMaxVDistance;
    int cropLeft;
    int cropRight;
    int cropTop;
    int cropBottom;
    int enabled;
    int area;

    template<class Archive>
    void serialize(Archive &ar, const unsigned int file_version) {
        ar & handMinHDistance;
        ar & handMaxHDistance;
        ar & handMinVDistance;
        ar & handMaxVDistance;
        ar & cropLeft;
        ar & cropRight;
        ar & cropTop;
        ar & cropBottom;
        ar & enabled;
        ar & area;
    }
};

BOOST_CLASS_VERSION(RefereeHandDetectorSettings, 1);
