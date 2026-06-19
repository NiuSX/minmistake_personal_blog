# Git 学习笔记：从入门到团队协作与故障恢复

> 这份笔记面向想系统掌握 Git 的学习者。目标不是背命令，而是理解 Git 的数据模型、暂存区、分支、远程仓库、合并、变基、冲突处理、撤销恢复、标签发布、团队工作流和常见事故处理。读完后应能独立完成日常开发、多人协作、版本回退、发布管理和大部分 Git 问题排查。

---

## 1. Git 是什么

Git 是一个分布式版本控制系统。版本控制系统用于记录文件变化，让开发者可以：

- 查看历史版本。
- 对比文件差异。
- 回退错误修改。
- 多人并行开发。
- 管理分支和发布版本。
- 追踪每次修改的作者、时间和原因。

Git 最初由 Linus Torvalds 为 Linux 内核开发而创建，核心特点是速度快、分布式、分支轻量、数据完整性强。

### 1.1 集中式与分布式

集中式版本控制系统，例如 SVN，通常有一个中央服务器。开发者需要从中央服务器拉取代码并提交回中央服务器。

分布式版本控制系统，例如 Git，每个开发者本地都有完整仓库历史。即使没有网络，也可以在本地提交、查看日志、创建分支、回退版本。

区别：

| 对比项 | 集中式 | 分布式 Git |
| --- | --- | --- |
| 历史记录 | 主要在服务器 | 每个本地仓库都有完整历史 |
| 离线提交 | 通常不支持 | 支持 |
| 分支 | 相对重 | 非常轻量 |
| 协作方式 | 依赖中心服务器 | 可多远程协作 |
| 容灾能力 | 中央服务器更关键 | 任意完整仓库都可恢复 |

GitHub、GitLab、Gitee、Bitbucket 等平台不是 Git 本身，而是基于 Git 提供远程托管、代码评审、Issue、CI/CD、权限管理等能力的平台。

---

## 2. Git 的核心思想

### 2.1 Git 记录的是快照

很多人以为 Git 记录的是每个文件每次修改的差异。实际上，Git 更像是在每次提交时保存项目文件树的快照。

如果某个文件没有变化，Git 不会重复保存完整内容，而是复用之前的对象。这样既保留了快照模型，又节省空间。

可以把一次提交理解为：

```text
commit = 指向某一时刻项目完整文件树的记录
```

### 2.2 Git 的三个区域

理解 Git，必须理解三个区域：

```text
工作区 Working Tree
暂存区 Staging Area / Index
本地仓库 Local Repository
```

#### 工作区

你能直接看到和编辑的项目目录。比如 VS Code、IDEA 中打开的文件，就是工作区文件。

#### 暂存区

暂存区是下一次提交的准备区。执行 `git add` 后，文件变化会进入暂存区。

#### 本地仓库

执行 `git commit` 后，暂存区内容会变成本地仓库中的一个提交。

基本流程：

```text
修改文件 -> git add -> git commit
工作区 -> 暂存区 -> 本地仓库
```

### 2.3 为什么需要暂存区

暂存区的意义是精确控制下一次提交包含哪些改动。

例如你同时改了三个文件：

- `login.js`: 修复登录 bug
- `style.css`: 调整样式
- `README.md`: 修改文档

如果这三个改动属于不同目的，可以只暂存其中一个或部分文件，形成清晰的提交历史。

```bash
git add login.js
git commit -m "fix login token validation"

git add style.css
git commit -m "adjust login form spacing"

git add README.md
git commit -m "update setup documentation"
```

好的提交应该围绕一个明确目的，而不是把无关改动混在一起。

---

## 3. 安装与基础配置

### 3.1 查看 Git 版本

```bash
git --version
```

### 3.2 配置用户名和邮箱

用户名和邮箱会写入提交记录。

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

查看配置：

```bash
git config --global --list
```

查看所有配置来源：

```bash
git config --list --show-origin
```

### 3.3 配置默认分支名

现代项目常用 `main` 作为默认分支。

```bash
git config --global init.defaultBranch main
```

### 3.4 配置编辑器

例如配置 VS Code：

```bash
git config --global core.editor "code --wait"
```

配置 Vim：

```bash
git config --global core.editor "vim"
```

### 3.5 配置换行符

不同系统的换行符：

- Windows: CRLF
- Linux/macOS: LF

常见配置：

Windows：

```bash
git config --global core.autocrlf true
```

Linux/macOS：

```bash
git config --global core.autocrlf input
```

更推荐在项目中使用 `.gitattributes` 统一规则。

---

## 4. 创建仓库

### 4.1 初始化本地仓库

在项目目录下执行：

```bash
git init
```

执行后会生成 `.git` 目录。`.git` 是 Git 仓库的核心数据目录，里面保存提交历史、分支引用、对象数据库、配置等。

不要随意删除 `.git`，否则这个目录就不再是 Git 仓库。

### 4.2 克隆远程仓库

```bash
git clone https://github.com/user/repo.git
```

指定目录名：

```bash
git clone https://github.com/user/repo.git my-project
```

克隆指定分支：

```bash
git clone -b dev https://github.com/user/repo.git
```

浅克隆：

```bash
git clone --depth 1 https://github.com/user/repo.git
```

浅克隆只获取最近历史，适合 CI 或只需要最新代码的场景。但如果后续需要完整历史，可能需要：

```bash
git fetch --unshallow
```

---

## 5. 查看状态与文件变化

### 5.1 查看工作区状态

```bash
git status
```

简洁状态：

```bash
git status -sb
```

常见状态：

| 状态 | 含义 |
| --- | --- |
| Untracked files | 未跟踪文件，Git 还没有管理 |
| Changes not staged | 已修改但未暂存 |
| Changes to be committed | 已暂存，等待提交 |
| nothing to commit | 没有需要提交的变化 |

### 5.2 查看未暂存差异

```bash
git diff
```

表示工作区相对暂存区的差异。

### 5.3 查看已暂存差异

```bash
git diff --staged
```

也可以使用：

```bash
git diff --cached
```

### 5.4 查看某个文件差异

```bash
git diff src/main/java/UserService.java
```

### 5.5 查看两个提交之间差异

```bash
git diff commitA commitB
```

查看某个文件在两个提交之间的差异：

```bash
git diff commitA commitB -- path/to/file
```

---

## 6. 添加与提交

### 6.1 添加文件到暂存区

添加指定文件：

