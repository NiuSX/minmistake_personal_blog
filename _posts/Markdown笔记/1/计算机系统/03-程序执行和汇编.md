# 03. 程序执行与汇编：指令、寄存器、栈帧和调用约定

最后调研时间：2026-06-11

## 1. 为什么要学汇编

学习汇编不是为了每天手写汇编，而是为了理解：

- 高级语言如何被 CPU 执行。
- 函数调用如何实现。
- 局部变量在哪里。
- 指针和数组在底层是什么。
- 栈溢出为什么发生。
- 调试器为什么能单步执行。
- 性能热点为什么和指令、缓存、分支有关。

汇编是高级语言和硬件之间的桥。

## 2. 程序执行的基本模型

CPU 执行程序可以简化为循环：

```text
取指令 -> 解码 -> 执行 -> 更新状态 -> 取下一条指令
```

CPU 状态包括：

- 程序计数器：下一条指令地址。
- 通用寄存器：保存临时数据、地址、参数。
- 标志寄存器：保存比较结果、进位等状态。
- 内存：保存代码、数据、栈、堆。

## 3. 指令集架构 ISA

ISA 是硬件和软件之间的接口，定义：

- 有哪些寄存器。
- 有哪些指令。
- 指令如何编码。
- 内存如何寻址。
- 异常和中断如何处理。

常见 ISA：

| ISA | 特点 |
|---|---|
| x86-64 | PC 和服务器常见，复杂指令集 |
| ARM64 / AArch64 | 手机、嵌入式、服务器越来越常见 |
| RISC-V | 开放指令集，教学和芯片生态发展快 |

不同 ISA 的汇编语法不同，但核心概念相通。

## 4. 寄存器

寄存器是 CPU 内部最快的存储位置。

x86-64 常见通用寄存器：

| 寄存器 | 常见用途 |
|---|---|
| `rax` | 返回值、算术 |
| `rbx` | 通用，callee-saved |
| `rcx` | 参数、计数 |
| `rdx` | 参数、乘除法 |
| `rsi` | 参数、源地址 |
| `rdi` | 参数、目标地址 |
| `rsp` | 栈顶指针 |
| `rbp` | 栈帧基址 |
| `r8-r15` | 扩展通用寄存器 |
| `rip` | 指令指针 |

寄存器比内存快得多，编译器会尽量把热点变量放在寄存器中。

## 5. 内存寻址

程序看到的是地址。CPU 通过地址访问内存。

x86-64 常见寻址形式：

```asm
mov (%rax), %rbx        # rbx = memory[rax]
mov 8(%rax), %rbx       # rbx = memory[rax + 8]
mov (%rax,%rcx,4), %edx # edx = memory[rax + rcx * 4]
```

数组访问本质是：

```text
base + index * element_size
```

C 代码：

```c
int x = a[i];
```

可能对应：

```asm
mov (%rdi,%rsi,4), %eax
```

## 6. 栈

栈用于保存：

- 函数调用返回地址。
- 局部变量。
- 临时数据。
- 保存的寄存器。
- 参数溢出部分。

在很多架构和 ABI 中，栈向低地址增长。

```text
高地址
  ...
  调用者栈帧
  返回地址
  保存的 rbp
  局部变量
低地址
```

`rsp` 指向栈顶，`rbp` 常作为当前栈帧基准。

## 7. 函数调用

函数调用涉及：

1. 传递参数。
2. 保存返回地址。
3. 跳转到被调函数。
4. 建立新栈帧。
5. 执行函数体。
6. 设置返回值。
7. 恢复栈帧。
8. 返回调用者。

C 代码：

```c
int add(int a, int b) {
    return a + b;
}
```

可能编译为：

```asm
add:
    lea (%rdi,%rsi), %eax
    ret
```

优化后简单函数可能没有显式栈帧。

## 8. 调用约定

调用约定规定：

- 参数放在哪些寄存器。
- 返回值放在哪里。
- 哪些寄存器由调用者保存。
- 哪些寄存器由被调用者保存。
- 栈如何对齐。

x86-64 System V ABI 中，前几个整数/指针参数通常放在：

```text
rdi, rsi, rdx, rcx, r8, r9
```

返回值通常在：

```text
rax
```

这就是为什么调试时经常看到这些寄存器。

## 9. 条件分支

C 代码：

```c
if (x > 0) {
    y = 1;
} else {
    y = 2;
}
```

底层常见形式：

```asm
cmp $0, %edi
jle .Lelse
mov $1, %eax
jmp .Ldone
.Lelse:
mov $2, %eax
.Ldone:
ret
```

CPU 使用标志寄存器记录比较结果，条件跳转根据标志决定是否跳转。

## 10. 循环

循环本质是条件跳转。

C：

```c
for (int i = 0; i < n; i++) {
    sum += a[i];
}
```

底层：

```text
初始化 i
跳到判断
循环体
i++
判断是否继续
```

理解循环汇编有助于做性能优化，例如减少分支、改善缓存访问。

## 11. 指针和数组

指针是地址。

```c
int x = 10;
int *p = &x;
```

`p` 保存的是 `x` 的地址。

数组名在很多表达式中会退化为首元素地址：

```c
a[i] == *(a + i)
```

底层地址计算：

```text
address = base + i * sizeof(element)
```

## 12. 结构体访问

```c
struct Point {
    int x;
    int y;
};

int get_y(struct Point *p) {
    return p->y;
}
```

如果 `x` 在偏移 0，`y` 在偏移 4，那么访问 `p->y` 就是读取：

```text
memory[p + 4]
```

结构体字段访问本质是“基地址 + 固定偏移”。

## 13. 缓冲区溢出

栈上数组越界可能覆盖栈帧中的其他数据。

```c
void f() {
    char buf[8];
    gets(buf); // 极危险
}
```

可能覆盖：

- 局部变量。
- 保存的寄存器。
- 返回地址。

现代系统有多种防护：

- Stack canary。
- ASLR。
- NX bit。
- PIE。
- RELRO。
- Fortify。

但 C/C++ 内存安全问题仍然是安全漏洞高发来源。

## 14. 工具

查看汇编：

```bash
gcc -S -O0 main.c
gcc -S -O2 main.c
objdump -d a.out
```

查看符号：

```bash
nm a.out
readelf -s a.out
```

调试：

```bash
gdb ./a.out
layout asm
break main
run
stepi
info registers
x/16gx $rsp
```

## 15. 常见误区

| 误区 | 正确认识 |
|---|---|
| 汇编只和嵌入式有关 | 服务端性能、安全、调试也需要理解汇编 |
| 每个 C 语句对应一条汇编 | 优化后可能完全不同 |
| 局部变量一定在栈上 | 编译器可能放寄存器或优化掉 |
| 函数一定有栈帧 | 简单函数优化后可能没有 |
| 指针类型决定运行时检查 | C 指针运行时通常没有边界检查 |

## 16. 参考资料

- CSAPP 官方资源  
  https://csapp.cs.cmu.edu/

- CMU 15-213 课程  
  https://www.cs.cmu.edu/~213/

- System V AMD64 ABI  
  https://gitlab.com/x86-psABIs/x86-64-ABI

- GNU Binutils Documentation  
  https://sourceware.org/binutils/docs/

- GDB Documentation  
  https://sourceware.org/gdb/documentation/

- Linux man-pages project  
  https://www.kernel.org/doc/man-pages/

