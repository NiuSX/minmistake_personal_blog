# EtherCAT 学习笔记

最后整理：2026-06-11

EtherCAT（Ethernet for Control Automation Technology）是一种高性能工业以太网技术，常用于运动控制、伺服驱动、分布式 I/O、机器人和高实时性自动化系统。它由 EtherCAT Technology Group 推动，标准化于 IEC 61158/61784。

## 协议定位

EtherCAT 使用标准以太网物理层，但通信机制不同于普通 TCP/IP 应用。它面向实时控制网络，主站发送以太网帧，从站在帧经过时即时读取或写入属于自己的数据。

## 解决的问题

- 普通以太网在实时控制中延迟和抖动较大。
- 多个从站需要高速周期同步交换过程数据。
- 运动控制需要分布式时钟和确定性通信。

## 核心机制

| 机制 | 说明 |
|---|---|
| On-the-fly processing | 帧经过从站时即时处理数据，不逐站完整收发 |
| EtherCAT Datagram | 一个以太网帧中可包含多个 EtherCAT 数据报 |
| Distributed Clocks | 分布式时钟，用于高精度同步 |
| Process Data | 周期实时数据 |
| Mailbox | 非周期通信，如 CoE、FoE、EoE |
| ESI 文件 | EtherCAT Slave Information，从站描述文件 |

## 常见应用协议映射

| 名称 | 说明 |
|---|---|
| CoE | CANopen over EtherCAT，使用 CANopen 对象字典模型 |
| FoE | File over EtherCAT，文件传输 |
| EoE | Ethernet over EtherCAT，承载以太网 |
| SoE | Servo drive profile over EtherCAT |

## 工作流程

1. 主站扫描从站，识别拓扑和设备。
2. 读取 ESI/对象字典等信息。
3. 配置 PDO 映射和同步方式。
4. 切换从站状态：Init、Pre-Operational、Safe-Operational、Operational。
5. 周期发送过程数据帧。
6. 使用分布式时钟同步运动控制周期。

## 常见问题

- ESI 文件与设备固件不匹配。
- 从站状态停在 Safe-Operational，通常表示过程数据或同步配置不正确。
- 网线、端口、拓扑顺序与组态不一致。
- 分布式时钟配置错误导致伺服同步报警。
- 普通交换机不能随意放在 EtherCAT 实时段中。

## 参考资料

- [EtherCAT Technology Group](https://www.ethercat.org/)
- [Beckhoff EtherCAT technology overview](https://www.beckhoff.com/en-en/products/i-o/ethercat/)
- [IEC 61158 / IEC 61784 overview](https://webstore.iec.ch/)

