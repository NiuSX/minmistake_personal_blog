# 10 版本选型与常见实践坑

本篇用于补齐前面笔记中容易被忽略的“工程边界”：ROS 2、Gazebo、`ros_gz`、`ros2_control` 的版本组合，Gazebo Classic 到 Gazebo Sim 的迁移差异，以及桥接、仿真时间、控制器和传感器调试中的常见问题。

最后资料核对：2026-06-13。主要依据 Gazebo Harmonic、ROS 2 Jazzy、SDFormat、ros2_control 官方文档，并参考中文社区实践记录。

## 推荐版本组合

新项目优先使用这一组：

| 层级 | 推荐 |
| --- | --- |
| 操作系统 | Ubuntu 24.04 Noble |
| ROS 2 | Jazzy Jalisco |
| Gazebo | Gazebo Harmonic |
| ROS-Gazebo 集成 | `ros-jazzy-ros-gz` |
| 控制仿真 | `gz_ros2_control` |

原因：

- Gazebo 官方安装文档把 ROS 2 Jazzy 与 Gazebo Harmonic 标为推荐组合。
- ROS 2 Jazzy 开始，Gazebo 可通过 ROS 软件源中的 vendor packages 集成，初学者通常直接安装 `ros-${ROS_DISTRO}-ros-gz` 即可。
- Gazebo Harmonic 是 LTS 版本，文档和包生态比非 LTS 组合更稳定。

建议安装命令：

```bash
sudo apt update
sudo apt install ros-jazzy-ros-gz
sudo apt install ros-jazzy-gz-ros2-control
```

如果使用其他 ROS 2 发行版，不要只凭“能 apt install”判断兼容。先查 Gazebo 官方兼容表，再决定是用默认配对、非官方包，还是源码编译。

## Gazebo Classic 和 Gazebo Sim 不要混着学

很多中文教程仍然使用 Gazebo Classic，也就是常见的 `gazebo`、`gazebo_ros_pkgs`、`libgazebo_ros_diff_drive.so`、`gazebo_ros2_control` 路线。Gazebo Sim 通常使用 `gz sim`、`ros_gz`、`gz_ros2_control`。

| 项目 | Gazebo Classic | Gazebo Sim / Harmonic |
| --- | --- | --- |
| 常见命令 | `gazebo` | `gz sim` |
| ROS 集成 | `gazebo_ros_pkgs` | `ros_gz` |
| Topic 查看 | ROS 话题和 Gazebo transport 混合教程较多 | `gz topic -l` 与 `ros2 topic list` 分开看 |
| 模型/世界 | URDF + Classic 插件，SDF world | SDF 更核心，URDF 可 spawn 或转换 |
| 控制插件 | `gazebo_ros2_control` | `gz_ros2_control` |

判断教程是否过期，可以先看 4 个关键词：

- 命令是 `gazebo` 还是 `gz sim`；
- 桥接包是 `ros_ign_bridge`、`ros_gz_bridge` 还是 `gazebo_ros`；
- 插件名是否包含 `libgazebo_ros_*`；
- 安装命令是否要求 `gazebo11`。

如果你用的是 Jazzy + Harmonic，不建议照搬 `gazebo11` 或 Classic 插件配置。能启动不代表链路正确，后续经常会在控制器、传感器或模型加载阶段出错。

## `ros_gz_bridge` 的核心心智模型

Gazebo Sim 有自己的 transport topic，ROS 2 也有自己的 topic。`ros_gz_bridge` 的职责是把两边的消息按类型映射起来。

常见桥接格式：

```bash
ros2 run ros_gz_bridge parameter_bridge \
  /clock@rosgraph_msgs/msg/Clock[gz.msgs.Clock
```

方向符号要看清：

| 写法 | 含义 |
| --- | --- |
| `@` | 双向桥接，前提是消息类型支持双向转换 |
| `[` | Gazebo 到 ROS 2 |
| `]` | ROS 2 到 Gazebo |

常见例子：

```bash
# Gazebo /clock -> ROS 2 /clock
ros2 run ros_gz_bridge parameter_bridge /clock@rosgraph_msgs/msg/Clock[gz.msgs.Clock

# Gazebo IMU -> ROS 2 IMU
ros2 run ros_gz_bridge parameter_bridge /imu@sensor_msgs/msg/Imu[gz.msgs.IMU

# Gazebo LaserScan -> ROS 2 LaserScan
ros2 run ros_gz_bridge parameter_bridge /scan@sensor_msgs/msg/LaserScan[gz.msgs.LaserScan
```

