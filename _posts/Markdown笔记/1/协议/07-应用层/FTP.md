# FTP 文件传输协议学习笔记

最后整理：2026-06-11

FTP（File Transfer Protocol）是经典文件传输协议。它使用控制连接发送命令，并使用单独的数据连接传输目录列表和文件内容。FTP 明文传输用户名、密码和数据，现代公网环境更推荐 SFTP、HTTPS 或 FTPS。

## 解决的问题

- 客户端和服务器之间上传、下载、删除、列目录。
- 支持登录、目录切换、文件类型和传输模式。
- 控制命令和数据传输分离。

## 控制连接与数据连接

| 连接 | 作用 |
|---|---|
| 控制连接 | TCP 21，发送 USER、PASS、LIST、RETR、STOR 等命令 |
| 数据连接 | 传输文件内容或目录列表 |

## 主动模式与被动模式

| 模式 | 说明 | NAT/防火墙影响 |
|---|---|---|
| 主动模式 | 服务器主动连回客户端数据端口 | 客户端在 NAT 后常失败 |
| 被动模式 | 客户端连接服务器开放的数据端口 | 更适合现代网络，但服务器需放行端口范围 |

## 常见命令

| 命令 | 作用 |
|---|---|
| USER/PASS | 登录 |
| PWD/CWD | 查看/切换目录 |
| LIST | 列目录 |
| RETR | 下载文件 |
| STOR | 上传文件 |
| PASV | 进入被动模式 |
| QUIT | 退出 |

## 安全替代

- FTPS：FTP over TLS，保留 FTP 模型但增加 TLS。
- SFTP：SSH File Transfer Protocol，运行在 SSH 上，不是 FTP over SSH。
- HTTPS：很多文件分发场景更简单。

## 常见问题

- 登录成功但列目录失败，通常是数据连接端口被防火墙或 NAT 阻断。
- 主动/被动模式混淆是 FTP 排查中最常见问题。
- 明文 FTP 不适合传输敏感信息。

## 参考资料

- [RFC 959 - File Transfer Protocol](https://www.rfc-editor.org/rfc/rfc959.html)
- [RFC 4217 - Securing FTP with TLS](https://www.rfc-editor.org/rfc/rfc4217.html)

