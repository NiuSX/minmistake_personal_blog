# 03. Agent 架构

<!-- lecture-notes:integrated-v2 -->

## 讲义导读：把 Agent 放进工程闭环

这一章讲的是 **03. Agent 架构**。学习 AI Agent 时最容易犯的错误，是把所有新名词都看成“更高级的聊天机器人功能”。更稳妥的学法是：先看它解决什么工程问题，再看它把模型、工具、上下文、状态、评测和安全中的哪一环变得更清楚。

### 一句话先懂

Agent 架构的核心是把模型从“直接回答者”放进一个运行时：由状态、工具、策略、评测和权限共同控制它。

### 通俗类比

把 Agent 架构想成自动化流水线。模型不是整座工厂，而是其中一个会判断的工位；工具网关、状态存储、任务队列、监控和审批流一起决定产线是否可靠。

类比只是入门扶手，不是严格定义。真正掌握时，要把类比重新落回本章的准确术语、流程、接口、状态、权限、评测指标和失败现象上。只停留在“感觉懂了”很危险；能画流程、能举反例、能解释失败原因，才算真正学会。

### 本章学习主线

1. **先看边界**：这章讨论的是模型能力、工具能力、上下文能力、控制流能力，还是上线治理能力？
2. **再看接口**：输入从哪里来，输出给谁用，中间状态如何保存，工具或外部系统如何接入？
3. **然后看失败**：如果模型答错、工具失败、检索不到、权限不足、成本超限或用户意图不清，系统应该怎么表现？
4. **接着看证据**：用什么 trace、日志、评测样例、人工审查或线上指标证明它真的有效？
5. **最后看取舍**：什么时候应该用简单 Workflow，什么时候才值得引入更自治的 Agent？

### 概念怎么学才不容易忘

遇到重要概念时，建议按“白话解释 -> 工程定义 -> 最小例子 -> 失败样例 -> 上线检查”五步走。比如看到 Tool Calling，先说清它为什么让模型能做事，再看 schema、权限和错误语义；看到 RAG，先说清它为什么补充外部知识，再看切分、召回、重排、引用和无答案策略；看到多 Agent，先说清为什么单 Agent 不够，再看通信、共享状态和停止条件。

### 最小实践任务

画出一个客服 Agent 或代码 Agent 架构图，标出入口、模型、工具网关、状态、日志、评测、安全策略和人工介入点。

实践时要刻意保留失败样本。很多 Agent 知识真正变清楚，不是在第一次跑通时，而是在你看到它如何失败、如何报错、如何恢复时。建议记录：输入是什么，期望输出是什么，实际 trace 是什么，失败属于模型、工具、检索、权限、状态还是业务规则，下一次如何更快判断。

### 读完本章应该能产出

能说明 Runtime、Planner、Executor、Tool Registry、Memory、Trace、Guardrail 的职责；能识别架构中最容易失控的环节；能给出可落地的最小架构。

> 本节是全篇讲义化改写的阅读入口，后续正文中的定义、步骤、示例和参考资料都应围绕这条学习主线来理解。

## 标准架构视图

一个生产级 Agent 系统通常可以拆成以下层次：

```text
用户入口
  ↓
会话与身份层
  ↓
任务路由层
  ↓
Agent 控制器
  ↓
模型调用层
  ↓
工具执行层
  ↓
数据与记忆层
  ↓
评测、观测、安全、审计
```

不要把 Agent 理解为一个大函数。更准确的理解是：它是一个带模型决策节点的分布式应用。

## 主要组件

### 用户入口

可能是网页、聊天窗口、IDE 插件、CLI、浏览器扩展、企业 IM 或 API。入口层负责接收请求、展示进度、处理确认和反馈。

### 身份与权限

Agent 必须知道“代表谁执行”。同一个工具在不同用户身份下权限不同。例如同样是查询 CRM，销售只能查自己的客户，管理员可以查所有客户。

### 任务路由器

路由器判断请求类型：

- 普通问答。
- 知识库问答。
- 工具执行。
- 长任务。
- 高风险操作。
- 无法处理的请求。

