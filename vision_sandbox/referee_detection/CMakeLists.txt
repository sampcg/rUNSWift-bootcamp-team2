cmake_minimum_required(VERSION 3.10)
project(RefereeHandsDetector)

set(CMAKE_CXX_STANDARD 17)

set(OpenCV_DIR /usr/local/opt/opencv) # Adjust the path to match your OpenCV installation
set(Boost_DIR /usr/local/opt/boost/include) # Adjust the path to match your OpenCV installation

find_package(OpenCV REQUIRED)

include_directories(${OpenCV_INCLUDE_DIRS})
include_directories(${Boost_DIR})
include_directories(include)
include_directories(../../robot)

add_executable(RefereeHandsDetector src/RefereeHandsDetector.cpp ../../robot/types/RefereeHandDetectorSettings.cpp main.cpp)

target_link_libraries(RefereeHandsDetector ${OpenCV_LIBS})
