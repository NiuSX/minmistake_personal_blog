# 05 连杆、关节、惯性和碰撞

这一篇是仿真稳定性的核心。很多模型在 RViz 里看起来正常，但进入 Gazebo 后抖动、爆炸、穿模、陷入地面，通常都和 link、joint、inertial、collision 的设置有关。

## link 的三套模型

一个 link 往往有三套模型：

```text
visual    -> 给人看的外观
collision -> 给物理引擎做碰撞检测
inertial  -> 给物理引擎计算质量和转动惯量
```

三者可以不同。

例子：一个外观复杂的底盘可以这样处理：

- visual 使用精细 mesh；
- collision 使用几个 box 近似；
- inertial 使用一个等效长方体的质量和惯性矩。

## 为什么 collision 要简单

碰撞检测是高频计算。复杂 mesh 会导致：

- 仿真变慢；
- 接触点过多；
- 接触法线不稳定；
- 轮子和地面抖动；
- 机器人卡在细小网格缝隙中。

优先级：

1. box、cylinder、sphere；
2. 多个简单几何组合；
3. 简化后的 convex mesh；
4. 原始高精度 mesh。

新手建议前两个就够了。

## 惯性矩基础

惯性矩描述物体抵抗旋转加速度的能力。质量只描述平动惯性，不足以描述旋转行为。

URDF 中惯性矩为：

```xml
<inertia
  ixx="..." ixy="..." ixz="..."
  iyy="..." iyz="..."
  izz="..."/>
```

对于对称物体，非对角项通常可先设为 0：

```xml
ixy="0" ixz="0" iyz="0"
```

但 `ixx`、`iyy`、`izz` 不能随便填 0。很多物理引擎不接受零惯性，或者会产生严重不稳定。

## 常见惯性公式

### 长方体

尺寸为 `x, y, z`，质量为 `m`：

```text
Ixx = m / 12 * (y^2 + z^2)
Iyy = m / 12 * (x^2 + z^2)
Izz = m / 12 * (x^2 + y^2)
```

### 实心圆柱

如果圆柱轴沿 z，半径 `r`，长度 `l`，质量 `m`：

```text
Ixx = m / 12 * (3r^2 + l^2)
Iyy = m / 12 * (3r^2 + l^2)
Izz = 1 / 2 * m * r^2
```

如果你在 URDF 里通过 `rpy` 把圆柱转到 y 轴方向，惯性轴也要和 link 坐标系一致。新手阶段可以先让 wheel link 的局部坐标系设计成与轮子转轴一致，减少心智负担。

### 球体

实心球半径 `r`，质量 `m`：

```text
Ixx = Iyy = Izz = 2 / 5 * m * r^2
```

## 质量设置经验

仿真里的质量不需要一开始精确到真实 CAD 数据，但要合理：

- 小型移动机器人底盘：1kg 到 20kg；
- 小轮子：0.05kg 到 1kg；
- 小型传感器：0.02kg 到 0.5kg；
- 大型机械臂单连杆：几 kg 到几十 kg。

避免：

- 质量为 0；
- 惯性为 0；
- 某个小部件质量极大；
- 父子 link 质量比例极端，比如底盘 0.01kg，轮子 10kg；
- 长细杆的惯性矩和小球一样。

## joint origin 和 link origin

这是新手最容易混乱的地方。

### link origin

link 本身有一个坐标系。visual、collision、inertial 的 origin 都是相对 link 坐标系。

### joint origin

joint origin 描述 child link 坐标系相对 parent link 坐标系的位置和姿态。

例子：

```xml
<joint name="laser_joint" type="fixed">
  <parent link="base_link"/>
  <child link="laser_link"/>
  <origin xyz="0.2 0 0.15" rpy="0 0 0"/>
</joint>
```

这不是移动 laser 的 visual，而是放置整个 `laser_link` 坐标系。

## 关节 limit

revolute 和 prismatic 应设置 limit：

```xml
<limit lower="-1.57" upper="1.57" effort="10" velocity="2"/>
```

含义：

- `lower`：最小位置；
- `upper`：最大位置；
- `effort`：最大力或力矩；
- `velocity`：最大速度。

如果不设置，URDF 检查或控制器可能报错。

## damping 和 friction

关节动力学参数：

```xml
<dynamics damping="0.1" friction="0.0"/>
```

含义：

- damping：速度相关阻尼，速度越大阻力越大；
- friction：库仑摩擦近似。

用途：

- 减少关节无限振荡；
- 让机械臂关节更稳定；
- 让被动轮或转轴不那么理想化。

不要一开始把 damping 调得很大，否则控制器会像拖着刹车。

## 接触和摩擦

在 Gazebo/SDF 中，碰撞表面的摩擦参数非常重要。轮式机器人尤其依赖：

- 轮子和地面的摩擦；
- 轮子接触模型；
- 地面 collision；
- 轮子半径和轮距；
- 质量分布。

如果小车原地打滑：

- 增大轮子摩擦；
- 检查轮子是否真正接触地面；
- 检查轮子 collision 的方向；
- 检查底盘是否压住地面；
- 检查控制命令是否过大；
- 检查质量和惯性是否合理。

如果小车像弹簧一样跳：

- 检查惯性矩；
- 检查 contact 参数；
- 降低控制器输出；
- 检查是否存在重叠 collision；
- 检查仿真步长和实时因子。

## 自碰撞

自碰撞是机器人自身 link 之间的碰撞。很多移动机器人可以关闭某些相邻 link 的自碰撞，因为它们本来就通过关节连接，碰撞模型可能重叠。

机械臂则需要认真处理自碰撞，尤其是做运动规划时。

建议：

- 相邻 link 的 collision 不要明显重叠；
- 对不需要参与碰撞的装饰件不加 collision；
- 对机械臂使用规划工具生成 self-collision matrix；
- 不要用视觉 mesh 直接做自碰撞判断。

## 物理仿真稳定性清单

模型放进 Gazebo 前检查：

- 所有动态 link 有质量；
- 所有动态 link 有非零惯性矩；
- collision 不要互相严重重叠；
- 轮子底部刚好接触地面，不要悬空或埋进地面；
- joint axis 方向合理；
- 关节 limit 合理；
- 质量比例合理；
- mesh scale 正确；
- 原点位置清晰；
- 控制器参数不激进；
- 仿真步长与控制频率匹配。

## 建模建议

先粗后细：

1. 用简单几何搭模型。
2. 在 RViz 看 TF。
3. 在 Gazebo 看稳定性。
4. 加控制器。
5. 加传感器。
6. 再替换 visual mesh。
7. 最后微调 collision 和惯性。

不要一开始就导入完整 CAD。复杂外观会掩盖基础问题。

