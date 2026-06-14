# DNS 域名系统学习笔记

最后整理：2026-06-11

DNS（Domain Name System）把人类容易记忆的域名映射到 IP 地址和其他资源记录。它是分布式、层级化、可缓存的命名系统，是互联网基础设施之一。

## 解决的问题

- 人不适合记 IP，应用更适合使用域名。
- 域名需要分布式管理，不能依赖单个中心数据库。
- 查询结果需要缓存以提升性能和降低根服务器压力。

## 层级结构

```text
.
└── com
    └── example
        └── www
```

从右到左层级逐渐变低：根、顶级域、二级域、主机名。

## 常见记录类型

| 类型 | 作用 |
|---|---|
| A | 域名到 IPv4 地址 |
| AAAA | 域名到 IPv6 地址 |
| CNAME | 别名 |
| MX | 邮件交换服务器 |
| NS | 权威 DNS 服务器 |
| TXT | 文本记录，常用于 SPF、验证 |
| SRV | 服务发现 |
| PTR | 反向解析 |

## 解析流程

1. 应用向本机递归解析器查询。
2. 递归解析器查缓存。
3. 未命中时，从根服务器查询 TLD 服务器。
4. 再查询权威服务器。
5. 得到结果后按 TTL 缓存并返回客户端。

## UDP 与 TCP

DNS 传统上主要使用 UDP 53。响应过大、区域传送、某些 DNSSEC 场景会使用 TCP 53。现代还有 DoT（DNS over TLS）和 DoH（DNS over HTTPS）。

## 常见问题

- 本地 hosts 文件、系统缓存、浏览器缓存、递归 DNS 缓存都可能影响结果。
- CNAME 不能和同名其他记录随意共存。
- TTL 太长会导致变更生效慢，TTL 太短会增加查询压力。
- DNS 解析成功不代表服务可访问，后续还要看路由、端口、TLS 和应用。

## 排查命令

```powershell
nslookup example.com
nslookup -type=mx example.com
```

Linux/macOS 常用：

```bash
dig example.com A
dig +trace example.com
```

## 参考资料

- [RFC 1034 - Domain Names Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html)
- [RFC 1035 - Domain Names Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035.html)
- [RFC 8484 - DNS over HTTPS](https://www.rfc-editor.org/rfc/rfc8484.html)

