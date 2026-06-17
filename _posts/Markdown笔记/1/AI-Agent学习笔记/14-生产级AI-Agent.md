# 14. 生产级 AI Agent 工程补充

最后调研日期：2026-06-13

本章是对前面章节的工程化补充。前 13 章已经覆盖了 Agent 的概念、工具、RAG、规划、多 Agent、评测、安全、生产化和框架选型。本章重点回答一个更实际的问题：如果要把一个 Agent 从 Demo 做到可上线，应该怎样设计、拆分、评测和治理？

## 1. 先区分三类系统

很多项目失败不是因为模型不够强，而是一开始把所有需求都叫 Agent。更实用的分类是：

| 类型 | 特征 | 适合场景 | 不适合场景 |
| --- | --- | --- | --- |
| 普通 LLM 调用 | 一次或少数几次模型调用，流程由代码控制 | 摘要、分类、抽取、改写、简单问答 | 长任务、多工具、多状态任务 |
| Agentic Workflow | 固定流程中嵌入 LLM 判断、生成、工具调用 | 审批流、客服流程、文档处理、数据分析流水线 | 路径高度开放、步骤无法预先枚举的任务 |
| AI Agent | 模型动态决定部分步骤和工具使用，运行时维护状态 | 研究、代码修改、跨系统任务执行、开放式问题解决 | 高风险、强确定性、低延迟、无审计基础的任务 |

Anthropic 对 workflow 和 agent 的区分很有参考价值：workflow 是预定义代码路径编排 LLM 和工具，agent 则由模型更动态地决定流程和工具使用。工程上不要迷信“自治”，大部分生产系统更适合从 workflow 起步，再局部引入 Agent 决策。

## 2. 生产级 Agent 的分层架构

```mermaid
flowchart TD
    U[用户或上游系统] --> UI[入口层: Web / API / Chat / IDE]
    UI --> Auth[身份、租户、权限、风控]
    Auth --> Router[任务路由与意图识别]
    Router --> Runtime[Agent Runtime]

    Runtime --> State[状态存储: task state / memory / checkpoint]
    Runtime --> Planner[规划器: plan / replan / stop]
    Runtime --> Model[模型网关: LLM / embedding / reranker]
    Runtime --> ToolRegistry[工具注册表]
    Runtime --> Guardrails[输入输出护栏]

    ToolRegistry --> ToolGateway[工具网关: schema / auth / rate limit / idempotency]
    ToolGateway --> APIs[业务 API]
    ToolGateway --> DB[(数据库)]
    ToolGateway --> Search[搜索 / RAG]
    ToolGateway --> Sandbox[代码执行 / 浏览器 / 文件沙箱]

    Runtime --> Eval[评测器 / 验证器]
    Runtime --> HITL[人工审批]
    Runtime --> Trace[Trace / 日志 / 审计 / 回放]
    Trace --> Monitor[监控告警与成本分析]
```

关键原则：

- 模型负责语义理解、生成、规划建议和异常解释。
- 代码负责权限、预算、状态、重试、幂等、审批、审计和最终执行。
- 工具不是“随便给模型一个函数”，而是有 schema、权限、错误语义和观测指标的接口。
- Agent Runtime 不是一个 while loop，而是可停止、可恢复、可回放、可限制成本的执行系统。

## 3. Agent Runtime 的最小职责

一个可生产化的 Runtime 至少要承担以下职责：

| 模块 | 职责 | 典型数据 |
| --- | --- | --- |
| Session Manager | 管理用户会话和任务上下文 | user_id、tenant_id、session_id |
| Task State | 保存任务当前状态 | goal、plan、step、status、checkpoint |
| Model Client | 统一模型调用 | model、temperature、token usage、latency |
| Tool Registry | 管理可用工具 | name、description、schema、risk_level |
| Tool Executor | 校验并执行工具 | args、auth、idempotency_key、result |
| Planner | 生成或更新计划 | steps、dependencies、acceptance criteria |
| Verifier | 检查中间结果和最终结果 | rule checks、LLM judge、unit tests |
| Guardrails | 输入、输出和工具调用前后校验 | policy result、blocked reason |
| Trace Recorder | 记录执行轨迹 | spans、tool calls、errors、cost |
| Stop Controller | 防止失控循环 | max_steps、max_cost、timeout |

### 3.1 Runtime 状态机

```text
created
  -> planning
  -> waiting_for_tool
  -> observing
  -> verifying
  -> replanning
  -> waiting_for_user
  -> completed
  -> failed
  -> cancelled
```

状态机的意义是让 Agent 不是“跑到哪里算哪里”。每一步都能回答：

- 当前任务在哪个阶段？
- 上一步调用了什么模型或工具？
- 失败后能否重试？
- 是否需要人工确认？
- 是否可以从 checkpoint 恢复？

## 4. 工具设计的工程规范

工具质量直接决定 Agent 质量。很多 Agent 表现差，不是模型不会调用工具，而是工具描述含糊、参数太自由、返回太长、错误不可恢复。

### 4.1 好工具的 schema 示例

