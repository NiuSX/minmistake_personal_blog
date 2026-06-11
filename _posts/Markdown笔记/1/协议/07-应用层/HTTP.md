# HTTP 超文本传输协议学习笔记

最后整理：2026-06-11

HTTP（Hypertext Transfer Protocol）是 Web 的核心应用层协议。它定义了请求、响应、方法、状态码、头字段、缓存、内容协商和资源语义。HTTP 可以运行在 TCP 上，也可以通过 TLS 形成 HTTPS；HTTP/3 则运行在 QUIC 上。

## 解决的问题

- 客户端如何请求资源。
- 服务器如何返回状态、元数据和内容。
- 缓存、代理、认证、重定向、内容协商如何统一表达。
- API 如何用通用语义进行交互。

## 请求与响应

```http
GET /users/1 HTTP/1.1
Host: example.com
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{"id":1,"name":"Alice"}
```

## 常见方法

| 方法 | 语义 |
|---|---|
| GET | 获取资源，应安全且幂等 |
| POST | 提交数据，常用于创建或触发处理 |
| PUT | 替换资源，通常幂等 |
| PATCH | 部分更新 |
| DELETE | 删除资源，通常幂等 |
| HEAD | 只获取响应头 |
| OPTIONS | 查询支持的方法或 CORS 预检 |

## 状态码分类

| 范围 | 含义 |
|---|---|
| 1xx | 信息性响应 |
| 2xx | 成功 |
| 3xx | 重定向 |
| 4xx | 客户端错误 |
| 5xx | 服务端错误 |

## HTTP 版本

| 版本 | 特点 |
|---|---|
| HTTP/1.1 | 文本协议，持久连接，队头阻塞明显 |
| HTTP/2 | 二进制分帧，多路复用，头压缩 |
| HTTP/3 | 基于 QUIC，减少传输层队头阻塞 |

## 常见问题

- 404 表示资源不存在或路由不匹配，不一定是网络不通。
- 502/503/504 常与反向代理、上游服务、超时、负载均衡有关。
- GET 请求不应产生有副作用的业务操作。
- 缓存问题要看 `Cache-Control`、`ETag`、`Last-Modified`、代理缓存策略。
- HTTPS 问题要同时看 HTTP、TLS、证书和 SNI。

## 排查命令

```powershell
curl -v https://example.com
curl -I https://example.com
curl --http3 https://example.com
```

## 参考资料

- RFC 9110 - HTTP Semantics: <https://www.rfc-editor.org/rfc/rfc9110.html>
- RFC 9112 - HTTP/1.1: <https://www.rfc-editor.org/rfc/rfc9112.html>
- RFC 9113 - HTTP/2: <https://www.rfc-editor.org/rfc/rfc9113.html>
- RFC 9114 - HTTP/3: <https://www.rfc-editor.org/rfc/rfc9114.html>

