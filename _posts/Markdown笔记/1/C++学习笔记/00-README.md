# C++ 学习笔记总目录

<!-- lecture-notes:integrated-v2 -->

## 讲义导读：把 C++ 放进对象生命周期与工具链

这一章讲的是 **C++ 学习笔记总目录**。C++ 学习不能只按“语法点”推进，更要围绕对象生命周期、资源所有权、类型约束、编译链接、标准库和工程化工具来理解。C++ 给你很强的控制力，也要求你明确每个对象何时创建、谁拥有资源、何时释放、错误如何传播。

### 一句话先懂

这份总目录的作用是把 C++ 学习从“会写语法”推进到“能管理对象生命周期、资源所有权、编译链接和工程质量”。

### 通俗类比

C++ 像一间高性能车间：你可以直接接触机器、材料和电源，所以速度和控制力很强；但工具借还、危险区域、装配流程和质检规范都必须自己守住。

类比只是帮助建立直觉，不能替代准确概念。真正写 C++ 时，要回到对象生命周期、值语义、引用语义、异常安全、迭代器有效性、线程同步和编译器诊断上。能解释“为什么这样写不会泄漏、不会悬空、不会数据竞争”，才算真正理解。

### 本章学习主线

1. **先看对象生命周期**：对象在哪里创建，什么时候销毁，是否会拷贝或移动？
2. **再看所有权边界**：谁拥有资源，谁只是借用，是否需要 unique_ptr、shared_ptr、引用或普通值？
3. **然后看类型约束**：哪些错误能在编译期发现，哪些只能靠测试、Sanitizer 或运行时检查发现？
4. **接着看标准库表达**：能否用容器、算法、RAII 和类型系统表达意图，而不是手写脆弱流程？
5. **最后看工程验证**：是否打开警告、写测试、跑 Sanitizer、检查 release 构建和跨编译器差异？

### 概念怎么学才不容易忘

遇到一个 C++ 概念，建议按“白话解释 -> 内存/生命周期图 -> 最小代码 -> 故意写错 -> 工具诊断”五步走。比如学引用，要画出它绑定到哪个对象；学移动语义，要观察 moved-from 对象状态；学并发，要用 ThreadSanitizer 或小测试暴露数据竞争；学模板，要看编译器如何实例化和报错。

### 最小实践任务

用 CMake 建一个小工具项目，包含一个类、一个 STL 容器、一个文件读写函数、一个单元测试，并开启编译警告。

实践时要保留失败样本。C++ 的很多知识只有在错误里才真正清楚，例如悬空引用、重复释放、迭代器失效、ODR 问题、链接失败、未定义行为和数据竞争。把失败代码、编译器报错、Sanitizer 输出和修复方式记下来，比只保存正确答案更有学习价值。

### 读完本章应该能产出

能说明 C++ 学习路线；能把语法、对象、内存、RAII、模板、STL、并发和构建工具放到同一张图里；能知道遇到问题时先查哪类资料。

> 本节是全篇讲义化改写的阅读入口，后续正文中的定义、步骤、示例和参考资料都应围绕这条学习主线来理解。
本目录是一份独立的 C++ 系统化学习笔记，适合从零基础入门，也适合已经会写一点 C++ 后查漏补缺。内容按章节拆分，覆盖语法、类型系统、内存管理、面向对象、模板、STL、现代 C++、并发、工程化和最佳实践。

> 说明：本目录只新增 C++ 学习笔记文件，不修改仓库中已有文章。

## 推荐阅读顺序