```bash
git add README.md
```

添加当前目录所有变化：

```bash
git add .
```

添加所有已跟踪文件的修改和删除：

```bash
git add -u
```

交互式添加：

```bash
git add -p
```

`git add -p` 可以逐块选择是否暂存，非常适合把一个文件中的多个逻辑改动拆成多个提交。

### 6.2 提交

```bash
git commit -m "add user login api"
```

如果不写 `-m`，Git 会打开编辑器，让你输入多行提交信息。

### 6.3 跳过暂存直接提交已跟踪文件

```bash
git commit -am "fix typo"
```

注意：`-a` 只会自动暂存已经被 Git 跟踪的文件，不会包含新文件。

### 6.4 修改最近一次提交

如果刚提交完发现漏了文件或提交信息写错：

```bash
git add missed-file.txt
git commit --amend
```

只修改提交信息：

```bash
git commit --amend -m "new commit message"
```

注意：`--amend` 会生成新的提交 ID。如果这次提交已经推送到公共分支，修改历史可能影响他人，需谨慎。

### 6.5 什么是好的提交

好的提交应该：

- 只做一件事。
- 提交信息说明为什么改，而不仅是改了什么。
- 不混入格式化、调试代码、无关文件。
- 能通过测试或至少不破坏基本功能。

不好的提交信息：

```text
update
fix
修改代码
临时提交
```

较好的提交信息：

```text
fix login failure when token expires
add pagination to order list api
refactor payment callback validation
```

---

## 7. 查看提交历史

### 7.1 基本日志

```bash
git log
```

一行显示：

```bash
git log --oneline
```

显示图形分支：

```bash
git log --oneline --graph --decorate --all
```

### 7.2 查看最近 N 条

```bash
git log -5 --oneline
```

### 7.3 查看某个文件历史

```bash
git log -- path/to/file
```

查看文件每次修改的差异：

```bash
git log -p -- path/to/file
```

### 7.4 按作者筛选

```bash
git log --author="Alice"
```

### 7.5 按时间筛选

```bash
git log --since="2026-01-01" --until="2026-01-31"
```

### 7.6 搜索提交信息

```bash
git log --grep="login"
```

### 7.7 搜索代码内容变更

查找引入或删除某段代码的提交：

```bash
git log -S "functionName"
```

用正则搜索：

```bash
git log -G "userId\\s*="
```

### 7.8 查看某次提交详情

```bash
git show commit_id
```

只看某个文件：

```bash
git show commit_id -- path/to/file
```

---

## 8. Git 对象模型

理解对象模型能帮助你真正理解分支、提交和恢复。

Git 主要对象：

- blob: 文件内容
- tree: 目录结构
- commit: 提交对象
- tag: 标签对象

### 8.1 blob

blob 保存文件内容，不保存文件名。

如果两个不同路径的文件内容完全相同，Git 可以复用同一个 blob 对象。

### 8.2 tree

tree 保存目录结构，记录文件名、权限、子目录和对应的 blob/tree。

### 8.3 commit

commit 保存：

- 指向 tree 的引用
- 父提交
- 作者
- 提交者
- 时间
- 提交信息

提交之间通过父提交形成链条。

### 8.4 branch

分支本质上是指向某个提交的可移动指针。

例如：

```text
main -> C3
```

当你在 `main` 分支提交新版本后：

```text
main -> C4
```

分支指针向前移动。

### 8.5 HEAD

`HEAD` 表示当前所在位置。

通常情况下，`HEAD` 指向当前分支：

```text
HEAD -> main -> C4
```

如果 checkout 到某个具体提交，而不是分支，就会进入 detached HEAD 状态：

```text
HEAD -> C2
```

这种状态下也可以提交，但提交不属于任何分支，如果不创建分支保存，之后可能难以找到。

---

## 9. 分支管理

分支是 Git 的核心能力之一。Git 分支非常轻量，创建分支本质上只是创建一个指针。

### 9.1 查看分支

查看本地分支：

```bash
git branch
```

查看远程分支：

```bash
git branch -r
```

查看所有分支：

```bash
git branch -a
```

显示分支关联关系：

```bash
git branch -vv
```

### 9.2 创建分支

```bash
git branch feature/login
```

创建并切换：

```bash
git switch -c feature/login
```

老命令写法：

```bash
git checkout -b feature/login
```

推荐新手使用 `git switch` 处理分支切换，语义比 `checkout` 更清楚。

### 9.3 切换分支

```bash
git switch main
```

或：

```bash
git checkout main
```

切换分支前，工作区最好保持干净。如果有未提交修改，Git 可能拒绝切换，或者把修改带到目标分支。

### 9.4 重命名分支

重命名当前分支：

```bash
git branch -m new-name
```

重命名指定分支：

```bash
git branch -m old-name new-name
```

### 9.5 删除分支

删除已合并分支：

```bash
git branch -d feature/login
```

强制删除：

```bash
git branch -D feature/login
```

远程删除：

```bash
git push origin --delete feature/login
```

强制删除前要确认分支上的提交确实不再需要。

---

## 10. 合并 merge

合并用于把一个分支的修改整合到另一个分支。

### 10.1 基本合并

```bash
git switch main
git merge feature/login
```

意思是：把 `feature/login` 合并到当前 `main` 分支。

### 10.2 Fast-forward 合并

如果 `main` 没有新的提交，而 `feature/login` 是从 `main` 后面继续提交的，Git 可以直接把 `main` 指针移动到 `feature/login`。

```text
合并前:
main          A---B
                   \
feature/login       C---D

合并后:
main/feature  A---B---C---D
```

这叫 fast-forward。

### 10.3 非 fast-forward 合并

如果两个分支都有新提交，Git 会创建一个 merge commit。

```text
main          A---B---E
                   \   \
feature/login       C---D
```

合并后：

```text
main          A---B---E---M
                   \     /
feature/login       C---D
```

`M` 是合并提交。

### 10.4 禁止 fast-forward

```bash
git merge --no-ff feature/login
```

这样即使能快进，也会生成 merge commit。适合希望保留功能分支合并痕迹的团队。

### 10.5 中止合并

如果合并过程中遇到冲突，不想继续：

```bash
git merge --abort
```

---

## 11. 变基 rebase

`rebase` 用于把当前分支的提交“搬到”另一个基底后面。

### 11.1 基本用法

假设当前在 `feature/login`：

```bash
git rebase main
```

