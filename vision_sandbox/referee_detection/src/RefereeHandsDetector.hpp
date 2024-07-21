#ifndef PERCEPTION_VISION_DETECTOR_REFEREEHANDSDETECTOR_H_
#define PERCEPTION_VISION_DETECTOR_REFEREEHANDSDETECTOR_H_

#include "../../../robot/types/BBox.hpp"
#include <opencv2/opencv.hpp>
#include "types/RefereeHandDetectorSettings.hpp"

struct RectangleRegion {
    int left;
    int top;
    int width;
    int height;
};

struct GloveCandidate {
    cv::Rect left;
    cv::Rect right;
};

class RefereeHandsDetector
{

public:

    /*
    Constructor
    */
    RefereeHandsDetector() {}

    /*
    Detects referee's hands by making use of the red gloves detection
     */
    // void detect(
    //     const VisionInfoIn& info_in,
    //     VisionInfoMiddle& info_middle,
    //     VisionInfoOut& info_out);
    cv::Rect BBoxToRect(const BBox& box);
    cv::Mat detectRedRegions(const cv::Mat& hsvFrame, const RefereeHandDetectorSettings& settings);
    std::vector<cv::Rect> detectGloveCandidates(const cv::Mat& redMask, const RefereeHandDetectorSettings& settings);
    std::vector<GloveCandidate> detectGloves(const std::vector<cv::Rect>& boxes, const RefereeHandDetectorSettings& settings);
    std::pair<cv::Mat, cv::Rect> isolateRedColor(const cv::Mat& rgbFrame, const RefereeHandDetectorSettings& settings);
    std::pair<std::vector<GloveCandidate>, std::vector<BBox>> findGlovePositions(const cv::Mat& redMask, const RefereeHandDetectorSettings& settings);
private:
    std::vector<BBox> candidateRegions;
    BBox croppedRegion;

    cv::Mat yuyvToRgbMat(const uint8_t* yuyvArray, int width, int height);
    
    
    bool isSensibleCoordinate(int coord);
    bool isSensiblePoint(const Point& point);
    bool isFullPoint(const Point& point);
    bool isFullBox(const BBox& box);
    BBox rectToBBox(const cv::Rect& r);
    RectangleRegion rectangleRegionFromBBox(const BBox& box);
};

#endif
