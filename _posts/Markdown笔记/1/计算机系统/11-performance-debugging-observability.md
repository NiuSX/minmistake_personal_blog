# 11. 性能、调试与可观测性

最后调研时间：2026-06-11

## 1. 性能优化原则

性能优化最重要的原则：

```text
先测量，再优化。
```

不要凭感觉猜瓶颈。程序慢可能是：

- CPU 计算。
- 内存访问。
- 锁竞争。
- 系统调用太多。
- 磁盘 I/O。
- 网络等待。
- 数据库。
- GC。
- 日志过多。
- 线程调度。

## 2. 延迟与吞吐

延迟：

```text
单个请求花多长时间完成
```

吞吐：

```text
单位时间完成多少请求
```

二者不总是同时提升。

例如批处理可以提高吞吐，但可能增加单个请求延迟。

## 3. CPU 性能分析

常用工具：

```bash
top
htop
pidstat 1
perf stat ./app
perf record ./app
perf report
```

`perf stat` 可查看：

- cycles。
- instructions。
- cache misses。
- branch misses。
- context switches。
- page faults。

如果 CPU 忙，要判断：

- 是用户态计算忙？
- 还是内核态系统调用忙？
- 是否频繁上下文切换？
- 是否缓存 miss 多？
- 是否分支预测失败多？

## 4. 系统调用分析

`strace` 可以跟踪系统调用：

```bash
strace ./app
strace -f ./app
strace -c ./app
strace -e trace=file ./app
strace -e trace=network ./app
```

适合排查：

- 程序卡在哪个系统调用。
- 文件找不到。
- 权限错误。
- 网络连接失败。
- 系统调用次数过多。

## 5. 调试器 gdb

常用命令：

```gdb
break main
run
next
step
continue
bt
frame 1
info locals
info registers
x/16gx $rsp
disassemble
```

调试崩溃：

```bash
gdb ./app core
```

查看调用栈：

```gdb
bt
```

多线程：

```gdb
info threads
thread apply all bt
```

## 6. 内存问题分析

工具：

```bash
valgrind --leak-check=full ./app
gcc -fsanitize=address -g app.c
gcc -fsanitize=undefined -g app.c
```

常见问题：

- 越界访问。
- use-after-free。
- double free。
- 内存泄漏。
- 未初始化读取。
- 栈溢出。

## 7. I/O 性能分析

命令：

```bash
iostat -x 1
pidstat -d 1
iotop
df -h
du -sh *
```

关注：

- 磁盘利用率。
- await。
- 队列长度。
- 每秒读写次数。
- 吞吐量。
- fsync 频率。

优化方向：

- 批量写。
- 减少小随机 I/O。
- 使用缓存。
- 避免频繁 fsync。
- 选择合适文件格式。

## 8. 网络性能分析

命令：

```bash
ss -tanp
sar -n DEV 1
curl -w '@format.txt' -o /dev/null -s URL
tcpdump -i any -nn port 443
```

关注：

- DNS 时间。
- TCP 连接时间。
- TLS 握手时间。
- 首字节时间。
- 传输时间。
- 丢包。
- 重传。
- 连接数。

## 9. 可观测性

可观测性常由三部分组成：

- Logs：发生了什么。
- Metrics：系统现在怎样。
- Traces：请求经过哪些服务和阶段。

### 9.1 日志

好的日志应包含：

- 时间。
- 级别。
- 请求 ID。
- 用户或任务 ID。
- 关键参数。
- 错误码。
- 耗时。

不要：

- 记录敏感信息。
- 在热点路径打印大量日志。
- 只写“失败了”而没有上下文。

### 9.2 指标

常见指标：

- QPS。
- 延迟 P50/P95/P99。
- 错误率。
- CPU。
- 内存。
- 磁盘 I/O。
- 网络 I/O。
- 队列长度。
- 线程数。
- GC 时间。

平均值不够，要看分位数。

### 9.3 链路追踪

分布式系统中，一个请求可能经过多个服务。

Trace 记录：

- 请求路径。
- 每个阶段耗时。
- 错误位置。
- 上下游依赖。

## 10. 性能优化常见方向

| 瓶颈 | 方向 |
|---|---|
| CPU | 算法优化、减少分支、SIMD、缓存友好 |
| 内存 | 减少分配、复用对象、改善局部性 |
| 锁 | 降低锁粒度、减少共享、分片 |
| I/O | 批量、异步、缓存、顺序访问 |
| 网络 | 连接复用、压缩、减少 round trip |
| 数据库 | 索引、查询优化、连接池、缓存 |

## 11. 常见误区

| 误区 | 正确认识 |
|---|---|
| 先优化看起来慢的代码 | 先 profiling |
| 平均延迟代表用户体验 | 看 P95/P99 |
| CPU 低说明没问题 | 可能在等锁、I/O、网络 |
| 加线程一定更快 | 可能增加调度和锁竞争 |
| 缓存越多越好 | 需要一致性、过期、内存成本 |

## 12. 参考资料

- Linux perf Wiki  
  https://perf.wiki.kernel.org/

- Linux man-pages: strace 相关系统调用入口  
  https://www.kernel.org/doc/man-pages/

- GDB Documentation  
  https://sourceware.org/gdb/documentation/

- Valgrind Documentation  
  https://valgrind.org/docs/

- AddressSanitizer 文档  
  https://clang.llvm.org/docs/AddressSanitizer.html

- Brendan Gregg Linux Performance  
  https://www.brendangregg.com/linuxperf.html

