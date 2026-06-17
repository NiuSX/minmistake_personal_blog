# 09. STL 容器、迭代器与算法

<!-- lecture-notes:integrated-v2 -->

## 讲义导读：把 C++ 放进对象生命周期与工具链

这一章讲的是 **09. STL 容器、迭代器与算法**。C++ 学习不能只按“语法点”推进，更要围绕对象生命周期、资源所有权、类型约束、编译链接、标准库和工程化工具来理解。C++ 给你很强的控制力，也要求你明确每个对象何时创建、谁拥有资源、何时释放、错误如何传播。

### 一句话先懂

STL 的核心是用容器管理数据、用迭代器连接数据和算法、用算法表达意图。

### 通俗类比

STL 像标准化仓库系统：vector 是连续货架，list 是链式货架，map 是索引柜，算法是仓库作业流程，迭代器是搬运路线。

类比只是帮助建立直觉，不能替代准确概念。真正写 C++ 时，要回到对象生命周期、值语义、引用语义、异常安全、迭代器有效性、线程同步和编译器诊断上。能解释“为什么这样写不会泄漏、不会悬空、不会数据竞争”，才算真正理解。

### 本章学习主线

1. **先看对象生命周期**：对象在哪里创建，什么时候销毁，是否会拷贝或移动？
2. **再看所有权边界**：谁拥有资源，谁只是借用，是否需要 unique_ptr、shared_ptr、引用或普通值？
3. **然后看类型约束**：哪些错误能在编译期发现，哪些只能靠测试、Sanitizer 或运行时检查发现？
4. **接着看标准库表达**：能否用容器、算法、RAII 和类型系统表达意图，而不是手写脆弱流程？
5. **最后看工程验证**：是否打开警告、写测试、跑 Sanitizer、检查 release 构建和跨编译器差异？

### 概念怎么学才不容易忘

遇到一个 C++ 概念，建议按“白话解释 -> 内存/生命周期图 -> 最小代码 -> 故意写错 -> 工具诊断”五步走。比如学引用，要画出它绑定到哪个对象；学移动语义，要观察 moved-from 对象状态；学并发，要用 ThreadSanitizer 或小测试暴露数据竞争；学模板，要看编译器如何实例化和报错。

### 最小实践任务

用 vector/map/unordered_map 和 algorithm 实现文本词频统计，并比较手写循环与标准算法的可读性。

实践时要保留失败样本。C++ 的很多知识只有在错误里才真正清楚，例如悬空引用、重复释放、迭代器失效、ODR 问题、链接失败、未定义行为和数据竞争。把失败代码、编译器报错、Sanitizer 输出和修复方式记下来，比只保存正确答案更有学习价值。

### 读完本章应该能产出

能选择合适容器；能理解迭代器失效、复杂度和所有权；能用 sort、find_if、transform、accumulate 等算法表达意图。

> 本节是全篇讲义化改写的阅读入口，后续正文中的定义、步骤、示例和参考资料都应围绕这条学习主线来理解。

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