路由可以由规则、分类模型或 LLM 完成。高风险场景建议规则优先，LLM 辅助。

### Agent 控制器

控制器是 Agent 的核心运行时，负责：

- 初始化任务状态。
- 选择策略。
- 调用模型。
- 解析模型动作。
- 执行工具。
- 更新状态。
- 判断停止条件。
- 处理异常。

### 模型调用层

模型调用层封装不同模型提供方，统一处理：

- 模型参数。
- 重试。
- 超时。
- 速率限制。
- token 统计。
- 结构化输出。
- 内容安全过滤。

### 工具执行层

工具执行层负责真正操作外部系统。它不应该盲目信任模型参数，而要校验 schema、权限和业务规则。

### 记忆与状态层

状态是当前任务运行所需的信息。记忆是跨任务、跨会话可复用的信息。二者应分开设计。

### 观测与审计层

生产系统必须记录：

- 用户请求。
- 模型输入输出摘要。
- 工具调用参数。
- 工具返回结果摘要。
- 错误和重试。
- 成本和耗时。
- 人工审批记录。

敏感字段应脱敏或加密保存。

## 单 Agent 架构

单 Agent 架构适合大多数早期项目。

优点：

- 实现简单。
- 调试容易。
- 责任清晰。
- 成本较低。

缺点：

- 复杂任务容易上下文膨胀。
- 一个 Prompt 承担过多规则。
- 难以并行。

适用场景：

- 单领域助手。
- 企业知识库问答。
- 代码库小范围修改。
- 自动化办公任务。

## Router + Specialist 架构

这种架构使用一个路由器把任务分配给不同专家 Agent 或处理器。

```text
用户请求
  ↓
Router
  ├─ FAQ Agent
  ├─ RAG Agent
  ├─ Data Analysis Agent
  ├─ Code Agent
  └─ Human Support
```

优点：

- 每个 Agent 更专注。
- Prompt 更短。
- 权限更容易隔离。
- 便于独立评测。

缺点：

- 路由错误会影响结果。
- 跨 Agent 状态共享复杂。
- 运维复杂度上升。

## Planner + Executor 架构

Planner 负责拆解任务，Executor 负责执行步骤。

```text
目标
  ↓
Planner 生成计划
  ↓
Executor 执行步骤
  ↓
Verifier 校验结果
  ↓
必要时返回 Planner 修订
```

适合：

- 研究报告。
- 代码修改。
- 数据分析。
- 多步骤业务流程。

工程要点：

- 计划必须结构化。
- 每一步要有完成条件。
- Executor 不应无限扩展任务范围。
- Verifier 应能拒绝不合格结果。

## Workflow + Agent 架构

生产系统常用工作流包裹 Agent。

```text
固定流程节点 A
  ↓
LLM 判断或生成
  ↓
固定流程节点 B
  ↓
工具调用
  ↓
人工审批
  ↓
固定流程节点 C
```

这种模式的优点是可控。模型只在需要语义能力的节点出现，而不是支配整个流程。

## Event-driven Agent 架构

事件驱动 Agent 监听外部事件：

- 新邮件到达。
- 工单状态变化。
- 监控报警触发。
- 文档更新。
- 用户上传文件。

处理流程：

```text
事件进入队列
  ↓
规则过滤
  ↓
Agent 分析
  ↓
生成建议或执行动作
  ↓
记录审计
```

此类系统必须设置去重、幂等、限流和人工审批。

## Agent 状态机

一个可控 Agent 可以设计成状态机：

```text
CREATED
  ↓
NEED_CLARIFICATION
  ↓
PLANNING
  ↓
EXECUTING
  ↓
WAITING_APPROVAL
  ↓
VERIFYING
  ↓
COMPLETED / FAILED / CANCELLED
```

状态机的好处：

- 易于恢复。
- 易于展示进度。
- 易于审计。
- 易于限制非法跳转。

## 停止条件

Agent 必须有明确停止条件：