意思是：把当前分支从分叉点之后的提交，重新应用到 `main` 最新提交之后。

### 11.2 rebase 前后示意

变基前：

```text
main          A---B---C
               \
feature         D---E
```

执行：

```bash
git switch feature
git rebase main
```

变基后：

```text
main          A---B---C
                       \
feature                 D'---E'
```

注意：`D'`、`E'` 是新的提交，提交 ID 会变化。

### 11.3 merge 与 rebase 的区别

| 对比项 | merge | rebase |
| --- | --- | --- |
| 是否改写提交历史 | 不改写已有提交 | 会重写当前分支提交 |
| 历史形态 | 保留分叉和合并 | 更线性 |
| 是否生成合并提交 | 可能生成 | 通常不生成 |
| 适合场景 | 公共分支整合 | 本地功能分支整理 |

### 11.4 rebase 黄金规则

不要对已经被别人基于开发的公共分支随意 rebase。

原因：rebase 会改变提交 ID，别人本地的历史会和远程历史分叉，引发协作混乱。

适合 rebase 的情况：

- 自己本地的功能分支。
- 还没有推送的提交。
- 团队明确约定可以 rebase 的个人分支。

不适合 rebase 的情况：

- `main`、`master`、`develop` 等公共主干。
- 多人共同开发且已推送的共享分支。

### 11.5 中止 rebase

```bash
git rebase --abort
```

冲突解决后继续：

```bash
git add conflicted-file
git rebase --continue
```

跳过当前提交：

```bash
git rebase --skip
```

---

## 12. 冲突处理

冲突通常发生在 merge、rebase、cherry-pick、stash pop 等操作中。当 Git 无法自动判断保留哪部分内容时，就需要人工解决。

### 12.1 冲突标记

文件中会出现：

```text
<<<<<<< HEAD
当前分支内容
=======
要合入的分支内容
>>>>>>> feature/login
```

你需要编辑文件，删除冲突标记，保留正确内容。

### 12.2 处理流程

1. 查看冲突文件：

```bash
git status
```

2. 打开文件解决冲突。

3. 标记已解决：

```bash
git add path/to/file
```

4. 继续操作：

合并：

```bash
git commit
```

rebase：

```bash
git rebase --continue
```

cherry-pick：

```bash
git cherry-pick --continue
```

### 12.3 使用 ours 和 theirs

在冲突中选择当前分支版本：

```bash
git checkout --ours path/to/file
git add path/to/file
```

选择对方分支版本：

```bash
git checkout --theirs path/to/file
git add path/to/file
```

注意：在 rebase 场景下，`ours` 和 `theirs` 的直觉可能相反。rebase 时 Git 是把你的提交应用到目标基底上，因此需要先确认实际内容再选择。

### 12.4 减少冲突的习惯

- 小步提交，小范围修改。
- 经常同步主干。
- 避免多人长期修改同一个大文件。
- 自动格式化单独提交，不和业务改动混在一起。
- 删除、重命名文件时及时告知团队。
- 大功能拆小分支开发。

---

## 13. 远程仓库

### 13.1 查看远程仓库

```bash
git remote
```

显示 URL：

```bash
git remote -v
```

### 13.2 添加远程仓库

```bash
git remote add origin https://github.com/user/repo.git
```

### 13.3 修改远程地址

```bash
git remote set-url origin https://github.com/user/new-repo.git
```

### 13.4 删除远程仓库

```bash
git remote remove origin
```

### 13.5 fetch 与 pull

`git fetch` 只下载远程更新，不自动合并到当前分支：

```bash
git fetch origin
```

`git pull` 等价于 fetch 后再整合：

```bash
git pull
```

默认情况下通常相当于：

```bash
git fetch
git merge
```

也可以配置 pull 使用 rebase：

```bash
git pull --rebase
```

### 13.6 push

推送当前分支：

```bash
git push
```

首次推送并建立上游关系：

```bash
git push -u origin feature/login
```

之后直接：

```bash
git push
```

### 13.7 upstream 是什么

upstream 表示本地分支跟踪的远程分支。

查看：

```bash
git branch -vv
```

设置：

```bash
git branch --set-upstream-to=origin/main main
```

取消：

```bash
git branch --unset-upstream
```

---

## 14. SSH 与 HTTPS 认证

### 14.1 HTTPS

HTTPS 地址示例：

```text
https://github.com/user/repo.git
```

现代代码托管平台通常不再允许用账号密码直接推送，而是使用 token。

优点：

- 配置简单。
- 防火墙环境通常更友好。

缺点：

- token 管理麻烦。
- 多账号切换时容易混乱。

### 14.2 SSH

SSH 地址示例：

```text
git@github.com:user/repo.git
```

生成 SSH key：

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

查看公钥：

```bash
cat ~/.ssh/id_ed25519.pub
```

把公钥添加到 GitHub/GitLab/Gitee 的 SSH Keys 中。

测试：

```bash
ssh -T git@github.com
```

### 14.3 多账号 SSH 配置

编辑 `~/.ssh/config`：

```text
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
```

使用：

```bash
git clone git@github-work:company/repo.git
```

---

## 15. 撤销、回退与恢复

这是 Git 中最容易误用的部分。要先确认你想撤销的是哪个区域：

- 工作区
- 暂存区
- 本地提交
- 远程提交

### 15.1 撤销工作区修改

丢弃某个文件的未暂存修改：

```bash
git restore path/to/file
```

旧命令：

```bash
git checkout -- path/to/file
```

注意：这会丢失工作区修改，执行前要确认不需要。

### 15.2 取消暂存

文件已经 `git add`，想从暂存区移回工作区：

```bash
git restore --staged path/to/file
```

旧命令：

```bash
git reset HEAD path/to/file
```

### 15.3 回退最近一次提交但保留修改

撤销 commit，保留改动在暂存区：

```bash
git reset --soft HEAD~1
```

撤销 commit，保留改动在工作区：

```bash
git reset --mixed HEAD~1
```

`--mixed` 是默认模式：

```bash
git reset HEAD~1
```

### 15.4 回退并丢弃修改

```bash
git reset --hard HEAD~1
```

这会丢弃最近一次提交和对应工作区修改。危险操作，执行前确认是否有备份。

### 15.5 reset 三种模式

| 模式 | 移动 HEAD | 改暂存区 | 改工作区 |
| --- | --- | --- | --- |
| `--soft` | 是 | 否 | 否 |
| `--mixed` | 是 | 是 | 否 |
| `--hard` | 是 | 是 | 是 |

