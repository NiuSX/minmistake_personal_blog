# Windows CMD 指令完整学习笔记

> 适合对象：Windows 初学者、测试、运维、后端开发、桌面开发者，以及需要掌握传统命令提示符、批处理脚本和 Windows 基础排查命令的人。

CMD，全称 Command Prompt，是 Windows 传统命令行解释器，对应程序是 `cmd.exe`。它适合运行 Windows 内置命令、老旧工具、批处理脚本 `.bat` / `.cmd`，也常用于简单文件管理、网络排查、进程查看、服务操作和环境变量配置。

如果你只会 `dir`、`cd`、`ipconfig`，还不算真正掌握 CMD。真正熟练使用 CMD，需要理解：盘符和路径、内部命令和外部命令、环境变量、通配符、管道、重定向、错误码、批处理参数、`for` 循环、`if` 判断、`robocopy`、`findstr`、`netstat`、`tasklist`、`taskkill`、`sc` 等命令。

说明：CMD 是传统文本 Shell，功能不如 PowerShell 现代化。新自动化脚本优先考虑 PowerShell；但在老系统、老脚本、安装器、批处理和部分 Windows 管理场景中，CMD 仍然很常见。

## 目录

1. CMD 是什么
2. 打开 CMD 和管理员权限
3. 命令基本格式
4. 获取帮助
5. 盘符、路径和当前目录
6. 文件和目录查看
7. 新建、复制、移动、删除
8. 查看文件内容和搜索文本
9. 通配符
10. 环境变量
11. PATH 和 where
12. 管道和重定向
13. 网络命令
14. 进程命令
15. 服务命令
16. 系统信息命令
17. 磁盘和文件系统命令
18. 用户和权限相关命令
19. 注册表命令
20. 批处理脚本基础
21. 批处理变量和参数
22. 批处理 if、for、goto、call
23. 错误码和 errorlevel
24. 常见排查场景
25. CMD 最佳实践
26. CMD 命令速查表
27. 推荐参考资料

## 1. CMD 是什么

CMD 是 Windows 的传统命令解释器。

启动程序：

```cmd
cmd.exe
```

脚本扩展名：

```text
.bat
.cmd
```

CMD 可以做：

- 文件目录管理
- 环境变量设置
- 运行程序
- 简单文本搜索
- 网络诊断
- 进程管理
- 服务管理
- 批处理自动化

## 2. 打开 CMD 和管理员权限

### 2.1 普通打开

```text
Win + R -> cmd -> Enter
```

或开始菜单搜索：

```text
Command Prompt
```

### 2.2 管理员打开

右键：

```text
以管理员身份运行
```

需要管理员权限的场景：

- 修改系统目录
- 管理服务
- 修改注册表系统区域
- 修改网络配置
- 安装或卸载系统级程序

### 2.3 查看当前用户

```cmd
whoami
```

查看权限和组：

```cmd
whoami /all
```

## 3. 命令基本格式

```cmd
command [options] [arguments]
```

示例：

```cmd
dir /a /s C:\Windows
```

CMD 选项通常使用 `/`：

```cmd
dir /?
copy /?
```

也有程序使用 `-` 或 `--`，这取决于具体程序。

## 4. 获取帮助

### 4.1 help

```cmd
help
help dir
help copy
```

### 4.2 /?

```cmd
dir /?
copy /?
robocopy /?
findstr /?
```

### 4.3 查看命令路径

```cmd
where python
where git
where notepad
```

## 5. 盘符、路径和当前目录

### 5.1 查看当前目录

```cmd
cd
```

### 5.2 切换目录

```cmd
cd C:\Users
cd ..
cd \
```

### 5.3 切换盘符

```cmd
D:
```

切换盘符并进入目录：

```cmd
cd /d D:\Projects
```

### 5.4 路径带空格

路径含空格必须加引号：

```cmd
cd "C:\Program Files"
```

### 5.5 当前目录变量

```cmd
echo %CD%
```

## 6. 文件和目录查看

### 6.1 dir

```cmd
dir
dir /a
dir /s
dir /b
dir /w
dir /p
dir *.txt
```

常用参数：

| 参数 | 作用 |
| :--- | :--- |
| `/a` | 显示所有文件，包括隐藏文件 |
| `/s` | 递归子目录 |
| `/b` | 简洁模式 |
| `/w` | 宽列表 |
| `/p` | 分页 |
| `/o:n` | 按名称排序 |
| `/o:d` | 按日期排序 |
| `/t:w` | 使用最后写入时间 |

### 6.2 tree

```cmd
tree
tree /f
tree /a
```

显示目录树。

