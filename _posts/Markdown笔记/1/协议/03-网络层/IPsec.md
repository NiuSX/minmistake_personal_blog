# IPsec 学习笔记

最后整理：2026-06-11

IPsec 是一组在 IP 层提供安全能力的协议。它可以为 IP 包提供认证、完整性、防重放和加密，常用于站点到站点 VPN、远程接入 VPN 和主机间安全通信。

## 协议定位

IPsec 位于网络层附近，不是单个协议，而是由 AH、ESP、IKE、SA、安全策略数据库等组成。它可以保护上层 TCP、UDP、ICMP 等流量，对应用基本透明。

## 核心组件

| 组件 | 作用 |
|---|---|
| AH | Authentication Header，提供认证和完整性，不提供加密 |
| ESP | Encapsulating Security Payload，提供加密、完整性、认证等 |
| IKE | Internet Key Exchange，用于协商密钥和安全参数 |
| SA | Security Association，单向安全关联，定义算法、密钥、生命周期 |
| SPD/SAD | 安全策略数据库和安全关联数据库 |

## 传输模式与隧道模式

| 模式 | 说明 | 常见场景 |
|---|---|---|
| 传输模式 | 保护 IP 载荷，原 IP 头大体保留 | 主机到主机 |
| 隧道模式 | 整个原 IP 包被封装进新的 IP 包 | VPN 网关到网关、远程接入 |

## IKE 基本流程

1. 双方协商 IKE SA，建立安全控制通道。
2. 完成身份认证和密钥交换。
3. 协商 Child SA，用于实际 ESP/AH 数据流。
4. 根据生命周期重新协商或删除 SA。

## 常见问题

- NAT 会影响 AH，因为 AH 保护部分 IP 头字段；实际部署更多使用 ESP NAT-T。
- 两端加密套件、PFS、生命周期、流量选择器不一致会导致协商失败。
- VPN 建立成功不代表业务可达，还要检查路由、防火墙、回程路径和 MTU。

## 参考资料

- RFC 4301 - Security Architecture for IP: <https://www.rfc-editor.org/rfc/rfc4301.html>
- RFC 4303 - IP Encapsulating Security Payload: <https://www.rfc-editor.org/rfc/rfc4303.html>
- RFC 7296 - Internet Key Exchange Protocol Version 2: <https://www.rfc-editor.org/rfc/rfc7296.html>

