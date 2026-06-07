# PowerShell 指令完整学习笔记

> 适合对象：Windows 用户、后端开发、测试、运维、DevOps、系统管理员，以及需要掌握现代 Windows 自动化、对象管道、脚本、服务管理、网络排查和结构化数据处理的人。

PowerShell 是 Microsoft 开发的现代命令行 Shell 和脚本语言。它不同于 CMD 的纯文本管道，PowerShell 管道传递的是对象，因此非常适合系统管理、自动化运维、批量处理、JSON/CSV/XML 数据操作、注册表管理、服务管理、远程执行和跨平台脚本。

如果你只把 PowerShell 当成能运行 `dir`、`cd`、`type` 的窗口，就没有理解它的核心。真正掌握 PowerShell，需要理解：cmdlet 命名规则、对象管道、属性筛选、别名、变量、环境变量、Provider、脚本执行策略、参数绑定、函数、模块、错误处理、远程管理、JSON/CSV 处理和管理员权限。

版本说明：Windows 系统内置 Windows PowerShell 5.1，对应 `powershell.exe`；现代 PowerShell 7.x 对应 `pwsh.exe`，跨平台且持续更新。新脚本建议优先考虑 PowerShell 7，但如果脚本要在默认 Windows 环境运行，需要注意 5.1 与 7.x 的差异。

## 目录

1. PowerShell 是什么
2. Windows PowerShell 与 PowerShell 7
3. 启动和管理员权限
4. 获取帮助
5. Cmdlet 命名规则
6. 别名 Alias
7. 文件和目录命令
8. 查看和搜索文件内容
9. 复制、移动、删除和重命名
10. 对象管道
11. Where-Object、Select-Object、Sort-Object
12. Format 命令
13. 变量和数据类型
14. 环境变量
15. 字符串和数组
16. 哈希表
17. 条件和循环
18. 函数和参数
19. 脚本文件 ps1
20. 执行策略
21. 错误处理
22. 进程管理
23. 服务管理
24. 网络命令
25. 注册表和 Provider
26. JSON、CSV、XML
27. 作业、后台任务和并行
28. 模块管理
29. 远程管理
30. 常见排查场景
31. 安全和最佳实践
32. PowerShell 命令速查表
33. 推荐参考资料

## 1. PowerShell 是什么

PowerShell 是：

- 命令行 Shell
- 脚本语言
- 自动化平台
- 对象管道工具
- 系统管理工具

它的核心特点：

```text
管道传递对象，而不是字符串。
```

示例：

```powershell
Get-Process | Where-Object CPU -gt 10 | Sort-Object CPU -Descending
```

这条命令传递的是进程对象，每个对象有：

- Name
- Id
- CPU
- Path
- StartTime

等属性。

## 2. Windows PowerShell 与 PowerShell 7

| 名称 | 命令 | 说明 |
| :--- | :--- | :--- |
| Windows PowerShell | `powershell.exe` | Windows 内置，通常是 5.1 |
| PowerShell 7+ | `pwsh.exe` | 跨平台，需单独安装 |

### 2.1 查看版本

```powershell
$PSVersionTable
```

### 2.2 选择建议

本机现代开发：

```text
优先 PowerShell 7
```

兼容默认 Windows：

```text
注意 Windows PowerShell 5.1
```

## 3. 启动和管理员权限

### 3.1 启动 PowerShell

Windows PowerShell：

```text
powershell
```

PowerShell 7：

```text
pwsh
```

### 3.2 管理员权限

右键：

```text
以管理员身份运行
```

很多命令需要管理员权限：

- 修改服务
- 修改系统目录
- 修改注册表系统区域
- 设置执行策略
- 管理防火墙

### 3.3 判断是否管理员

```powershell
([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
)
```

## 4. 获取帮助

### 4.1 Get-Help

```powershell
Get-Help Get-ChildItem
Get-Help Get-ChildItem -Examples
Get-Help Get-ChildItem -Full
```

### 4.2 更新帮助

```powershell
Update-Help
```

可能需要管理员权限。

### 4.3 Get-Command

```powershell
Get-Command Get-ChildItem
Get-Command *Process*
Get-Command -Verb Get
Get-Command -Noun Service
```

### 4.4 Get-Member

查看对象属性和方法：

```powershell
Get-Process | Get-Member
```

这是学习 PowerShell 对象管道的关键命令。

## 5. Cmdlet 命名规则

PowerShell 命令通常是：

```text
Verb-Noun
```

示例：

