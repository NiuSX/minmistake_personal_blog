# Linux 指令完整学习笔记

> 适合对象：Linux 初学者、后端开发、运维、测试、DevOps、嵌入式和需要熟练使用服务器命令行的人。

Linux 指令是和 Linux 系统交互的基础。你可以用命令完成文件管理、文本查看、搜索、权限控制、进程管理、网络排查、磁盘分析、软件安装、服务管理、日志查看、压缩传输和自动化运维。

如果你只会 `ls`、`cd`、`pwd`，还不算真正掌握 Linux 指令。真正熟练使用 Linux，需要理解命令格式、标准输入输出、管道、重定向、文件权限、用户组、进程、systemd 服务、网络端口、磁盘挂载、日志和常用文本处理工具。

最后调研：2026-06-13。

说明：本文以常见 GNU/Linux 发行版为主，例如 Ubuntu、Debian、CentOS、Rocky Linux、Fedora 等。不同发行版命令和包管理工具可能不同，例如 Debian 系使用 `apt`，RHEL 系使用 `dnf` 或 `yum`。具体参数以 `man`、`--help` 和发行版文档为准。

学习目标：

- 能熟练完成文件、文本、权限、进程、网络、磁盘和服务管理。
- 能理解 stdin/stdout/stderr、管道、重定向、退出状态和 shell 展开。
- 能用 `find`、`grep`、`sed`、`awk`、`xargs` 组合处理真实日志和数据。
- 能排查端口监听、服务失败、磁盘占满、CPU/内存异常和 DNS 问题。
- 能知道哪些命令有破坏性，并在执行前做路径和权限确认。

## 目录

1. Linux 命令基本格式
2. 获取帮助
3. 目录切换和路径
4. 文件和目录管理
5. 查看文件内容
6. 搜索文件和内容
7. 文本处理
8. 管道和重定向
9. 文件权限
10. 用户和用户组
11. 进程管理
12. 后台任务和作业
13. 系统信息
14. 磁盘和文件系统
15. 压缩和归档
16. 网络命令
17. SSH 和远程传输
18. 软件包管理
19. systemd 服务管理
20. 日志查看
21. 环境变量
22. 定时任务
23. 安全和防火墙
24. 常见排查场景
25. 命令速查表
26. 参考资料与扩展阅读

## 1. Linux 命令基本格式

基本格式：

```bash
command [options] [arguments]
```

示例：

```bash
ls -lah /var/log
```

其中：

- `ls` 是命令
- `-lah` 是选项
- `/var/log` 是参数

### 1.1 短选项

```bash
ls -l
ls -a
ls -h
ls -lah
```

短选项通常可以合并。

### 1.2 长选项

```bash
ls --all
grep --ignore-case "error" app.log
```

长选项更易读，适合脚本。

### 1.3 命令返回值

Linux 命令通常遵循：

```text
0 = 成功
非 0 = 失败
```

查看上一条命令返回值：

```bash
echo $?
```

### 1.4 Shell 展开和引用

很多“命令行为奇怪”的问题，实际发生在 shell 展开阶段，而不是命令本身。

常见展开：

| 写法 | 含义 |
| :--- | :--- |
| `*.log` | 通配符展开，匹配当前目录日志文件 |
| `$HOME` | 变量展开 |
| `$(date)` | 命令替换 |
| `{a,b}` | brace expansion，展开为多个词 |
| `~` | 当前用户家目录 |

引号规则：

```bash
echo "$HOME"   # 变量会展开，保留空格
echo '$HOME'   # 原样输出
```

脚本中处理路径和变量时，默认加双引号：

```bash
rm -- "$file"
cp -- "$src" "$dst"
```

`--` 表示选项结束，可避免文件名以 `-` 开头时被当作选项。

## 2. 获取帮助

### 2.1 --help

```bash
ls --help
grep --help
```

### 2.2 man

```bash
man ls
man grep
man systemctl
```

常用按键：

- `q` 退出
- `/keyword` 搜索
- `n` 下一个匹配
- `Space` 下一页

