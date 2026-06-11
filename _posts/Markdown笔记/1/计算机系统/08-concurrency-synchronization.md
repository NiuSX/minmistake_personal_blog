# 08. 并发与同步

最后调研时间：2026-06-11

## 1. 并发和并行

并发是同时处理多个任务的结构。

并行是真正同时执行多个任务。

```text
并发：任务可以交替推进
并行：任务在多个核心上同时运行
```

单核也可以并发，多核才能真正并行。

## 2. 为什么并发困难

并发程序的问题来自：

- 执行顺序不确定。
- 共享状态。
- CPU 和编译器可能重排。
- 缓存可见性。
- 锁竞争。
- 死锁。
- 竞态条件难复现。

错误往往不是每次出现，而是偶发。

## 3. 竞态条件

多个线程访问共享数据，且至少一个写入，最终结果依赖执行时序，就可能有竞态。

错误示例：

```c
int counter = 0;

void *worker(void *arg) {
    for (int i = 0; i < 100000; i++) {
        counter++;
    }
    return NULL;
}
```

`counter++` 不是原子操作，可能分成：

```text
load counter
add 1
store counter
```

多个线程交错执行会丢失更新。

## 4. 临界区

临界区是访问共享资源且不能被多个线程同时执行的代码区域。

```c
pthread_mutex_lock(&mutex);
counter++;
pthread_mutex_unlock(&mutex);
```

锁保证同一时刻只有一个线程进入临界区。

## 5. 互斥锁

互斥锁用于保护共享数据。

原则：

- 谁保护什么数据要清楚。
- 加锁和解锁要成对。
- 临界区尽量短。
- 不要在持锁期间做慢 I/O。
- 多把锁要有固定顺序。

错误：

```c
lock(a);
lock(b);
// ...
unlock(b);
unlock(a);
```

另一个线程如果按 `b -> a` 加锁，就可能死锁。

## 6. 条件变量

条件变量用于等待某个条件成立。

经典生产者消费者：

```c
pthread_mutex_lock(&mutex);
while (queue_empty()) {
    pthread_cond_wait(&cond, &mutex);
}
item = pop();
pthread_mutex_unlock(&mutex);
```

必须使用 `while`，不是 `if`。

原因：

- 可能虚假唤醒。
- 被唤醒时条件可能已经被其他线程改变。

## 7. 信号量

信号量维护一个计数。

用途：

- 限制资源数量。
- 生产者消费者。
- 控制并发度。

例如连接池大小为 10，可以用信号量限制最多 10 个线程同时使用。

## 8. 原子操作

原子操作不可被其他线程看到中间状态。

C++：

```cpp
std::atomic<int> counter{0};
counter.fetch_add(1);
```

适合：

- 计数器。
- 标志位。
- lock-free 数据结构基础。

但原子操作不等于所有并发问题自动解决。复杂不变量通常仍需要锁。

## 9. 内存可见性

线程 A 写变量，线程 B 何时能看到？

这受影响于：

- CPU 缓存。
- 编译器优化。
- CPU 重排。
- 内存模型。
- 同步原语。

锁不仅提供互斥，也提供内存同步语义。

## 10. 死锁

死锁四个必要条件：

1. 互斥。
2. 持有并等待。
3. 不可抢占。
4. 循环等待。

破坏任意一个条件即可避免死锁。

常用方法：

- 固定加锁顺序。
- 尽量减少锁数量。
- 使用 try-lock 和超时。
- 避免持锁调用外部回调。
- 用更高层并发模型。

## 11. 活锁和饥饿

死锁是大家都不动。

活锁是大家都在动，但没有进展。

饥饿是某些线程长期得不到资源。

例如高优先级任务不断抢占，低优先级任务一直无法运行。

## 12. 线程池

线程池避免每个任务都创建线程。

基本结构：

```text
任务队列 + 固定数量工作线程 + 条件变量通知
```

优点：

- 控制并发度。
- 减少线程创建销毁成本。
- 便于排队和限流。

注意：

- 队列不能无限增长。
- 任务执行时间差异会影响延迟。
- 任务中阻塞 I/O 可能耗尽线程。

## 13. 并发模型

常见模型：

| 模型 | 特点 |
|---|---|
| 多进程 | 隔离好，通信成本较高 |
| 多线程 | 共享内存，易出竞态 |
| 事件循环 | 单线程处理大量 I/O，避免锁 |
| Actor | 通过消息传递隔离状态 |
| CSP / Channel | 通过通道通信 |
| 协程 | 用户态轻量并发，适合 I/O |

没有绝对最好，取决于任务类型。

## 14. 调试并发问题

工具：

```bash
gdb
thread apply all bt
strace -f
perf top
```

线程错误检测：

```bash
gcc -fsanitize=thread -g main.c
```

建议：

- 缩小复现。
- 增加超时和日志。
- 记录线程 ID。
- 避免只靠随机 sleep 修复。
- 明确共享数据所有权。

## 15. 并发设计原则

- 能不共享就不共享。
- 共享就明确由谁保护。
- 数据不可变更简单。
- 消息传递比共享可变状态更容易推理。
- 锁粒度先简单正确，再根据性能优化。
- 不要在没有测量前写 lock-free。
- 并发代码必须有超时和取消策略。

## 16. 参考资料

- OSTEP Concurrency 章节  
  https://pages.cs.wisc.edu/~remzi/OSTEP/

- POSIX Threads man-pages  
  https://man7.org/linux/man-pages/man7/pthreads.7.html

- Linux futex man-page  
  https://man7.org/linux/man-pages/man2/futex.2.html

- C++ atomics reference  
  https://en.cppreference.com/w/cpp/atomic

- ThreadSanitizer 文档  
  https://clang.llvm.org/docs/ThreadSanitizer.html

