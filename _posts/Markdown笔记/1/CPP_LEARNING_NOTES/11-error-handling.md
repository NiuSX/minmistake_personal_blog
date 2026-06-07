# 11. 错误处理

## 错误类型

C++ 程序中的错误大致分为：

- 编译期错误：语法、类型、模板约束错误。
- 运行期可恢复错误：文件不存在、网络失败、输入非法。
- 运行期不可恢复错误：严重内部不变量破坏。
- 未定义行为：越界、悬空指针、数据竞争等。

错误处理的目标不是“捕获一切”，而是让系统在合理边界内保持可预测。

## 异常

抛出异常：

```cpp
throw std::runtime_error("file not found");
```

捕获异常：

```cpp
try {
    load_config();
} catch (const std::exception& ex) {
    std::cerr << ex.what() << '\n';
}
```

常见标准异常：

- `std::runtime_error`
- `std::logic_error`
- `std::invalid_argument`
- `std::out_of_range`
- `std::bad_alloc`

## 何时使用异常

适合：

- 构造函数失败。
- 深层调用链错误向上传播。
- 不希望每层都手动传递错误码。
- 错误相对少见。

不适合：

- 极高性能热路径。
- 错误频繁发生。
- 项目或平台禁用异常。
- 跨 C ABI 边界。

## 异常安全

常见等级：

- 基本保证：异常后对象仍有效，没有资源泄漏。
- 强保证：异常后状态回滚到操作前。
- 不抛保证：函数不会抛异常。

RAII 是异常安全的基础。

## 错误码

传统错误码：

```cpp
enum class Error {
    Ok,
    FileNotFound,
    PermissionDenied
};
```

适合：

- C 接口。
- 系统调用封装。
- 高频错误。
- 禁用异常的项目。

缺点是调用者可能忽略错误。

## optional

当只有“有值或无值”时：

```cpp
std::optional<User> find_user(int id) {
    if (found) {
        return user;
    }
    return std::nullopt;
}
```

不适合需要详细错误原因的场景。

## expected

C++23 的 `std::expected` 可表达成功值或错误值：

```cpp
std::expected<User, Error> find_user(int id);
```

如果工具链尚不支持，可使用第三方实现或项目自定义 Result 类型。

## assert

```cpp
#include <cassert>

assert(value >= 0);
```

`assert` 用于检查程序员假设，通常在 Release 构建中会被禁用。不要用 assert 处理用户输入错误。

## 防御式编程

建议：

- 校验外部输入。
- 明确函数前置条件。
- 避免非法状态。
- 尽早失败。
- 错误信息包含必要上下文。
- 不吞异常。

## 未定义行为

未定义行为包括：

- 数组越界。
- 解引用空指针。
- 使用已释放对象。
- 有符号整数溢出。
- 数据竞争。

未定义行为不是“随机返回错误”，而是程序行为完全不可依赖。

## 错误处理建议

- 构造失败可用异常。
- 查找不到可用 optional。
- 需要错误原因可用 expected / Result。
- 高频底层接口可用错误码。
- 不变量破坏可用 assert 或终止程序。
- 外部输入错误要返回清晰错误信息。

## 本章检查清单

- 是否能区分异常、错误码、optional、expected？
- 是否知道 assert 不适合处理用户输入？
- 是否理解 RAII 对异常安全的价值？
- 是否知道未定义行为的严重性？
- 是否能为不同错误选择合适表达方式？

