# 03. 类型、运算符与流程控制

## 基本类型

整数类型：

```cpp
short s;
int i;
long l;
long long ll;
```

无符号整数：

```cpp
unsigned int count;
std::size_t size;
```

浮点类型：

```cpp
float f;
double d;
long double ld;
```

字符和布尔：

```cpp
char ch = 'A';
bool ok = true;
```

## 类型大小

可以用 `sizeof` 查看类型或对象大小：

```cpp
std::cout << sizeof(int) << '\n';
std::cout << sizeof(double) << '\n';
```

注意：C++ 标准并不保证所有平台上 `int` 都是 4 字节，只保证相对范围约束。

如果需要固定宽度类型，使用：

```cpp
#include <cstdint>

std::int32_t x = 10;
std::uint64_t y = 100;
```

## 类型转换

隐式转换：

```cpp
double d = 3; // int 转 double
```

显式转换：

```cpp
double d = 3.14;
int x = static_cast<int>(d);
```

C++ 常用转换：

- `static_cast`：常规安全转换。
- `const_cast`：移除 const，谨慎使用。
- `reinterpret_cast`：底层重解释，高风险。
- `dynamic_cast`：多态类型运行时转换。

避免 C 风格转换：

```cpp
int x = (int)d; // 不推荐
```

## 运算符

算术运算：

```cpp
a + b;
a - b;
a * b;
a / b;
a % b;
```

比较运算：

```cpp
a == b;
a != b;
a < b;
a <= b;
a > b;
a >= b;
```

逻辑运算：

```cpp
ok && valid;
ok || valid;
!ok;
```

赋值运算：

```cpp
x += 1;
x -= 1;
x *= 2;
x /= 2;
```

## 整数除法

```cpp
int a = 5;
int b = 2;
std::cout << a / b << '\n'; // 2
```

如果需要浮点结果：

```cpp
double result = static_cast<double>(a) / b;
```

## if 语句

```cpp
if (score >= 90) {
    std::cout << "A\n";
} else if (score >= 80) {
    std::cout << "B\n";
} else {
    std::cout << "C\n";
}
```

C++17 支持 if 初始化：

```cpp
if (auto it = users.find(id); it != users.end()) {
    std::cout << it->second << '\n';
}
```

## switch 语句

```cpp
switch (level) {
case 1:
    std::cout << "low\n";
    break;
case 2:
    std::cout << "medium\n";
    break;
default:
    std::cout << "unknown\n";
    break;
}
```

注意 `break`，否则会继续执行后续 case。

## for 循环

```cpp
for (int i = 0; i < 10; ++i) {
    std::cout << i << '\n';
}
```

范围 for：

```cpp
std::vector<int> values{1, 2, 3};

for (int value : values) {
    std::cout << value << '\n';
}
```

如果不想拷贝元素：

```cpp
for (const auto& value : values) {
    std::cout << value << '\n';
}
```

## while 与 do while

```cpp
while (condition) {
    // ...
}
```

```cpp
do {
    // 至少执行一次
} while (condition);
```

## break 与 continue

`break` 结束循环：

```cpp
for (int x : values) {
    if (x < 0) {
        break;
    }
}
```

`continue` 跳过本轮：

```cpp
for (int x : values) {
    if (x == 0) {
        continue;
    }
    std::cout << x << '\n';
}
```

## 枚举

传统 enum：

```cpp
enum Color {
    Red,
    Green,
    Blue
};
```

推荐使用强类型枚举：

```cpp
enum class Color {
    Red,
    Green,
    Blue
};

Color c = Color::Red;
```

`enum class` 不会隐式转换为整数，命名污染更少。

## 本章检查清单

- 是否知道整数除法和浮点除法的区别？
- 是否会使用 `static_cast`？
- 是否理解 `for` 和范围 `for`？
- 是否知道 `enum class` 优于传统 enum 的原因？
- 是否能避免无符号整数比较陷阱？

