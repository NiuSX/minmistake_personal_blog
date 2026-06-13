# 02. 项目结构、Gradle、Manifest 与资源

## Gradle 的作用

Gradle 是 Android 项目的构建系统，负责：

- 编译 Kotlin / Java。
- 处理资源。
- 打包 APK / AAB。
- 管理依赖。
- 配置构建变体。
- 执行测试。
- 运行代码生成任务。

Android 项目通常包含根目录 Gradle 配置和模块 Gradle 配置。

## settings.gradle.kts

示例：

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

rootProject.name = "DemoApp"
include(":app")
```

## app/build.gradle.kts

示例：

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.demo"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.demo"
        minSdk = 23
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
}
```

具体版本应以当前 Android Gradle Plugin 和项目要求为准。

## 依赖管理

```kotlin
dependencies {
    implementation("androidx.core:core-ktx:...")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:...")
    implementation("androidx.navigation:navigation-compose:...")
    testImplementation("junit:junit:...")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4:...")
}
```

常见配置：

- `implementation`：模块内部使用。
- `api`：库模块暴露给调用方。
- `testImplementation`：本地测试。
- `androidTestImplementation`：设备测试。
- `debugImplementation`：Debug 构建专用。

## Version Catalog

大型项目建议使用 `libs.versions.toml` 管理版本：

```toml
[versions]
kotlin = "..."
composeBom = "..."

[libraries]
androidx-core-ktx = { module = "androidx.core:core-ktx", version = "..." }
```

优点：

- 依赖版本集中管理。
- 多模块项目更一致。
- 降低重复配置。

## AndroidManifest.xml

Manifest 声明应用组件、权限和元数据：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:theme="@style/Theme.App">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

注意：

- 有 launcher intent-filter 的 Activity 通常需要 `android:exported="true"`。
- 不需要暴露给外部的组件应设置 `exported=false`。
- 权限声明应遵循最小权限原则。

## 资源系统

资源目录：

```text
res/
├── drawable/
├── mipmap/
├── values/
├── font/
├── raw/
└── xml/
```

常见资源：

- 字符串：`res/values/strings.xml`
- 颜色：`res/values/colors.xml`
- 样式：`res/values/styles.xml`
- 图片：`drawable`
- 启动图标：`mipmap`

## 字符串资源

```xml
<resources>
    <string name="app_name">Demo</string>
</resources>
```

使用字符串资源有利于国际化。不要在 UI 中硬编码大量可见文本。

Compose 中读取：

```kotlin
Text(text = stringResource(R.string.app_name))
```

## 多语言和多资源限定符

示例：

```text
values/strings.xml
values-zh/strings.xml
values-night/colors.xml
drawable-hdpi/
drawable-xhdpi/
```

Android 会根据设备语言、屏幕密度、夜间模式等选择合适资源。

## Build Types 与 Product Flavors

Build Types：

```kotlin
buildTypes {
    debug {
        isDebuggable = true
    }
    release {
        isMinifyEnabled = true
    }
}
```

Product Flavors：

```kotlin
flavorDimensions += "env"
productFlavors {
    create("dev") { dimension = "env" }
    create("prod") { dimension = "env" }
}
```

常用于区分开发、测试、生产环境。

## 本章检查清单

- 是否知道 Gradle 在 Android 项目中的作用？
- 是否能解释 Manifest 的用途？
- 是否知道资源为什么要放在 res 下？
- 是否理解 implementation、api、testImplementation？
- 是否知道 build type 和 flavor 的区别？

## Gradle 配置的关键边界

Android 项目常见三层 Gradle 配置：

```text
settings.gradle.kts       声明插件仓库、依赖仓库、模块 include
build.gradle.kts          根项目公共插件版本和全局约定
app/build.gradle.kts      Android 插件、namespace、SDK、依赖、构建变体
```

现代项目建议：

- 使用 Kotlin DSL，即 `*.gradle.kts`。
- 使用 Version Catalog，即 `gradle/libs.versions.toml` 管理依赖版本。
- 使用 Gradle Wrapper，即 `gradlew` 固定 Gradle 版本。
- 避免在每个模块重复写一大段相同配置，复杂项目可抽到 convention plugin。

示例：

```toml
[versions]
agp = "x.y.z"
kotlin = "x.y.z"
composeBom = "yyyy.mm.00"

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }

[libraries]
compose-bom = { module = "androidx.compose:compose-bom", version.ref = "composeBom" }
```

这里的版本号是占位示例。真实项目要以 Android Gradle Plugin release notes、Kotlin release notes、Compose BOM 和项目兼容矩阵为准，不要直接复制旧笔记里的版本。

## Manifest 的常见职责

Manifest 不只是注册 Activity。它还承担：

- 声明包内组件：Activity、Service、Receiver、Provider。
- 声明权限：如网络、相机、通知、定位。
- 声明应用级属性：主题、图标、备份策略、网络安全配置。
- 声明 Intent Filter：决定外部如何启动组件。
- 声明 `exported`：决定组件是否可被其他应用访问。

Android 12 之后，带有 intent filter 的组件必须显式声明 `android:exported`。原则是：没有跨应用访问需求就设为 `false`。

## 资源系统实践

资源不是简单文件夹，它会参与编译并生成类型安全 ID。

| 目录 | 用途 | 注意点 |
| --- | --- | --- |
| `res/values/strings.xml` | 文案 | 不要在 UI 中硬编码可见文案 |
| `res/values/colors.xml` | 传统颜色资源 | Compose 项目也可能用于启动主题 |
| `res/drawable` | 位图、shape、vector | 大图要关注内存和密度 |
| `res/mipmap` | 启动图标 | 启动器图标优先放这里 |
| `res/xml` | 配置文件 | file provider、network security config 常见 |

多语言资源示例：

```text
res/values/strings.xml
res/values-zh-rCN/strings.xml
res/values-ja/strings.xml
```

不要拼接自然语言句子，复数、占位符和语序在不同语言中可能不同。

## 构建变体实践

`buildTypes` 表示构建用途，`productFlavors` 表示产品维度。

常见组合：

```text
devDebug       开发环境调试包
stagingDebug   预发环境调试包
prodRelease    正式发布包
```

常见差异：

- API base URL。
- 应用名后缀。
- 日志开关。
- 是否启用混淆。
- 是否启用调试菜单。

不要把密钥直接写进 Gradle 文件或 Git 仓库。可使用 CI Secret、`local.properties`、远程配置或后端下发机制。

## 常见构建问题排查顺序

1. 先看第一条真正的 error，不要只看最后的 `BUILD FAILED`。
2. 确认 AGP、Gradle、JDK、Kotlin、Compose Compiler 是否兼容。
3. 清理无效缓存前先尝试命令行构建，区分 IDE 问题和项目问题。
4. 多模块循环依赖时，用 `./gradlew :app:dependencies` 或 IDE dependency analyzer 看依赖图。
5. 依赖冲突时优先升级或对齐 BOM，不要随意 `exclude`。
