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

## 本章检查清单

- 是否能解释 RAII？
- 是否知道析构函数什么时候调用？
- 是否能区分 `unique_ptr`、`shared_ptr`、`weak_ptr`？
- 是否理解移动语义是转移资源？
- 是否知道零法则优先于五法则？

