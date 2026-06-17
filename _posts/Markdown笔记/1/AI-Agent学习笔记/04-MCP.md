# 04. 工具调用、Function Calling 与 MCP

## 工具为什么重要

LLM 的内部知识可能过时，也无法直接操作外部系统。工具让 Agent 能够：

- 获取实时信息。
- 查询私有数据。
- 执行计算。
- 调用业务 API。
- 读写文件。
- 操作浏览器或应用。
- 调用搜索、数据库、代码执行器等能力。

没有工具的 Agent 只能“说”。有工具的 Agent 才可能“做”。

## 工具的基本结构

一个工具通常包含：

- 名称：模型用于选择工具。
- 描述：说明工具适合什么场景。
- 输入 schema：参数名、类型、必填项、枚举和约束。
- 输出 schema：返回值结构。
- 权限策略：谁能调用，能访问哪些资源。
- 副作用说明：是否会修改外部系统。
- 错误语义：失败时返回什么。

示例：

```json
{
  "name": "search_docs",
  "description": "在内部技术文档中检索相关内容。",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "top_k": { "type": "integer", "minimum": 1, "maximum": 10 }
    },
    "required": ["query"]
  }
}
```

## 好工具的设计原则

### 单一职责

一个工具只做一类事情。不要设计万能工具，例如 `execute_anything`。万能工具难以描述、难以授权、难以审计。

### 参数清晰

参数应尽量结构化。避免让模型把大段自然语言塞给工具再由工具猜测意图。

### 返回值可读

工具返回结果应该短、结构化、可解释。过长结果会污染上下文。

### 显式错误

错误信息应区分：

- 参数错误。
- 权限不足。
- 资源不存在。
- 外部服务超时。
- 业务规则不允许。

### 副作用可控

有副作用的工具，例如发邮件、转账、删除文件、修改配置，必须支持审批、幂等和审计。

## Function Calling

Function Calling 是让模型选择函数并生成参数的一种机制。运行时根据模型输出调用真实函数。

基本流程：

```text
用户请求
  ↓
模型判断需要调用工具
  ↓
模型生成工具名和参数
  ↓
运行时校验参数
  ↓
运行时执行工具
  ↓
工具结果返回模型
  ↓
模型继续回答或继续调用工具
```

关键点：模型只是建议调用什么工具和传什么参数，真正执行前必须由代码校验。

## 工具调用的权限模型

权限至少分三层：

- 工具级权限：用户是否能使用这个工具。
- 资源级权限：用户能访问哪些数据或对象。
- 动作级权限：用户能读、写、删除还是审批。

示例：

```text
用户可以调用 query_invoice 工具。
用户只能查询自己部门的发票。
用户不能调用 approve_payment。
```

## 读工具与写工具

工具可以按风险分为：

- 只读工具：搜索、查询、读取文件。
- 低风险写工具：创建草稿、生成待办、保存临时结果。
- 高风险写工具：发送外部消息、删除数据、修改权限、支付、发布内容。

高风险写工具必须采用 Human-in-the-loop。

## 工具结果压缩

工具返回结果不应无节制塞进上下文。常见做法：

- 返回结构化摘要。
- 返回命中文档 ID 和片段。
- 大文件只返回分页或片段。
- 把完整结果存储在外部，只把引用放入上下文。
- 对表格数据先聚合再返回。

## MCP 的定位

MCP，全称 Model Context Protocol，是一种连接 AI 应用与外部上下文、工具和数据源的开放协议。它的目标是让模型应用以统一方式接入文件系统、数据库、浏览器、业务系统和开发工具等能力。

可以把 MCP 理解为“AI 应用的工具和上下文适配层”。它不等于 Agent 框架，也不等于模型本身，而是连接 Agent 和外部系统的一种协议。

## MCP 的基本角色

MCP 通常包含：

- Host：用户直接使用的 AI 应用，例如桌面助手、IDE、聊天应用。
- Client：Host 内部用于连接某个 MCP Server 的组件。
- Server：暴露工具、资源和提示模板的服务。
- Tools：可被模型调用的动作。
- Resources：可读取的上下文数据。
- Prompts：可复用的提示模板。

## MCP 与 Function Calling 的关系

