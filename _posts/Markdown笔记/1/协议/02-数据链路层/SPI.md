# SPI 串行外设接口学习笔记

最后整理：2026-06-11

SPI（Serial Peripheral Interface）是常见板级高速同步串行接口，常用于 MCU 与 Flash、显示屏、ADC/DAC、传感器、无线模块通信。SPI 通常比 I2C 更快，但需要更多片选线，也没有统一的设备发现和标准寄存器语义。

## 协议定位

SPI 更像一种事实标准接口，而不是由单一统一标准完全定义的协议。它定义同步串行传输方式，但不同芯片对命令、寄存器、帧格式和时序细节差异很大。

## 核心信号

| 信号 | 常见名称 | 说明 |
|---|---|---|
| SCLK | SCK/CLK | 时钟，由主机产生 |
| MOSI | COPI/SDO | 主机输出，从机输入 |
| MISO | CIPO/SDI | 主机输入，从机输出 |
| CS | SS/NSS | 片选，选择具体从设备 |

## CPOL 与 CPHA

SPI 有四种模式，由时钟极性 CPOL 和时钟相位 CPHA 决定：

| Mode | CPOL | CPHA |
|---|---:|---:|
| 0 | 0 | 0 |
| 1 | 0 | 1 |
| 2 | 1 | 0 |
| 3 | 1 | 1 |

主从设备模式不一致时，常见表现是读到错位数据或完全错误。

## 传输特点

- 全双工：每发一个 bit 通常也会同时收一个 bit。
- 无地址机制：靠片选线选择设备。
- 无 ACK：主机通常不知道从机是否真正收到，除非上层协议定义状态返回。
- 速率高：适合 Flash、屏幕、ADC 等高吞吐外设。

## 常见问题

- SPI Mode 配错，数据错位。
- CS 时序不符合芯片手册要求。
- MISO/MOSI 接反。
- 多个从机 MISO 没有正确三态释放，导致总线冲突。
- 线太长、时钟太快、边沿过冲导致偶发错误。

## 排查建议

1. 降低 SPI 时钟验证信号完整性。
2. 用逻辑分析仪按正确模式解码。
3. 对照芯片手册检查 CS 拉低/拉高时序。
4. 先读取固定 ID 寄存器，例如 Flash JEDEC ID。
5. 检查电平兼容，3.3V 与 5V 设备不要直接混接。

## 参考资料

- NXP SPI controller documentation examples: <https://www.nxp.com/>
- Analog Devices SPI interface tutorial: <https://www.analog.com/en/resources/analog-dialogue/articles/introduction-to-spi-interface.html>