```powershell
Get-ChildItem
Set-Location
Copy-Item
Remove-Item
Get-Process
Stop-Service
Invoke-WebRequest
ConvertFrom-Json
```

### 5.1 常见动词

| 动词 | 含义 |
| :--- | :--- |
| `Get` | 获取 |
| `Set` | 设置 |
| `New` | 新建 |
| `Remove` | 删除 |
| `Copy` | 复制 |
| `Move` | 移动 |
| `Start` | 启动 |
| `Stop` | 停止 |
| `Restart` | 重启 |
| `Test` | 测试 |
| `Invoke` | 调用 |
| `ConvertTo` | 转换为 |
| `ConvertFrom` | 从某格式转换 |

## 6. 别名 Alias

### 6.1 常见别名

```powershell
ls
dir
cd
pwd
cat
type
rm
cp
mv
```

### 6.2 查看别名

```powershell
Get-Alias ls
Get-Alias dir
```

### 6.3 脚本中少用别名

交互中可以用：

```powershell
ls
```

脚本中推荐：

```powershell
Get-ChildItem
```

原因：

- 可读性更好
- 跨平台更可靠
- 避免别名冲突

## 7. 文件和目录命令

### 7.1 Get-Location

```powershell
Get-Location
pwd
```

### 7.2 Set-Location

```powershell
Set-Location C:\Users
Set-Location D:\Projects
cd D:\Projects
```

### 7.3 Get-ChildItem

```powershell
Get-ChildItem
Get-ChildItem -Force
Get-ChildItem -Recurse
Get-ChildItem -Filter *.log
Get-ChildItem -File
Get-ChildItem -Directory
```

### 7.4 New-Item

新建文件：

```powershell
New-Item -ItemType File -Path .\app.log
```

新建目录：

```powershell
New-Item -ItemType Directory -Path .\logs
```

### 7.5 Test-Path

```powershell
Test-Path .\app.log
Test-Path C:\Windows
```

## 8. 查看和搜索文件内容

### 8.1 Get-Content

```powershell
Get-Content .\app.log
Get-Content .\app.log -Tail 100
Get-Content .\app.log -Wait
```

### 8.2 Set-Content

覆盖写入：

```powershell
Set-Content -Path .\file.txt -Value "hello"
```

### 8.3 Add-Content

追加：

```powershell
Add-Content -Path .\file.txt -Value "world"
```

### 8.4 Select-String

```powershell
Select-String -Path .\app.log -Pattern "error"
```

递归搜索：

```powershell
Get-ChildItem -Recurse -Filter *.log | Select-String -Pattern "error"
```

显示上下文：

```powershell
Select-String -Path .\app.log -Pattern "error" -Context 2,2
```

## 9. 复制、移动、删除和重命名

### 9.1 Copy-Item

```powershell
Copy-Item .\a.txt .\b.txt
Copy-Item .\src .\backup -Recurse
```

### 9.2 Move-Item

```powershell
Move-Item .\file.txt D:\Backup\
Move-Item .\old.txt .\new.txt
```

### 9.3 Remove-Item

```powershell
Remove-Item .\file.txt
Remove-Item .\logs -Recurse
Remove-Item .\logs -Recurse -Force
```

预演：

```powershell
Remove-Item .\logs -Recurse -WhatIf
```

### 9.4 Rename-Item

```powershell
Rename-Item .\old.txt new.txt
```

### 9.5 LiteralPath

路径包含 `[`、`]` 等通配符字符时：

```powershell
Remove-Item -LiteralPath ".\file[1].txt"
```

## 10. 对象管道

CMD 管道传文本，PowerShell 管道传对象。

示例：

```powershell
Get-Process | Where-Object CPU -gt 10
```

这里 `Where-Object` 处理的是进程对象。

查看对象成员：

```powershell
Get-Process | Get-Member
```

查看属性：

```powershell
Get-Process | Select-Object Name, Id, CPU
```

## 11. Where-Object、Select-Object、Sort-Object

### 11.1 Where-Object

```powershell
Get-Process | Where-Object CPU -gt 10
```

完整写法：

```powershell
Get-Process | Where-Object { $_.CPU -gt 10 }
```

### 11.2 Select-Object

```powershell
Get-Process | Select-Object Name, Id, CPU
Get-Process | Select-Object -First 5
```

### 11.3 Sort-Object

```powershell
Get-Process | Sort-Object CPU -Descending
```

### 11.4 Measure-Object