1. `01-overview-and-environment.md`：C++ 定位、标准、编译环境和第一个程序。
2. `02-basic-syntax.md`：基本语法、变量、输入输出、作用域。
3. `03-types-operators-control-flow.md`：类型、运算符、条件、循环。
4. `04-functions.md`：函数、重载、默认参数、递归、lambda。
5. `05-pointers-references-memory.md`：指针、引用、数组、动态内存。
6. `06-raii-and-resource-management.md`：RAII、构造析构、智能指针、移动语义。
7. `07-object-oriented-programming.md`：类、封装、继承、多态、接口。
8. `08-templates-and-generic-programming.md`：模板、泛型、concepts。
9. `09-stl-containers-iterators-algorithms.md`：STL 容器、迭代器、算法。
10. `10-modern-cpp-features.md`：C++11 到 C++23 的常用现代特性。
11. `11-error-handling.md`：异常、错误码、断言和防御式编程。
12. `12-concurrency-and-parallelism.md`：线程、锁、原子、异步和并行算法。
13. `13-io-filesystem-and-serialization.md`：I/O、文件系统和序列化。
14. `14-build-debug-test.md`：编译、CMake、调试、测试和包管理。
15. `15-best-practices-and-roadmap.md`：最佳实践、学习路线和参考资料。

## C++ 的核心特点

C++ 是一种多范式系统级编程语言，兼具：

- 接近底层的性能和内存控制。
- 面向对象编程能力。
- 泛型编程能力。
- RAII 资源管理模型。
- 丰富标准库。
- 与 C 语言较强的互操作性。
- 对大型工程、游戏、嵌入式、图形、金融、高性能计算等场景的长期支持。

## 学习 C++ 的主线

学习 C++ 不建议只背语法。更重要的是理解几条主线：

### 对象生命周期

C++ 的很多问题都和对象什么时候创建、拷贝、移动、销毁有关。构造函数、析构函数、RAII、智能指针、移动语义都围绕生命周期展开。

### 类型系统

C++ 的类型系统强大但复杂。基础类型、引用、指针、const、模板、concepts、auto、decltype 都是类型系统的一部分。

### 资源管理

C++ 允许直接管理内存、文件句柄、锁、网络连接等资源。现代 C++ 的原则是：资源应该绑定到对象生命周期，由析构函数自动释放。

### 泛型与 STL

STL 是 C++ 的核心生产力来源。掌握 vector、string、map、unordered_map、algorithm、iterator、range，比手写大量循环更重要。

### 工程化

真实项目离不开编译、链接、CMake、测试、调试、静态分析、包管理和代码规范。

## 建议的实践节奏

第一阶段：能写基本程序，理解变量、函数、条件、循环、数组。

第二阶段：理解指针、引用、const、对象生命周期。

第三阶段：掌握类、构造析构、RAII、智能指针。

第四阶段：熟练使用 STL 容器和算法。

第五阶段：学习模板、lambda、移动语义、并发。

第六阶段：完成一个可构建、可测试、可调试的小项目。

## 最小学习项目建议

- 命令行通讯录。
- 简单日志库。
- 文件去重工具。
- 迷你 JSON 解析器。
- 多线程下载器。
- 基于 STL 的文本统计工具。
- CMake + GoogleTest 的小型工具库。

## 常见误区

### 误区一：先学 C 再学 C++

可以先学 C，但不是必须。现代 C++ 和 C 的思维差异很大。学习 C++ 时应尽早使用 string、vector、RAII 和智能指针，而不是长期停留在裸数组和 malloc/free。

### 误区二：会语法就会 C++

C++ 的难点不是语法量，而是生命周期、所有权、拷贝移动、泛型和工程边界。

### 误区三：手写循环比 STL 更专业

STL 算法通常更清晰、更少 bug，也更容易表达意图。能用标准库解决的问题，优先用标准库。

### 误区四：裸指针就是错误

裸指针不是绝对错误。问题在于所有权不清。现代 C++ 中，裸指针更适合表示“不拥有对象的观察关系”，拥有资源时应优先使用对象、容器或智能指针。

## 笔记使用方法

这组笔记建议按照“先能跑，再理解，再工程化”的顺序使用：

1. 先通读每章开头和代码示例，保证能把示例复制到本地编译运行。
2. 遇到指针、引用、RAII、模板、并发等章节时，不要只看定义，要主动修改示例制造错误，再观察编译器、调试器和 Sanitizer 的反馈。
3. 每学完 3 到 4 章，做一个小练习，把语法点组合起来，而不是孤立记忆。
4. 到 STL 和现代 C++ 后，开始把“自己手写流程”改成“表达意图”：例如用 `std::find_if` 表达查找，用 `std::sort` 表达排序，用 `std::unique_ptr` 表达独占所有权。
5. 到工程化章节后，所有练习都尽量放进 CMake 项目中，并开启警告、格式化、单元测试和 Sanitizer。

