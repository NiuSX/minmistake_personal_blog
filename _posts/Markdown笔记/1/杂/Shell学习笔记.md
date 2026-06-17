# Shell 完整学习笔记

> 适合对象：Linux 初学者、后端开发者、运维、测试、DevOps、数据处理人员，以及需要系统掌握命令行、Shell 脚本、文本处理、自动化任务、管道、重定向和 Bash 编程的人。

Shell 是用户和操作系统内核之间的命令解释器。你在终端中输入命令，Shell 负责解析命令、展开变量和通配符、处理管道和重定向、启动程序、管理进程并返回执行结果。Shell 既可以交互式使用，也可以写成脚本实现自动化。

如果你只会执行 `ls`、`cd`、`mkdir`，还不算真正理解 Shell。真正掌握 Shell，需要理解：命令解析、退出状态、变量、引号、通配符、命令替换、管道、重定向、环境变量、权限、进程、信号、条件判断、循环、函数、数组、错误处理、`set -euo pipefail` 的边界、`grep/sed/awk/find/xargs` 文本处理，以及如何写可靠、可维护、可移植的脚本。

说明：本文以 Linux/Unix Shell 和 Bash 为主。`sh`、`bash`、`zsh`、`dash` 在语法和特性上有差异；脚本如果写 `#!/bin/sh`，就不要随意使用 Bash 专属语法。Windows PowerShell 是另一套对象管道 Shell，不在本文主线范围内。

## 目录

1. Shell 是什么
2. Shell、Terminal、Console、TTY 的区别
3. 常见 Shell：sh、bash、zsh、fish
4. Shell 基本工作流程
5. 命令基本结构
6. 常用快捷键
7. 文件和目录命令
8. 查看文件内容
9. 文件权限
10. 用户、组和 sudo
11. 变量
12. 环境变量
13. 引号规则
14. 通配符和 Glob
15. 命令替换、算术展开、参数展开
16. 管道
17. 重定向
18. 退出状态和逻辑运算
19. Shell 脚本基础
20. Shebang
21. 条件判断 if
22. test、[ ]、[[ ]]
23. case
24. 循环 for、while、until
25. 函数
26. 参数和特殊变量
27. 数组
28. read 和用户输入
29. set、错误处理和严格模式
30. trap、信号和清理
31. 进程管理
32. 作业控制
33. 文本处理 grep、sed、awk
34. find、xargs、sort、uniq、cut、tr
35. 压缩、归档和传输
36. SSH、scp、rsync
37. cron 和定时任务
38. 日志和调试
39. Shell 脚本最佳实践
40. 常见错误和反模式
41. 命令速查表
42. 学习路线
43. 推荐参考资料

## 1. Shell 是什么

Shell 是命令解释器。

它负责：

- 读取用户输入
- 解析命令
- 展开变量
- 展开通配符
- 处理引号
- 设置环境变量
- 创建管道
- 处理重定向
- 启动程序
- 等待程序结束
- 返回退出状态

一句话理解：

```text
Shell 是把用户输入的命令翻译成操作系统可以执行的动作的程序。
```

## 2. Shell、Terminal、Console、TTY 的区别

### 2.1 Shell

命令解释器。

例如：

- bash
- zsh
- sh
- fish

### 2.2 Terminal

终端程序，用来承载 Shell。

例如：

- GNOME Terminal
- iTerm2
- Windows Terminal
- Alacritty

### 2.3 Console

控制台，常指系统级直接交互界面。

### 2.4 TTY

早期电传打字机概念，现代 Linux 中常表示终端设备。

查看当前终端：

```bash
tty
```

## 3. 常见 Shell：sh、bash、zsh、fish

### 3.1 sh

POSIX Shell。

脚本写：

```bash
#!/bin/sh
```

表示应尽量使用 POSIX 兼容语法。

### 3.2 bash

Bourne Again Shell。

Linux 上最常见。

支持：

- 数组
- `[[ ]]`
- `{1..10}`
- `(( ))`
- 进程替换
- 更丰富的参数展开

脚本写：

```bash
#!/usr/bin/env bash
```

### 3.3 zsh

macOS 默认交互 Shell 常见为 zsh。

交互体验强，但脚本中不要假设 bash 语法在 zsh 中完全一样。

### 3.4 fish

交互友好，但语法和 POSIX/Bash 差异较大。

不适合写需要广泛兼容的脚本。

## 4. Shell 基本工作流程

输入：

```bash
echo "$HOME"
```

Shell 大致处理：

1. 读取命令行。
2. 按语法拆分 token。
3. 处理引号。
4. 展开变量。
5. 展开命令替换。
6. 展开通配符。
7. 设置重定向和管道。
8. 找到命令路径。
9. 创建进程执行。
10. 等待命令结束。
11. 保存退出状态 `$?`。

## 5. 命令基本结构

```bash
command [options] [arguments]
```

示例：

```bash
ls -la /tmp
```

其中：

- `ls` 是命令
- `-la` 是选项
- `/tmp` 是参数

### 5.1 短选项

```bash
ls -l
ls -a
ls -la
```

### 5.2 长选项

```bash
ls --all
grep --ignore-case "hello" file.txt
```

### 5.3 获取帮助