### 6.3 attrib

查看或修改文件属性：

```cmd
attrib file.txt
attrib +h file.txt
attrib -h file.txt
```

常见属性：

- `R` 只读
- `H` 隐藏
- `S` 系统
- `A` 归档

## 7. 新建、复制、移动、删除

### 7.1 mkdir / md

```cmd
mkdir logs
md app\logs
```

### 7.2 rmdir / rd

删除空目录：

```cmd
rmdir logs
```

递归静默删除：

```cmd
rmdir /s /q logs
```

危险，执行前确认路径。

### 7.3 copy

```cmd
copy a.txt b.txt
copy *.txt D:\Backup\
```

### 7.4 xcopy

```cmd
xcopy C:\Source D:\Backup /e /i /y
```

常用参数：

| 参数 | 作用 |
| :--- | :--- |
| `/e` | 包含子目录，包括空目录 |
| `/i` | 目标当作目录 |
| `/y` | 覆盖不提示 |
| `/h` | 包含隐藏和系统文件 |

### 7.5 robocopy

`robocopy` 更适合目录同步。

```cmd
robocopy C:\Source D:\Backup /E
```

镜像：

```cmd
robocopy C:\Source D:\Backup /MIR
```

常用参数：

| 参数 | 作用 |
| :--- | :--- |
| `/E` | 复制所有子目录 |
| `/MIR` | 镜像目录，会删除目标多余文件 |
| `/XD` | 排除目录 |
| `/XF` | 排除文件 |
| `/R:n` | 重试次数 |
| `/W:n` | 重试等待秒数 |
| `/LOG:file` | 写日志 |

`/MIR` 很危险，会删除目标端源目录不存在的内容。

### 7.6 move

```cmd
move file.txt D:\Backup\
move old.txt new.txt
```

### 7.7 del / erase

```cmd
del file.txt
del /q *.log
erase file.txt
```

删除只读文件：

```cmd
del /f file.txt
```

递归删除匹配文件：

```cmd
del /s /q *.tmp
```

## 8. 查看文件内容和搜索文本

### 8.1 type

```cmd
type file.txt
```

适合短文件。

### 8.2 more

```cmd
more file.txt
```

分页查看。

### 8.3 find

```cmd
find "error" app.log
```

忽略大小写：

```cmd
find /i "error" app.log
```

### 8.4 findstr

```cmd
findstr "error" app.log
findstr /i "error" app.log
findstr /s /n "TODO" *.txt
findstr /r "error.*500" app.log
```

常用参数：

| 参数 | 作用 |
| :--- | :--- |
| `/i` | 忽略大小写 |
| `/s` | 递归搜索 |
| `/n` | 显示行号 |
| `/r` | 使用正则 |
| `/c:"text"` | 精确搜索包含空格的字符串 |

搜索带空格：

```cmd
findstr /c:"hello world" file.txt
```

## 9. 通配符

### 9.1 *

```cmd
dir *.txt
del *.log
```

匹配任意字符。

### 9.2 ?

```cmd
dir file?.txt
```

匹配一个字符。

### 9.3 注意

CMD 通配符展开规则和 Bash 不一样，很多时候由命令自身处理。

删除时尤其谨慎：

```cmd
del *.tmp
```

## 10. 环境变量

### 10.1 查看所有变量

```cmd
set
```

### 10.2 查看单个变量

```cmd
echo %PATH%
echo %USERPROFILE%
echo %TEMP%
```

### 10.3 临时设置变量

```cmd
set APP_ENV=dev
echo %APP_ENV%
```

只对当前 CMD 窗口有效。

### 10.4 删除变量

```cmd
set APP_ENV=
```

### 10.5 持久设置 setx

```cmd
setx APP_ENV dev
```

注意：

```text
setx 对新打开的终端生效，不会修改当前 CMD 会话。
```

### 10.6 常见变量

| 变量 | 说明 |
| :--- | :--- |
| `%USERPROFILE%` | 用户主目录 |
| `%TEMP%` | 临时目录 |
| `%PATH%` | 命令搜索路径 |
| `%CD%` | 当前目录 |
| `%COMPUTERNAME%` | 计算机名 |
| `%USERNAME%` | 用户名 |
| `%SystemRoot%` | Windows 目录 |

## 11. PATH 和 where

### 11.1 查看 PATH

```cmd
echo %PATH%
```

### 11.2 查找命令

```cmd
where python
where node
where git
```

### 11.3 临时添加 PATH

```cmd
set PATH=C:\Tools;%PATH%
```

### 11.4 持久添加 PATH

可以通过系统环境变量 UI 修改。

