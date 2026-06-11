# IPv4 学习笔记

最后整理：2026-06-11

IPv4 是互联网最基础的网络层协议之一，使用 32 位地址标识接口。它提供无连接、尽力而为的数据包传递服务：IP 尽力把包送到目的地，但不保证可靠、不保证顺序、不保证不重复。

## 解决的问题

- 在不同二层网络之间统一寻址。
- 让路由器可以根据目标地址逐跳转发。
- 为 TCP、UDP、ICMP 等上层协议提供承载。

## IPv4 头部关键字段

| 字段 | 作用 |
|---|---|
| Version | 版本号，IPv4 为 4 |
| IHL | IP 头长度 |
| Total Length | IP 包总长度 |
| Identification/Flags/Fragment Offset | 分片与重组相关字段 |
| TTL | 每经过一个路由器减 1，减到 0 丢弃 |
| Protocol | 上层协议，例如 TCP=6、UDP=17、ICMP=1 |
| Header Checksum | IPv4 头部校验 |
| Source/Destination Address | 源/目标 IPv4 地址 |

## 地址与子网

IPv4 地址常写作点分十进制，例如 `192.168.1.10`。子网掩码或 CIDR 前缀决定网络部分长度，例如：

- `192.168.1.10/24`：网络是 `192.168.1.0`，主机范围通常是 `192.168.1.1-192.168.1.254`。
- `10.0.0.5/8`：私有地址范围的一部分。

常见私有地址：

| 范围 | CIDR |
|---|---|
| 10.0.0.0 - 10.255.255.255 | `10.0.0.0/8` |
| 172.16.0.0 - 172.31.255.255 | `172.16.0.0/12` |
| 192.168.0.0 - 192.168.255.255 | `192.168.0.0/16` |

## 分片与 MTU

IPv4 支持路由器分片，但现代网络通常尽量避免分片。DF 标志表示不要分片，如果包超过路径 MTU，路由器应丢弃并返回 ICMP Fragmentation Needed。TCP 常通过 Path MTU Discovery 选择合适 MSS。

## 常见误区

- IP 不负责可靠性，丢包重传通常由 TCP 或应用处理。
- NAT 不是 IPv4 的一部分，而是由于地址不足而广泛部署的中间机制。
- 同一个主机可以有多个 IP，一个 IP 也可能通过 Anycast 等方式由多个节点提供服务。

## 排查命令

```powershell
ipconfig
route print
ping 192.168.1.1
tracert 8.8.8.8
```

## 参考资料

- RFC 791 - Internet Protocol: <https://www.rfc-editor.org/rfc/rfc791.html>
- RFC 1918 - Private Address Space: <https://www.rfc-editor.org/rfc/rfc1918.html>
- IANA Protocol Numbers: <https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml>

