#ifndef VISION_INFO_OUT_HPP
#define VISION_INFO_OUT_HPP

#include <vector>

#include "perception/vision/camera/CameraToRR.hpp"
#include "perception/vision/VisionDefinitions.hpp"
#include "types/BallInfo.hpp"
#include "types/FieldBoundaryInfo.hpp"
#include "types/FieldFeatureInfo.hpp"
#include "types/RobotVisionInfo.hpp"
#include "perception/vision/Region/Region.hpp"
#include "types/RefereeHandsVisionInfo.hpp"

struct VisionInfoOut {
    std::vector<BallInfo> balls;
    std::vector<FieldBoundaryInfo> boundaries;
    std::vector<FieldFeatureInfo> features;
    std::vector<RobotVisionInfo> robots;
    std::vector<RefereeHandsVisionInfo> refereeHands;
    std::vector<BBox> redRegions;
    BBox cropRegion;

    const CameraToRR *cameraToRR;

    int topStartScanCoords[TOP_IMAGE_COLS];
    int botStartScanCoords[BOT_IMAGE_COLS];
    std::vector<RegionI> regions;
};

#endif
