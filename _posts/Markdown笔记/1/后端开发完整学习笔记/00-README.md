# 后端开发完整学习笔记（拆分版）

> 来源：由上一级 `后端开发完整学习笔记.md` 拆分并扩写。  
> 目标：把一份总览型后端笔记拆成多个可独立阅读的专题文档，每篇围绕一个知识域深入展开。  
> 范围：不绑定具体编程语言，侧重后端通用概念、术语、理论、工程设计、常见问题和学习路径。

## 阅读顺序

建议按下面顺序阅读：

1. [01-后端总览、知识地图与学习路线](01-后端总览、知识地图与学习路线.md)
2. [02-网络、HTTP 与 API 设计](02-网络、HTTP与API设计.md)
3. [03-业务建模、分层架构与工程规范](03-业务建模、分层架构与工程规范.md)
4. [04-数据库、事务、索引与数据建模](04-数据库、事务、索引与数据建模.md)
5. [05-缓存、消息队列与异步系统](05-缓存、消息队列与异步系统.md)
6. [06-并发、分布式系统、微服务与高可用](06-并发、分布式系统、微服务与高可用.md)
7. [07-安全、认证授权与 API 防护](07-安全、认证授权与API防护.md)
8. [08-可观测性、性能容量与故障排查](08-可观测性、性能容量与故障排查.md)
9. [09-部署运维、云原生、测试与常见组件](09-部署运维、云原生、测试与常见组件.md)
10. [10-后端术语表与系统设计模板](10-后端术语表与系统设计模板.md)

## 这套笔记怎么学

后端知识的难点不在于名词多，而在于名词之间有依赖关系。比如“接口慢”这个问题，可能涉及 HTTP、网关、线程池、数据库索引、缓存命中率、消息队列积压、下游超时、重试风暴、Kubernetes 资源限制、日志过多、GC、网络抖动、DNS、TLS 握手等多个层面。

所以这套笔记建议用三种方式学习：

- 横向建立地图：先知道后端有哪些知识域，分别解决什么问题。
- 纵向深入专题：一次只深入一个专题，例如数据库、缓存、消息队列、分布式。
- 场景化串联：用“下单”“登录”“搜索”“秒杀”“文件上传”“订单超时关闭”这类业务场景把知识串起来。

## 核心主线

| 主线 | 要解决的问题 | 典型技术 |
| --- | --- | --- |
| 请求链路 | 请求如何到达后端并返回 | DNS、TCP、TLS、HTTP、网关、负载均衡 |
| 接口契约 | 系统如何暴露能力 | REST、RPC、GraphQL、Webhook、错误码、版本 |
| 业务建模 | 业务规则如何落到代码和数据 | 分层架构、领域模型、实体、值对象、状态机 |
| 数据管理 | 数据如何存储、查询、一致 | 关系型数据库、NoSQL、索引、事务、隔离级别 |
| 性能加速 | 如何减少慢操作和重复计算 | 缓存、批量、异步、索引、连接池 |
| 异步解耦 | 如何把慢任务和主链路分开 | 消息队列、事件驱动、任务调度、最终一致 |
| 分布式协作 | 多节点如何协同 | CAP、复制、分片、共识、服务发现、微服务 |
| 稳定性 | 故障时如何不崩 | 超时、重试、限流、熔断、降级、容灾 |
| 安全 | 如何保护用户、系统和数据 | 认证、授权、OAuth、OIDC、JWT、OWASP |
| 运维交付 | 如何可靠上线和运行 | 容器、Kubernetes、CI/CD、灰度、回滚 |
| 可观测性 | 如何发现和定位问题 | 日志、指标、链路追踪、Profiling、告警 |

## 学习原则

1. 先理解问题，再学习技术名词。技术是答案，不是问题本身。
2. 不要把“会用框架”误认为“懂后端”。框架只是把后端常见模式封装起来。
3. 每学一个组件，都要问：它解决什么问题、代价是什么、什么场景适合、什么场景不适合。
4. 每学一个优化手段，都要问：指标怎么证明有效、失败时会怎样、是否引入新复杂度。
5. 每学一个分布式方案，都要问：一致性如何保证、重复如何处理、超时如何处理、补偿如何设计。
6. 每学一个安全机制，都要问：攻击者能不能绕过、凭证泄露怎么办、是否有审计。

## 推荐实践路径

如果你是初学者，不建议一开始就追求微服务、分布式事务、Kubernetes、多活架构。更稳的路径是：

1. 写清楚一个普通 API。
2. 能正确使用数据库和事务。
3. 能处理参数校验、错误响应、权限校验。
4. 能理解缓存和数据库一致性。
5. 能使用消息队列做异步任务，并处理重复消费。
6. 能给远程调用加超时、重试、熔断、降级。
7. 能用日志、指标、链路追踪定位问题。
8. 再学习分布式系统和微服务拆分。

## 参考资料

- RFC 9110 HTTP Semantics: https://www.rfc-editor.org/rfc/rfc9110.html
- RFC 9111 HTTP Caching: https://datatracker.ietf.org/doc/rfc9111/
- OAuth 2.0 RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749
- OpenID Connect Core: https://openid.net/specs/openid-connect-core-1_0.html
- OWASP API Security Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- PostgreSQL Documentation: https://www.postgresql.org/docs/current/
- Redis Documentation: https://redis.io/docs/latest/
- Apache Kafka Documentation: https://kafka.apache.org/documentation/
- Kubernetes Documentation: https://kubernetes.io/docs/concepts/
- OpenTelemetry Documentation: https://opentelemetry.io/docs/
- Google SRE Workbook: https://sre.google/workbook/
- The Twelve-Factor App: https://12factor.net/
- Martin Fowler Microservices: https://martinfowler.com/articles/microservices.html
- Microservices.io Saga Pattern: https://microservices.io/patterns/data/saga.html
