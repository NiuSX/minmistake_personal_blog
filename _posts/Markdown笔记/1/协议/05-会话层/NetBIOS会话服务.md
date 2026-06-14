# NetBIOS 会话服务学习笔记

最后整理：2026-06-11

NetBIOS 是早期局域网应用接口和服务模型，包含名称服务、数据报服务、会话服务。NetBIOS Session Service 提供面向连接的会话通信，常与 SMB/CIFS 的历史实现相关。

## 协议定位

NetBIOS over TCP/IP 在 RFC 1001 和 RFC 1002 中定义。它把 NetBIOS 名称、数据报和会话服务映射到 TCP/IP 网络上。会话服务通常使用 TCP 139 端口。

## 组成

| 服务 | 端口 | 作用 |
|---|---:|---|
| NetBIOS Name Service | UDP/TCP 137 | 名称注册与解析 |
| NetBIOS Datagram Service | UDP 138 | 无连接数据报 |
| NetBIOS Session Service | TCP 139 | 面向连接的会话通信 |

## 会话服务流程

1. 客户端解析目标 NetBIOS 名称。
2. 客户端连接 TCP 139。
3. 发起 NetBIOS 会话请求，包含调用方和被调用方名称。
4. 服务端接受或拒绝会话。
5. 双方在会话上交换 SMB 等上层数据。
6. 会话结束时释放连接。

## 现代意义

现代 Windows 文件共享更多使用 Direct-hosted SMB over TCP 445，而不是依赖 NetBIOS over TCP/IP。但理解 NetBIOS 有助于排查旧系统、老设备、跨网段名称解析和 Windows 局域网发现问题。

## 常见问题

- 137/138/139 与 445 的区别不清，导致防火墙策略配置错误。
- 跨网段 NetBIOS 名称发现不可靠，需要 WINS、DNS 或直接使用 FQDN。
- 旧版本 SMB 和 NetBIOS 暴露面较大，不建议在公网开放。

## 参考资料

- [RFC 1001 - Protocol Standard for a NetBIOS Service on a TCP/UDP Transport](https://www.rfc-editor.org/rfc/rfc1001.html)
- [RFC 1002 - NetBIOS Service Detailed Specifications](https://www.rfc-editor.org/rfc/rfc1002.html)

