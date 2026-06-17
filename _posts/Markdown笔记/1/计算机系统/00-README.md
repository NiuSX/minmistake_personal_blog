# 计算机系统学习笔记总览

<!-- lecture-notes:integrated-v2 -->

## 讲义导读：把程序运行拆成系统链路

这一章讲的是 **计算机系统学习笔记总览**，属于 **计算机系统学习路线**。读计算机系统时，不要把它当成名词表，而要把它当成一条从源代码到真实机器行为的链路：代码写下去，编译器怎么翻译，链接器怎么装配，加载器怎么启动，进程怎么占用地址空间，CPU 怎么执行指令，内核怎么处理系统调用，文件和网络怎么把数据送出去。

### 一句话先懂

这一章的目标是先搭地图：以后看到整数溢出、段错误、慢查询、网络超时、死锁时，知道它大概落在哪一层、该用什么工具验证。

初学时可以先盯住三个问题：第一，程序此刻在哪一层运行；第二，这一层把什么输入转换成了什么输出；第三，如果结果不对，应该用哪个工具观察证据。

### 通俗类比

可以把系统看成一条生产线：源代码是图纸，编译器把图纸翻译成机器能执行的工单，链接器把零件装配成成品，加载器把车间布置好，进程是一条隔离的生产线，CPU 是工人，寄存器和缓存是手边工具，内存是工作台，内核是车间管理员，系统调用是服务窗口，文件和网络是仓储与物流。

类比只是入门扶手。真正考试、调试或做项目时，要回到准确术语：地址、字节、指令、寄存器、符号、页表、文件描述符、socket、锁、调度、缓存、协议字段和错误码。能把类比翻译回这些具体对象，才算真的懂。

### 本章学习主线

1. **先定位层级**：这是语言问题、编译链接问题、运行时问题、内核问题、硬件问题，还是网络/存储问题？
2. **再追踪路径**：一次完整过程从哪里开始，经过哪些对象，最后在哪里产生可见结果？
3. **然后看状态**：关键状态包括寄存器、栈、堆、页表、文件偏移、进程状态、锁状态、TCP 状态和缓存状态。
4. **接着找边界**：位宽、对齐、权限、资源限制、并发时序、平台差异和标准未定义行为，都会让直觉失效。
5. **最后做验证**：用小程序、命令、日志、反汇编、抓包、性能计数或 sanitizer 证明解释是对的。

### 本章重点抓手

按数据表示、程序执行、体系结构、编译链接、内存、进程线程、并发、I/O、网络、性能、安全这条顺序建立知识坐标。

### 最小实践任务

选一个 hello world，从源文件一路追到进程和系统调用；再选一个故障现象，练习从症状反推可能层级。

建议把每次实验记录成固定格式：目标、环境、最小代码、运行命令、观察结果、底层解释、容易误判的点、下一步问题。这样以后遇到段错误、性能抖动、死锁、网络超时或数据丢失时，不会只凭感觉猜。

### 常见误区

- 只背术语，不追踪一次真实运行路径。
- 把语言层现象和操作系统、硬件层现象混在一起。
- 只看平均性能，不看缓存、I/O、锁竞争、上下文切换等具体瓶颈。

### 推荐观察工具

gcc/clang、objdump/readelf、gdb、strace、perf、pmap、ss、tcpdump、/proc、日志和小基准测试。

### 读完本章应该能做到

- 用自己的话解释本章概念，并能指出它处在系统链路的哪一层。
- 画出一个最小路径图，说明数据或控制流从哪里来、到哪里去。
- 用至少一个命令或实验观察到真实现象，而不是只复述结论。
- 说清一个常见故障的表现、可能原因、验证方式和修复方向。

> 本节是讲义化改写后的阅读入口。后续正文中的定义、命令、图示和参考资料，都应围绕“系统链路 + 可观察证据”来理解。

最后调研时间：2026-06-13  
适合对象：已经学过一点编程，想系统理解“程序如何在计算机上运行”的学习者。  
核心参考路径：CSAPP（Computer Systems: A Programmer's Perspective）、OSTEP（Operating Systems: Three Easy Pieces）、计算机组成与体系结构、Linux 系统编程、TCP/IP 与 HTTP 标准。