```bash
command --help
man ls
info coreutils
type cd
help cd
```

`cd` 是 Shell 内建命令，所以用：

```bash
help cd
```

## 6. 常用快捷键

| 快捷键 | 作用 |
| :--- | :--- |
| `Ctrl + A` | 光标到行首 |
| `Ctrl + E` | 光标到行尾 |
| `Ctrl + U` | 删除光标前内容 |
| `Ctrl + K` | 删除光标后内容 |
| `Ctrl + W` | 删除前一个单词 |
| `Ctrl + L` | 清屏 |
| `Ctrl + C` | 中断当前命令 |
| `Ctrl + D` | 发送 EOF / 退出 |
| `Ctrl + R` | 搜索历史命令 |
| `Tab` | 自动补全 |

## 7. 文件和目录命令

### 7.1 pwd

显示当前目录：

```bash
pwd
```

### 7.2 ls

```bash
ls
ls -l
ls -a
ls -lah
```

### 7.3 cd

```bash
cd /var/log
cd ..
cd ~
cd -
```

### 7.4 mkdir

```bash
mkdir logs
mkdir -p app/logs/2026
```

### 7.5 touch

```bash
touch app.log
```

### 7.6 cp

```bash
cp source.txt target.txt
cp -r dir1 dir2
```

### 7.7 mv

```bash
mv old.txt new.txt
mv file.txt /tmp/
```

### 7.8 rm

```bash
rm file.txt
rm -r dir
```

危险：

```bash
rm -rf /
```

删除命令要极其谨慎。

## 8. 查看文件内容

### 8.1 cat

```bash
cat file.txt
```

适合短文件。

### 8.2 less

```bash
less file.txt
```

适合长文件。

常用：

- `/pattern` 搜索
- `n` 下一个匹配
- `q` 退出

### 8.3 head

```bash
head file.txt
head -n 20 file.txt
```

### 8.4 tail

```bash
tail file.txt
tail -n 50 file.txt
tail -f app.log
```

### 8.5 wc

```bash
wc file.txt
wc -l file.txt
```

### 8.6 file

```bash
file script.sh
```

查看文件类型。

## 9. 文件权限

### 9.1 权限位

```text
r = read
w = write
x = execute
```

查看：

```bash
ls -l script.sh
```

示例：

```text
-rwxr-xr--
```

含义：

```text
文件类型 | 用户权限 | 组权限 | 其他人权限
```

### 9.2 chmod

添加执行权限：

```bash
chmod +x script.sh
```

数字权限：

```bash
chmod 755 script.sh
chmod 644 file.txt
```

常见：

| 权限 | 含义 |
| :--- | :--- |
| `755` | 所有者可读写执行，其他人可读执行 |
| `644` | 所有者可读写，其他人只读 |
| `600` | 只有所有者可读写 |

### 9.3 chown

```bash
sudo chown user:group file.txt
```

### 9.4 umask

查看默认权限掩码：

```bash
umask
```

## 10. 用户、组和 sudo

### 10.1 whoami

```bash
whoami
```

### 10.2 id

```bash
id
```

### 10.3 sudo

以管理员权限执行：

```bash
sudo apt update
```

### 10.4 su

切换用户：

```bash
su - username
```

### 10.5 注意

不要随意用 root 运行脚本。

脚本中需要 root 权限时，应明确检查：

```bash
if [ "$(id -u)" -ne 0 ]; then
  echo "请使用 root 权限运行" >&2
  exit 1
fi
```

## 11. 变量

### 11.1 定义变量

```bash
name="Alice"
```

注意等号两边不能有空格。

错误：

```bash
name = "Alice"
```

### 11.2 使用变量

```bash
echo "$name"
```

推荐加双引号。

### 11.3 只读变量

```bash
readonly app_name="demo"
```

### 11.4 删除变量

```bash
unset name
```

### 11.5 命名规范

普通脚本变量：

```bash
file_path="/tmp/app.log"
```

环境变量：

```bash
APP_ENV="production"
```

## 12. 环境变量

### 12.1 export

```bash
export APP_ENV="production"
```

环境变量会传给子进程。

普通变量不会。

### 12.2 查看环境变量

```bash
env
printenv
printenv PATH
```

### 12.3 PATH

```bash
echo "$PATH"
```

Shell 通过 PATH 查找命令。

临时添加：

```bash
export PATH="$HOME/bin:$PATH"
```

### 12.4 常见环境变量

| 变量 | 说明 |
| :--- | :--- |
| `HOME` | 用户主目录 |
| `PATH` | 命令搜索路径 |
| `PWD` | 当前目录 |
| `USER` | 用户名 |
| `SHELL` | 当前用户默认 shell |
| `LANG` | 语言环境 |
| `EDITOR` | 默认编辑器 |

## 13. 引号规则

引号是 Shell 中最容易出错的部分。

### 13.1 不加引号

```bash
echo $name
```

会发生：

- 变量展开
- 单词分割
- 通配符展开

### 13.2 双引号

```bash
echo "$name"
```

双引号中会展开变量，但不会进行单词分割和 glob 展开。

推荐大多数变量引用都加双引号。

### 13.3 单引号

```bash
echo '$name'
```

单引号中不会展开变量。

输出：

```text
$name
```

### 13.4 示例

