# 06. RAII 与资源管理

<!-- lecture-notes:integrated-v2 -->

## 讲义导读：把 C++ 放进对象生命周期与工具链

这一章讲的是 **06. RAII 与资源管理**。C++ 学习不能只按“语法点”推进，更要围绕对象生命周期、资源所有权、类型约束、编译链接、标准库和工程化工具来理解。C++ 给你很强的控制力，也要求你明确每个对象何时创建、谁拥有资源、何时释放、错误如何传播。

### 一句话先懂

RAII 的核心是让对象生命周期自动管理资源：构造时拿资源，析构时还资源，中途出错也能收尾。

### 通俗类比

RAII 像工具借还制度：谁借出工具，谁登记；下班或离开工位时自动归还。这样即使中途有人离场，也不会把工具乱丢在现场。

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

封装一个文件、锁或临时目录类，让它在构造时获取资源、析构时释放资源，并测试异常路径是否仍能释放。

实践时要保留失败样本。C++ 的很多知识只有在错误里才真正清楚，例如悬空引用、重复释放、迭代器失效、ODR 问题、链接失败、未定义行为和数据竞争。把失败代码、编译器报错、Sanitizer 输出和修复方式记下来，比只保存正确答案更有学习价值。

### 读完本章应该能产出

能解释构造、析构、拷贝、移动、unique_ptr、shared_ptr、weak_ptr 和 Rule of Five/Zero；能把手动释放改成自动资源管理。

> 本节是全篇讲义化改写的阅读入口，后续正文中的定义、步骤、示例和参考资料都应围绕这条学习主线来理解。

## RAII 是什么

RAII 是 Resource Acquisition Is Initialization，意思是资源获取即初始化。核心思想：

- 在构造函数中获取资源。
- 在析构函数中释放资源。
- 对象生命周期结束时自动释放资源。

资源包括：

- 内存。
- 文件句柄。
- 网络连接。
- 锁。
- 数据库连接。
- GPU 资源。

## 析构函数

```cpp
class File {
public:
    File(const std::string& path) {
        // 打开文件
    }

    ~File() {
        // 关闭文件
    }
};
```

当对象离开作用域时，析构函数自动执行。

## RAII 的价值

RAII 能避免：

- 忘记释放资源。
- 异常提前退出导致泄漏。
- 多路径返回导致资源释放遗漏。

示例：

```cpp
void process() {
    std::lock_guard<std::mutex> lock(mutex_);
    // 即使这里抛异常，lock 也会自动释放
}
```

## 智能指针

### unique_ptr

`std::unique_ptr` 表示独占所有权：

```cpp
#include <memory>

auto p = std::make_unique<int>(10);
```

不能拷贝，只能移动：

```cpp
auto p1 = std::make_unique<int>(10);
auto p2 = std::move(p1);
```

适合：

- 独占资源。
- 工厂函数返回对象。
- 多态对象所有权。

### shared_ptr

`std::shared_ptr` 表示共享所有权：

```cpp
auto p = std::make_shared<User>();
```

对象在最后一个 `shared_ptr` 销毁时释放。

适合：

- 多处确实共享同一对象生命周期。

不适合：

- 为了省事替代所有权设计。
- 形成循环引用。

### weak_ptr

`std::weak_ptr` 不增加引用计数，用于打破循环引用：

```cpp
std::weak_ptr<User> weak = shared;

if (auto locked = weak.lock()) {
    // 对象仍然存在
}
```

## make_unique 与 make_shared

推荐：

```cpp
auto user = std::make_unique<User>("Alice");
auto config = std::make_shared<Config>();
```

优点：

- 更安全。
- 更简洁。
- 避免裸 `new`。

## 拷贝语义

拷贝构造：

```cpp
User a{"Alice"};
User b = a;
```

拷贝赋值：

```cpp
b = a;
```

对象如果拥有资源，需要正确实现拷贝，否则可能重复释放。

## 移动语义

移动语义用于转移资源所有权：

```cpp
std::string a = "large text";
std::string b = std::move(a);
```

移动后，`a` 仍然是有效对象，但值处于可析构、可赋值的状态，不应假设其内容。

## 五法则

如果类需要自定义以下任意一个，通常需要考虑全部五个：

- 析构函数。
- 拷贝构造函数。
- 拷贝赋值运算符。
- 移动构造函数。
- 移动赋值运算符。

