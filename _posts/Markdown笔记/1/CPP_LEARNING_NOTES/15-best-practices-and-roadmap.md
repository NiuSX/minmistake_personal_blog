# 15. 最佳实践、学习路线与参考资料

## 现代 C++ 最佳实践

- 优先使用标准库。
- 避免裸 `new` 和 `delete`。
- 用 RAII 管理资源。
- 用 `std::vector` 替代动态数组。
- 用 `std::string` 替代 C 字符串。
- 用 `std::unique_ptr` 表达独占所有权。
- 谨慎使用 `std::shared_ptr`。
- 用 `const` 表达不可修改。
- 用 `enum class` 替代传统 enum。
- 用 `override` 标记虚函数重写。
- 用 `nullptr` 替代 `NULL`。
- 用 `std::optional` 表达可能没有值。
- 用 `std::span` 或 `std::string_view` 表达非拥有视图。
- 开启编译警告和静态分析。
- 写测试，尤其是边界和异常路径。

## 代码风格建议

### 让所有权清晰

```cpp
std::unique_ptr<Resource> create_resource();
void use_resource(const Resource& resource);
void observe_resource(const Resource* resource);
```

返回 `unique_ptr` 表示转移所有权。`const&` 表示不拥有且不能为空。裸指针可表示可空观察。

### 让非法状态不可表达

不好：

```cpp
struct User {
    bool has_id;
    int id;
};
```

更好：

```cpp
struct User {
    std::optional<int> id;
};
```

### 函数保持小而明确

函数越长，越难测试和维护。一个函数最好有清晰单一目的。

### 不暴露内部容器

不要随意返回可修改内部容器引用：

```cpp
std::vector<Item>& items(); // 谨慎
```

更常见：

```cpp
std::span<const Item> items() const;
```

## 性能建议

C++ 性能优化要先测量。

常见原则：

- 优先写清晰正确的代码。
- 使用 profiler 找瓶颈。
- 避免不必要拷贝。
- 大对象用 `const&` 传参。
- 需要转移资源时使用移动。
- 关注数据布局和缓存局部性。
- 默认容器用 vector。
- 减少动态分配。
- 不在热路径中频繁格式化字符串或抛异常。

## 安全建议

- 避免越界访问。
- 避免悬空引用和悬空指针。
- 避免数据竞争。
- 避免未初始化变量。
- 不信任外部输入。
- 对数组访问和转换保持谨慎。
- 使用 sanitizer 和静态分析。

## 学习路线

### 入门阶段

目标：能写简单命令行程序。

学习：

- 变量、类型、运算符。
- 条件、循环。
- 函数。
- string、vector。
- 文件读写。

练习：

- 计算器。
- 文本行统计。
- 简单通讯录。

### 进阶阶段

目标：理解现代 C++ 核心模型。

学习：

- 指针和引用。
- const。
- 类和对象。
- 构造析构。
- RAII。
- 智能指针。
- STL 容器和算法。

练习：

- 日志库。
- 配置文件解析器。
- 简单缓存系统。

### 高级阶段

目标：能写可维护的工程代码。

学习：

- 模板。
- concepts。
- 移动语义。
- 异常安全。
- 并发。
- CMake。
- 单元测试。
- sanitizer。

练习：

- 线程池。
- 命令行工具库。
- 小型 JSON 解析器。
- 文件索引工具。

### 工程阶段

目标：能参与真实 C++ 项目。

学习：

- 项目结构。
- 依赖管理。
- CI。
- 性能分析。
- 代码规范。
- 跨平台构建。
- ABI 和链接问题。

练习：

- 给开源项目提交小 PR。
- 为项目补测试。
- 重构旧代码中的裸指针资源管理。

## 面试与复习重点

- 指针和引用区别。
- const 用法。
- 构造函数、析构函数和对象生命周期。
- 拷贝构造、拷贝赋值、移动构造、移动赋值。
- RAII。
- unique_ptr、shared_ptr、weak_ptr。
- vector 扩容和迭代器失效。
- map 与 unordered_map。
- 虚函数和多态。
- 模板基础。
- 异常安全。
- mutex、atomic、数据竞争。
- CMake 基础。

## 官方与权威资料

- ISO C++ 官网：https://isocpp.org/
- ISO C++ 标准草案入口：https://eel.is/c++draft/
- cppreference：https://en.cppreference.com/w/
- C++ Core Guidelines：https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
- GCC C++ 支持状态：https://gcc.gnu.org/projects/cxx-status.html
- Clang C++ 支持状态：https://clang.llvm.org/cxx_status.html
- MSVC C++ 文档：https://learn.microsoft.com/cpp/
- CMake 文档：https://cmake.org/cmake/help/latest/

## 推荐书籍

- 《C++ Primer》
- 《Effective Modern C++》
- 《A Tour of C++》
- 《The C++ Programming Language》
- 《Effective C++》
- 《C++ Concurrency in Action》

## 最终检查清单

学完本笔记后，建议确认自己是否能做到：

- 从零创建并编译 C++ 项目。
- 使用 CMake 管理多文件工程。
- 熟练使用 string、vector、map、unordered_map。
- 用 RAII 管理资源。
- 正确使用智能指针。
- 写出基本类和多态接口。
- 写简单函数模板和类模板。
- 使用标准算法替代手写重复逻辑。
- 处理异常和错误返回。
- 使用线程、锁和原子变量处理简单并发。
- 使用调试器、测试框架和 sanitizer 排查问题。