```bash
file="my file.txt"
cat "$file"
```

如果不加引号：

```bash
cat $file
```

会被拆成：

```bash
cat my file.txt
```

## 14. 通配符和 Glob

### 14.1 *

```bash
ls *.txt
```

匹配任意字符。

### 14.2 ?

```bash
ls file?.txt
```

匹配一个字符。

### 14.3 []

```bash
ls file[123].txt
```

匹配其中一个字符。

### 14.4 注意

如果没有匹配，Bash 默认保留原样。

```bash
echo *.unknown
```

可能输出：

```text
*.unknown
```

### 14.5 nullglob

Bash 中：

```bash
shopt -s nullglob
```

无匹配时展开为空。

## 15. 命令替换、算术展开、参数展开

### 15.1 命令替换

推荐：

```bash
today="$(date +%F)"
```

旧写法：

```bash
today=`date +%F`
```

不推荐反引号，嵌套和可读性差。

### 15.2 算术展开

```bash
count=1
count=$((count + 1))
echo "$count"
```

### 15.3 默认值

```bash
name="${name:-guest}"
```

如果 `name` 未设置或为空，使用 `guest`。

### 15.4 必填变量

```bash
: "${APP_ENV:?APP_ENV 未设置}"
```

### 15.5 字符串长度

```bash
name="Alice"
echo "${#name}"
```

### 15.6 截取

```bash
text="abcdef"
echo "${text:1:3}"
```

Bash 专属。

## 16. 管道

管道把前一个命令的标准输出传给后一个命令的标准输入。

```bash
ps aux | grep nginx
```

### 16.1 多级管道

```bash
cat access.log | grep " 500 " | wc -l
```

更简洁：

```bash
grep " 500 " access.log | wc -l
```

### 16.2 管道退出状态

默认 `$?` 是最后一个命令的退出状态。

Bash 中启用：

```bash
set -o pipefail
```

管道中任一命令失败，整体更容易失败。

## 17. 重定向

### 17.1 标准输入输出错误

| 编号 | 名称 |
| :--- | :--- |
| 0 | stdin |
| 1 | stdout |
| 2 | stderr |

### 17.2 输出重定向

覆盖写入：

```bash
echo "hello" > file.txt
```

追加：

```bash
echo "hello" >> file.txt
```

### 17.3 错误重定向

```bash
command 2> error.log
```

### 17.4 stdout 和 stderr 都重定向

```bash
command > output.log 2>&1
```

Bash 简写：

```bash
command &> output.log
```

### 17.5 输入重定向

```bash
sort < names.txt
```

### 17.6 Here Document

```bash
cat <<EOF
hello
world
EOF
```

### 17.7 Here String

Bash：

```bash
grep "hello" <<< "$text"
```

## 18. 退出状态和逻辑运算

### 18.1 退出状态

```bash
echo "$?"
```

约定：

```text
0 = 成功
非 0 = 失败
```

### 18.2 &&

前一个成功才执行后一个。

```bash
mkdir -p build && cd build
```

### 18.3 ||

前一个失败才执行后一个。

```bash
command || echo "command failed"
```

### 18.4 !

取反。

```bash
if ! grep -q "hello" file.txt; then
  echo "not found"
fi
```

## 19. Shell 脚本基础

### 19.1 创建脚本

`hello.sh`：

```bash
#!/usr/bin/env bash

echo "Hello Shell"
```

### 19.2 添加执行权限

```bash
chmod +x hello.sh
```

### 19.3 执行脚本

```bash
./hello.sh
```

或：

```bash
bash hello.sh
```

### 19.4 脚本基本结构

```bash
#!/usr/bin/env bash
set -euo pipefail

main() {
  echo "start"
}

main "$@"
```

## 20. Shebang

### 20.1 Bash 脚本

```bash
#!/usr/bin/env bash
```

优点：

```text
通过 PATH 查找 bash，可移植性较好。
```

### 20.2 POSIX sh

```bash
#!/bin/sh
```

使用这个时，不要使用 Bash 数组、`[[ ]]` 等 Bash 专属语法。

### 20.3 Python 示例

```python
#!/usr/bin/env python3
```

## 21. 条件判断 if

### 21.1 基本结构

```bash
if command; then
  echo "success"
else
  echo "failed"
fi
```

### 21.2 判断文件存在

```bash
if [ -f "app.log" ]; then
  echo "file exists"
fi
```

### 21.3 判断目录存在

```bash
if [ -d "/var/log" ]; then
  echo "dir exists"
fi
```

### 21.4 判断变量

```bash
if [ "$env" = "prod" ]; then
  echo "production"
fi
```

变量加引号。

## 22. test、[ ]、[[ ]]

### 22.1 test

```bash
test -f file.txt
```

### 22.2 [ ]

```bash
[ -f file.txt ]
```

`[` 本质上是命令，右侧 `]` 前必须有空格。

错误：

```bash
[ -f file.txt]
```

### 22.3 [[ ]]

Bash 扩展：

```bash
if [[ "$name" == A* ]]; then
  echo "starts with A"
fi
```

优点：

- 更安全
- 支持模式匹配
- 支持 `&&`、`||`

### 22.4 常见文件判断

