# 03 神经网络基础

## 1. 总览

神经网络可以理解为一组可学习函数的组合。最基本的形式是：

```text
输入 x -> 线性变换 -> 非线性激活 -> 多层堆叠 -> 输出
```

如果没有非线性激活，多层线性层仍然等价于一层线性变换，表达能力有限。

## 2. 基本架构

```mermaid
flowchart LR
  A[输入特征 x] --> B[Linear]
  B --> C[Activation]
  C --> D[Hidden Layer]
  D --> E[Output Layer]
  E --> F[Prediction]
```

## 3. 模块详解

### 3.1 神经元

**是什么：** 接收输入，做加权求和，再经过激活函数输出。

**数学形式：**

```text
z = w^T x + b
a = phi(z)
```

其中：

- `x in R^d` 是输入特征；
- `w in R^d` 是权重；
- `b` 是偏置；
- `phi` 是激活函数；
- `a` 是神经元输出。

如果把多个神经元合成一层，就得到：

```text
z = Wx + b
a = phi(z)
```

**职责：**

- 对输入特征做线性组合；
- 通过激活函数引入非线性；
- 作为更大网络层的基本单元。

**简单例子：**

```python
import torch

x = torch.tensor([1.0, 2.0, 3.0])
w = torch.tensor([0.2, -0.5, 1.0])
b = torch.tensor(0.1)

z = (w * x).sum() + b
a = torch.relu(z)
print(z, a)
```

### 3.2 线性层

**是什么：** 对一批输入做矩阵乘法和偏置加法。

**职责：**

- 改变特征维度；
- 学习特征组合；
- 作为 MLP、CNN 分类头、Transformer FFN 的基础。

**输入输出：**

```text
X shape = [batch, input_dim]
W shape = [input_dim, output_dim]
Y shape = [batch, output_dim]
```

**简单例子：**

```python
import torch.nn as nn

layer = nn.Linear(10, 4)
```

参数量：

```text
params = input_dim * output_dim + output_dim
```

例如 `nn.Linear(10, 4)` 有：

```text
10 * 4 + 4 = 44
```

个可学习参数。

### 3.3 激活函数

**是什么：** 非线性函数，让网络能拟合复杂模式。

| 激活函数 | 特点 | 常见用途 |
| --- | --- | --- |
| Sigmoid | 输出 0 到 1，容易饱和 | 老式二分类、中间层较少用 |
| Tanh | 输出 -1 到 1，仍可能饱和 | RNN 中曾常用 |
| ReLU | 简单、高效、缓解梯度消失 | 默认常用 |
| GELU | 平滑非线性 | Transformer 常用 |

#### Sigmoid

```text
sigma(x) = 1 / (1 + exp(-x))
```

导数：

```text
sigma'(x) = sigma(x)(1 - sigma(x))
```

问题：当 `x` 很大或很小时，导数接近 0，容易导致梯度消失。

#### Tanh

```text
tanh(x) = (exp(x)-exp(-x)) / (exp(x)+exp(-x))
```

导数：

```text
d/dx tanh(x) = 1 - tanh^2(x)
```

相比 sigmoid，tanh 输出以 0 为中心，但仍然会饱和。

#### ReLU

```text
ReLU(x) = max(0, x)
```

导数：

```text
1, x > 0
0, x < 0
```

ReLU 简单高效，但负半轴梯度为 0，可能出现“神经元死亡”。

#### GELU

GELU 常用于 Transformer，直观上是带概率解释的平滑门控：

```text
GELU(x) = x * Phi(x)
```

其中 `Phi(x)` 是标准正态分布的累积分布函数。

**简单例子：**

```python
import torch
import torch.nn.functional as F

x = torch.tensor([-1.0, 0.0, 2.0])
print(F.relu(x))
```

### 3.4 损失函数

**是什么：** 网络输出和真实目标之间的差异度量。

**职责：**

- 给训练提供优化目标；
- 将预测错误转成可求导标量；
- 决定模型倾向于优化什么行为。

**简单例子：**

```python
import torch
import torch.nn.functional as F

logits = torch.tensor([[2.0, 0.1, -1.0]])
target = torch.tensor([0])
loss = F.cross_entropy(logits, target)
```

#### Softmax + Cross Entropy

softmax：

```text
p_i = exp(z_i) / sum_j exp(z_j)
```

交叉熵：

```text
L = -sum_i y_i log p_i
```

如果 `y` 是 one-hot，正确类别为 `c`：

```text
L = -log p_c
```

一个重要结论：

```text
partial L / partial z_i = p_i - y_i
```

这说明分类输出层的梯度就是“预测概率 - 真实标签”。这个结果让 softmax 分类训练非常简洁。

### 3.5 多层感知机 MLP

**是什么：** 多个线性层和激活函数堆叠的前馈神经网络。

**适用场景：**

- 表格特征；
- 简单分类；
- 作为复杂模型中的分类头或投影层。

**简单例子：**

```python
import torch.nn as nn

mlp = nn.Sequential(
    nn.Linear(20, 64),
    nn.ReLU(),
    nn.Linear(64, 32),
    nn.ReLU(),
    nn.Linear(32, 3)
)
```

数学形式：

```text
h^(0) = x
z^(1) = W^(1) h^(0) + b^(1)
h^(1) = phi(z^(1))
z^(2) = W^(2) h^(1) + b^(2)
h^(2) = phi(z^(2))
...
logits = W^(L) h^(L-1) + b^(L)
```

如果最后是分类任务，通常把 logits 交给 cross entropy。

## 4. 前向传播

前向传播就是输入数据从第一层流到输出层的过程。

```text
h1 = ReLU(W1x + b1)
h2 = ReLU(W2h1 + b2)
logits = W3h2 + b3
```

在分类任务中，最后输出通常是 logits。很多框架的交叉熵损失会内部处理 softmax，因此训练时不要手动重复 softmax。

## 5. 万能近似直觉

多层神经网络有很强的函数逼近能力。直观地说：

- 线性层负责旋转、缩放、平移特征空间；
- 激活函数负责折叠和切分空间；
- 多层堆叠可以形成复杂的非线性决策边界。

这不是说随便一个网络都能训练好。表达能力、优化难度、数据规模和正则化必须一起考虑。

## 6. 网络容量

网络容量可以理解为模型拟合复杂函数的能力。

| 提高容量的方式 | 风险 |
| --- | --- |
| 增加层数 | 更难优化，可能梯度消失/爆炸 |
| 增加隐藏单元 | 参数更多，过拟合风险增加 |
| 使用更复杂结构 | 训练成本和调参难度增加 |

参数量估算示例：

```text
MLP: 784 -> 256 -> 128 -> 10

Layer1: 784*256 + 256 = 200960
Layer2: 256*128 + 128 = 32896
Layer3: 128*10 + 10 = 1290
Total = 235146
```

参数量越大，模型容量通常越强，但也更容易过拟合，并且需要更多数据和计算。

## 7. 初始化

初始化会影响训练稳定性。

### 7.1 为什么不能全初始化为 0

如果同一层所有神经元参数完全一样，它们在反向传播中会得到相同梯度，无法学出不同特征。这叫对称性问题。

### 7.2 Xavier 初始化

适合 tanh/sigmoid 一类激活的经典初始化思想：

```text
Var(W) roughly 2 / (fan_in + fan_out)
```

### 7.3 He 初始化

适合 ReLU：

```text
Var(W) roughly 2 / fan_in
```

PyTorch 的许多层会自动使用合理默认初始化，但理解这些原则有助于排查深层网络训练不稳定。

## 8. 常见误区

- 以为层数越深一定越好。
- 忘记激活函数，导致多层线性退化为一层线性。
- 分类训练时手动 softmax 后再用 cross entropy。
- 不检查输入输出 shape。
- 把训练失败都归因于模型太小，忽略数据和优化问题。