理解方式：

- `--soft`: 只撤销提交。
- `--mixed`: 撤销提交和暂存。
- `--hard`: 撤销提交、暂存和工作区。

### 15.6 revert

`revert` 用一个新的提交来反向撤销某次提交：

```bash
git revert commit_id
```

适合撤销已经推送到公共分支的提交，因为它不改写历史。

### 15.7 reset 与 revert 区别

| 对比项 | reset | revert |
| --- | --- | --- |
| 是否改写历史 | 是 | 否 |
| 是否生成新提交 | 通常不生成 | 生成 |
| 适合场景 | 本地未共享提交 | 公共分支撤销 |
| 危险程度 | 较高 | 较低 |

### 15.8 reflog 恢复误操作

`reflog` 记录 HEAD 和分支指针移动历史。

查看：

```bash
git reflog
```

如果误执行了 reset，可以找到之前的提交：

```bash
git reset --hard commit_id
```

只要对象还没有被 Git 垃圾回收，很多误操作都可以通过 reflog 找回。

---

## 16. stash 临时保存

stash 用于临时保存当前工作区修改，让工作区恢复干净。

### 16.1 保存修改

```bash
git stash
```

带说明：

```bash
git stash push -m "work in progress on login"
```

包含未跟踪文件：

```bash
git stash -u
```

### 16.2 查看 stash

```bash
git stash list
```

### 16.3 应用 stash

应用最近一条但保留 stash：

```bash
git stash apply
```

应用并删除最近一条：

```bash
git stash pop
```

应用指定 stash：

```bash
git stash apply stash@{1}
```

### 16.4 删除 stash

删除指定：

```bash
git stash drop stash@{1}
```

清空所有：

```bash
git stash clear
```

### 16.5 stash 使用建议

stash 适合短期临时切换，不适合长期保存工作。长期未完成工作建议创建临时分支提交。

```bash
git switch -c wip/login-refactor
git add .
git commit -m "wip login refactor"
```

---

## 17. cherry-pick

`cherry-pick` 用于把某个提交复制到当前分支。

### 17.1 基本用法

```bash
git cherry-pick commit_id
```

场景：某个 bug 修复提交在 `develop` 分支上，现在需要同步到 `release` 分支。

```bash
git switch release
git cherry-pick abc1234
```

### 17.2 cherry-pick 多个提交

```bash
git cherry-pick commit1 commit2 commit3
```

连续区间：

```bash
git cherry-pick A^..B
```

### 17.3 冲突处理

解决冲突后：

```bash
git add path/to/file
git cherry-pick --continue
```

中止：

```bash
git cherry-pick --abort
```

跳过：

```bash
git cherry-pick --skip
```

### 17.4 注意事项

cherry-pick 会创建新的提交，提交 ID 不同。如果频繁在多个分支间 cherry-pick，可能说明分支策略或发布流程需要调整。

---

## 18. tag 标签与版本发布

标签用于给某个提交打上稳定名称，常用于版本发布。

### 18.1 查看标签

```bash
git tag
```

按模式查看：

```bash
git tag -l "v1.*"
```

### 18.2 创建轻量标签

```bash
git tag v1.0.0
```

轻量标签只是一个指向提交的引用。

### 18.3 创建附注标签

```bash
git tag -a v1.0.0 -m "release version 1.0.0"
```

附注标签包含标签作者、时间、说明等元数据。正式发布建议使用附注标签。

### 18.4 推送标签

推送单个标签：

```bash
git push origin v1.0.0
```

推送所有标签：

```bash
git push origin --tags
```

### 18.5 删除标签

删除本地：

```bash
git tag -d v1.0.0
```

删除远程：

```bash
git push origin --delete v1.0.0
```

### 18.6 checkout 标签

```bash
git checkout v1.0.0
```

这会进入 detached HEAD。如果需要基于标签修复：

```bash
git switch -c hotfix/v1.0.1 v1.0.0
```

---

## 19. .gitignore

`.gitignore` 用于忽略不应该进入版本库的文件。

### 19.1 常见忽略内容

```gitignore
# dependencies
node_modules/

# build outputs
dist/
target/
build/

# logs
*.log

# IDE
../../../../.idea/
.vscode/

# OS
.DS_Store
Thumbs.db

# env
.env
.env.local
```

### 19.2 已经被跟踪的文件不会自动忽略

如果文件已经被 Git 跟踪，后来加入 `.gitignore` 不会生效。需要从索引中移除：

```bash
git rm --cached file.txt
```

目录：

```bash
git rm -r --cached target/
```

这只是不再跟踪，不会删除本地文件。

### 19.3 检查忽略规则

```bash
git check-ignore -v path/to/file
```

可以看到是哪条规则忽略了该文件。

---

## 20. .gitattributes

`.gitattributes` 用于指定路径级别的 Git 属性，例如换行符、diff 策略、合并策略、Git LFS。

### 20.1 统一换行符

```gitattributes
* text=auto
*.sh text eol=lf
*.bat text eol=crlf
*.cmd text eol=crlf
```

### 20.2 标记二进制文件

```gitattributes
*.png binary
*.jpg binary
*.pdf binary
```

### 20.3 避免无意义 diff

```gitattributes
*.lock -diff
```

### 20.4 与 .gitignore 的区别

| 文件 | 作用 |
| --- | --- |
| `.gitignore` | 控制哪些未跟踪文件不被 Git 关注 |
| `.gitattributes` | 控制 Git 如何处理已跟踪文件 |

---

## 21. Git LFS

Git 不适合直接管理很大的二进制文件，例如视频、模型文件、大型设计资源。Git LFS 用指针文件替代大文件内容，把真实文件存储在 LFS 服务中。

### 21.1 安装与初始化

```bash
git lfs install
```

### 21.2 跟踪大文件类型

```bash
git lfs track "*.psd"
git lfs track "*.zip"
```

会生成或修改 `.gitattributes`。

提交：

```bash
git add .gitattributes
git add assets/design.psd
git commit -m "add design asset with lfs"
```

### 21.3 查看 LFS 文件

```bash
git lfs ls-files
```

### 21.4 注意事项

- 使用前确认远程平台支持 LFS。
- LFS 通常有容量和流量限制。
- 不要把已经提交到 Git 历史的大文件简单加入 LFS，历史中的大文件仍然存在，需要额外清理历史。

