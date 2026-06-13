# 01. C++ 概览与开发环境

## C++ 是什么

C++ 是一门高性能、静态类型、编译型、多范式语言。它支持过程式编程、面向对象编程、泛型编程、函数式风格和底层系统编程。

常见应用场景：

- 操作系统、驱动、嵌入式。
- 游戏引擎和图形渲染。
- 高性能服务端。
- 金融交易系统。
- 数据库和存储系统。
- 编译器、虚拟机、基础设施。
- 音视频、图像处理。
- 科学计算和高性能计算。

## C++ 标准

C++ 语言由 ISO 标准化。常见标准版本：

- C++98 / C++03：早期标准。
- C++11：现代 C++ 的重要起点，引入 auto、lambda、右值引用、移动语义、智能指针、线程库等。
- C++14：对 C++11 的补充和改进。
- C++17：结构化绑定、if constexpr、filesystem、optional、variant、string_view 等。
- C++20：concepts、ranges、coroutines、modules、三路比较等。
- C++23：标准库和语言继续增强，例如 ranges 改进、std::expected、std::print 等。
- C++26：后续标准方向，具体使用要以编译器支持情况为准。

工程实践中常见选择：

- 新项目至少使用 C++17。
- 追求现代能力可使用 C++20。
- C++23 特性要检查编译器支持。
- 老项目可能受限于 C++11 或 C++14。

## 编译器

主流编译器：

- GCC：Linux 上常见。
- Clang：跨平台，诊断信息友好。
- MSVC：Windows / Visual Studio 生态。

查看版本：

```bash
g++ --version
clang++ --version
cl
```

## 第一个程序

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}
```

说明：

- `#include <iostream>` 引入标准输入输出库。
- `int main()` 是程序入口。
- `std::cout` 是标准输出流。
- `std::endl` 输出换行并刷新缓冲区。
- `return 0` 表示程序正常结束。

## 编译运行

使用 GCC：

```bash
g++ -std=c++20 -Wall -Wextra -O2 main.cpp -o app
./app
```

使用 Clang：

```bash
clang++ -std=c++20 -Wall -Wextra -O2 main.cpp -o app
./app
```

Windows MSVC 开发者命令行：

```bat
cl /std:c++20 /EHsc main.cpp
main.exe
```

常用参数：

- `-std=c++20`：指定语言标准。
- `-Wall -Wextra`：开启更多警告。
- `-O2`：优化。
- `-g`：生成调试信息。
- `-fsanitize=address`：开启地址消毒器，适合排查内存错误。

## 编译与链接

C++ 程序通常经历：

```text
源文件 .cpp
  ↓ 预处理
预处理结果
  ↓ 编译
目标文件 .o / .obj
  ↓ 链接
可执行文件
```

头文件通常声明接口，源文件通常实现逻辑。

示例：

```cpp
// math_utils.h
#pragma once

int add(int a, int b);
```

```cpp
// math_utils.cpp
#include "math_utils.h"

int add(int a, int b) {
    return a + b;
}
```

```cpp
// main.cpp
#include <iostream>
#include "math_utils.h"

int main() {
    std::cout << add(1, 2) << '\n';
}
```

编译：

```bash
g++ -std=c++20 main.cpp math_utils.cpp -o app
```

## 头文件保护

头文件被多次包含可能导致重复定义。常见方式：

```cpp
#pragma once
```

或：

```cpp
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

int add(int a, int b);

#endif
```

现代工程中 `#pragma once` 使用广泛，写法简单。

## IDE 与工具

推荐：

- Visual Studio：Windows C++ 大型项目。
- CLion：跨平台 CMake 项目。
- VS Code：轻量编辑器，配合 clangd。
- Qt Creator：Qt 项目。

常用工具：

- CMake：跨平台构建系统。
- Ninja：快速构建后端。
- clang-format：代码格式化。
- clang-tidy：静态分析。
- AddressSanitizer：内存错误检测。
- GoogleTest / Catch2：单元测试。

## 学习环境建议

初学者可以选择：

- Windows：Visual Studio Community 或 MSYS2 + GCC。
- macOS：Xcode Command Line Tools 或 Homebrew 安装 LLVM。
- Linux：GCC / Clang + CMake + Ninja。

建议尽早习惯命令行编译，这能帮助理解编译、链接和构建系统。

## 深入补充：从源码到可执行文件

C++ 项目通常会经历四个阶段：

| 阶段 | 输入 | 输出 | 常见问题 |
| --- | --- | --- | --- |
| 预处理 | `.cpp`、`.h`、宏、`#include` | 展开后的翻译单元 | 头文件重复包含、宏污染 |
| 编译 | 翻译单元 | 汇编或目标代码 | 语法错误、类型错误、模板错误 |
| 汇编 | 汇编代码 | `.o` / `.obj` | 较少直接接触 |
| 链接 | 多个目标文件和库 | 可执行文件或库 | 未定义引用、重复定义、库顺序错误 |

理解这个过程很重要，因为很多错误不是“代码不能写”，而是“声明、定义、链接边界没有组织好”。

## 深入补充：头文件应该放什么

头文件适合放：

- 类型声明、函数声明、类定义。
- 模板定义，因为模板通常需要在使用点可见。
- `inline` 函数或 `constexpr` 函数定义。
- 必要的 `#include`，不要依赖包含顺序。

源文件适合放：

- 非模板函数定义。
- 类成员函数定义。
- 只在当前文件使用的辅助函数和内部实现。

一个稳妥原则是：头文件提供接口，源文件隐藏实现。头文件越重，编译越慢，依赖越难维护。

## 深入补充：选择 C++ 标准版本

学习时建议至少使用 C++17；如果编译器和标准库支持良好，可以使用 C++20。常见选择：

| 标准 | 学习价值 |
| --- | --- |
| C++11 | 现代 C++ 起点：`auto`、lambda、移动语义、智能指针、线程库 |
| C++14 | 对 C++11 的实用补强：泛型 lambda、`make_unique` |
| C++17 | 工程项目常用：结构化绑定、`optional`、`variant`、`filesystem` |
| C++20 | 新范式：Concepts、Ranges、`span`、协程、Modules |
| C++23 | 标准库继续增强：`expected`、`print`、Ranges 改进 |

不要只看语言标准是否发布，还要确认编译器和标准库是否支持对应特性。cppreference 的 compiler support 页面适合查兼容性。

## 深入补充：最小工程目录

```text
hello-cpp/
  CMakeLists.txt
  include/
    hello/greeter.h
  src/
    greeter.cpp
    main.cpp
  tests/
    greeter_test.cpp
```

这样的结构比把所有代码放进一个 `main.cpp` 更接近真实项目。`include` 放公共头文件，`src` 放实现，`tests` 放测试。

## 本章检查清单

- 能否解释 C++ 是编译型语言？
- 能否使用编译器编译一个 `.cpp` 文件？
- 是否理解头文件和源文件的基本关系？
- 是否知道 C++11 是现代 C++ 的重要起点？
- 是否知道新项目通常应至少使用 C++17？

## 参考资料

- Reference: cppreference C++ compiler support，https://cppreference.com/w/cpp/compiler_support
- Official: ISO C++ 官网，https://isocpp.org/
- Official: CMake Tutorial，https://cmake.org/cmake/help/latest/guide/tutorial/index.html
