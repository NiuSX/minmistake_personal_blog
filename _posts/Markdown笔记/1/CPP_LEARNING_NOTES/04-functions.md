# 04. 函数

## 函数定义

```cpp
int add(int a, int b) {
    return a + b;
}
```

组成：

- 返回类型：`int`。
- 函数名：`add`。
- 参数列表：`int a, int b`。
- 函数体：花括号内代码。

## 函数声明与定义

声明：

```cpp
int add(int a, int b);
```

定义：

```cpp
int add(int a, int b) {
    return a + b;
}
```

头文件通常放声明，源文件放定义。

## 参数传递

### 值传递

```cpp
void increment(int x) {
    ++x;
}
```

函数内部修改不会影响外部变量。

适合小型类型，例如 int、double、bool。

### 引用传递

```cpp
void increment(int& x) {
    ++x;
}
```

会修改外部变量。

### const 引用传递

```cpp
void print_user(const User& user) {
    std::cout << user.name << '\n';
}
```

适合大型对象，避免拷贝，同时禁止函数修改对象。

### 指针传递

```cpp
void update(int* value) {
    if (value != nullptr) {
        ++(*value);
    }
}
```

适合可空参数或需要表达地址关系的场景。

## 返回值

```cpp
std::string make_name() {
    return "cpp";
}
```

现代 C++ 中返回对象通常是高效的，编译器会进行返回值优化或移动。

## 函数重载

同名函数可以有不同参数列表：

```cpp
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}
```

不能只靠返回类型区分重载。

## 默认参数

```cpp
void log(const std::string& message, int level = 1) {
    std::cout << "[" << level << "] " << message << '\n';
}
```

默认参数通常放在声明处。

## inline 函数

头文件中定义的小函数可以使用 `inline`：

```cpp
inline int square(int x) {
    return x * x;
}
```

`inline` 主要解决多翻译单元重复定义问题，不应简单理解为强制内联优化。

## constexpr 函数

```cpp
constexpr int square(int x) {
    return x * x;
}

constexpr int value = square(5);
```

`constexpr` 函数可在编译期求值，也可在运行期调用。

## 递归

```cpp
int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}
```

递归必须有终止条件。深递归可能造成栈溢出。

## lambda 表达式

lambda 是匿名函数：

```cpp
auto add = [](int a, int b) {
    return a + b;
};

std::cout << add(1, 2) << '\n';
```

捕获外部变量：

```cpp
int base = 10;

auto add_base = [base](int x) {
    return base + x;
};
```

按引用捕获：

```cpp
int count = 0;

auto inc = [&count]() {
    ++count;
};
```

捕获建议：

- 优先显式捕获。
- 避免在长生命周期 lambda 中按引用捕获局部变量。
- 不要随意使用 `[&]` 或 `[=]` 捕获所有变量。

## 函数对象

重载 `operator()` 的对象可以像函数一样调用：

```cpp
struct Adder {
    int base{};

    int operator()(int x) const {
        return base + x;
    }
};

Adder add10{10};
std::cout << add10(5) << '\n';
```

函数对象常用于算法、自定义排序和策略对象。

## std::function

`std::function` 可以保存可调用对象：

```cpp
#include <functional>

std::function<int(int, int)> op = [](int a, int b) {
    return a + b;
};
```

它有类型擦除开销。性能敏感场景可使用模板参数接收可调用对象。

## 函数设计建议

- 一个函数只做一件清晰的事。
- 参数数量不要过多。
- 优先返回值，而不是输出参数。
- 大对象用 `const&` 传入。
- 需要转移所有权时用智能指针或移动语义表达。
- 高风险函数命名要明确，例如 `delete_file`。

## 本章检查清单

- 是否能区分值传递、引用传递和指针传递？
- 是否知道 `const&` 的用途？
- 是否会写 lambda？
- 是否知道函数重载不能只按返回类型区分？
- 是否理解 `constexpr` 函数的意义？

