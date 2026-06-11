# 09. I/O、文件系统与存储

最后调研时间：2026-06-11

## 1. I/O 是什么

I/O 是输入输出，程序通过 I/O 和外部世界交互：

- 读写文件。
- 读写终端。
- 网络通信。
- 访问磁盘。
- 与设备交互。
- 进程间通信。

在 Unix/Linux 中，一个统一思想是：

```text
Everything is a file
```

更准确地说：很多资源都可以通过文件描述符进行 I/O。

## 2. 文件描述符

文件描述符是进程内的整数句柄。

标准描述符：

| fd | 名称 | 含义 |
|---:|---|---|
| 0 | stdin | 标准输入 |
| 1 | stdout | 标准输出 |
| 2 | stderr | 标准错误 |

打开文件：

```c
int fd = open("data.txt", O_RDONLY);
```

读写：

```c
read(fd, buf, sizeof(buf));
write(fd, buf, n);
close(fd);
```

文件描述符可以指向：

- 普通文件。
- 目录。
- 管道。
- socket。
- 终端。
- 设备。
- eventfd。

## 3. open/read/write/close

系统调用：

```c
int open(const char *pathname, int flags, mode_t mode);
ssize_t read(int fd, void *buf, size_t count);
ssize_t write(int fd, const void *buf, size_t count);
int close(int fd);
```

注意：

- `read` 返回 0 表示 EOF。
- `read` 和 `write` 可能只处理部分数据。
- 系统调用可能被信号中断，返回 `EINTR`。
- `write` 成功返回不等于数据已经落盘。

## 4. 缓冲

I/O 中有多层缓冲：

```text
应用缓冲
C 标准库缓冲
内核页缓存
磁盘控制器缓存
设备内部缓存
```

`printf` 写到 stdout，不一定立刻调用 `write`。

`write` 返回成功，也不一定立刻写入物理磁盘，可能只是进入内核页缓存。

如果需要确保数据持久化：

```c
fsync(fd);
```

但 `fsync` 成本较高。

## 5. 阻塞与非阻塞 I/O

阻塞 I/O：

```text
没有数据时 read 会等待
```

非阻塞 I/O：

```text
没有数据时 read 返回 EAGAIN/EWOULDBLOCK
```

设置非阻塞：

```c
fcntl(fd, F_SETFL, flags | O_NONBLOCK);
```

非阻塞 I/O 常与 `select`、`poll`、`epoll` 配合。

## 6. I/O 多路复用

一个线程同时等待多个 fd。

常见 API：

| API | 特点 |
|---|---|
| select | 历史悠久，fd 数限制明显 |
| poll | 没有 select 的固定 fd_set 限制 |
| epoll | Linux 高性能事件通知 |

适合：

- 网络服务器。
- 事件循环。
- 大量连接。
- 避免每连接一个线程。

## 7. 文件系统抽象

文件系统提供：

- 文件。
- 目录。
- 路径。
- 权限。
- 元数据。
- 持久化。

常见概念：

| 概念 | 含义 |
|---|---|
| inode | 文件元数据对象 |
| directory entry | 文件名到 inode 的映射 |
| block | 磁盘块 |
| superblock | 文件系统总体元数据 |
| mount | 把文件系统挂载到目录树 |
| hard link | 多个目录项指向同一 inode |
| symbolic link | 符号链接，保存路径 |

## 8. 路径解析

路径：

```text
/home/user/a.txt
```

解析过程：

```text
/ -> home -> user -> a.txt
```

每一级目录都需要查找目录项。

路径解析可能涉及：

- 权限检查。
- 符号链接。
- mount 点。
- 缓存。

## 9. 文件权限

Unix 权限：

```text
rwxr-xr--
```

分为：

- owner。
- group。
- others。

权限含义：

| 权限 | 文件 | 目录 |
|---|---|---|
| r | 读文件内容 | 列出目录项 |
| w | 修改文件内容 | 创建/删除/重命名目录项 |
| x | 执行文件 | 进入目录、路径遍历 |

目录的 `x` 权限非常重要，没有它即使知道文件名也无法访问。

## 10. 硬链接与软链接

硬链接：

- 多个文件名指向同一个 inode。
- 删除一个名字不一定删除数据。
- 通常不能跨文件系统。

软链接：

- 保存目标路径。
- 可跨文件系统。
- 目标可不存在。

命令：

```bash
ln file hard_link
ln -s file soft_link
```

## 11. 页缓存

Linux 会用空闲内存缓存文件数据。

好处：

- 重复读取更快。
- 写入可以合并。

现象：

- `free` 看到内存被 cache 使用不一定是坏事。
- 文件刚写完不一定落盘。

## 12. 磁盘与 SSD

HDD：

- 机械寻道慢。
- 顺序读写比随机读写快很多。

SSD：

- 无机械寻道。
- 随机读写好很多。
- 写放大、擦除块、寿命需要考虑。

通用优化：

- 批量 I/O。
- 顺序访问。
- 减少小随机写。
- 使用缓冲。
- 合理 fsync。

## 13. 日志文件系统

文件系统要处理崩溃一致性。

如果写入过程中断电：

- 元数据可能只写了一半。
- 目录项可能不一致。
- 空间分配可能损坏。

日志文件系统先记录意图，再应用修改，以便崩溃后恢复。

常见文件系统：

- ext4。
- XFS。
- Btrfs。
- ZFS。

## 14. 常用命令

```bash
ls -li
stat file
df -h
du -sh *
mount
find .
lsof -p <pid>
ls /proc/<pid>/fd
strace -e trace=file ./app
```

I/O 性能：

```bash
iostat -x 1
pidstat -d 1
vmstat 1
```

## 15. 常见问题

| 问题 | 可能原因 |
|---|---|
| too many open files | fd 泄漏或 ulimit 太小 |
| 写文件后断电丢失 | 没有 fsync 或目录未 fsync |
| 磁盘满但 du 看不出 | 文件已删除但仍被进程打开 |
| I/O 延迟高 | 随机 I/O、队列拥塞、fsync 频繁 |
| 权限错误 | 文件或目录权限、用户组、SELinux |

## 16. 参考资料

- OSTEP Persistence 章节  
  https://pages.cs.wisc.edu/~remzi/OSTEP/

- Linux man-pages: open  
  https://man7.org/linux/man-pages/man2/open.2.html

- Linux man-pages: read  
  https://man7.org/linux/man-pages/man2/read.2.html

- Linux man-pages: write  
  https://man7.org/linux/man-pages/man2/write.2.html

- Linux man-pages: fsync  
  https://man7.org/linux/man-pages/man2/fsync.2.html

- Linux man-pages: epoll  
  https://man7.org/linux/man-pages/man7/epoll.7.html

