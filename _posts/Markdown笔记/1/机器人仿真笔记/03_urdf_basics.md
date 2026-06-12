# 03 URDF 基础

URDF 全称 Unified Robot Description Format，是 ROS 中描述机器人结构的 XML 格式。它主要描述机器人由哪些 link 组成、link 之间通过哪些 joint 连接，以及每个 link 的视觉、碰撞和惯性属性。

## URDF 能描述什么

URDF 适合描述：

- 机器人刚体结构；
- 连杆之间的树状连接关系；
- 关节类型、轴向、上下限；
- 视觉模型；
- 碰撞模型；
- 惯性参数；
- 传感器和控制插件相关扩展。

URDF 不擅长描述：

- 闭链机构；
- 复杂仿真世界；
- 地形、光照、物理世界参数；
- 多机器人场景；
- 很复杂的接触参数。

这些内容通常由 SDF 或 Gazebo 扩展补充。

## 最小 URDF 结构

一个最小 URDF：

```xml
<?xml version="1.0"?>
<robot name="simple_robot">
  <link name="base_link"/>
</robot>
```

这表示一个只有一个 link 的机器人。它能被解析，但看不见，因为没有 visual。

## link

`link` 表示刚体。一个 link 可以包含：

- `visual`：显示用几何；
- `collision`：碰撞检测用几何；
- `inertial`：质量和惯性。

例子：

```xml
<link name="base_link">
  <visual>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <geometry>
      <box size="0.4 0.3 0.1"/>
    </geometry>
    <material name="blue">
      <color rgba="0.1 0.3 0.9 1.0"/>
    </material>
  </visual>
</link>
```

`box size="0.4 0.3 0.1"` 表示 x 方向 0.4m，y 方向 0.3m，z 方向 0.1m。

## visual

`visual` 只负责显示，不参与碰撞和动力学。

常见几何：

```xml
<box size="x y z"/>
<cylinder radius="r" length="l"/>
<sphere radius="r"/>
<mesh filename="package://my_robot_description/meshes/base.dae" scale="1 1 1"/>
```

建议：

- 初学先用 box、cylinder、sphere；
- mesh 单位要确认；
- mesh 的坐标原点要确认；
- mesh 不要直接拿来当高精度碰撞模型。

## collision

`collision` 用于碰撞检测。它可以和 visual 不同。

例子：

```xml
<collision>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <geometry>
    <box size="0.4 0.3 0.1"/>
  </geometry>
</collision>
```

建议：

- collision 尽量简单；
- 底盘用 box；
- 轮子用 cylinder；
- 球形部件用 sphere；
- 复杂外壳用多个简单几何组合近似；
- 只有必要时才用简化 mesh。

## inertial

`inertial` 用于动力学计算。

例子：

```xml
<inertial>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <mass value="2.0"/>
  <inertia
    ixx="0.02" ixy="0.0" ixz="0.0"
    iyy="0.03" iyz="0.0"
    izz="0.04"/>
</inertial>
```

质量单位是 kg。惯性矩单位是 kg*m^2。

如果一个 link 会参与物理仿真，尤其是非 fixed 关节连接的 link，应该提供合理 inertial。惯性矩不合理会导致：

- 模型抖动；
- 模型飞走；
- 关节震荡；
- 接触不稳定；
- 控制器难以调参。

## joint

`joint` 连接 parent link 和 child link。

例子：

```xml
<joint name="laser_joint" type="fixed">
  <parent link="base_link"/>
  <child link="laser_link"/>
  <origin xyz="0.15 0 0.12" rpy="0 0 0"/>
</joint>
```

这表示 `laser_link` 固定安装在 `base_link` 前方 0.15m、高 0.12m 的位置。

## revolute joint

有限角度旋转：

```xml
<joint name="arm_joint" type="revolute">
  <parent link="base_link"/>
  <child link="arm_link"/>
  <origin xyz="0 0 0.1" rpy="0 0 0"/>
  <axis xyz="0 0 1"/>
  <limit lower="-1.57" upper="1.57" effort="10" velocity="1"/>
</joint>
```

