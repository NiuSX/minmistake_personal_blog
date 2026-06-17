# 04 Xacro 实战

<!-- lecture-notes:integrated-v2 -->

## 讲义导读：把机器人当成可验证的闭环系统

这一章讲的是 **04 Xacro 实战**。阅读时不要只记命令、参数或算法名，而要把它放进机器人闭环：模型是否描述真实机器人，坐标系和时间是否一致，传感器数据是否可信，状态估计是否稳定，规划结果是否可执行，控制命令是否安全，仿真和真机差异是否被验证。机器人学习的关键不是让 demo 偶然跑通，而是能解释每个模块为什么工作、怎样失败、如何调试。

### 一句话先懂

机器人仿真不是画一个模型好看，而是让几何、惯性、碰撞、传感器、控制接口和物理环境足够接近真实系统。

### 通俗类比

可以把机器人想成一个会移动、会感知、会决策的闭环系统：传感器像眼睛和耳朵，TF 和状态估计像方向感，地图像环境记忆，规划器像路线顾问，控制器像肌肉和反射，仿真像训练场，安全机制像刹车和护栏。任何一环的单位、方向、时间或边界错了，整机表现都会变差。

类比只能帮助建立直觉。回到工程上，要把每个模块写成输入、输出、坐标系、时间戳、参数、频率、误差来源和验收指标。只有这些信息清楚，才知道问题是来自硬件、驱动、模型、通信、算法、控制还是环境。

### 本章学习主线

1. **模型和坐标**：先确认 URDF/SDF、TF、外参、单位和 REP 103/105 约定是否正确。
2. **数据和时间**：检查 Topic、QoS、Header、frame_id、timestamp、use_sim_time 和 rosbag 回放是否一致。
3. **算法和接口**：弄清输入数据是什么，输出命令或估计是什么，中间参数控制什么物理或数学含义。
4. **闭环和反馈**：观察命令是否被执行，执行结果是否反馈到 odom、TF、状态估计或任务层。
5. **失败和安全**：记录不动、乱动、漂移、震荡、穿墙、丢图、延迟、碰撞和失联时的排查顺序。
6. **仿真到真机**：把仿真中默认理想化的部分逐项换成真实约束，例如摩擦、延迟、噪声、限幅和电源。

### 概念怎么学才不容易忘

遇到机器人概念时，建议按 白话作用 -> ROS 2 接口 -> 坐标时间 -> 最小实验 -> 典型故障 -> 调试命令 六步学习。比如学习 TF，不只背 map、odom、base_link，还要知道谁发布、频率多少、时间戳是否能查到；学习控制器，不只看 cmd_vel 是否发布，还要看底盘是否执行、odom 是否反馈、限速和急停是否生效。

### 最小实践任务

建立一个两轮差速小车 URDF/Xacro，接入 ros2_control 和 Gazebo Sim，检查 TF、joint、collision、inertial、传感器数据和 cmd_vel 到 odom 的闭环。

实践时要保留失败记录：TF 断裂、QoS 不匹配、use_sim_time 忘开、frame_id 写错、惯性参数不合理、footprint 偏小、传感器外参偏差、控制频率不足。机器人系统的经验很大一部分来自这些可复现的错误。

### 读完本章应该能做到

- 用自己的话解释本章主题在机器人闭环中的位置。
- 画出最小数据流，标明 Topic、Service、Action、TF、参数和启动文件。
- 说出至少三个常见失败现象，并给出对应的检查命令或观测信号。
- 解释关键参数的物理意义，而不是只复制默认 YAML。
- 能说明 URDF、Xacro、SDF、Gazebo Sim、ros2_control、传感器插件和仿真时间之间的关系，并知道仿真到真机差异来自哪里。

> 本节是讲义化阅读入口，后续正文中的 ROS 2 接口、坐标系、算法、仿真、控制和调试内容都应围绕这条机器人闭环来理解。
Xacro 是 XML Macros 的缩写，用来生成 URDF。URDF 本身是 XML，重复内容很多；Xacro 可以定义变量、宏、表达式和文件包含，让机器人模型更容易维护。

## 本篇学习目标

学完本篇后，你应该能：

- 把重复 URDF 片段抽成 Xacro macro；
- 用 property 管理尺寸、质量、颜色和开关；
- 用 include 拆分材料、惯性、传感器和控制配置；
- 生成 URDF 并用检查工具验证结果，而不是只看 Xacro 源文件。

## 为什么要用 Xacro

