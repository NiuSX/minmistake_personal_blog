# 贝叶斯体系下的算法笔记

> Last researched: 2026-06-16

本目录按算法拆分，每篇文档都是独立的万字级精讲笔记。第一批覆盖经典贝叶斯模型、推断算法和贝叶斯优化；第二批补充了卡尔曼滤波、粒子滤波、HMM、Thompson Sampling、贝叶斯 A/B 测试、LDA 和贝叶斯神经网络等使用贝叶斯思想的常见算法。

## 文档列表

- [朴素贝叶斯算法万字精讲](01-naive-bayes.md) - 基础生成式分类；中文字符约 11983，引用链接 7 个。
- [贝叶斯线性回归万字精讲](02-bayesian-linear-regression.md) - 基础贝叶斯回归；中文字符约 12018，引用链接 7 个。
- [贝叶斯逻辑回归万字精讲](12-bayesian-logistic-regression.md) - 基础贝叶斯分类；中文字符约 10968，引用链接 5 个。
- [贝叶斯网络万字精讲](03-bayesian-networks.md) - 概率图模型；中文字符约 12017，引用链接 7 个。
- [隐马尔可夫模型 HMM 万字精讲](11-hidden-markov-model.md) - 序列概率图模型；中文字符约 10970，引用链接 6 个。
- [卡尔曼滤波万字精讲](08-kalman-filter.md) - 线性高斯贝叶斯滤波；中文字符约 10973，引用链接 7 个。
- [扩展卡尔曼滤波与无迹卡尔曼滤波万字精讲](09-extended-unscented-kalman-filter.md) - 非线性近似贝叶斯滤波；中文字符约 10980，引用链接 7 个。
- [粒子滤波与序贯蒙特卡洛万字精讲](10-particle-filter.md) - 非线性非高斯贝叶斯滤波；中文字符约 10967，引用链接 7 个。
- [MCMC 与 HMC/NUTS 万字精讲](04-mcmc.md) - 通用后验采样；中文字符约 11962，引用链接 7 个。
- [变分推断万字精讲](05-variational-inference.md) - 可扩展近似后验推断；中文字符约 11975，引用链接 7 个。
- [LDA 潜在狄利克雷分配万字精讲](13-latent-dirichlet-allocation.md) - 贝叶斯主题模型；中文字符约 10946，引用链接 6 个。
- [高斯过程万字精讲](06-gaussian-processes.md) - 函数空间贝叶斯建模；中文字符约 11998，引用链接 7 个。
- [贝叶斯优化万字精讲](07-bayesian-optimization.md) - 后验驱动黑盒优化；中文字符约 11998，引用链接 7 个。
- [Thompson Sampling 汤普森采样万字精讲](14-thompson-sampling.md) - 后验采样在线决策；中文字符约 10941，引用链接 7 个。
- [Beta-Binomial 贝叶斯 A/B 测试万字精讲](16-beta-binomial-ab-testing.md) - 共轭贝叶斯实验分析；中文字符约 10953，引用链接 6 个。
- [贝叶斯神经网络万字精讲](15-bayesian-neural-network.md) - 深度贝叶斯不确定性；中文字符约 10962，引用链接 7 个。

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

## References

- scikit-learn: https://scikit-learn.org/stable/
- Stan: https://mc-stan.org/docs/
- PyMC: https://www.pymc.io/projects/docs/
- pgmpy: https://pgmpy.org/
- FilterPy: https://filterpy.readthedocs.io/
- BoTorch: https://botorch.org/docs/overview
- Gaussian Processes for Machine Learning: https://gaussianprocess.org/gpml/
- Probabilistic Machine Learning: https://probml.github.io/pml-book/