注意：

- `lower`、`upper` 是弧度；
- `effort` 是最大力矩或力；
- `velocity` 是最大速度；
- axis 在 joint 坐标系下表达。

## continuous joint

无限旋转，常用于轮子：

```xml
<joint name="wheel_joint" type="continuous">
  <parent link="base_link"/>
  <child link="wheel_link"/>
  <origin xyz="0 0.18 0" rpy="0 0 0"/>
  <axis xyz="0 1 0"/>
</joint>
```

continuous joint 不设置上下限，但仍可设置动力学参数：

```xml
<dynamics damping="0.1" friction="0.0"/>
```

## prismatic joint

直线滑动：

```xml
<joint name="slider_joint" type="prismatic">
  <parent link="base_link"/>
  <child link="slider_link"/>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <axis xyz="1 0 0"/>
  <limit lower="0.0" upper="0.2" effort="20" velocity="0.1"/>
</joint>
```

## mimic joint

`mimic` 可以让一个关节跟随另一个关节，常用于夹爪：

```xml
<joint name="right_finger_joint" type="prismatic">
  <parent link="gripper_base"/>
  <child link="right_finger"/>
  <origin xyz="0 -0.03 0" rpy="0 0 0"/>
  <axis xyz="0 -1 0"/>
  <limit lower="0" upper="0.04" effort="20" velocity="0.2"/>
  <mimic joint="left_finger_joint" multiplier="1.0" offset="0.0"/>
</joint>
```

## material

可以在 link 中直接写 material：

```xml
<material name="gray">
  <color rgba="0.5 0.5 0.5 1.0"/>
</material>
```

也可以在文件顶部定义材料，再复用：

```xml
<material name="gray">
  <color rgba="0.5 0.5 0.5 1.0"/>
</material>

<link name="base_link">
  <visual>
    <geometry>
      <box size="0.4 0.3 0.1"/>
    </geometry>
    <material name="gray"/>
  </visual>
</link>
```

## 一个完整小车片段

```xml
<?xml version="1.0"?>
<robot name="mini_bot">
  <material name="body_blue">
    <color rgba="0.1 0.2 0.8 1"/>
  </material>

  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.4 0.3 0.1"/>
      </geometry>
      <material name="body_blue"/>
    </visual>
    <collision>
      <geometry>
        <box size="0.4 0.3 0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2.0"/>
      <inertia ixx="0.0167" ixy="0" ixz="0" iyy="0.0283" iyz="0" izz="0.0417"/>
    </inertial>
  </link>

  <link name="left_wheel_link">
    <visual>
      <origin rpy="1.5708 0 0"/>
      <geometry>
        <cylinder radius="0.05" length="0.03"/>
      </geometry>
    </visual>
    <collision>
      <origin rpy="1.5708 0 0"/>
      <geometry>
        <cylinder radius="0.05" length="0.03"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.2"/>
      <inertia ixx="0.000145" ixy="0" ixz="0" iyy="0.000145" iyz="0" izz="0.00025"/>
    </inertial>
  </link>

  <joint name="left_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="left_wheel_link"/>
    <origin xyz="0 0.165 -0.025"/>
    <axis xyz="0 1 0"/>
  </joint>
</robot>
```

## URDF 检查清单

写完 URDF 后逐项检查：

- XML 是否闭合；
- link 名称是否唯一；
- joint 名称是否唯一；
- parent 和 child 是否拼写正确；
- 是否形成树结构；
- 是否只有一个根 link；
- revolute/prismatic 是否有 limit；
- axis 是否单位向量；
- origin 的单位是否是米和弧度；
- mesh 路径是否使用 `package://`；
- 每个参与物理仿真的 link 是否有 inertial；
- visual 和 collision 是否相对 link 原点放置正确。