排查时必须同时看两边：

```bash
gz topic -l
gz topic -i -t /scan
ros2 topic list
ros2 topic info /scan
ros2 topic hz /scan
```

如果 Gazebo 侧有 topic、ROS 2 侧没有，优先检查 bridge 是否启动、消息类型是否写错、方向符号是否写反。如果 ROS 2 侧有 topic 但 RViz 不显示，优先检查 `frame_id` 是否在 TF 树里、fixed frame 是否选对、时间戳是否使用仿真时间。

## 仿真时间是上层算法的基础

Gazebo 发布的是仿真时间。ROS 2 节点要和仿真一致，通常需要：

```yaml
use_sim_time: true
```

最低检查项：

```bash
ros2 topic echo /clock
ros2 param get /robot_state_publisher use_sim_time
ros2 param get /rviz use_sim_time
```

常见现象：

| 现象 | 可能原因 |
| --- | --- |
| RViz 显示 TF extrapolation 错误 | 部分节点用系统时间，部分节点用仿真时间 |
| Gazebo 暂停后算法不动 | 依赖仿真时间推进，暂停时 `/clock` 不再前进 |
| 传感器有数据但 RViz 不刷新 | 时间戳和 fixed frame 对不上 |
| bag 回放或导航异常 | `/clock`、`use_sim_time`、消息时间戳没有统一 |

实践建议：只要链路中有 Gazebo，就把 RViz、robot_state_publisher、Nav2、SLAM、MoveIt 等节点的 `use_sim_time` 统一纳入 launch 参数，不要手动零散设置。

## `ros2_control` 调试顺序

控制链路不要从 `/cmd_vel` 开始猜。按下面顺序查：

```mermaid
flowchart LR
  A[URDF ros2_control 标签] --> B[gz_ros2_control 插件加载]
  B --> C[controller_manager]
  C --> D[controller active]
  D --> E[command interface]
  E --> F[Gazebo joint]
  F --> G[joint_states / odom]
```

最小检查命令：

```bash
ros2 control list_hardware_interfaces
ros2 control list_controllers
ros2 control list_controller_types
ros2 topic echo /cmd_vel
ros2 topic echo /joint_states
```

常见问题：

- URDF 里 joint 名称和 `controllers.yaml` 不一致；
- `command_interfaces` 与控制器需要的不一致，例如差速控制器需要速度接口；
- 控制器只是 loaded，没有 active；
- Gazebo 处于暂停状态；
- 左右轮列表写反，导致旋转方向或里程计异常；
- wheel radius、wheel separation 单位或数值错误；
- 同时加载 Gazebo 原生运动插件和 `ros2_control` 控制同一组关节，导致控制来源冲突。

实用判断：如果 `/cmd_vel` 有数据但 `/joint_states` 不变，问题通常在控制器到 Gazebo joint 之间；如果 `/joint_states` 在变但机器人不动，优先看碰撞、摩擦、轮子接触、关节轴和模型是否被固定。

## URDF、SDF 和 Gazebo 扩展的边界

URDF 适合描述机器人结构树，SDF 适合描述仿真世界和更完整的仿真属性。

| 内容 | 优先放哪 |
| --- | --- |
| link/joint 结构 | URDF/Xacro |
| visual/collision/inertial | URDF/Xacro |
| 参数复用和宏 | Xacro |
| world、光照、地面、障碍物 | SDF world |
| 物理引擎参数 | SDF world |
| Gazebo 传感器和插件 | 视项目风格，可放 URDF 的 Gazebo 扩展或 SDF |
| 多机器人场景 | SDF world + launch namespace |

不要把所有东西都塞进一个 URDF。随着项目变复杂，推荐拆成：

```text
my_robot_description/
  urdf/
    robot.urdf.xacro
    base.xacro
    sensors.xacro
    ros2_control.xacro
  meshes/
  rviz/

my_robot_bringup/
  launch/
  config/
    controllers.yaml
    bridges.yaml

my_robot_sim/
  worlds/
  launch/
```

## 传感器调试重点

传感器调试分三层：

