# 02-网络、HTTP 与 API 设计

> 本文目标：系统理解后端请求如何通过网络到达服务，HTTP 如何表达请求和响应，API 如何设计成稳定、清晰、可演进的契约，以及 REST、RPC、GraphQL、WebSocket、SSE、Webhook 等接口形式各自适合什么场景。

## 1. 请求从哪里来

一次后端请求通常不是“客户端直接调用服务代码”这么简单。真实链路可能是：

```mermaid
sequenceDiagram
  participant User as 用户
  participant DNS as DNS
  participant CDN as CDN/边缘节点
  participant LB as 负载均衡/网关
  participant API as 后端 API
  participant DB as 数据库/缓存/下游
  User->>DNS: 解析域名
  DNS-->>User: 返回 IP
  User->>CDN: 建立连接并请求资源/API
  CDN->>LB: 回源或转发
  LB->>API: 路由到服务实例
  API->>DB: 查询或写入数据
  DB-->>API: 返回结果
  API-->>LB: 响应
  LB-->>CDN: 响应
  CDN-->>User: 响应用户
```

这个链路中每一层都可能影响后端表现：

- DNS 解析失败，用户根本找不到服务。
- CDN 缓存策略错误，用户看到旧数据或敏感数据泄露。
- 网关路由错误，请求进入错误服务。
- 负载均衡健康检查错误，流量打到坏实例。
- API 线程池耗尽，请求排队。
- 数据库慢查询，接口超时。
- 下游服务不可用，引发重试风暴。

所以后端工程师至少要知道请求链路中每一段的职责。

## 2. DNS

DNS 负责把域名解析成 IP 地址。用户访问 `example.com` 时，客户端并不知道服务在哪里，需要先通过 DNS 查询。

### 2.1 DNS 常见记录

| 记录 | 含义 | 例子 |
| --- | --- | --- |
| A | 域名到 IPv4 | `example.com -> 93.184.216.34` |
| AAAA | 域名到 IPv6 | `example.com -> 2606:...` |
| CNAME | 域名别名 | `www.example.com -> example.com` |
| MX | 邮件服务器 | 邮箱投递 |
| TXT | 文本记录 | 域名验证、SPF、DKIM |
| NS | 权威 DNS 服务器 | 指定谁管理域名 |

### 2.2 TTL

TTL 表示 DNS 记录可缓存多久。

TTL 太长：

- 域名切换慢。
- 故障迁移慢。
- 旧 IP 可能被客户端继续使用。

TTL 太短：

- DNS 查询压力增加。
- 解析链路更频繁。

工程上要根据场景选择。稳定域名可以长一点，故障切换敏感的入口域名可以短一点。但要注意，客户端、操作系统、运行时、代理和递归 DNS 都可能缓存结果，不是你把 TTL 改短就一定立刻全网生效。

## 3. TCP、UDP 与 QUIC

### 3.1 TCP

TCP 是可靠、有序、面向连接的传输协议。HTTP/1.1 和 HTTP/2 通常运行在 TCP 上。

TCP 提供：

- 连接建立。
- 顺序传输。
- 丢包重传。
- 流量控制。
- 拥塞控制。

后端关注点：

- 连接建立有成本，因此需要连接复用。
- 大量短连接会增加握手和关闭开销。
- 网络丢包会导致重传和延迟抖动。
- 连接池配置会影响吞吐。
- TIME_WAIT、CLOSE_WAIT 异常可能说明连接管理有问题。

### 3.2 UDP

UDP 无连接、不保证可靠和顺序。它开销小，适合实时性要求高、应用层可处理丢包的场景。

常见场景：

- 音视频。
- 游戏。
- DNS。
- QUIC 底层。

普通业务 API 通常不直接用 UDP。

### 3.3 QUIC

QUIC 基于 UDP，在传输层和安全层做了新的设计。HTTP/3 使用 QUIC。它的目标包括减少握手延迟、改善队头阻塞问题、支持连接迁移。

后端学习时可以先知道：

- HTTP/3 不是简单的 HTTP/2 小版本升级。
- QUIC 对移动网络切换更友好。
- 不是所有基础设施都完整支持 HTTP/3。

