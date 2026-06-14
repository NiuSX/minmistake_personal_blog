# 06. RAII 与资源管理

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

## 参考资料

- Guideline: C++ Core Guidelines R: Resource management，[https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)
- Reference: cppreference `std::unique_ptr`，[https://cppreference.com/w/cpp/memory/unique_ptr](https://cppreference.com/w/cpp/memory/unique_ptr)
- Reference: cppreference `std::shared_ptr`，[https://cppreference.com/w/cpp/memory/shared_ptr](https://cppreference.com/w/cpp/memory/shared_ptr)
- Reference: cppreference move constructor，[https://cppreference.com/w/cpp/language/move_constructor](https://cppreference.com/w/cpp/language/move_constructor)
