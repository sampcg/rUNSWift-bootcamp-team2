# Running a demo

## Prerequisites
1. Install dependencies by running `scripts/install-dependencies.sh` in `robot_ws` directory
2. Build workspace by running `colcon build` in `robot_ws` directory
3. In every terminal do `source robot_ws/install/setup.bash` or add this command to your ~/.bashrc

## Prepare a real or a simulated robot

### Simulated robot

#### Prerequisites
1. Install SimSpark by running `setup-simspark.sh``

#### Running
1. In one terminal run `rcsoccersim3d`
2. In another, run `ros2 run rcss3d_nao rcss3d_nao`

### Real robot
#### Prerequisites
1. Prepare an image with ROS2 and lola package using bin/setup-naoimage.sh
2. Flash a robot with the image

#### Running
1. Run lola node on a robot via ssh `ros2 run nao_lola nao_lola`
2. On the laptop, check if you can see topics published by a robot `ros2 topic list`
## Running the animation from a pos file
1. In one terminal, run the node specifying the pos file to play
```
ros2 run naosoccer_pos_action naosoccer_pos_action linear --ros-args -p "file:=src/naosoccer_pos_action/pos/test_head.pos"
```
2. In a second terminal launch the animation by running
```
ros2 topic pub --once start_pos_action std_msgs/msg/Bool '{data: true}'
```