```json
{
  "name": "create_invoice_draft",
  "description": "为指定客户创建发票草稿。只创建草稿，不发送、不审批、不入账。",
  "input_schema": {
    "type": "object",
    "properties": {
      "customer_id": {
        "type": "string",
        "description": "客户 ID，必须来自客户查询工具的返回结果"
      },
      "line_items": {
        "type": "array",
        "minItems": 1,
        "items": {
          "type": "object",
          "properties": {
            "description": { "type": "string" },
            "quantity": { "type": "number", "minimum": 0 },
            "unit_price": { "type": "number", "minimum": 0 }
          },
          "required": ["description", "quantity", "unit_price"]
        }
      },
      "currency": {
        "type": "string",
        "enum": ["CNY", "USD", "EUR"]
      },
      "idempotency_key": {
        "type": "string",
        "description": "同一次用户任务内生成的幂等键"
      }
    },
    "required": ["customer_id", "line_items", "currency", "idempotency_key"]
  },
  "risk_level": "low_write",
  "requires_approval": false
}
```

注意点：

- 描述要说明“做什么”和“不做什么”。
- 参数尽量来自上游工具返回值，减少模型自由编造。
- 写操作必须有幂等键。
- 高风险操作不要和低风险操作混在一个工具里。
- 工具返回要短、结构化、可继续推理。

### 4.2 工具返回结构

```json
{
  "ok": true,
  "invoice_draft_id": "draft_123",
  "status": "draft_created",
  "summary": "已为客户 C001 创建 3 行发票草稿，总额 1200 CNY。",
  "next_allowed_actions": ["preview_invoice", "request_approval", "discard_draft"]
}
```

不要返回一整页 HTML、完整数据库行、巨大日志或含敏感字段的原始对象。工具结果进入上下文后，会影响后续决策，也可能形成数据泄露。

### 4.3 工具错误语义

工具错误要让 Runtime 和模型都能恢复：

| 错误类型 | 例子 | 处理方式 |
| --- | --- | --- |
| validation_error | 参数缺失、类型错误、枚举不合法 | 让模型修正参数 |
| permission_denied | 用户无权访问该客户 | 停止或请求授权 |
| not_found | customer_id 不存在 | 换检索策略或询问用户 |
| conflict | 资源状态变化、版本冲突 | 重新读取状态后再决定 |
| rate_limited | API 限流 | 指数退避，限制重试次数 |
| external_timeout | 外部系统超时 | 有界重试，必要时失败 |
| policy_blocked | 命中安全策略 | 停止并记录审计 |

## 5. MCP 在 Agent 系统中的位置

MCP 解决的是“AI 应用如何标准化接入外部上下文和工具”的问题。它不是模型，也不是完整 Agent 框架。

MCP 的核心角色：

- Host：用户使用的 AI 应用，例如 IDE、桌面助手、聊天应用。
- Client：Host 内部连接某个 MCP Server 的组件。
- Server：暴露能力的一端，可以提供 tools、resources、prompts。
- Tools：可执行动作。
- Resources：可读取上下文。
- Prompts：可复用提示模板或工作流入口。

使用 MCP 的收益：

- 工具可以在多个 AI 应用之间复用。
- 团队可以把文件系统、数据库、内部服务、开发工具统一暴露给 AI 应用。
- 工具接入从 N 个应用乘 M 个工具的重复集成，变成围绕协议的适配。

需要注意：

- MCP 只提供协议边界，不自动替你解决业务权限。
- MCP Server 暴露的工具仍然需要最小权限、审计、限流和审批。
- 不可信资源内容可能包含 prompt injection，不能因为内容来自 MCP 就默认可信。
- 生产系统应把 MCP 工具纳入统一工具网关，而不是绕过风控直接执行。

## 6. RAG 与 Memory 的生产设计

### 6.1 RAG 不是“向量库 + Prompt”

生产级 RAG 通常包含：

```text
数据接入
  -> 清洗与权限标注
  -> 文档切分
  -> embedding
  -> 索引
  -> 查询改写
  -> 检索
  -> rerank
  -> 上下文压缩
  -> 生成
  -> 引用与验证
  -> 反馈与评测
```

其中最容易被忽略的是权限标注、rerank、引用验证和评测。没有权限过滤的 RAG 很容易变成数据泄露通道。

### 6.2 Chunk 策略

| 文档类型 | 建议切分方式 | 注意点 |
| --- | --- | --- |
| API 文档 | 按标题、接口、参数表切分 | 保留接口名、版本、路径 |
| 法规制度 | 按条款切分 | 保留章节号和生效日期 |
| 会议纪要 | 按议题和决议切分 | 区分事实、观点、待办 |
| 代码 | 按函数、类、文件摘要切分 | 保留路径和符号名 |
| FAQ | 一问一答切分 | 保留适用范围 |

Chunk 太小会丢上下文，太大会降低召回精度并浪费 token。更稳妥的做法是同时保存：

- 原始文档 ID。
- chunk ID。
- 标题路径。
- 时间版本。
- 权限标签。
- 相邻 chunk 引用。

### 6.3 Memory 写入规则

不要让 Agent 把所有对话都写入长期记忆。长期记忆应该只保存稳定、可复用、经过确认的信息。

可写入：

- 用户明确确认的偏好。
- 任务中复用价值高的项目背景。
- 经过验证的业务事实。
- 成功任务的可复用流程摘要。

不应写入：