| 表达式 | 含义 |
| :--- | :--- |
| `-f file` | 普通文件 |
| `-d dir` | 目录 |
| `-e path` | 存在 |
| `-r file` | 可读 |
| `-w file` | 可写 |
| `-x file` | 可执行 |
| `-s file` | 非空 |

### 22.5 字符串判断

```bash
[ "$a" = "$b" ]
[ "$a" != "$b" ]
[ -z "$a" ]
[ -n "$a" ]
```

### 22.6 数字判断

```bash
[ "$age" -ge 18 ]
```

常见：

| 表达式 | 含义 |
| :--- | :--- |
| `-eq` | 等于 |
| `-ne` | 不等于 |
| `-gt` | 大于 |
| `-ge` | 大于等于 |
| `-lt` | 小于 |
| `-le` | 小于等于 |

## 23. case

适合多分支判断。

```bash
case "$env" in
  dev)
    echo "development"
    ;;
  test)
    echo "testing"
    ;;
  prod)
    echo "production"
    ;;
  *)
    echo "unknown"
    exit 1
    ;;
esac
```

匹配多个：

```bash
case "$answer" in
  y|Y|yes|YES)
    echo "yes"
    ;;
esac
```

## 24. 循环 for、while、until

### 24.1 for 遍历列表

```bash
for file in *.log; do
  echo "$file"
done
```

### 24.2 C 风格 for

Bash：

```bash
for ((i = 0; i < 10; i++)); do
  echo "$i"
done
```

### 24.3 while

```bash
count=0
while [ "$count" -lt 5 ]; do
  echo "$count"
  count=$((count + 1))
done
```

### 24.4 读取文件每行

```bash
while IFS= read -r line; do
  echo "$line"
done < file.txt
```

这是读取文本行的推荐基础写法。

### 24.5 until

```bash
until curl -fsS http://localhost:8080/health; do
  sleep 1
done
```

直到命令成功才停止。

## 25. 函数

### 25.1 定义函数

```bash
greet() {
  echo "Hello $1"
}

greet "Alice"
```

### 25.2 函数返回状态

```bash
is_file() {
  [ -f "$1" ]
}

if is_file "app.log"; then
  echo "exists"
fi
```

Shell 函数返回的是退出状态，不是普通返回值。

### 25.3 输出作为返回值

```bash
get_today() {
  date +%F
}

today="$(get_today)"
```

### 25.4 local

Bash：

```bash
demo() {
  local name="Alice"
  echo "$name"
}
```

避免污染全局变量。

## 26. 参数和特殊变量

| 变量 | 含义 |
| :--- | :--- |
| `$0` | 脚本名 |
| `$1` | 第一个参数 |
| `$2` | 第二个参数 |
| `$#` | 参数数量 |
| `$@` | 所有参数，推荐用 `"$@"` |
| `$*` | 所有参数 |
| `$?` | 上一命令退出状态 |
| `$$` | 当前 Shell PID |
| `$!` | 最近后台进程 PID |

### 26.1 参数检查

```bash
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <file>" >&2
  exit 1
fi
```

### 26.2 遍历参数

```bash
for arg in "$@"; do
  echo "$arg"
done
```

一定要用 `"$@"`。

## 27. 数组

Bash 支持数组。

### 27.1 定义数组

```bash
files=("a.txt" "b.txt" "my file.txt")
```

### 27.2 访问元素

```bash
echo "${files[0]}"
```

### 27.3 遍历数组

```bash
for file in "${files[@]}"; do
  echo "$file"
done
```

### 27.4 数组长度

```bash
echo "${#files[@]}"
```

### 27.5 追加

```bash
files+=("c.txt")
```

注意：数组不是 POSIX sh 特性。

## 28. read 和用户输入

### 28.1 基本读取

```bash
read -r name
echo "$name"
```

推荐加 `-r`，避免反斜杠转义。

### 28.2 提示输入

Bash：

```bash
read -r -p "请输入用户名: " username
```

### 28.3 读取密码

```bash
read -r -s -p "请输入密码: " password
echo
```

### 28.4 读取文件

```bash
while IFS= read -r line; do
  echo "$line"
done < file.txt
```

## 29. set、错误处理和严格模式

### 29.1 set -e

```bash
set -e
```

命令失败时退出。

注意：`set -e` 有很多边界场景，不要以为它能处理所有错误。

### 29.2 set -u

```bash
set -u
```

使用未定义变量时报错。

### 29.3 pipefail

Bash：

```bash
set -o pipefail
```

让管道中任一命令失败时更容易被发现。

### 29.4 常见严格模式

```bash
set -euo pipefail
```

### 29.5 失败处理

```bash
if ! cp "$src" "$dst"; then
  echo "复制失败: $src -> $dst" >&2
  exit 1
fi
```

对关键命令，显式处理比盲目依赖 `set -e` 更可靠。

## 30. trap、信号和清理

### 30.1 trap EXIT

```bash
tmp_dir="$(mktemp -d)"

cleanup() {
  rm -rf "$tmp_dir"
}

trap cleanup EXIT
```

脚本退出时清理临时目录。

### 30.2 捕获中断

```bash
trap 'echo "interrupted"; exit 130' INT
```

### 30.3 常见信号