## 零法则

更推荐遵循零法则：让标准库类型管理资源，自己不写析构、拷贝、移动。

示例：

```cpp
class UserList {
private:
    std::vector<std::string> names_;
};
```

这里不需要自己写析构函数，`std::vector` 会自动管理内存。

## 自定义移动类型

```cpp
class Buffer {
public:
    explicit Buffer(std::size_t size)
        : size_{size}, data_{std::make_unique<int[]>(size)} {}

    Buffer(Buffer&& other) noexcept = default;
    Buffer& operator=(Buffer&& other) noexcept = default;

    Buffer(const Buffer&) = delete;
    Buffer& operator=(const Buffer&) = delete;

private:
    std::size_t size_{};
    std::unique_ptr<int[]> data_;
};
```

如果资源不能共享，可以禁用拷贝，允许移动。

## noexcept

移动构造和移动赋值通常应标记 `noexcept`：

```cpp
Buffer(Buffer&& other) noexcept = default;
```

这会影响标准容器在扩容时是否使用移动而不是拷贝。

## 资源管理建议

- 不手写裸 `new` 和 `delete`。
- 能用局部对象就不用堆分配。
- 能用容器就不用裸数组。
- 独占所有权用 `unique_ptr`。
- 共享所有权先确认真的需要，再用 `shared_ptr`。
- 用 `weak_ptr` 处理共享指针循环引用。
- 自定义资源类优先遵循零法则。

## 深入补充：RAII 管的不只是内存

RAII 的核心是“资源获取即初始化”，资源释放绑定到析构函数。资源不只包括堆内存，还包括：

- 文件句柄。
- 互斥锁。
- 网络连接。
- 数据库连接。
- 临时文件。
- 线程 join 或 stop。

例如锁的 RAII：

```cpp
std::mutex mutex;

void update() {
    std::lock_guard<std::mutex> lock{mutex};
    // 临界区
} // 自动解锁
```

## 深入补充：智能指针选择

| 类型 | 表达含义 | 常见场景 | 注意点 |
| --- | --- | --- | --- |
| `std::unique_ptr<T>` | 独占拥有 | 工厂函数返回对象、PImpl、多态对象 | 不可拷贝，可移动 |
| `std::shared_ptr<T>` | 共享拥有 | 多个对象确实共同延长生命周期 | 有引用计数开销，可能循环引用 |
| `std::weak_ptr<T>` | 观察共享对象 | 缓存、父指针、打破环 | 使用前要 `lock()` |

默认先考虑值对象和 `unique_ptr`。如果一开始就使用 `shared_ptr`，通常说明所有权边界还没有想清楚。

## 深入补充：移动后的对象

被移动后的对象仍然有效，但值通常不再有业务意义，只能执行析构、重新赋值或调用有明确保证的操作：

```cpp
std::string a = "hello";
std::string b = std::move(a);

a = "new value"; // 可以重新赋值
```

不要依赖移动后对象的内容。移动语义的重点不是“复制更快”，而是“转移资源所有权”。

## 深入补充：五法则与零法则的取舍

如果类直接管理资源，就要认真处理析构、拷贝和移动，这就是五法则。如果类只组合标准库类型，让成员自己管理资源，就可以不写这些特殊成员函数，这就是零法则。

优先零法则：

```cpp
class User {
public:
    User(std::string name, std::vector<int> scores)
        : name_{std::move(name)}, scores_{std::move(scores)} {}

private:
    std::string name_;
    std::vector<int> scores_;
};
```

只有在封装系统资源、C API 或特殊性能需求时，才手写资源管理类。

## 本章检查清单

- 是否能解释 RAII？
- 是否知道析构函数什么时候调用？
- 是否能区分 `unique_ptr`、`shared_ptr`、`weak_ptr`？
- 是否理解移动语义是转移资源？
- 是否知道零法则优先于五法则？


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
- [Guideline: C++ Core Guidelines R: Resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)
- [Reference: cppreference `std::unique_ptr`](https://cppreference.com/w/cpp/memory/unique_ptr)
- [Reference: cppreference `std::shared_ptr`](https://cppreference.com/w/cpp/memory/shared_ptr)
- [Reference: cppreference move constructor](https://cppreference.com/w/cpp/language/move_constructor)
