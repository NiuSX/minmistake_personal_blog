# 贝叶斯体系下的算法笔记

> Last researched: 2026-06-16

<!-- lecture-notes:integrated-v2 -->

## 讲义导读：用信念更新读懂这一章

这一章讲的是 **贝叶斯体系下的算法笔记**。阅读时先不要把注意力放在公式长什么样，而要先问：这个模型维护的未知量是什么，数据作为证据如何进入，后验如何被计算或近似，最后这个后验会改变什么预测或决策。贝叶斯学习的核心不是把 P(A|B) 背熟，而是把 先验 -> 似然 -> 后验 -> 后验预测 -> 诊断 -> 决策 连成一条可检查的链。

### 一句话先懂

这组笔记不是在背一堆带 Bayes 的算法名，而是在学习一套先有判断、再看证据、最后更新信念并做决策的通用方法。

### 通俗类比

可以把整个贝叶斯体系想成一间证据室：先验是进门前的经验档案，似然是新证据和假设之间的匹配程度，后验是把旧档案和新证据合并后的判断，后验预测则是拿这份判断去预演未来。

类比只能帮助入门，不能替代精确定义。回到技术上，要把类比里的旧经验对应到先验，把新证据对应到似然，把更新后的判断对应到后验，把下一步怎么做对应到预测或决策规则。只要这个对应关系清楚，公式就不是孤立符号，而是一套可复查的推理流程。

### 本章学习主线

1. **建模对象**：先找出随机变量、观测变量、参数、潜变量或动作分别是什么。
2. **先验假设**：说明先验来自经验、物理约束、平滑需求、正则化需求，还是为了表达无知。
3. **似然机制**：把数据是如何生成的讲清楚，特别是独立性、噪声、分布形状和时间顺序。
4. **推断方法**：区分解析解、共轭更新、数值优化、MCMC、变分推断、粒子近似和代理模型。
5. **后验解释**：不要只看均值，要看区间、尾部、相关性、校准、预测覆盖率和决策风险。
6. **诊断复盘**：检查先验预测、推断质量、后验预测和敏感性分析，确认模型没有自信地错。

### 概念怎么学才不容易忘

遇到贝叶斯概念时，建议按 白话直觉 -> 概率对象 -> 公式含义 -> 最小例子 -> 失败模式 -> 工程诊断 六步理解。比如看到后验，不要只记它等于似然乘先验再归一化，还要说清它是在当前模型假设下对未知量的完整不确定性描述；看到采样，不要只记算法名，还要检查样本是否混合、有效样本量是否足够、是否存在明显偏差。

### 最小实践任务

选一个最简单的二项实验，例如 10 次点击里有 2 次转化。先写 Beta 先验，再根据观测更新到 Beta 后验，最后比较后验均值、区间和转化率超过阈值的概率。

实践时要保留失败样本：先验太宽、噪声设错、链不收敛、主题不可解释、粒子退化、采集函数只探索边界，这些失败现象比一次顺利跑通更能帮助理解算法边界。

### 读完本章应该能做到

- 用自己的话解释本章算法解决什么不确定性问题。
- 写出最小概率结构，标清先验、似然、后验和预测量。
- 说出一个适合场景、一个不适合场景，以及背后的假设原因。
- 给出至少三类诊断信号，能区分数据问题、模型问题和推断问题。
- 能把所有章节放到同一条主线里：建模对象是什么，先验如何进入，似然如何吸收数据，后验如何计算，预测和决策如何使用不确定性。

> 本节是讲义化阅读入口，后续正文中的公式、算法步骤、工程实现和参考资料都应围绕这条信念更新主线来理解。
本目录按算法拆分，每篇文档都是独立的万字级精讲笔记。第一批覆盖经典贝叶斯模型、推断算法和贝叶斯优化；第二批补充了卡尔曼滤波、粒子滤波、HMM、Thompson Sampling、贝叶斯 A/B 测试、LDA 和贝叶斯神经网络等使用贝叶斯思想的常见算法。

## 文档列表