### 2.3 info

```bash
info coreutils
info ls
```

GNU 工具有时 `info` 比 `man` 更完整。

### 2.4 type

查看命令类型：

```bash
type cd
type ls
type grep
```

### 2.5 which / command -v

查看命令路径：

```bash
which python
command -v python
```

脚本中更推荐：

```bash
command -v docker >/dev/null 2>&1
```

## 3. 目录切换和路径

### 3.1 pwd

显示当前目录：

```bash
pwd
```

### 3.2 cd

进入目录：

```bash
cd /var/log
```

返回上级：

```bash
cd ..
```

回到用户主目录：

```bash
cd
cd ~
```

回到上一次目录：

```bash
cd -
```

### 3.3 绝对路径和相对路径

绝对路径：

```bash
/home/alice/project
```

相对路径：

```bash
./project
../logs
```

### 3.4 常见目录

| 目录 | 作用 |
| :--- | :--- |
| `/` | 根目录 |
| `/home` | 普通用户主目录 |
| `/root` | root 用户主目录 |
| `/etc` | 配置文件 |
| `/var` | 可变数据，如日志 |
| `/var/log` | 日志 |
| `/tmp` | 临时文件 |
| `/usr` | 用户程序和库 |
| `/bin` | 基础命令 |
| `/sbin` | 系统管理命令 |
| `/opt` | 第三方软件 |

## 4. 文件和目录管理

### 4.1 ls

```bash
ls
ls -l
ls -a
ls -lah
ls -ltr
```

常用选项：

| 选项 | 作用 |
| :--- | :--- |
| `-l` | 长格式 |
| `-a` | 显示隐藏文件 |
| `-h` | 人类可读大小 |
| `-t` | 按时间排序 |
| `-r` | 反向排序 |

### 4.2 mkdir

创建目录：

```bash
mkdir logs
```

递归创建：

```bash
mkdir -p app/logs/2026
```

### 4.3 touch

创建空文件或更新时间：

```bash
touch app.log
```

### 4.4 cp

复制文件：

```bash
cp a.txt b.txt
```

复制目录：

```bash
cp -r dir1 dir2
```

保留属性：

```bash
cp -a source backup
```

### 4.5 mv

移动：

```bash
mv file.txt /tmp/
```

重命名：

```bash
mv old.txt new.txt
```

### 4.6 rm

删除文件：

```bash
rm file.txt
```

删除目录：

```bash
rm -r dir
```

强制删除：

```bash
rm -rf dir
```

危险命令要谨慎，尤其是变量为空时。

### 4.7 ln

硬链接：

```bash
ln file.txt hard-link.txt
```

软链接：

```bash
ln -s /opt/app/current /usr/local/bin/app
```

## 5. 查看文件内容

### 5.1 cat

```bash
cat file.txt
```

适合短文件。

### 5.2 less

```bash
less app.log
```

适合大文件。

### 5.3 head

```bash
head file.txt
head -n 20 file.txt
```

### 5.4 tail

```bash
tail file.txt
tail -n 100 app.log
tail -f app.log
```

### 5.5 more

```bash
more file.txt
```

功能比 `less` 弱。

### 5.6 wc

```bash
wc file.txt
wc -l file.txt
wc -w file.txt
wc -c file.txt
```

### 5.7 file

```bash
file app.log
file image.png
```

判断文件类型。

## 6. 搜索文件和内容

### 6.1 find

按名称：

```bash
find . -name "*.log"
```

按类型：

```bash
find . -type f
find . -type d
```

按大小：

```bash
find . -type f -size +100M
```

按时间：

```bash
find . -type f -mtime +7
```

执行命令：

```bash
find . -name "*.log" -exec wc -l {} \;
```

### 6.2 locate

```bash
locate nginx.conf
```

依赖数据库，可能需要：

```bash
sudo updatedb
```

### 6.3 grep

```bash
grep "error" app.log
grep -i "error" app.log
grep -n "error" app.log
grep -R "TODO" .
```