```powershell
Get-ChildItem | Measure-Object
Get-Process | Measure-Object CPU -Sum
```

## 12. Format 命令

### 12.1 Format-Table

```powershell
Get-Process | Format-Table Name, Id, CPU
```

### 12.2 Format-List

```powershell
Get-Process -Name pwsh | Format-List *
```

### 12.3 注意

`Format-*` 用于最终显示，不要在管道中间使用。

不推荐：

```powershell
Get-Process | Format-Table | Where-Object Name -eq "pwsh"
```

因为格式化后已经不是原始对象。

## 13. 变量和数据类型

### 13.1 变量

```powershell
$name = "Alice"
$age = 18
```

### 13.2 输出变量

```powershell
Write-Output $name
"Hello $name"
```

### 13.3 类型

```powershell
[string]$name = "Alice"
[int]$age = 18
[bool]$enabled = $true
```

### 13.4 查看类型

```powershell
$name.GetType()
```

## 14. 环境变量

### 14.1 查看

```powershell
$env:PATH
$env:USERPROFILE
$env:TEMP
```

### 14.2 设置当前会话变量

```powershell
$env:APP_ENV = "dev"
```

### 14.3 查看所有环境变量

```powershell
Get-ChildItem Env:
```

### 14.4 持久环境变量

用户级：

```powershell
[Environment]::SetEnvironmentVariable("APP_ENV", "dev", "User")
```

机器级：

```powershell
[Environment]::SetEnvironmentVariable("APP_ENV", "prod", "Machine")
```

机器级通常需要管理员权限。

## 15. 字符串和数组

### 15.1 字符串插值

```powershell
$name = "Alice"
"Hello $name"
```

### 15.2 单引号不插值

```powershell
'Hello $name'
```

输出字面量。

### 15.3 数组

```powershell
$items = @("a", "b", "c")
$items[0]
```

### 15.4 遍历数组

```powershell
foreach ($item in $items) {
    $item
}
```

## 16. 哈希表

### 16.1 定义

```powershell
$user = @{
    Name = "Alice"
    Age = 18
}
```

### 16.2 访问

```powershell
$user["Name"]
$user.Name
```

### 16.3 用作参数 splatting

```powershell
$params = @{
    Path = ".\logs"
    Recurse = $true
    Force = $true
}

Remove-Item @params
```

## 17. 条件和循环

### 17.1 if

```powershell
if (Test-Path .\app.log) {
    "exists"
} else {
    "missing"
}
```

### 17.2 switch

```powershell
switch ($env:APP_ENV) {
    "dev" { "development" }
    "prod" { "production" }
    default { "unknown" }
}
```

### 17.3 foreach

```powershell
foreach ($file in Get-ChildItem *.log) {
    $file.FullName
}
```

### 17.4 for

```powershell
for ($i = 0; $i -lt 5; $i++) {
    $i
}
```

### 17.5 while

```powershell
while ($true) {
    Get-Date
    Start-Sleep -Seconds 1
}
```

## 18. 函数和参数

### 18.1 基本函数

```powershell
function Get-Greeting {
    param(
        [string]$Name
    )

    "Hello $Name"
}

Get-Greeting -Name "Alice"
```

### 18.2 必填参数

```powershell
function Remove-LogFile {
    param(
        [Parameter(Mandatory)]
        [string]$Path
    )

    Remove-Item -Path $Path
}
```

### 18.3 高级函数

```powershell
function Get-OldLog {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path,

        [int]$Days = 7
    )

    Get-ChildItem -Path $Path -Filter *.log |
        Where-Object LastWriteTime -lt (Get-Date).AddDays(-$Days)
}
```

## 19. 脚本文件 ps1

### 19.1 hello.ps1

```powershell
param(
    [string]$Name = "World"
)

Write-Output "Hello $Name"
```

运行：

```powershell
.\hello.ps1 -Name Alice
```

### 19.2 脚本路径

当前脚本目录：

```powershell
$PSScriptRoot
```

当前脚本文件：

```powershell
$PSCommandPath
```

## 20. 执行策略

### 20.1 查看

```powershell
Get-ExecutionPolicy
Get-ExecutionPolicy -List
```

### 20.2 设置当前用户

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 20.3 临时绕过

```powershell
powershell -ExecutionPolicy Bypass -File .\script.ps1
```

或 PowerShell 7：

```powershell
pwsh -ExecutionPolicy Bypass -File .\script.ps1
```

### 20.4 注意

执行策略不是安全边界。不要运行不可信脚本。

## 21. 错误处理

