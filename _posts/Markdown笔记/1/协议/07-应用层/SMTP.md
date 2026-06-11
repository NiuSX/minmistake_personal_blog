# SMTP 简单邮件传输协议学习笔记

最后整理：2026-06-11

SMTP（Simple Mail Transfer Protocol）用于邮件提交和服务器之间的邮件传输。它负责把邮件从发送方邮件系统传递到接收方邮件系统，但用户读取邮件通常使用 IMAP 或 POP3。

## 解决的问题

- 邮件客户端如何把邮件提交给邮件服务器。
- 邮件服务器之间如何转发邮件。
- 如何通过 MX 记录找到收件域的邮件服务器。
- 如何表达发件人、收件人、邮件数据和传输状态。

## 常见端口

| 端口 | 用途 |
|---:|---|
| 25 | 邮件服务器之间传输 |
| 587 | 邮件提交，通常需要认证和 STARTTLS |
| 465 | 隐式 TLS 邮件提交，历史上非标准，后来重新规范 |

## 基本命令

| 命令 | 作用 |
|---|---|
| HELO/EHLO | 客户端问候，EHLO 可发现扩展 |
| MAIL FROM | 指定信封发件人 |
| RCPT TO | 指定信封收件人 |
| DATA | 开始发送邮件内容 |
| STARTTLS | 升级到 TLS |
| AUTH | 身份认证 |
| QUIT | 结束会话 |

## 邮件传输流程

1. 发送方根据收件人域名查询 MX 记录。
2. 连接目标邮件服务器 25 端口。
3. 使用 SMTP 命令提交信封发件人、收件人和邮件内容。
4. 接收方服务器接收后投递到邮箱或继续转发。
5. 用户通过 IMAP/POP3/Webmail 读取。

## 反垃圾与身份验证

| 机制 | 作用 |
|---|---|
| SPF | 声明哪些服务器可以代表域名发信 |
| DKIM | 对邮件内容签名，证明未被篡改且与域名关联 |
| DMARC | 基于 SPF/DKIM 给出域名级处理策略 |

## 常见问题

- SMTP 传输成功不代表进入收件箱，可能进垃圾箱或被后续策略拦截。
- 发件人显示地址和 SMTP 信封发件人不是同一概念。
- 25 端口常被云厂商或运营商限制，应用提交邮件通常用 587。

## 参考资料

- RFC 5321 - Simple Mail Transfer Protocol: <https://www.rfc-editor.org/rfc/rfc5321.html>
- RFC 5322 - Internet Message Format: <https://www.rfc-editor.org/rfc/rfc5322.html>
- RFC 7208 - SPF: <https://www.rfc-editor.org/rfc/rfc7208.html>
- RFC 6376 - DKIM: <https://www.rfc-editor.org/rfc/rfc6376.html>
- RFC 7489 - DMARC: <https://www.rfc-editor.org/rfc/rfc7489.html>

