import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
from geometry_msgs.msg import PointStamped;
from image_geometry import PinholeCameraModel;
from sensor_msgs.msg import CameraInfo;
import cv2
import numpy as np

class ImageSubscriber(Node):

    def __init__(self):
        super().__init__('image_subscriber')
        self.subscription = self.create_subscription(Image, '/image_raw', self.image_callback, 10)
        self.info_subscription = self.create_subscription(CameraInfo, '/camera_info', self.camera_info_callback, 10)
        self.publisher = self.create_publisher(PointStamped, '/some_ball_pos', 10)
        self.subscription  # prevent unused variable warning
        self.cv_bridge = CvBridge()
        self.camera_model = PinholeCameraModel()

        self.camera_model_initialised = False
    def camera_info_callback(self, msg:CameraInfo):
        self.camera_model.fromCameraInfo(msg)
        self.camera_model_initialised = True
    def publish_position(self, center_x, center_y, radius):
        # camera_matrix = np.array([[115.173267, 0, 319.499721],
        #                    [0, 204.579178, 239.502146],
        #                    [0, 0, 1]])
        # rectification_matrix = np.eye(3)  # Identity matrix if not rectified
        # distortion_coefficients = np.array([-0.028962, 0.000078, 0.003954, 0.015862, 0.000000])  # Distortion coefficients
        # fx = 106.329117
        # fy = 311.632446
        # cx = 294.965354
        # cy = 112.653150
        # projection_matrix = np.array([[fx, 0, cx, 0],
        #                             [0, fy, cy, 0],
        #                             [0, 0, 1, 0]])

        # # Pixel coordinates
        # pixel_x = center_x  # Replace with your pixel x-coordinate
        # pixel_y = center_y  # Replace with your pixel y-coordinate

        # # Depth (distance to the object from the camera optical frame)
        # distance = 0.1  # Replace with your distance in meters
        # print(pixel_x, pixel_y)
        # # Normalize the pixel coordinates
        # # normalized_pixel = np.array([[(pixel_x - cx) / fx, (pixel_y - cy) / fy, 1.0]])
        # pixel_coordinates = np.array([[pixel_x, pixel_y, 1.0]], dtype=np.float32)

        # print(pixel_coordinates)
        # # Undistort the normalized pixel coordinates
        # undistorted_pixel = cv2.undistortPoints(pixel_coordinates, camera_matrix, distortion_coefficients)

        # # Calculate the 3D point in camera optical frame
        # x = undistorted_pixel[0, 0] * distance
        # y = undistorted_pixel[0, 1] * distance
        # z = distance

        # # Transform the 3D point to world coordinates
        if (not self.camera_model_initialised):
            print(',')
            return
        print('.')
        ball_info_msg = PointStamped()
        ball_info_msg.header.stamp = self.get_clock().now().to_msg()
        ball_info_msg.header.frame_id = "CameraTop_optical_frame"
        ball_info_msg.point.x, ball_info_msg.point.y, ball_info_msg.point.z = self.camera_model.projectPixelTo3dRay((center_x, center_y))

        ball_info_msg.header.stamp 
        self.publisher.publish(ball_info_msg)
        # self.get_logger().info('Published 3D coordinates')
        
    def image_callback(self, msg):
        try:
            # print('_')
            # Convert ROS Image message to OpenCV image
            cv_image = self.cv_bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Resize the image
            target_width = 300
            ratio = target_width / cv_image.shape[1]
            resized_image = cv2.resize(cv_image, (target_width, int(cv_image.shape[0] * ratio)))

            # Convert the resized image to HSV color space
            hsv_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2HSV)

            # Define initial values for orange color range
            lower_orange = np.array([5, 50, 50])
            upper_orange = np.array([15, 255, 255])
                        # Create a mask for the orange color
            mask = cv2.inRange(hsv_image, lower_orange, upper_orange)

            # Use Hough Circle Transform to detect circles
            circles = cv2.HoughCircles(mask, cv2.HOUGH_GRADIENT, dp=2.25, minDist=200, param1=20, param2=45, minRadius=4, maxRadius=60)
            # print(circles)
            # FInd the largest Orange Circle in the image
            if circles is not None:
                circles = np.uint16(np.around(circles))
                for circle in circles[0, :]:
                    center = (circle[0], circle[1])
                    radius = circle[2]
                    self.publish_position(circle[0], circle[1], radius)
                    # cv2.circle(resized_image, center, radius, (0, 255, 0), 2)
            

            # cv2.imshow('USB Camera Feed', resized_image)
            # cv2.waitKey(1)

        except Exception as e:
            self.get_logger().info(f"Error: {e}")

def main(args=None):
    rclpy.init(args=args)

    image_subscriber = ImageSubscriber()

    rclpy.spin(image_subscriber)

    image_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()