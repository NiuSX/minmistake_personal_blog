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

<!-- lecture-notes:start -->

## 讲义级补充：如何真正学懂《09. STL 容器、迭代器与算法》

> 适用位置：C++学习笔记\09-STL 容器、迭代器与算法.md  
> 说明：本补充用于把原始提纲扩展成课堂讲义式学习材料。阅读时建议先看原文，再用本节建立知识框架、例子、实践和自测闭环。

### 1. 这一讲要解决什么问题

这部分知识直接关系到类型安全、资源生命周期和运行时成本。学习时要同时关注语法表面、对象生命周期、内存所有权和编译器会生成什么代码。

学习本讲时，可以用三个问题检查自己是否真的理解：

1. 它解决的真实问题是什么？
2. 如果没有它，系统会出现什么具体麻烦？
3. 在真实项目中，应该用什么现象或指标判断它做得好不好？

### 2. 核心知识拆解

可以把本讲拆成几块来学：

- 类型与值：变量、表达式、引用、指针和 const 语义。
- 生命周期：构造、析构、拷贝、移动和所有权。
- 抽象机制：类、模板、STL、泛型和 RAII。
- 工程能力：构建、调试、测试、性能分析和并发安全。

拆解的好处是防止“整章都懂一点，但哪块都说不清”。复习时可以逐块追问：它的输入是什么、输出是什么、依赖什么、失败时有什么表现。

### 3. 通俗类比

可以把本主题看成一个“输入-处理-输出-反馈”的系统：先弄清输入从哪里来，经过哪些规则或算法，输出给谁使用，再看错误如何被发现和修正。

类比不是严格定义，但能帮助初学者先建立直觉。真正使用时，还要回到术语、公式、接口、数据结构、时序图或工程规范上，把“感觉理解”变成“可验证理解”。

### 4. 具体例子

学习《09. STL 容器、迭代器与算法》时，先做一个最小可验证例子：输入要小，步骤要清楚，输出要能检查。然后故意制造一个错误，观察系统如何失败，并记录排查顺序。

讲义级学习不能只停留在“概念解释”。至少要有一个能跑、能算、能画或能检查的例子。例子越小，越容易看清关键机制；等机制清楚后，再逐步扩展到复杂项目。

### 5. 学习路径

- 先确认基本语法和类型规则，再观察对象创建、拷贝、移动和销毁的时机。
- 把资源管理统一放到 RAII、智能指针和容器语义下理解。
- 遇到模板、并发和性能问题时，用最小示例验证编译器行为。

建议每学完一小节都做一次“复述练习”：不用看笔记，用自己的话讲清楚概念、输入、输出、关键步骤和常见错误。如果讲不清，通常说明还没有真正掌握。

### 6. 课堂讲解框架

可以按下面顺序讲解或复习本主题：

1. 背景：先讲这个知识为什么出现，它试图降低什么成本、解决什么风险或提升什么能力。
2. 基本概念：给出核心名词的准确定义，说明它们之间的关系。
3. 工作流程：按时间顺序描述一次完整过程，必要时画出流程图、状态机或数据流图。
4. 关键细节：解释最容易误解的机制，例如边界条件、异常处理、性能限制、资源生命周期或安全约束。
5. 实战例子：用一个足够小但完整的例子，把概念落到命令、代码、图纸、配置、数据或操作步骤上。
6. 反例与排错：展示错误做法会导致什么现象，再说明如何定位和修复。
7. 总结迁移：最后说明它和相邻知识点的区别、联系以及后续该学什么。

### 7. 最小实践任务

为了避免“看懂了但不会用”，建议为本讲配一个最小实践：

- 选一个可以在 30 到 90 分钟内完成的小任务。
- 明确输入、预期输出和验收标准。
- 记录遇到的第一个错误、定位过程和最终修复方法。
- 完成后写 5 行复盘：我原来以为是什么，实际是什么，下次会如何更快处理。

如果本主题偏理论，实践可以是手算一个小例子、画一张流程图、推导一个简化公式或解释一段真实日志；如果偏工程，实践应该尽量落到可运行命令、可测试代码、可检查配置或可测量硬件现象上。

### 8. 常见误区

- 只记结论，不理解适用条件。
- 只看正常流程，不看异常、边界和失败恢复。
- 学完没有做最小实践，导致知识停留在熟悉感。

遇到这些问题时，不要急着背更多资料。更有效的办法是回到一个最小例子，把输入、状态变化、输出和验证方式重新走一遍。

### 9. 自测题

1. 用一句话说明本讲主题解决的核心问题。
2. 列出本讲最重要的 3 个概念，并说明它们的关系。
3. 举一个生活类比，再指出这个类比在哪些地方不严谨。
4. 写出一个最小实践任务的验收标准。
5. 如果结果不符合预期，你会优先检查哪 3 个环节？为什么？
6. 本讲和相邻章节的知识边界是什么？哪些问题应该交给其他章节解决？

### 10. 复习口诀

先问场景，再看输入；先拆结构，再走流程；先做小例，再谈优化；先会排错，再做规模化。

<!-- lecture-notes:end -->