| 信号 | 含义 |
| :--- | :--- |
| `INT` | Ctrl+C |
| `TERM` | 终止请求 |
| `HUP` | 挂起 |
| `KILL` | 强制杀死，不能捕获 |
| `EXIT` | Shell 退出伪信号 |

## 31. 进程管理

### 31.1 ps

```bash
ps aux
ps aux | grep nginx
```

### 31.2 pgrep

```bash
pgrep nginx
pgrep -a nginx
```

### 31.3 kill

```bash
kill <pid>
kill -TERM <pid>
kill -KILL <pid>
```

优先用 TERM，少用 KILL。

### 31.4 top / htop

```bash
top
htop
```

### 31.5 后台执行

```bash
long_running_command &
echo "$!"
```

`$!` 是最近后台进程 PID。

## 32. 作业控制

### 32.1 jobs

```bash
jobs
```

### 32.2 fg

```bash
fg %1
```

把后台作业放回前台。

### 32.3 bg

```bash
bg %1
```

让暂停的作业在后台继续。

### 32.4 Ctrl+Z

暂停当前前台作业。

### 32.5 nohup

```bash
nohup command > app.log 2>&1 &
```

退出终端后继续运行。

生产服务更推荐 systemd、supervisor、容器编排等。

## 33. 文本处理 grep、sed、awk

### 33.1 grep

搜索文本：

```bash
grep "error" app.log
```

忽略大小写：

```bash
grep -i "error" app.log
```

递归：

```bash
grep -R "TODO" .
```

只显示行号：

```bash
grep -n "error" app.log
```

静默判断：

```bash
if grep -q "ready" app.log; then
  echo "ready"
fi
```

### 33.2 sed

替换：

```bash
sed 's/old/new/g' file.txt
```

打印指定行：

```bash
sed -n '1,10p' file.txt
```

原地替换要谨慎：

```bash
sed -i 's/old/new/g' file.txt
```

macOS 和 GNU sed 的 `-i` 语法不同。

### 33.3 awk

按列处理：

```bash
awk '{print $1, $3}' file.txt
```

指定分隔符：

```bash
awk -F: '{print $1}' /etc/passwd
```

求和：

```bash
awk '{sum += $1} END {print sum}' numbers.txt
```

## 34. find、xargs、sort、uniq、cut、tr

### 34.1 find

查找文件：

```bash
find . -name "*.log"
```

按类型：

```bash
find . -type f
find . -type d
```

按时间：

```bash
find . -type f -mtime +7
```

删除前先打印确认：

```bash
find . -type f -name "*.tmp" -print
```

再删除：

```bash
find . -type f -name "*.tmp" -delete
```

### 34.2 xargs

```bash
find . -name "*.log" -print0 | xargs -0 wc -l
```

使用 `-print0` 和 `-0` 处理带空格文件名。

### 34.3 sort

```bash
sort names.txt
sort -n numbers.txt
sort -r names.txt
```

### 34.4 uniq

```bash
sort names.txt | uniq
sort names.txt | uniq -c
```

`uniq` 通常需要先排序。

### 34.5 cut

```bash
cut -d: -f1 /etc/passwd
```

### 34.6 tr

```bash
echo "hello" | tr 'a-z' 'A-Z'
```

删除字符：

```bash
echo "a b c" | tr -d ' '
```

## 35. 压缩、归档和传输

### 35.1 tar

打包：

```bash
tar cf archive.tar dir/
```

解包：

```bash
tar xf archive.tar
```

gzip 压缩：

```bash
tar czf archive.tar.gz dir/
tar xzf archive.tar.gz
```

### 35.2 zip

```bash
zip -r archive.zip dir/
unzip archive.zip
```

### 35.3 curl

```bash
curl -fsSL https://example.com
```

下载：

```bash
curl -fL -o file.tar.gz https://example.com/file.tar.gz
```

### 35.4 wget

```bash
wget https://example.com/file.tar.gz
```

## 36. SSH、scp、rsync

### 36.1 ssh

```bash
ssh user@example.com
```

指定端口：

```bash
ssh -p 2222 user@example.com
```

执行远程命令：

```bash
ssh user@example.com "uptime"
```

### 36.2 scp

上传：

```bash
scp local.txt user@example.com:/tmp/
```

下载：

```bash
scp user@example.com:/tmp/remote.txt .
```

### 36.3 rsync

同步目录：

```bash
rsync -avz ./dist/ user@example.com:/var/www/app/
```

删除远端多余文件：

```bash
rsync -avz --delete ./dist/ user@example.com:/var/www/app/
```

`--delete` 谨慎使用。

## 37. cron 和定时任务

### 37.1 编辑 crontab

```bash
crontab -e
```

查看：

```bash
crontab -l
```

### 37.2 cron 格式

```text
分钟 小时 日期 月份 星期 命令
```

示例：

```cron
0 2 * * * /opt/scripts/backup.sh
```

每天凌晨 2 点执行。

### 37.3 注意环境变量

cron 环境很少。

脚本中应使用绝对路径，或显式设置 PATH：

```bash
PATH=/usr/local/bin:/usr/bin:/bin
```

### 37.4 日志

```cron
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```

## 38. 日志和调试

### 38.1 echo 调试

```bash
echo "file=$file"
```

### 38.2 set -x