## 这套笔记解决什么问题

很多人会写代码，但不清楚代码运行时发生了什么：

- `int` 为什么会溢出？
- 浮点数为什么会有误差？
- C 程序如何变成可执行文件？
- 函数调用栈是什么？
- 进程、线程、协程到底有什么区别？
- 虚拟内存为什么能让每个进程“以为自己独占内存”？
- `malloc` 为什么会慢、为什么会碎片化？
- 文件描述符、管道、socket 是什么？
- TCP 为什么可靠，HTTP 和 TCP 是什么关系？
- 多线程为什么会出现竞态、死锁、可见性问题？
- 性能瓶颈应该怎么定位？

计算机系统不是某一个单独知识点，而是一条贯穿“硬件 -> 操作系统 -> 编译链接 -> 运行时 -> 网络 -> 存储 -> 性能”的主线。

## 文件结构

| 文件 | 主题 | 重点 |
|---|---|---|
| [01-overview-and-roadmap.md](01-总览和学习路线.md) | 学习路线总览 | 计算机系统分层、学习顺序、实验路线 |
| [02-data-representation.md](02-数据表示.md) | 信息表示 | 二进制、整数、补码、浮点、字符编码 |
| [03-program-execution-and-assembly.md](03-程序执行和汇编.md) | 程序执行与汇编 | ISA、寄存器、栈帧、调用约定、控制流 |
| [04-computer-architecture.md](04-计算机组成与体系架构.md) | 计算机组成与体系结构 | CPU、流水线、缓存、存储层次、I/O |
| [05-compilation-linking-loading.md](05-编译链接和加载.md) | 编译、链接、加载 | 预处理、编译、汇编、ELF、动态链接 |
| [06-memory-system.md](06-内存系统.md) | 内存系统 | 虚拟内存、页表、TLB、堆、栈、mmap |
| [07-process-thread-scheduling.md](07-进程线程与调度.md) | 进程、线程与调度 | 进程模型、上下文切换、调度、信号 |
| [08-concurrency-synchronization.md](08-并发与同步.md) | 并发与同步 | 竞态、锁、条件变量、死锁、内存模型 |
| [09-io-filesystem-storage.md](09-IO与文件系统和存储.md) | I/O、文件系统与存储 | 文件描述符、缓冲、磁盘、文件系统、日志 |
| [10-networking.md](10-网络系统.md) | 网络系统 | TCP/IP、UDP、Socket、HTTP、DNS、TLS |
| [11-performance-debugging-observability.md](11-性能调试和可观测性.md) | 性能、调试与可观测性 | profiling、perf、strace、gdb、日志、指标 |
| [12-security-reliability.md](12-安全与可靠性.md) | 安全与可靠性 | 内存安全、权限、隔离、崩溃恢复、防御思维 |
| [13-references.md](13-参考.md) | 参考资料 | 官方文档、经典教材、中文社区入口 |
| [14-labs-and-case-studies.md](14-实验与案例.md) | 实验与案例 | 从小程序、系统工具、故障现象反推底层机制 |

## 一张总图

```mermaid
flowchart TD
    Source[源代码] --> Compiler[编译器]
    Compiler --> Obj[目标文件]
    Obj --> Linker[链接器]
    Linker --> Exe[可执行文件]
    Exe --> Loader[加载器]
    Loader --> Process[进程地址空间]

    Process --> CPU[CPU 执行指令]
    CPU --> Cache[缓存]
    Cache --> Memory[主存]
    Process --> OS[操作系统内核]
    OS --> FS[文件系统]
    OS --> Net[网络协议栈]
    OS --> Scheduler[调度器]
    OS --> VM[虚拟内存]

    FS --> Disk[磁盘 / SSD]
    Net --> NIC[网卡]
```

## 学习主线

推荐按下面顺序学：

