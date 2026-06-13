# 01. Jetpack Compose 总览与环境配置

最后调研时间：2026-06-13  
主要来源：Android Developers Compose 文档、Compose BOM 文档、Kotlin Compose Compiler 文档。

## 1. Compose 是什么

Jetpack Compose 是 Android 的现代声明式 UI 工具包。传统 View 系统通常是“先创建 View，再命令式修改 View 属性”；Compose 更接近“根据当前状态描述 UI 应该长什么样”。

传统 View 思路：

```kotlin
textView.text = user.name
button.isEnabled = formValid
```

Compose 思路：

```kotlin
@Composable
fun ProfileScreen(user: User, formValid: Boolean, onSave: () -> Unit) {
    Text(user.name)
    Button(enabled = formValid, onClick = onSave) {
        Text("保存")
    }
}
```

当 `user` 或 `formValid` 变化时，Compose 重新执行受影响的 Composable，计算新的 UI 描述，并把差异应用到底层渲染结构。

## 2. Compose 的主要组成

| 模块 | 作用 | 常见依赖 |
|---|---|---|
| Compose Runtime | 管理 Composition、状态读取、重组、Effect | `androidx.compose.runtime` |
| Compose UI | 布局、绘制、输入、语义树、Modifier | `androidx.compose.ui` |
| Foundation | 基础组件、Lazy 列表、手势、滚动 | `androidx.compose.foundation` |
| Material 3 | Material Design 3 组件和主题 | `androidx.compose.material3` |
| Navigation Compose | Compose 页面导航 | `androidx.navigation:navigation-compose` |
| Lifecycle Compose | 生命周期感知状态收集 | `androidx.lifecycle:lifecycle-runtime-compose` |
| Activity Compose | 在 Activity 中启动 Compose | `androidx.activity:activity-compose` |
| UI Test | Compose 测试 API | `androidx.compose.ui:ui-test-junit4` |

## 3. 最小 Gradle 配置

新项目建议使用 Compose BOM 管理 Compose 依赖版本。BOM 的作用是统一 Compose 相关 artifact 版本，避免 `ui`、`foundation`、`material3` 等版本不一致。

`settings.gradle.kts` 中启用插件仓库：

```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
```

`build.gradle.kts` 根工程示例：

```kotlin
plugins {
    id("com.android.application") version "<agp-version>" apply false
    id("org.jetbrains.kotlin.android") version "<kotlin-version>" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "<kotlin-version>" apply false
}
```

`app/build.gradle.kts` 示例：

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.example.composeapp"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.composeapp"
        minSdk = 23
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2026.05.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.activity:activity-compose")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.lifecycle:lifecycle-runtime-compose")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose")
    implementation("androidx.navigation:navigation-compose")

    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")

    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
}
```

> 版本说明：Android Developers 的 Compose BOM 页面在 2026-06-13 查询时展示的示例 BOM 为 `2026.05.00`。实际项目应以官方 BOM 页面或 Android Studio 新建项目模板为准。

### 使用 Version Catalog 管理依赖

团队项目更推荐把版本放进 `gradle/libs.versions.toml`，避免多模块里到处散落版本号。

```toml
[versions]
agp = "8.11.0"
kotlin = "2.2.0"
composeBom = "2026.05.00"
activityCompose = "1.10.1"
lifecycle = "2.9.0"
navigation = "2.9.0"

[libraries]
androidx-compose-bom = { module = "androidx.compose:compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { module = "androidx.compose.ui:ui" }
androidx-compose-ui-tooling-preview = { module = "androidx.compose.ui:ui-tooling-preview" }
androidx-compose-ui-tooling = { module = "androidx.compose.ui:ui-tooling" }
androidx-compose-material3 = { module = "androidx.compose.material3:material3" }
androidx-compose-foundation = { module = "androidx.compose.foundation:foundation" }
androidx-activity-compose = { module = "androidx.activity:activity-compose", version.ref = "activityCompose" }
androidx-lifecycle-runtime-compose = { module = "androidx.lifecycle:lifecycle-runtime-compose", version.ref = "lifecycle" }
androidx-lifecycle-viewmodel-compose = { module = "androidx.lifecycle:lifecycle-viewmodel-compose", version.ref = "lifecycle" }
androidx-navigation-compose = { module = "androidx.navigation:navigation-compose", version.ref = "navigation" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
```

模块中使用：

```kotlin
dependencies {
    implementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(platform(libs.androidx.compose.bom))

    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.foundation)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.activity.compose)
}
```

注意：BOM 只管理 Compose 族 artifact 版本，不会管理 Activity、Lifecycle、Navigation、Kotlin、AGP、Coil、Accompanist 等版本。

## 4. Compose Compiler 与 Kotlin

Compose 代码需要编译器插件把 Composable 调用、状态跟踪、重组逻辑转成可执行代码。

重要变化：

- Kotlin 2.0 之前，Compose Compiler 与 Kotlin 版本兼容关系更敏感，需要查兼容表。
- Kotlin 2.0 及以后，Compose Compiler 已并入 Kotlin 仓库，并通过 `org.jetbrains.kotlin.plugin.compose` 配置。
- 如果项目还在 Kotlin 1.x，需要查对应 Compose Compiler 版本和 Kotlin 版本的兼容表。

推荐原则：

| 场景 | 建议 |
|---|---|
| 新项目 | 使用 Android Studio 稳定版模板，Kotlin 2.x，配置 `org.jetbrains.kotlin.plugin.compose` |
| 老项目升级 | 先升级 AGP/Kotlin，再切 Compose Compiler 插件，最后升级 Compose BOM |
| 多模块项目 | 所有包含 Composable 的模块都要启用 Compose 编译能力 |
| KMP/Compose Multiplatform | 不要把 Android Compose 配置和 Compose Multiplatform 配置混用，先看目标平台文档 |

### 常见编译错误排查

| 现象 | 可能原因 | 处理 |
|---|---|---|
| `This version of the Compose Compiler requires Kotlin...` | Kotlin 1.x 项目中 compiler 扩展版本不匹配 | 查 Compose Compiler/Kotlin 兼容表，或升级到 Kotlin 2.x 插件方式 |
| `Unresolved reference: compose` | 没有启用 Compose build feature 或没应用 compose 插件 | 检查 `buildFeatures.compose = true` 和 `org.jetbrains.kotlin.plugin.compose` |
| 预览不显示 | 缺少 `ui-tooling-preview` 或 debug tooling | 添加 preview/debug tooling，检查 Android Studio 版本 |
| 多模块部分 Composable 编译失败 | 只有 app 模块启用了 Compose | 每个含 Composable 源码的 Android 模块都要启用 |
| BOM 已配置但版本仍冲突 | 某些 Compose 依赖显式写了版本 | 使用 BOM 时 Compose artifact 通常不要再写显式版本 |

## 5. Activity 中启动 Compose

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppTheme {
                AppNavHost()
            }
        }
    }
}
```