- 临时猜测。
- 未验证的模型推断。
- 敏感个人信息。
- 工具返回的原始机密数据。
- 已过期的状态。

Memory 写入最好走“候选 -> 审核 -> 生效”的流程，至少要记录来源、时间、置信度和删除方式。

## 7. 规划与执行控制

### 7.1 计划不等于长篇推理

生产系统需要的是可执行计划，而不是模型的完整内部推理。一个好的计划应包含：

- 目标。
- 步骤。
- 每步输入和输出。
- 所需工具。
- 验收标准。
- 风险点。
- 停止条件。

示例：

```json
{
  "goal": "分析本周客服投诉并生成改进建议",
  "steps": [
    {
      "id": "s1",
      "action": "query_tickets",
      "output": "tickets_summary",
      "acceptance": "覆盖本周所有已关闭和未关闭投诉工单"
    },
    {
      "id": "s2",
      "action": "cluster_complaints",
      "output": "top_complaint_categories",
      "acceptance": "每个类别包含数量、占比和典型案例"
    },
    {
      "id": "s3",
      "action": "draft_report",
      "output": "report",
      "acceptance": "建议必须引用工单类别和证据"
    }
  ],
  "stop_conditions": ["max_steps=8", "missing_permission", "insufficient_data"]
}
```

### 7.2 Replan 的触发条件

Agent 不应每一步都重新规划，也不应计划失败后硬跑到底。常见 replan 触发条件：

- 工具返回空结果。
- 权限不足。
- 数据结构和预期不一致。
- 验证器发现结果不满足验收标准。
- 用户修改目标。
- 成本或时间超过阈值。

### 7.3 停止条件

每个 Agent 都必须有硬停止条件：

- 最大步骤数。
- 最大模型调用次数。
- 最大工具调用次数。
- 最大运行时长。
- 最大 token 或费用。
- 最大连续失败次数。
- 高风险动作前必须停止等待审批。

没有停止条件的 Agent 不是“更智能”，而是不具备生产运行资格。

## 8. Human-in-the-loop 设计

人工参与不只是“弹一个确认框”。它应该有明确触发条件、审批上下文和审计记录。

需要人工确认的情况：

- 写入真实业务系统。
- 发送外部消息。
- 删除、覆盖、发布、支付、授权。
- 访问敏感数据。
- 模型置信度低。
- 工具结果冲突。
- 用户意图不明确但操作不可逆。

审批界面或审批消息至少包含：

- 用户原始目标。
- Agent 当前计划。
- 即将执行的动作。
- 关键参数。
- 风险说明。
- 可选操作：批准、拒绝、修改、要求补充信息。

审批结果也要进入 trace，便于复盘。

## 9. 评测体系

### 9.1 三层评测

| 层级 | 评测对象 | 示例指标 |
| --- | --- | --- |
| 单点评测 | Prompt、工具选择、参数生成、RAG 检索 | 参数准确率、召回率、引用准确率 |
| 轨迹评测 | 多步执行过程 | 是否走错工具、是否无效重试、是否越权 |
| 结果评测 | 最终交付结果 | 任务完成率、事实准确率、格式合规率 |

Agent 不能只评最终答案。很多错误在轨迹中已经发生，例如调用了错误工具、读取了不该读的数据、忽略了工具错误。

### 9.2 评测集构成

一个实用评测集应包含：

- 正常任务。
- 边界任务。
- 权限不足任务。
- 数据缺失任务。
- 工具失败任务。
- prompt injection 样本。
- 高风险操作样本。
- 多轮澄清样本。
- 成本和延迟压力样本。

每条样本建议记录：

```yaml
id: eval_001
user_goal: "帮我把本周投诉最多的三个问题发给运营群"
expected_behavior:
  - 查询投诉数据
  - 生成摘要草稿
  - 发送前请求人工确认
must_not:
  - 直接发送外部消息
  - 读取无权限部门数据
metrics:
  - tool_selection
  - permission_compliance
  - hitl_required
```

### 9.3 LLM-as-Judge 的使用边界

LLM-as-Judge 适合评估语义质量，例如摘要是否覆盖要点、报告是否清晰、回答是否引用证据。但它不适合单独判断权限、金额、合规和安全高风险问题。

更稳妥的组合是：

- 确定性规则检查格式、权限、金额、必填字段。
- 单元测试或集成测试检查工具行为。
- LLM-as-Judge 检查语义质量。
- 人工抽检校准评测器。

## 10. 可观测性与回放

Agent trace 至少应记录：

- 用户输入和系统入口。
- 模型请求摘要、模型名、token、延迟、费用。
- 工具选择、参数、返回摘要、错误。
- RAG 检索 query、命中文档、引用片段 ID。
- Guardrails 结果。
- 人工审批记录。
- 状态迁移。
- 最终输出。

为了隐私和合规，trace 不一定保存完整敏感内容，可以保存脱敏摘要、对象 ID、hash、引用和采样日志。

### 10.1 Trace 的作用

- 调试失败任务。
- 分析成本和延迟。
- 找出高失败率工具。
- 复现用户投诉。
- 构建评测样本。
- 支撑审计和合规。

### 10.2 回放注意点

回放不等于重新执行全部外部副作用。生产系统要区分：

- 只回放模型和工具结果快照。
- 在沙箱中回放。
- 只读工具可以重新执行。
- 写工具必须 mock 或禁用。

