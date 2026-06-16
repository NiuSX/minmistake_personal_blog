# 07-安全、认证授权与 API 防护

> 本文目标：系统理解后端安全基础，包括认证、授权、Session、Token、JWT、OAuth 2.0、OpenID Connect、RBAC、ABAC、对象级权限、OWASP API 安全风险、常见攻击、防护策略、密钥管理和审计。

## 1. 后端安全的基本原则

后端安全不能依赖前端。前端隐藏按钮、禁用输入框、校验字段，都只能改善用户体验，不能作为安全边界。攻击者可以绕过前端，直接构造 HTTP 请求。

安全设计基本原则：

- 默认拒绝，而不是默认允许。
- 每个接口都要明确是否需要认证。
- 每个资源都要校验对象级权限。
- 所有输入都不可信。
- 所有敏感操作都要审计。
- 凭证必须安全存储和传输。
- 权限变更要能及时生效。
- 密钥不能进入代码仓库。

## 2. 认证与授权

| 概念 | 含义 |
| --- | --- |
| Authentication | 认证，证明你是谁 |
| Authorization | 授权，判断你能做什么 |
| Principal | 当前主体 |
| Credential | 凭证，如密码、Token、证书 |
| Role | 角色 |
| Permission | 权限 |
| Policy | 策略 |

例子：

- 登录成功是认证。
- 判断用户能否删除某订单是授权。

常见错误：

- 只判断是否登录，不判断资源归属。
- 管理后台接口只在前端隐藏。
- 普通用户通过改 ID 访问别人的数据。
- 权限缓存长期不刷新。

## 3. Cookie、Session、Token

### 3.1 Cookie

Cookie 是浏览器自动保存并携带的数据。

安全属性：

| 属性 | 作用 |
| --- | --- |
| HttpOnly | 防止 JavaScript 读取 Cookie |
| Secure | 只通过 HTTPS 发送 |
| SameSite | 降低 CSRF 风险 |
| Max-Age/Expires | 控制有效期 |

### 3.2 Session

Session 把状态存在服务端，客户端只保存 Session ID。

优点：

- 服务端可主动失效。
- 敏感信息不暴露。
- 权限变化较易控制。

缺点：

- 多实例需要共享 Session。
- Session 存储成为依赖。
- 移动端和开放 API 不一定方便。

### 3.3 Token

Token 由客户端保存，请求时携带。

优点：

- 适合 API 和移动端。
- 跨服务更灵活。

风险：

- Token 泄露即身份泄露。
- 撤销复杂。
- 长有效期风险高。

## 4. JWT

JWT 是一种 Token 格式，通常由三部分组成：

```text
header.payload.signature
```

### 4.1 JWT 适合什么

适合：

- 跨服务传递身份声明。
- 短有效期 Access Token。
- 无状态验证。

不适合：

- 存放敏感明文。
- 长期会话。
- 需要频繁撤销的权限状态。

### 4.2 JWT 常见错误

- 不校验签名。
- 接受 `none` 算法。
- 不校验过期时间。
- 不校验 issuer 和 audience。
- 把敏感数据放 payload。
- Token 有效期过长。
- 密钥长期不轮换。

JWT payload 只是 Base64URL 编码，不是加密。任何拿到 Token 的人都能解码 payload。

## 5. OAuth 2.0

OAuth 2.0 是授权框架，不是单纯登录协议。

### 5.1 角色

| 角色 | 含义 |
| --- | --- |
| Resource Owner | 资源拥有者，通常是用户 |
| Client | 客户端应用 |
| Authorization Server | 授权服务器 |
| Resource Server | 资源服务器 |

### 5.2 Token

| Token | 用途 |
| --- | --- |
| Access Token | 访问资源 |
| Refresh Token | 换取新的 Access Token |

Access Token 应短有效期。Refresh Token 要更严格保护，并支持撤销。

### 5.3 授权码流程

授权码流程适合服务端 Web 应用和安全客户端。

简化流程：

1. Client 引导用户到授权服务器。
2. 用户登录并授权。
3. 授权服务器回调 Client，带 authorization code。
4. Client 用 code 换 access token。
5. Client 用 access token 访问资源服务器。

### 5.4 PKCE

PKCE 用于增强公共客户端安全，常用于移动端和单页应用。它减少授权码被截获后的风险。

## 6. OpenID Connect

OpenID Connect 是建立在 OAuth 2.0 上的身份认证层。

OAuth 2.0 解决授权，OIDC 解决“用户是谁”。

OIDC 重要概念：

- ID Token。
- UserInfo Endpoint。
- issuer。
- audience。
- subject。

ID Token 用于表达用户身份，不应被当作访问资源 API 的 Access Token 滥用。

## 7. 授权模型

### 7.1 RBAC

RBAC 是基于角色的访问控制。

模型：

```text
用户 -> 角色 -> 权限
```

适合：

- 企业后台。
- 管理系统。
- 权限相对稳定。

问题：

- 角色过多会膨胀。
- 细粒度资源权限表达困难。

### 7.2 ABAC

ABAC 是基于属性的访问控制。

