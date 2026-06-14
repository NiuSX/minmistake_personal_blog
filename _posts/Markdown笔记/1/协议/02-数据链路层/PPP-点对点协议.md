# PPP 点对点协议学习笔记

最后整理：2026-06-11

PPP（Point-to-Point Protocol）用于在点对点链路上传输网络层数据包。它曾广泛用于拨号、专线、PPPoE 宽带接入等场景。PPP 不像以太网那样面向共享局域网，而是面向两端之间的链路。

## 解决的问题

- 在串行链路、拨号链路等点对点环境中封装 IP 数据包。
- 支持链路建立、认证、网络层参数协商。
- 能承载多种网络层协议，不只 IPv4。

## 组成部分

| 组件 | 作用 |
|---|---|
| PPP 封装 | 定义帧格式，把上层协议封装进 PPP 帧 |
| LCP | Link Control Protocol，建立、配置、测试、关闭链路 |
| NCP | Network Control Protocol，为不同网络层协议协商参数 |
| PAP/CHAP | 常见认证方式 |

## 基本流程

1. 物理链路建立。
2. LCP 协商链路参数，例如 MRU、认证方式。
3. 认证阶段，可使用 PAP 或 CHAP。
4. NCP 协商网络层参数，例如 IPCP 分配 IPv4 地址。
5. 正式传输 IP 数据包。
6. 链路关闭时通过 LCP 终止。

## PPPoE

PPPoE 是 PPP over Ethernet，把 PPP 封装在以太网中，常用于家庭宽带。它让运营商可以在以太网接入网络中继续使用 PPP 的认证、计费和会话管理能力。

## 常见问题

- PPPoE 会增加额外封装，常见 MTU 为 1492，而普通以太网常见 MTU 为 1500。
- MTU/MSS 配置不当会导致部分网站能打开、部分网站卡住。
- 认证失败、账号绑定、运营商接入设备问题都可能导致拨号失败。

## 参考资料

- [RFC 1661 - The Point-to-Point Protocol](https://www.rfc-editor.org/rfc/rfc1661.html)
- [RFC 2516 - PPP over Ethernet](https://www.rfc-editor.org/rfc/rfc2516.html)