## 11. 安全与风险控制

OWASP 2025 LLM Top 10 把 Prompt Injection 放在首位，同时还强调不安全输出处理、供应链、模型拒绝服务、敏感信息泄露、过度代理等风险。Agent 因为能调用工具，风险通常高于普通聊天机器人。

### 11.1 Prompt Injection 防护

基本原则：

- 把用户输入、外部文档、网页内容视为不可信数据。
- 不允许外部内容修改 system prompt、权限策略或工具规则。
- 对来自 RAG、网页、邮件、PDF 的内容做来源标注。
- 在工具调用前做权限和策略检查。
- 对高风险工具使用人工审批。

错误做法：

- 在 prompt 中写“不要被攻击”就认为安全。
- 让模型自己决定是否有权限。
- 直接执行网页或文档中诱导的指令。
- 把工具错误、密钥、内部 prompt 暴露给用户。

### 11.2 工具权限

权限模型建议分层：

```text
用户身份
  -> 租户 / 项目 / 部门
  -> 资源权限
  -> 工具权限
  -> 动作权限
  -> 风险审批
```

模型不能成为权限系统。模型可以解释用户意图，但最终是否允许执行必须由确定性代码判断。

### 11.3 沙箱

代码执行、文件操作、浏览器操作尤其需要沙箱：

- 限制文件系统访问范围。
- 限制网络访问。
- 限制命令白名单或黑名单。
- 限制运行时间和资源。
- 隔离租户数据。
- 清理临时文件和凭据。

## 12. 多 Agent 的实用边界

多 Agent 适合：

- 任务天然分工，例如研究、写作、审查。
- 需要独立视角交叉验证。
- 可以并行处理多个子任务。
- 角色之间有清晰输入输出契约。

多 Agent 不适合：

- 单 Agent 已能稳定解决。
- 只是为了看起来复杂。
- 没有统一状态和停止条件。
- 成本敏感、低延迟场景。

常见模式：

| 模式 | 说明 | 风险 |
| --- | --- | --- |
| Supervisor | 一个主管 Agent 分配任务给专家 Agent | 主管错误会放大 |
| Pipeline | A 输出给 B，B 输出给 C | 上游错误会传递 |
| Debate | 多个 Agent 提出观点再裁决 | 成本高，可能空转 |
| Reviewer | 执行者和审查者分离 | 审查标准必须明确 |
| Handoff | 根据意图移交给专门 Agent | 路由错误和上下文丢失 |

OpenAI Agents SDK 中的 handoff 可理解为一种委派机制：一个 Agent 将任务交给另一个更专门的 Agent。它适合客服、订单、退款、FAQ 等边界清晰的分工场景。

## 13. 框架选型更新建议

| 需求 | 优先考虑 | 原因 |
| --- | --- | --- |
| OpenAI 生态、工具、handoff、guardrails、trace | OpenAI Agents SDK | 官方抽象贴近 Responses API 和平台能力 |
| 状态图、可恢复、多步骤工作流 | LangGraph | 图式编排适合可控 Agent |
| 文档密集型 RAG 和知识型 Agent | LlamaIndex | 数据连接、索引、查询引擎能力强 |
| 大量连接器和快速原型 | LangChain | 生态广，适合集成 |
| 多 Agent 对话实验 | AutoGen / CrewAI / LangGraph | 角色协作表达直接 |
| .NET、Azure、微软企业生态 | Microsoft Agent Framework / Semantic Kernel | 更贴近微软技术栈和企业集成；新项目优先关注 Agent Framework |
| 强业务控制、工具少、合规要求高 | 自研轻量 Runtime + 工作流引擎 | 控制边界最清晰 |

选型时不要只看“能不能跑 demo”，而要看：

- 状态是否可持久化。
- trace 是否完整。
- 工具调用是否可测试。
- 权限能否接入现有系统。
- 是否能做人工审批。
- 失败后是否可恢复。
- 框架升级是否影响核心业务。

## 14. 从 Demo 到生产的演进路线

### 阶段一：最小原型

目标：

- 跑通一个真实任务。
- 工具数量控制在 1 到 3 个。
- 明确输入、输出和成功标准。

不要做：

- 一开始接入太多工具。
- 一开始做复杂多 Agent。
- 没有评测就反复调 prompt。

### 阶段二：可评测

目标：

- 建立 20 到 100 条评测样本。
- 覆盖正常、异常、权限、注入和工具失败。
- 记录每次变更前后的效果。

### 阶段三：可观测

目标：

- 每次运行都有 trace。
- 能看到模型调用、工具调用、费用、延迟和失败原因。
- 能从线上失败样本回流到评测集。

### 阶段四：可控风险

目标：

- 工具按风险分级。
- 写操作有幂等和审批。
- 敏感数据脱敏。
- prompt injection 和越权访问有测试样本。

### 阶段五：可运营

目标：

- 有成本预算。
- 有成功率、失败率、人工接管率。
- 有灰度发布和回滚。
- 有版本化 prompt、工具 schema 和评测集。

## 15. 生产上线检查清单

### 需求与边界

- 任务目标是否清晰？
- 是否确认普通程序或 workflow 不能更简单地解决？
- 是否定义了成功标准和失败兜底？
- 是否定义了 Agent 不允许做什么？

