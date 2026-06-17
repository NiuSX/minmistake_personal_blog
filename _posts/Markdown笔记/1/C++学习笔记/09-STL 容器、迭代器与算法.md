# 09. STL 容器、迭代器与算法

## STL 是什么

STL 是 C++ 标准库的重要组成，包含：

- 容器：保存数据。
- 迭代器：访问容器元素。
- 算法：处理数据。
- 函数对象：自定义行为。

核心思想：算法通过迭代器操作容器，从而解耦数据结构和算法。

## vector

`std::vector` 是动态数组，最常用容器。

```cpp
#include <vector>

std::vector<int> values{1, 2, 3};
values.push_back(4);
```

特点：

- 连续内存。
- 随机访问快。
- 尾部插入快。
- 中间插入删除可能移动大量元素。

常用：

```cpp
values.size();
values.empty();
values[0];
values.at(0);
values.push_back(5);
values.pop_back();
```

`at` 会检查越界，`[]` 不检查。

## array

固定大小数组：

```cpp
#include <array>

std::array<int, 3> values{1, 2, 3};
```

大小是类型的一部分。

## deque

双端队列：

```cpp
std::deque<int> q;
q.push_front(1);
q.push_back(2);
```

适合两端频繁插入删除。

## list 与 forward_list

链表：

```cpp
std::list<int> values;
```

链表中间插入删除稳定，但随机访问差，缓存局部性差。实际项目中不要默认认为链表更快，很多场景 vector 更快。

## map 与 unordered_map

有序映射：

```cpp
std::map<std::string, int> scores;
scores["Alice"] = 90;
```

哈希映射：

```cpp
std::unordered_map<std::string, int> scores;
scores["Alice"] = 90;
```

区别：

| 容器 | 底层思想 | 是否有序 | 平均查找 |
| --- | --- | --- | --- |
| map | 红黑树 | 有序 | O(log n) |
| unordered_map | 哈希表 | 无序 | O(1) |

## set 与 unordered_set

保存不重复元素：

```cpp
std::set<int> ordered;
std::unordered_set<int> hashed;
```

## 迭代器

```cpp
std::vector<int> values{1, 2, 3};

for (auto it = values.begin(); it != values.end(); ++it) {
    std::cout << *it << '\n';
}
```

范围 for 更简洁：

```cpp
for (int value : values) {
    std::cout << value << '\n';
}
```

## 迭代器失效

容器修改可能导致迭代器失效。

例如 vector 扩容后，旧迭代器可能失效：

```cpp
auto it = values.begin();
values.push_back(10);
// it 可能已经失效
```

不同容器规则不同，修改容器时必须查文档。

## algorithm

标准算法位于 `<algorithm>`。

### find

```cpp
auto it = std::find(values.begin(), values.end(), 3);
if (it != values.end()) {
    std::cout << "found\n";
}
```

### sort

```cpp
std::sort(values.begin(), values.end());
```

自定义排序：

```cpp
std::sort(users.begin(), users.end(), [](const User& a, const User& b) {
    return a.age < b.age;
});
```

### count_if

```cpp
auto count = std::count_if(values.begin(), values.end(), [](int x) {
    return x > 0;
});
```

### transform

```cpp
std::vector<int> output;
std::transform(values.begin(), values.end(), std::back_inserter(output), [](int x) {
    return x * 2;
});
```

### remove_if

删除符合条件的元素：

```cpp
values.erase(
    std::remove_if(values.begin(), values.end(), [](int x) {
        return x < 0;
    }),
    values.end()
);
```

这是 erase-remove idiom。

## ranges

C++20 引入 ranges：

```cpp
#include <ranges>
#include <algorithm>

std::ranges::sort(values);
```

views 支持惰性组合：

```cpp
auto positive = values
    | std::views::filter([](int x) { return x > 0; })
    | std::views::transform([](int x) { return x * 2; });
```

## 选择容器

常用建议：