Function Calling 更偏模型 API 层面的工具调用能力。

MCP 更偏应用和外部工具之间的协议层。MCP Server 可以把能力暴露给 Host，Host 再把这些能力以模型可理解的方式提供给 LLM。

关系可以理解为：

```text
LLM Function Calling
  ↓
Agent Runtime
  ↓
MCP Client
  ↓
MCP Server
  ↓
外部系统
```

## 什么时候适合使用 MCP

适合：

- 需要接入多个工具源。
- 希望工具能力在不同 AI 应用间复用。
- 要把本地文件、数据库、浏览器或开发工具暴露给 Agent。
- 团队希望统一工具协议，而不是每个应用重复封装。

不一定需要：

- 只有一两个内部 API。
- 工具能力只服务一个简单应用。
- 系统安全边界还没有设计清楚。
- 只需要普通 RAG 检索。

## 工具调用失败处理

Agent 必须处理工具失败：

- 参数不合法：让模型修正参数或向用户澄清。
- 权限不足：停止并说明权限问题。
- 服务超时：重试有限次数。
- 结果为空：换查询策略或说明未找到。
- 返回冲突：请求人工判断或使用验证器。

不要让模型无限重试。

## 工具测试

工具测试至少包含：

- schema 校验。
- 权限测试。
- 正常输入。
- 缺失字段。
- 非法字段。
- 边界值。
- 外部服务失败。
- 高风险操作审批。

## 工具设计检查清单

- 工具名称是否清晰？
- 工具描述是否说明了适用和不适用场景？
- 参数 schema 是否足够严格？
- 返回结果是否短且结构化？
- 是否区分只读和写操作？
- 是否有权限校验？
- 是否有幂等键？
- 是否记录审计日志？
- 是否限制调用频率？
- 是否能在失败时返回可恢复错误？

---

## 万字精讲扩展（2026-06-16 更新）
> Last researched: 2026-06-16。本文补充内容以 OpenAI、Anthropic、MCP、LangGraph、LlamaIndex、AutoGen、CrewAI、Microsoft Agent Framework、Langfuse 等官方或厂商资料为主；Agent 生态变化很快，真实项目应继续核对模型、SDK、框架和安全策略的最新版本。

### 本章在 AI Agent 学习路线中的位置

《工具调用、Function Calling 与 MCP》是 Agent 工程能力链条中的一个环节。Agent 不是单次模型调用，也不是一个框架名，而是模型、工具、上下文、状态、规划、执行、评测、安全和可观测性组合成的系统。学习本章时，不要只问“这个概念是什么”，还要问“它如何被测试、如何被限制、如何被观测、如何在失败时恢复”。

本章学习完成后，至少应达到三个标准。第一，能说明该主题给 Agent 增加了什么能力，以及什么时候不该使用。第二，能设计一个最小 demo，并明确工具、状态、停止条件和失败处理。第三，能用 trace 和评测样例证明改动有效。没有评测和可观测性的 Agent，只是难以维护的黑箱。

### 工具、Function Calling 与 MCP 类笔记的精讲重点

工具是 Agent 连接现实世界的接口。一个好工具应该职责单一、名称清晰、参数 schema 精确、错误可解释、权限明确、结果紧凑，并且能被独立测试。Anthropic 关于工具设计的文章强调，工具描述和上下文使用会显著影响 Agent 是否能正确选择和组合工具。工具设计不佳时，模型可能选择错误工具、传错参数、忽略失败或把工具输出误读成事实。

MCP 的价值在于标准化 AI 应用与外部系统的连接方式。MCP 不是替代 function calling，而是为 host/client/server、tools、resources、prompts、transports 等集成提供协议层抽象。生产中要特别关注 MCP server 的信任边界、认证授权、工具白名单、stdio/网络传输风险、审计日志和供应链。读工具和写工具必须分级，写操作通常需要审批、幂等键和回滚路径。

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

#### 1. 工具设计

在《工具调用、Function Calling 与 MCP》中，`工具设计` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`工具设计` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`工具设计` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 2. Function Calling

在《工具调用、Function Calling 与 MCP》中，`Function Calling` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`Function Calling` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`Function Calling` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 3. MCP 定位

