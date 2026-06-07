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