也可以用 `setx`，但要小心覆盖和长度问题。

## 12. 管道和重定向

### 12.1 管道

```cmd
dir | find "txt"
```

CMD 管道传递文本。

### 12.2 输出重定向

覆盖：

```cmd
echo hello > file.txt
```

追加：

```cmd
echo world >> file.txt
```

### 12.3 错误重定向

```cmd
command 2> error.log
```

### 12.4 标准输出和错误都重定向

```cmd
command > output.log 2>&1
```

### 12.5 丢弃输出

```cmd
command > nul 2>&1
```

## 13. 网络命令

### 13.1 ipconfig

```cmd
ipconfig
ipconfig /all
ipconfig /flushdns
ipconfig /release
ipconfig /renew
```

### 13.2 ping

```cmd
ping example.com
ping -n 4 example.com
```

### 13.3 tracert

```cmd
tracert example.com
```

### 13.4 nslookup

```cmd
nslookup example.com
```

### 13.5 netstat

```cmd
netstat -ano
netstat -ano | find "8080"
```

参数：

- `-a` 显示所有连接和监听端口
- `-n` 数字显示地址和端口
- `-o` 显示 PID

### 13.6 curl

现代 Windows 通常自带 curl：

```cmd
curl -I https://example.com
curl -L -o file.zip https://example.com/file.zip
```

## 14. 进程命令

### 14.1 tasklist

```cmd
tasklist
tasklist | find "notepad"
```

按 PID 查：

```cmd
tasklist /FI "PID eq 1234"
```

### 14.2 taskkill

按 PID：

```cmd
taskkill /PID 1234
taskkill /PID 1234 /F
```

按进程名：

```cmd
taskkill /IM notepad.exe /F
```

### 14.3 start

```cmd
start notepad
start "" "C:\Program Files\App\app.exe"
```

第一个引号参数可能被当作窗口标题，所以路径带引号时常写空标题 `""`。

## 15. 服务命令

### 15.1 sc query

```cmd
sc query
sc query wuauserv
```

### 15.2 sc start / stop

```cmd
sc start serviceName
sc stop serviceName
```

通常需要管理员权限。

### 15.3 net start / stop

```cmd
net start
net start serviceName
net stop serviceName
```

### 15.4 创建服务

```cmd
sc create MyService binPath= "C:\path\service.exe"
```

注意 `binPath=` 后面有空格，这是 `sc` 的特殊语法。

## 16. 系统信息命令

### 16.1 systeminfo

```cmd
systeminfo
```

### 16.2 hostname

```cmd
hostname
```

### 16.3 ver

```cmd
ver
```

### 16.4 whoami

```cmd
whoami
whoami /groups
whoami /priv
whoami /all
```

### 16.5 date / time

```cmd
date /t
time /t
```

## 17. 磁盘和文件系统命令

### 17.1 chkdsk

```cmd
chkdsk C:
```

修复：

```cmd
chkdsk C: /f
```

谨慎使用，可能需要重启。

### 17.2 diskpart

```cmd
diskpart
```

进入交互式磁盘管理工具。

危险操作，谨慎。

### 17.3 fsutil

```cmd
fsutil fsinfo drives
```

很多子命令需要管理员权限。

## 18. 用户和权限相关命令

### 18.1 net user

```cmd
net user
net user username
```

创建用户：

```cmd
net user alice password /add
```

### 18.2 net localgroup

```cmd
net localgroup
net localgroup Administrators
```

加入管理员组：

```cmd
net localgroup Administrators alice /add
```

### 18.3 icacls

查看权限：

```cmd
icacls file.txt
```

授权：

```cmd
icacls file.txt /grant Users:R
```

权限命令要谨慎使用。

## 19. 注册表命令

### 19.1 reg query

```cmd
reg query HKCU\Software
```

### 19.2 reg add

```cmd
reg add HKCU\Software\Demo /v Name /t REG_SZ /d Value
```

### 19.3 reg delete

```cmd
reg delete HKCU\Software\Demo /v Name
```

### 19.4 注意

注册表修改可能影响系统和软件运行，生产机器上必须谨慎。

## 20. 批处理脚本基础

### 20.1 创建 bat

`hello.bat`：

```bat
@echo off
echo Hello CMD
pause
```

### 20.2 echo

```bat
echo Hello
```

关闭命令回显：

```bat
@echo off
```

### 20.3 pause

```bat
pause
```

等待用户按键。

### 20.4 rem 注释

```bat
rem 这是注释
```

也常见：

```bat
:: 这是注释
```

## 21. 批处理变量和参数

### 21.1 set 变量