---

## 22. 子模块 submodule

submodule 用于在一个仓库中引用另一个 Git 仓库。

### 22.1 添加子模块

```bash
git submodule add https://github.com/user/lib.git libs/lib
```

提交后，主仓库记录的是子模块仓库的某个提交 ID，而不是完整内容。

### 22.2 克隆带子模块的仓库

```bash
git clone --recursive https://github.com/user/project.git
```

如果已经克隆：

```bash
git submodule update --init --recursive
```

### 22.3 更新子模块

进入子模块目录：

```bash
cd libs/lib
git pull
```

回到主仓库提交子模块指针变化：

```bash
cd ../..
git add libs/lib
git commit -m "update lib submodule"
```

### 22.4 子模块的缺点

- 学习成本高。
- 容易忘记初始化或更新。
- 主仓库记录的是提交指针，协作时容易混乱。
- 对 CI 配置有额外要求。

很多团队会优先考虑包管理器、monorepo 或 subtree，而不是 submodule。

---

## 23. 工作流

Git 命令只是工具，团队协作更重要的是工作流。

### 23.1 集中式工作流

所有人都在一个主分支上开发。

优点：

- 简单。
- 学习成本低。

缺点：

- 容易互相影响。
- 主分支不稳定。
- 不适合多人复杂项目。

适合小团队、脚本项目或学习项目。

### 23.2 Feature Branch 工作流

每个需求创建一个功能分支。

流程：

```bash
git switch main
git pull
git switch -c feature/order-list
# 开发
git add .
git commit -m "add order list api"
git push -u origin feature/order-list
```

然后提交 Pull Request 或 Merge Request，评审通过后合并到主分支。

优点：

- 主分支更稳定。
- 便于代码评审。
- 每个需求边界清晰。

### 23.3 Git Flow

经典分支：

- `main`: 生产版本
- `develop`: 开发集成分支
- `feature/*`: 功能分支
- `release/*`: 发布分支
- `hotfix/*`: 紧急修复分支

适合有明确版本发布周期的软件。

缺点：

- 分支多，流程重。
- 对持续部署项目可能过于复杂。

### 23.4 GitHub Flow

核心规则：

1. `main` 始终可部署。
2. 新需求从 `main` 拉分支。
3. 提交 PR。
4. 自动测试和代码评审。
5. 合并到 `main` 后部署。

适合 Web 服务、SaaS、持续交付项目。

### 23.5 Trunk Based Development

主干开发强调小步提交、短生命周期分支、频繁集成。

特点：

- 分支存在时间短。
- 使用 feature flag 控制未完成功能。
- 自动化测试要求高。
- 主干始终保持可发布。

适合工程能力较成熟、CI/CD 完善的团队。

---

## 24. Pull Request / Merge Request

PR/MR 是现代团队协作的重要机制。

### 24.1 PR 的作用

- 代码评审。
- 自动测试。
- 讨论设计和实现。
- 记录变更背景。
- 控制合并权限。

### 24.2 一个好的 PR

应该包含：

- 清晰标题。
- 背景说明。
- 主要改动。
- 测试方式。
- 风险点。
- 相关 Issue。

示例：

```text
Title: Add order list pagination

Summary:
- Add page and pageSize query parameters
- Return total count and paged order list
- Add service tests for empty result and normal result

Test:
- mvn test
- Manual test GET /orders?page=1&pageSize=20
```

### 24.3 代码评审关注点

- 是否满足需求。
- 是否有明显 bug。
- 是否破坏兼容性。
- 是否有安全风险。
- 是否有必要测试。
- 命名是否清晰。
- 错误处理是否完整。
- 日志是否合适。

代码评审不是挑语法细节，而是降低合并风险。

---

## 25. 交互式 rebase 整理提交

交互式 rebase 用于整理本地提交历史。

### 25.1 启动

整理最近 3 个提交：

```bash
git rebase -i HEAD~3
```

会打开编辑器：

```text
pick a1b2c3 add login api
pick b2c3d4 fix typo
pick c3d4e5 add login test
```

### 25.2 常用操作

| 命令 | 作用 |
| --- | --- |
| `pick` | 保留提交 |
| `reword` | 修改提交信息 |
| `edit` | 停下来修改提交 |
| `squash` | 合并到前一个提交，并合并提交信息 |
| `fixup` | 合并到前一个提交，丢弃当前提交信息 |
| `drop` | 删除提交 |

### 25.3 合并提交示例

```text
pick a1b2c3 add login api
fixup b2c3d4 fix typo
pick c3d4e5 add login test
```

这样 `fix typo` 会被合并到 `add login api`。

### 25.4 注意事项

交互式 rebase 会改写历史。适合整理未共享或个人分支提交，不要随意整理公共分支历史。

---

## 26. bisect 定位问题提交

`git bisect` 用二分法定位引入 bug 的提交。

### 26.1 基本流程

启动：

```bash
git bisect start
```

标记当前版本有问题：

```bash
git bisect bad
```

标记某个旧版本正常：

```bash
git bisect good v1.0.0
```

Git 会切换到中间提交。你运行测试或手动验证，然后标记：

```bash
git bisect good
```

或：

```bash
git bisect bad
```

最终 Git 会找到第一个坏提交。

结束：

```bash
git bisect reset
```

### 26.2 自动化 bisect

如果有测试脚本：

```bash
git bisect run npm test
```

或：

```bash
git bisect run mvn test
```

测试返回码为 0 表示 good，非 0 表示 bad。

---

## 27. blame 追踪代码来源

`git blame` 用于查看每一行最后由哪个提交修改。

```bash
git blame path/to/file
```

查看指定行范围：

```bash
git blame -L 20,80 path/to/file
```

`blame` 的目的不是追责，而是找到上下文。看到提交 ID 后，可以：

```bash
git show commit_id
```

查看当时为什么这样改。

---

## 28. clean 清理未跟踪文件

`git clean` 用于删除未跟踪文件。

预览：

```bash
git clean -n
```

删除未跟踪文件：

```bash
git clean -f
```

删除未跟踪目录：

```bash
git clean -fd
```

删除被忽略文件：

```bash
git clean -fdx
```

`git clean -fdx` 很危险，会删除如 `node_modules`、构建产物、本地临时文件等所有未跟踪和被忽略文件。执行前先用 `-n` 预览。

---

## 29. worktree 多工作区

`git worktree` 允许一个仓库同时检出多个分支到不同目录。

