#ifndef PERCEPTION_VISION_DETECTOR_REFEREEHANDSDETECTOR_H_
#define PERCEPTION_VISION_DETECTOR_REFEREEHANDSDETECTOR_H_

#include "DetectorInterface.hpp"
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

class RefereeHandsDetector : public Detector
{

public:

    /*
    Constructor
    */
    RefereeHandsDetector() {}

    /*
    Detects referee's hands by making use of the red gloves detection
     */
    void detect(
        const VisionInfoIn& info_in,
        VisionInfoMiddle& info_middle,
        VisionInfoOut& info_out);
private:
    std::vector<BBox> candidateRegions;
    BBox croppedRegion;

    cv::Mat yuyvToRgbMat(const uint8_t* yuyvArray, int width, int height);
    std::pair<cv::Mat, cv::Rect> isolateRedColor(const cv::Mat& rgbFrame, const RefereeHandDetectorSettings& settings);
    std::pair<std::vector<GloveCandidate>, std::vector<BBox>> findGlovePositions(const cv::Mat& redMask, const RefereeHandDetectorSettings& settings);

    bool isSensibleCoordinate(int coord);
    bool isSensiblePoint(const Point& point);
    bool isFullPoint(const Point& point);
    bool isFullBox(const BBox& box);
    BBox rectToBBox(const cv::Rect& r);
    RectangleRegion rectangleRegionFromBBox(const BBox& box);
};

#endif
