#ifndef REFEREE_HANDS_VISION_INFO_HPP
#define REFEREE_HANDS_VISION_INFO_HPP

#include "types/BBox.hpp"

struct RefereeHand {
    RefereeHand () :
        topImageCoords() {}
    RefereeHand (BBox topImageCoords) :
        topImageCoords(topImageCoords) {}
    ~RefereeHand() {}
    BBox topImageCoords;

    bool operator== (const RefereeHand &other) const {
      return topImageCoords == other.topImageCoords;
    }

    template<class Archive>
    void serialize(Archive &ar, const unsigned int file_version) {
        ar & topImageCoords;
    }
};

struct RefereeHandsVisionInfo {

    RefereeHandsVisionInfo () :
        left(),
        right() {}

    RefereeHandsVisionInfo (RefereeHand left, RefereeHand right) :
        left(left),
        right(right)
        {}

    virtual ~RefereeHandsVisionInfo () {}
    RefereeHand left;
    RefereeHand right;
    bool operator== (const RefereeHandsVisionInfo &other) const {
      return left == other.left && right == other.right;
    }
    template<class Archive>
    void serialize(Archive &ar, const unsigned int file_version) {
        ar & left;
        ar & right;
    }
};


#endif