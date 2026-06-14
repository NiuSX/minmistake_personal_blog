# PROFIBUS 学习笔记

最后整理：2026-06-11

PROFIBUS 是工业自动化中经典现场总线协议族，常见于 PLC、远程 I/O、驱动器、仪表和过程控制。它由 PROFIBUS & PROFINET International 推动，标准化于 IEC 61158/61784 系列。

## 协议定位

PROFIBUS 不是单一小协议，而是现场总线体系。常见类型：

| 类型 | 说明 |
|---|---|
| PROFIBUS DP | Decentralized Peripherals，面向离散制造和远程 I/O，常见 |
| PROFIBUS PA | Process Automation，面向过程自动化，可用于本安和总线供电场景 |
| PROFIBUS FMS | 早期通用通信，现代较少见 |

## 解决的问题

- PLC 和分布式 I/O、驱动、仪表之间周期性实时通信。
- 工业设备参数化、诊断和组态。
- 多厂家设备在统一现场总线下互联。

## PROFIBUS DP 基本概念

| 概念 | 说明 |
|---|---|
| Master | 主站，例如 PLC |
| Slave | 从站，例如远程 I/O、变频器 |
| GSD 文件 | 设备描述文件，用于组态软件识别设备能力 |
| Cyclic Data | 周期过程数据 |
| Acyclic Data | 非周期参数、诊断数据 |
| Token Passing | 多主站时通过令牌控制总线访问 |

## 物理层

PROFIBUS DP 常用 RS-485 物理层，使用屏蔽双绞线和总线拓扑。总线两端需要终端，速率越高允许线缆越短。

PROFIBUS PA 常用 MBP 物理层，适合过程仪表、较低速率、长距离和本安应用。

## 组态流程

1. 在工程软件中导入设备 GSD 文件。
2. 设置从站地址。
3. 选择输入/输出模块或过程数据长度。
4. 下载组态到主站。
5. 主站周期性轮询从站，交换过程数据。
6. 通过诊断报文查看从站故障。

## 常见问题

- 从站地址和组态不一致。
- GSD 文件不匹配。
- 终端电阻未打开或打开位置错误。
- 屏蔽接地和线缆质量导致通信不稳定。
- 总线速率和距离不匹配。
- 模块顺序或 I/O 长度配置错误。

## 参考资料

- PROFIBUS & PROFINET International: <[https://www.profibus.com/](https://www.profibus.com/)>
- IEC 61158 overview: <[https://webstore.iec.ch/](https://webstore.iec.ch/)>

