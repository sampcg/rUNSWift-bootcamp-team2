#include <iostream>
#include <opencv2/opencv.hpp>
#include "src/RefereeHandsDetector.hpp"

// int main() {
//     cv::VideoCapture cap(0); // Open the default camera
//     if (!cap.isOpened()) {
//         std::cerr << "Error: Could not open camera" << std::endl;
//         return -1;
//     }

//     RefereeHandsDetector detector;

//     cv::Mat frame, hsv, redMask, redRegions, gloveCandidates;
//     RefereeHandDetectorSettings settings;
//     settings.handMinHDistance = 50;
//     settings.handMaxHDistance = 90;
//     settings.handMinVDistance = 0;
//     settings.handMaxVDistance = 10;
//     settings.cropLeft = 0;
//     settings.cropRight = 0;
//     settings.cropTop = 0;
//     settings.cropBottom = 0;
//     settings.enabled = 1;
//     settings.area = 20;

//     while (true) {
//         cap >> frame; // Capture a new frame from the camera
//         if (frame.empty()) {
//             std::cerr << "Error: Could not read frame" << std::endl;
//             break;
//         }

//         cv::cvtColor(frame, hsv, cv::COLOR_BGR2HSV); // Convert to HSV

//         // Detect red regions and glove candidates using your detector
//         redMask = detector.detectRedRegions(hsv, settings);
//         // detector.detectGloveCandidates(redMask, redRegions, gloveCandidates);

//         // Show the images
//         cv::imshow("Original Image", frame);
//         cv::imshow("HSV Image", hsv);
//         cv::imshow("Red Mask", redMask);
//         // cv::imshow("Red Regions", redRegions);
//         // cv::imshow("Glove Candidates", gloveCandidates);

//         // Break the loop if 'q' is pressed
//         if (cv::waitKey(30) >= 0) {
//             break;
//         }
//     }

//     cap.release();
//     cv::destroyAllWindows();
//     return 0;
// }
uint16_t frameWidth = 1280;
uint16_t frameHeight = 960;
uint8_t frameRGBDensity = 3;
uint8_t frameYUVDensity = 2;
int main() {

    RefereeHandsDetector detector;

    cv::Mat frame, rgbMat, hsv, maskBGR;
    RefereeHandDetectorSettings settings;
    settings.handMinHDistance = 40;
    settings.handMaxHDistance = 200;
    settings.handMinVDistance = 0;
    settings.handMaxVDistance = 10;
    settings.cropLeft = 0;
    settings.cropRight = 0;
    settings.cropTop = 0;
    settings.cropBottom = 0;
    settings.enabled = 1;
    settings.area = 60;
    char filePath[1000];
    uint16_t fileNumber = 547;
    sprintf(filePath, "/Users/mikhailasavkin/Dev/rUNSWift/rUNSWift/utils/webnao/server/.temp/topFrames/%i.yuyv", fileNumber);
    FILE* frameFile = fopen(filePath, "r");
    if (frameFile == NULL) {
        std::cerr << "Error: Could not read frame file" << std::endl;
        return 1;
    }
    std::cout << "Loaded frame file" << std::endl;
    
    uint32_t topSize = frameWidth*frameHeight*frameYUVDensity;
    uint8_t* top =
            (uint8_t *) malloc(sizeof(uint8_t)*topSize);
    if(fread(top, topSize, 1, frameFile) != 1){
        free(top);
        std::cerr << "Error: Could not load frame into memory" << std::endl;
        return 2;
    }
    std::cout << "Loaded frame into memory" << std::endl;
    // cv::Mat rgbMat(frameHeight, frameWidth, CV_8UC3, top);
    cv::Mat yuvMat(frameHeight, frameWidth, CV_8UC2, top);
    cv::cvtColor(yuvMat, rgbMat, cv::COLOR_YUV2RGB_YUYV);
    cv::cvtColor(rgbMat, frame, cv::COLOR_RGB2BGR); // Convert to BRG

    auto [redMask, croppedRegion] = detector.isolateRedColor(rgbMat, settings);
    auto [glovePositions, redBoxes] = detector.findGlovePositions(redMask, settings);

    std::cout << "Found " << redBoxes.size() << "regions" << std::endl;
    std::cout << "Found " << glovePositions.size() << "glove pairs" << std::endl;
    cv::cvtColor(redMask, maskBGR, cv::COLOR_GRAY2BGR);

    while (true) {
        // read frame from file


        // cv::cvtColor(rgbMat, hsv, cv::COLOR_RGB2HSV); // Convert to HSV

        // // Detect red regions and glove candidates using your detector
        

        
        for (const BBox& redBox : redBoxes) {
            cv::Rect r = detector.BBoxToRect(redBox);
            cv::rectangle(maskBGR, r, CV_RGB(255, 0, 0), 2);
            cv::rectangle(frame, r, CV_RGB(255, 255, 255), 2);
        }
        for (const GloveCandidate& glovePair : glovePositions) {
            cv::rectangle(maskBGR, glovePair.left, CV_RGB(255, 204, 0), 2);
            cv::rectangle(maskBGR, glovePair.right, CV_RGB(255, 204, 0), 2);
        }
        // Show the images
        cv::imshow("Original Image", frame);
        // cv::imshow("HSV Image", hsv);
        cv::imshow("Red Mask", redMask);
        cv::imshow("Red Mask BGR", maskBGR);
        
        // cv::imshow("Red Regions", redRegions);
        // cv::imshow("Glove Candidates", gloveCandidates);

        // Break the loop if 'q' is pressed
        if (cv::waitKey(30) >= 0) {
            break;
        }
    }

    cv::destroyAllWindows();
    return 0;
}