假设一个小车有左右两个轮子。纯 URDF 需要重复写两份 link、visual、collision、inertial、joint。以后轮子半径改了，你要改多个位置，容易漏。

Xacro 可以：

- 把尺寸定义成变量；
- 把重复结构写成宏；
- 把材料、惯性、传感器拆成多个文件；
- 用表达式计算位置；
- 根据参数启用或禁用模块。

Xacro 的处理链路：

```mermaid
flowchart LR
  A[*.urdf.xacro] --> B[xacro 展开]
  B --> C[URDF XML]
  C --> D[robot_description]
  D --> E[robot_state_publisher / Gazebo / RViz]
```

调试时要记住：真正被下游工具消费的是展开后的 URDF，不是你写的 Xacro 源文件。

## 文件开头

典型 Xacro 文件：

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="mini_bot">
  ...
</robot>
```

必须声明 `xmlns:xacro`，否则 Xacro 标签无法识别。

## property

定义变量：

```xml
<xacro:property name="base_length" value="0.4"/>
<xacro:property name="base_width" value="0.3"/>
<xacro:property name="base_height" value="0.1"/>
<xacro:property name="wheel_radius" value="0.05"/>
```

使用变量：

```xml
<box size="${base_length} ${base_width} ${base_height}"/>
```

表达式：

```xml
<origin xyz="0 ${base_width / 2 + wheel_width / 2} ${-base_height / 2 + wheel_radius}"/>
```

建议：

- 尺寸、质量、颜色都放顶部；
- 变量名明确，不要用 `a`、`b`；
- 表达式不要过度复杂；
- 复杂公式可以拆成多个 property。

## macro

定义宏：

```xml
<xacro:macro name="box_inertial" params="mass x y z">
  <inertial>
    <mass value="${mass}"/>
    <inertia
      ixx="${mass / 12.0 * (y*y + z*z)}"
      ixy="0" ixz="0"
      iyy="${mass / 12.0 * (x*x + z*z)}"
      iyz="0"
      izz="${mass / 12.0 * (x*x + y*y)}"/>
  </inertial>
</xacro:macro>
```

调用宏：

```xml
<xacro:box_inertial mass="2.0" x="${base_length}" y="${base_width}" z="${base_height}"/>
```

宏常用于：

- 惯性公式；
- 左右轮；
- 相机；
- 雷达；
- 材料；
- 传动接口；
- Gazebo 插件配置。

## 条件

可以用参数控制是否启用某些部件：

```xml
<xacro:arg name="use_lidar" default="true"/>

<xacro:if value="$(arg use_lidar)">
  <link name="laser_link"/>
  <joint name="laser_joint" type="fixed">
    <parent link="base_link"/>
    <child link="laser_link"/>
  </joint>
</xacro:if>
```

也可以用 `unless`：

```xml
<xacro:unless value="$(arg use_camera)">
  <!-- 不使用相机时的替代内容 -->
</xacro:unless>
```

## include

拆分文件：

```xml
<xacro:include filename="$(find my_robot_description)/urdf/materials.xacro"/>
<xacro:include filename="$(find my_robot_description)/urdf/inertial_macros.xacro"/>
<xacro:include filename="$(find my_robot_description)/urdf/sensors.xacro"/>
```

常见拆分：

```text
urdf/
  robot.urdf.xacro
  materials.xacro
  inertial_macros.xacro
  wheels.xacro
  sensors.xacro
  ros2_control.xacro
```

主文件只保留结构，细节交给子文件。

拆分建议：

| 文件 | 建议内容 | 不建议放 |
| --- | --- | --- |
| `robot.urdf.xacro` | 主结构、include、顶层参数 | 大量重复 link 细节 |
| `materials.xacro` | 颜色和材质 | 关节或传感器逻辑 |
| `inertial_macros.xacro` | 常用惯性公式 | 具体机器人结构 |
| `sensors.xacro` | LiDAR、IMU、camera 宏 | 底盘控制器参数 |
| `ros2_control.xacro` | control interface 片段 | visual/collision 几何 |

## 轮子宏示例

```xml
<xacro:macro name="wheel" params="prefix y_sign">
  <link name="${prefix}_wheel_link">
    <visual>
      <origin rpy="1.5708 0 0"/>
      <geometry>
        <cylinder radius="${wheel_radius}" length="${wheel_width}"/>
      </geometry>
      <material name="dark_gray"/>
    </visual>
    <collision>
      <origin rpy="1.5708 0 0"/>
      <geometry>
        <cylinder radius="${wheel_radius}" length="${wheel_width}"/>
      </geometry>
    </collision>
    <xacro:cylinder_inertial mass="${wheel_mass}" radius="${wheel_radius}" length="${wheel_width}"/>
  </link>

  <joint name="${prefix}_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="${prefix}_wheel_link"/>
    <origin xyz="0 ${y_sign * wheel_y} ${wheel_z}" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
  </joint>