`setContent` 会创建 Compose 根节点。通常根节点只做三件事：

1. 应用主题。
2. 注入顶层 CompositionLocal 或依赖入口。
3. 启动根导航或根页面。

不要把大量业务逻辑、网络请求、数据库访问直接写进 `setContent`。

## 6. 第一个页面

```kotlin
@Composable
fun CounterScreen() {
    var count by rememberSaveable { mutableIntStateOf(0) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "Count: $count", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))
        Button(onClick = { count++ }) {
            Text("增加")
        }
    }
}
```

这里包含几个 Compose 基础点：

- `@Composable`：表示这个函数参与 Compose UI 构建。
- `rememberSaveable`：在重组和可保存状态恢复中保留值。
- `mutableIntStateOf`：适合 `Int` 的 Snapshot State，避免装箱开销。
- `Modifier`：描述布局、绘制、输入、语义等附加行为。
- `MaterialTheme`：从主题中读取字体、颜色、形状。

## 7. Compose 适合什么、不适合什么

适合：

- 新 Android 页面和新项目。
- 需要大量动态状态、主题、动画、响应式布局的 UI。
- 想减少 XML/ViewBinding/Adapter 样板代码的项目。
- 与 ViewModel、Flow、Room、DataStore、Navigation 等 Jetpack 组件配合。

需要谨慎：

- 已有大量稳定复杂 View 页面，短期没有重构收益。
- 强依赖第三方 View SDK 的页面，例如地图、视频、广告、富文本编辑器。
- 团队还不了解状态与副作用边界，容易把请求和业务逻辑写进 Composable。

不代表不能用：

- Compose 可以和 View 互操作。迁移可以按页面、按组件、按局部区域逐步进行。

## 8. 推荐项目结构

```text
app/
  src/main/java/com/example/app/
    MainActivity.kt
    App.kt
    navigation/
      AppNavHost.kt
      Routes.kt
    core/
      ui/
        theme/
        components/
      model/
      data/
    feature/
      home/
        HomeRoute.kt
        HomeScreen.kt
        HomeViewModel.kt
        HomeUiState.kt
      detail/
        DetailRoute.kt
        DetailScreen.kt
        DetailViewModel.kt
        DetailUiState.kt
```

命名建议：

| 名称 | 责任 |
|---|---|
| `XxxRoute` | 连接 ViewModel、导航参数、状态收集、事件转发 |
| `XxxScreen` | 无状态或少状态 UI，接收 `uiState` 和事件 lambda |
| `XxxViewModel` | 业务状态、事件处理、调用 UseCase/Repository |
| `XxxUiState` | 页面渲染所需的不可变数据 |
| `core/ui/components` | 跨页面复用的 UI 组件 |

## 9. 环境排查清单

- Android Studio 是否为稳定版或与 AGP/Kotlin 版本兼容的版本。
- `google()` 是否在 plugin 和 dependency repositories 中。
- 所有 Compose artifact 是否由同一个 BOM 管理。
- 是否混用了显式 Compose 版本和 BOM 版本。
- Kotlin 2.x 项目是否应用了 `org.jetbrains.kotlin.plugin.compose`。
- 只有包含 Composable 代码的模块才需要启用 Compose。
- `debugImplementation("androidx.compose.ui:ui-tooling")` 是否只放在 debug。
- 测试依赖是否配置了 `ui-test-junit4` 和 `ui-test-manifest`。
- Version Catalog 中是否把 Compose BOM 和非 Compose 库版本区分管理。
- CI 是否使用与本地一致的 JDK、AGP、Kotlin、Gradle 版本。

## 10. 新项目推荐基线

| 维度 | 建议 |
|---|---|
| 语言 | Kotlin 2.x |
| UI | Jetpack Compose + Material 3 |
| 依赖版本 | Compose BOM + Version Catalog |
| 状态收集 | `collectAsStateWithLifecycle()` |
| 导航 | Navigation Compose，优先类型安全路由 |
| 图片 | Coil Compose 或团队统一图片库 |
| 架构 | `Route + Screen + ViewModel + UiState` |
| 测试 | ViewModel 单元测试 + Compose UI 测试 + 关键路径 Macrobenchmark |

这不是唯一正确答案，但它能减少新项目早期最常见的版本、状态和生命周期问题。