常用选项：

| 选项 | 作用 |
| :--- | :--- |
| `-i` | 忽略大小写 |
| `-n` | 显示行号 |
| `-R` | 递归 |
| `-v` | 反向匹配 |
| `-q` | 安静模式 |
| `-E` | 扩展正则 |

### 6.4 ripgrep rg

如果安装了 `rg`，搜索代码更快：

```bash
rg "TODO"
rg -n "function"
rg --files
```

## 7. 文本处理

### 7.1 sort

```bash
sort names.txt
sort -n numbers.txt
sort -r names.txt
```

### 7.2 uniq

```bash
sort names.txt | uniq
sort names.txt | uniq -c
```

`uniq` 通常配合 `sort`。

### 7.3 cut

```bash
cut -d: -f1 /etc/passwd
```

### 7.4 tr

```bash
echo "hello" | tr 'a-z' 'A-Z'
echo "a b c" | tr -d ' '
```

### 7.5 sed

替换：

```bash
sed 's/old/new/g' file.txt
```

打印指定行：

```bash
sed -n '1,20p' file.txt
```

原地替换：

```bash
sed -i 's/old/new/g' file.txt
```

### 7.6 awk

按列输出：

```bash
awk '{print $1}' file.txt
```

指定分隔符：

```bash
awk -F: '{print $1}' /etc/passwd
```

求和：

```bash
awk '{sum += $1} END {print sum}' numbers.txt
```

### 7.7 xargs

`xargs` 把标准输入转换成命令参数，常和 `find`、`grep` 配合：

```bash
find . -name "*.log" -print0 | xargs -0 grep -n "ERROR"
```

为什么用 `-print0` 和 `-0`：

```text
可以正确处理带空格、换行和特殊字符的文件名。
```

删除前先打印确认：

```bash
find . -name "*.tmp" -print
```

确认无误后再执行：

```bash
find . -name "*.tmp" -delete
```

### 7.8 tee

同时输出到终端和文件：

```bash
command | tee output.log
command | tee -a output.log
```

需要 sudo 写文件时：

```bash
echo "value" | sudo tee /etc/example.conf
```

## 8. 管道和重定向

### 8.1 管道

```bash
ps aux | grep nginx
```

把前一个命令输出传给后一个命令。

### 8.2 输出重定向

覆盖：

```bash
echo "hello" > file.txt
```

追加：

```bash
echo "hello" >> file.txt
```

### 8.3 错误重定向

```bash
command 2> error.log
```

### 8.4 stdout 和 stderr 都重定向

```bash
command > output.log 2>&1
```

Bash 简写：

```bash
command &> output.log
```

### 8.5 输入重定向

```bash
sort < names.txt
```

## 9. 文件权限

### 9.1 查看权限

```bash
ls -l file.txt
```

示例：

```text
-rw-r--r--
```

### 9.2 权限含义

| 权限 | 含义 |
| :--- | :--- |
| `r` | read |
| `w` | write |
| `x` | execute |

三组权限：

```text
owner group others
```

### 9.3 chmod

添加执行权限：

```bash
chmod +x script.sh
```

数字权限：

```bash
chmod 755 script.sh
chmod 644 file.txt
chmod 600 id_rsa
```

### 9.4 chown

```bash
sudo chown user:group file.txt
sudo chown -R user:group /opt/app
```

### 9.5 chgrp

```bash
chgrp developers file.txt
```

## 10. 用户和用户组

### 10.1 whoami

```bash
whoami
```

### 10.2 id

```bash
id
id username
```

### 10.3 useradd / adduser

```bash
sudo useradd -m alice
sudo passwd alice
```

Debian/Ubuntu 常用：

```bash
sudo adduser alice
```

### 10.4 usermod

加入组：

```bash
sudo usermod -aG docker alice
```

### 10.5 groups

```bash
groups
groups alice
```

## 11. 进程管理

### 11.1 ps

```bash
ps
ps aux
ps -ef
```

### 11.2 top / htop