```bat
set name=Alice
echo %name%
```

### 21.2 参数

```bat
echo script: %0
echo arg1: %1
echo arg2: %2
```

### 21.3 参数数量不直接方便

CMD 批处理不如 PowerShell 处理参数强。

复杂参数建议用 PowerShell。

### 21.4 延迟变量展开

循环中变量变化可能需要：

```bat
setlocal enabledelayedexpansion

set count=0
for %%f in (*.txt) do (
  set /a count+=1
  echo !count! %%f
)
```

## 22. 批处理 if、for、goto、call

### 22.1 if

```bat
if "%1"=="" (
  echo usage: script.bat name
  exit /b 1
)
```

### 22.2 if exist

```bat
if exist file.txt (
  echo exists
)
```

### 22.3 for 遍历文件

批处理文件中：

```bat
for %%f in (*.txt) do (
  echo %%f
)
```

命令行中：

```cmd
for %f in (*.txt) do echo %f
```

### 22.4 goto

```bat
goto end

:end
echo done
```

### 22.5 call

调用另一个批处理：

```bat
call other.bat
```

## 23. 错误码和 errorlevel

### 23.1 查看错误码

```cmd
echo %ERRORLEVEL%
```

### 23.2 批处理中判断

```bat
some_command
if errorlevel 1 (
  echo command failed
  exit /b 1
)
```

注意：

```text
if errorlevel 1 表示错误码 >= 1。
```

### 23.3 exit /b

```bat
exit /b 0
exit /b 1
```

退出当前批处理并返回错误码。

## 24. 常见排查场景

### 24.1 查看端口占用

```cmd
netstat -ano | find "8080"
tasklist /FI "PID eq 1234"
```

### 24.2 杀占用端口的进程

```cmd
taskkill /PID 1234 /F
```

### 24.3 搜索文件

```cmd
dir /s /b *.log
```

### 24.4 搜索日志

```cmd
findstr /i /n "error" app.log
```

### 24.5 清理目录

先查看：

```cmd
dir C:\Temp
```

再删除：

```cmd
del /q C:\Temp\*.tmp
```

### 24.6 网络不通

```cmd
ipconfig /all
ping example.com
nslookup example.com
tracert example.com
curl -I https://example.com
```

## 25. CMD 最佳实践

1. 路径带空格时加引号。
2. 删除前先 `dir` 查看目标。
3. 复杂复制优先用 `robocopy`。
4. 批处理中用 `@echo off` 减少噪音。
5. 用 `exit /b` 返回明确错误码。
6. 复杂自动化优先用 PowerShell。
7. 管理员 CMD 只用于确实需要权限的任务。
8. 修改注册表、服务、权限前先备份或确认影响。

## 26. CMD 命令速查表

### 26.1 文件目录

```cmd
dir
dir /a
dir /s /b *.txt
cd /d D:\Projects
mkdir logs
rmdir /s /q logs
copy a.txt b.txt
xcopy src dst /e /i /y
robocopy src dst /E
move old.txt new.txt
del /q file.txt
```

### 26.2 内容搜索

```cmd
type file.txt
more file.txt
find "text" file.txt
findstr /i /n "error" app.log
```

### 26.3 环境变量

```cmd
set
echo %PATH%
set APP_ENV=dev
setx APP_ENV dev
where python
```

### 26.4 网络

```cmd
ipconfig /all
ipconfig /flushdns
ping example.com
tracert example.com
nslookup example.com
netstat -ano
curl -I https://example.com
```

### 26.5 进程服务

```cmd
tasklist
taskkill /PID 1234 /F
sc query serviceName
sc start serviceName
sc stop serviceName
net start
net stop serviceName
```

### 26.6 系统

```cmd
systeminfo
hostname
whoami /all
ver
date /t
time /t
```

## 27. 推荐参考资料

- Windows Commands Reference：https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands
- CMD：https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmd
- dir：https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/dir
- robocopy：https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy
- findstr：https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/findstr
- netstat：https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netstat
- taskkill：https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/taskkill

## 最后总结

CMD 的核心可以浓缩为：

```text
dir 看目录
cd 切路径
copy/xcopy/robocopy 复制
move 移动
del/rmdir 删除
findstr 搜索文本
set 管环境变量
ipconfig/ping/netstat 查网络
tasklist/taskkill 管进程
sc/net 管服务
.bat/.cmd 做简单自动化
```

CMD 适合传统 Windows 命令和老脚本维护。新项目自动化更推荐 PowerShell，但掌握 CMD 仍然对排查 Windows 环境、阅读老脚本和处理基础命令非常有用。

