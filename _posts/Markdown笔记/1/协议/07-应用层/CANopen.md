# CANopen 协议学习笔记

最后整理：2026-06-11

CANopen 是基于 CAN 总线的高层通信协议，常用于工业自动化、运动控制、传感器、伺服驱动和嵌入式设备网络。CAN 负责底层帧和仲裁，CANopen 在其上定义设备模型、对象字典、通信对象和网络管理。

## 协议定位

CANopen 是应用层/设备层协议。学习时要分清：

| 层次 | 作用 |
|---|---|
| CAN | 帧格式、仲裁、错误处理 |
| CANopen | 对象字典、PDO/SDO、NMT、心跳、设备配置 |
| 设备 Profile | 对某类设备的对象和行为做标准化 |

## 解决的问题

- 不同厂家 CAN 设备如何用统一对象模型配置和通信。
- 实时过程数据如何高效发送。
- 参数配置、诊断、网络管理如何标准化。

## 对象字典

对象字典是 CANopen 的核心。设备所有参数、状态、通信配置都以对象形式组织，每个对象由索引和子索引定位。

```text
索引 0x6040: Controlword
索引 0x6041: Statusword
```

对象字典通常通过 EDS/DCF 文件描述，调试 CANopen 设备时必须查看厂家提供的对象字典。

## 通信对象

| 对象 | 作用 |
|---|---|
| NMT | Network Management，节点状态管理 |
| PDO | Process Data Object，实时过程数据 |
| SDO | Service Data Object，参数读写 |
| SYNC | 同步消息 |
| EMCY | Emergency，紧急错误消息 |
| Heartbeat | 心跳，监测节点在线状态 |

## PDO 与 SDO

| 对比 | PDO | SDO |
|---|---|---|
| 用途 | 实时过程数据 | 配置和参数访问 |
| 特点 | 短、快、可映射 | 请求/响应，访问对象字典 |
| 典型场景 | 速度、位置、输入输出状态 | 设置模式、读取参数 |

## 节点状态

CANopen NMT 常见状态：

- Initialising
- Pre-operational
- Operational
- Stopped

很多设备上电后处于 Pre-operational，可以配置参数，但 PDO 不一定正常运行；需要 NMT Start 进入 Operational。

## 常见问题

- Node ID 冲突。
- 设备没有进入 Operational，导致 PDO 不发送。
- PDO 映射和主站期望不一致。
- 波特率不一致或 CAN 终端电阻错误。
- EDS 文件版本和设备固件不匹配。

## 参考资料

- CAN in Automation CANopen overview: <[https://www.can-cia.org/canopen/](https://www.can-cia.org/canopen/)>
- CiA CAN knowledge: <[https://www.can-cia.org/can-knowledge/](https://www.can-cia.org/can-knowledge/)>

