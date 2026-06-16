# 07. SLAM 理论

## 学习目标

学完本章，你应该能：

- 理解 SLAM、建图、定位的区别。
- 理解 SLAM 前端、后端、回环检测和地图表示。
- 区分 2D LiDAR SLAM、视觉 SLAM、视觉惯性 SLAM。
- 能分析建图失败、地图变形、定位漂移和回环错误。

## 1. SLAM 是什么

SLAM 是 Simultaneous Localization and Mapping：

```text
同时定位与建图
```

机器人在未知环境中：

- 不知道地图。
- 也不知道自己准确位置。

SLAM 要同时估计：

- 机器人轨迹。
- 环境地图。

## 2. 建图、定位、SLAM 的区别

| 概念 | 地图是否已知 | 位姿是否已知 | 目标 |
|---|---|---|---|
| 建图 | 未知 | 通常需要估计 | 生成地图 |
| 定位 | 已知 | 未知 | 求机器人在地图中的位置 |
| SLAM | 未知 | 未知 | 同时求地图和轨迹 |

AMCL 是定位，不是 SLAM。SLAM Toolbox 可以做 2D SLAM。

## 3. SLAM 基本框架

```mermaid
flowchart LR
  Sensor[传感器数据] --> Frontend[前端: 匹配/里程计/约束]
  Frontend --> Backend[后端: 优化轨迹和地图]
  Backend --> Map[地图]
  Backend --> Pose[机器人位姿]
  Frontend --> Loop[回环检测]
  Loop --> Backend
```

## 4. 前端

前端负责从传感器数据中提取约束。

常见任务：

- 特征提取。
- 帧间匹配。
- scan matching。
- 视觉里程计。
- LiDAR 里程计。
- 回环候选检测。

前端更偏“从数据中找到关系”。

例子：

- 当前激光扫描和上一帧扫描匹配，得到相对位姿。
- 当前图像和上一帧图像匹配，得到相机运动。

## 5. 后端

后端负责优化。

常见形式：

- EKF SLAM。
- Graph SLAM。
- Pose Graph Optimization。
- Bundle Adjustment。

图优化直觉：

- 每个机器人位姿是一个节点。
- 里程计、观测、回环是边。
- 优化目标是让所有约束误差尽量小。

## 6. 回环检测

回环指机器人回到以前到过的地方。

回环重要性：

- 纠正累计漂移。
- 让地图闭合。
- 提高全局一致性。

回环错误风险：

- 把两个相似但不同的地方误认为同一处。
- 导致地图严重变形。

## 7. 地图类型

| 地图 | 表示 | 适用 |
|---|---|---|
| 栅格地图 | 每个格子表示占用概率 | 2D 导航 |
| 点云地图 | 大量 3D 点 | 3D 感知和定位 |
| 特征地图 | 角点、线、描述子 | 视觉 SLAM |
| 位姿图 | 轨迹节点和约束 | 图优化 |
| 语义地图 | 带物体类别和区域含义 | 高级任务规划 |

## 8. 2D LiDAR SLAM

适合：

- 室内移动机器人。
- AMR/AGV。
- 清洁、配送、巡检机器人。

优点：

- 稳定。
- 工程成熟。
- 和 Nav2 结合方便。

缺点：

- 对玻璃、低矮障碍、动态人群敏感。
- 高度信息不足。

## 9. 视觉 SLAM

使用相机估计运动和地图。

类型：

- 单目 SLAM。
- 双目 SLAM。
- RGB-D SLAM。

挑战：

- 光照变化。
- 纹理不足。
- 运动模糊。
- 动态物体。
- 单目尺度不确定。

## 10. 视觉惯性 SLAM

融合相机和 IMU。

优点：

- IMU 提供高频运动信息。
- 相机提供环境约束。
- 比纯视觉更鲁棒。

难点：

- 时间同步。
- 相机-IMU 外参。
- IMU bias。
- 初始化。

## 11. 常见建图失败原因

| 现象 | 可能原因 |
|---|---|
| 地图越来越弯 | 里程计漂移、scan matching 不稳定 |
| 回到原点无法闭合 | 回环检测失败 |
| 地图突然扭曲 | 错误回环 |
| 墙体变厚 | 雷达外参或时间同步问题 |
| 长走廊定位不稳 | 环境退化，特征不足 |
| 动态人群导致地图脏 | 动态障碍未过滤 |

## 12. 学习路线

1. 先学里程计和坐标变换。
2. 学概率和状态估计。
3. 用 2D LiDAR SLAM 建图。
4. 理解 scan matching 和回环。
5. 再学图优化和视觉 SLAM。
6. 最后学习 VIO 和 3D LiDAR SLAM。