### 29.1 创建 worktree

```bash
git worktree add ../project-hotfix hotfix/login
```

这样你可以在当前目录继续开发功能，同时在另一个目录处理 hotfix。

### 29.2 查看 worktree

```bash
git worktree list
```

### 29.3 删除 worktree

先删除目录，再清理记录：

```bash
git worktree prune
```

或：

```bash
git worktree remove ../project-hotfix
```

worktree 适合频繁在多个分支间切换的大型项目，比 stash 来回切换更稳定。

---

## 30. sparse checkout 稀疏检出

大型仓库中，如果只需要部分目录，可以使用 sparse checkout。

### 30.1 启用

```bash
git sparse-checkout init --cone
```

指定目录：

```bash
git sparse-checkout set apps/web packages/ui
```

### 30.2 查看当前规则

```bash
git sparse-checkout list
```

### 30.3 关闭

```bash
git sparse-checkout disable
```

适合 monorepo 或超大仓库，但对新手和工具链有一定复杂度。

---

## 31. 常用别名

可以通过 alias 提升效率。

```bash
git config --global alias.st "status -sb"
git config --global alias.co "checkout"
git config --global alias.sw "switch"
git config --global alias.br "branch"
git config --global alias.cm "commit"
git config --global alias.lg "log --oneline --graph --decorate --all"
```

使用：

```bash
git st
git lg
```

别名适合个人习惯，但团队文档中最好使用完整命令，避免读者不理解。

---

## 32. 常见协作场景

### 32.1 开始一个新需求

```bash
git switch main
git pull --rebase
git switch -c feature/user-profile
```

开发后：

```bash
git status -sb
git diff
git add .
git commit -m "add user profile endpoint"
git push -u origin feature/user-profile
```

然后创建 PR/MR。

### 32.2 同步主分支更新到功能分支

方式一：merge

```bash
git switch feature/user-profile
git fetch origin
git merge origin/main
```

方式二：rebase

```bash
git switch feature/user-profile
git fetch origin
git rebase origin/main
```

团队如果偏好线性历史，常用 rebase。团队如果偏好完整保留合并历史，常用 merge。

### 32.3 修复线上 bug

```bash
git switch main
git pull
git switch -c hotfix/login-timeout
# 修改并测试
git add .
git commit -m "fix login timeout handling"
git push -u origin hotfix/login-timeout
```

合并后打标签：

```bash
git tag -a v1.0.1 -m "release v1.0.1"
git push origin v1.0.1
```

### 32.4 把错误提交从当前分支移走

如果还没推送：

```bash
git reset --soft HEAD~1
git switch -c correct-branch
git commit -m "correct message"
```

如果已经推送到公共分支，优先使用：

```bash
git revert commit_id
```

### 32.5 本地落后远程，push 被拒绝

错误常见形式：

```text
rejected non-fast-forward
```

处理：

```bash
git pull --rebase
git push
```

如果有冲突，解决后：

```bash
git add conflicted-file
git rebase --continue
git push
```

不要不理解原因就直接强推。

---

## 33. 强制推送

强制推送会覆盖远程分支历史，风险较高。

### 33.1 普通强推

```bash
git push --force
```

### 33.2 更安全的强推

```bash
git push --force-with-lease
```

`--force-with-lease` 会检查远程分支是否被别人更新。如果别人已经推送了新提交，它会拒绝覆盖。

### 33.3 什么时候可以强推

通常只适合：

- 自己的个人功能分支。
- 团队明确允许 rebase 后强推的分支。
- 修正 PR 分支历史。

不应该强推：

- `main`
- `master`
- `develop`
- release 分支
- 多人共享分支

---

## 34. Git 配置层级

Git 配置有多个层级：

| 层级 | 命令 | 作用范围 |
| --- | --- | --- |
| system | `--system` | 系统所有用户 |
| global | `--global` | 当前用户所有仓库 |
| local | `--local` | 当前仓库 |
| worktree | `--worktree` | 当前工作区 |

查看当前仓库配置：

```bash
git config --local --list
```

设置当前仓库用户名：

```bash
git config user.name "Work Name"
git config user.email "work@example.com"
```

这对同时维护公司和个人项目很有用。

---

## 35. 忽略文件权限变化

有时 Windows、Linux、macOS 间协作会出现文件权限变化。

查看：

```bash
git diff
```

如果只看到 mode 改变：

```text
old mode 100644
new mode 100755
```

可以在当前仓库忽略文件模式变化：

```bash
git config core.filemode false
```

但脚本文件的可执行权限在 Linux 环境可能很重要，不要盲目忽略。

---

## 36. 换行符问题

换行符问题常表现为：

- 明明没改文件，Git 显示大量改动。
- Windows 和 Linux 同事互相提交后 diff 很乱。
- shell 脚本在 Linux 执行失败。

推荐方案：

1. 使用 `.gitattributes` 统一换行符。
2. 编辑器配置保存格式。
3. 避免全仓库无意义格式化。

示例：

```gitattributes
* text=auto
*.java text eol=lf
*.js text eol=lf
*.css text eol=lf
*.sh text eol=lf
*.bat text eol=crlf
```

重新规范化：

```bash
git add --renormalize .
git commit -m "normalize line endings"
```

这种提交最好单独进行，不要和业务修改混在一起。

---

## 37. 大文件误提交处理

如果大文件只是在最近一次提交，还没推送：

```bash
git rm --cached large-file.zip
echo "large-file.zip" >> .gitignore
git add .gitignore
git commit --amend
```

如果大文件已经进入较早历史，需要清理历史。推荐使用 `git filter-repo`，比老旧的 `filter-branch` 更可靠。

示例：

```bash
git filter-repo --path large-file.zip --invert-paths
```

清理历史会重写提交 ID。若仓库已共享，必须和团队协调，并要求所有协作者重新同步。

---

## 38. 敏感信息误提交

例如提交了：

- 密码
- token
- 私钥
- 数据库连接串
- 云服务密钥

处理原则：

1. 立即吊销或轮换泄露密钥。
2. 从当前代码中删除。
3. 清理 Git 历史。
4. 强制推送前通知团队。
5. 检查 CI/CD、部署环境和日志中是否也泄露。

重要：仅仅删除文件并提交新版本不够，因为敏感信息仍然存在历史记录中。

可以使用：

```bash
git filter-repo --path secrets.env --invert-paths
```

或者按文本替换清理敏感内容。

