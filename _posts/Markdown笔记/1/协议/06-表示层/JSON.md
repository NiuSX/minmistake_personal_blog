# JSON 数据交换格式学习笔记

最后整理：2026-06-11

JSON（JavaScript Object Notation）是一种轻量级数据交换格式。它不是网络传输协议，但在 HTTP API、配置文件、日志、消息队列和 RPC 中极其常见，因此适合作为表示层学习内容。

## 解决的问题

- 用简单文本表示结构化数据。
- 跨语言传递对象、数组、字符串、数字、布尔值和空值。
- 便于人阅读，也便于程序解析。

## 数据类型

| 类型 | 示例 |
|---|---|
| object | `{"name":"alice"}` |
| array | `[1,2,3]` |
| string | `"hello"` |
| number | `123`、`3.14` |
| boolean | `true`、`false` |
| null | `null` |

## 示例

```json
{
  "id": 1001,
  "name": "Alice",
  "roles": ["admin", "editor"],
  "active": true,
  "profile": {
    "email": "alice@example.com"
  }
}
```

## 常见问题

- JSON 标准不支持注释，配置文件中带注释通常是 JSONC、HJSON 或其他扩展。
- JSON number 没有区分 int、long、float，跨语言可能出现精度问题。
- 时间没有内建类型，通常使用 ISO 8601 字符串或时间戳，需要团队统一。
- 字段缺失、字段为 null、字段为空字符串是三种不同语义。
- 对外 API 需要考虑兼容性，新增字段通常安全，删除或改类型风险较大。

## JSON 与其他格式

| 格式 | 特点 |
|---|---|
| JSON | 文本、简单、生态好 |
| XML | 表达能力强，冗长，历史系统多 |
| YAML | 适合配置，人类可读，但语法细节多 |
| Protobuf | 二进制、高效、强 schema |
| CBOR | 二进制 JSON 风格，适合受限环境 |

## 参考资料

- RFC 8259 - The JavaScript Object Notation Data Interchange Format: <https://www.rfc-editor.org/rfc/rfc8259.html>
- ECMA-404 JSON Data Interchange Syntax: <https://www.ecma-international.org/publications-and-standards/standards/ecma-404/>