</xacro:macro>

<xacro:wheel prefix="left" y_sign="1"/>
<xacro:wheel prefix="right" y_sign="-1"/>
```

注意：如果右轮转向和预期相反，有些模型会把右轮 axis 写成 `0 -1 0`，有些控制器则要求左右轮 joint axis 一致。不要靠猜，应该启动后发布速度命令并观察正方向。

## 生成 URDF

命令：

```bash
ros2 run xacro xacro robot.urdf.xacro > robot.urdf
```

带参数：

```bash
ros2 run xacro xacro robot.urdf.xacro use_lidar:=true use_camera:=false > robot.urdf
```

检查：

```bash
check_urdf robot.urdf
```

如果报错，优先看：

- XML 标签是否闭合；
- 宏参数是否缺失；
- 变量名是否拼错；
- include 路径是否正确；
- 数学表达式是否能计算；
- 是否把字符串当数字参与计算。

建议把展开后的 URDF 保存到 `/tmp` 或 `build` 目录，不要把生成物长期提交成源文件，除非你明确需要给不支持 Xacro 的工具使用。

## Launch 中使用 Xacro

ROS 2 launch 常见写法是运行 Xacro 并把结果作为 `robot_description` 参数传给 `robot_state_publisher`：

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.substitutions import Command, PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    robot_description_content = Command([
        "xacro ",
        PathJoinSubstitution([
            FindPackageShare("my_robot_description"),
            "urdf",
            "robot.urdf.xacro",
        ]),
    ])

    return LaunchDescription([
        Node(
            package="robot_state_publisher",
            executable="robot_state_publisher",
            parameters=[{"robot_description": robot_description_content}],
        )
    ])
```

## Xacro 风格建议

推荐：

- 文件名使用 `.urdf.xacro`；
- 顶部集中放 property；
- 宏名使用明确名词，如 `wheel`、`lidar_sensor`、`box_inertial`；
- 坐标和尺寸尽量通过变量计算；
- 每个宏只做一类事情；
- 宏参数不要太多，超过 8 个就考虑拆分或用更清晰的结构；
- 生成的 URDF 要定期检查，不要只看 Xacro 源文件。

不推荐：

- 在宏里隐藏太多 link 和 joint，导致 TF 树难以阅读；
- 到处硬编码尺寸；
- include 层级太深；
- 同名 property 到处覆盖；
- 把 Gazebo、ros2_control、传感器、外观全部塞在一个巨大的文件里。

## 学习练习

1. 把一个纯 URDF 小车改成 Xacro。
2. 抽取底盘尺寸、轮子半径、轮距、质量。
3. 写 `box_inertial` 和 `cylinder_inertial` 两个宏。
4. 写 `wheel` 宏生成左右轮。
5. 添加 `use_lidar` 参数控制是否生成雷达。
6. 生成 URDF，用 `check_urdf` 验证。
7. 在 RViz 中确认模型和 TF。

## 复习问题

1. 为什么 Xacro 能降低维护成本，但也可能增加调试难度？
2. property、arg、macro 分别适合解决什么问题？
3. 为什么要经常检查展开后的 URDF？
4. 一个宏参数太多时，说明设计上可能有什么问题？
5. 如果 include 路径找不到，应该检查哪些环境和包构建步骤？

## 2026 机器人资料与版本核对补充

机器人生态版本变化很快，尤其是 ROS 2 发行版、Gazebo Sim、Nav2、ros2_control、MoveIt 2、SLAM Toolbox 和各类驱动包。复现实验前应记录 ROS 2 发行版、Ubuntu 版本、RMW 实现、工作空间 source 顺序、Gazebo 版本、机器人模型文件、参数 YAML、传感器驱动版本、固件版本和仿真或真机环境。

排错时优先核对官方文档、REP 标准和当前发行版文档。社区教程很适合入门和排坑，但包名、插件名、参数名、launch 文件和命令可能随发行版变化。尤其是 Nav2、Gazebo Sim 和 ros2_control，建议按当前项目使用的发行版页面核对，而不是混用 Humble、Iron、Jazzy、Kilted 或 Rolling 的教程。

