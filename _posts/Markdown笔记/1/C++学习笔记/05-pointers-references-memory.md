# 05. 指针、引用与内存

## 地址

每个对象在内存中有地址：

```cpp
int x = 10;
std::cout << &x << '\n';
```

`&x` 表示 `x` 的地址。

## 指针

指针保存地址：

```cpp
int x = 10;
int* p = &x;

std::cout << *p << '\n'; // 10
```

`*p` 表示解引用，访问指针指向的对象。

## 空指针

使用 `nullptr`：

```cpp
int* p = nullptr;
```

访问空指针是未定义行为：

```cpp
if (p != nullptr) {
    std::cout << *p << '\n';
}
```

不要使用 `NULL` 或 `0` 表示空指针。

## 引用

引用是对象的别名：

```cpp
int x = 10;
int& ref = x;
ref = 20;
std::cout << x << '\n'; // 20
```

引用必须初始化，通常不能重新绑定到另一个对象。

## 指针与引用的区别

| 对比项 | 指针 | 引用 |
| --- | --- | --- |
| 是否可为空 | 可以 | 通常不可为空 |
| 是否需要解引用 | 需要 `*p` | 不需要 |
| 是否可重新指向 | 可以 | 不可以 |
| 表达含义 | 可选对象、地址关系 | 必定存在的别名 |

## const 与指针

指向 const 对象的指针：

```cpp
const int* p = &x;
```

不能通过 `p` 修改对象。

const 指针：

```cpp
int* const p = &x;
```

`p` 不能再指向别处，但可以通过 `p` 修改对象。

指向 const 的 const 指针：

```cpp
const int* const p = &x;
```

## 数组

```cpp
int values[3] = {1, 2, 3};
```

访问：

```cpp
std::cout << values[0] << '\n';
```

C 风格数组不保存长度信息，容易越界。现代 C++ 中更推荐：

```cpp
std::array<int, 3> fixed_values{1, 2, 3};
std::vector<int> dynamic_values{1, 2, 3};
```

## 动态内存

传统写法：

```cpp
int* p = new int{10};
delete p;
```

数组：

```cpp
int* arr = new int[10];
delete[] arr;
```

现代 C++ 不推荐手写 `new` 和 `delete` 管理资源。优先使用：

- 局部对象。
- 标准容器。
- 智能指针。

## 常见内存错误

### 内存泄漏

申请后没有释放：

```cpp
int* p = new int{10};
// 忘记 delete
```

### 重复释放

```cpp
delete p;
delete p; // 错误
```

### 悬空指针

```cpp
int* p = nullptr;
{
    int x = 10;
    p = &x;
}
// x 已销毁，p 悬空
```

### 越界访问

```cpp
int arr[3]{1, 2, 3};
std::cout << arr[3] << '\n'; // 错误
```

## 栈与堆

栈上对象：

```cpp
void f() {
    int x = 10;
} // x 自动销毁
```

堆上对象：

```cpp
auto p = std::make_unique<int>(10);
```

栈对象生命周期自动管理。堆对象适合动态大小、跨作用域所有权、多态对象等场景。

## 所有权

所有权表示谁负责释放资源。

现代 C++ 中：

- 局部对象拥有自身资源。
- `std::unique_ptr` 表示独占所有权。
- `std::shared_ptr` 表示共享所有权。
- 裸指针通常表示不拥有。
- 引用通常表示不拥有且不能为空。

## span

C++20 的 `std::span` 用于表达连续内存视图：

```cpp
#include <span>
#include <vector>

void print(std::span<const int> values) {
    for (int v : values) {
        std::cout << v << '\n';
    }
}
```

它不拥有数据，只是视图。

## string_view

C++17 的 `std::string_view` 表示字符串视图：

```cpp
#include <string_view>

void print(std::string_view text) {
    std::cout << text << '\n';
}
```

注意：`string_view` 不拥有字符串，不能引用已经销毁的临时数据。

## 本章检查清单

- 是否能解释指针和引用的区别？
- 是否知道 `nullptr` 的作用？
- 是否理解裸指针不等于所有权？
- 是否知道为什么优先使用 vector、array 和智能指针？
- 是否能识别悬空指针、重复释放和越界访问？

