# 14. 构建、调试与测试

## 编译命令

基本编译：

```bash
g++ -std=c++20 main.cpp -o app
```

推荐开发参数：

```bash
g++ -std=c++20 -Wall -Wextra -Wpedantic -g main.cpp -o app
```

推荐调试内存问题：

```bash
g++ -std=c++20 -g -fsanitize=address,undefined main.cpp -o app
```

## 警告

警告不是噪音。建议开启：

- `-Wall`
- `-Wextra`
- `-Wpedantic`
- MSVC 的 `/W4`

不要长期忽略警告。

## CMake 最小示例

```cmake
cmake_minimum_required(VERSION 3.20)
project(cpp_demo LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(app main.cpp)
```

构建：

```bash
cmake -S . -B build
cmake --build build
```

## 多文件项目

```cmake
add_library(core
    src/user.cpp
    src/order.cpp
)

target_include_directories(core PUBLIC include)

add_executable(app src/main.cpp)
target_link_libraries(app PRIVATE core)
```

推荐使用 target 级命令，不要全局堆变量。

## Debug 与 Release

```bash
cmake -S . -B build-debug -DCMAKE_BUILD_TYPE=Debug
cmake -S . -B build-release -DCMAKE_BUILD_TYPE=Release
```

Debug：

- 调试信息完整。
- 优化低。
- 适合断点调试。

Release：

- 优化高。
- 性能接近生产。
- 部分调试信息可能缺失。

## 调试器

常用调试器：

- GDB。
- LLDB。
- Visual Studio Debugger。

GDB 示例：

```bash
gdb ./app
break main
run
next
print value
bt
```

常用命令：

- `break`：设置断点。
- `run`：运行。
- `next`：下一行，不进入函数。
- `step`：进入函数。
- `print`：查看变量。
- `bt`：查看调用栈。

## Sanitizer

AddressSanitizer 检测：

- 越界访问。
- use-after-free。
- double free。
- 内存泄漏。

UndefinedBehaviorSanitizer 检测：

- 未定义行为。
- 有符号整数溢出。
- 非法类型转换。

ThreadSanitizer 检测：

- 数据竞争。

## 单元测试

测试框架：

- GoogleTest。
- Catch2。
- doctest。

GoogleTest 示例：

```cpp
#include <gtest/gtest.h>

TEST(AddTest, Works) {
    EXPECT_EQ(add(1, 2), 3);
}
```

测试应覆盖：

- 正常输入。
- 边界输入。
- 错误输入。
- 资源释放。
- 并发行为。

## 静态分析

常用工具：

- clang-tidy。
- cppcheck。
- MSVC Code Analysis。

clang-tidy 可检查：

- 现代 C++ 建议。
- 性能问题。
- 可读性问题。
- 潜在 bug。

## 代码格式化

clang-format 示例：

```bash
clang-format -i src/main.cpp
```

建议项目中提交 `.clang-format`，保证团队格式一致。

## 包管理

C++ 常见包管理方式：

- vcpkg。
- Conan。
- 系统包管理器。
- FetchContent。
- Git submodule。

选择时考虑：

- 团队平台。
- CI 支持。
- 依赖版本锁定。
- 二进制缓存。
- 与 CMake 集成。

## CI

CI 中建议执行：

- 多平台构建。
- 单元测试。
- clang-format 检查。
- clang-tidy。
- sanitizer 测试。
- 依赖漏洞检查。

## 本章检查清单

- 是否会使用 CMake 构建项目？
- 是否开启编译警告？
- 是否会用调试器查看调用栈？
- 是否知道 sanitizer 能发现哪些问题？
- 是否能为项目配置基本单元测试？

