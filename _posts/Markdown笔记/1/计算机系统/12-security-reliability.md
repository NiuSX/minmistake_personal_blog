# 12. 安全与可靠性

最后调研时间：2026-06-11

## 1. 为什么系统学习必须包含安全和可靠性

系统程序直接面对：

- 内存。
- 文件。
- 网络。
- 权限。
- 并发。
- 外部输入。
- 崩溃和断电。

因此错误往往不只是功能 bug，还可能导致：

- 数据丢失。
- 服务不可用。
- 权限绕过。
- 远程代码执行。
- 信息泄漏。
- 资源耗尽。

## 2. 内存安全

C/C++ 常见内存安全问题：

- 缓冲区溢出。
- use-after-free。
- double free。
- 越界读。
- 未初始化内存读取。
- 空指针解引用。
- 格式化字符串漏洞。

防御：

- 使用安全语言或安全抽象。
- 边界检查。
- RAII。
- 智能指针。
- sanitizers。
- fuzzing。
- 编译器保护。

编译选项示例：

```bash
gcc -Wall -Wextra -Werror -g \
    -fsanitize=address,undefined \
    main.c -o main
```

## 3. 权限与最小权限原则

最小权限原则：

```text
程序只应拥有完成任务所需的最小权限。
```

实践：

- 不要用 root 跑普通服务。
- 文件权限最小化。
- 密钥不要写进代码。
- 服务账号权限隔离。
- 网络端口只开放必要范围。
- 容器和沙箱限制能力。

## 4. 隔离

隔离减少故障和攻击影响范围。

常见隔离机制：

- 进程地址空间。
- 用户和组权限。
- chroot。
- namespace。
- cgroup。
- seccomp。
- 容器。
- 虚拟机。

隔离不是绝对安全，但能降低风险。

## 5. 输入验证

所有外部输入都不可信：

- HTTP 请求。
- 文件内容。
- 命令行参数。
- 环境变量。
- 网络包。
- 数据库内容。
- 用户上传文件。

需要验证：

- 类型。
- 长度。
- 范围。
- 编码。
- 格式。
- 权限。

不要把输入直接拼进命令或 SQL。

## 6. 资源耗尽

攻击或 bug 可能耗尽：

- CPU。
- 内存。
- 磁盘。
- 文件描述符。
- 线程。
- 连接数。
- 队列。

防御：

- 限流。
- 超时。
- 最大请求体。
- 最大连接数。
- 队列长度限制。
- ulimit。
- cgroup。
- 熔断和降级。

## 7. 超时与重试

没有超时的系统是不可靠的。

所有外部调用都应该有：

- 连接超时。
- 读写超时。
- 总超时。
- 取消机制。

重试要谨慎：

- 只重试可重试错误。
- 使用指数退避。
- 加随机抖动。
- 限制最大次数。
- 确保幂等性。

错误重试可能放大故障。

## 8. 崩溃一致性

写文件或数据库时，可能发生：

- 程序崩溃。
- 机器断电。
- 磁盘错误。
- 部分写入。

可靠写入需要考虑：

- 临时文件。
- 原子 rename。
- fsync 文件。
- fsync 目录。
- 日志或 WAL。

简单模式：

```text
写 temp 文件
fsync temp
rename temp -> target
fsync 目录
```

具体需求要根据文件系统和平台验证。

## 9. 可恢复设计

可靠系统应该能从错误中恢复：

- 进程崩溃后重启。
- 任务可重放。
- 状态可恢复。
- 数据有备份。
- 操作有幂等性。
- 日志可用于排查。

不要只设计“正常路径”，要设计失败路径。

## 10. 安全编译和运行时保护

常见保护：

- ASLR。
- NX。
- Stack canary。
- PIE。
- RELRO。
- Fortify Source。
- seccomp。

检查二进制可使用 `checksec` 等工具。

## 11. Fuzzing

Fuzzing 通过大量随机或变异输入寻找崩溃和漏洞。

适合：

- 解析器。
- 协议实现。
- 文件格式处理。
- 编译器前端。
- 压缩/解压库。

常见工具：

- libFuzzer。
- AFL++。
- honggfuzz。

## 12. 可靠性清单

- 所有外部输入是否验证。
- 所有外部调用是否有超时。
- 是否限制请求大小。
- 是否限制并发和队列长度。
- 是否处理部分读写。
- 是否处理 `EINTR`。
- 文件写入是否考虑崩溃一致性。
- 日志是否足以定位问题。
- 是否避免 root 运行。
- 密钥是否安全保存。
- 内存错误是否用 sanitizer 检查。
- 并发代码是否有线程安全策略。

## 13. 参考资料

- Linux man-pages project  
  https://www.kernel.org/doc/man-pages/

- OWASP Top Ten  
  https://owasp.org/www-project-top-ten/

- AddressSanitizer 文档  
  https://clang.llvm.org/docs/AddressSanitizer.html

- UndefinedBehaviorSanitizer 文档  
  https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html

- libFuzzer 文档  
  https://llvm.org/docs/LibFuzzer.html

- OSTEP Persistence 章节  
  https://pages.cs.wisc.edu/~remzi/OSTEP/