```bash
top
htop
```

### 11.3 pgrep

```bash
pgrep nginx
pgrep -a nginx
```

### 11.4 kill

```bash
kill PID
kill -TERM PID
kill -KILL PID
```

优先用 `TERM`，少用 `KILL`。

### 11.5 pkill

```bash
pkill nginx
```

### 11.6 nice / renice

```bash
nice -n 10 command
renice 10 -p PID
```

调整进程优先级。

## 12. 后台任务和作业

### 12.1 后台运行

```bash
command &
```

### 12.2 jobs

```bash
jobs
```

### 12.3 fg / bg

```bash
fg %1
bg %1
```

### 12.4 nohup

```bash
nohup command > app.log 2>&1 &
```

退出终端后继续运行。

### 12.5 disown

```bash
disown %1
```

把作业从当前 Shell 作业表移除。

## 13. 系统信息

### 13.1 uname

```bash
uname -a
```

### 13.2 hostname

```bash
hostname
hostnamectl
```

### 13.3 uptime

```bash
uptime
```

### 13.4 date

```bash
date
date +%F
date '+%F %T'
```

### 13.5 free

```bash
free -h
```

### 13.6 lscpu

```bash
lscpu
```

### 13.7 lsblk

```bash
lsblk
```

## 14. 磁盘和文件系统

### 14.1 df

```bash
df -h
```

查看文件系统空间。

### 14.2 du

```bash
du -sh .
du -h --max-depth=1 /var
```

查看目录占用。

### 14.3 mount

```bash
mount
sudo mount /dev/sdb1 /mnt
```

### 14.4 umount

```bash
sudo umount /mnt
```

### 14.5 fdisk / parted

磁盘分区工具，危险操作。

```bash
sudo fdisk -l
```

### 14.6 blkid

```bash
sudo blkid
```

查看块设备 UUID。

## 15. 压缩和归档

### 15.1 tar

打包：

```bash
tar cf archive.tar dir/
```

解包：

```bash
tar xf archive.tar
```

gzip：

```bash
tar czf archive.tar.gz dir/
tar xzf archive.tar.gz
```

xz：

```bash
tar cJf archive.tar.xz dir/
tar xJf archive.tar.xz
```

### 15.2 gzip

```bash
gzip file.txt
gunzip file.txt.gz
```

### 15.3 zip

```bash
zip -r archive.zip dir/
unzip archive.zip
```

## 16. 网络命令

### 16.1 ip

查看地址：

```bash
ip addr
```

查看路由：

```bash
ip route
```

### 16.2 ping

```bash
ping example.com
ping -c 4 example.com
```

### 16.3 ss

查看端口：

```bash
ss -tulpen
ss -lntp
```

### 16.4 curl

```bash
curl https://example.com
curl -I https://example.com
curl -fsSL https://example.com/install.sh
```

### 16.5 wget

```bash
wget https://example.com/file.tar.gz
```

### 16.6 dig / nslookup

```bash
dig example.com
nslookup example.com
```

### 16.7 traceroute / tracepath

```bash
traceroute example.com
tracepath example.com
```

## 17. SSH 和远程传输

### 17.1 ssh

```bash
ssh user@host
ssh -p 2222 user@host
```

执行远程命令：

```bash
ssh user@host "uptime"
```

### 17.2 ssh-keygen

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### 17.3 ssh-copy-id

```bash
ssh-copy-id user@host
```

### 17.4 scp

上传：

```bash
scp file.txt user@host:/tmp/
```

下载：

```bash
scp user@host:/tmp/file.txt .
```

### 17.5 rsync

```bash
rsync -avz ./dist/ user@host:/var/www/app/
rsync -avz --delete ./dist/ user@host:/var/www/app/
```

`--delete` 谨慎使用。

安全做法是先 dry-run：

```bash
rsync -avzn --delete ./dist/ user@host:/var/www/app/
```

确认输出无误后再去掉 `-n`。

注意源路径末尾 `/` 的区别：