### 21.1 try/catch

```powershell
try {
    Remove-Item .\missing.txt -ErrorAction Stop
} catch {
    Write-Error "删除失败: $_"
}
```

### 21.2 ErrorAction

```powershell
Get-Item .\missing.txt -ErrorAction SilentlyContinue
Get-Item .\missing.txt -ErrorAction Stop
```

### 21.3 $Error

```powershell
$Error[0]
```

### 21.4 退出码

```powershell
exit 1
```

外部命令退出码：

```powershell
$LASTEXITCODE
```

## 22. 进程管理

### 22.1 Get-Process

```powershell
Get-Process
Get-Process -Name notepad
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
```

### 22.2 Start-Process

```powershell
Start-Process notepad.exe
Start-Process powershell -Verb RunAs
```

`-Verb RunAs` 以管理员方式启动。

### 22.3 Stop-Process

```powershell
Stop-Process -Id 1234
Stop-Process -Name notepad -Force
```

## 23. 服务管理

### 23.1 Get-Service

```powershell
Get-Service
Get-Service -Name wuauserv
Get-Service | Where-Object Status -eq Running
```

### 23.2 Start-Service

```powershell
Start-Service -Name wuauserv
```

### 23.3 Stop-Service

```powershell
Stop-Service -Name wuauserv
```

### 23.4 Restart-Service

```powershell
Restart-Service -Name wuauserv
```

通常需要管理员权限。

## 24. 网络命令

### 24.1 Test-Connection

```powershell
Test-Connection example.com
Test-Connection example.com -Count 4
```

### 24.2 Test-NetConnection

```powershell
Test-NetConnection example.com -Port 443
Test-NetConnection localhost -Port 8080
```

### 24.3 Invoke-WebRequest

```powershell
Invoke-WebRequest https://example.com
Invoke-WebRequest https://example.com/file.zip -OutFile file.zip
```

### 24.4 Invoke-RestMethod

```powershell
Invoke-RestMethod https://api.example.com/users
```

### 24.5 Get-NetIPAddress

```powershell
Get-NetIPAddress
```

### 24.6 Get-NetTCPConnection

```powershell
Get-NetTCPConnection
Get-NetTCPConnection -LocalPort 8080
```

## 25. 注册表和 Provider

PowerShell Provider 把不同资源暴露成类似文件系统的路径。

### 25.1 查看 Provider

```powershell
Get-PSProvider
```

### 25.2 注册表路径

```powershell
Get-ChildItem HKCU:\Software
Get-ChildItem HKLM:\Software
```

### 25.3 读取注册表属性

```powershell
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion
```

### 25.4 写注册表

```powershell
New-Item -Path HKCU:\Software\Demo -Force
New-ItemProperty -Path HKCU:\Software\Demo -Name Name -Value Value -PropertyType String
```

修改注册表前确认影响。

## 26. JSON、CSV、XML

### 26.1 JSON

```powershell
$json = Get-Content .\config.json -Raw | ConvertFrom-Json
$json.name
```

转 JSON：

```powershell
Get-Process | Select-Object -First 3 Name, Id | ConvertTo-Json
```

### 26.2 CSV

导出：

```powershell
Get-Process | Select-Object Name, Id, CPU |
    Export-Csv .\process.csv -NoTypeInformation
```

导入：

```powershell
Import-Csv .\process.csv
```

### 26.3 XML

```powershell
[xml]$xml = Get-Content .\config.xml
```

## 27. 作业、后台任务和并行

### 27.1 Start-Job

```powershell
$job = Start-Job -ScriptBlock { Get-Process }
Receive-Job $job
Remove-Job $job
```

### 27.2 ForEach-Object -Parallel

PowerShell 7 支持：

```powershell
1..5 | ForEach-Object -Parallel {
    "Item $_"
}
```

### 27.3 Start-ThreadJob

需要模块支持时可使用 ThreadJob。

## 28. 模块管理

### 28.1 查看模块

```powershell
Get-Module
Get-Module -ListAvailable
```

### 28.2 导入模块

```powershell
Import-Module ModuleName
```

### 28.3 安装模块

```powershell
Install-Module ModuleName -Scope CurrentUser
```

### 28.4 更新模块

```powershell
Update-Module ModuleName
```

## 29. 远程管理

### 29.1 Enter-PSSession

```powershell
Enter-PSSession -ComputerName server01
```

### 29.2 Invoke-Command

```powershell
Invoke-Command -ComputerName server01 -ScriptBlock {
    Get-Service
}
```

