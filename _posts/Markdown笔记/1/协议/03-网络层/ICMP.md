# ICMP 学习笔记

最后整理：2026-06-11

ICMP（Internet Control Message Protocol）是 IP 的控制与错误报告协议。它不用于承载普通应用数据，而用于报告网络层问题、辅助诊断、支持路径 MTU 发现等。

## 解决的问题

- 目标不可达时如何通知源主机。
- TTL 到期时如何让 traceroute 发现路径。
- 如何测试目标是否可达和往返延迟。
- 如何通知发送方包太大且不能分片。

## 常见 ICMP 类型

| 类型 | 名称 | 用途 |
|---|---|---|
| Echo Request / Echo Reply | 回显请求/应答 | ping 使用 |
| Destination Unreachable | 目标不可达 | 网络、主机、端口不可达等 |
| Time Exceeded | 超时 | TTL 到 0，traceroute 依赖它 |
| Redirect | 重定向 | 路由器提示更好的下一跳 |
| Fragmentation Needed | 需要分片但 DF 置位 | Path MTU Discovery |

## ping 与 traceroute

`ping` 通常发送 ICMP Echo Request，收到 Echo Reply 后计算 RTT。`traceroute`/`tracert` 利用 TTL 逐步增加的包，让路径上的路由器返回 Time Exceeded，从而推断路径。

## ICMP 与安全

完全禁止 ICMP 常常不是好策略。合理做法是限制速率、过滤危险类型、允许必要的错误消息。尤其在 IPv6 中，ICMPv6 是邻居发现和路径 MTU 发现的关键组成部分。

## 常见误区

- ping 不通不一定表示服务不可用，可能是 ICMP 被过滤。
- ping 通也不代表 TCP/UDP 服务可用，应用端口可能关闭。
- traceroute 显示某一跳超时，不一定是该跳故障，可能只是路由器不回复诊断包。

## 参考资料

- RFC 792 - Internet Control Message Protocol: <[https://www.rfc-editor.org/rfc/rfc792.html](https://www.rfc-editor.org/rfc/rfc792.html)>
- RFC 4443 - ICMPv6: <[https://www.rfc-editor.org/rfc/rfc4443.html](https://www.rfc-editor.org/rfc/rfc4443.html)>