```bash
rsync -avz dist/ host:/app/   # 复制 dist 目录里面的内容
rsync -avz dist  host:/app/   # 复制 dist 这个目录本身
```

## 18. 软件包管理

### 18.1 Debian / Ubuntu：apt

```bash
sudo apt update
sudo apt install nginx
sudo apt remove nginx
sudo apt upgrade
sudo apt search nginx
sudo apt show nginx
```

### 18.2 RHEL / Fedora：dnf

```bash
sudo dnf install nginx
sudo dnf remove nginx
sudo dnf update
sudo dnf search nginx
sudo dnf info nginx
```

### 18.3 yum

旧 RHEL/CentOS 系常见：

```bash
sudo yum install nginx
```

### 18.4 pacman

Arch Linux：

```bash
sudo pacman -Syu
sudo pacman -S nginx
```

## 19. systemd 服务管理

### 19.1 systemctl status

```bash
systemctl status nginx
```

### 19.2 启动停止

```bash
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
```

### 19.3 开机自启

```bash
sudo systemctl enable nginx
sudo systemctl disable nginx
```

### 19.4 查看服务

```bash
systemctl list-units --type=service
systemctl list-unit-files
```

## 20. 日志查看

### 20.1 journalctl

查看系统日志：

```bash
journalctl
```

查看服务日志：

```bash
journalctl -u nginx
journalctl -u nginx -f
```

最近日志：

```bash
journalctl -u nginx --since "1 hour ago"
```

### 20.2 /var/log

```bash
ls /var/log
tail -f /var/log/syslog
tail -f /var/log/messages
```

不同发行版日志文件不同。

## 21. 环境变量

### 21.1 查看

```bash
env
printenv
printenv PATH
```

### 21.2 设置临时变量

```bash
export APP_ENV=prod
```

### 21.3 PATH

```bash
echo "$PATH"
export PATH="$HOME/bin:$PATH"
```

### 21.4 常见变量

| 变量 | 说明 |
| :--- | :--- |
| `HOME` | 用户主目录 |
| `PATH` | 命令搜索路径 |
| `USER` | 用户名 |
| `PWD` | 当前目录 |
| `SHELL` | 默认 Shell |
| `LANG` | 语言环境 |

## 22. 定时任务

### 22.1 crontab

编辑：

```bash
crontab -e
```

查看：

```bash
crontab -l
```

### 22.2 cron 格式

```text
分钟 小时 日期 月份 星期 命令
```

每天凌晨 2 点：

```cron
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```

### 22.3 systemd timer

现代 Linux 也常用 systemd timer 替代 cron，适合更复杂的服务化定时任务。

## 23. 安全和防火墙

### 23.1 ufw

Ubuntu 常见：

```bash
sudo ufw status
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw enable
```

### 23.2 firewalld

RHEL 系常见：

```bash
sudo firewall-cmd --state
sudo firewall-cmd --list-all
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --reload
```

### 23.3 sudo 日志

```bash
journalctl _COMM=sudo
```

或查看系统认证日志，路径因发行版而异。

## 24. 常见排查场景

### 24.1 端口是否监听

```bash
ss -lntp
```

### 24.2 服务为什么启动失败

```bash
systemctl status service-name
journalctl -u service-name -xe
```

### 24.3 磁盘满了

```bash
df -h
du -h --max-depth=1 /var | sort -h
```

### 24.4 CPU 高

```bash
top
ps aux --sort=-%cpu | head
```

### 24.5 内存高

```bash
free -h
ps aux --sort=-%mem | head
```

### 24.6 网络不通

```bash
ping host
curl -v URL
ip addr
ip route
ss -lntp
```

### 24.7 DNS 异常

```bash
resolvectl status
cat /etc/resolv.conf
dig example.com
dig @8.8.8.8 example.com
```

排查思路：

- 域名是否能解析。
- 使用的 DNS 服务器是否正确。
- 是本机 DNS 问题还是上游 DNS 问题。
- 应用是否使用了自己的 DNS 配置。

### 24.8 文件权限问题

