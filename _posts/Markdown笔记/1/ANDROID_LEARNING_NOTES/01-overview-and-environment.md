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

