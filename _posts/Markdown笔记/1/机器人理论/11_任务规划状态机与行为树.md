# 11. 任务规划、状态机与行为树

## 学习目标

学完本章，你应该能：

- 理解任务规划和运动规划的区别。
- 能设计机器人任务状态机。
- 理解行为树 Behavior Tree 的基本节点和执行逻辑。
- 能为导航、抓取、充电、失败恢复设计任务流程。
- 知道企业机器人为什么需要明确状态、错误码和恢复策略。

## 1. 任务规划解决什么问题

运动规划回答：

```text
机器人怎么从 A 到 B？
```

任务规划回答：

```text
机器人应该先做什么、后做什么、失败了怎么办？
```

例子：巡检机器人任务。

```text
接收任务 -> 检查电量 -> 前往 A 点 -> 拍照 -> 前往 B 点 -> 上传结果 -> 返回
```

其中任何一步都可能失败：

- 电量低。
- 路径被挡。
- 定位丢失。
- 相机掉线。
- 上传失败。

## 2. 有限状态机 FSM

FSM 用有限个状态描述系统。

例子：

```text
INIT -> IDLE -> RUNNING -> PAUSED -> RUNNING
                  |
                  v
                ERROR
                  |
                  v
                RECOVERY
```

每个状态需要定义：

- 进入条件。
- 退出条件。
- 允许动作。
- 禁止动作。
- 超时。
- 错误处理。

## 3. FSM 优点和缺点

优点：

- 简单清晰。
- 容易调试。
- 适合主状态管理。

缺点：

- 状态多时容易爆炸。
- 并发任务表达不方便。
- 复杂恢复逻辑会变得混乱。

适合：

- 机器人全局生命周期。
- 急停、故障、待机、运行等主状态。

## 4. 行为树 Behavior Tree

行为树常用于复杂机器人任务和游戏 AI。

行为树由节点组成，并周期性 tick。

节点返回：

- Success。
- Failure。
- Running。

## 5. 常见行为树节点

### 5.1 Sequence

按顺序执行子节点。

只要一个失败，整体失败。

适合：

```text
检查电量 -> 导航到目标 -> 执行动作 -> 上报结果
```

### 5.2 Fallback / Selector

按顺序尝试子节点。

一个成功，整体成功。

适合恢复：

```text
正常导航失败 -> 清理代价地图 -> 重新规划 -> 请求人工处理
```

### 5.3 Condition

判断条件。

例子：

- 电量是否足够。
- 是否已经定位。
- 目标是否可达。
- 传感器是否在线。

### 5.4 Action

执行动作。

例子：

- NavigateToPose。
- PickObject。
- DockToCharger。
- CaptureImage。

### 5.5 Decorator

改变子节点行为。

例子：

- 重试 N 次。
- 超时。
- 取反。
- 节流。

## 6. 行为树 vs 状态机

| 对比 | 状态机 | 行为树 |
|---|---|---|
| 适合 | 全局状态 | 复杂任务流程 |
| 可读性 | 状态少时清晰 | 任务树清晰 |
| 失败恢复 | 状态多时复杂 | 比较自然 |
| 并发 | 表达较弱 | 可通过并行节点表达 |
| 调试 | 状态转移清楚 | 需要可视化 tick 状态 |

实际企业项目常组合使用：

- FSM 管全局生命周期。
- Behavior Tree 管具体任务执行。

## 7. Nav2 中的行为树

Nav2 使用行为树组织导航任务。

典型行为：

- 计算路径。
- 跟踪路径。
- 检查目标是否更新。
- 清理代价地图。
- 原地旋转恢复。
- 重新规划。

这比写死一串 if/else 更容易扩展。

## 8. 任务失败恢复

失败恢复要明确：

- 什么算失败。
- 失败是否可重试。
- 重试几次。
- 是否需要切换策略。
- 是否需要人工介入。
- 是否进入安全状态。

例子：导航失败。

```text
导航失败
  -> 清理局部代价地图
  -> 重新规划
  -> 后退一点
  -> 再次导航
  -> 仍失败则上报错误并等待人工处理
```

## 9. 错误码体系

错误码应该包含：

- 模块。
- 严重等级。
- 可恢复性。
- 原因。
- 建议处理方式。

例子：

```text
NAV_LOCAL_PLANNER_TIMEOUT
SENSOR_LIDAR_NO_DATA
LOC_POSE_COVARIANCE_TOO_HIGH
ARM_IK_NO_SOLUTION
BATTERY_TOO_LOW_FOR_TASK
```

错误码比自然语言日志更适合统计和自动处理。

## 10. 企业任务系统常见状态

- INIT：初始化。
- IDLE：待命。
- READY：准备好执行任务。
- RUNNING：任务执行中。
- PAUSED：暂停。
- RECOVERY：恢复中。
- CHARGING：充电中。
- ERROR：错误。
- E_STOP：急停。
- MAINTENANCE：维护模式。

## 11. 常见工程问题

| 现象 | 可能原因 |
|---|---|
| 任务卡住不动 | Running 状态没有超时 |
| 失败后无限重试 | 缺少重试上限 |
| 急停后自动继续任务 | 状态恢复规则错误 |
| 导航失败原因不清楚 | 错误码和日志不完整 |
| 多任务互相打断 | 缺少任务优先级和资源锁 |

## 12. 练习

1. 为巡检机器人画 FSM。
2. 用行为树描述“导航到 A 点，失败则清图重试，仍失败则上报”。
3. 为机械臂抓取设计 pick-and-place 行为树。
4. 设计一套错误码，覆盖导航、感知、机械臂、电池、急停。
5. 给每个动作加超时和重试次数。

## References and further reading

- Navigation2 Behavior Trees: https://docs.nav2.org/behavior_trees/index.html
- BehaviorTree.CPP Documentation: https://www.behaviortree.dev/
- Navigation2 Documentation: https://docs.nav2.org/
- MoveIt 2 Documentation: https://moveit.picknik.ai/main/index.html