历史清理后：

```bash
git push --force-with-lease --all
git push --force-with-lease --tags
```

这类操作风险高，团队仓库应由负责人统一执行。

---

## 39. detached HEAD

detached HEAD 表示 `HEAD` 直接指向某个提交，而不是分支。

进入方式：

```bash
git checkout commit_id
```

或：

```bash
git checkout v1.0.0
```

此时可以查看代码、运行测试、临时实验。但如果在 detached HEAD 中提交，新提交没有分支引用。

保存这些提交：

```bash
git switch -c experiment-branch
```

如果已经离开，可以用：

```bash
git reflog
```

找到提交 ID 后创建分支：

```bash
git branch recovered-work commit_id
```

---

## 40. 常见错误与解决

### 40.1 Your local changes would be overwritten by checkout

原因：切换分支会覆盖当前未提交修改。

解决：

提交：

```bash
git add .
git commit -m "save current work"
```

或 stash：

```bash
git stash -u
git switch target-branch
git stash pop
```

或丢弃：

```bash
git restore path/to/file
```

### 40.2 non-fast-forward

原因：远程分支有你本地没有的提交，直接 push 会覆盖历史。

解决：

```bash
git pull --rebase
git push
```

### 40.3 merge conflict

原因：多个分支修改了同一位置或相关文件。

解决：

```bash
git status
# 编辑冲突文件
git add conflicted-file
git commit
```

rebase 场景：

```bash
git rebase --continue
```

### 40.4 fatal: not a git repository

原因：当前目录不是 Git 仓库，或 `.git` 丢失。

解决：

```bash
pwd
ls -a
```

进入正确目录，或重新 clone。

### 40.5 src refspec main does not match any

常见原因：

- 本地没有 `main` 分支。
- 还没有任何提交。
- 分支名实际是 `master`。

解决：

```bash
git branch
git status
git add .
git commit -m "initial commit"
git push -u origin main
```

如果分支是 `master`：

```bash
git push -u origin master
```

### 40.6 Permission denied publickey

原因：SSH key 没配置好或远程地址不对。

排查：

```bash
ssh -T git@github.com
git remote -v
```

确认公钥已添加到平台账号，私钥路径正确。

---

## 41. 推荐日常命令清单

### 41.1 每天开始开发

```bash
git switch main
git pull --rebase
git switch -c feature/task-name
```

### 41.2 开发中检查

```bash
git status -sb
git diff
git diff --staged
```

### 41.3 提交

```bash
git add .
git commit -m "clear message"
```

### 41.4 推送

```bash
git push -u origin feature/task-name
```

### 41.5 同步主干

```bash
git fetch origin
git rebase origin/main
```

### 41.6 查看历史

```bash
git log --oneline --graph --decorate --all
```

### 41.7 临时切换

```bash
git stash -u
git switch other-branch
```

### 41.8 找回误操作

```bash
git reflog
git reset --hard commit_id
```

---

## 42. 提交信息规范

很多团队使用 Conventional Commits。

格式：

```text
type(scope): subject
```

常见 type：

| type | 含义 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档 |
| `style` | 格式调整，不影响逻辑 |
| `refactor` | 重构 |
| `test` | 测试 |
| `chore` | 构建、依赖、工具等杂项 |
| `perf` | 性能优化 |
| `ci` | CI 配置 |
| `build` | 构建系统 |

示例：

```text
feat(order): add order list pagination
fix(auth): reject expired refresh token
docs(readme): update local setup steps
test(user): add registration validation cases
```

优点：

- 历史可读。
- 便于自动生成 changelog。
- 便于判断版本升级类型。

---

## 43. GitHub/GitLab 常见概念

### 43.1 Fork

Fork 是在托管平台上复制一份仓库到自己的账号下。常用于开源协作。

流程：

1. Fork 原仓库。
2. Clone 自己的 fork。
3. 添加原仓库为 upstream。
4. 创建分支开发。
5. 推送到自己的 fork。
6. 向原仓库提交 PR。

```bash
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git rebase upstream/main
```

### 43.2 Issue

Issue 用于记录 bug、需求、任务、讨论。

### 43.3 Pull Request / Merge Request

请求把一个分支合并到另一个分支。GitHub 称 Pull Request，GitLab 称 Merge Request。

### 43.4 Protected Branch

受保护分支可以限制：

- 禁止直接 push。
- 必须 PR/MR。
- 必须代码评审。
- 必须 CI 通过。
- 禁止强推。
- 禁止删除分支。

生产项目应保护 `main`、`master`、`release/*` 等关键分支。

---

## 44. Git 与 CI/CD

CI/CD 通常基于 Git 事件触发：

- push
- pull request
- tag
- release

常见流程：

```text
push feature branch
-> run lint
-> run tests
-> build
-> create preview environment
-> code review
-> merge main
-> deploy staging/prod
```

### 44.1 tag 触发发布

例如推送 `v1.2.0` 标签后触发生产发布：

```bash
git tag -a v1.2.0 -m "release v1.2.0"
git push origin v1.2.0
```

### 44.2 提交历史对 CI 的影响

清晰的提交历史能帮助：

- 定位问题。
- 自动生成版本说明。
- 回滚指定提交。
- 判断发布范围。

因此不要把大量无意义提交直接合入主干。

---

## 45. 安全实践

### 45.1 不提交敏感信息

不要提交：

- `.env`
- 私钥
- 云服务 access key
- 数据库密码
- 生产配置
- token

使用：

- 环境变量
- 密钥管理服务
- CI/CD Secret
- 本地不提交的配置文件

### 45.2 使用签名提交

可以配置 GPG 或 SSH 签名，证明提交来源。

查看签名：

```bash
git log --show-signature
```

### 45.3 分支保护

关键分支建议：

- 禁止强推。
- 禁止删除。
- 要求 PR。
- 要求至少一人评审。
- 要求 CI 通过。

---

## 46. 学习路线

### 46.1 第一阶段：基础操作

掌握：

- `git init`
- `git clone`
- `git status`
- `git add`
- `git commit`
- `git log`
- `git diff`
- `.gitignore`

练习：

- 创建一个仓库。
- 修改多个文件。
- 分多次提交。
- 查看历史和差异。

### 46.2 第二阶段：分支协作

掌握：

- `git branch`
- `git switch`
- `git merge`
- `git rebase`
- 冲突解决
- `git push`
- `git pull`
- PR/MR