### 资料入口

- ROS 2 Documentation: https://docs.ros.org/
- ROS 2 Jazzy Documentation: https://docs.ros.org/en/jazzy/
- Nav2 Documentation: https://docs.nav2.org/
- Gazebo Sim Documentation: https://gazebosim.org/docs/
- Gazebo ROS 2 integration: https://gazebosim.org/docs/latest/ros2_integration/
- ros2_control Documentation: https://control.ros.org/
- MoveIt 2 Documentation: https://moveit.picknik.ai/main/index.html
- REP 103 Standard Units and Coordinate Conventions: https://www.ros.org/reps/rep-0103.html
- REP 105 Coordinate Frames for Mobile Platforms: https://www.ros.org/reps/rep-0105.html
- SLAM Toolbox: https://github.com/SteveMacenski/slam_toolbox

仿真章节要特别核对 collision、inertial、joint limit、transmission、controller、sensor plugin 和 sim time。模型看起来正确不代表物理正确，惯性和碰撞错误会直接导致控制震荡或仿真穿模。

## 参考资料

- [ROS 2 Xacro 教程](https://docs.ros.org/en/rolling/Tutorials/Intermediate/URDF/Using-Xacro-to-Clean-Up-a-URDF-File.html)
- [xacro 包文档](https://docs.ros.org/en/rolling/p/xacro/)
## 2026-06 深化精讲补充：Xacro 实战

Last researched: 2026-06-16

### 本篇在仿真体系中的位置

Xacro 的目的不是炫技，而是让尺寸、质量、颜色、传感器安装和重复结构有单一可信来源。 本篇关注的重点是：property、macro、include、参数化建模、可复用惯性和传感器宏。机器人仿真不是单纯运行一个窗口，而是一条从模型文件到 ROS 2 接口、从物理引擎到上层算法的闭环链路。任何一层没有验证，后续问题都会以更隐蔽的形式出现。

```mermaid
flowchart LR
  A[问题定义: Xacro 实战] --> B[状态/模型]
  B --> C[坐标系与时间]
  C --> D[算法或控制器]
  D --> E[ROS 2 接口]
  E --> F[仿真或实机验证]
  F --> G[日志、rosbag、指标]
  G --> B
```

Figure: 本图为面向机器人学习笔记的通用工程闭环，综合 ROS 2、REP 103/105、Nav2、Gazebo Sim 与 ros2_control 官方资料重新整理。


### 分层理解

| 层级 | 主要对象 | 应确认的问题 | 常用工具 |
| --- | --- | --- | --- |
| 模型层 | URDF、Xacro、SDF、mesh | link/joint 是否正确，单位是否为 SI，惯性和碰撞是否合理 | `xacro`、`check_urdf`、RViz |
| TF 层 | `map`、`odom`、`base_link`、传感器 frame | 坐标树是否连通，parent/child 是否正确，时间戳是否可查询 | `view_frames`、`tf2_echo` |
| 物理层 | 质量、惯量、摩擦、接触、重力 | 是否抖动、飞走、穿模，仿真步长是否稳定 | Gazebo GUI、日志 |
| 控制层 | ros2_control、controller manager、控制器 | 控制器是否 loaded/active，joint 名称和接口是否匹配 | `ros2 control`、`ros2 topic echo /cmd_vel` |
| 传感器层 | LaserScan、IMU、Image、PointCloud2 | frame、频率、QoS、噪声和桥接是否正确 | `ros2 topic hz/info -v`、RViz |
| 算法层 | SLAM、Nav2、MoveIt 2、任务节点 | 输入是否完整，生命周期是否 active，恢复策略是否有效 | Nav2 日志、rosbag2 |

### 工程流程精讲

第一步是固定版本。ROS 2、Gazebo Sim、ros_gz、ros2_control 和 Nav2 的版本组合必须以官方文档为准。Jazzy 与 Humble 的包名、默认中间件、Gazebo 推荐版本和教程细节可能不同。跟教程学习时不要混用 ROS 1、Gazebo Classic、Ignition 旧命名和 Gazebo Sim 新命名。

第二步是建立最小模型。最小模型只需要一个 `base_link`、简单几何体、必要的 `collision` 和 `inertial`。先让它在 RViz 中显示，再让它在 Gazebo 中稳定落地。这个阶段不要急着加 Nav2、SLAM 或复杂 mesh，因为它们会掩盖模型错误。

第三步是补齐控制闭环。移动机器人通常需要把 `/cmd_vel` 变成轮子关节速度，机械臂需要把轨迹控制器和关节状态接通。ros2_control 的价值是统一仿真和实机接口，但它要求硬件接口、控制器配置、joint 名称、command/state interface 严格一致。

第四步是接入传感器。Gazebo 内部 topic 和 ROS 2 topic 不是同一个系统，Gazebo Sim 常通过 `ros_gz_bridge` 进行消息桥接。桥接前要确认消息类型受支持，桥接方向正确，frame_id 和仿真时间正确传递。

第五步才是上层算法。Nav2、SLAM、定位和任务逻辑都假设底层模型、TF、控制和传感器基本可信。若底层未验证就直接调 Nav2 参数，常见结果是参数越改越乱。

### 最小验证项目

建议把本篇内容落实到一个 `my_robot_description` + `my_robot_bringup` 工作空间中：

```text
robot_ws/src/
  my_robot_description/
    urdf/
    meshes/
    rviz/
    launch/
  my_robot_bringup/
    launch/
    config/
  my_robot_control/
    config/
  my_robot_navigation/
    maps/
    params/
```

验收标准不是“能启动 Gazebo”，而是以下每一项都能独立证明：`robot_description` 能生成，TF 树连通，模型在 RViz 中方向正确，Gazebo 中不抖动，控制器 active，`/cmd_vel` 后轮子和底盘运动方向正确，传感器话题有稳定频率，`use_sim_time` 在所有相关节点一致。

### 常见实践坑

- `visual` 正常不代表 `collision` 和 `inertial` 正常。RViz 只看显示和 TF，Gazebo 还要计算物理。
- 复杂 mesh 不适合直接做碰撞。碰撞体应尽量用 box、cylinder、sphere 或简化网格。
- 动态 link 没有合理惯性时，仿真容易抖动、飞走或在接触时爆炸。
- `base_link`、`base_footprint`、`odom`、`map` 的语义要遵循 REP 105，不要为了“看起来能跑”随意改 frame 名。
- Gazebo world 坐标和 ROS `map` 坐标不是天然同一个概念。需要明确谁发布哪条 TF。
- `ros_gz_bridge` 只桥接配置过且支持的消息类型。看到 Gazebo 有 topic 不代表 ROS 2 一定能收到。
- QoS 不匹配会导致 topic 存在但订阅不到，尤其是传感器数据和地图数据。
- 仿真时间 `/clock` 必须被所有算法节点一致使用，否则 TF 查询和 rosbag 回放会出现时间错位。
- 控制器 loaded 不等于 active，active 不等于 joint interface 名称正确。
- Nav2 失败时先查 TF、里程计、传感器和 costmap，再讨论 planner/controller 参数。

### 调试顺序

1. `ros2 doctor` 和环境变量：确认 ROS 发行版、Domain ID、RMW 和 source 顺序。
2. `ros2 pkg list` / `ros2 launch`：确认包能被找到，launch 文件能被安装。
3. `ros2 param get /robot_state_publisher robot_description`：确认模型实际传入。
4. `ros2 run tf2_tools view_frames`：确认 TF 树没有断裂和重复发布。
5. Gazebo 中暂停/单步观察模型：确认物理稳定。
6. `ros2 control list_controllers`：确认控制器状态。
7. `ros2 topic info -v`：检查关键 topic 的类型、QoS、发布者和订阅者。
8. RViz 同时显示 TF、RobotModel、LaserScan、Odometry、Map 和 Path。
9. 录制 rosbag2，离线复现问题，避免每次重新跑完整仿真。

### 从仿真迁移到实机

仿真到实机的关键不是“代码完全不变”，而是接口和假设可控。URDF 可以复用，但质量、摩擦、传感器噪声、延迟和控制饱和需要实测校准。ros2_control 能让控制器层更容易复用，但硬件接口必须处理通信超时、编码器异常、电机使能、急停和安全限速。Nav2 参数也要根据真实机器人最大速度、加速度、制动距离、定位误差和传感器盲区重新调整。

### 推荐练习

- 从零写一个只有底盘和两个轮子的 URDF/Xacro，并在 RViz 中验证 TF。
- 给模型添加 collision 和 inertial，观察缺失或错误参数对 Gazebo 稳定性的影响。
- 用 ros2_control 接入差速控制器，发布 `/cmd_vel` 验证正转、倒车和原地旋转。
- 添加 2D LiDAR，用 `ros_gz_bridge` 桥接到 ROS 2，并在 RViz 中显示 `/scan`。
- 录制 `/tf`、`/odom`、`/scan`、`/cmd_vel` 和 `/clock`，用 rosbag2 回放排查。

## References and further reading

- [Official] [ROS 2 Documentation](https://docs.ros.org/)
- [Official] [ROS 2 Jazzy Documentation](https://docs.ros.org/en/jazzy/)
- [Standard] [REP 103: Standard Units of Measure and Coordinate Conventions](https://www.ros.org/reps/rep-0103.html)
- [Standard] [REP 105: Coordinate Frames for Mobile Platforms](https://www.ros.org/reps/rep-0105.html)
- [Book / Course] [Modern Robotics](https://modernrobotics.northwestern.edu/)
- [Book] [Probabilistic Robotics](https://mitpress.mit.edu/9780262303804/probabilistic-robotics/)
- [Book] [State Estimation for Robotics](https://www.cambridge.org/core/books/state-estimation-for-robotics/00E53274A2F1E6CC1A55CA5C3D1C9718)
- [Course] [MIT Underactuated Robotics](https://underactuated.mit.edu/)
- [Official] [Nav2 Documentation](https://docs.nav2.org/)
- [Official] [Gazebo Sim Documentation](https://gazebosim.org/docs/latest/)
- [Official] [SDFormat Documentation](https://sdformat.org/)
- [Official] [ros2_control Documentation](https://control.ros.org/)
- [Community] [ROS2 Control分析讲解 - CSDN](https://blog.csdn.net/Bing_Lee/article/details/135003678)
- [Community] [在机器人仿真中使用 ros2_control - CSDN](https://blog.csdn.net/apingna/article/details/148333455)
- [Community] [ROS2 SLAM 建图导航 - 掘金](https://juejin.cn/post/7101201729122730020)
- [Community] [机器人导航仿真 - 博客园](https://www.cnblogs.com/zjh1170/p/16133766.html)
- [Official] [Use ROS 2 to interact with Gazebo](https://gazebosim.org/docs/latest/ros2_integration/)
- [Official] [Installing Gazebo with ROS](https://gazebosim.org/docs/latest/ros_installation/)
- [Official] [ros_gz_bridge package documentation](https://docs.ros.org/en/jazzy/p/ros_gz_bridge/)
- [Official] [SDFormat model kinematics](https://sdformat.org/tutorials/specification/spec_model_kinematics/)

## References and further reading

- [Official] [ROS 2 Documentation](https://docs.ros.org/)
- [Official] [ROS 2 Jazzy Documentation](https://docs.ros.org/en/jazzy/)
- [Official] [Nav2 Documentation](https://docs.nav2.org/)
- [Official] [Gazebo Sim Documentation](https://gazebosim.org/docs/latest/)
- [Official] [Gazebo ROS 2 integration](https://gazebosim.org/docs/latest/ros2_integration/)
- [Official] [SDFormat Documentation](https://sdformat.org/)
- [Official] [ros2_control Documentation](https://control.ros.org/)
- [Standard] [REP 103: Standard Units of Measure and Coordinate Conventions](https://www.ros.org/reps/rep-0103.html)
- [Standard] [REP 105: Coordinate Frames for Mobile Platforms](https://www.ros.org/reps/rep-0105.html)
- [Book / Course] [Modern Robotics](https://modernrobotics.northwestern.edu/)
- [Book] [Probabilistic Robotics](https://mitpress.mit.edu/9780262303804/probabilistic-robotics/)
- [Book] [State Estimation for Robotics](https://www.cambridge.org/core/books/state-estimation-for-robotics/00E53274A2F1E6CC1A55CA5C3D1C9718)
- [Course] [MIT Underactuated Robotics](https://underactuated.mit.edu/)
- [Source] [ros2_control_demos](https://github.com/ros-controls/ros2_control_demos)
- [Community] [ROS2 Control分析讲解 - CSDN](https://blog.csdn.net/Bing_Lee/article/details/135003678)
- [Community] [在机器人仿真中使用 ros2_control - CSDN](https://blog.csdn.net/apingna/article/details/148333455)
- [Community] [ROS2 SLAM 建图导航 - 掘金](https://juejin.cn/post/7101201729122730020)
- [Community] [机器人导航仿真 - 博客园](https://www.cnblogs.com/zjh1170/p/16133766.html)