```bash
ls -l file
namei -l /path/to/file
id
getfacl file
```

排查顺序：

1. 当前用户是谁。
2. 文件所有者和用户组是谁。
3. 每一级目录是否有执行权限。
4. 是否有 ACL、SELinux、AppArmor 等额外限制。

### 24.9 系统化排查流程

遇到服务器问题时，先判断问题属于哪一层：

1. 服务层：`systemctl status`、`journalctl -u`。
2. 进程层：`ps`、`top`、`pgrep`。
3. 端口层：`ss -lntp`。
4. 网络层：`ip addr`、`ip route`、`ping`、`curl -v`。
5. DNS 层：`resolvectl status`、`dig`。
6. 磁盘层：`df -h`、`du -h --max-depth=1`、`lsblk`。
7. 权限层：`ls -l`、`namei -l`、`id`。
8. 日志层：`journalctl`、`/var/log`。

### 24.10 危险命令执行前检查

对这些命令保持警惕：

```bash
rm -rf
chmod -R
chown -R
rsync --delete
mkfs
dd
iptables / nft
firewall-cmd --permanent
```

执行前至少确认：

```bash
pwd
ls -lah
echo "$target"
```

脚本中删除变量路径时，先校验变量非空：

```bash
if [ -z "$target" ]; then
  echo "target is empty"
  exit 1
fi

rm -rf -- "$target"
```

## 25. 命令速查表

### 25.1 文件目录

```bash
pwd
ls -lah
cd /path
mkdir -p dir
touch file
cp src dst
mv old new
rm file
ln -s target link
```

### 25.2 查看搜索

```bash
cat file
less file
head file
tail -f log
find . -name "*.log"
grep -R "text" .
rg "text"
find . -name "*.log" -print0 | xargs -0 grep -n "ERROR"
```

### 25.3 系统进程

```bash
ps aux
top
kill PID
systemctl status service
journalctl -u service -f
pgrep process
pkill process
```

### 25.4 网络

```bash
ip addr
ip route
ping host
ss -lntp
curl -I URL
dig domain
resolvectl status
```

### 25.5 磁盘

```bash
df -h
du -sh *
lsblk
mount
umount
du -h --max-depth=1 /var | sort -h
```

## 26. 参考资料与扩展阅读

- GNU Coreutils Manual：https://www.gnu.org/software/coreutils/manual/coreutils.html
- GNU Bash Manual：https://www.gnu.org/software/bash/manual/
- Linux man-pages：https://man7.org/linux/man-pages/
- systemd Manual：https://www.freedesktop.org/software/systemd/man/latest/
- systemd journalctl：https://www.freedesktop.org/software/systemd/man/latest/journalctl.html
- util-linux project：https://github.com/util-linux/util-linux
- iproute2 man pages：https://man7.org/linux/man-pages/man8/ip.8.html
- Debian Administrator's Handbook：https://www.debian.org/doc/manuals/debian-handbook/
- Ubuntu Server documentation：https://documentation.ubuntu.com/server/
- Red Hat Enterprise Linux docs：https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/
- Arch Wiki：https://wiki.archlinux.org/

实践检索关键词：

- `Linux ss lntp 端口监听 排查`
- `Linux journalctl systemctl 服务启动失败`
- `Linux find xargs print0 文件名空格`
- `Linux rsync delete dry-run`
- `Linux namei 权限排查`

## 最后总结

Linux 指令的核心可以浓缩为：

```text
文件目录靠 ls/cd/cp/mv/rm
内容查看靠 cat/less/head/tail
搜索靠 find/grep/rg
文本处理靠 sort/uniq/cut/sed/awk
权限靠 chmod/chown
进程靠 ps/top/kill
服务靠 systemctl/journalctl
网络靠 ip/ss/curl/ping
磁盘靠 df/du/lsblk
远程靠 ssh/scp/rsync
```

真正熟练 Linux 命令的关键是能把多个小工具通过管道组合起来，并且知道每条命令的输入、输出、退出状态和风险。