练习：

- 创建两个功能分支。
- 制造冲突并解决。
- 把功能分支合并到 main。

### 46.3 第三阶段：撤销恢复

掌握：

- `git restore`
- `git reset`
- `git revert`
- `git reflog`
- `git stash`
- `git cherry-pick`

练习：

- 撤销工作区修改。
- 撤销暂存。
- 回退本地提交。
- 用 reflog 找回误删分支。
- cherry-pick 一个修复提交。

### 46.4 第四阶段：工程协作

掌握：

- 提交规范。
- 代码评审。
- Git Flow/GitHub Flow。
- tag 发布。
- CI/CD 触发。
- 分支保护。
- 敏感信息处理。

练习：

- 模拟一次 release。
- 打 tag。
- 写 PR 描述。
- 用 Conventional Commits 写提交信息。

---

## 47. 面试常见问题

### 47.1 Git 和 SVN 的区别

Git 是分布式版本控制系统，每个本地仓库都有完整历史，支持离线提交和轻量分支。SVN 是集中式版本控制系统，历史主要在中央服务器，很多操作依赖网络和服务器。

### 47.2 Git 的暂存区有什么用

暂存区用于准备下一次提交。它允许开发者选择部分修改进入提交，从而把不同目的的改动拆成清晰的提交。

### 47.3 merge 和 rebase 的区别

merge 把两个分支合并，保留分叉历史，可能生成 merge commit。rebase 把当前分支提交重新应用到目标分支之后，使历史更线性，但会改写提交 ID。公共分支不建议随意 rebase。

### 47.4 reset 和 revert 的区别

reset 移动分支指针，可能改写历史，适合本地未共享提交。revert 生成一个反向提交，不改写历史，适合撤销已经推送到公共分支的提交。

### 47.5 git pull 和 git fetch 的区别

fetch 只拉取远程更新，不改变当前工作分支。pull 是 fetch 后再 merge 或 rebase，会把远程更新整合到当前分支。

### 47.6 如何解决冲突

先用 `git status` 查看冲突文件，打开文件删除冲突标记并保留正确内容，然后 `git add` 标记解决。merge 场景下提交合并，rebase 场景下执行 `git rebase --continue`。

### 47.7 如何找回误删的提交

使用 `git reflog` 查看 HEAD 或分支移动历史，找到误删前的提交 ID，然后用 `git branch recovered commit_id` 创建分支，或用 `git reset --hard commit_id` 回到该提交。

### 47.8 什么是 detached HEAD

detached HEAD 表示 HEAD 指向某个具体提交，而不是分支。此时提交不会被分支引用，离开后可能难以找到。可以用 `git switch -c new-branch` 创建分支保存。

### 47.9 为什么不建议强推公共分支

强推会覆盖远程历史，可能删除别人已经推送的提交，导致团队成员本地历史分叉。公共分支应通过 PR/MR、revert、正常 merge 等方式维护。

### 47.10 如何处理提交了敏感信息

先立即吊销泄露的密钥或 token，再删除代码中的敏感信息，必要时用 `git filter-repo` 清理历史，并与团队协调强制推送和重新同步。

---

## 48. Git 命令速查表

### 48.1 仓库

```bash
git init
git clone <url>
git remote -v
git remote add origin <url>
```

### 48.2 状态与差异

```bash
git status -sb
git diff
git diff --staged
git show <commit>
```

### 48.3 提交

```bash
git add <file>
git add .
git commit -m "message"
git commit --amend
```

### 48.4 分支

```bash
git branch
git branch -a
git switch <branch>
git switch -c <branch>
git branch -d <branch>
```

### 48.5 远程同步

```bash
git fetch origin
git pull
git pull --rebase
git push
git push -u origin <branch>
```

### 48.6 合并与变基

```bash
git merge <branch>
git merge --abort
git rebase <branch>
git rebase --continue
git rebase --abort
```

### 48.7 撤销恢复

```bash
git restore <file>
git restore --staged <file>
git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1
git revert <commit>
git reflog
```

### 48.8 临时保存

```bash
git stash
git stash -u
git stash list
git stash pop
```

### 48.9 标签

```bash
git tag
git tag -a v1.0.0 -m "release v1.0.0"
git push origin v1.0.0
git push origin --tags
```

---

## 49. 实战练习方案

### 49.1 练习一：基础提交

1. 创建 `git-practice` 目录。
2. 执行 `git init`。
3. 新建 `README.md`。
4. 提交第一次版本。
5. 修改 README。
6. 使用 `git diff` 查看变化。
7. 再次提交。
8. 使用 `git log --oneline` 查看历史。

### 49.2 练习二：分支与冲突

1. 从 `main` 创建 `feature/a`。
2. 修改同一文件第一行并提交。
3. 回到 `main` 修改同一行并提交。
4. 合并 `feature/a`。
5. 手动解决冲突。
6. 完成合并提交。

### 49.3 练习三：rebase

1. 创建功能分支并提交两次。
2. 回到 main 提交一次。
3. 在功能分支执行 `git rebase main`。
4. 查看提交图变化。

### 49.4 练习四：误操作恢复

1. 创建一个提交。
2. 执行 `git reset --hard HEAD~1`。
3. 使用 `git reflog` 找到丢失提交。
4. 创建恢复分支。

### 49.5 练习五：发布标签

1. 在 main 上创建稳定提交。
2. 执行 `git tag -a v1.0.0 -m "release v1.0.0"`。
3. 查看标签。
4. checkout 到标签。
5. 创建 hotfix 分支。

---

## 50. 总结

Git 的难点不在命令数量，而在模型：

- 工作区、暂存区、本地仓库决定了修改如何进入历史。
- commit 是项目快照，branch 是指向 commit 的指针。
- HEAD 表示当前位置。
- merge 保留分叉历史，rebase 重写当前分支历史。
- reset 改写历史，revert 用新提交撤销旧提交。
- reflog 是很多误操作后的救命工具。
- fetch 只拉取，pull 会整合。
- stash 适合短期临时保存，长期工作应使用分支。
- tag 是版本发布的稳定锚点。

真正熟练 Git，需要在安全边界内反复练习。建议专门创建一个练习仓库，主动制造分支、冲突、误 reset、stash、rebase、cherry-pick、tag 等场景。把这些流程练熟后，真实项目中遇到问题就不会只会复制命令，而能判断每个命令会改变工作区、暂存区、提交历史还是远程分支。