## 4. TLS 与 HTTPS

HTTPS 是 HTTP over TLS。TLS 解决三个问题：

- 机密性：中间人不能直接看到明文。
- 完整性：传输内容不能被无声篡改。
- 身份认证：客户端能确认服务端证书属于目标域名。

### 4.1 证书链

服务端证书通常由 CA 签发，客户端通过证书链验证信任。

常见问题：

- 证书过期。
- 证书域名不匹配。
- 中间证书缺失。
- 使用弱加密套件。
- 私钥泄露。

后端系统要把证书过期纳入监控。很多严重故障不是代码问题，而是证书到期没人续。

### 4.2 TLS 终止

TLS 终止指在哪一层解密 HTTPS。

常见位置：

- CDN。
- 负载均衡。
- API 网关。
- 应用服务本身。

如果 TLS 在网关终止，网关到应用之间可能是明文，也可能重新加密。内部链路是否加密取决于安全要求、网络边界和基础设施能力。

## 5. HTTP 基础

HTTP 是无状态应用层协议。无状态不代表系统没有状态，而是协议本身不会自动记住上一次请求。状态通常由 Cookie、Session、Token、数据库和缓存维护。

### 5.1 请求结构

一个 HTTP 请求包括：

- 方法：GET、POST、PUT、PATCH、DELETE。
- 路径：资源位置。
- 查询参数：过滤、分页、排序等。
- Header：元信息。
- Body：请求体。

示例：

```http
POST /orders HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>
Idempotency-Key: 20260616-abc

{
  "skuId": "sku_1001",
  "quantity": 2,
  "addressId": "addr_01"
}
```

后端要处理：

- Header 是否完整。
- Token 是否有效。
- Body 是否可解析。
- 参数是否符合格式。
- 业务规则是否满足。
- 幂等键是否重复。
- 用户是否有权限操作资源。

### 5.2 响应结构

响应包括：

- 状态码。
- Header。
- Body。

示例：

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /orders/order_1001
Traceparent: 00-...

