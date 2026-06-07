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

## 本章检查清单

- 是否熟悉 vector 的常用操作？
- 是否能区分 map 和 unordered_map？
- 是否理解迭代器失效？
- 是否会使用 sort、find、count_if、transform？
- 是否知道 erase-remove idiom？