```bash
set -x
command
set +x
```

显示执行过程。

### 38.3 bash -x

```bash
bash -x script.sh
```

### 38.4 输出到 stderr

```bash
echo "error: failed" >&2
```

### 38.5 日志函数

```bash
log() {
  printf '[%s] %s\n' "$(date '+%F %T')" "$*"
}

log "deploy start"
```

## 39. Shell 脚本最佳实践

### 39.1 使用明确 shebang

```bash
#!/usr/bin/env bash
```

### 39.2 变量加引号

```bash
rm -- "$file"
```

### 39.3 使用 "$@"

```bash
main "$@"
```

### 39.4 使用 local

```bash
local file="$1"
```

### 39.5 检查命令依赖

```bash
need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "缺少命令: $1" >&2
    exit 1
  }
}

need_cmd curl
need_cmd tar
```

### 39.6 临时目录要清理

```bash
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT
```

### 39.7 用 ShellCheck

```bash
shellcheck script.sh
```

ShellCheck 能发现大量常见错误。

### 39.8 复杂逻辑别硬写 Shell

Shell 适合：

- 调命令
- 文件处理
- 自动化流程
- 简单文本处理

不适合：

- 复杂业务逻辑
- 大型数据结构
- 并发复杂控制
- 复杂 JSON/YAML 操作

这些场景考虑 Python、Go、Node.js 等。

## 40. 常见错误和反模式

### 40.1 变量不加引号

错误：

```bash
rm $file
```

正确：

```bash
rm -- "$file"
```

### 40.2 for line in $(cat file)

错误：

```bash
for line in $(cat file.txt); do
  echo "$line"
done
```

会按空白拆分。

正确：

```bash
while IFS= read -r line; do
  echo "$line"
done < file.txt
```

### 40.3 解析 ls 输出

不推荐：

```bash
for file in $(ls); do
  echo "$file"
done
```

推荐：

```bash
for file in *; do
  [ -e "$file" ] || continue
  echo "$file"
done
```

### 40.4 cd 后不检查

危险：

```bash
cd "$dir"
rm -rf *
```

更安全：

```bash
cd "$dir" || exit 1
rm -rf -- *
```

### 40.5 rm -rf 变量为空

危险：

```bash
rm -rf "$target_dir"/*
```

如果变量异常可能误删。

先检查：

```bash
: "${target_dir:?target_dir 未设置}"
rm -rf -- "$target_dir"/*
```

### 40.6 过度依赖 set -e

`set -e` 不是万能错误处理。

关键步骤应显式判断。

### 40.7 脚本里使用相对路径

脚本可能从不同工作目录执行。

获取脚本目录：

```bash
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
```

Bash 专属。

## 41. 命令速查表

### 41.1 文件目录

```bash
pwd
ls -lah
cd /path
mkdir -p dir
touch file
cp src dst
cp -r dir1 dir2
mv old new
rm file
rm -r dir
```

### 41.2 查看内容

```bash
cat file
less file
head -n 20 file
tail -n 50 file
tail -f app.log
wc -l file
```

### 41.3 权限

```bash
chmod +x script.sh
chmod 755 script.sh
chmod 644 file.txt
chown user:group file.txt
```

### 41.4 搜索处理

```bash
grep -R "text" .
sed 's/old/new/g' file
awk '{print $1}' file
find . -name "*.log"
find . -type f -mtime +7
sort file
uniq -c
cut -d: -f1 /etc/passwd
```

### 41.5 进程

```bash
ps aux
pgrep -a nginx
kill PID
top
jobs
fg %1
bg %1
```

### 41.6 网络和远程

```bash
curl -fsSL URL
wget URL
ssh user@host
scp file user@host:/path
rsync -avz src/ user@host:/path/
```

### 41.7 脚本

```bash
bash script.sh
bash -x script.sh
shellcheck script.sh
chmod +x script.sh
./script.sh arg1 arg2
```

## 42. 学习路线

### 阶段 1：命令行基础

掌握：

- `pwd`
- `ls`
- `cd`
- `mkdir`
- `cp`
- `mv`
- `rm`
- `cat`
- `less`

### 阶段 2：文件、权限和进程

掌握：

- `chmod`
- `chown`
- `ps`
- `kill`
- `top`
- `df`
- `du`

### 阶段 3：Shell 机制

掌握：

- 变量
- 环境变量
- 引号
- glob
- 命令替换
- 退出状态
- 管道
- 重定向

### 阶段 4：脚本编程

掌握：

- shebang
- if
- case
- for
- while
- 函数
- 参数
- 数组
- read

### 阶段 5：文本处理

掌握：

- grep
- sed
- awk
- find
- xargs
- sort
- uniq
- cut
- tr

### 阶段 6：工程实践

掌握：

- trap
- 错误处理
- ShellCheck
- cron
- ssh
- rsync
- 日志
- 安全删除

## 43. 推荐参考资料

建议阅读：

- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- [Bash Reference Manual](https://www.gnu.org/s/bash/manual/bash.html)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [ShellCheck](https://www.shellcheck.net/)
- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
- [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/)
- [explainshell](https://explainshell.com/)

## 最后总结

Shell 的核心可以浓缩为：

```text
命令执行具体工作
变量保存数据
引号决定是否拆分
管道连接命令
重定向控制输入输出
退出状态表达成功失败
脚本把命令组织成自动化流程
```

写好 Shell 脚本的关键是：

1. 明确脚本使用的是 `sh` 还是 `bash`。
2. 变量引用尽量加双引号。
3. 文件名可能包含空格、换行和特殊字符。
4. 删除、移动、覆盖操作必须谨慎。
5. 关键命令要检查失败。
6. 复杂逻辑不要硬塞进 Shell。
7. 用 ShellCheck 检查脚本。

当你能解释 `"$@"` 和 `$*` 的区别、为什么变量要加引号、管道退出状态为什么要 `pipefail`、`[ ]` 和 `[[ ]]` 的区别、`find -print0 | xargs -0` 解决什么问题时，就已经真正入门 Shell。

## 44. 2026-06 深化补充：可维护 Shell 脚本写法

Shell 最适合做命令编排、文件批处理、环境初始化和轻量自动化。它不适合承载复杂业务逻辑、复杂数据结构和大型跨平台程序。判断是否继续写 Shell 的标准很简单：如果脚本开始大量处理嵌套数据、复杂状态机、精细错误恢复，就应该考虑 Python、Go 或专用工具。

### 44.1 推荐脚本骨架

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  cat <<'USAGE'
Usage: script.sh <target-dir>
USAGE
}

main() {
  if [[ $# -ne 1 ]]; then
    usage >&2
    exit 2
  fi

  local target=$1
  if [[ ! -d "$target" ]]; then
    printf 'error: not a directory: %s\n' "$target" >&2
    exit 1
  fi

  # real work here
}

main "$@"
```

这个骨架强调四件事：明确解释器、开启严格模式、所有变量加引号、用 `main "$@"` 保留参数边界。

### 44.2 `set -euo pipefail` 的边界

| 选项 | 作用 | 注意 |
| --- | --- | --- |
| `set -e` | 命令失败时退出 | 在 `if`、`while`、`||`、`&&` 等上下文中行为需要理解 |
| `set -u` | 使用未定义变量时报错 | 可选变量用 `${name:-default}` |
| `pipefail` | 管道中任一命令失败则整体失败 | Bash 支持，POSIX `sh` 不保证支持 |
| `set -E` | ERR trap 在函数中继承 | 适合统一错误处理 |

严格模式不是免死金牌。关键命令仍要写清楚错误信息，尤其是删除、覆盖、发布、部署类脚本。

### 44.3 安全处理文件名

```bash
find "$root" -type f -name '*.log' -print0 |
while IFS= read -r -d '' file; do
  printf 'processing: %s\n' "$file"
done
```

要默认文件名可能包含空格、制表符、换行、通配符字符。批量处理文件时优先使用 `-print0`、`read -r -d ''`、`xargs -0`。

### 44.4 常见反模式

- `for f in $(ls)`：会被空格和换行破坏。
- 未加引号的 `$var`：会触发单词分割和通配符展开。
- 用 `rm -rf "$dir/"*` 前没有校验 `$dir` 是否为空或是否在预期目录。
- 把 JSON/YAML 当普通文本用 `grep`/`sed` 硬切。
- 脚本同时依赖 Bash 特性，却写 `#!/bin/sh`。
- 在管道中间使用会吞掉错误的命令，却没有检查退出状态。

## 45. 补充参考资料

- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [ShellCheck Wiki](https://www.shellcheck.net/wiki/Home)
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/)

## 2026-06 深化整理：Shell 的工程化学习框架

Last researched: 2026-06-16

### 1. 学习定位

Shell 这类知识不适合只按“概念清单”记忆，更适合按可交付能力组织。本文后续复习时，应围绕这条主线展开：Bash 语法、管道、重定向、变量展开、函数、脚本健壮性、文本处理和自动化。如果只会照抄命令、配置或示例，而不能解释输入、输出、边界、失败模式和验证方法，知识在真实项目里会很快失效。

一份万字级笔记要承担三个作用：第一，建立准确概念，避免把相似术语混在一起；第二，形成可执行流程，知道从零搭建、调试和交付的顺序；第三，沉淀排错经验，遇到异常时能按证据定位，而不是凭感觉改配置。学习时建议把每个小节都对应到“是什么、为什么、怎么做、什么时候不用、出了问题怎么查”五个问题。

### 2. 核心模块

- Shell 擅长把命令组合成自动化流程
- 引用规则决定变量是否安全
- 管道和重定向决定数据流
- 退出码决定脚本控制流
- set 选项能提高脚本失败可见性

这些模块之间不是孤立关系。通常先有需求和约束，再选择架构或工具；工具落地后会产生配置、接口、状态和制品；运行阶段再通过日志、指标、测试和回滚机制验证结果。真正掌握本主题，意味着能从一次失败现象反推到是哪一层出了问题。

```mermaid
flowchart LR
  A[目标与约束] --> B[核心概念]
  B --> C[工程实现]
  C --> D[测试与验证]
  D --> E[上线或交付]
  E --> F[日志、指标、反馈]
  F --> B
```

Figure: 通用学习与工程闭环，结合官方文档、标准资料和社区实践重新整理。

### 3. 实践路线

建议按四轮学习。第一轮只跑通最小例子，不追求复杂度；第二轮补齐关键概念，明确每个配置项和命令的作用；第三轮做故障注入，主动制造常见错误并记录现象；第四轮整理成项目模板，把目录结构、命名规范、检查清单和参考链接固化下来。

对技术笔记而言，最小例子必须可重复。命令类主题要记录操作系统、Shell、权限、工作目录和返回码；框架类主题要记录版本、依赖、构建命令、目录结构和运行入口；工程设计类主题要记录标准依据、图纸、点表、验收项和变更记录。没有环境信息的示例，后续很难判断是知识错误、版本差异还是本机配置问题。

### 4. 常见错误

- 变量未加引号
- for 循环按空格切文件名
- 忽略 pipefail
- 临时文件不安全
- 脚本依赖交互输入

排查时先收集事实：版本、配置、输入、输出、日志、错误码、时间点、复现步骤。不要一开始就改多个参数。一次只改一个变量，并记录改动前后的现象。对于涉及安全、权限、部署、数据库、电气或工业控制的主题，要优先查官方文档和标准，社区文章只能作为实践参考，不能作为唯一依据。

### 5. 笔记维护建议

后续更新这篇文档时，建议保留 `Last researched` 日期，并把新增内容放到“版本差异”“实践坑”“调试清单”“参考资料”中。对于快速变化的工具链，例如 Android、Gradle、Docker、CI/CD、Redis、uv、Qt 和前端标准，至少在重新实践前核对一次官方文档。对于工业、电气、PLC、RBAC 这类涉及安全、权限或标准的内容，应明确标准编号、适用地区、适用版本和项目约束。

## References and further reading

- [Official] [GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- [Official] [bash(1) Linux manual page](https://man7.org/linux/man-pages/man1/bash.1.html)
- [Community] [ShellCheck wiki](https://www.shellcheck.net/wiki/)
- [Official] [MDN Web Docs](https://developer.mozilla.org/)
- [Official] [Microsoft Learn](https://learn.microsoft.com/)
- [Official] [Docker Docs](https://docs.docker.com/)
- [Official] [GitHub Actions documentation](https://docs.github.com/actions)
- [Official] [GitLab CI/CD documentation](https://docs.gitlab.com/ci/)
- [Official] [CMake Documentation](https://cmake.org/cmake/help/latest/)
- [Official] [Gradle User Manual](https://docs.gradle.org/)
- [Official] [Apache Maven Guides](https://maven.apache.org/guides/)
- [Official] [Redis Documentation](https://redis.io/docs/latest/)
- [Official] [Qt Documentation](https://doc.qt.io/qt-6/)
- [Course] [MIT 6.006 Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)

<!-- research-notes: enhanced-v1 -->

## 研究笔记增强

> Last reviewed: 2026-06-17。此节用于把《Shell 完整学习笔记》从阅读笔记推进到可复习、可实践、可验证的研究笔记；具体版本、参数和环境仍需结合官方资料、项目约束和实测结果校准。

### 知识定位

按概念理解、最小实践、故障排查、复盘沉淀的路径学习，既记录是什么，也记录什么时候用、什么时候不用和失败后如何定位。

### 重点补充
- 明确该技术解决的问题、输入输出、边界条件和依赖环境。
- 把核心概念落到一个最小可运行示例。
- 记录版本、配置、命令、日志和错误信息，保证以后可以复现。
- 明确适用场景、限制条件、替代方案和迁移成本。

### 实践清单
- 为本章整理一张概念关系图、流程图或最小系统图。
- 写一个最小可运行示例，并保留运行命令、输入、输出和环境版本。
- 列出常见错误、排查命令、关键日志和修复动作。
- 补充安全、性能、兼容性、可维护性和上线运维注意事项。
- 用一次真实问题或练习项目复盘验证笔记是否可用。

### 常见误区
- 只摘抄定义或命令，没有记录上下文、前提条件和边界。
- 只记录成功路径，不记录失败样本、异常现象和排查过程。
- 没有版本、环境和数据样本，导致后续无法复现。
- 把教程默认值直接用于真实项目，没有结合约束重新评估。

### 复盘问题
- 学完《Shell 完整学习笔记》后，能否用自己的话说明它解决什么问题、不解决什么问题？
- 如果要在真实项目中使用，需要哪些前置条件、依赖版本、输入数据和验证手段？
- 失败时最先检查哪三类证据：日志、指标、抓包、堆栈、配置、样本还是硬件测量？
- 有没有形成可重复的最小实验、测试用例或排查命令？

### 延伸方向
- 官方文档和版本变更记录。
- 同类技术、框架或方案对比。
- 面向真实项目的最小实践。
- 故障排查清单和复盘案例库。

### 复盘记录模板

```text
主题：Shell 完整学习笔记
日期：
目标：本次要验证或掌握的具体问题
环境：系统 / 语言 / 框架 / 工具 / 设备 / 版本
步骤：最小可复现流程
现象：成功输出、失败输出、日志、指标或测量数据
分析：为什么会出现该现象，和哪些概念相关
结论：可复用的规则、命令、配置或设计取舍
风险：边界条件、性能、安全、兼容性或维护成本
下一步：继续实验、补充资料或应用到项目
```
