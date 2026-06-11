# 07. 进程、线程与调度

最后调研时间：2026-06-11

## 1. 进程是什么

进程是运行中的程序实例。它包含：

- 独立虚拟地址空间。
- 代码和数据。
- 打开的文件描述符。
- 寄存器上下文。
- 栈。
- 堆。
- 环境变量。
- 当前工作目录。
- 权限和资源限制。

程序是磁盘上的文件，进程是程序运行后的动态实体。

## 2. 进程的核心抽象

操作系统给进程提供两个重要假象：

1. 独占 CPU：通过调度实现。
2. 独占内存：通过虚拟内存实现。

实际上：

- CPU 在多个进程之间快速切换。
- 物理内存由内核统一管理。
- 进程之间被隔离。

## 3. 创建进程

Unix/Linux 常见方式：

```text
fork -> exec
```

`fork()` 创建当前进程的副本。

`exec()` 用新程序替换当前进程映像。

示例：

```c
pid_t pid = fork();
if (pid == 0) {
    execlp("ls", "ls", "-l", NULL);
} else {
    wait(NULL);
}
```

shell 执行命令大致就是这个模型。

## 4. 进程状态

常见状态：

| 状态 | 含义 |
|---|---|
| running | 正在 CPU 上运行 |
| ready | 可运行，等待调度 |
| blocked | 等待 I/O 或事件 |
| zombie | 已退出但父进程未回收 |
| stopped | 被暂停 |

查看：

```bash
ps aux
top
```

## 5. 上下文切换

上下文切换是 CPU 从一个任务切到另一个任务。

需要保存和恢复：

- 寄存器。
- 程序计数器。
- 栈指针。
- 内核调度信息。
- 地址空间相关状态。

上下文切换有成本：

- 保存恢复寄存器。
- 可能破坏缓存局部性。
- 可能造成 TLB 影响。

线程过多会导致调度开销增加。

## 6. 线程是什么

线程是进程内的执行流。

同一进程中的线程共享：

- 地址空间。
- 全局变量。
- 堆。
- 文件描述符。
- 进程权限。

每个线程独有：

- 栈。
- 寄存器上下文。
- 线程局部存储。
- 调度状态。

线程适合：

- I/O 并发。
- 后台任务。
- 多核并行计算。
- 需要共享内存的任务。

风险：

- 数据竞争。
- 死锁。
- 调试复杂。
- 生命周期难管理。

## 7. 进程和线程对比

| 对比 | 进程 | 线程 |
|---|---|---|
| 地址空间 | 独立 | 共享进程地址空间 |
| 创建成本 | 较高 | 较低 |
| 通信 | IPC | 共享内存更直接 |
| 隔离性 | 好 | 差 |
| 崩溃影响 | 通常影响本进程 | 一个线程崩溃会导致整个进程崩溃 |
| 调试难度 | 相对低 | 并发问题更复杂 |

## 8. 调度

调度器决定哪个任务运行。

目标可能包括：

- 公平性。
- 响应时间。
- 吞吐量。
- 低延迟。
- 实时性。
- 避免饥饿。

常见调度思想：

- FIFO。
- Round Robin。
- Priority。
- Multi-level feedback queue。
- Completely Fair Scheduler。

## 9. CPU 时间

常见指标：

| 指标 | 含义 |
|---|---|
| user time | 用户态执行时间 |
| system time | 内核态执行时间 |
| wall time | 真实流逝时间 |
| CPU utilization | CPU 利用率 |
| load average | 可运行和不可中断任务队列压力 |

一个程序 wall time 长，不一定 CPU 忙，可能在等 I/O。

## 10. 进程间通信 IPC

常见方式：

- 管道。
- 命名管道。
- 信号。
- 共享内存。
- 消息队列。
- Unix domain socket。
- TCP/UDP socket。
- 文件。

选择原则：

| 需求 | 推荐 |
|---|---|
| 父子进程简单流式通信 | pipe |
| 本机服务通信 | Unix domain socket |
| 大数据共享 | shared memory |
| 跨机器通信 | TCP/UDP |
| 简单通知 | signal/eventfd |

## 11. 信号

信号是异步通知机制。

常见信号：

| 信号 | 含义 |
|---|---|
| `SIGINT` | Ctrl+C |
| `SIGTERM` | 请求终止 |
| `SIGKILL` | 强制终止，不能捕获 |
| `SIGSEGV` | 段错误 |
| `SIGCHLD` | 子进程状态变化 |
| `SIGPIPE` | 管道或 socket 对端关闭后写入 |

信号处理要谨慎，因为它可能在任意时刻打断程序。

## 12. 守护进程

守护进程是后台长期运行的服务。

特点：

- 脱离终端。
- 后台运行。
- 记录日志。
- 处理信号。
- 由 systemd 等管理。

现代 Linux 常用 systemd 管理服务。

## 13. 常用命令

```bash
ps aux
pstree
top
htop
pidstat 1
kill -TERM <pid>
kill -KILL <pid>
wait
jobs
fg
bg
```

查看进程资源：

```bash
cat /proc/<pid>/status
cat /proc/<pid>/cmdline
ls /proc/<pid>/fd
cat /proc/<pid>/maps
```

跟踪系统调用：

```bash
strace -f ./app
```

## 14. 常见问题

| 问题 | 可能原因 |
|---|---|
| 僵尸进程 | 父进程没有 wait |
| CPU 100% | 忙等、死循环、锁竞争 |
| 线程数暴涨 | 线程泄漏、线程池配置错误 |
| 程序卡住 | 等锁、等 I/O、死锁、阻塞系统调用 |
| 子进程没退出 | 父进程未发送终止或未回收 |

## 15. 参考资料

- OSTEP Processes and Scheduling  
  https://pages.cs.wisc.edu/~remzi/OSTEP/

- Linux man-pages: fork  
  https://man7.org/linux/man-pages/man2/fork.2.html

- Linux man-pages: execve  
  https://man7.org/linux/man-pages/man2/execve.2.html

- Linux man-pages: wait  
  https://man7.org/linux/man-pages/man2/wait.2.html

- Linux man-pages: signal  
  https://man7.org/linux/man-pages/man7/signal.7.html

- Linux man-pages: proc  
  https://man7.org/linux/man-pages/man5/proc.5.html

