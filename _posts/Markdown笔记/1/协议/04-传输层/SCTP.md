# SCTP 流控制传输协议学习笔记

最后整理：2026-06-11

SCTP（Stream Control Transmission Protocol）是一种传输层协议，设计上结合了 TCP 的可靠性和 UDP 的消息边界，同时支持多宿主和多流。它在电信信令、WebRTC DataChannel 等场景中出现。

## 解决的问题

- TCP 是字节流，没有消息边界。
- TCP 一个连接内部的队头阻塞会影响所有数据。
- 一些业务需要可靠传输、消息边界、多流和多路径容错。

## 核心特性

| 特性 | 说明 |
|---|---|
| Association | SCTP 使用关联而非传统连接概念 |
| Message-oriented | 保留消息边界 |
| Multi-streaming | 一个关联中多个流，减少流之间互相阻塞 |
| Multi-homing | 一个端点可绑定多个 IP，提高容错 |
| Four-way handshake | 使用 COOKIE 机制缓解 SYN flood 类攻击 |

## 基本握手

1. 客户端发送 INIT。
2. 服务端返回 INIT ACK，带 State Cookie。
3. 客户端回送 COOKIE ECHO。
4. 服务端验证后返回 COOKIE ACK。

## 常见场景

- 电信信令传输，例如 SIGTRAN。
- WebRTC DataChannel 底层常使用 SCTP over DTLS over UDP。
- 需要消息边界和可靠传输的专用系统。

## 常见误区

- SCTP 并没有像 TCP/UDP 一样在公网普通应用中广泛部署，NAT 和防火墙支持是实际限制。
- SCTP 多宿主不是自动负载均衡，具体路径管理要看实现和配置。

## 参考资料

- [RFC 9260 - Stream Control Transmission Protocol](https://www.rfc-editor.org/rfc/rfc9260.html)

