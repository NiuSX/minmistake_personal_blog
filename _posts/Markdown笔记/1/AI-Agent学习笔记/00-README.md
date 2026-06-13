# AI Agent 学习笔记总目录

本目录是一份独立的 AI Agent 系统化学习笔记，适合从 LLM 应用开发过渡到 Agent 工程实践。内容按章节拆分，便于后续单独复习、扩展为博客文章或沉淀为团队内部文档。

> 说明：本笔记不修改仓库中已有 AI、MCP、RAG 或 LangChain 相关文章，只作为独立学习资料补充。

## 适合读者

- 已经理解大模型、Prompt、RAG 的基本概念，想进一步掌握 Agent。
- 想把“能演示的 Agent”推进到“可评测、可观测、可上线的 Agent”。
- 需要理解 ReAct、Tool Calling、MCP、Memory、Planner、Workflow、多智能体等概念之间的关系。
- 想在 OpenAI Agents SDK、LangChain、LangGraph、LlamaIndex、AutoGen、CrewAI 等方案之间做技术选型。

## 学习路径

建议按以下顺序阅读：

1. `01-concepts.md`：理解 Agent 的定义、边界和适用场景。
2. `02-llm-and-prompting.md`：理解 LLM 能力、提示工程和上下文管理。
3. `03-agent-architecture.md`：建立 Agent 系统的整体架构模型。
4. `04-tools-function-calling-mcp.md`：掌握工具调用、函数调用和 MCP。
5. `05-rag-and-memory.md`：区分 RAG、短期记忆、长期记忆和状态。
6. `06-planning-workflow-execution.md`：理解规划、工作流和执行控制。
7. `07-multi-agent.md`：学习多智能体协作模式和常见风险。
8. `08-evaluation-observability.md`：建立评测、日志、追踪和回放体系。
9. `09-safety-and-risk-control.md`：掌握权限、注入攻击、数据泄露和安全边界。
10. `10-engineering-and-production.md`：学习生产化架构、部署、成本和可靠性。
11. `11-framework-selection.md`：对比主流框架和选型策略。
12. `12-project-roadmap.md`：按阶段完成实战项目。
13. `13-reference.md`：查看官方资料和延伸阅读。
14. `14-production-agent-playbook.md`：补充生产级 Agent 的工程化方法、架构图、工具设计、RAG、评测、安全和落地清单。

## Agent 的一句话理解

AI Agent 不是“更长的 Prompt”，而是一个由模型驱动、带有目标、状态、工具、反馈和执行循环的系统。它能在有限约束下观察环境、制定下一步、调用工具、读取结果、修正计划，并最终交付任务结果。

## 核心知识地图

```text
AI Agent
├─ 模型层
│  ├─ LLM / 多模态模型
│  ├─ 推理能力
│  ├─ 上下文窗口
│  └─ 结构化输出
├─ 交互层
│  ├─ Prompt
│  ├─ System 指令
│  ├─ Few-shot 示例
│  └─ 用户意图澄清
├─ 工具层
│  ├─ Function Calling
│  ├─ API / 数据库 / 文件系统
│  ├─ 浏览器 / 终端 / 搜索
│  └─ MCP
├─ 知识与记忆
│  ├─ RAG
│  ├─ 短期状态
│  ├─ 长期记忆
│  └─ 用户画像
├─ 控制层
│  ├─ Planner
│  ├─ Workflow
│  ├─ ReAct
│  ├─ Reflection
│  └─ Human-in-the-loop
├─ 评测与观测
│  ├─ 离线评测
│  ├─ 在线指标
│  ├─ Trace
│  ├─ 回放
│  └─ 成本与延迟
└─ 安全与治理
   ├─ 权限边界
   ├─ Prompt Injection
   ├─ 数据脱敏
   ├─ 审批流
   └─ 审计日志
```

## 建议补充阅读

如果已经读完前 13 章，建议继续阅读 `14-production-agent-playbook.md`。这一章更偏工程落地，把前面分散的概念串成一套可执行方法：

- 如何判断需求应该用 Workflow、Agent，还是普通 LLM 调用。
- 如何设计 Agent Runtime、状态机、工具注册表、权限层和 trace。
- 如何写出更适合模型使用的工具 schema、错误语义和返回结构。
- 如何把 RAG、Memory、Human-in-the-loop、Guardrails 和评测系统组合起来。
- 如何从 Demo 逐步演进到可上线、可回放、可审计、可控成本的系统。

## 学习时要避免的误区

### 误区一：Agent 越自主越高级

实际工程中，越自主的系统越难预测、难评测、难控成本。生产系统通常采用“模型自主判断”和“确定性流程控制”结合的方式：让模型处理语义、规划和异常，但让代码负责权限、状态、预算、重试、幂等和审批。

### 误区二：有工具调用就是 Agent

工具调用只是 Agent 的组成部分。一个只有一次 Function Calling 的问答接口，更准确地说是“带工具的 LLM 应用”。Agent 通常还需要多步执行、状态管理、反馈循环和目标驱动。

### 误区三：只要加 RAG 就能解决幻觉

RAG 能改善知识来源和可追溯性，但不能自动保证答案正确。检索失败、切片错误、排序错误、上下文过长、模型忽略证据，都可能造成错误结果。因此 RAG 必须配合引用、置信度、评测集和失败兜底。

### 误区四：多智能体一定优于单 Agent

多 Agent 会引入通信成本、角色漂移、循环争论、责任不清和调试困难。只有当任务天然需要分工、审查、竞争或并行处理时，多 Agent 才有明显价值。

## 推荐的学习节奏

第一阶段：理解概念，能手写一个简单 ReAct Agent。

第二阶段：掌握工具调用、结构化输出、RAG 和状态管理。

第三阶段：把 Agent 改造成可评测、可追踪、可回放的工程系统。

第四阶段：加入权限、审批、成本预算和异常恢复。

第五阶段：完成一个真实项目，例如代码助手、知识库问答、运营分析助手或自动化办公助手。

## 最小可行 Agent 能力清单

- 能接收用户目标并拆解任务。
- 能在必要时调用工具，而不是只凭模型回答。
- 能检查工具结果并决定下一步。
- 能保存任务状态，支持失败恢复。
- 能输出结构化结果，便于下游系统使用。
- 能记录 trace，支持问题复盘。
- 能设置最大步数、最大成本、最大时长。
- 能在高风险操作前请求人工确认。
