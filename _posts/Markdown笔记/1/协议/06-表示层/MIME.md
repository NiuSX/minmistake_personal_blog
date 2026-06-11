# MIME 多用途互联网邮件扩展学习笔记

最后整理：2026-06-11

MIME（Multipurpose Internet Mail Extensions）最初用于扩展电子邮件，使邮件可以携带非 ASCII 文本、附件、多部分内容和不同媒体类型。后来 MIME 的媒体类型体系也被 HTTP 广泛使用，例如 `Content-Type: application/json`。

## 解决的问题

- 原始邮件主要面向 ASCII 文本，无法很好表达图片、附件、HTML、多语言文本。
- 接收方需要知道一段字节应该按什么类型解析。
- 一个消息需要同时包含多种内容，例如正文和附件。

## 核心头字段

| 字段 | 作用 |
|---|---|
| MIME-Version | 表示消息使用 MIME |
| Content-Type | 内容类型，例如 `text/plain; charset=utf-8` |
| Content-Transfer-Encoding | 传输编码，例如 base64、quoted-printable |
| Content-Disposition | 内容展示方式，例如 inline、attachment |
| Content-ID | 标识消息中的嵌入资源 |

## Media Type

媒体类型由 type/subtype 组成：

| 类型 | 示例 |
|---|---|
| text | `text/plain`、`text/html` |
| image | `image/png`、`image/jpeg` |
| application | `application/json`、`application/pdf` |
| multipart | `multipart/mixed`、`multipart/form-data` |

## multipart

multipart 使用 boundary 分隔多个部分。HTTP 表单上传文件时常用 `multipart/form-data`，邮件带附件时常用 `multipart/mixed`。

## 常见问题

- `Content-Type` 错误会导致浏览器、邮件客户端或 API 客户端误解析。
- `charset` 缺失或错误会导致乱码。
- base64 是编码不是加密，任何人都可以解码。
- 文件扩展名不可靠，协议解析应优先看 Content-Type 和实际内容检测。

## 参考资料

- RFC 2045 - MIME Part One: <https://www.rfc-editor.org/rfc/rfc2045.html>
- RFC 2046 - MIME Media Types: <https://www.rfc-editor.org/rfc/rfc2046.html>
- RFC 6838 - Media Type Registration: <https://www.rfc-editor.org/rfc/rfc6838.html>
- IANA Media Types: <https://www.iana.org/assignments/media-types/media-types.xhtml>