### 模型与 Prompt

- system prompt 是否短而明确？
- 是否区分系统规则、用户输入和外部资料？
- 是否要求结构化输出？
- 是否避免依赖模型输出做权限判断？

### 工具

- 工具 schema 是否严格？
- 工具是否单一职责？
- 工具返回是否短且结构化？
- 写工具是否有幂等键？
- 高风险工具是否需要审批？

### 状态与执行

- 是否有任务状态机？
- 是否有 checkpoint？
- 是否有最大步骤、时间和成本限制？
- 是否支持取消和失败恢复？

### RAG 与 Memory

- 检索是否做权限过滤？
- 引用是否可追溯？
- Memory 是否只写入稳定信息？
- 是否支持删除或更正记忆？

### 评测与观测

- 是否有离线评测集？
- 是否评估工具选择和参数准确率？
- 是否记录 trace？
- 是否能回放失败任务？
- 是否有线上监控指标？

### 安全与合规

- 是否测试 prompt injection？
- 是否做敏感数据脱敏？
- 是否记录审计日志？
- 是否限制沙箱资源？
- 是否有人工审批和回滚路径？

## 16. 常见踩坑总结

| 问题 | 表现 | 改进 |
| --- | --- | --- |
| 工具太宽泛 | 模型乱传参数、难审计 | 拆成小工具，明确 schema |
| 返回内容太长 | 上下文污染、成本升高 | 摘要、分页、引用外部对象 |
| 没有停止条件 | 循环调用、费用失控 | max_steps、timeout、max_cost |
| 没有评测集 | prompt 越调越玄学 | 建立固定样本和指标 |
| 权限交给模型 | 越权访问或误操作 | 代码层权限校验 |
| RAG 无权限过滤 | 私有数据泄露 | 索引和查询都带 ACL |
| 多 Agent 滥用 | 成本高、互相甩锅 | 先单 Agent，必要时再拆 |
| 缺少 trace | 线上问题无法复盘 | 全链路记录 span |
| 写操作无幂等 | 重试导致重复创建 | 幂等键和操作日志 |
| 只看最终答案 | 中间过程已越权 | 评测轨迹和工具调用 |

## 17. 最小生产模板

一个可控的 Agent 项目可以从以下目录结构开始：

```text
agent_app/
  prompts/
    system.md
    planner.md
    verifier.md
  tools/
    registry.yaml
    customer.py
    invoice.py
  runtime/
    state.py
    loop.py
    checkpoints.py
    guardrails.py
    tracing.py
  rag/
    ingest.py
    retriever.py
    reranker.py
  evals/
    cases.yaml
    run_evals.py
    judges.py
  tests/
    test_tools.py
    test_permissions.py
    test_runtime.py
```

这个结构的重点不是文件名，而是把 prompt、工具、runtime、RAG、评测和测试分开。Agent 工程最怕所有逻辑混在一个长 prompt 或一个巨大脚本里。

## 18. 参考资料与延伸阅读

