# 13. 参考资料

本章整理学习 AI Agent 时值得优先阅读的官方资料和经典论文。框架和 API 更新较快，具体用法以官方文档为准。

## 官方文档

### OpenAI

- OpenAI Agents SDK 文档：https://openai.github.io/openai-agents-python/
- OpenAI Platform 文档：https://platform.openai.com/docs
- OpenAI Cookbook：https://cookbook.openai.com/

建议关注：

- 工具调用。
- 结构化输出。
- Agents SDK。
- Tracing。
- Guardrails。
- 模型选择和成本控制。

### Model Context Protocol

- MCP 官方文档：https://modelcontextprotocol.io/docs
- MCP 规范：https://modelcontextprotocol.io/specification
- MCP GitHub：https://github.com/modelcontextprotocol

建议关注：

- Host、Client、Server 的角色。
- Tools、Resources、Prompts。
- 传输协议。
- 安全边界。
- Server 开发。

### LangChain 与 LangGraph

- LangChain 文档：https://docs.langchain.com/
- LangGraph 文档：https://langchain-ai.github.io/langgraph/

建议关注：

- Agent。
- Tool calling。
- Runnable。
- StateGraph。
- Persistence。
- Human-in-the-loop。
- LangSmith 观测和评测。

### LlamaIndex

- LlamaIndex 文档：https://docs.llamaindex.ai/

建议关注：

- RAG。
- Index。
- Query Engine。
- Agent。
- Workflow。
- Data connector。

### Microsoft AutoGen

- AutoGen 文档：https://microsoft.github.io/autogen/
- AutoGen GitHub：https://github.com/microsoft/autogen

建议关注：

- 多 Agent 对话。
- AgentChat。
- Human-in-the-loop。
- Tool use。

### CrewAI

- CrewAI 文档：https://docs.crewai.com/
- CrewAI GitHub：https://github.com/crewAIInc/crewAI

建议关注：

- Agent。
- Task。
- Crew。
- Flow。
- Tool。

### Semantic Kernel

- Semantic Kernel 文档：https://learn.microsoft.com/semantic-kernel/
- Semantic Kernel GitHub：https://github.com/microsoft/semantic-kernel

建议关注：

- Plugin。
- Planner。
- Function。
- Memory。
- 企业应用集成。

## 经典论文与思想

### ReAct

ReAct: Synergizing Reasoning and Acting in Language Models

核心思想：让模型在推理和行动之间交替进行，使用外部工具反馈修正后续步骤。

### Toolformer

Toolformer: Language Models Can Teach Themselves to Use Tools

核心思想：模型可以学习在合适时机调用工具。

### Chain-of-Thought

Chain-of-Thought Prompting Elicits Reasoning in Large Language Models

核心思想：通过中间推理步骤提升复杂问题表现。工程实践中应注意不要把内部推理全部暴露给用户。

### Reflexion

Reflexion: Language Agents with Verbal Reinforcement Learning

核心思想：Agent 可以通过语言形式的反馈和反思改进后续表现。

### Voyager

Voyager: An Open-Ended Embodied Agent with Large Language Models

核心思想：在开放环境中积累技能库并持续探索。

## 关键词索引

- Agent Runtime：Agent 执行循环和状态管理。
- Tool Calling：模型选择工具并生成参数。
- Function Calling：模型 API 层面的函数调用能力。
- MCP：连接 AI 应用和工具、资源、提示的开放协议。
- ReAct：推理和行动交替。
- Planner：任务规划器。
- Executor：执行器。
- Verifier：验证器。
- Reflection：反思机制。
- RAG：检索增强生成。
- Memory：跨轮或跨任务保存的信息。
- Trace：执行轨迹。
- Guardrails：安全护栏和输出约束。
- Human-in-the-loop：人工参与审批或判断。
- Multi-Agent：多个 Agent 分工协作。

## 推荐阅读顺序

1. 先读 ReAct，理解 Agent 执行循环。
2. 再读 MCP 官方文档，理解工具协议和上下文接入。
3. 读 OpenAI Agents SDK 或 LangGraph，理解现代 Agent Runtime。
4. 读 LlamaIndex RAG 文档，补齐知识库能力。
5. 读评测和 tracing 相关文档，把 Demo 推向生产。

## 持续更新建议

AI Agent 领域变化快，建议定期检查：

- 模型是否升级。
- 工具调用 API 是否变化。
- MCP 规范是否更新。
- 框架是否有破坏性变更。
- 安全最佳实践是否变化。
- 评测工具是否更成熟。

更新笔记时优先更新：

- 框架选型。
- API 示例。
- 安全建议。
- 成本和延迟经验。
- 实战项目踩坑。

