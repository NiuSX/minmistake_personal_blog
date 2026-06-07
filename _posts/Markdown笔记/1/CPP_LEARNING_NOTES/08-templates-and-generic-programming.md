# 08. 模板与泛型编程

## 模板是什么

模板允许编写与类型无关的代码。编译器会根据使用的具体类型生成代码。

函数模板：

```cpp
template <typename T>
T max_value(T a, T b) {
    return a > b ? a : b;
}
```

调用：

```cpp
auto x = max_value(1, 2);
auto y = max_value(1.5, 2.5);
```

## typename 与 class

模板参数中 `typename` 和 `class` 多数情况下等价：

```cpp
template <typename T>
void f(T value) {}

template <class T>
void g(T value) {}
```

现代代码中更常用 `typename` 表达“这是一个类型参数”。

## 类模板

```cpp
template <typename T>
class Box {
public:
    explicit Box(T value) : value_{std::move(value)} {}

    const T& value() const {
        return value_;
    }

private:
    T value_;
};
```

使用：

```cpp
Box<int> int_box{10};
Box<std::string> string_box{"cpp"};
```

## 非类型模板参数

```cpp
template <typename T, std::size_t N>
class Array {
private:
    T data_[N]{};
};
```

`std::array<T, N>` 就是典型例子。

## 模板特化

对某个类型提供特殊实现：

```cpp
template <typename T>
struct TypeName {
    static std::string value() {
        return "unknown";
    }
};

template <>
struct TypeName<int> {
    static std::string value() {
        return "int";
    }
};
```

特化适合处理少量类型差异，不应滥用。

## 可变参数模板

```cpp
template <typename... Args>
void print_all(const Args&... args) {
    ((std::cout << args << ' '), ...);
    std::cout << '\n';
}
```

这里使用了 C++17 折叠表达式。

## 模板与头文件

模板定义通常放在头文件中，因为编译器实例化模板时需要看到完整定义。

```cpp
// add.h
#pragma once

template <typename T>
T add(T a, T b) {
    return a + b;
}
```

## auto 与 decltype

`auto` 根据初始化表达式推导类型。

`decltype` 获取表达式类型：

```cpp
int x = 10;
decltype(x) y = 20; // int
```

结合返回类型：

```cpp
template <typename A, typename B>
auto add(A a, B b) -> decltype(a + b) {
    return a + b;
}
```

现代 C++ 中也可直接：

```cpp
template <typename A, typename B>
auto add(A a, B b) {
    return a + b;
}
```

## SFINAE 简介

SFINAE 表示替换失败不是错误。它允许根据类型能力选择模板重载。

传统写法复杂，现代 C++ 更推荐使用 concepts。

## Concepts

C++20 引入 concepts，用于约束模板参数。

```cpp
#include <concepts>

template <std::integral T>
T add(T a, T b) {
    return a + b;
}
```

自定义 concept：

```cpp
template <typename T>
concept HasSize = requires(T value) {
    value.size();
};

template <HasSize T>
auto get_size(const T& value) {
    return value.size();
}
```

优点：

- 错误信息更清晰。
- 约束更明确。
- 接口意图更强。

## 泛型编程思想

泛型编程关注“类型需要满足什么能力”，而不是“类型具体是什么”。

例如：

```cpp
template <typename Range>
void print_range(const Range& range) {
    for (const auto& item : range) {
        std::cout << item << '\n';
    }
}
```

只要对象支持范围 for，就可以使用。

## 模板常见问题

### 编译错误难读

模板错误可能很长。应从最靠近自己代码的位置看起。

### 编译时间变长

模板会增加编译复杂度。大型项目要注意头文件依赖。

### 过度泛化

不是所有代码都需要模板。只有确实需要处理多种类型时再使用。

## 本章检查清单

- 是否能写函数模板和类模板？
- 是否知道模板定义通常放在头文件？
- 是否理解 `auto` 和 `decltype` 的用途？
- 是否知道 concepts 用于约束模板？
- 是否能避免为了炫技过度模板化？