- [OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents)
- [OpenAI Agents SDK Python 文档](https://openai.github.io/openai-agents-python/)
- [OpenAI Agents SDK Tracing](https://openai.github.io/openai-agents-python/tracing/)
- [OpenAI Agents SDK Handoffs](https://openai.github.io/openai-agents-python/handoffs/)
- [Model Context Protocol 文档](https://modelcontextprotocol.io/docs/getting-started/intro)
- [Model Context Protocol 规范](https://modelcontextprotocol.io/specification/2025-06-18)
- [Anthropic: Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents)
- [Anthropic: Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [OWASP LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [LangGraph 文档](https://langchain-ai.github.io/langgraph/)
- [LlamaIndex 文档](https://docs.llamaindex.ai/)
- [Microsoft AutoGen 文档](https://microsoft.github.io/autogen/)
- [CrewAI 文档](https://docs.crewai.com/)
- [Semantic Kernel 文档](https://learn.microsoft.com/semantic-kernel/)
- [Microsoft Agent Framework 文档](https://learn.microsoft.com/en-us/agent-framework/)
- [Microsoft Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/)

---

## 万字精讲扩展（2026-06-16 更新）
> Last researched: 2026-06-16。本文补充内容以 OpenAI、Anthropic、MCP、LangGraph、LlamaIndex、AutoGen、CrewAI、Microsoft Agent Framework、Langfuse 等官方或厂商资料为主；Agent 生态变化很快，真实项目应继续核对模型、SDK、框架和安全策略的最新版本。

### 本章在 AI Agent 学习路线中的位置

《生产级 AI Agent 工程补充》是 Agent 工程能力链条中的一个环节。Agent 不是单次模型调用，也不是一个框架名，而是模型、工具、上下文、状态、规划、执行、评测、安全和可观测性组合成的系统。学习本章时，不要只问“这个概念是什么”，还要问“它如何被测试、如何被限制、如何被观测、如何在失败时恢复”。

本章学习完成后，至少应达到三个标准。第一，能说明该主题给 Agent 增加了什么能力，以及什么时候不该使用。第二，能设计一个最小 demo，并明确工具、状态、停止条件和失败处理。第三，能用 trace 和评测样例证明改动有效。没有评测和可观测性的 Agent，只是难以维护的黑箱。

### 工程化与生产实践类笔记的精讲重点

从 demo 到生产，差异主要在稳定性、可观测性、可控性和成本。生产 Agent 需要 model gateway、tool gateway、状态存储、队列、幂等、重试、限流、缓存、灰度、回滚、版本管理、审计、评测和监控。每个模型调用和工具调用都应该有 request id、trace id、用户/租户信息、版本信息、耗时、成本和错误记录。

延迟和成本优化应从架构入手：减少不必要的循环，压缩工具结果，缓存稳定检索结果，使用较小模型处理分类/路由，异步执行长任务，批处理可并行步骤。不要只靠换模型解决成本问题。用户体验也很重要：长任务要有进度、可取消、可恢复和明确失败说明。

### Agent 学习的底层方法：把“智能”拆成可控工程循环

AI Agent 最容易被讲成一个模糊概念：模型会思考、会调用工具、会自己完成任务。工程上更可靠的理解是：Agent 是围绕模型构建的运行时系统，它接收目标和上下文，选择下一步动作，调用工具或查询记忆，观察结果，再决定继续、交给人、回滚或停止。这个循环看起来像自主行为，但每一步都应该有边界：允许调用哪些工具，工具参数如何校验，结果如何压缩，失败如何重试，什么时候必须让人审批，什么时候停止，怎样记录 trace，怎样评测结果是否可靠。

学习 Agent 不要从“多智能体”和“全自动”开始，而要从一个增强型 LLM 开始：一个模型、一个清晰任务、一个结构化输出、一个只读工具、一组评测样例。只有这个最小闭环稳定以后，再引入写操作、RAG、Memory、规划器、工作流、多 Agent、异步任务和生产监控。Anthropic 的 effective agents 文章也强调，很多生产系统更适合简单、可组合、可预测的工作流，而不是一开始就追求复杂自治。OpenAI Agents SDK 的文档同样把工具、handoff、state、guardrails、tracing、evals 作为可组合能力，而不是把 Agent 当成黑箱。

### Agent 运行时闭环

```mermaid
flowchart LR
  User[用户目标/任务] --> Intake[输入解析与风险分级]
  Intake --> Context[上下文: RAG/Memory/会话状态]
  Context --> Model[LLM 决策]
  Model --> Action{动作类型}
  Action -->|回答| Output[结构化输出]
  Action -->|调用工具| Tool[Tool Gateway/MCP/Function]
  Action -->|交给人| HITL[Human Review]
  Tool --> Obs[观察结果]
  HITL --> Obs
  Obs --> State[状态与Trace]
  State --> Model
  Output --> Eval[评测/监控/反馈]
```

Figure: 生产级 Agent 运行时闭环，综合 OpenAI Agents SDK、Anthropic effective agents、MCP、LangGraph/LlamaIndex/CrewAI/AutoGen 文档整理。

这个图的重点是：模型不是系统的全部，工具也不是简单函数。生产 Agent 至少需要输入治理、上下文治理、工具治理、执行治理、结果治理和可观测性。没有这些工程层，Agent 在 demo 中看起来可用，但上线后会遇到成本不可控、延迟过高、工具误用、权限越界、提示注入、RAG 幻觉、记忆污染、不可复现、无法回放和无法评测的问题。

### Workflow 和 Agent 要分清

Workflow 是预定义控制流，适合流程稳定、责任明确、风险可控的任务；Agent 是模型在运行中选择步骤和工具，适合路径不固定、需要动态探索、需要根据观察调整策略的任务。很多企业场景应该采用“workflow + agent”的混合结构：用 workflow 固定高风险主流程，用 Agent 处理信息抽取、检索、草拟、分类、诊断和建议；写操作、外部发送、转账、删除、审批、发布等动作由规则、权限和人审控制。

一个实用判断是：如果任务步骤稳定，优先 workflow；如果任务需要在多个信息源中探索，才考虑 Agent；如果任务有高风险写操作，必须加入审批和回滚；如果任务没有明确评测标准，不要急于自动化。Agent 不是所有 LLM 应用的升级版，很多问答、摘要、抽取和分类任务用普通链式调用更稳、更便宜、更容易测。

### 评测先于复杂化

Agent 系统引入工具和循环后，失败模式会指数增加。一个普通 LLM 调用只需要评估答案质量，Agent 还要评估步骤选择、工具参数、工具结果理解、是否过度调用、是否遗漏验证、是否遵守权限、是否正确停止。OpenAI agent evals 文档强调 trace 级评估，因为 trace 能展示模型调用、工具调用、handoff、guardrails 和自定义 span。没有 trace，就很难知道失败来自提示、检索、工具、模型、权限还是业务规则。

建议每个 Agent 项目从第一天就建立评测集。评测样例至少包括成功路径、边界路径、恶意输入、缺失信息、工具失败、权限不足、长上下文、重复请求和成本压力。每次改 prompt、模型、工具 schema、RAG 切分、memory 策略或框架版本，都跑回归评测。没有评测的 Agent 优化，很容易变成“这次看起来更聪明”的主观判断。

### 核心知识点逐条精讲

#### 1. 生产级分层架构

在《生产级 AI Agent 工程补充》中，`生产级分层架构` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`生产级分层架构` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`生产级分层架构` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 2. Agent Runtime

在《生产级 AI Agent 工程补充》中，`Agent Runtime` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`Agent Runtime` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`Agent Runtime` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 3. 工具规范

在《生产级 AI Agent 工程补充》中，`工具规范` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`工具规范` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`工具规范` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 4. 评测和观测

在《生产级 AI Agent 工程补充》中，`评测和观测` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`评测和观测` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`评测和观测` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 5. 上线检查清单

在《生产级 AI Agent 工程补充》中，`上线检查清单` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`上线检查清单` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`上线检查清单` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。


### 场景化学习与排错表

| 主题 | 推荐动作 | 常见风险 | 验证方式 |
| :--- | :--- | :--- | :--- |
| 生产级分层架构 | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| Agent Runtime | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| 工具规范 | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| 评测和观测 | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| 上线检查清单 | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |

这张表的重点是把 Agent 能力变成可验证工程对象。很多 Agent demo 的问题不是不能成功一次，而是失败时没有证据、无法复现、无法回滚、无法量化改进。每个主题都应该对应 trace、评测样例、权限策略和失败处理。

### 本章建议工作流

```mermaid
flowchart TD
  A[阅读《生产级 AI Agent 工程补充》概念和官方资料] --> B[定义任务边界和风险等级]
  B --> C[设计最小 Agent/Workflow]
  C --> D[定义工具、状态、上下文和停止条件]
  D --> E[构建评测集和红队样例]
  E --> F[接入 trace、日志、成本和延迟监控]
  F --> G[小流量试运行并复盘失败]
```

Figure: 《生产级 AI Agent 工程补充》学习和落地工作流，综合 OpenAI Agents SDK、Anthropic effective agents、MCP、LangGraph、LlamaIndex、AutoGen、CrewAI 和 Langfuse 资料整理。

这个流程避免“先做复杂系统再补治理”。Agent 项目越早接入评测和可观测性，越容易知道改动是否有效。复杂能力如多 Agent、长期记忆、自动写操作和长任务执行，都应该在最小闭环稳定后再引入。

### 常见误区和纠正方法

- 误区：把 Agent 等同于聊天机器人。纠正：Agent 的关键是多步执行、工具使用、状态和反馈循环，普通问答不一定需要 Agent。
- 误区：一开始就多 Agent。纠正：先用单 Agent 或 workflow 解决问题，只有职责清晰、可评测、可观测时再拆多 Agent。
- 误区：把所有治理写进 prompt。纠正：权限、schema、验证器、审批、沙箱、审计和回滚应由系统实现，prompt 只是其中一层。
- 误区：没有评测就调 prompt。纠正：每次改模型、prompt、工具、RAG 或框架，都应跑回归评测和 trace 对比。
- 误区：工具越多越好。纠正：工具越多，选择错误和权限越界风险越高；工具应职责清晰、可组合、可测试、可审计。
- 误区：Memory 永远有益。纠正：记忆会污染、过期、泄露隐私，也可能强化错误偏好；必须有写入、读取、纠错和删除策略。

### 与相邻章节的关系

《生产级 AI Agent 工程补充》应与提示工程、工具/MCP、RAG/Memory、规划执行、评测、安全和生产工程章节联动。Prompt 决定模型如何理解任务，工具决定它能做什么，RAG 和 Memory 决定上下文，规划执行决定任务如何推进，评测和可观测性决定能否改进，安全风控决定能否上线。任何单点能力脱离这些关系，都容易变成 demo 级系统。

### 实操训练和复盘模板

1. 围绕 `生产级分层架构` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
2. 围绕 `Agent Runtime` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
3. 围绕 `工具规范` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
4. 围绕 `评测和观测` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
5. 围绕 `上线检查清单` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。

建议每个 Agent 练习都按下面格式复盘：

```text
项目名称：
本章主题：生产级 AI Agent 工程补充
任务边界：用户目标、允许动作、禁止动作
模型和框架版本：
工具列表：名称、schema、权限、超时、错误码、mock
上下文来源：RAG、Memory、会话状态、用户输入、系统配置
执行控制：最大步数、最大成本、停止条件、重试和人审
评测样例：成功、失败、边界、恶意、工具异常、缺少信息
Trace 观察：模型调用、工具调用、handoff、guardrail、成本、延迟
失败原因：prompt / retrieval / tool / model / permission / business rule
改进动作：
上线风险：
```

这个模板能把 Agent 学习从“能跑 demo”推进到“能解释和治理”。生产级 Agent 最重要的不是一次成功输出，而是每次失败都能定位原因，每次改动都能通过评测验证。

## 参考资料与延伸阅读

- [Official / OpenAI] Agents SDK guide: https://developers.openai.com/api/docs/guides/agents
- [Official / OpenAI] Agents SDK quickstart: https://developers.openai.com/api/docs/guides/agents/quickstart
- [Official / OpenAI] Running agents: https://developers.openai.com/api/docs/guides/agents/running-agents
- [Official / OpenAI] Orchestration and handoffs: https://developers.openai.com/api/docs/guides/agents/orchestration
- [Official / OpenAI] Results and state: https://developers.openai.com/api/docs/guides/agents/results
- [Official / OpenAI] Integrations and observability: https://developers.openai.com/api/docs/guides/agents/integrations-observability
- [Official / OpenAI] Evaluate agent workflows: https://developers.openai.com/api/docs/guides/agent-evals
- [Official / OpenAI Developers] Agents learning hub: https://developers.openai.com/learn/agents
- [Official / Anthropic] Building Effective Agents: https://www.anthropic.com/research/building-effective-agents
- [Official / Anthropic] Writing effective tools for AI agents: https://www.anthropic.com/engineering/writing-tools-for-agents
- [Official / MCP] Model Context Protocol introduction: https://modelcontextprotocol.io/docs/getting-started/intro
- [Official / MCP] MCP specification - Tools: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
- [Official / LangChain] LangGraph overview: https://docs.langchain.com/oss/python/langgraph/overview
- [Official / LangChain] LangGraph product page: https://www.langchain.com/langgraph
- [Official / LlamaIndex] Developer documentation: https://developers.llamaindex.ai/python/framework/
- [Official / LlamaIndex] Agent memory: https://developers.llamaindex.ai/python/framework/module_guides/deploying/agents/memory/
- [Official / LlamaIndex] Agentic RAG architecture guide: https://www.llamaindex.ai/blog/agentic-rag-with-llamaindex-2721b8a49ff6
- [Official / Microsoft] AutoGen stable documentation: https://microsoft.github.io/autogen/stable//index.html
- [Official / Microsoft] Microsoft Agent Framework overview: https://learn.microsoft.com/en-us/agent-framework/overview/
- [Official / Microsoft Research] AutoGen project: https://www.microsoft.com/en-us/research/project/autogen/
- [Official / CrewAI] CrewAI documentation: https://docs.crewai.com/
- [Official / CrewAI] Agents: https://docs.crewai.com/en/concepts/agents
- [Official / CrewAI] Crews: https://docs.crewai.com/en/concepts/crews
- [Official / CrewAI] Flows: https://docs.crewai.com/en/concepts/flows
- [Vendor / Langfuse] AI Agent Observability, Tracing & Evaluation: https://langfuse.com/blog/2024-07-ai-agent-observability-with-langfuse
- [Community / CSDN] AI Agent 学习笔记检索入口: https://so.csdn.net/so/search?q=AI%20Agent%20%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%20RAG%20MCP
- [Community / 博客园] Agent、RAG、MCP 实践检索入口: https://zzk.cnblogs.com/s/blogpost?Keywords=AI%20Agent%20RAG%20MCP
- [Community / 掘金] AI Agent 工程化与 LangGraph 实践检索入口: https://juejin.cn/search?query=AI%20Agent%20LangGraph%20MCP%20RAG&type=0

<!-- research-notes: enhanced-v1 -->

## 研究笔记增强

> Last reviewed: 2026-06-17。此节用于把《14. 生产级 AI Agent 工程补充》从阅读笔记推进到可复习、可实践、可验证的研究笔记；具体版本、参数和环境仍需结合官方资料、项目约束和实测结果校准。

### 知识定位

把模型能力放进可评测、可追踪、可回滚的系统边界内，重点关注任务定义、工具权限、上下文来源、失败处理和上线后的可观测性。

### 重点补充
- 区分普通 LLM 调用、工具增强应用、工作流和自治 Agent。
- 为工具定义 schema、权限、超时、重试、审计日志和 mock 样例。
- 保留成功 trace 与失败 trace，对比模型、检索、工具和输出之间的因果关系。
- 明确适用场景、限制条件、替代方案和迁移成本。

### 实践清单
- 为本章整理一张概念关系图、流程图或最小系统图。
- 写一个最小可运行示例，并保留运行命令、输入、输出和环境版本。
- 列出常见错误、排查命令、关键日志和修复动作。
- 补充安全、性能、兼容性、可维护性和上线运维注意事项。
- 用一次真实问题或练习项目复盘验证笔记是否可用。

### 常见误区
- 只摘抄定义或命令，没有记录上下文、前提条件和边界。
- 只记录成功路径，不记录失败样本、异常现象和排查过程。
- 没有版本、环境和数据样本，导致后续无法复现。
- 把教程默认值直接用于真实项目，没有结合约束重新评估。

### 复盘问题
- 学完《14. 生产级 AI Agent 工程补充》后，能否用自己的话说明它解决什么问题、不解决什么问题？
- 如果要在真实项目中使用，需要哪些前置条件、依赖版本、输入数据和验证手段？
- 失败时最先检查哪三类证据：日志、指标、抓包、堆栈、配置、样本还是硬件测量？
- 有没有形成可重复的最小实验、测试用例或排查命令？

### 延伸方向
- 官方文档和版本变更记录。
- 同类技术、框架或方案对比。
- 面向真实项目的最小实践。
- 故障排查清单和复盘案例库。

### 复盘记录模板

```text
主题：14. 生产级 AI Agent 工程补充
日期：
目标：本次要验证或掌握的具体问题
环境：系统 / 语言 / 框架 / 工具 / 设备 / 版本
步骤：最小可复现流程
现象：成功输出、失败输出、日志、指标或测量数据
分析：为什么会出现该现象，和哪些概念相关
结论：可复用的规则、命令、配置或设计取舍
风险：边界条件、性能、安全、兼容性或维护成本
下一步：继续实验、补充资料或应用到项目
```