1. 信息表示：先理解二进制、补码、浮点、编码。
2. 程序执行：理解汇编、寄存器、栈、函数调用。
3. 编译链接：理解源代码如何变成进程。
4. 体系结构：理解 CPU、缓存、流水线、内存层次。
5. 虚拟内存：理解地址空间、页表、TLB、缺页。
6. 进程线程：理解并发执行的基础抽象。
7. 并发同步：理解锁、条件变量、死锁、内存可见性。
8. I/O 与文件系统：理解文件描述符、磁盘、缓存、持久化。
9. 网络：理解 socket、TCP/UDP、HTTP。
10. 性能与调试：用工具观察系统。
11. 安全与可靠性：理解系统为什么会崩、会泄漏、会被攻击。
12. 实验与案例：把每章概念压到可复现的小程序、命令输出和故障分析里。

## 学习时最重要的习惯

- 不只背概念，要写小程序验证。
- 不只看高级语言，要看汇编、进程、系统调用。
- 遇到性能问题先测量，不凭感觉优化。
- 遇到并发问题先缩小复现，不靠打印碰运气。
- 学系统要重视工具：`gdb`、`strace`、`ltrace`、`perf`、`top`、`vmstat`、`iostat`、`tcpdump`、`ss`。
- 学网络和 OS 时要看标准、man page 和官方文档。
- 每个实验都记录：环境、命令、预期现象、实际输出、解释和下一步追问。

## 2026 计算机系统资料与实验核对补充

这一组笔记建议按“教材主线 + 标准文档 + 本机实验”三层学习，不要只看二手总结。

- **教材主线**：CS:APP 适合建立程序员视角，OSTEP 适合按虚拟化、并发、持久化理解操作系统。
- **接口核对**：Linux man-pages 用来查系统调用、库函数和命令行为；Linux Kernel docs 用来查内核机制；POSIX.1-2024 用来核对可移植接口；ELF gABI 用来核对目标文件、符号、重定位和动态链接。
- **工具链核对**：GCC/LLVM/Clang 文档用于确认编译选项、优化、调试信息和 sanitizer 行为，不要只凭旧教程记命令。
- **网络核对**：HTTP 语义看 RFC 9110，HTTP 缓存看 RFC 9111，TCP 看 RFC 9293，QUIC 看 RFC 9000；抓包结果要和协议字段对应起来。
- **实验要求**：优先用 CS:APP 建立程序员视角，用 OSTEP 建立操作系统主线，再用 Linux man-pages、Linux Kernel docs、POSIX.1-2024、ELF gABI 和 RFC 原文核对接口细节。 每个结论最好配一个能复现的最小程序或命令输出。

通俗地说，教材负责“搭骨架”，标准负责“定规则”，实验负责“验真假”。系统知识最怕只会背概念；能把源码、命令输出、内核接口和协议原文对上，才真正能用于排错和优化。

参考资料：

- CS:APP 官方网站：https://csapp.cs.cmu.edu/
- OSTEP 官方网站：https://pages.cs.wisc.edu/~remzi/OSTEP/
- Linux man-pages：https://man7.org/linux/man-pages/
- Linux Kernel Documentation：https://docs.kernel.org/
- POSIX.1-2024 / The Open Group Base Specifications Issue 8：https://pubs.opengroup.org/onlinepubs/9799919799/
- GCC Online Documentation：https://gcc.gnu.org/onlinedocs/
- LLVM Documentation：https://llvm.org/docs/
- ELF gABI / Linux Foundation Referenced Specifications：https://refspecs.linuxfoundation.org/
- RFC 9110 HTTP Semantics：https://www.rfc-editor.org/info/rfc9110/
- RFC 9111 HTTP Caching：https://www.rfc-editor.org/info/rfc9111/
- RFC 9293 Transmission Control Protocol：https://www.rfc-editor.org/info/rfc9293/
- RFC 9000 QUIC：https://www.rfc-editor.org/info/rfc9000/
- Clang Sanitizers：https://clang.llvm.org/docs/AddressSanitizer.html
## 参考资料

- [CSAPP 官方课程资源](https://csapp.cs.cmu.edu/)  

- [OSTEP 官方在线书](https://pages.cs.wisc.edu/~remzi/OSTEP/)  

- [RISC-V International Specifications](https://riscv.org/technical/specifications/)  

- [Linux man-pages project](https://www.kernel.org/doc/man-pages/)  

- [IETF RFC 9293 - Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293)  

- [IETF RFC 9110 - HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
