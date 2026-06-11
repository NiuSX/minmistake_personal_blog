# 10. 网络系统：TCP/IP、Socket、HTTP 与 DNS

最后调研时间：2026-06-11

## 1. 网络系统解决什么问题

网络让不同主机上的进程通信。

核心问题：

- 如何定位对方主机？
- 如何定位对方进程？
- 数据如何分包和重组？
- 丢包如何处理？
- 顺序如何保证？
- 拥塞如何避免？
- 应用协议如何定义语义？

## 2. 分层模型

常见 TCP/IP 分层：

| 层 | 作用 | 示例 |
|---|---|---|
| 应用层 | 应用语义 | HTTP、DNS、SSH |
| 传输层 | 进程到进程通信 | TCP、UDP |
| 网络层 | 主机到主机路由 | IP、ICMP |
| 链路层 | 局域网传输 | Ethernet、Wi-Fi |
| 物理层 | 电信号/无线/光 | 网线、光纤、射频 |

分层的好处：

- 每层关注自己的问题。
- 上层不必知道底层所有细节。
- 协议可替换。

## 3. IP

IP 负责把数据包从源主机送到目标主机。

IPv4 地址示例：

```text
192.168.1.10
```

IPv6 地址示例：

```text
2001:db8::1
```

IP 提供的是尽力而为服务：

- 不保证送达。
- 不保证顺序。
- 不保证不重复。

可靠性通常由传输层或应用层处理。

## 4. 端口

IP 定位主机，端口定位主机上的进程或服务。

```text
IP + Port = 网络通信端点
```

示例：

```text
192.168.1.10:80
```

常见端口：

| 端口 | 协议 |
|---:|---|
| 22 | SSH |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |

## 5. UDP

UDP 是无连接数据报协议。

特点：

- 不建立连接。
- 不保证可靠。
- 不保证顺序。
- 开销低。
- 应用自己处理丢包和重传。

适合：

- DNS。
- 实时音视频。
- 游戏。
- 简单局域网发现。
- 自定义可靠协议。

## 6. TCP

TCP 提供可靠字节流。

特点：

- 面向连接。
- 可靠传输。
- 有序。
- 字节流。
- 流量控制。
- 拥塞控制。

TCP 不保留消息边界：

```text
send("hello")
send("world")
```

接收方可能读到：

```text
helloworld
```

也可能分多次读到。应用层必须自己定义消息边界。

## 7. TCP 连接

三次握手：

```text
Client -> SYN -> Server
Client <- SYN/ACK <- Server
Client -> ACK -> Server
```

四次挥手简化：

```text
一方发送 FIN
对方 ACK
对方也发送 FIN
一方 ACK
```

TIME_WAIT 的作用：

- 确保最后 ACK 可重传。
- 避免旧连接的包影响新连接。

## 8. Socket 编程

服务端流程：

```text
socket
bind
listen
accept
read/write
close
```

客户端流程：

```text
socket
connect
read/write
close
```

简单服务端伪代码：

```c
int fd = socket(AF_INET, SOCK_STREAM, 0);
bind(fd, ...);
listen(fd, SOMAXCONN);
while (1) {
    int client = accept(fd, ...);
    handle(client);
    close(client);
}
```

## 9. DNS

DNS 把域名解析为 IP。

```text
www.example.com -> 93.184.216.34
```

DNS 查询可能涉及：

- 本地缓存。
- 系统 resolver。
- 递归 DNS。
- 根域。
- 顶级域。
- 权威 DNS。

常见记录：

| 记录 | 含义 |
|---|---|
| A | IPv4 地址 |
| AAAA | IPv6 地址 |
| CNAME | 别名 |
| MX | 邮件服务器 |
| TXT | 文本记录 |
| NS | 名称服务器 |

## 10. HTTP

HTTP 是应用层协议，定义请求和响应语义。

请求：

```http
GET /index.html HTTP/1.1
Host: example.com
```

响应：

```http
HTTP/1.1 200 OK
Content-Type: text/html
```

常见方法：

| 方法 | 含义 |
|---|---|
| GET | 获取资源 |
| POST | 提交数据 |
| PUT | 替换资源 |
| PATCH | 部分更新 |
| DELETE | 删除资源 |
| HEAD | 只获取头部 |

常见状态码：

| 状态码 | 含义 |
|---:|---|
| 200 | OK |
| 301/302 | 重定向 |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

## 11. HTTPS 与 TLS

HTTPS = HTTP over TLS。

TLS 提供：

- 加密。
- 身份认证。
- 完整性保护。

HTTPS 不是新应用语义，而是在安全通道上传输 HTTP。

## 12. 网络调试命令

```bash
ip addr
ip route
ping example.com
traceroute example.com
ss -tulpen
curl -v https://example.com
dig example.com
nslookup example.com
tcpdump -i any port 80
```

查看连接：

```bash
ss -tanp
```

抓包：

```bash
sudo tcpdump -i eth0 -nn host 1.2.3.4
```

## 13. 常见问题

| 问题 | 可能原因 |
|---|---|
| connection refused | 目标端口没有进程监听或被拒绝 |
| connection timed out | 网络不通、防火墙、丢包 |
| address already in use | 端口已被占用或 TIME_WAIT 影响 |
| broken pipe | 对端关闭后继续写 |
| too many open files | 连接 fd 泄漏 |
| HTTP 502 | 网关无法从上游获取有效响应 |
| HTTP 504 | 网关等待上游超时 |

## 14. 参考资料

- RFC 9293 - Transmission Control Protocol  
  https://www.rfc-editor.org/rfc/rfc9293

- RFC 9110 - HTTP Semantics  
  https://www.rfc-editor.org/rfc/rfc9110

- Beej's Guide to Network Programming  
  https://beej.us/guide/bgnet/

- Linux man-pages: socket  
  https://man7.org/linux/man-pages/man2/socket.2.html

- Linux man-pages: tcp  
  https://man7.org/linux/man-pages/man7/tcp.7.html

- Linux man-pages: udp  
  https://man7.org/linux/man-pages/man7/udp.7.html

- IANA Service Name and Port Number Registry  
  https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml

