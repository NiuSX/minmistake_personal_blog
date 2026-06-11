# 11 常用公式索引

本文件用于集中查阅深度学习中最常见的公式。每个公式的详细解释分散在对应章节中。

## 1. 线性代数

### 向量内积

```text
x^T y = sum_i x_i y_i
```

用途：相似度、线性模型、注意力中的点积。

### 矩阵乘法

```text
C = AB
C_ij = sum_k A_ik B_kj
```

深度学习中的线性层：

```text
Y = XW + b
```

### Lp 范数

```text
||x||_p = (sum_i |x_i|^p)^(1/p)
```

常见：

```text
||x||_1 = sum_i |x_i|
||x||_2 = sqrt(sum_i x_i^2)
```

## 2. 概率与信息论

### 条件概率

```text
P(A | B) = P(A, B) / P(B)
```

### 贝叶斯公式

```text
P(y | x) = P(x | y) P(y) / P(x)
```

### 期望

```text
E[X] = sum_x x P(X=x)
E[X] = integral x p(x) dx
```

### 方差

```text
Var(X) = E[(X - E[X])^2] = E[X^2] - E[X]^2
```

### 熵

```text
H(p) = - sum_i p_i log p_i
```

### 交叉熵

```text
H(p, q) = - sum_i p_i log q_i
```

当真实标签是 one-hot，交叉熵退化为：

```text
L = -log q_y
```

### KL 散度

```text
D_KL(p || q) = sum_i p_i log(p_i / q_i)
```

关系：

```text
H(p, q) = H(p) + D_KL(p || q)
```

## 3. 机器学习

### 经验风险

```text
R_emp(f) = 1/m * sum_i L(f(x_i), y_i)
```

### 结构风险

```text
R(f) = R_emp(f) + lambda * Omega(f)
```

### 均方误差

```text
MSE = 1/m * sum_i (y_i - y_hat_i)^2
```

### 二分类交叉熵

```text
L = -[y log(p) + (1-y) log(1-p)]
```

### 多分类 softmax

```text
softmax(z_i) = exp(z_i) / sum_j exp(z_j)
```

### 多分类交叉熵

```text
L = - sum_i y_i log softmax(z_i)
```

one-hot 标签下：

```text
L = -log softmax(z_y)
```

## 4. 神经网络

### 神经元

```text
z = w^T x + b
a = phi(z)
```

### 多层网络

```text
h^(0) = x
z^(l) = W^(l) h^(l-1) + b^(l)
h^(l) = phi(z^(l))
```

### Sigmoid

```text
sigma(x) = 1 / (1 + exp(-x))
sigma'(x) = sigma(x)(1 - sigma(x))
```

### Tanh

```text
tanh(x) = (exp(x) - exp(-x)) / (exp(x) + exp(-x))
d/dx tanh(x) = 1 - tanh^2(x)
```

### ReLU

```text
ReLU(x) = max(0, x)
```

导数：

```text
1, x > 0
0, x < 0
```

## 5. 反向传播

### 链式法则

```text
dy/dx = dy/du * du/dx
```

### 输出层误差项

```text
delta^(L) = partial L / partial z^(L)
```

### 隐藏层误差项

```text
delta^(l) = (W^(l+1))^T delta^(l+1) odot phi'(z^(l))
```

### 参数梯度

```text
partial L / partial W^(l) = delta^(l) (h^(l-1))^T
partial L / partial b^(l) = delta^(l)
```

## 6. 优化

### 梯度下降

```text
theta_t+1 = theta_t - eta * grad_theta L(theta_t)
```

### Momentum

```text
v_t = beta v_{t-1} + grad_theta L(theta_t)
theta_t+1 = theta_t - eta v_t
```

### RMSProp

```text
s_t = beta s_{t-1} + (1-beta) g_t^2
theta_t+1 = theta_t - eta * g_t / sqrt(s_t + epsilon)
```

### Adam

```text
m_t = beta1 m_{t-1} + (1-beta1) g_t
v_t = beta2 v_{t-1} + (1-beta2) g_t^2
m_hat_t = m_t / (1 - beta1^t)
v_hat_t = v_t / (1 - beta2^t)
theta_t+1 = theta_t - eta * m_hat_t / (sqrt(v_hat_t) + epsilon)
```

## 7. CNN

### 二维卷积

```text
Y[i, j] = sum_m sum_n X[i+m, j+n] K[m, n]
```

### 卷积输出尺寸

```text
H_out = floor((H + 2P - D(K-1) - 1) / S + 1)
W_out = floor((W + 2P - D(K-1) - 1) / S + 1)
```

其中：

- `K` 是卷积核大小；
- `P` 是 padding；
- `S` 是 stride；
- `D` 是 dilation。

## 8. RNN

### 普通 RNN

```text
h_t = phi(W_xh x_t + W_hh h_{t-1} + b_h)
y_t = W_hy h_t + b_y
```

### LSTM

```text
f_t = sigmoid(W_f [h_{t-1}, x_t] + b_f)
i_t = sigmoid(W_i [h_{t-1}, x_t] + b_i)
g_t = tanh(W_g [h_{t-1}, x_t] + b_g)
c_t = f_t odot c_{t-1} + i_t odot g_t
o_t = sigmoid(W_o [h_{t-1}, x_t] + b_o)
h_t = o_t odot tanh(c_t)
```

### GRU

```text
z_t = sigmoid(W_z [h_{t-1}, x_t])
r_t = sigmoid(W_r [h_{t-1}, x_t])
h_tilde_t = tanh(W_h [r_t odot h_{t-1}, x_t])
h_t = (1 - z_t) odot h_{t-1} + z_t odot h_tilde_t
```

## 9. Attention

### Scaled Dot-Product Attention

```text
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V
```

### Multi-Head Attention

```text
head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
MultiHead(Q,K,V) = Concat(head_1,...,head_h) W^O
```

