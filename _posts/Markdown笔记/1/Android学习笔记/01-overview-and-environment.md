# 01. Android 概览与开发环境

## Android 是什么

Android 是基于 Linux 内核的移动操作系统生态，主要用于手机、平板、可穿戴设备、电视、车机和嵌入式设备。Android 应用通常使用 Kotlin 或 Java 开发，运行在 Android Runtime 上。

现代 Android 开发重点：

- Kotlin 优先。
- Jetpack Compose 声明式 UI。
- Jetpack 架构组件。
- 生命周期感知。
- 协程和 Flow。
- Material Design。
- Gradle 构建。
- 应用性能、安全和隐私。

## Android 应用基本组成

常见组件：

- Activity：承载界面和用户交互入口。
- Fragment：可复用界面片段，传统 View 项目常见。
- Service：后台任务组件。
- BroadcastReceiver：接收系统或应用广播。
- ContentProvider：跨应用共享数据。
- ViewModel：保存 UI 状态，处理界面逻辑。
- Repository：封装数据来源。

现代 Compose 项目中，界面由 Composable 函数组成，但 Activity 仍然是应用入口。

## 开发环境

推荐使用：

- Android Studio。
- Android SDK。
- Kotlin。
- Gradle。
- JDK。
- Android Emulator 或真机。

Android Studio 提供：

- 项目创建。
- 代码编辑。
- Gradle 构建。
- 模拟器。
- Logcat。
- Layout Inspector。
- Profiler。
- App Inspection。

## 创建第一个项目

新项目建议：

- Language：Kotlin。
- UI：Jetpack Compose。
- Minimum SDK：根据目标用户选择，常见选择 API 23 或更高。
- Build configuration：Kotlin DSL。

典型入口：

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App()
        }
    }
}
```

Compose 根组件：

```kotlin
@Composable
fun App() {
    MaterialTheme {
        Text(text = "Hello Android")
    }
}
```

## Android SDK 与 API Level

Android 使用 API Level 表示平台版本。开发时要关注：

- compileSdk：编译使用的 SDK 版本。
- minSdk：应用支持的最低系统版本。
- targetSdk：应用声明适配的目标系统版本。

建议：

- `compileSdk` 使用稳定最新版本。
- `targetSdk` 跟随 Google Play 要求及时升级。
- `minSdk` 根据用户设备和业务需求决定。

## 模拟器与真机

模拟器适合：

- 快速调试。
- 多系统版本测试。
- 多屏幕尺寸测试。

真机适合：

- 性能测试。
- 相机、定位、蓝牙、传感器测试。
- 厂商兼容性测试。

真实项目不能只依赖模拟器。

## Logcat

日志示例：

```kotlin
Log.d("MainActivity", "onCreate called")
```

常见级别：

- `Log.d`：调试。
- `Log.i`：信息。
- `Log.w`：警告。
- `Log.e`：错误。

生产环境要避免输出敏感信息，例如 token、手机号、身份证、定位等。

## Android 开发常见目录

```text
app/
├── build.gradle.kts
├── src/
│   ├── main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/ 或 kotlin/
│   │   └── res/
│   ├── test/
│   └── androidTest/
```

- `main`：正式代码和资源。
- `test`：本地单元测试。
- `androidTest`：运行在设备或模拟器上的测试。

## 学习本章后的检查问题

- 是否知道 Activity 是应用界面入口？
- 是否能区分 compileSdk、minSdk、targetSdk？
- 是否能创建并运行一个 Compose 项目？
- 是否知道 Logcat 和 Profiler 的基本用途？
- 是否知道模拟器和真机测试各自适合什么？

## 进一步理解：Android 应用从安装到运行

一个 Android 应用不是一个普通的 `main()` 程序。它由系统进程管理，系统根据 Manifest、Intent、权限、组件声明和用户操作来创建组件。

典型流程：

1. 用户点击图标，Launcher 发送启动 Intent。
2. 系统根据 Manifest 找到启动 Activity。
3. 应用进程不存在时，系统创建进程并初始化 Application。
4. 系统创建 Activity，调用 `onCreate()`。
5. Activity 设置 Compose 或 View 内容。
6. 用户离开、旋转屏幕、内存紧张或任务切换时，系统按生命周期回调管理组件。

理解这条链路后，很多问题会更容易定位：

- 为什么不要把大对象放在 Activity 静态字段里。
- 为什么配置变更会导致 Activity 重建。
- 为什么 UI 状态要放进 ViewModel 或可保存状态。
- 为什么后台任务不能依赖 Activity 一直存在。

## 开发环境版本建议

实际项目建议把环境版本写进项目文档，例如：

```text
Android Studio: 使用稳定版
JDK: 跟随 Android Gradle Plugin 要求
Gradle: 使用 wrapper 固定版本
Android Gradle Plugin: 使用稳定版本，升级前读 release notes
Kotlin: 与 Compose Compiler / AGP 兼容
compileSdk: 使用稳定最新 SDK
targetSdk: 跟随 Google Play 当前要求
minSdk: 根据用户设备占比和业务能力决定
```

不要只在本机全局安装 Gradle 后直接构建。真实项目应使用 `gradlew`，保证团队、CI 和本地构建一致。

## 初学者常见环境问题

| 问题 | 可能原因 | 处理思路 |
| --- | --- | --- |
| Gradle sync 失败 | 网络、版本不兼容、仓库不可达 | 先看完整错误栈，再检查 AGP、Gradle、JDK 兼容性 |
| 模拟器很慢 | 未开启虚拟化、镜像过重、内存不足 | 开启硬件虚拟化，使用合适 ABI 和较新的系统镜像 |
| 真机无法调试 | 未开开发者选项、USB 模式错误、驱动问题 | 开启 USB 调试，确认 `adb devices` 能看到设备 |
| 运行后白屏 | 首帧初始化过重、主题配置问题、崩溃后重启 | 看 Logcat、启动耗时和 Activity 主题 |
| 中文乱码 | 文件编码或终端编码不一致 | Markdown、源码、Gradle 文件统一使用 UTF-8 |

## 最小可运行项目检查

一个新项目至少应能做到：

- `./gradlew assembleDebug` 可以命令行构建。
- `./gradlew test` 可以运行本地测试。
- Debug 包能安装到模拟器。
- Logcat 中没有启动期崩溃。
- README 写明 Android Studio、JDK、AGP、Gradle 版本。

如果这些基础不稳定，不建议马上引入复杂框架。