{
  "id": "order_1001",
  "status": "CREATED"
}
```

错误响应也应该结构化：

```json
{
  "code": "ORDER_STOCK_NOT_ENOUGH",
  "message": "库存不足",
  "requestId": "req_123",
  "details": {
    "skuId": "sku_1001"
  }
}
```

不要把内部异常堆栈、SQL、服务器路径或密钥信息返回给客户端。

## 6. HTTP 方法

| 方法 | 语义 | 是否安全 | 是否幂等 | 常见用途 |
| --- | --- | --- | --- | --- |
| GET | 获取资源 | 是 | 是 | 查询列表、详情 |
| HEAD | 获取响应头 | 是 | 是 | 检查资源是否存在或是否变化 |
| POST | 提交处理 | 否 | 通常否 | 创建资源、提交动作 |
| PUT | 整体替换 | 否 | 是 | 替换完整资源 |
| PATCH | 局部更新 | 否 | 不一定 | 修改部分字段 |
| DELETE | 删除资源 | 否 | 是 | 删除资源 |
| OPTIONS | 查询能力 | 是 | 是 | CORS 预检 |

### 6.1 安全方法

安全方法指语义上不应该修改服务端资源。GET 和 HEAD 是安全方法。后端不要设计 `GET /deleteUser?id=1` 这种接口，因为浏览器、爬虫、代理、预加载系统可能自动发 GET 请求。

### 6.2 幂等方法

幂等指同一个请求执行一次和执行多次，对资源最终状态的影响相同。

例如：

- `PUT /users/1` 把用户名字设置成 “Alice”，执行多次结果一样。
- `DELETE /users/1` 删除用户，执行多次用户最终都不存在。
- `POST /orders` 创建订单，执行多次可能创建多个订单，因此默认不幂等。

对于支付、下单、转账、发放优惠券这类 POST 动作，必须做业务幂等。

## 7. HTTP 状态码

状态码是协议级结果，不应该被完全替代为“永远 200 + 业务 code”。

### 7.1 常用状态码

| 状态码 | 含义 | 场景 |
| --- | --- | --- |
| 200 | 成功 | 查询成功、普通操作成功 |
| 201 | 已创建 | 创建资源成功 |
| 202 | 已接受 | 异步任务已提交 |
| 204 | 无响应体 | 删除成功但不返回内容 |
| 301 | 永久重定向 | URL 永久迁移 |
| 302 | 临时重定向 | 临时跳转 |
| 304 | 未修改 | 协商缓存命中 |
| 400 | 请求格式错误 | JSON 错误、参数格式错误 |
| 401 | 未认证 | 未登录、Token 无效 |
| 403 | 无权限 | 已登录但无权访问 |
| 404 | 不存在 | 路径或资源不存在 |
| 409 | 冲突 | 重复创建、版本冲突 |
| 422 | 语义错误 | 业务校验失败 |
| 429 | 请求过多 | 限流 |
| 500 | 内部错误 | 未预期异常 |
| 502 | 网关错误 | 上游返回错误 |
| 503 | 服务不可用 | 过载、维护、熔断 |
| 504 | 网关超时 | 上游超时 |

### 7.2 401 与 403

401 是“你还没有证明你是谁”或凭证无效。403 是“我知道你是谁，但你没有权限”。

例如：

- 未携带 Token 访问用户资料：401。
- 普通用户访问管理员接口：403。
- 用户访问别人的订单：403 或 404，具体取决于是否想隐藏资源存在性。

### 7.3 409 与幂等

409 表示请求和当前资源状态冲突。例如：

- 创建用户名时用户名已经存在。
- 使用旧版本号更新资源。
- 订单已经支付，不能取消。

409 常和状态机、乐观锁、唯一约束一起出现。

## 8. Header 设计

Header 用于传递元数据。常见 Header：

| Header | 用途 |
| --- | --- |
| Content-Type | 请求或响应体类型 |
| Accept | 客户端期望响应类型 |
| Authorization | 认证凭证 |
| Cookie | 浏览器携带状态 |
| Set-Cookie | 服务端设置 Cookie |
| Cache-Control | 缓存策略 |
| ETag | 资源版本 |
| If-None-Match | 协商缓存 |
| Location | 新资源地址或重定向地址 |
| Retry-After | 告诉客户端多久后重试 |
| Idempotency-Key | 幂等键 |
| Traceparent | W3C Trace Context |
| X-Request-ID | 请求 ID |

### 8.1 Content-Type

`Content-Type` 必须和 Body 格式一致。常见值：

- `application/json`
- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `text/plain`
- `application/octet-stream`

文件上传通常使用 `multipart/form-data` 或直传对象存储。

### 8.2 Authorization

常见格式：

```http
Authorization: Bearer <access_token>
```

注意：

- Token 不要放 URL 查询参数。
- Token 不要写入普通日志。
- Token 要通过 HTTPS 传输。

### 8.3 X-Forwarded-For

代理常用 `X-Forwarded-For` 记录原始 IP。但客户端也可以伪造这个头。后端只有在请求来自可信网关时，才能信任由网关整理后的客户端 IP。

## 9. Cookie、Session 与 Token

### 9.1 Cookie

Cookie 是浏览器保存并自动携带的小段数据。

重要属性：

| 属性 | 作用 |
| --- | --- |
| HttpOnly | 禁止 JavaScript 读取，降低 XSS 窃取风险 |
| Secure | 只在 HTTPS 发送 |
| SameSite | 降低 CSRF 风险 |
| Domain | Cookie 生效域名 |
| Path | Cookie 生效路径 |
| Max-Age/Expires | 过期时间 |

Cookie 适合浏览器场景，但要注意 CSRF。

### 9.2 Session

Session 的思路是：客户端只保存 Session ID，服务端保存完整会话状态。

优点：

- 服务端可主动失效。
- 敏感信息不暴露给客户端。
- 权限变更后较易控制。

缺点：

- 多实例需要共享 Session 存储。
- Session 存储故障会影响登录态。
- 高并发下 Session 存储会成为压力点。

### 9.3 Token

Token 由客户端保存并在请求中携带。

优点：

- 适合移动端和 API。
- 服务端可无状态验证某些 Token。
- 跨域和跨服务更灵活。

缺点：

- Token 泄露即身份泄露。
- 撤销和续期复杂。
- 长 Token 增加网络开销。

## 10. REST API 设计

REST 的重点是资源。

### 10.1 资源命名

推荐：

```text
GET    /users
GET    /users/{userId}
POST   /users
PATCH  /users/{userId}
DELETE /users/{userId}

