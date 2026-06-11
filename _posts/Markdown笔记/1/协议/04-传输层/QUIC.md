# QUIC 学习笔记

最后整理：2026-06-11

QUIC 是基于 UDP 的现代传输协议，最常见用途是 HTTP/3。它把可靠传输、多路复用、拥塞控制和 TLS 1.3 加密握手深度结合，目标是减少连接建立延迟，避免 TCP 队头阻塞，并让协议更容易在用户态演进。

## 协议定位

QUIC 运行在 UDP 之上，但功能接近传输层。由于它内建 TLS 1.3，传统 OSI 分层中传输层、会话层、表示层的边界在 QUIC 中被压缩到一个协议栈里。

## 解决的问题

- TCP + TLS + HTTP/2 建连往返次数较多。
- TCP 层丢包会影响同一连接上的所有 HTTP/2 流，造成传输层队头阻塞。
- TCP 在内核中实现，协议升级受操作系统部署周期影响。
- 移动网络切换 IP 时，TCP 连接通常断开。

## 核心机制

| 机制 | 说明 |
|---|---|
| 基于 UDP | 更容易穿越现有网络设备和在用户态实现 |
| TLS 1.3 集成 | 握手和加密是协议核心部分 |
| Stream 多路复用 | 一个连接中多个独立流，减少队头阻塞 |
| Connection ID | 连接不完全绑定 IP/端口，支持迁移 |
| 0-RTT | 已有会话信息时可更快发送早期数据 |
| Packet Number | 每个包编号，便于丢包检测 |

## 与 TCP 的差异

| 对比 | TCP | QUIC |
|---|---|---|
| 承载 | 直接在 IP 上 | 在 UDP 上 |
| 加密 | 通常依赖 TLS | 默认内建 TLS 1.3 |
| 多路复用 | TCP 本身没有流多路复用 | 原生支持多个 stream |
| 连接迁移 | IP/端口变化通常断连 | Connection ID 支持迁移 |
| 部署位置 | 多在内核 | 多在用户态 |

## 常见问题

- QUIC 使用 UDP 443，若网络禁用 UDP 443，浏览器会回退到 TCP/TLS/HTTP/2。
- 0-RTT 有重放风险，应用必须只允许幂等或可承受重放的请求使用。
- QUIC 加密更多头部信息，传统中间设备无法像 TCP 那样深入观察。

## 参考资料

- RFC 9000 - QUIC: <https://www.rfc-editor.org/rfc/rfc9000.html>
- RFC 9001 - Using TLS to Secure QUIC: <https://www.rfc-editor.org/rfc/rfc9001.html>
- RFC 9114 - HTTP/3: <https://www.rfc-editor.org/rfc/rfc9114.html>

