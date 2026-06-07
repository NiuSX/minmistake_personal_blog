# 10. 现代 C++ 常用特性

## 什么是现代 C++

现代 C++ 通常指 C++11 及之后的 C++。它强调：

- RAII。
- 智能指针。
- 移动语义。
- 类型推导。
- lambda。
- 标准库容器和算法。
- 并发库。
- 更强的编译期能力。

## C++11 重点

### auto

```cpp
auto value = 42;
```

### range-based for

```cpp
for (const auto& item : items) {
    std::cout << item << '\n';
}
```

### lambda

```cpp
auto is_even = [](int x) {
    return x % 2 == 0;
};
```

### nullptr

```cpp
int* p = nullptr;
```

### enum class

```cpp
enum class Status {
    Ok,
    Failed
};
```

### move semantics

```cpp
auto p1 = std::make_unique<int>(10);
auto p2 = std::move(p1);
```

### smart pointers

```cpp
std::unique_ptr<User> user;
std::shared_ptr<Config> config;
std::weak_ptr<Node> parent;
```

### thread

```cpp
std::thread worker([] {
    // do work
});
worker.join();
```

## C++14 重点

### 泛型 lambda

```cpp
auto add = [](auto a, auto b) {
    return a + b;
};
```

### make_unique

```cpp
auto user = std::make_unique<User>();
```

## C++17 重点

### structured bindings

```cpp
auto [name, age] = get_user();
```

遍历 map：

```cpp
for (const auto& [key, value] : scores) {
    std::cout << key << ": " << value << '\n';
}
```

### if constexpr

```cpp
template <typename T>
void print(T value) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "integer\n";
    } else {
        std::cout << "other\n";
    }
}
```

### optional

```cpp
std::optional<User> find_user(int id);

if (auto user = find_user(1)) {
    std::cout << user->name << '\n';
}
```

### variant

```cpp
std::variant<int, std::string> value;
value = 10;
value = "text";
```

### string_view

```cpp
void print(std::string_view text);
```

### filesystem

```cpp
for (const auto& entry : std::filesystem::directory_iterator(".")) {
    std::cout << entry.path() << '\n';
}
```

## C++20 重点

### concepts

```cpp
template <std::integral T>
T add(T a, T b) {
    return a + b;
}
```

### ranges

```cpp
std::ranges::sort(values);
```

### span

```cpp
void process(std::span<const int> values);
```

### coroutines

C++20 引入协程语言机制，但标准库没有提供完整高层任务框架。实际项目通常依赖框架或库。

### modules

Modules 旨在替代部分头文件机制，改善编译和封装。但不同编译器和构建系统支持差异较大，工程使用要谨慎评估。

## C++23 重点

C++23 继续增强标准库和 ranges，常见关注点：

- `std::expected`：表示成功值或错误值。
- `std::print`：更方便的格式化输出。
- ranges 进一步完善。
- `std::mdspan`：多维数组视图。

使用 C++23 特性时要检查编译器和标准库支持。

## initializer list

```cpp
std::vector<int> values{1, 2, 3};
```

注意花括号初始化与构造函数重载可能产生不同匹配。

## noexcept

```cpp
void f() noexcept {
}
```

`noexcept` 表示函数承诺不抛异常。移动构造函数常用 `noexcept`。

## attributes

常见属性：

```cpp
[[nodiscard]] int compute();
[[maybe_unused]] int debug_value;
```

`[[nodiscard]]` 提醒调用者不要忽略返回值。

## 三路比较

C++20：

```cpp
#include <compare>

struct Point {
    int x{};
    int y{};

    auto operator<=>(const Point&) const = default;
};
```

可自动生成比较逻辑。

## 使用现代 C++ 的原则

- 用 `nullptr` 替代 `NULL`。
- 用 `std::array`、`std::vector` 替代裸数组。
- 用 `std::string`、`std::string_view` 替代 C 字符串。
- 用智能指针表达所有权。
- 用范围 for 和算法替代手写索引循环。
- 用 `enum class` 替代传统 enum。
- 用 `optional` 表达可能没有值。
- 用 `variant` 表达多种可能类型。
- 用 `expected` 或错误类型表达可恢复错误。

## 本章检查清单

- 是否知道 C++11 为什么是现代 C++ 起点？
- 是否会使用 optional、variant、string_view？
- 是否理解 ranges、concepts 的基本价值？
- 是否知道 modules 和 coroutines 在工程中需要看工具链支持？
- 是否能根据编译器支持选择合适标准？