- 默认用 `std::vector`。
- 固定大小用 `std::array`。
- 需要队列两端操作用 `std::deque`。
- 需要有序键值用 `std::map`。
- 需要快速查找且不关心顺序用 `std::unordered_map`。
- 需要唯一集合用 `set` 或 `unordered_set`。

## 深入补充：容器选择决策

| 需求 | 优先选择 | 原因 |
| --- | --- | --- |
| 大多数顺序数据 | `std::vector` | 连续内存、缓存友好、随机访问快 |
| 固定长度 | `std::array` | 栈上或对象内存储，长度属于类型 |
| 频繁头尾插入删除 | `std::deque` | 两端操作稳定 |
| 需要按键排序遍历 | `std::map` / `std::set` | 有序结构 |
| 只需要快速查找 | `std::unordered_map` / `std::unordered_set` | 平均 O(1) 查找 |
| 频繁中间插入删除 | 先重新评估需求 | `list` 不一定更快，缓存局部性较差 |

默认选 `vector` 是因为它简单、快、内存连续。只有明确需求推翻它时，再换其他容器。

## 深入补充：迭代器失效规则

迭代器失效是 STL 常见 bug 来源。大致规则：

- `vector` 扩容会使所有迭代器、引用、指针失效。
- `vector` 中间插入/删除会使插入点或删除点之后的迭代器失效。
- `map`、`set` 插入通常不影响已有迭代器，删除只影响被删除元素。
- `unordered_map` rehash 会使迭代器失效。

安全删除示例：

```cpp
for (auto it = values.begin(); it != values.end();) {
    if (*it < 0) {
        it = values.erase(it);
    } else {
        ++it;
    }
}
```

## 深入补充：算法优先于手写循环

标准算法把意图写得更清楚：

```cpp
const auto found = std::ranges::find(users, id, &User::id);
const auto adult_count = std::ranges::count_if(users, [](const User& user) {
    return user.age >= 18;
});
```

算法也减少了下标越界、边界条件和重复代码。使用算法时重点关注：

- 输入范围是什么。
- 谓词是否有副作用。
- 是否会改变元素顺序或内容。
- 返回值是迭代器、计数还是新范围。

## 深入补充：Ranges 和 Views

Ranges 的价值是减少显式迭代器，并支持管道式组合。Views 通常是惰性的，不会立刻生成新容器：

```cpp
auto names = users
    | std::views::filter([](const User& user) { return user.active; })
    | std::views::transform([](const User& user) { return user.name; });
```

注意：view 也常常不拥有底层数据。如果底层容器销毁，view 会悬空。

## 本章检查清单

- 是否熟悉 vector 的常用操作？
- 是否能区分 map 和 unordered_map？
- 是否理解迭代器失效？
- 是否会使用 sort、find、count_if、transform？
- 是否知道 erase-remove idiom？

## 参考资料

- [Reference: cppreference containers library](https://cppreference.com/w/cpp/container)
- [Reference: cppreference algorithms library](https://cppreference.com/w/cpp/algorithm)
- [Reference: cppreference ranges library](https://cppreference.com/w/cpp/ranges)
- [Guideline: C++ Core Guidelines SL: Standard library](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-libraries)

<!-- research-notes: enhanced-v1 -->

## 研究笔记增强

> Last reviewed: 2026-06-17。此节用于把《09. STL 容器、迭代器与算法》从阅读笔记推进到可复习、可实践、可验证的研究笔记；具体版本、参数和环境仍需结合官方资料、项目约束和实测结果校准。

### 知识定位

同时关注语言规则、对象生命周期、资源所有权、编译链接和运行时诊断。

### 重点补充
- 围绕 RAII、值语义、移动语义和智能指针建立资源管理模型。
- 把编译、链接、头文件、模板实例化和 ABI 问题作为工程能力学习。
- 用 warning、sanitizer、静态分析和单元测试捕获未定义行为。
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
- 学完《09. STL 容器、迭代器与算法》后，能否用自己的话说明它解决什么问题、不解决什么问题？
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
主题：09. STL 容器、迭代器与算法
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
