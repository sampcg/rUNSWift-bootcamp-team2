#pragma once
#ifndef Q_MOC_RUN
#include <boost/serialization/version.hpp>
#endif
#include <cstdint>

struct RefereeHandDetectorParams {
    explicit RefereeHandDetectorParams();
    uint8_t maskTopStartH;
    uint8_t maskTopStartS;
    uint8_t maskTopStartV;
    uint8_t maskTopEndH;
    uint8_t maskTopEndS;
    uint8_t maskTopEndV;
    uint8_t maskBottomStartH;
    uint8_t maskBottomStartS;
    uint8_t maskBottomStartV;
    uint8_t maskBottomEndH;
    uint8_t maskBottomEndS;
    uint8_t maskBottomEndV;

    template<class Archive>
    void serialize(Archive &ar, const unsigned int file_version) {
        ar & maskTopStartH;
        ar & maskTopStartS;
        ar & maskTopStartV;
        ar & maskTopEndH;
        ar & maskTopEndS;
        ar & maskTopEndV;
        ar & maskBottomStartH;
        ar & maskBottomStartS;
        ar & maskBottomStartV;
        ar & maskBottomEndH;
        ar & maskBottomEndS;
        ar & maskBottomEndV;
    }
};

BOOST_CLASS_VERSION(RefereeHandDetectorParams, 1);
