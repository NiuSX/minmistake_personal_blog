# Modbus 协议学习笔记

最后整理：2026-06-11

Modbus 是工业自动化中非常常见的应用层协议，最初由 Modicon 提出。它使用简单的主从/客户端服务器模型，通过功能码读写线圈和寄存器。Modbus 可以运行在串口上形成 Modbus RTU/ASCII，也可以运行在 TCP/IP 上形成 Modbus TCP。

## 协议定位

Modbus 定义的是应用层数据模型和报文语义，不定义具体电气层。常见组合：

| 组合 | 下层 | 常见场景 |
|---|---|---|
| Modbus RTU | RS-485、RS-232 | 工业仪表、PLC、变频器 |
| Modbus ASCII | 串口 ASCII 字符 | 早期或可读性要求场景 |
| Modbus TCP | TCP 502 | 工业以太网、网关、SCADA |

## 解决的问题

- 主站如何读取从站设备状态。
- 主站如何写入设备控制量或参数。
- 不同厂家设备如何用统一寄存器模型集成。
- 串口总线和以太网环境下如何表达同一类读写操作。

## 数据模型

| 类型 | 访问 | 典型含义 |
|---|---|---|
| Coils | 读写 1 bit | 开关量输出 |
| Discrete Inputs | 只读 1 bit | 开关量输入 |
| Input Registers | 只读 16 bit | 测量值 |
| Holding Registers | 读写 16 bit | 参数、设定值、控制量 |

常见地址前缀如 `0xxxx`、`1xxxx`、`3xxxx`、`4xxxx` 是传统文档表示法，不一定等于协议帧中的实际地址。协议帧中地址通常从 0 开始，厂家手册可能从 1 开始，这是最常见坑之一。

## 常见功能码

| 功能码 | 名称 | 作用 |
|---:|---|---|
| 01 | Read Coils | 读线圈 |
| 02 | Read Discrete Inputs | 读离散输入 |
| 03 | Read Holding Registers | 读保持寄存器 |
| 04 | Read Input Registers | 读输入寄存器 |
| 05 | Write Single Coil | 写单个线圈 |
| 06 | Write Single Register | 写单个寄存器 |
| 15 | Write Multiple Coils | 写多个线圈 |
| 16 | Write Multiple Registers | 写多个寄存器 |

## Modbus RTU 帧格式

| 字段 | 说明 |
|---|---|
| Slave Address | 从站地址，通常 1-247 |
| Function Code | 功能码 |
| Data | 起始地址、数量、字节数、数据等 |
| CRC | 16 位 CRC，低字节先发送 |

RTU 帧依赖总线空闲时间分隔帧，串口参数必须一致。典型参数是 `9600 8N1` 或 `9600 8E1`，但实际以设备手册为准。

## Modbus TCP 帧格式

Modbus TCP 使用 MBAP Header，不使用 RTU CRC，因为 TCP/IP 链路已有校验机制。

| 字段 | 长度 | 说明 |
|---|---:|---|
| Transaction Identifier | 2 字节 | 请求响应匹配 |
| Protocol Identifier | 2 字节 | Modbus 为 0 |
| Length | 2 字节 | 后续字节数 |
| Unit Identifier | 1 字节 | 网关后面的从站地址或单元标识 |
| Function Code + Data | 可变 | PDU |

默认 TCP 端口是 502。

## 读保持寄存器示例

目标：读取从站 1 的保持寄存器，从地址 0 开始读取 2 个寄存器。

Modbus RTU 请求：

```text
01 03 00 00 00 02 C4 0B
```

含义：

| 字节 | 含义 |
|---|---|
| `01` | 从站地址 |
| `03` | 读保持寄存器 |
| `00 00` | 起始地址 |
| `00 02` | 寄存器数量 |
| `C4 0B` | CRC16 |

## 异常响应

异常响应会把功能码最高位置 1，例如请求 `03` 的异常响应功能码是 `83`。后面跟异常码：

| 异常码 | 含义 |
|---:|---|
| 01 | 非法功能 |
| 02 | 非法数据地址 |
| 03 | 非法数据值 |
| 04 | 从站设备故障 |

## 常见问题

- 寄存器地址偏移 1：手册写 40001，程序到底填 0 还是 1，要看厂家说明。
- 字节序/字序错误：32 位浮点数跨两个 16 位寄存器时尤其常见。
- CRC 字节顺序错误：Modbus RTU CRC 低字节先发。
- RS-485 A/B 接反、终端电阻不当、从站地址重复。
- 主站轮询间隔太短，从站还没处理完就超时。
- RTU/TCP 网关 Unit Identifier 映射错误。

## 排查建议

1. 先用厂家软件或通用 Modbus Poll/ModScan 验证设备。
2. 从最简单的功能码 03 或 04 开始，读取少量寄存器。
3. 确认串口参数、从站地址、功能码、寄存器起始地址。
4. 读取固定已知值，验证字节序和倍率。
5. 抓串口帧或 Wireshark 过滤 `tcp.port == 502`。

## 参考资料

- Modbus Application Protocol Specification: <https://www.modbus.org/specs.php>
- Modbus over Serial Line Specification and Implementation Guide: <https://www.modbus.org/specs.php>
- IANA Service Name and Port Number Registry: <https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml>