- [朴素贝叶斯算法万字精讲](01-朴素贝叶斯.md) - 基础生成式分类；中文字符约 11983，引用链接 7 个。
- [贝叶斯线性回归万字精讲](02-贝叶斯线性回归.md) - 基础贝叶斯回归；中文字符约 12018，引用链接 7 个。
- [贝叶斯逻辑回归万字精讲](12-贝叶斯逻辑回归.md) - 基础贝叶斯分类；中文字符约 10968，引用链接 5 个。
- [贝叶斯网络万字精讲](03-贝叶斯网络.md) - 概率图模型；中文字符约 12017，引用链接 7 个。
- [隐马尔可夫模型 HMM 万字精讲](11-隐马尔可夫模型 HMM .md) - 序列概率图模型；中文字符约 10970，引用链接 6 个。
- [卡尔曼滤波万字精讲](08-卡尔曼滤波.md) - 线性高斯贝叶斯滤波；中文字符约 10973，引用链接 7 个。
- [扩展卡尔曼滤波与无迹卡尔曼滤波万字精讲](09-扩展卡尔曼滤波与无迹卡尔曼滤波.md) - 非线性近似贝叶斯滤波；中文字符约 10980，引用链接 7 个。
- [粒子滤波与序贯蒙特卡洛万字精讲](10-粒子滤波与序贯蒙特卡洛.md) - 非线性非高斯贝叶斯滤波；中文字符约 10967，引用链接 7 个。
- [MCMC 与 HMC/NUTS 万字精讲](04-MCMC 与 HMC_NUTS.md) - 通用后验采样；中文字符约 11962，引用链接 7 个。
- [变分推断万字精讲](05-变分推断.md) - 可扩展近似后验推断；中文字符约 11975，引用链接 7 个。
- [LDA 潜在狄利克雷分配万字精讲](13-LDA 潜在狄利克雷分配.md) - 贝叶斯主题模型；中文字符约 10946，引用链接 6 个。
- [高斯过程万字精讲](06-高斯过程.md) - 函数空间贝叶斯建模；中文字符约 11998，引用链接 7 个。
- [贝叶斯优化万字精讲](07-贝叶斯优化.md) - 后验驱动黑盒优化；中文字符约 11998，引用链接 7 个。
- [Thompson Sampling 汤普森采样万字精讲](14-Thompson Sampling 汤普森采样.md) - 后验采样在线决策；中文字符约 10941，引用链接 7 个。
- [Beta-Binomial 贝叶斯 A/B 测试万字精讲](16-Beta-Binomial 贝叶斯 A_B 测试.md) - 共轭贝叶斯实验分析；中文字符约 10953，引用链接 6 个。
- [贝叶斯神经网络万字精讲](15-贝叶斯神经网络.md) - 深度贝叶斯不确定性；中文字符约 10962，引用链接 7 个。

## 建议阅读顺序

1. 概率基础和静态模型：朴素贝叶斯、贝叶斯线性回归、贝叶斯逻辑回归。
2. 结构化概率模型：贝叶斯网络、HMM。
3. 递归贝叶斯滤波：卡尔曼滤波、扩展/无迹卡尔曼滤波、粒子滤波。
4. 通用后验推断：MCMC、变分推断。
5. 应用型贝叶斯模型：LDA、高斯过程、贝叶斯神经网络。
6. 后验驱动决策：贝叶斯优化、Thompson Sampling、Beta-Binomial 贝叶斯 A/B 测试。

## 覆盖范围

- 静态监督学习：朴素贝叶斯、贝叶斯线性回归、贝叶斯逻辑回归。
- 概率图模型：贝叶斯网络、HMM、LDA。
- 状态空间与贝叶斯滤波：卡尔曼滤波、扩展/无迹卡尔曼滤波、粒子滤波。
- 后验推断：MCMC/HMC/NUTS、变分推断。
- 函数与深度模型：高斯过程、贝叶斯神经网络。
- 决策与实验：贝叶斯优化、Thompson Sampling、Beta-Binomial A/B 测试。

## 2026 资料与工具核对补充

这批笔记的理论主线相对稳定，但工程工具和默认参数会随版本变化。复现示例前，建议记录 Python、NumPy/SciPy、scikit-learn、PyMC、ArviZ、Stan、pgmpy、FilterPy、BoTorch、PyTorch、JAX 或相关库的具体版本，并把随机种子、数据切分、先验参数、推断配置和诊断阈值写入复盘。

贝叶斯模型不要只核对能不能运行，还要核对三类结果：先验预测是否落在现实范围，推断诊断是否可信，后验预测是否能覆盖或复现关键数据特征。对采样模型重点看 Rhat、ESS、divergence、trace 和后验预测；对变分模型重点看 ELBO、初始化敏感性和方差低估；对滤波模型重点看残差、协方差、时间对齐和噪声尺度；对在线决策重点看探索预算、延迟反馈、安全约束和预期损失。

### 资料入口

- scikit-learn Naive Bayes: https://scikit-learn.org/stable/modules/naive_bayes.html
- scikit-learn LatentDirichletAllocation: https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.LatentDirichletAllocation.html
- PyMC posterior predictive checks: https://www.pymc.io/projects/docs/en/latest/learn/core_notebooks/posterior_predictive.html
- PyMC sample_posterior_predictive: https://www.pymc.io/projects/docs/en/latest/api/generated/pymc.sample_posterior_predictive.html
- Stan and bayesplot MCMC diagnostics: https://mc-stan.org/bayesplot/articles/visual-mcmc-diagnostics.html
- pgmpy documentation: https://pgmpy.org/index.html
- FilterPy documentation: https://filterpy.readthedocs.io/en/latest/
- BoTorch overview: https://botorch.org/docs/overview
- Gaussian Processes for Machine Learning: https://gaussianprocess.org/gpml/
- Probabilistic Machine Learning books: https://probml.github.io/pml-book/

## References

- scikit-learn: https://scikit-learn.org/stable/
- Stan: https://mc-stan.org/docs/
- PyMC: https://www.pymc.io/projects/docs/
- pgmpy: https://pgmpy.org/
- FilterPy: https://filterpy.readthedocs.io/
- BoTorch: https://botorch.org/docs/overview
- Gaussian Processes for Machine Learning: https://gaussianprocess.org/gpml/
- Probabilistic Machine Learning: https://probml.github.io/pml-book/
