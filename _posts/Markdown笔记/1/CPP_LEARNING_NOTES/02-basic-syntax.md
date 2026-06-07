# 02. 基本语法

## 程序结构

最小 C++ 程序：

```cpp
int main() {
    return 0;
}
```

`main` 是程序入口。返回 `0` 表示程序正常结束。

## 注释

单行注释：

```cpp
// 这是单行注释
```

多行注释：

```cpp
/*
  这是多行注释
*/
```

注释应解释意图，而不是重复代码本身。

## 变量

```cpp
int age = 18;
double price = 19.99;
char grade = 'A';
bool passed = true;
```

变量定义包含类型、名称和可选初始值。

推荐尽量初始化变量：

```cpp
int count{};          // 初始化为 0
std::string name{};   // 初始化为空字符串
```

## 常量

使用 `const`：

```cpp
const int max_users = 100;
```

使用 `constexpr` 表示编译期常量：

```cpp
constexpr double pi = 3.1415926;
```

区别：

- `const` 表示对象不可修改。
- `constexpr` 表示值可在编译期求出。

## 命名规范

常见风格：

```cpp
int user_count;
double total_price;
std::string file_name;
```

建议：

- 名称表达含义。
- 避免使用 `a`、`b`、`tmp` 这类无意义名称，除非作用域很小。
- 类型名可用 `PascalCase`，变量和函数可用 `snake_case` 或 `camelCase`，项目内保持一致。

## 标准输入输出

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    int age{};

    std::cout << "Name: ";
    std::cin >> name;

    std::cout << "Age: ";
    std::cin >> age;

    std::cout << name << " is " << age << " years old.\n";
}
```

`std::cin >> name` 默认按空白分隔。如果要读取整行：

```cpp
std::string line;
std::getline(std::cin, line);
```

## 命名空间

标准库位于 `std` 命名空间。

```cpp
std::cout << "hello\n";
```

不建议在头文件中写：

```cpp
using namespace std;
```

因为它会污染包含该头文件的所有文件，增加命名冲突风险。

可以在很小的源文件作用域中谨慎使用：

```cpp
using std::cout;
using std::string;
```

## 作用域

花括号定义作用域：

```cpp
int x = 1;

{
    int x = 2;
    std::cout << x << '\n'; // 2
}

std::cout << x << '\n';     // 1
```

变量应尽量靠近使用位置定义，减少误用。

## 初始化方式

C++ 支持多种初始化：

```cpp
int a = 1;
int b(2);
int c{3};
```

现代 C++ 推荐使用花括号初始化：

```cpp
int count{10};
std::vector<int> values{1, 2, 3};
```

花括号初始化能避免部分窄化转换：

```cpp
int x{3.14}; // 编译错误，避免数据丢失
```

## auto

`auto` 让编译器推导类型：

```cpp
auto count = 10;        // int
auto price = 9.99;      // double
auto name = std::string{"cpp"};
```

适合：

- 类型很长。
- 迭代器。
- lambda。
- 返回类型明确的表达式。

不适合：

- 初学阶段为了逃避理解类型。
- 可能造成类型误解的场景。

## 字符串

使用 `std::string`：

```cpp
#include <string>

std::string first = "C";
std::string second = "++";
std::string language = first + second;
```

常用操作：

```cpp
language.size();
language.empty();
language[0];
language.find("++");
language.substr(0, 1);
```

## 代码块与分号

C++ 语句通常以分号结束：

```cpp
int x = 1;
std::cout << x << '\n';
```

函数、if、for 的代码块不需要在右花括号后加分号，但类定义需要：

```cpp
class User {
};
```

## 本章检查清单

- 是否理解变量定义和初始化？
- 是否会使用 `std::cin`、`std::cout`、`std::getline`？
- 是否知道 `std` 命名空间？
- 是否能解释 `const` 和 `constexpr` 的区别？
- 是否知道为什么推荐尽量初始化变量？