GET    /users/{userId}/orders
GET    /orders/{orderId}
POST   /orders
POST   /orders/{orderId}/cancel
```

动作型接口不是完全不能出现。现实中很多业务动作很难表达成简单 CRUD，例如取消订单、支付订单、审核通过。可以使用子资源或动作端点，但要保持语义清晰。

### 10.2 分页

常见分页方式：

| 方式 | 示例 | 优点 | 缺点 |
| --- | --- | --- | --- |
| page/size | `?page=1&size=20` | 简单 | 深分页慢，数据变动时可能重复/遗漏 |
| offset/limit | `?offset=0&limit=20` | 通用 | 深分页慢 |
| cursor | `?cursor=xxx&limit=20` | 性能好，适合滚动加载 | 实现稍复杂 |

数据量大时优先考虑 cursor 分页。

### 10.3 过滤和排序

示例：

```text
GET /orders?status=PAID&createdAfter=2026-01-01&sort=-createdAt
```

注意：

- 过滤字段要白名单。
- 排序字段要白名单。
- 不允许客户端随意拼 SQL。
- 大范围查询要限制时间窗口和分页。

### 10.4 错误响应

统一错误结构很重要：

```json
{
  "code": "USER_NOT_FOUND",
  "message": "用户不存在",
  "requestId": "req_001"
}
```

错误码应该稳定，不要频繁改。错误消息可以面向用户，也可以面向开发者，但要区分内部日志和外部响应。

## 11. RPC API

RPC 强调调用动作，常用于内部服务通信。

示例：

```text
UserService.GetUser
OrderService.CreateOrder
PaymentService.Refund
```

### 11.1 RPC 优点

- 契约清晰。
- 代码生成方便。
- 二进制协议性能好。
- 内部服务调用效率高。

### 11.2 RPC 风险

远程调用不是本地调用。它会：

- 失败。
- 超时。
- 返回部分错误。
- 被重试。
- 产生网络延迟。
- 在下游过载时加剧雪崩。

RPC 接口必须设计超时、重试、熔断、限流和版本兼容。

## 12. GraphQL

GraphQL 允许客户端声明需要哪些字段。

适合：

- 前端页面字段组合复杂。
- 多端字段需求不同。
- 后端需要聚合多个资源。

风险：

- 查询复杂度难控制。
- 容易出现 N+1 查询。
- 缓存复杂。
- 权限需要字段级控制。
- 深层嵌套查询可能拖垮服务。

GraphQL 要配套：

- 查询深度限制。
- 查询复杂度限制。
- DataLoader 类批量加载机制。
- 字段级权限。
- 超时和限流。

## 13. WebSocket、SSE 与 Webhook

### 13.1 WebSocket

WebSocket 是双向长连接。适合：

- 聊天。
- 协作编辑。
- 实时通知。
- 游戏。
- 实时控制。

后端注意：

- 连接数可能很多。
- 要处理心跳和断线重连。
- 要处理消息顺序和重复。
- 要限制单连接发送频率。
- 横向扩容时需要连接路由或消息广播。

### 13.2 SSE

SSE 是服务端向浏览器单向推送事件。适合：

- 日志流。
- 任务进度。
- 通知。
- 简单实时数据。

优点是比 WebSocket 简单，浏览器支持事件流。但它主要是服务端到客户端，不适合复杂双向通信。

### 13.3 Webhook

Webhook 是一个系统主动调用另一个系统的回调接口。

典型场景：

- 支付结果通知。
- 代码仓库 push 事件。
- 第三方审核结果。
- 物流状态变更。

Webhook 必须考虑：

- 签名验证。
- 时间戳和防重放。
- 幂等。
- 重试。
- 死信或人工补偿。
- 事件版本。

## 14. CORS

CORS 是浏览器安全策略，不是后端之间通信的通用限制。当前端页面从一个源访问另一个源的 API 时，浏览器会检查 CORS。

常见 Header：

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`