## 学习时要抓住的四个问题

### 这个对象活多久

看到变量、引用、指针、`string_view`、`span`、lambda 捕获时，第一反应应该是判断它引用的数据是否还活着。很多 C++ bug 本质上都是生命周期判断错误。

### 谁拥有资源

资源包括内存、文件、锁、线程、网络连接、数据库连接等。拥有者负责释放资源，观察者只能使用资源。现代 C++ 倾向用类型表达所有权：

| 关系 | 推荐表达 |
| --- | --- |
| 独占拥有 | 局部对象、`std::unique_ptr<T>` |
| 共享拥有 | `std::shared_ptr<T>`，但要谨慎 |
| 临时借用 | `T&`、`const T&`、`std::span<T>`、`std::string_view` |
| 可为空观察 | `T*` |

### 编译期能不能发现错误

C++ 的类型系统、`const`、`enum class`、模板、Concepts、`static_assert` 都能把部分错误提前到编译期。越早暴露错误，调试成本越低。

### 代码表达的是机制还是意图

初学者容易写大量下标循环、裸指针和手动释放；更现代的写法会使用容器、算法、RAII 和明确的类型，把“我要做什么”表达清楚。

## 推荐实践项目路线

| 阶段 | 项目 | 重点 |
| --- | --- | --- |
| 入门 | 命令行通讯录 | 结构体、函数、`vector`、文件读写 |
| 基础巩固 | 文本统计工具 | 字符串、`unordered_map`、排序、异常处理 |
| 内存与 RAII | 简单日志库 | 文件资源管理、析构函数、移动语义 |
| STL | 待办事项管理器 | 容器选择、算法、迭代器失效 |
| 工程化 | CMake 小工具库 | 多文件、单元测试、包管理、CI |
| 并发 | 多线程下载/任务队列 | `thread`、`mutex`、`condition_variable`、取消机制 |


## 2026 标准与工具链核对补充

C++ 学习必须区分“标准已经发布或进入流程”和“你的编译器、标准库、构建系统已经可用”。截至 2026 年，学习资料需要同时关注 C++20、C++23 和 C++26 的支持状态；cppreference 的 compiler support 页面适合查语言和库特性的主流编译器支持，Clang 官方 C++ status 页面适合核对 Clang 的实现进度，ISO C++ 官网适合了解标准化动态。实际项目中，不要只写“使用 C++23/26”，还要明确 `-std=` 选项、GCC/Clang/MSVC 版本、标准库实现、目标平台和 CI 编译矩阵。

工程验证方面，建议把编译警告、单元测试、AddressSanitizer、UndefinedBehaviorSanitizer、ThreadSanitizer 和静态分析当作学习 C++ 的基本工具，而不是项目后期才补的流程。很多 C++ 错误不会稳定复现，例如越界、use-after-free、数据竞争、未定义行为和 ODR 问题；工具链能把这些隐蔽错误提前暴露出来。学习每个章节时，都应该至少保留一个“错误样例 + 工具诊断 + 修复方式”。
## 参考资料
- [Reference: cppreference compiler support](https://cppreference.com/cpp/compiler_support)
- [Reference: cppreference C++23](https://cppreference.com/cpp/23)
- [Reference: cppreference C++26](https://cppreference.com/cpp/26)
- [Official: Clang C++ status](https://clang.llvm.org/cxx_status.html)
- [Official: Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)
- [Official: Clang ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)
- [Official: Clang UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html)
- [Official: CMake documentation](https://cmake.org/cmake/help/latest/)
- [Official: ISO C++ 官网](https://isocpp.org/)
- [Reference: cppreference](https://cppreference.com/)
- [Guideline: C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
- [Official: CMake Tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html)
- [Tooling: Clang UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html)