在《工具调用、Function Calling 与 MCP》中，`MCP 定位` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`MCP 定位` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`MCP 定位` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 4. 权限模型

在《工具调用、Function Calling 与 MCP》中，`权限模型` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`权限模型` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`权限模型` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 5. 工具失败处理

在《工具调用、Function Calling 与 MCP》中，`工具失败处理` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`工具失败处理` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`工具失败处理` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。


### 场景化学习与排错表

| 主题 | 推荐动作 | 常见风险 | 验证方式 |
| :--- | :--- | :--- | :--- |
| 工具设计 | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| Function Calling | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| MCP 定位 | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| 权限模型 | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| 工具失败处理 | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |

这张表的重点是把 Agent 能力变成可验证工程对象。很多 Agent demo 的问题不是不能成功一次，而是失败时没有证据、无法复现、无法回滚、无法量化改进。每个主题都应该对应 trace、评测样例、权限策略和失败处理。

### 本章建议工作流

```mermaid
flowchart TD
  A[阅读《工具调用、Function Calling 与 MCP》概念和官方资料] --> B[定义任务边界和风险等级]
  B --> C[设计最小 Agent/Workflow]
  C --> D[定义工具、状态、上下文和停止条件]
  D --> E[构建评测集和红队样例]
  E --> F[接入 trace、日志、成本和延迟监控]
  F --> G[小流量试运行并复盘失败]
```

Figure: 《工具调用、Function Calling 与 MCP》学习和落地工作流，综合 OpenAI Agents SDK、Anthropic effective agents、MCP、LangGraph、LlamaIndex、AutoGen、CrewAI 和 Langfuse 资料整理。

这个流程避免“先做复杂系统再补治理”。Agent 项目越早接入评测和可观测性，越容易知道改动是否有效。复杂能力如多 Agent、长期记忆、自动写操作和长任务执行，都应该在最小闭环稳定后再引入。

### 常见误区和纠正方法

- 误区：把 Agent 等同于聊天机器人。纠正：Agent 的关键是多步执行、工具使用、状态和反馈循环，普通问答不一定需要 Agent。
- 误区：一开始就多 Agent。纠正：先用单 Agent 或 workflow 解决问题，只有职责清晰、可评测、可观测时再拆多 Agent。
- 误区：把所有治理写进 prompt。纠正：权限、schema、验证器、审批、沙箱、审计和回滚应由系统实现，prompt 只是其中一层。
- 误区：没有评测就调 prompt。纠正：每次改模型、prompt、工具、RAG 或框架，都应跑回归评测和 trace 对比。
- 误区：工具越多越好。纠正：工具越多，选择错误和权限越界风险越高；工具应职责清晰、可组合、可测试、可审计。
- 误区：Memory 永远有益。纠正：记忆会污染、过期、泄露隐私，也可能强化错误偏好；必须有写入、读取、纠错和删除策略。

### 与相邻章节的关系

《工具调用、Function Calling 与 MCP》应与提示工程、工具/MCP、RAG/Memory、规划执行、评测、安全和生产工程章节联动。Prompt 决定模型如何理解任务，工具决定它能做什么，RAG 和 Memory 决定上下文，规划执行决定任务如何推进，评测和可观测性决定能否改进，安全风控决定能否上线。任何单点能力脱离这些关系，都容易变成 demo 级系统。

### 实操训练和复盘模板

1. 围绕 `工具设计` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
2. 围绕 `Function Calling` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
3. 围绕 `MCP 定位` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
4. 围绕 `权限模型` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
5. 围绕 `工具失败处理` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。

建议每个 Agent 练习都按下面格式复盘：

```text
项目名称：
本章主题：工具调用、Function Calling 与 MCP
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

> Last reviewed: 2026-06-17。此节用于把《04. 工具调用、Function Calling 与 MCP》从阅读笔记推进到可复习、可实践、可验证的研究笔记；具体版本、参数和环境仍需结合官方资料、项目约束和实测结果校准。

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
- 学完《04. 工具调用、Function Calling 与 MCP》后，能否用自己的话说明它解决什么问题、不解决什么问题？
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
主题：04. 工具调用、Function Calling 与 MCP
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