- 达到最终答案。
- 达到最大步数。
- 达到最大 token 或成本。
- 达到最大执行时间。
- 连续失败次数过多。
- 用户取消。
- 需要人工确认。
- 检测到风险。

没有停止条件的 Agent 很容易陷入循环调用工具。

## 架构设计检查清单

- 是否区分了模型决策和系统控制？
- 是否有显式任务状态？
- 是否有工具权限校验？
- 是否有最大步数、最大耗时和最大成本？
- 是否支持失败恢复？
- 是否记录 trace？
- 是否能回放一次任务？
- 是否能解释最终答案来自哪些工具或资料？
- 是否能在风险操作前暂停？

---

## 万字精讲扩展（2026-06-16 更新）
> Last researched: 2026-06-16。本文补充内容以 OpenAI、Anthropic、MCP、LangGraph、LlamaIndex、AutoGen、CrewAI、Microsoft Agent Framework、Langfuse 等官方或厂商资料为主；Agent 生态变化很快，真实项目应继续核对模型、SDK、框架和安全策略的最新版本。

### 本章在 AI Agent 学习路线中的位置

《Agent 架构》是 Agent 工程能力链条中的一个环节。Agent 不是单次模型调用，也不是一个框架名，而是模型、工具、上下文、状态、规划、执行、评测、安全和可观测性组合成的系统。学习本章时，不要只问“这个概念是什么”，还要问“它如何被测试、如何被限制、如何被观测、如何在失败时恢复”。

本章学习完成后，至少应达到三个标准。第一，能说明该主题给 Agent 增加了什么能力，以及什么时候不该使用。第二，能设计一个最小 demo，并明确工具、状态、停止条件和失败处理。第三，能用 trace 和评测样例证明改动有效。没有评测和可观测性的 Agent，只是难以维护的黑箱。

### 架构类笔记的精讲重点

Agent 架构的核心是控制复杂度。单 Agent 适合简单任务；Router + Specialist 适合任务类型清晰但技能不同；Planner + Executor 适合需要分解和执行的复杂任务；Workflow + Agent 适合生产场景中固定主流程加局部智能；Event-driven Agent 适合长任务、异步执行和外部事件触发。架构不是越复杂越好，而是越能解释状态、权限、失败和评测越好。

每个 Agent 架构都要定义状态机：开始、等待用户、调用工具、等待工具、失败重试、人审、完成、取消、超时。没有状态机，系统就很难恢复、重放和排查。停止条件也必须明确，例如最大步数、最大成本、最大时间、目标达成、缺少信息、工具失败或风险升级。

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

#### 1. 单 Agent

在《Agent 架构》中，`单 Agent` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`单 Agent` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`单 Agent` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 2. Router + Specialist

在《Agent 架构》中，`Router + Specialist` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`Router + Specialist` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`Router + Specialist` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 3. Planner + Executor

在《Agent 架构》中，`Planner + Executor` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`Planner + Executor` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`Planner + Executor` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 4. Workflow + Agent

在《Agent 架构》中，`Workflow + Agent` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`Workflow + Agent` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`Workflow + Agent` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。

#### 5. 状态机和停止条件

在《Agent 架构》中，`状态机和停止条件` 要从“能力、边界、证据、风险”四个角度理解。能力回答它能带来什么增量，例如让模型调用工具、访问知识、规划任务或协作执行；边界回答什么时候不该使用它，例如普通确定性流程、低风险固定任务或无法评测的任务；证据回答如何证明它有效，例如 trace、评测集、人工审查、工具调用日志和线上指标；风险回答失败后会造成什么后果，例如成本升高、权限越界、数据泄露、错误操作或用户误信。

实践中，`状态机和停止条件` 不应该只写成概念，而要落到可配置对象和测试样例。比如工具要有 schema、权限、超时、错误码和 mock；RAG 要有切分、召回、重排、引用和无答案策略；Memory 要有写入规则、过期规则、用户可见和纠错机制；Planner 要有最大步数、停止条件和验证器；多 Agent 要有通信格式、共享状态和冲突解决。每个对象都应能被单独测试，并能在 trace 里被观察。

