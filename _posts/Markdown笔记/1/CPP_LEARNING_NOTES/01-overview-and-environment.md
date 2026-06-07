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

## 本章检查清单

- 能否解释 C++ 是编译型语言？
- 能否使用编译器编译一个 `.cpp` 文件？
- 是否理解头文件和源文件的基本关系？
- 是否知道 C++11 是现代 C++ 的重要起点？
- 是否知道新项目通常应至少使用 C++17？