注意：

- 带凭证请求不能随便使用 `*`。
- CORS 配置过宽可能造成安全风险。
- CORS 只限制浏览器，不限制 curl、后端服务或攻击脚本直接请求。

## 15. API 版本管理

版本管理是为了让 API 能演进而不破坏旧客户端。

### 15.1 兼容变化

通常兼容：

- 响应新增字段。
- 新增可选请求参数。
- 新增枚举值但旧客户端能忽略。

通常不兼容：

- 删除字段。
- 改字段类型。
- 改字段含义。
- 改错误码语义。
- 必填字段变更。

### 15.2 版本方式

| 方式 | 示例 |
| --- | --- |
| URL 版本 | `/v1/users` |
| Header 版本 | `Accept: application/vnd.example.v1+json` |
| 查询参数 | `?version=1` |
| 兼容演进 | 不显式暴露版本，靠兼容规则演进 |

内部系统也需要版本意识。服务之间强依赖时，接口变更要有灰度和兼容期。

## 16. 幂等设计

幂等是 API 设计中最重要的工程概念之一。

### 16.1 为什么重复请求一定会发生

重复请求来源：

- 用户重复点击。
- 客户端超时后重试。
- 网关重试。
- 服务端重试。
- 消息队列重复投递。
- 第三方回调重复发送。
- 网络超时导致调用方不知道结果。

如果没有幂等，下单、支付、退款、发券、发货都可能出严重问题。

### 16.2 幂等方案

| 方案 | 说明 |
| --- | --- |
| Idempotency-Key | 客户端提交唯一请求键 |
| 业务唯一号 | 订单号、支付流水号、退款单号 |
| 数据库唯一约束 | 从存储层防重复 |
| 幂等记录表 | 记录请求处理状态和结果 |
| 状态机 | 限制非法状态转换 |
| 乐观锁 | 版本号防并发覆盖 |

### 16.3 幂等记录状态

幂等记录可以设计为：

| 状态 | 含义 |
| --- | --- |
| PROCESSING | 正在处理 |
| SUCCESS | 已成功，可返回相同结果 |
| FAILED_RETRYABLE | 失败但可重试 |
| FAILED_FINAL | 失败且不可重试 |

注意：

- 幂等记录写入要和业务动作有一致性设计。
- 成功结果最好能重复返回。
- 幂等记录要设置过期或归档。

## 17. API 安全基本要求

每个 API 至少要考虑：

- 是否需要登录？
- 是否需要角色权限？
- 是否需要对象级权限？
- 参数是否校验？
- 是否有限流？
- 是否有审计日志？
- 是否会泄露敏感信息？
- 是否能被重复提交？
- 是否有超时和资源限制？

对象级权限尤其重要。例如 `GET /orders/{id}` 不能只判断用户已登录，还要判断这个订单是否属于当前用户，或者当前用户是否有管理权限。

## 18. API 设计检查清单

设计一个接口时可以检查：

- 路径是否表达资源或动作？
- HTTP 方法是否符合语义？
- 状态码是否合理？
- 请求字段是否有类型、范围和必填说明？
- 响应字段是否稳定？
- 错误码是否可枚举？
- 是否需要分页、排序、过滤？
- 是否需要幂等？
- 是否需要鉴权和授权？
- 是否需要限流？
- 是否需要审计？
- 是否需要版本兼容？
- 是否有超时预期？
- 是否有请求 ID 和链路追踪？

## 19. 本章小结

网络、HTTP 和 API 是后端的入口能力。掌握它们不是为了背协议，而是为了设计清晰契约、减少歧义、提升可维护性，并在请求失败、超时、限流、越权、缓存和版本演进时做出正确判断。

## 20. 参考资料

- RFC 9110 HTTP Semantics: https://www.rfc-editor.org/rfc/rfc9110.html
- RFC 9111 HTTP Caching: https://datatracker.ietf.org/doc/rfc9111/
- MDN HTTP Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
- MDN CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
- W3C Trace Context: https://www.w3.org/TR/trace-context/
- OpenAPI Specification: https://spec.openapis.org/oas/latest.html