生产判断上，`状态机和停止条件` 的默认策略应是先简单、后复杂，先只读、后写入，先人工审批、后自动化，先评测、后扩展。Agent 系统最大的风险不是模型“不够聪明”，而是系统把不稳定能力放进了不可控场景。真正可靠的 Agent 往往是被明确边界、工具权限、工作流状态和评测体系约束出来的。


### 场景化学习与排错表

| 主题 | 推荐动作 | 常见风险 | 验证方式 |
| :--- | :--- | :--- | :--- |
| 单 Agent | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| Router + Specialist | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| Planner + Executor | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| Workflow + Agent | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |
| 状态机和停止条件 | 先定义任务边界和成功标准，再设计工具/状态/评测，最后接入生产监控 | 直接堆框架、缺少评测、工具权限过大、没有停止条件、无法回放 | 单元测试、工具 mock、trace 回放、黄金集评测、红队样例、线上指标 |

这张表的重点是把 Agent 能力变成可验证工程对象。很多 Agent demo 的问题不是不能成功一次，而是失败时没有证据、无法复现、无法回滚、无法量化改进。每个主题都应该对应 trace、评测样例、权限策略和失败处理。

### 本章建议工作流

```mermaid
flowchart TD
  A[阅读《Agent 架构》概念和官方资料] --> B[定义任务边界和风险等级]
  B --> C[设计最小 Agent/Workflow]
  C --> D[定义工具、状态、上下文和停止条件]
  D --> E[构建评测集和红队样例]
  E --> F[接入 trace、日志、成本和延迟监控]
  F --> G[小流量试运行并复盘失败]
```

Figure: 《Agent 架构》学习和落地工作流，综合 OpenAI Agents SDK、Anthropic effective agents、MCP、LangGraph、LlamaIndex、AutoGen、CrewAI 和 Langfuse 资料整理。

这个流程避免“先做复杂系统再补治理”。Agent 项目越早接入评测和可观测性，越容易知道改动是否有效。复杂能力如多 Agent、长期记忆、自动写操作和长任务执行，都应该在最小闭环稳定后再引入。

### 常见误区和纠正方法

- 误区：把 Agent 等同于聊天机器人。纠正：Agent 的关键是多步执行、工具使用、状态和反馈循环，普通问答不一定需要 Agent。
- 误区：一开始就多 Agent。纠正：先用单 Agent 或 workflow 解决问题，只有职责清晰、可评测、可观测时再拆多 Agent。
- 误区：把所有治理写进 prompt。纠正：权限、schema、验证器、审批、沙箱、审计和回滚应由系统实现，prompt 只是其中一层。
- 误区：没有评测就调 prompt。纠正：每次改模型、prompt、工具、RAG 或框架，都应跑回归评测和 trace 对比。
- 误区：工具越多越好。纠正：工具越多，选择错误和权限越界风险越高；工具应职责清晰、可组合、可测试、可审计。
- 误区：Memory 永远有益。纠正：记忆会污染、过期、泄露隐私，也可能强化错误偏好；必须有写入、读取、纠错和删除策略。

### 与相邻章节的关系

《Agent 架构》应与提示工程、工具/MCP、RAG/Memory、规划执行、评测、安全和生产工程章节联动。Prompt 决定模型如何理解任务，工具决定它能做什么，RAG 和 Memory 决定上下文，规划执行决定任务如何推进，评测和可观测性决定能否改进，安全风控决定能否上线。任何单点能力脱离这些关系，都容易变成 demo 级系统。

### 实操训练和复盘模板

1. 围绕 `单 Agent` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
2. 围绕 `Router + Specialist` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
3. 围绕 `Planner + Executor` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
4. 围绕 `Workflow + Agent` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。
5. 围绕 `状态机和停止条件` 做一个最小实验：写成功样例、失败样例、trace 观察点和评测标准。

建议每个 Agent 练习都按下面格式复盘：

```text
项目名称：
本章主题：Agent 架构
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
- [Official / MCP] MCP specification 2025-11-25 - Tools: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
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