1. Gazebo 是否真的产生数据；
2. bridge 是否把数据带到 ROS 2；
3. ROS 2 算法或 RViz 是否能解释这些数据。

检查命令：

```bash
gz topic -l
gz topic -i -t /scan
ros2 topic hz /scan
ros2 topic echo /scan --once
ros2 run tf2_ros tf2_echo base_link laser_link
```

常见坑：

- Gazebo topic 名称和 bridge 里的名称不一致；
- 消息类型写错，例如 LaserScan、PointCloud2、Image、CameraInfo 混淆；
- `frame_id` 没有对应 TF；
- 相机只有 image，没有 camera_info，导致视觉算法或 RViz 插件异常；
- 传感器更新频率过高，仿真性能下降，实际消息频率反而不稳定；
- 噪声模型完全为 0，算法在仿真里表现过于理想，迁移到真机后不稳定。

## 一套稳定的最小验收流程

每做完一个阶段，只验收一个层次：

1. Xacro 能展开：

```bash
ros2 run xacro xacro robot.urdf.xacro > /tmp/robot.urdf
```

2. URDF 能解析：

```bash
check_urdf /tmp/robot.urdf
```

3. TF 能连通：

```bash
ros2 run tf2_tools view_frames
```

4. Gazebo 能看到模型和 topic：

```bash
gz sim your_world.sdf
gz topic -l
```

5. ROS 2 能看到桥接后的 topic：

```bash
ros2 topic list
ros2 topic echo /clock --once
```

6. 控制器 active：

```bash
ros2 control list_controllers
```

7. 小速度命令方向正确：

```bash
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.05}, angular: {z: 0.0}}" -r 10
```

如果某一步失败，只回退到当前层排查，不要同时改模型、world、bridge、controller 和算法。

## 社区经验提炼

中文社区实践文章常见的经验可以归纳为：

- 版本不匹配是安装和桥接失败的高频原因，尤其是把 Humble、Jazzy、Gazebo Classic、Gazebo Harmonic 的教程混用。
- `ros_gz_bridge` 的消息类型和方向符号必须精确，桥接失败不一定有明显报错。
- `ros2_control` 和 Gazebo 插件不要重复控制同一批关节；控制链路越清晰，越容易定位问题。
- 学习阶段先用简单几何体和可计算惯性，复杂 mesh 应该后置。
- 记录环境版本、启动命令和最小复现，比只保存最终配置更有价值。

社区文章适合用来补充实战现象和排错路径；涉及版本兼容、安装组合、API 名称时，应以官方文档为准。

## 参考资料

- Official: Gazebo Harmonic - Installing Gazebo with ROS：https://gazebosim.org/docs/harmonic/ros_installation/
- Official: Gazebo Harmonic - ROS 2 integration overview：https://gazebosim.org/docs/harmonic/ros2_overview/
- Official: gz_ros2_control Jazzy documentation：https://control.ros.org/jazzy/doc/gz_ros2_control/doc/index.html
- Official: ROS 2 Jazzy URDF tutorials：https://docs.ros.org/en/jazzy/Tutorials/Intermediate/URDF/URDF-Main.html
- Official: SDFormat specification：https://sdformat.org/spec/
- Official: ros_gz_bridge README：https://github.com/gazebosim/ros_gz/blob/ros2/ros_gz_bridge/README.md
- Official: Launch Gazebo from ROS 2：https://gazebosim.org/docs/latest/ros2_launch_gazebo/
- Official: TurtleBot3 Simulation manual：https://emanual.robotis.com/docs/en/platform/turtlebot3/simulation/
- Community: Gazebo 通过桥接实现 ROS2 集成：https://blog.csdn.net/chuliling0446/article/details/135310744
- Community: Gazebo Harmonic 和 ROS2 Jazzy 安装和测试：https://blog.csdn.net/ZhangRelay/article/details/141426370
- Community: 实战：ros 机器人运行不稳定，也许是 use_sim_time 没有设置对：https://blog.csdn.net/m0_73694897/article/details/132263789
- Community: Gazebo Harmonic + Jazzy 集成问题讨论：https://robotics.stackexchange.com/questions/112676/issue-with-ros2-jazzy-and-gazebo-harmonic-ros-integration
- Community: Open Robotics Discourse - TurtleBot3 Jazzy/Harmonic examples：https://discourse.openrobotics.org/t/tb3-new-turtlebot3-examples-are-here/43239