### 29.3 注意

PowerShell 远程管理涉及 WinRM、权限、认证、防火墙和安全策略，需要按企业规范配置。

## 30. 常见排查场景

### 30.1 端口占用

```powershell
Get-NetTCPConnection -LocalPort 8080
Get-Process -Id <PID>
```

### 30.2 杀进程

```powershell
Stop-Process -Id 1234 -Force
```

### 30.3 搜索文件

```powershell
Get-ChildItem -Recurse -Filter *.log
```

### 30.4 搜索日志

```powershell
Select-String -Path .\app.log -Pattern "error"
```

### 30.5 查看大文件

```powershell
Get-ChildItem -Recurse |
    Sort-Object Length -Descending |
    Select-Object -First 20 FullName, Length
```

### 30.6 查看系统信息

```powershell
Get-ComputerInfo
```

## 31. 安全和最佳实践

1. 脚本中使用完整 cmdlet，不依赖别名。
2. 删除前使用 `-WhatIf` 预演。
3. 路径可能包含特殊字符时使用 `-LiteralPath`。
4. 处理错误时使用 `-ErrorAction Stop` 配合 try/catch。
5. 不运行不可信 `.ps1`。
6. 不在脚本中明文写密码和 token。
7. 管理员权限只在必要时使用。
8. 管道中间不要使用 `Format-*`。
9. 结构化数据优先用对象、JSON、CSV，不要硬解析文本。
10. 新脚本优先考虑 PowerShell 7，但要确认运行环境。

## 32. PowerShell 命令速查表

### 32.1 帮助

```powershell
Get-Help Get-ChildItem
Get-Command *Process*
Get-Member
Update-Help
```

### 32.2 文件目录

```powershell
Get-Location
Set-Location D:\Projects
Get-ChildItem -Force
Get-ChildItem -Recurse -Filter *.log
New-Item -ItemType Directory logs
Test-Path .\app.log
Copy-Item .\src .\backup -Recurse
Move-Item .\old.txt .\new.txt
Remove-Item .\logs -Recurse -Force
Rename-Item .\old.txt new.txt
```

### 32.3 内容搜索

```powershell
Get-Content .\app.log
Get-Content .\app.log -Tail 100 -Wait
Set-Content .\file.txt "hello"
Add-Content .\file.txt "world"
Select-String -Path .\app.log -Pattern "error"
```

### 32.4 对象管道

```powershell
Get-Process | Where-Object CPU -gt 10
Get-Process | Sort-Object CPU -Descending
Get-Process | Select-Object Name, Id, CPU
Get-Process | Measure-Object CPU -Sum
```

### 32.5 进程服务

```powershell
Get-Process
Start-Process notepad
Stop-Process -Id 1234 -Force
Get-Service
Start-Service -Name serviceName
Stop-Service -Name serviceName
Restart-Service -Name serviceName
```

### 32.6 网络

```powershell
Test-Connection example.com
Test-NetConnection example.com -Port 443
Invoke-WebRequest https://example.com -OutFile file.html
Invoke-RestMethod https://api.example.com
Get-NetIPAddress
Get-NetTCPConnection -LocalPort 8080
```

### 32.7 数据格式

```powershell
ConvertFrom-Json
ConvertTo-Json
Import-Csv
Export-Csv
```

## 33. 推荐参考资料

- PowerShell Documentation：https://learn.microsoft.com/en-us/powershell/
- PowerShell 7.5 Reference：https://learn.microsoft.com/en-us/powershell/module/?view=powershell-7.5
- about_Core_Commands：https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_core_commands
- about_Pipelines：https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines
- about_Objects：https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_objects
- about_Execution_Policies：https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies
- Get-ChildItem：https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-childitem
- Select-String：https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-string

## 最后总结

PowerShell 的核心可以浓缩为：

```text
Get 获取对象
Set 修改状态
New 创建资源
Remove 删除资源
管道传对象
Where 过滤
Select 选择属性
Sort 排序
Format 最终显示
Convert 处理结构化数据
```

PowerShell 比 CMD 更适合现代自动化，因为它处理的是对象，不需要大量脆弱的文本解析。当你能解释 `Get-Process | Where-Object CPU -gt 10` 为什么比 `tasklist | find` 更强、`Format-Table` 为什么不该放在管道中间、`$env:PATH` 和普通变量的区别、`-WhatIf` 和 `-LiteralPath` 的用途时，就已经真正入门 PowerShell。
