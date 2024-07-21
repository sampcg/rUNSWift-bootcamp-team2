#include "RefereeHandsDetector.hpp"
#include <opencv2/opencv.hpp>
#include <iostream>

Detector *newRefereeHandsDetector() {
   return new RefereeHandsDetector();
}

bool RefereeHandsDetector::isSensibleCoordinate(int coord) {
   return coord >= 0 && coord <= 10000;
}

bool RefereeHandsDetector::isSensiblePoint(const Point& point) {
   return isSensibleCoordinate(point.x()) && isSensibleCoordinate(point.y());
}

bool RefereeHandsDetector::isFullPoint(const Point& point) {
   return isSensiblePoint(point);
}

bool RefereeHandsDetector::isFullBox(const BBox& box) {
   return isFullPoint(box.a) && isFullPoint(box.b);
}

BBox RefereeHandsDetector::rectToBBox(const cv::Rect& r) {
   return { {r.x, r.y}, {r.x + r.width, r.y + r.height} };
}

RectangleRegion RefereeHandsDetector::rectangleRegionFromBBox(const BBox& box) {
   if (isFullBox(box)) {
      return {
         box.a.x(),
         box.a.y(),
         box.width(),
         box.height()
      };
   }
   return {0, 0, 0, 0};  // Invalid region
}

void RefereeHandsDetector::detect(const VisionInfoIn& info_in, VisionInfoMiddle& info_middle, VisionInfoOut& info_out) {
   if (info_middle.this_frame->top_frame_ == nullptr) {
      // Handle error: invalid input image
      return;
   }
   if (info_in.refereeHandDetectorSettings.enabled == 0) {
      // Detector is disabled, do nothing
      return;
   }
   cv::Mat src = yuyvToRgbMat(info_middle.this_frame->top_frame_, TOP_IMAGE_COLS, TOP_IMAGE_ROWS);
   auto [redMask, croppedRegion] = isolateRedColor(src, info_in.refereeHandDetectorSettings);
   auto glovePositions = findGlovePositions(redMask, info_in.refereeHandDetectorSettings);

   src.release();
   redMask.release();

   candidateRegions.clear();
   for (const auto& glove : glovePositions.first) {
      auto leftBox =  rectToBBox(glove.left);
      auto rightBox = rectToBBox(glove.right);
      if (isFullBox(leftBox) && isFullBox(rightBox)) {
         info_out.refereeHands.push_back(RefereeHandsVisionInfo(leftBox, rightBox));
      }
   }
   info_out.redRegions = glovePositions.second;
   info_out.cropRegion = rectToBBox(croppedRegion);
}

cv::Mat RefereeHandsDetector::yuyvToRgbMat(const uint8_t* yuyvArray, int width, int height) {
   cv::Mat rgbMat;
   try {
      cv::Mat yuvMat(height, width, CV_8UC2, (void*)yuyvArray);
      cv::cvtColor(yuvMat, rgbMat, cv::COLOR_YUV2RGB_YUYV);
   } catch (const cv::Exception& e) {
      std::cerr << "yuyvToRgbMat: " << e.what() << std::endl;
   }
   return rgbMat;
}

std::pair<cv::Mat, cv::Rect> RefereeHandsDetector::isolateRedColor(const cv::Mat& rgbFrame, const RefereeHandDetectorSettings& settings) {
   cv::Mat redMask;
   cv::Rect croppedRegion(settings.cropLeft, settings.cropTop, rgbFrame.cols - settings.cropLeft - settings.cropRight, rgbFrame.rows - settings.cropTop - settings.cropBottom);
   try {
      cv::Mat croppedFrame = rgbFrame(croppedRegion);
      cv::Mat hsvFrame;
      cv::cvtColor(croppedFrame, hsvFrame, cv::COLOR_RGB2HSV);

      cv::Mat lowerRed1(hsvFrame.rows, hsvFrame.cols, hsvFrame.type(), cv::Scalar(0, 120, 50));
      cv::Mat upperRed1(hsvFrame.rows, hsvFrame.cols, hsvFrame.type(), cv::Scalar(18, 255, 255));
      cv::Mat mask1;
      cv::inRange(hsvFrame, lowerRed1, upperRed1, mask1);

      cv::Mat lowerRed2(hsvFrame.rows, hsvFrame.cols, hsvFrame.type(), cv::Scalar(170, 120, 50));
      cv::Mat upperRed2(hsvFrame.rows, hsvFrame.cols, hsvFrame.type(), cv::Scalar(180, 255, 255));
      cv::Mat mask2;
      cv::inRange(hsvFrame, lowerRed2, upperRed2, mask2);

      cv::bitwise_or(mask1, mask2, redMask);

   } catch (const cv::Exception& e) {
      std::cerr << "isolateRedColor: " << e.what() << std::endl;
   }
   return std::make_pair(redMask, croppedRegion);
}

std::pair<std::vector<GloveCandidate>, std::vector<BBox>> RefereeHandsDetector::findGlovePositions(const cv::Mat& redMask, const RefereeHandDetectorSettings& settings) {
   std::vector<GloveCandidate> gloveCandidates;
   std::vector<BBox> redBoxes;
   try {
      std::vector<std::vector<cv::Point>> contours;
      cv::findContours(redMask, contours, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);

      std::vector<cv::Rect> boxes;
      for (const auto& contour : contours) {
         cv::Rect boundingBox = cv::boundingRect(contour);
         if (boundingBox.area() >= settings.area) {
               boundingBox.x += settings.cropLeft;
               boundingBox.y += settings.cropTop;
               boxes.push_back(boundingBox);
         }
      }

      for (size_t i = 0; i < boxes.size(); ++i) {
         for (size_t j = i + 1; j < boxes.size(); ++j) {
            const cv::Rect& box1 = boxes[i];
            const cv::Rect& box2 = boxes[j];

            int deltaX = std::abs((box1.x + box1.width / 2) - (box2.x + box2.width / 2));
            int deltaY = std::abs((box1.y + box1.height / 2) - (box2.y + box2.height / 2));

            if (deltaX > settings.handMinHDistance &&
               deltaX < settings.handMaxHDistance &&
               deltaY > settings.handMinVDistance &&
               deltaY < settings.handMaxVDistance) {
               gloveCandidates.push_back({box1, box2});
            }
         }
      }

      for (const auto& box : boxes) {
         redBoxes.push_back(rectToBBox(box));
      }
      // BBox testRedBox1 = BBox(Point(1,2), Point(3,4));
      // BBox testRedBox2 = BBox(Point(10,20), Point(30,40));
      // redBoxes.push_back(testRedBox1);
      // gloveCandidates.push_back({cv::Rect(1,2,3,4), cv::Rect(10,20,30,40)});
   } catch (const cv::Exception& e) {
      std::cerr << "findGlovePositions: " << e.what() << std::endl;
   }


   return std::make_pair(gloveCandidates, redBoxes);
}
