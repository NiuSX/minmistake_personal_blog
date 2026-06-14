# IPv6 学习笔记

最后整理：2026-06-11

IPv6 是 IP 协议的新版本，使用 128 位地址，解决 IPv4 地址空间不足问题，并重新设计了头部、扩展头、邻居发现和自动配置机制。IPv6 不是简单地把地址变长，它的运行方式和 IPv4 有不少差异。

## 解决的问题

- 扩大地址空间，减少对 NAT 的依赖。
- 简化基本头部，让路由器处理更高效。
- 使用扩展头承载可选功能。
- 用 NDP 替代 ARP，实现邻居发现、路由器发现、地址自动配置。

## IPv6 地址

IPv6 地址通常写成十六进制冒号分隔形式：

```text
2001:db8:abcd:0012:0000:0000:0000:0001
2001:db8:abcd:12::1
```

常见地址类型：

| 类型 | 示例 | 说明 |
|---|---|---|
| Global Unicast | `2000::/3` | 全球单播地址 |
| Link-Local | `fe80::/10` | 链路本地地址，不能跨路由器 |
| Unique Local | `fc00::/7` | 类似私有地址 |
| Multicast | `ff00::/8` | 组播地址 |
| Loopback | `::1` | 本机回环 |

## IPv6 基本头部

| 字段 | 作用 |
|---|---|
| Version | IPv6 为 6 |
| Traffic Class | 流量类别 |
| Flow Label | 流标签 |
| Payload Length | 载荷长度 |
| Next Header | 下一个头部，可能是 TCP/UDP 或扩展头 |
| Hop Limit | 类似 IPv4 TTL |
| Source/Destination Address | 128 位源/目标地址 |

## 与 IPv4 的重要差异

- IPv6 基本头部没有头部校验和。
- 路由器不对 IPv6 包进行分片，分片由源主机通过扩展头处理。
- IPv6 使用 NDP，不使用 ARP。
- 广播被组播替代。
- 最小链路 MTU 要求更高，Path MTU Discovery 更重要。

## 常见误区

- IPv6 不等于一定更安全，安全性取决于配置、过滤、主机防火墙和应用。
- IPv6 地址多不代表网络可以不规划，前缀、路由聚合和安全边界仍然重要。
- 关闭 ICMPv6 可能破坏 NDP 和 Path MTU Discovery。

## 参考资料

- RFC 8200 - Internet Protocol, Version 6 Specification: <[https://www.rfc-editor.org/rfc/rfc8200.html](https://www.rfc-editor.org/rfc/rfc8200.html)>
- RFC 4861 - Neighbor Discovery for IPv6: <[https://www.rfc-editor.org/rfc/rfc4861.html](https://www.rfc-editor.org/rfc/rfc4861.html)>
- RFC 4862 - IPv6 Stateless Address Autoconfiguration: <[https://www.rfc-editor.org/rfc/rfc4862.html](https://www.rfc-editor.org/rfc/rfc4862.html)>

