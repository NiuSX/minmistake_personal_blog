# 12. 并发与并行

## 基本概念

并发关注多个任务在时间上交错执行。并行关注多个任务真正同时执行。

C++ 标准库提供：

- `std::thread`
- `std::mutex`
- `std::lock_guard`
- `std::unique_lock`
- `std::condition_variable`
- `std::atomic`
- `std::future`
- 并行算法执行策略

## thread

```cpp
#include <thread>

void work() {
    // do something
}

int main() {
    std::thread t(work);
    t.join();
}
```

`join` 等待线程结束。未 join 也未 detach 的 thread 在析构时会调用 `std::terminate`。

## jthread

C++20 的 `std::jthread` 会自动 join：

```cpp
#include <thread>

std::jthread worker([] {
    // do work
});
```

`jthread` 还支持协作取消。

## mutex

保护共享数据：

```cpp
std::mutex m;
int counter = 0;

void increment() {
    std::lock_guard<std::mutex> lock(m);
    ++counter;
}
```

`lock_guard` 是 RAII 锁，离开作用域自动解锁。

## unique_lock

`std::unique_lock` 比 `lock_guard` 更灵活：

```cpp
std::unique_lock<std::mutex> lock(m);
lock.unlock();
lock.lock();
```

适合条件变量等需要手动控制锁的场景。

## condition_variable

```cpp
std::mutex m;
std::condition_variable cv;
bool ready = false;

void consumer() {
    std::unique_lock<std::mutex> lock(m);
    cv.wait(lock, [] { return ready; });
    // consume
}

void producer() {
    {
        std::lock_guard<std::mutex> lock(m);
        ready = true;
    }
    cv.notify_one();
}
```

`wait` 应使用谓词，防止虚假唤醒。

## atomic

原子变量适合简单共享状态：

```cpp
std::atomic<int> counter{0};

void increment() {
    ++counter;
}
```

原子操作不是万能替代锁。复杂不变量仍然需要锁或更高层同步结构。

## future 与 async

```cpp
auto future = std::async(std::launch::async, [] {
    return compute();
});

auto result = future.get();
```

`future.get()` 会等待结果，并传播异常。

## 数据竞争

多个线程同时访问同一对象，且至少一个写入，且没有同步，会产生数据竞争。数据竞争是未定义行为。

错误示例：

```cpp
int counter = 0;

void increment() {
    ++counter; // 多线程下数据竞争
}
```

## 死锁

多个线程互相等待锁：

```cpp
// 线程 1: 锁 A，再锁 B
// 线程 2: 锁 B，再锁 A
```

避免方式：

- 固定锁顺序。
- 使用 `std::scoped_lock` 同时锁多个 mutex。
- 减少锁持有时间。
- 避免在持锁时调用未知代码。

## scoped_lock

```cpp
std::scoped_lock lock(m1, m2);
```

可以一次锁多个 mutex，降低死锁风险。

## 并行算法

C++17 引入并行执行策略：

```cpp
#include <execution>
#include <algorithm>

std::sort(std::execution::par, values.begin(), values.end());
```

是否真的并行取决于实现和环境。

## 并发设计建议

- 优先避免共享可变状态。
- 使用不可变数据和消息传递。
- 共享数据必须有清晰同步策略。
- 锁的作用域越小越好。
- 不在持锁时执行耗时 I/O。
- 用 RAII 管理锁。
- 为线程设置清晰生命周期。
- 用工具检测数据竞争。

## 本章检查清单

- 是否知道 thread 必须 join 或 detach？
- 是否会用 lock_guard 保护共享数据？
- 是否理解 condition_variable 要使用谓词？
- 是否知道数据竞争是未定义行为？
- 是否能说出避免死锁的基本方法？

