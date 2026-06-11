# 06. 内存系统：虚拟内存、堆、栈、页表与 mmap

最后调研时间：2026-06-11

## 1. 内存系统解决什么问题

程序运行时需要内存保存：

- 机器指令。
- 全局变量。
- 局部变量。
- 堆对象。
- 栈帧。
- 动态库。
- 文件映射。
- 线程栈。

操作系统通过虚拟内存为每个进程提供独立地址空间。

## 2. 虚拟地址与物理地址

程序中看到的是虚拟地址，不是物理内存地址。

```text
进程虚拟地址 -> MMU -> 物理地址
```

好处：

- 每个进程拥有独立地址空间。
- 进程之间互相隔离。
- 内核可以控制权限。
- 可以按需分配物理页。
- 可以把文件映射到内存。
- 可以让动态库映射到多个进程。

## 3. 进程地址空间

典型布局：

```text
高地址
  stack        栈
  mmap area    文件映射、动态库、匿名映射
  heap         堆
  .bss         未初始化全局变量
  .data        已初始化全局变量
  .rodata      只读常量
  .text        代码段
低地址
```

查看当前进程：

```bash
cat /proc/$$/maps
```

查看某个进程：

```bash
cat /proc/<pid>/maps
```

## 4. 栈

栈用于函数调用。

保存：

- 返回地址。
- 局部变量。
- 保存的寄存器。
- 临时数据。
- 函数参数。

栈的特点：

- 自动分配和释放。
- 按函数调用嵌套。
- 通常向低地址增长。
- 大小有限。

常见问题：

- 栈溢出。
- 返回局部变量地址。
- 递归过深。
- 大数组放栈上导致崩溃。

错误：

```c
int *bad() {
    int x = 1;
    return &x;
}
```

`x` 在函数返回后失效。

## 5. 堆

堆用于动态分配。

C：

```c
int *p = malloc(sizeof(int) * 100);
free(p);
```

C++：

```cpp
auto p = std::make_unique<int[]>(100);
```

堆的特点：

- 生命周期由程序控制。
- 适合动态大小对象。
- 可能产生碎片。
- 分配释放有成本。
- 容易内存泄漏和 use-after-free。

## 6. `malloc` 基本思想

内存分配器管理一块或多块堆区域。

需要处理：

- 找到合适空闲块。
- 分割大块。
- 合并相邻空闲块。
- 对齐。
- 维护元数据。
- 必要时向内核申请更多内存。

常见策略：

- first fit。
- next fit。
- best fit。
- segregated free lists。
- slab / arena。

现代分配器还会考虑：

- 多线程性能。
- 小对象优化。
- 缓存局部性。
- 内存碎片。
- 安全检查。

## 7. 内存错误

常见错误：

| 错误 | 说明 |
|---|---|
| buffer overflow | 越界写 |
| out-of-bounds read | 越界读 |
| use-after-free | 释放后继续使用 |
| double free | 重复释放 |
| memory leak | 分配后未释放 |
| uninitialized read | 读取未初始化内存 |
| stack overflow | 栈耗尽 |
| null pointer dereference | 空指针解引用 |

工具：

```bash
valgrind ./a.out
gcc -fsanitize=address -g main.c
gcc -fsanitize=undefined -g main.c
```

## 8. 分页

虚拟内存按页管理。常见页大小为 4 KiB。

```text
虚拟页 -> 物理页框
```

页表记录映射和权限：

- 是否存在。
- 是否可读。
- 是否可写。
- 是否可执行。
- 用户态是否可访问。
- 是否脏页。
- 是否被访问过。

## 9. TLB

页表在内存中，直接查页表很慢。TLB 缓存地址转换结果。

```text
虚拟地址 -> TLB 命中 -> 物理地址
虚拟地址 -> TLB 未命中 -> 查页表 -> 更新 TLB
```

TLB miss 会增加访问延迟。大内存随机访问可能受 TLB 影响。

## 10. 缺页异常

访问的虚拟页没有映射到物理内存时，CPU 触发缺页异常。

缺页可能是正常机制：

- 按需加载代码页。
- 延迟分配堆内存。
- 文件 mmap 按需读取。
- copy-on-write。

也可能是错误：

- 访问空指针。
- 越界访问非法页。
- 写只读页。

## 11. Copy-on-Write

`fork()` 后，父子进程最初共享物理页，并标记为只读。

当某个进程写入时：

```text
触发缺页 -> 内核复制物理页 -> 更新页表 -> 写入新页
```

好处：

- `fork()` 很快。
- 避免不必要复制。

## 12. mmap

`mmap` 把文件或匿名内存映射到进程地址空间。

用途：

- 文件映射 I/O。
- 动态库加载。
- 共享内存。
- 大块内存分配。
- 内存数据库。

示意：

```c
void *p = mmap(NULL, size, PROT_READ | PROT_WRITE,
               MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
```

`mmap` 后访问内存，内核可能按需加载页。

## 13. 内存保护

页级权限：

- read。
- write。
- execute。
- user/supervisor。

常见安全机制：

- NX：不可执行栈/堆。
- ASLR：地址空间布局随机化。
- guard page：栈保护页。
- W^X：可写和可执行尽量不同时存在。

## 14. 缓存与内存性能

内存性能不仅取决于分配多少，还取决于访问模式。

优化原则：

- 顺序访问优于随机访问。
- 紧凑数据结构优于大量指针跳转。
- 减少 cache miss。
- 减少 false sharing。
- 避免频繁小对象分配。
- 复用缓冲区。

## 15. 常见排查命令

```bash
free -h
vmstat 1
pmap <pid>
cat /proc/<pid>/maps
cat /proc/<pid>/smaps
top
htop
```

内存错误：

```bash
valgrind --leak-check=full ./app
ASAN_OPTIONS=detect_leaks=1 ./app
```

## 16. 参考资料

- OSTEP Virtualization 章节  
  https://pages.cs.wisc.edu/~remzi/OSTEP/

- CSAPP 官方资源  
  https://csapp.cs.cmu.edu/

- Linux man-pages: mmap  
  https://man7.org/linux/man-pages/man2/mmap.2.html

- Linux man-pages: proc  
  https://man7.org/linux/man-pages/man5/proc.5.html

- AddressSanitizer 文档  
  https://clang.llvm.org/docs/AddressSanitizer.html

- Valgrind Documentation  
  https://valgrind.org/docs/

