#ifndef PERCEPTION_VISION_CAMERA_NAOCAMERA_H_
#define PERCEPTION_VISION_CAMERA_NAOCAMERA_H_

#include <string>

#include "perception/vision/camera/Camera.hpp"
#include "perception/vision/camera/CameraDefinitions.hpp"
#include "perception/vision/camera/NaoCameraDefinitions.hpp"
#include "types/alvisiondefinitions.h"
#include "types/CameraSettings.hpp"

// from https://github.com/aldebaran/linux-aldebaran/blob/sbr/v4.4.86-rt99-baytrail/drivers/media/i2c/soc_camera/ov5640.c

#define AEC_STABLE_RANGE_HIGH           0x3A0F
#define AEC_STABLE_RANGE_LOW            0x3A10
#define AEC_HYSTERESIS_RANGE_HIGH       0x3A1B
#define AEC_HYSTERESIS_RANGE_LOW        0x3A1E

// The maximum gain and exposure values for a v6 camera.
#define V6_MAX_GAIN 1023
#define V6_MAX_EXPOSURE_ABSOLUTE 1048575
#define V6_MAX_BRIGHTNESS 255
#define V6_MAX_CONTRAST 255
#define V6_MAX_SATURATION 255

class Blackboard;

typedef enum {
   IO_METHOD_READ,
   IO_METHOD_MMAP,
   IO_METHOD_USERPTR,
   NUM_IO_METHODS
} IOMethod;

// only four frame buffers are supported on the Nao V3
#define NUM_FRAME_BUFFERS 4

#ifdef CTC_2_1
   #define VIDEO_TOP "/dev/video0"
   #define VIDEO_BOTTOM "/dev/video1"
#else
   #define VIDEO_TOP "/dev/video-top"
   #define VIDEO_BOTTOM "/dev/video-bottom"
#endif

/**
 * NaoCamera provides methods for the vision module to interact with the nao camera
 */
class NaoCamera : public Camera {
   public:
      /**
       * Constructor
       * opens the device, calibrates it, and sets it up for streaming
       *
       * @param filename the device or file to get images from
       * @param method the io method to use
       * @see IOMethod
       * @param format the format of the image
       * @see kVGA
       */
      NaoCamera(Blackboard *blackboard,
            const char *filename = VIDEO_TOP,
            const IOMethod method = IO_METHOD_MMAP,
            const int format = kVGA);

      /**
       * Destructor
       * closes the device
       */
      virtual ~NaoCamera();

      const uint8_t *get(const __u32 colourSpace);
      bool setControl(const uint32_t id, const int32_t value);

#ifndef CTC_2_1
      static void setAutoExposureTarget(int fd, uint8_t high);
#endif
      //Camera setting fields.
      CameraSettings cameraSettings;

   protected:
      /* Constructor that initialises fields but does not initialise
       * the camera. Used by deriving classes.
       */
      NaoCamera(Blackboard *blackboard, const char *filename, const IOMethod method,
                const int format,
                int dummy, const std::string cameraChoice);

      /**
       * Actually reads the frame from the camera (or does the appropriate ioctl
       * call if not using the read io method)
       *
       * @return true if successful, false otherwise (if asked to read again)
       */
      const uint8_t *read_frame();

      /**
       * Calibrate the camera.  Turn off the auto-corrections.
       *
       * @param CameraSettings The camera settings to apply.
       * @param bool whether the camera is the top camera
       */
      void applyCameraSettings(const CameraSettings settings, bool top);

      /**
       * Initialise this class
       */
      bool init_camera();

      /**
       * initializes the buffers for streaming i/o mode
       */
      void init_buffers(void);

      /**
       * set mmap to write to the image buffer
       */
      void init_mmap(void);

      /**
       * set mmap to write to the image buffer
       */
      void init_userp(void);

      /**
       * just clears the image buffer
       */
      void init_read(void);

      /**
       * prepares the buffers and device for capture
       */
      void start_capturing(void);

      /**
       * turns off the data stream
       */
      void stop_capturing(void);

      /**
       * cleans up the buffers
       */
      void uninit_buffers(void);

      /**
       * open the device
       */
      void open_device(void);

      /**
       * closes the device
       */
      void close_device(void);

      /**
       * file name for camera
       */
      std::string filename;

      /**
       * device file handle for camera.  -1 indicates uninitialised
       */
      int fd;

      /**
       * v4l device?  true indicates that fd points to a v4l device.
       * false probably indicates a regular file
       */
      bool v4lDeviceP;

      /**
       * the location and length for each saved frame
       */
      struct Buffer {
         /**
          * the location for each frame.  in kernel space in mmap mode
          */
         uint8_t *start;

         /**
          * the length for each frame
          */
         size_t length;
      };

      /**
       * stores the location and length for each posisble saved frame
       */
      Buffer buffers[NUM_FRAME_BUFFERS];

      /**
       * the actual number of frames we're saving.  device dependent
       */
      unsigned int n_buffers;

      /**
       * the io method we are using right now
       */
      IOMethod io;

      int format;

      struct v4l2_queryctrl queryctrl;
      struct v4l2_querymenu querymenu;

      /**
       * When dealing with mmap'ed buffers, we should
       * 1. Dequeue a buffer and write its pointer to the blackboard
       * 2. Allow perception to process the image
       * 3. Enqueue the buffer again so it can be reused
       *
       * Before we were not allowing perception to process the current frame
       * before enqueuing the buffer again, which could have potentially have
       * lead to split images
       */
      struct v4l2_buffer lastDequeued;

      // Keep track of the current camera choice as a human-readable string
      std::string cameraChoice;

   private:
      void readCameraSettings(Blackboard *blackboard);
      void readCameraSettings(Blackboard *blackboard,
              CameraSettings &settings, std::string cameraName) ;
};

#endif