根据属性判断：

- 用户属性：部门、等级、地区。
- 资源属性：owner、状态、分类。
- 环境属性：时间、IP、设备。
- 操作属性：读、写、删除、审批。

适合复杂权限，但策略管理更复杂。

### 7.3 对象级权限

对象级权限是 API 安全重点。

例子：

```text
GET /orders/{orderId}
```

后端不能只判断用户已登录，还要判断订单是否属于该用户，或者用户是否具备管理权限。

对象级权限缺失是 OWASP API 安全中非常常见的问题。

## 8. OWASP API Security Top 10

OWASP API Security Top 10 2023 包括：

- 对象级授权失效。
- 认证失效。
- 对象属性级授权失效。
- 不受限制的资源消耗。
- 功能级授权失效。
- 敏感业务流无限制访问。
- 服务端请求伪造。
- 安全配置错误。
- 不当资产管理。
- 不安全的 API 消费。

### 8.1 对象级授权失效

攻击方式：

```text
GET /orders/1001
GET /orders/1002
```

如果用户能通过改 ID 访问别人订单，就是对象级授权失败。

防护：

- 每次访问资源都检查 owner 或权限策略。
- 不依赖前端传来的用户 ID。
- 管理权限和普通权限分开。

### 8.2 不受限制的资源消耗

例子：

- 无分页导出。
- 上传超大文件。
- 查询时间范围无限制。
- GraphQL 深度无限制。
- 登录接口无限尝试。

防护：

- 限流。
- 分页上限。
- 文件大小限制。
- 查询复杂度限制。
- 超时。

## 9. 常见攻击

### 9.1 SQL 注入

攻击者通过输入修改 SQL 语义。

防护：

- 参数化查询。
- ORM 安全 API。
- 输入校验。
- 最小数据库权限。
- 不拼接用户输入到 SQL。

### 9.2 XSS

XSS 是注入脚本，让其他用户浏览器执行。

防护：

- 输出编码。
- 富文本白名单过滤。
- CSP。
- Cookie 使用 HttpOnly。

### 9.3 CSRF

CSRF 利用浏览器自动携带 Cookie 的特性，诱导用户发起请求。

防护：

- CSRF Token。
- SameSite Cookie。
- 重要操作二次确认。
- 检查 Origin/Referer。

### 9.4 SSRF

SSRF 诱导服务端访问攻击者指定地址，可能访问内网服务。

防护：

- URL 白名单。
- 禁止访问内网地址。
- DNS 解析后校验 IP。
- 限制协议。
- 网络隔离。

### 9.5 重放攻击

攻击者重复发送捕获的请求。

防护：

- 时间戳。
- Nonce。
- 签名。
- 幂等键。
- 短有效期。

## 10. 输入校验

所有输入都不可信。

校验内容：

- 类型。
- 长度。
- 范围。
- 枚举。
- 格式。
- 必填。
- 文件类型和大小。
- 嵌套对象深度。

校验分层：

- 接口层做格式校验。
- 应用层做用例校验。
- 领域层保证业务不变量。
- 数据库用约束兜底。

## 11. 敏感数据保护

敏感数据包括：

- 密码。
- Token。
- 身份证号。
- 手机号。
- 邮箱。
- 银行卡。
- 地址。
- 私钥。
- API Key。

保护措施：

- 传输加密。
- 存储加密或哈希。
- 日志脱敏。
- 权限最小化。
- 密钥管理。
- 访问审计。

密码不能明文存储，应该使用专门的密码哈希算法，并加盐。

## 12. 密钥管理

密钥不能：

- 写进代码。
- 提交到 Git。
- 写进普通配置文件。
- 打印到日志。
- 通过聊天工具随意传。

应使用：

- Secret 管理。
- KMS。
- 环境隔离。
- 权限控制。
- 定期轮换。
- 泄露应急流程。

## 13. 审计日志

敏感操作要有审计。

应记录：

- 谁操作。
- 什么时候。
- 从哪里。
- 做了什么。
- 操作对象。
- 结果。
- 请求 ID。

审计日志要防篡改，至少不能由普通业务逻辑随意删除。

## 14. 安全发布检查清单

- 接口是否需要登录？
- 是否有对象级权限？
- 是否校验输入？
- 是否限制分页和查询范围？
- 是否有限流？
- 是否有幂等？
- 是否记录审计？
- 是否隐藏内部错误？
- 是否脱敏日志？
- 是否使用 HTTPS？
- 密钥是否来自安全配置？
- Token 是否短有效期？
- 管理接口是否隔离？

## 15. 本章小结

后端安全的核心是：不要相信客户端、不要暴露内部细节、不要把认证和授权混为一谈、不要忽略对象级权限、不要让敏感信息进入日志、不要把密钥写进代码。安全能力需要在设计阶段就进入系统，而不是上线前临时补。

## 16. 参考资料

- OWASP API Security Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- OAuth 2.0 RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749
- OpenID Connect Core: https://openid.net/specs/openid-connect-core-1_0.html
- JWT RFC 7519: https://datatracker.ietf.org/doc/html/rfc7519
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