## 13. 练习

1. 用 SLAM Toolbox 建一张 2D 地图。
2. 记录 rosbag，重复回放建图。
3. 修改雷达外参，观察地图变形。
4. 在动态人多的环境建图，观察地图污染。
5. 对比建图模式和定位模式。

## References and further reading

- [Probabilistic Robotics](https://probabilistic-robotics.org/)
- [State Estimation for Robotics](https://github.com/utiasSTARS/state-estimation-for-robotics)
- [SLAM Toolbox](https://github.com/SteveMacenski/slam_toolbox)
- [Navigation2 Documentation](https://docs.nav2.org/)
- [Open3D Registration Tutorial](https://www.open3d.org/docs/release/tutorial/pipelines/registration.html)
## 2026-06 深化精讲补充：SLAM 理论

Last researched: 2026-06-16

### 为什么这部分是机器人学习主干

SLAM 的本质是在未知环境中同时估计机器人轨迹和地图。它不是单个算法名，而是一套从传感器观测到全局一致地图的系统工程。 机器人学习最容易出现的误区，是把理论看成考试内容，把 ROS、Gazebo、Nav2、MoveIt 2 看成工程工具。实际项目里二者不能分开：理论负责定义正确性，工程负责让正确性在有噪声、有延迟、有版本差异的系统中落地。SLAM 理论 的学习目标不是“能看懂一页公式”，而是能在系统出问题时，把现象还原成状态、模型、坐标、时间、约束和误差。

一个可执行的学习判断标准是：看到一条 ROS 消息，你能说出它的物理意义、单位、坐标系、时间戳、噪声来源和下游消费者；看到一个算法结果，你能判断它违反了哪个假设；看到一个仿真异常，你能判断是模型、控制、传感器还是任务逻辑的问题。

### 核心心智模型

前端把原始观测变成约束，后端在约束图上优化轨迹和地图，回环负责发现曾经到过的地方并修正累计漂移。 这个模型可以贯穿移动机器人、机械臂、无人机和仿真系统。状态可以是二维位姿、三维位姿、关节角、速度、地图、物体位姿或任务状态；模型可以是运动学、动力学、传感器投影、碰撞约束或行为树转移；误差可以来自定位、控制、观测、约束违反或任务失败。

```mermaid
flowchart LR
  A[问题定义: SLAM 理论] --> B[状态/模型]
  B --> C[坐标系与时间]
  C --> D[算法或控制器]
  D --> E[ROS 2 接口]
  E --> F[仿真或实机验证]
  F --> G[日志、rosbag、指标]
  G --> B
```

Figure: 本图为面向机器人学习笔记的通用工程闭环，综合 ROS 2、REP 103/105、Nav2、Gazebo Sim 与 ros2_control 官方资料重新整理。


### 模块级精讲

### 1. 前端

处理激光、视觉或点云，完成特征提取、扫描匹配、视觉里程计或局部子图构建。前端更关注实时性和鲁棒匹配。

在学习 `SLAM 理论` 时，这一模块要同时从公式和工程接口两侧理解：公式告诉你变量之间的关系，工程接口告诉你这些变量来自哪个话题、哪个坐标系、哪个配置文件或哪个传感器。只会公式但不知道数据来源，会在真实系统中无法排错；只会命令但不知道模型假设，会在参数失效时找不到根因。

### 2. 后端

把里程计约束、观测约束和回环约束组合成优化问题。后端更关注一致性、稀疏结构、鲁棒核和计算效率。

在学习 `SLAM 理论` 时，这一模块要同时从公式和工程接口两侧理解：公式告诉你变量之间的关系，工程接口告诉你这些变量来自哪个话题、哪个坐标系、哪个配置文件或哪个传感器。只会公式但不知道数据来源，会在真实系统中无法排错；只会命令但不知道模型假设，会在参数失效时找不到根因。

### 3. 回环检测

识别机器人回到旧区域，向图中加入长距离约束。正确回环能消除漂移，错误回环会严重拉坏地图。

在学习 `SLAM 理论` 时，这一模块要同时从公式和工程接口两侧理解：公式告诉你变量之间的关系，工程接口告诉你这些变量来自哪个话题、哪个坐标系、哪个配置文件或哪个传感器。只会公式但不知道数据来源，会在真实系统中无法排错；只会命令但不知道模型假设，会在参数失效时找不到根因。

### 4. 地图表示

2D 栅格适合室内导航，点云适合三维感知，语义地图适合任务规划。地图形式应由下游任务决定。

在学习 `SLAM 理论` 时，这一模块要同时从公式和工程接口两侧理解：公式告诉你变量之间的关系，工程接口告诉你这些变量来自哪个话题、哪个坐标系、哪个配置文件或哪个传感器。只会公式但不知道数据来源，会在真实系统中无法排错；只会命令但不知道模型假设，会在参数失效时找不到根因。

### 最小工程例子

用 2D LiDAR 在走廊建图时，长直走廊缺少几何特征，扫描匹配容易沿走廊方向漂移。增加 IMU、轮速约束或在回环处形成闭合路径，可以显著改善地图一致性。若地图建得歪，Nav2 后续定位和规划都会受影响。

这个例子体现了一个重要原则：机器人系统的问题很少只属于单一模块。一个看似“算法发散”的现象，可能来自单位错误、坐标方向错误、协方差设置错误、时间同步错误或底层控制饱和。学习时应坚持从最小闭环验证：先用静态数据验证公式，再用仿真验证接口，最后用 rosbag 或实机日志验证鲁棒性。

### 和 ROS 2 / Gazebo / Nav2 的连接

ROS 2 给理论变量提供了工程载体。位置、速度、姿态、协方差和传感器观测通常出现在 `geometry_msgs`、`nav_msgs`、`sensor_msgs` 等消息中；坐标变换通过 TF2 管理；参数通过 YAML 和节点参数传入；长任务通过 Action 表达；调试依赖 `ros2 topic echo`、`ros2 topic hz`、`tf2_echo`、`view_frames` 和 rosbag2。

Gazebo Sim 给理论模型提供了可控实验环境。它能快速暴露质量、惯量、碰撞、摩擦、传感器噪声和控制接口的问题，但仿真结果不能直接等于实机结果。仿真更适合作为“结构正确性”和“流程可运行性”的验证工具：模型能加载、TF 能连通、控制器能激活、传感器能发布、上层算法能消费数据。

Nav2 则把坐标、估计、规划、控制和任务行为集中到一个移动机器人系统中。`map -> odom -> base_link -> sensor_link` 的 TF 链、`/odom` 的连续性、`/scan` 的 frame、代价地图的 footprint、行为树的恢复节点，都依赖本章知识。理论越扎实，Nav2 调参越少靠猜。

### 常见错误与排查

- 把建图问题当成只调一个参数
- 动态物体太多还期待静态地图完美
- 回环阈值过松导致错误闭环
- 传感器外参错导致地图重影
- 只看 RViz 好看不检查轨迹误差和重定位能力

排查时建议使用“变量来源表”：每个关键变量都写清楚来源、单位、坐标系、时间戳、频率、协方差和消费者。例如 `/odom` 的 pose 是否在 `odom` 坐标系，twist 是否在 `base_link` 或 child frame 语义下解释，协方差是否反映真实不确定性，TF 是否存在同一时间点的可查询变换。这个表比单纯截图 RViz 更可靠。

### 学习与实践路线

1. 先在纸面或 Python/Numpy 中实现最小公式，确保单位和符号正确。
2. 用固定输入构造可重复测试，例如已知角度的旋转、已知轮速的圆弧运动、已知观测噪声的滤波更新。
3. 把变量接入 ROS 2 消息，并检查 Header、frame_id、时间戳和 QoS。
4. 在 RViz 中观察 TF、轨迹、点云、地图或 Marker，确认视觉结果和数值结果一致。
5. 用 rosbag2 录制关键话题，离线复现实验，避免每次靠实机重新触发问题。
6. 最后进入 Gazebo 或真实硬件，把噪声、延迟、饱和、外参误差和动态障碍纳入验证。

### 面试与项目表达方式

如果要在项目或面试中说明自己理解 SLAM 理论，不要只说“学过某算法”。更好的表达是：我知道这个模块解决什么问题，输入输出是什么，关键假设是什么，在哪些情况下会失败，失败时如何定位，和 ROS 2 中哪些话题、TF、参数或控制器相关。这样的表达比堆算法名更接近真实机器人研发。

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

## 2026-06 万字精讲补充：从知识点到可交付能力

Last researched: 2026-06-16

### 1. 这一主题最终要解决什么问题

SLAM 理论 的学习不应停留在名词解释。它最终要解决的是：当机器人系统出现不符合预期的运动、观测、规划或任务行为时，开发者能把现象拆成可验证的问题，并能用数据证明修复是否有效。围绕本主题，核心关注点是：从前端匹配、后端优化、回环检测和地图表示理解定位与建图的耦合问题。

一篇合格的机器人笔记，需要同时回答四类问题。第一，概念是什么，它和相邻概念的边界在哪里；第二，工程中它以什么文件、话题、参数、坐标系或控制器形式出现；第三，常见错误会产生什么现象；第四，怎样设计一个最小实验验证理解。只记录命令而不记录判断标准，后续换发行版、换机器人、换传感器时会很快失效。

### 2. 输入、输出和边界

学习任何机器人模块，都要先写清楚输入、输出和边界。输入可能是传感器观测、控制目标、地图、机械结构参数、机器人当前状态或任务上下文；输出可能是速度命令、关节轨迹、位姿估计、地图、路径、行为结果或安全状态。边界则说明这个模块不负责什么。边界越清晰，系统越容易测试。

以移动机器人为例，定位模块可以输出 `map -> odom` 或机器人在地图中的位姿估计，但它不应该直接决定电机电流；局部控制器可以输出 `/cmd_vel`，但它不应该随意修改全局地图；底层驱动可以执行速度命令并反馈编码器，但它不应该理解行为树任务。清晰边界能避免一个节点变成所有问题的堆积点。

在笔记中建议为每个主题补充一张“接口表”：

| 项目 | 应记录内容 |
| --- | --- |
| 输入 | topic、service、action、文件、参数、坐标系、单位、频率 |
| 输出 | 数据类型、坐标系、单位、更新条件、失败状态 |
| 依赖 | TF、时间、QoS、外参、模型文件、控制器、硬件状态 |
| 非目标 | 本模块明确不负责的事情 |
| 验收 | 可以自动化或手动复现的检查方式 |

### 3. 从最小例子开始，而不是从完整系统开始

机器人系统的复杂性来自耦合。一个完整导航系统同时依赖地图、定位、里程计、激光雷达、TF、代价地图、规划器、控制器、行为树、生命周期节点和底盘控制。如果一开始就运行完整系统，任何一个错误都会表现为“机器人不动”或“导航失败”，很难定位。更稳的方式是从最小例子开始。

最小例子不是玩具，而是工程验证的基准。对于 SLAM 理论，可以按以下顺序构造：

1. 纸面或脚本验证：用固定数值验证公式、坐标、参数或状态转移。
2. ROS 2 接口验证：把输入输出接成最小节点，检查消息类型、Header、frame_id、时间戳和 QoS。
3. 可视化验证：在 RViz 或日志中观察结果是否符合直觉。
4. 仿真验证：在 Gazebo Sim 或简单模拟器中加入物理、传感器、控制和时间因素。
5. 数据回放验证：用 rosbag2 固定输入，确保改动前后差异可比较。
6. 实机验证：加入真实噪声、延迟、饱和、外参误差和安全边界。

每一步都应有明确的通过标准。例如“能显示”不是充分标准；应该进一步确认坐标轴方向、单位、频率、时间戳、误差范围和异常情况下的行为。

### 4. 坐标系和时间是贯穿所有主题的基础约束

机器人问题经常不是算法本身错，而是坐标和时间错。ROS 生态通常遵循 REP 103 的坐标约定：移动机器人常用右手坐标系，`x` 向前、`y` 向左、`z` 向上；REP 105 给出了移动平台常见 frame 的语义，尤其是 `map`、`odom`、`base_link` 和 `earth` 等坐标系之间的职责。即使某个算法不直接讨论 TF，它的输入数据仍然隐含坐标系。

时间同样关键。传感器消息、TF、rosbag2 回放、Gazebo 仿真、状态估计和 Nav2 都依赖一致时间语义。仿真中应统一使用 `/clock` 和 `use_sim_time`；实机中要关注多计算机时钟同步；离线回放时要确认 TF 缓存和消息时间戳是否匹配。一个常见错误是只看 topic 是否存在，却不检查消息时间是否落在 TF 可查询范围内。

### 5. 参数不是魔法，要能解释每个参数影响

机器人调参容易陷入“复制别人 YAML”的误区。正确方式是把参数和物理含义对应起来。速度上限来自底盘能力和安全要求；加速度上限来自电机、摩擦和制动距离；footprint 来自真实外形和定位误差；控制周期来自硬件采样和计算资源；协方差来自传感器误差而不是随意填写；惯性参数来自几何和质量分布。

如果一个参数改动后系统表现变化很大，笔记里应记录三件事：改动前后的数值、现象变化、推测机制。这样下次遇到类似问题时，可以从机制出发而不是从记忆出发。对于版本相关参数，还应记录 ROS 2 发行版、Nav2 或 ros2_control 版本，因为参数名、默认值和插件行为可能随版本变化。

### 6. 调试要按层次，不要按直觉乱改

建议把调试顺序固定下来：

1. 环境层：确认 ROS 发行版、工作空间 source 顺序、依赖包、`ROS_DOMAIN_ID`、`RMW_IMPLEMENTATION`。
2. 构建层：确认 `colcon build` 成功，包和可执行文件能被 `ros2 pkg`、`ros2 run` 找到。
3. 接口层：确认 topic/service/action 存在，类型一致，QoS 兼容，发布订阅数量符合预期。
4. 坐标层：确认 TF 树连通，静态和动态变换没有重复发布，frame_id 拼写一致。
5. 时间层：确认仿真时间、系统时间、rosbag 回放时间和消息时间戳一致。
6. 模型层：确认 URDF/SDF 的 link、joint、collision、inertial、传感器外参和控制接口。
7. 算法层：最后再调规划器、控制器、滤波器、SLAM 或任务策略参数。

这种顺序的好处是每一层都有可观测证据。比如 Nav2 不动时，先看 lifecycle 是否 active，再看 costmap 是否有数据，再看 TF 和 `/odom`，再看 `/cmd_vel` 是否发布，最后才看底盘是否执行。若直接改 planner 参数，可能只是掩盖了 TF 或控制器问题。

### 7. 典型故障案例

案例一：RViz 中模型正常，Gazebo 中模型飞走。常见原因是动态 link 缺少合理 inertial、质量比例极端、collision 重叠、关节轴写错或物理步长不稳定。排查时应先把模型简化成 box/cylinder，再逐步恢复 mesh 和插件。

案例二：topic 存在但订阅者收不到消息。常见原因是 QoS 不兼容、命名空间或 remap 不一致、`ROS_DOMAIN_ID` 不一致、消息类型不同或节点其实在另一个工作空间版本中运行。应使用 `ros2 topic info -v` 查看发布者和订阅者详情。

案例三：导航路径看起来正确但机器人原地转圈。可能是 `base_link` 方向错误、里程计角速度符号反了、局部控制器参数不匹配、footprint 与真实尺寸差异过大，或代价地图把机器人自身传感器误识别为障碍。

案例四：SLAM 地图逐渐扭曲。可能是轮速里程计尺度错误、IMU 坐标轴方向错误、激光外参偏差、环境退化、动态物体过多、回环检测过松或时间同步问题。不能只通过“地图好不好看”判断，应结合轨迹、回环约束和重定位表现分析。

案例五：机械臂规划成功但执行失败。可能是 SRDF 规划组错误、控制器未 active、joint 名称和硬件接口不一致、轨迹时间参数不合理、末端 TCP 未建模或真实夹具与碰撞模型不一致。

### 8. 如何把本主题写进项目文档

项目文档应避免只写“使用了某某算法”。更有价值的写法是：

- 问题定义：这个模块解决什么具体问题。
- 输入输出：使用哪些 ROS 2 接口，数据单位和坐标系是什么。
- 核心假设：依赖哪些硬件、模型、时间同步、环境条件或运动约束。
- 失败模式：已知会在哪些情况下失败，系统如何检测和恢复。
- 验证方法：使用哪些 rosbag、仿真场景、实机测试或指标证明有效。
- 版本信息：ROS 2、Gazebo、Nav2、ros2_control、驱动和硬件固件版本。

这种文档结构能让后续维护者快速理解模块边界，也能让学习笔记从“知识收藏”变成“工程资产”。

### 9. 深入学习建议

如果你已经能跑通基础示例，下一步不要盲目扩大项目规模，而应提高验证质量。为每个关键模块建立一个可重复实验：固定输入、固定环境、固定参数、固定评价指标。比如定位模块可以记录一段 rosbag，反复比较轨迹平滑性、漂移和重定位能力；控制模块可以记录阶跃响应和超调；仿真模块可以记录 real-time factor、碰撞稳定性和传感器频率；任务模块可以记录失败恢复路径和超时处理。

同时，要主动阅读官方文档和标准。社区教程适合快速入门和排坑，但规范性事实应以官方文档、标准、源代码或论文为准。尤其是 ROS 2、Gazebo Sim、Nav2 和 ros2_control 这类仍在快速演进的生态，旧教程中的包名、插件名、参数名和启动方式可能已经变化。

### 10. 本篇复盘清单

- 能否用一句话说明 SLAM 理论 解决的问题。
- 能否画出输入、输出、依赖和非目标。
- 能否指出至少三个常见失败模式及其排查命令。
- 能否把本主题连接到 ROS 2 的 topic、service、action、parameter、TF 或 launch。
- 能否设计一个最小仿真或 rosbag 实验验证理解。
- 能否解释仿真结果和实机结果可能不同的原因。
- 能否在笔记末尾保留官方资料、标准资料和实践资料链接，方便未来更新。

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
