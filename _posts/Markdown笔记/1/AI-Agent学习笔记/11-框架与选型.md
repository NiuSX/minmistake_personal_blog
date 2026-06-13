# 11. 框架与选型

## 为什么需要框架

Agent 框架通常提供：

- 模型调用封装。
- 工具注册。
- 执行循环。
- 状态管理。
- 工作流编排。
- 多 Agent 协作。
- RAG 集成。
- Trace 和评测。

但框架不是必需品。简单业务可以先手写轻量 Agent Runtime，等复杂度上来再引入框架。

## 选型维度

选择框架时看：

- 是否支持目标语言。
- 是否支持所需模型提供方。
- 工具调用是否稳定。
- 状态和工作流能力是否清晰。
- 是否支持持久化和恢复。
- 是否支持可观测性。
- 是否容易测试。
- 社区活跃度。
- 文档质量。
- 是否适合生产，不只是 Demo。

## OpenAI Agents SDK

适合：

- 使用 OpenAI 模型和工具调用能力。
- 希望快速构建带工具、handoff、guardrails、tracing 的 Agent。
- 需要与 OpenAI 平台能力保持一致。

关注点：

- 与 OpenAI 生态绑定较深。
- 如果企业需要多模型抽象，需要额外封装。
- 生产中仍需自己处理业务权限、存储、审批和成本治理。

## LangChain

LangChain 是通用 LLM 应用框架，生态大，集成多。它适合快速接入模型、工具、文档加载器、向量库和链式流程。

适合：

- 快速原型。
- 多模型和多工具集成。
- 需要大量连接器。
- RAG 和 Agent 混合应用。

关注点：

- 抽象较多，复杂项目需要控制边界。
- 生产关键路径建议明确自己使用了哪些模块。

## LangGraph

LangGraph 更偏状态图和可控 Agent 工作流。它适合把 Agent 行为建模为节点和边。

适合：

- 复杂工作流。
- 多 Agent。
- 需要状态持久化。
- 需要可恢复和可观测的执行图。
- 希望比自由循环 Agent 更可控。

关注点：

- 需要先设计状态和图结构。
- 对简单任务可能偏重。

## LlamaIndex

LlamaIndex 在数据连接、索引、RAG 和知识型 Agent 方面能力突出。

适合：

- 企业知识库问答。
- 文档密集型 Agent。
- 需要多种索引和检索策略。
- 需要把私有数据组织成模型可用上下文。

关注点：

- 如果任务主要是外部工具执行，而不是知识检索，可能需要配合其他编排方案。

## AutoGen

AutoGen 关注多 Agent 对话和协作，适合构建多角色、多步骤的研究、代码和协作型实验。

适合：

- 多 Agent 原型。
- 角色协作。
- 自动化研究。
- 需要人类参与的 Agent 对话流程。

关注点：

- 多 Agent 调试和成本控制要额外重视。
- 生产落地时要明确状态、权限和停止条件。
- 如果处在微软技术栈中，应关注 Microsoft Agent Framework 对 AutoGen 的后续整合和迁移路径。

## CrewAI

CrewAI 强调角色、任务和团队协作，适合用较直观方式搭建多 Agent 流程。

适合：

- 内容生产流水线。
- 研究报告。
- 市场分析。
- 团队角色清晰的任务。

关注点：

- 对严肃生产系统，需要补齐权限、评测、审计和状态持久化。

## Semantic Kernel

Semantic Kernel 是微软生态中的 AI 编排框架，强调插件、规划器和企业集成。

适合：

- .NET 或微软技术栈。
- 企业应用。
- 插件化工具能力。
- 与 Azure 生态集成。

关注点：

- 如果团队不在微软生态，需要评估集成成本。
- 微软正在推进 Microsoft Agent Framework，把 AutoGen 的多 Agent 抽象和 Semantic Kernel 的企业能力进一步统一；新项目应同时评估 Agent Framework。

## Microsoft Agent Framework

Microsoft Agent Framework 是微软面向 .NET 和 Python 的 Agent 开发框架，官方定位是 AutoGen 与 Semantic Kernel 后续演进方向之一。它强调：

- 单 Agent 和多 Agent 抽象。
- 显式 workflow 编排。
- 会话状态、持久化和长任务。
- Human-in-the-loop。
- 遥测、过滤器和企业级集成。
- 与 Microsoft Foundry、Azure 和 .NET/Python 生态结合。

适合：

- 团队已经使用 Azure、Microsoft Foundry、.NET 或 Semantic Kernel。
- 希望在微软生态内构建企业 Agent。
- 需要从 AutoGen 或 Semantic Kernel 迁移到更统一的框架。
- 需要把多 Agent 与业务 workflow 结合。

关注点：

- 生态仍在快速演进，版本、包名和迁移指南要以 Microsoft Learn 为准。
- 如果系统需要同时深度支持非微软云和多模型供应商，应评估抽象层是否足够中立。
- 企业落地仍然需要自行设计权限、审计、数据边界和成本控制。

## 自研轻量 Runtime

适合：

- 任务边界很清晰。
- 工具数量少。
- 团队希望完全掌控执行逻辑。
- 对框架依赖敏感。

基本模块：

- Prompt 模板。
- 模型客户端。
- 工具注册表。
- 执行循环。
- 状态存储。
- Trace 记录。
- 安全策略。

自研不是从零造所有东西，而是只在关键控制层保持简单清晰。

## 选型建议

### 知识库问答

优先考虑 LlamaIndex、LangChain，配合自定义评测和权限过滤。

### 可控业务流程

优先考虑 Workflow + 自研 Runtime，或 LangGraph。

### 多 Agent 实验

可考虑 AutoGen、CrewAI、LangGraph。

### OpenAI 生态应用

可考虑 OpenAI Agents SDK。

### 企业微软技术栈

可考虑 Microsoft Agent Framework 或 Semantic Kernel。新项目优先评估 Microsoft Agent Framework；已有 Semantic Kernel 项目则关注迁移成本和兼容性。

## 框架评估表

| 维度 | 问题 |
| --- | --- |
| 模型支持 | 是否支持当前和未来模型？ |
| 工具 | 工具 schema 是否清晰？ |
| 状态 | 是否支持持久化和恢复？ |
| 工作流 | 是否能表达复杂控制流？ |
| 评测 | 是否能接入评测和 trace？ |
| 安全 | 是否方便做权限和审批？ |
| 运维 | 是否方便部署和监控？ |
| 迁移 | 是否会强绑定某个生态？ |
| 演进 | 框架是否有明确维护路线和迁移指南？ |

## 实用结论

多数团队的路径可以是：

1. 用最小自研 Runtime 或成熟框架快速验证。
2. 把 Prompt、工具、状态和 trace 抽象清楚。
3. 当任务复杂后，引入 LangGraph、Temporal 等更强编排。
4. 不把业务核心规则锁死在框架黑盒里。
