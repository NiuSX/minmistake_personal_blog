# ASN.1、BER、DER 学习笔记

最后整理：2026-06-11

ASN.1（Abstract Syntax Notation One）是一种描述数据结构的抽象语法标准。BER、DER、CER 是 ASN.1 的编码规则，用于把抽象数据结构变成字节。X.509 证书、SNMP、LDAP、Kerberos 等协议都使用 ASN.1 相关编码。

## 解决的问题

- 不同系统需要用统一方式描述复杂数据结构。
- 数据结构要能跨语言、跨平台编码和解码。
- 安全协议需要确定性编码，避免同一数据有多个二进制表示。

## ASN.1 与编码规则

| 名称 | 说明 |
|---|---|
| ASN.1 | 描述数据类型和结构的抽象语法 |
| BER | Basic Encoding Rules，灵活但同一值可能有多种编码 |
| DER | Distinguished Encoding Rules，BER 的确定性子集 |
| CER | Canonical Encoding Rules，另一种规范化编码 |

## TLV 思想

ASN.1 BER/DER 常使用 TLV 结构：

| 部分 | 含义 |
|---|---|
| Type | 数据类型，例如 INTEGER、SEQUENCE |
| Length | 值的长度 |
| Value | 实际值 |

例如 X.509 证书就是 DER 编码的 ASN.1 结构。证书解析工具展示的 Subject、Issuer、Validity、Public Key 等字段，本质上来自这些结构。

## DER 为什么重要

数字签名要求“被签名的数据字节”必须确定。如果同一个逻辑结构可以有多种 BER 编码，签名验证就会复杂且容易出错。因此证书等安全场景通常使用 DER 这种唯一编码。

## 常见问题

- ASN.1 不是加密算法，它只是数据描述和编码体系。
- DER 文件可能是二进制，PEM 则通常是 DER 的 Base64 文本封装。
- 解析证书时看到的字段值，底层并不是 JSON，而是 ASN.1 DER。

## 参考资料

- [ITU-T X.680 ASN.1](https://www.itu.int/rec/T-REC-X.680)
- [ITU-T X.690 Encoding Rules](https://www.itu.int/rec/T-REC-X.690)
- [RFC 5280 - X.509 PKI Certificate Profile](https://www.rfc-editor.org/rfc/rfc5280.html)

