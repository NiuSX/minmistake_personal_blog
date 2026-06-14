# Gradle 完整学习笔记

> 适合对象：Java / Kotlin / Android 初学者，已经学过 Maven 想迁移到 Gradle 的开发者，或需要系统理解 Gradle 构建、依赖管理、多模块、插件、缓存和排错的人。

Gradle 是现代 Java 生态和 Android 生态中非常重要的构建自动化工具。它既能像 Maven 一样做依赖管理、编译、测试、打包、发布，也能通过 Groovy DSL 或 Kotlin DSL 编写更灵活的构建逻辑。Android 官方构建系统、Kotlin 多平台、大型多模块 Java 工程、企业级 CI/CD 构建中都大量使用 Gradle。

如果你只会执行 `./gradlew build`，还不算真正理解 Gradle。真正掌握 Gradle，需要理解：Gradle Wrapper 为什么重要、`settings.gradle(.kts)` 和 `build.gradle(.kts)` 分别管什么、任务图如何生成、初始化/配置/执行三个阶段如何运转、插件如何扩展构建、依赖配置如何控制 classpath、`implementation` 和 `api` 有什么区别、版本目录如何统一版本、多模块如何构建、构建缓存和配置缓存如何提速，以及遇到依赖冲突、任务失败、Android 构建异常时如何排查。

最后调研：2026-06-13。

版本说明：截至 2026-06-13，Gradle 官方 Releases 页面列出 Gradle 9.5.1 为当前最新稳定版本，页面标注日期为 2026-05-12；官方 Release Notes 也推荐从 9.5.0 升级到 9.5.1。Gradle 9.5.1 运行 Gradle 本身需要 JVM 17 到 JVM 26；Gradle Wrapper、Gradle Client、Tooling API Client 和 TestKit Client 可在 JVM 8 上运行。实际项目升级时，应同时检查 Gradle、JDK、Kotlin Gradle Plugin、Android Gradle Plugin、Spring Boot Plugin 等插件的兼容矩阵。

学习目标：

- 能说明 Wrapper、settings、build script、plugin、dependency、task 的职责。
- 能用 Kotlin DSL 配置 Java、Kotlin、Android 和多模块项目。
- 能理解 `api`、`implementation`、`runtimeOnly`、版本目录、BOM 和依赖约束。
- 能用 build cache、configuration cache、懒配置和增量构建优化性能。
- 能排查依赖冲突、任务失败、JDK/插件兼容和 CI 构建异常。

## 目录

1. Gradle 是什么
2. Gradle 解决什么问题
3. Gradle、Maven、Ant 的区别
4. Gradle 的核心模型
5. 安装 Gradle 与环境配置
6. Gradle Wrapper
7. Gradle 项目目录结构
8. 初始化项目
9. Kotlin DSL 与 Groovy DSL
10. settings.gradle 与 build.gradle
11. Gradle 构建生命周期
12. Task 任务系统
13. 常用 Gradle 命令
14. 插件机制
15. Java 项目配置
16. Java Library 插件与 api / implementation
17. Kotlin 项目配置
18. Android Gradle 基础
19. 依赖管理基础
20. 依赖 Configuration
21. 传递依赖、版本冲突与解析规则
22. 版本目录 libs.versions.toml
23. 平台、BOM 与版本约束
24. 仓库配置
25. 多模块项目
26. buildSrc、Convention Plugin 与复用构建逻辑
27. 属性、Provider API 与懒配置
28. 增量构建
29. Build Cache 构建缓存
30. Configuration Cache 配置缓存
31. Gradle Daemon 与性能优化
32. 测试、代码质量与报告
33. 打包与发布
34. CI/CD 中使用 Gradle
35. 依赖安全与供应链治理
36. 常见错误排查
37. Gradle 最佳实践
38. 学习路线
39. 命令速查表
40. 参考资料与扩展阅读

## 1. Gradle 是什么

Gradle 是一个开源的构建自动化工具。它最常用于 JVM 生态，也支持 Android、Kotlin Multiplatform、Groovy、Scala、C/C++、JavaScript 等项目。

Gradle 可以完成：

- 编译源码
- 运行测试
- 处理资源文件
- 生成 jar、war、apk、aab、zip 等构建产物
- 管理第三方依赖
- 管理多模块项目
- 发布构件到 Maven 仓库
- 运行代码质量检查
- 生成测试报告、覆盖率报告
- 在 CI/CD 中执行自动化构建
- 编写自定义任务和插件

Gradle 的核心特点：

- 基于任务图，而不是固定线性生命周期。
- 构建脚本可编程，灵活度高。
- 支持增量构建，只执行必要任务。
- 支持构建缓存，复用历史构建产物。
- 支持配置缓存，减少配置阶段开销。
- 支持多项目构建和复合构建。
- 与 Maven Central、Google Maven、Ivy 仓库兼容。
- 插件生态丰富，Android 构建系统就是基于 Gradle。

一句话理解：

```text
Gradle 读取构建脚本，创建项目和任务，解析依赖，生成任务图，然后按任务图执行构建工作。
```

## 2. Gradle 解决什么问题

### 2.1 统一构建流程

没有构建工具时，项目构建可能依赖：

- IDE 编译按钮
- 手写 shell 脚本
- 手动复制 jar
- 手动打包
- 手动上传产物

这样会导致团队成员构建方式不一致。

Gradle 提供统一入口：

```bash
./gradlew clean build
```

Windows PowerShell：

```powershell
.\gradlew.bat clean build
```

### 2.2 自动管理依赖

不用手动下载 jar，直接声明：

```kotlin
dependencies {
    implementation("org.apache.commons:commons-lang3:3.18.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.12.0")
}
```

Gradle 会自动：

- 查找本地缓存
- 访问远程仓库
- 下载直接依赖
- 下载传递依赖
- 解析版本冲突
- 加入对应 classpath

### 2.3 支持复杂项目结构

大型项目通常拆成多个模块：

```text
root
├── app
├── core
├── data
├── domain
├── feature-user
└── feature-order
```

Gradle 可以自动识别模块依赖，按正确顺序构建。

### 2.4 提升构建性能

Gradle 通过以下机制减少重复工作：

- Gradle Daemon
- 增量构建
- 构建缓存
- 配置缓存
- 并行构建
- 按需任务执行
- 懒配置

### 2.5 提供可扩展构建能力

Gradle 不是只能执行固定命令。你可以：

- 自定义任务
- 自定义插件
- 编写企业内部构建规范
- 抽取 convention plugin
- 控制发布流程
- 集成代码生成、打包、部署、版本号生成等逻辑

## 3. Gradle、Maven、Ant 的区别

| 工具 | 核心模型 | 配置文件 | 特点 | 适合场景 |
| :--- | :--- | :--- | :--- | :--- |
| Ant | 过程式任务 | `build.xml` | 灵活但缺少默认依赖管理和约定 | 老项目、特殊脚本 |
| Maven | 生命周期阶段 | `pom.xml` | 约定优于配置，标准化强 | Java 后端、企业项目 |
| Gradle | 任务依赖图 | `build.gradle(.kts)` | 灵活、性能好、插件能力强 | Android、大型多模块、复杂构建 |

### 3.1 Maven 的模型

Maven 更像一条固定流水线：

```text
validate -> compile -> test -> package -> verify -> install -> deploy
```

你执行某个 phase，Maven 会执行它之前的所有 phase。

### 3.2 Gradle 的模型

Gradle 更像一个任务图：

```text
compileJava
    ↓
classes
    ↓
jar
    ↓
assemble
```

你执行某个任务，Gradle 会找到它依赖的任务，只执行必要路径。

### 3.3 初学建议

如果你学 Java 后端：

```text
Maven 和 Gradle 都要懂，先学 Maven 能帮助理解仓库和坐标，后学 Gradle 更容易理解现代项目构建。
```

如果你学 Android：

```text
Gradle 是必须掌握的基础能力。
```

## 4. Gradle 的核心模型

Gradle 中最重要的概念：

| 概念 | 说明 |
| :--- | :--- |
| Build | 一次 Gradle 构建 |
| Project | 项目或子项目 |
| Task | 构建中的最小执行单元 |
| Plugin | 扩展 Gradle 能力的组件 |
| Build Script | 构建脚本，通常是 `build.gradle.kts` |
| Settings Script | 设置脚本，通常是 `settings.gradle.kts` |
| Dependency | 项目依赖 |
| Configuration | 依赖作用域和解析容器 |
| Repository | 依赖仓库 |
| Variant | 构件变体，比如 debug/release、api/runtime |
| Provider | 延迟计算的值 |
| Gradle Wrapper | 项目自带的 Gradle 启动器 |

核心关系：

```text
Settings 决定有哪些项目
Project 承载构建配置
Plugin 添加任务和 DSL
Dependency 声明项目需要什么
Configuration 决定依赖用于哪里
Task 执行具体工作
Gradle 根据任务依赖生成任务图
```

## 5. 安装 Gradle 与环境配置

### 5.1 是否必须全局安装 Gradle

实际开发中不建议依赖全局安装的 Gradle。

推荐方式：

```text
项目中使用 Gradle Wrapper
```

也就是：

```bash
./gradlew build
```

而不是：

```bash
gradle build
```

全局 Gradle 只在以下场景有用：

- 新建项目时执行 `gradle init`
- 给已有项目生成 Wrapper
- 学习和临时实验

### 5.2 前置条件

检查 Java：

```bash
java -version
javac -version
```

Gradle 9.5.1 运行 Gradle 本身需要 JVM 17 到 JVM 26。

注意：

```text
运行 Gradle 的 JDK 和编译项目使用的 JDK 可以不是同一个。
```

例如：

- 用 JDK 21 运行 Gradle
- 用 Java Toolchain 编译 Java 17 项目

### 5.3 常见安装方式

Windows：

```powershell
winget install Gradle.Gradle
```

macOS：

```bash
brew install gradle
```

SDKMAN：

```bash
sdk install gradle
```

手动安装：

1. 从 Gradle 官方 Releases 下载 zip。
2. 解压到本地目录。
3. 配置 `GRADLE_HOME`。
4. 将 `%GRADLE_HOME%\bin` 或 `$GRADLE_HOME/bin` 加入 `PATH`。
5. 执行 `gradle -v` 验证。

### 5.4 查看 Gradle 环境

```bash
gradle -v
```

重点看：

- Gradle version
- Kotlin version
- Groovy version
- JVM
- OS

项目中更推荐：

```bash
./gradlew -v
```

## 6. Gradle Wrapper

Gradle Wrapper 是项目自带的 Gradle 启动脚本。

典型文件：

```text
gradlew
gradlew.bat
gradle/
└── wrapper/
    ├── gradle-wrapper.jar
    └── gradle-wrapper.properties
```

### 6.1 Wrapper 的作用

Wrapper 可以保证：

- 团队成员使用同一个 Gradle 版本。
- CI 不需要预装 Gradle。
- 新成员拉取代码后可直接构建。
- 项目升级 Gradle 版本时只改 Wrapper 配置。

### 6.2 使用 Wrapper

Linux / macOS：

```bash
./gradlew build
```

Windows PowerShell：

```powershell
.\gradlew.bat build
```

Windows cmd：

```cmd
gradlew.bat build
```

### 6.3 生成 Wrapper

如果项目还没有 Wrapper，可以先全局安装 Gradle，然后执行：

```bash
gradle wrapper
```

指定版本：

```bash
gradle wrapper --gradle-version=9.5.1
```

### 6.4 升级 Wrapper

官方推荐升级方式：

```bash
./gradlew wrapper --gradle-version=9.5.1
./gradlew wrapper
```

第一条更新 Wrapper 配置，第二条刷新 Wrapper 脚本和 jar。

### 6.5 gradle-wrapper.properties

示例：

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-9.5.1-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

常见分发包：

| 类型 | 说明 |
| :--- | :--- |
| `bin` | 只包含运行 Gradle 所需文件 |
| `all` | 包含源码和文档，IDE 体验更好 |

开发项目可用：

```text
gradle-9.5.1-bin.zip
```

如果希望 IDE 能查看 Gradle 源码和文档，可以用：

```text
gradle-9.5.1-all.zip
```

### 6.6 Wrapper 文件是否应该提交

应该提交：

```text
gradlew
gradlew.bat
gradle/wrapper/gradle-wrapper.jar
gradle/wrapper/gradle-wrapper.properties
```

不应提交：

```text
.gradle/
build/
```

### 6.7 Wrapper 安全检查

Wrapper 本身会下载并执行指定 Gradle 分发包，因此应把 Wrapper 文件当成供应链入口来管理：

- `gradle-wrapper.properties` 中的 `distributionUrl` 应指向可信来源。
- 升级 Gradle 时使用 `./gradlew wrapper --gradle-version=...`，再检查 diff。
- 提交 `gradle-wrapper.jar`，但不要随意替换来源不明的 jar。
- 重要项目可以使用校验和字段或 CI 校验 wrapper jar。

升级 Wrapper 后至少执行：

```bash
./gradlew --version
./gradlew help
./gradlew build --warning-mode all
```

## 7. Gradle 项目目录结构

典型 Gradle 项目：

```text
demo/
├── .gradle/
├── build/
├── gradle/
│   ├── libs.versions.toml
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
├── settings.gradle.kts
├── build.gradle.kts
├── gradle.properties
├── local.properties
└── src/
    ├── main/
    │   ├── java/
    │   └── resources/
    └── test/
        ├── java/
        └── resources/
```

### 7.1 文件说明

| 文件或目录 | 作用 | 是否提交 |
| :--- | :--- | :--- |
| `.gradle/` | Gradle 本地缓存 | 否 |
| `build/` | 构建输出目录 | 否 |
| `gradle/wrapper/` | Wrapper 文件 | 是 |
| `gradlew` | Linux/macOS Wrapper 脚本 | 是 |
| `gradlew.bat` | Windows Wrapper 脚本 | 是 |
| `settings.gradle.kts` | 定义构建名称、模块、插件仓库、依赖仓库等 | 是 |
| `build.gradle.kts` | 项目构建脚本 | 是 |
| `gradle.properties` | Gradle 属性 | 是，敏感信息除外 |
| `local.properties` | 本机路径、SDK 路径等 | 通常否 |
| `libs.versions.toml` | 版本目录 | 是 |

### 7.2 Java 标准源码目录

```text
src/main/java
src/main/resources
src/test/java
src/test/resources
```

### 7.3 Kotlin 常见源码目录

```text
src/main/kotlin
src/test/kotlin
```

### 7.4 Android 常见源码目录

```text
app/src/main/java
app/src/main/kotlin
app/src/main/res
app/src/main/AndroidManifest.xml
app/src/test
app/src/androidTest
```

## 8. 初始化项目

### 8.1 使用 gradle init

```bash
gradle init
```

Gradle 会交互式询问：

- 项目类型
- 构建脚本 DSL
- 测试框架
- 项目名称
- 包名

### 8.2 常见项目类型

```text
basic
application
library
gradle plugin
```

### 8.3 生成 Java 应用

```bash
gradle init --type java-application --dsl kotlin
```

### 8.4 生成 Java 库

```bash
gradle init --type java-library --dsl kotlin
```

### 8.5 Kotlin DSL 和 Groovy DSL 选择

推荐新项目优先选择 Kotlin DSL：

```text
build.gradle.kts
settings.gradle.kts
```

原因：

- 类型安全
- IDE 自动补全更好
- 重构友好
- Kotlin / Android 项目更自然

Groovy DSL 仍然大量存在于老项目中，也必须能读懂。

## 9. Kotlin DSL 与 Groovy DSL

### 9.1 文件区别

| DSL | 文件名 |
| :--- | :--- |
| Kotlin DSL | `build.gradle.kts` |
| Groovy DSL | `build.gradle` |

### 9.2 plugins 块对比

Kotlin DSL：

```kotlin
plugins {
    java
    application
}
```

Groovy DSL：

```groovy
plugins {
    id 'java'
    id 'application'
}
```

### 9.3 dependencies 块对比

Kotlin DSL：

```kotlin
dependencies {
    implementation("com.google.guava:guava:33.4.0-jre")
    testImplementation("org.junit.jupiter:junit-jupiter:5.12.0")
}
```

Groovy DSL：

```groovy
dependencies {
    implementation 'com.google.guava:guava:33.4.0-jre'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.12.0'
}
```

### 9.4 task 注册对比

Kotlin DSL：

```kotlin
tasks.register("hello") {
    doLast {
        println("Hello Gradle")
    }
}
```

Groovy DSL：

```groovy
tasks.register('hello') {
    doLast {
        println 'Hello Gradle'
    }
}
```

### 9.5 初学注意

不要把 Groovy 写法直接复制到 Kotlin DSL。

例如 Groovy：

```groovy
sourceCompatibility = JavaVersion.VERSION_17
```

Kotlin DSL：

```kotlin
java {
    sourceCompatibility = JavaVersion.VERSION_17
}
```

## 10. settings.gradle 与 build.gradle

### 10.1 settings.gradle.kts 负责什么

`settings.gradle.kts` 用于描述整个构建的结构。

常见内容：

- 根项目名称
- 子项目列表
- 插件仓库
- 依赖仓库管理
- 版本目录
- 复合构建

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

rootProject.name = "demo"
include(":app")
include(":core")
```

### 10.2 build.gradle.kts 负责什么

`build.gradle.kts` 用于描述某个项目如何构建。

常见内容：

- 应用插件
- 声明依赖
- 配置 Java / Kotlin / Android
- 注册任务
- 配置测试
- 配置发布

示例：

```kotlin
plugins {
    java
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.apache.commons:commons-lang3:3.18.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.12.0")
}

tasks.test {
    useJUnitPlatform()
}
```

### 10.3 根构建脚本和子项目构建脚本

多模块项目中通常：

```text
root/build.gradle.kts
root/app/build.gradle.kts
root/core/build.gradle.kts
```

根脚本适合放：

- 公共插件版本
- 公共仓库策略
- 公共任务
- 全局约定

子项目脚本适合放：

- 当前模块插件
- 当前模块依赖
- 当前模块特有配置

不要把所有模块配置都粗暴塞进根脚本。大型项目更推荐 convention plugin。

## 11. Gradle 构建生命周期

Gradle 一次构建分为三个阶段：

```text
Initialization -> Configuration -> Execution
```

### 11.1 Initialization 初始化阶段

Gradle 会：

- 读取 init scripts
- 读取 `settings.gradle(.kts)`
- 确定根项目
- 确定子项目
- 处理 `include(...)`
- 处理 `includeBuild(...)`

这个阶段回答：

```text
本次构建有哪些项目参与？
```

### 11.2 Configuration 配置阶段

Gradle 会：

- 创建 Project 对象
- 执行构建脚本
- 应用插件
- 注册任务
- 配置扩展
- 建立任务依赖关系
- 计算任务图

这个阶段回答：

```text
每个项目有哪些任务？这些任务之间是什么关系？
```

### 11.3 Execution 执行阶段

Gradle 会：

- 根据命令选择目标任务
- 计算依赖任务
- 判断任务是否需要执行
- 执行任务动作
- 输出构建产物

这个阶段回答：

```text
真正需要执行哪些任务？按什么顺序执行？
```

### 11.4 一个重要例子

```kotlin
println("配置阶段执行")

tasks.register("hello") {
    println("任务配置时执行")

    doLast {
        println("任务执行阶段执行")
    }
}
```

执行：

```bash
./gradlew hello
```

理解：

- 外层 `println` 在配置阶段执行。
- `tasks.register` 中的配置逻辑在任务被需要时配置。
- `doLast` 在执行阶段执行。

### 11.5 常见误区

误区：

```text
写在 build.gradle.kts 中的代码都会在执行任务时运行。
```

纠正：

```text
大部分构建脚本代码在配置阶段运行，只有 task action 才在执行阶段运行。
```

## 12. Task 任务系统

### 12.1 Task 是什么

Task 是 Gradle 构建中的最小执行单元。

例子：

- `compileJava`
- `processResources`
- `classes`
- `test`
- `jar`
- `assemble`
- `build`
- `clean`
- `publish`

### 12.2 查看任务

```bash
./gradlew tasks
```

查看所有任务：

```bash
./gradlew tasks --all
```

查看某个任务详情：

```bash
./gradlew help --task test
```

### 12.3 注册任务

推荐：

```kotlin
tasks.register("hello") {
    group = "demo"
    description = "Prints a greeting"

    doLast {
        println("Hello Gradle")
    }
}
```

不推荐旧写法：

```kotlin
task("hello") {
    doLast {
        println("Hello")
    }
}
```

原因：

```text
tasks.register 支持懒配置，性能更好。
```

### 12.4 任务依赖 dependsOn

```kotlin
tasks.register("generate") {
    doLast {
        println("generate")
    }
}

tasks.register("packageDemo") {
    dependsOn("generate")

    doLast {
        println("package")
    }
}
```

执行：

```bash
./gradlew packageDemo
```

输出顺序：

```text
generate -> packageDemo
```

### 12.5 finalizedBy

`finalizedBy` 表示某任务结束后执行另一个任务，常用于清理。

```kotlin
tasks.register("startServer") {
    doLast {
        println("start server")
    }
}

tasks.register("stopServer") {
    doLast {
        println("stop server")
    }
}

tasks.named("startServer") {
    finalizedBy("stopServer")
}
```

### 12.6 mustRunAfter 和 shouldRunAfter

`mustRunAfter` 只控制顺序，不引入依赖：

```kotlin
tasks.register("taskA")
tasks.register("taskB") {
    mustRunAfter("taskA")
}
```

如果只执行：

```bash
./gradlew taskB
```

`taskA` 不会自动执行。

区别：

| API | 是否引入依赖 | 强制程度 |
| :--- | :--- | :--- |
| `dependsOn` | 是 | 必须先执行依赖任务 |
| `finalizedBy` | 是 | 当前任务结束后执行 |
| `mustRunAfter` | 否 | 如果两个都执行，必须按顺序 |
| `shouldRunAfter` | 否 | 如果两个都执行，尽量按顺序 |

### 12.7 任务输入输出

Gradle 判断任务是否需要执行，依赖任务的输入和输出。

```kotlin
val generateText by tasks.registering {
    val outputFile = layout.buildDirectory.file("generated/demo.txt")

    outputs.file(outputFile)

    doLast {
        outputFile.get().asFile.writeText("hello")
    }
}
```

如果输出文件存在且输入没有变化，任务可能显示：

```text
UP-TO-DATE
```

### 12.8 自定义任务类型

```kotlin
abstract class GenerateGreetingTask : DefaultTask() {

    @get:Input
    abstract val greeting: Property<String>

    @get:OutputFile
    abstract val outputFile: RegularFileProperty

    @TaskAction
    fun generate() {
        outputFile.get().asFile.writeText(greeting.get())
    }
}

tasks.register<GenerateGreetingTask>("generateGreeting") {
    greeting.set("Hello Gradle")
    outputFile.set(layout.buildDirectory.file("generated/greeting.txt"))
}
```

重点：

- `@Input` 声明输入。
- `@OutputFile` 声明输出文件。
- `@TaskAction` 声明执行逻辑。
- 使用 `Property<T>` 和 `RegularFileProperty` 支持懒配置。

## 13. 常用 Gradle 命令

### 13.1 基础命令

```bash
./gradlew help
./gradlew tasks
./gradlew projects
./gradlew properties
./gradlew build
./gradlew clean
```

### 13.2 Java 项目常用命令

```bash
./gradlew compileJava
./gradlew processResources
./gradlew classes
./gradlew test
./gradlew jar
./gradlew assemble
./gradlew check
./gradlew build
```

### 13.3 Android 项目常用命令

```bash
./gradlew assembleDebug
./gradlew installDebug
./gradlew testDebugUnitTest
./gradlew connectedDebugAndroidTest
./gradlew lintDebug
./gradlew assembleRelease
./gradlew bundleRelease
./gradlew signingReport
```

### 13.4 依赖分析命令

```bash
./gradlew dependencies
./gradlew dependencyInsight --dependency guava
./gradlew buildEnvironment
```

指定配置：

```bash
./gradlew dependencies --configuration runtimeClasspath
./gradlew dependencyInsight --dependency junit --configuration testRuntimeClasspath
```

### 13.5 性能和调试命令

```bash
./gradlew build --scan
./gradlew build --profile
./gradlew build --info
./gradlew build --debug
./gradlew build --stacktrace
./gradlew build --warning-mode all
```

### 13.6 多模块命令

构建指定模块：

```bash
./gradlew :app:build
```

执行子模块任务：

```bash
./gradlew :core:test
```

构建所有模块：

```bash
./gradlew build
```

### 13.7 常用参数

| 参数 | 作用 |
| :--- | :--- |
| `--help` | 查看帮助 |
| `--version` | 查看版本 |
| `--stacktrace` | 输出异常堆栈 |
| `--info` | 输出更多日志 |
| `--debug` | 输出调试日志 |
| `--warning-mode all` | 显示所有弃用警告 |
| `--rerun-tasks` | 强制重新执行任务 |
| `--offline` | 离线模式 |
| `--refresh-dependencies` | 重新检查依赖 |
| `--parallel` | 并行构建 |
| `--build-cache` | 启用构建缓存 |
| `--configuration-cache` | 启用配置缓存 |
| `-x test` | 排除 test 任务 |
| `-Pkey=value` | 传入项目属性 |
| `-Dkey=value` | 传入系统属性 |

## 14. 插件机制

### 14.1 插件是什么

插件用于扩展 Gradle。

插件可以：

- 添加任务
- 添加依赖配置
- 添加 DSL 扩展
- 配置默认约定
- 绑定任务关系
- 提供发布、测试、打包能力

例如 Java 插件会添加：

- `compileJava`
- `processResources`
- `classes`
- `test`
- `jar`
- `assemble`
- `check`
- `build`

### 14.2 应用核心插件

```kotlin
plugins {
    java
    `java-library`
    application
}
```

### 14.3 应用外部插件

```kotlin
plugins {
    id("org.jetbrains.kotlin.jvm") version "2.2.0"
}
```

Android：

```kotlin
plugins {
    id("com.android.application") version "8.13.0" apply false
    id("org.jetbrains.kotlin.android") version "2.2.0" apply false
}
```

子模块：

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}
```

### 14.4 pluginManagement

插件仓库通常写在 `settings.gradle.kts`：

```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### 14.5 apply false

根脚本：

```kotlin
plugins {
    id("org.jetbrains.kotlin.jvm") version "2.2.0" apply false
}
```

含义：

```text
声明插件版本，但不应用到根项目。
```

子项目再应用：

```kotlin
plugins {
    id("org.jetbrains.kotlin.jvm")
}
```

适合多模块统一插件版本。

### 14.6 plugins 块和 apply 区别

推荐：

```kotlin
plugins {
    java
}
```

老写法：

```kotlin
apply(plugin = "java")
```

`plugins {}` 更推荐，因为：

- 可静态解析
- IDE 支持更好
- 插件版本管理更清晰
- 类型安全访问器更完整

## 15. Java 项目配置

### 15.1 最小 Java 项目

```kotlin
plugins {
    java
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.12.0")
}

tasks.test {
    useJUnitPlatform()
}
```

### 15.2 Java 版本配置

```kotlin
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}
```

更推荐 Java Toolchain：

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

### 15.3 为什么推荐 Toolchain

Toolchain 可以：

- 指定编译使用的 Java 版本。
- 减少本机 JDK 差异。
- 让 CI 和开发机行为更一致。
- 支持用高版本 JDK 运行 Gradle，同时用指定 JDK 编译项目。

### 15.4 application 插件

```kotlin
plugins {
    application
}

application {
    mainClass.set("com.example.Main")
}
```

运行：

```bash
./gradlew run
```

打包应用分发包：

```bash
./gradlew installDist
./gradlew distZip
```

### 15.5 jar 配置

```kotlin
tasks.jar {
    archiveBaseName.set("demo")
    archiveVersion.set("1.0.0")

    manifest {
        attributes["Main-Class"] = "com.example.Main"
    }
}
```

## 16. Java Library 插件与 api / implementation

### 16.1 java 和 java-library 区别

`java` 插件适合普通 Java 项目。

`java-library` 插件适合对外提供库的模块。

```kotlin
plugins {
    `java-library`
}
```

它提供：

- `api`
- `implementation`
- `compileOnly`
- `runtimeOnly`
- `testImplementation`

### 16.2 api

`api` 表示依赖会暴露给下游模块。

例如：

```kotlin
dependencies {
    api("com.fasterxml.jackson.core:jackson-databind:2.17.2")
}
```

如果当前库的公开方法参数或返回值使用了 Jackson 类型，就应该用 `api`。

### 16.3 implementation

`implementation` 表示依赖只用于当前模块内部实现，不暴露给下游。

```kotlin
dependencies {
    implementation("org.apache.commons:commons-lang3:3.18.0")
}
```

### 16.4 api 和 implementation 的选择

| 场景 | 推荐 |
| :--- | :--- |
| 依赖类型出现在 public API 中 | `api` |
| 依赖只在模块内部使用 | `implementation` |
| 编译需要但运行环境提供 | `compileOnly` |
| 编译不需要但运行需要 | `runtimeOnly` |
| 测试需要 | `testImplementation` |

### 16.5 为什么 implementation 更推荐

好处：

- 减少下游 classpath。
- 降低依赖泄漏。
- 改善增量编译。
- 降低依赖冲突概率。

## 17. Kotlin 项目配置

### 17.1 Kotlin JVM 项目

```kotlin
plugins {
    kotlin("jvm") version "2.2.0"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
```

### 17.2 Kotlin 编译目标

新 Kotlin Gradle Plugin 中常用 compilerOptions：

```kotlin
kotlin {
    jvmToolchain(17)
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    compilerOptions {
        freeCompilerArgs.add("-Xjsr305=strict")
    }
}
```

### 17.3 Kotlin 和 Java 混合项目

常见目录：

```text
src/main/java
src/main/kotlin
src/test/java
src/test/kotlin
```

Kotlin 可以调用 Java，Java 也可以调用 Kotlin，但要注意：

- Kotlin 编译任务和 Java 编译任务顺序。
- 注解处理器使用 KAPT 或 KSP。
- Java target 和 Kotlin jvmTarget 应保持一致。

### 17.4 KAPT 与 KSP

KAPT：

```kotlin
plugins {
    kotlin("kapt")
}

dependencies {
    kapt("com.google.dagger:dagger-compiler:2.51.1")
}
```

KSP：

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.2.0-2.0.0"
}

dependencies {
    ksp("com.google.dagger:dagger-compiler:2.51.1")
}
```

一般来说，支持 KSP 的库优先使用 KSP，因为它通常比 KAPT 更快。

## 18. Android Gradle 基础

### 18.1 Android 项目结构

```text
android-demo/
├── settings.gradle.kts
├── build.gradle.kts
├── gradle/libs.versions.toml
└── app/
    ├── build.gradle.kts
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml
        │   ├── java/
        │   ├── kotlin/
        │   └── res/
        ├── test/
        └── androidTest/
```

### 18.2 根 settings.gradle.kts

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

rootProject.name = "AndroidDemo"
include(":app")
```

### 18.3 根 build.gradle.kts

```kotlin
plugins {
    id("com.android.application") version "8.13.0" apply false
    id("org.jetbrains.kotlin.android") version "2.2.0" apply false
}
```

### 18.4 app/build.gradle.kts

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.demo"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.demo"
        minSdk = 23
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.16.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
}
```

版本需要以 Android Gradle Plugin 和 Android SDK 官方兼容要求为准。

### 18.5 Android 常用任务

| 任务 | 作用 |
| :--- | :--- |
| `assembleDebug` | 构建 Debug APK |
| `installDebug` | 安装 Debug APK 到设备 |
| `assembleRelease` | 构建 Release APK |
| `bundleRelease` | 构建 Release AAB |
| `testDebugUnitTest` | 运行 Debug 本地单元测试 |
| `connectedDebugAndroidTest` | 运行设备测试 |
| `lintDebug` | 运行 Debug Lint |
| `signingReport` | 输出签名信息 |
| `dependencies` | 查看依赖树 |
| `androidDependencies` | 查看 Android 依赖 |

### 18.6 buildTypes

常见构建类型：

```kotlin
android {
    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }

        release {
            isDebuggable = false
            isMinifyEnabled = true
        }
    }
}
```

### 18.7 productFlavors

```kotlin
android {
    flavorDimensions += "env"

    productFlavors {
        create("dev") {
            dimension = "env"
            applicationIdSuffix = ".dev"
        }

        create("prod") {
            dimension = "env"
        }
    }
}
```

组合后会产生变体：

```text
devDebug
devRelease
prodDebug
prodRelease
```

对应任务：

```bash
./gradlew assembleDevDebug
./gradlew assembleProdRelease
```

### 18.8 Android Source Set

```text
src/main
src/debug
src/release
src/dev
src/prod
src/devDebug
src/prodRelease
```

用途：

- 不同环境使用不同代码。
- 不同构建类型使用不同资源。
- Debug 版本添加调试工具。
- Release 版本使用正式配置。

## 19. 依赖管理基础

### 19.1 repositories

```kotlin
repositories {
    mavenCentral()
    google()
}
```

Gradle 会从仓库解析依赖。

### 19.2 dependencies

```kotlin
dependencies {
    implementation("org.apache.commons:commons-lang3:3.18.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.12.0")
}
```

依赖坐标：

```text
group:name:version
```

例如：

```text
org.apache.commons:commons-lang3:3.18.0
```

### 19.3 本地文件依赖

```kotlin
dependencies {
    implementation(files("libs/local.jar"))
}
```

不推荐长期使用本地 jar，因为：

- 版本不可追踪。
- 难以复现构建。
- CI 可能缺文件。
- 依赖来源不透明。

更推荐发布到 Maven 仓库。

### 19.4 项目依赖

```kotlin
dependencies {
    implementation(project(":core"))
}
```

### 19.5 fileTree

```kotlin
dependencies {
    implementation(fileTree("libs") { include("*.jar") })
}
```

Android 老项目中常见，但不建议新项目滥用。

## 20. 依赖 Configuration

Configuration 是 Gradle 表示依赖作用域的核心概念。

### 20.1 常见配置

| Configuration | 作用 |
| :--- | :--- |
| `implementation` | 编译和运行当前模块需要，但不暴露给下游 |
| `api` | 当前模块公开 API 需要，会暴露给下游 |
| `compileOnly` | 编译需要，运行不需要 |
| `runtimeOnly` | 编译不需要，运行需要 |
| `testImplementation` | 测试编译和运行需要 |
| `testRuntimeOnly` | 测试运行需要 |
| `annotationProcessor` | Java 注解处理器 |
| `kapt` | Kotlin KAPT 注解处理器 |
| `ksp` | Kotlin Symbol Processing |

### 20.2 compileClasspath 和 runtimeClasspath

Gradle 内部会派生可解析配置：

| Configuration | 作用 |
| :--- | :--- |
| `compileClasspath` | 编译主代码时使用 |
| `runtimeClasspath` | 运行主代码时使用 |
| `testCompileClasspath` | 编译测试时使用 |
| `testRuntimeClasspath` | 运行测试时使用 |

查看：

```bash
./gradlew dependencies --configuration compileClasspath
./gradlew dependencies --configuration runtimeClasspath
```

### 20.3 canBeDeclared / canBeResolved / canBeConsumed

Gradle 中配置有不同角色：

| 属性 | 含义 |
| :--- | :--- |
| `canBeDeclared` | 是否可以声明依赖 |
| `canBeResolved` | 是否可以解析成文件 |
| `canBeConsumed` | 是否可以被其他项目消费 |

现代 Gradle 推荐配置角色清晰，不要把同一个 configuration 同时作为声明、解析、消费容器。

### 20.4 自定义 Configuration

```kotlin
val codegen by configurations.creating {
    isCanBeConsumed = false
    isCanBeResolved = true
}

dependencies {
    codegen("com.example:codegen-tool:1.0.0")
}
```

使用：

```kotlin
tasks.register<JavaExec>("runCodegen") {
    classpath = codegen
    mainClass.set("com.example.CodegenMain")
}
```

## 21. 传递依赖、版本冲突与解析规则

### 21.1 传递依赖

如果项目依赖 A，A 依赖 B，那么项目也会间接依赖 B。

```text
project -> A -> B
```

Gradle 会自动解析传递依赖。

### 21.2 查看依赖树

```bash
./gradlew dependencies
```

指定配置：

```bash
./gradlew dependencies --configuration runtimeClasspath
```

### 21.3 查看某个依赖为什么出现

```bash
./gradlew dependencyInsight --dependency guava --configuration runtimeClasspath
```

这个命令非常重要，常用于排查：

- 谁引入了这个依赖
- 为什么选择这个版本
- 是否存在版本冲突
- 是否被约束或平台影响

### 21.4 排除传递依赖

```kotlin
dependencies {
    implementation("com.example:demo-lib:1.0.0") {
        exclude(group = "commons-logging", module = "commons-logging")
    }
}
```

注意：

```text
不要盲目 exclude，排除后可能导致运行时 ClassNotFoundException。
```

### 21.5 关闭传递依赖

```kotlin
dependencies {
    implementation("com.example:demo-lib:1.0.0") {
        isTransitive = false
    }
}
```

一般不推荐，除非你非常清楚该库依赖结构。

### 21.6 版本冲突

例如：

```text
project -> A -> C:1.0
project -> B -> C:2.0
```

Gradle 默认会进行版本冲突解析，通常选择较高版本。

### 21.7 强制失败检查版本冲突

```kotlin
configurations.all {
    resolutionStrategy {
        failOnVersionConflict()
    }
}
```

启用后，如果同一依赖出现多个版本，构建会失败，适合严格治理场景。

### 21.8 强制版本

```kotlin
configurations.all {
    resolutionStrategy {
        force("com.google.guava:guava:33.4.0-jre")
    }
}
```

不建议滥用 `force`，更推荐使用：

- version catalog
- constraints
- platform
- BOM

## 22. 版本目录 libs.versions.toml

Version Catalog 用于集中管理依赖和插件版本。

文件：

```text
gradle/libs.versions.toml
```

### 22.1 基本结构

```toml
[versions]
kotlin = "2.2.0"
junit = "5.12.0"
commonsLang3 = "3.18.0"

[libraries]
commons-lang3 = { module = "org.apache.commons:commons-lang3", version.ref = "commonsLang3" }
junit-jupiter = { module = "org.junit.jupiter:junit-jupiter", version.ref = "junit" }

[plugins]
kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }

[bundles]
test = ["junit-jupiter"]
```

### 22.2 在 build.gradle.kts 使用库

```kotlin
dependencies {
    implementation(libs.commons.lang3)
    testImplementation(libs.junit.jupiter)
}
```

### 22.3 使用插件别名

```kotlin
plugins {
    alias(libs.plugins.kotlin.jvm)
}
```

### 22.4 alias 命名规则

TOML：

```toml
[libraries]
ktor-client-core = { module = "io.ktor:ktor-client-core", version = "3.1.0" }
```

访问器：

```kotlin
libs.ktor.client.core
```

也就是说：

```text
短横线会变成点号层级。
```

### 22.5 bundles

```toml
[bundles]
ktor-client = [
    "ktor-client-core",
    "ktor-client-logging"
]
```

使用：

```kotlin
dependencies {
    implementation(libs.bundles.ktor.client)
}
```

### 22.6 Version Catalog 的重要限制

Version Catalog 只声明请求版本，不强制最终解析版本。

也就是说：

```text
libs.versions.toml 中写了 1.0，不代表最终一定解析到 1.0。
```

最终版本仍可能被以下机制影响：

- 版本冲突解析
- platform / BOM
- constraints
- resolutionStrategy
- dependency substitution

## 23. 平台、BOM 与版本约束

### 23.1 platform

Gradle 可以导入 Maven BOM：

```kotlin
dependencies {
    implementation(platform("org.springframework.boot:spring-boot-dependencies:3.4.0"))
    implementation("org.springframework.boot:spring-boot-starter-web")
}
```

### 23.2 enforcedPlatform

```kotlin
dependencies {
    implementation(enforcedPlatform("org.springframework.boot:spring-boot-dependencies:3.4.0"))
}
```

`enforcedPlatform` 更强，会强制下游使用平台版本。

注意：

```text
库项目慎用 enforcedPlatform，因为它会把强约束传递给消费者。
```

### 23.3 constraints

```kotlin
dependencies {
    constraints {
        implementation("com.fasterxml.jackson.core:jackson-databind:2.17.2") {
            because("统一 Jackson 版本，避免传递依赖冲突")
        }
    }
}
```

### 23.4 rich version

```kotlin
dependencies {
    implementation("com.example:lib") {
        version {
            strictly("1.2.3")
            reject("1.2.4")
        }
    }
}
```

常见版本声明：

| 写法 | 含义 |
| :--- | :--- |
| `require("1.2.3")` | 要求版本，仍可被更强约束覆盖 |
| `strictly("1.2.3")` | 严格使用该版本 |
| `prefer("1.2.3")` | 偏好该版本 |
| `reject("1.2.4")` | 拒绝某版本 |

## 24. 仓库配置

### 24.1 常见仓库

```kotlin
repositories {
    mavenCentral()
    google()
    gradlePluginPortal()
}
```

### 24.2 Maven 私服

```kotlin
repositories {
    maven {
        url = uri("https://repo.example.com/repository/maven-public/")
    }
}
```

### 24.3 带认证的仓库

```kotlin
repositories {
    maven {
        url = uri("https://repo.example.com/repository/maven-releases/")
        credentials {
            username = providers.gradleProperty("repoUser").orNull
            password = providers.gradleProperty("repoPassword").orNull
        }
    }
}
```

不要把账号密码硬编码进构建脚本。

### 24.4 仓库内容过滤

```kotlin
repositories {
    maven {
        url = uri("https://repo.example.com/repository/internal/")
        content {
            includeGroupByRegex("com\\.example.*")
        }
    }

    mavenCentral()
}
```

好处：

- 减少无效仓库查询。
- 防止依赖从错误仓库解析。
- 提升安全性和可重复性。

### 24.5 repositoriesMode

推荐在 `settings.gradle.kts` 统一管理仓库：

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
```

含义：

```text
如果子项目自己声明 repositories，则构建失败。
```

这样可以避免每个模块乱配仓库。

## 25. 多模块项目

### 25.1 典型结构

```text
demo/
├── settings.gradle.kts
├── build.gradle.kts
├── app/
│   └── build.gradle.kts
├── core/
│   └── build.gradle.kts
└── data/
    └── build.gradle.kts
```

### 25.2 settings.gradle.kts

```kotlin
rootProject.name = "demo"

include(":app")
include(":core")
include(":data")
```

### 25.3 模块依赖

`app/build.gradle.kts`：

```kotlin
dependencies {
    implementation(project(":core"))
    implementation(project(":data"))
}
```

### 25.4 执行子模块任务

```bash
./gradlew :app:build
./gradlew :core:test
./gradlew :data:jar
```

### 25.5 查看项目结构

```bash
./gradlew projects
```

### 25.6 配置所有子项目

旧项目常见：

```kotlin
subprojects {
    repositories {
        mavenCentral()
    }
}
```

但现代 Gradle 更推荐：

- 仓库写在 `settings.gradle.kts` 的 `dependencyResolutionManagement`
- 公共构建逻辑抽到 convention plugin

原因：

```text
subprojects/allprojects 会造成跨项目耦合，不利于配置缓存、隔离项目和大型构建维护。
```

## 26. buildSrc、Convention Plugin 与复用构建逻辑

### 26.1 为什么要复用构建逻辑

多模块项目中容易出现重复配置：

```kotlin
plugins {
    kotlin("jvm")
}

kotlin {
    jvmToolchain(17)
}

tasks.test {
    useJUnitPlatform()
}
```

如果每个模块都写一遍：

- 容易不一致。
- 修改成本高。
- 根脚本越来越臃肿。

### 26.2 buildSrc

`buildSrc` 是 Gradle 自动识别的构建逻辑模块。

结构：

```text
buildSrc/
├── build.gradle.kts
└── src/main/kotlin/
    └── my-java-convention.gradle.kts
```

`buildSrc/build.gradle.kts`：

```kotlin
plugins {
    `kotlin-dsl`
}

repositories {
    gradlePluginPortal()
    mavenCentral()
}
```

预编译脚本插件：

```kotlin
// buildSrc/src/main/kotlin/my-java-convention.gradle.kts
plugins {
    `java-library`
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

tasks.test {
    useJUnitPlatform()
}
```

子模块使用：

```kotlin
plugins {
    id("my-java-convention")
}
```

### 26.3 included build 方式

大型项目更推荐使用独立构建逻辑：

```text
build-logic/
├── settings.gradle.kts
├── build.gradle.kts
└── convention/
    ├── build.gradle.kts
    └── src/main/kotlin/
        └── my-java-convention.gradle.kts
```

根 `settings.gradle.kts`：

```kotlin
pluginManagement {
    includeBuild("build-logic")
}
```

优点：

- 构建逻辑边界更清晰。
- 可复用性更强。
- 比 buildSrc 更容易拆分和治理。

### 26.4 Convention Plugin 的价值

Convention Plugin 用来表达团队约定：

- Java 版本
- Kotlin 编译参数
- 测试框架
- 代码质量工具
- 发布配置
- Android 默认配置
- 依赖约束

原则：

```text
业务模块只声明自己是什么和依赖什么，公共构建规则放到 convention plugin。
```

## 27. 属性、Provider API 与懒配置

### 27.1 gradle.properties

常见配置：

```properties
org.gradle.jvmargs=-Xmx4g -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.configuration-cache=true
kotlin.code.style=official
```

### 27.2 读取 Gradle 属性

```kotlin
val releaseVersion = providers.gradleProperty("releaseVersion")
```

命令传入：

```bash
./gradlew publish -PreleaseVersion=1.0.0
```

### 27.3 读取环境变量

```kotlin
val ci = providers.environmentVariable("CI")
```

### 27.4 Provider API

Provider API 用于延迟计算值。

```kotlin
val outputDir = layout.buildDirectory.dir("generated")
```

不要过早调用：

```kotlin
outputDir.get()
```

因为 `.get()` 会提前取值，可能破坏懒配置。

### 27.5 懒配置推荐写法

推荐：

```kotlin
tasks.register("demo") {
    doLast {
        println("run")
    }
}
```

配置已有任务：

```kotlin
tasks.named<Test>("test") {
    useJUnitPlatform()
}
```

批量配置：

```kotlin
tasks.withType<Test>().configureEach {
    useJUnitPlatform()
}
```

不推荐：

```kotlin
tasks.getByName("test")
tasks.withType<Test> { }
```

### 27.6 为什么懒配置重要

大型项目中，如果每次运行一个任务都配置所有任务，会非常慢。

懒配置可以：

- 减少配置阶段开销。
- 改善配置缓存兼容性。
- 避免无关任务被创建。
- 改善 IDE 同步性能。

## 28. 增量构建

### 28.1 增量构建是什么

增量构建表示：

```text
如果任务输入和输出没有变化，就跳过该任务。
```

常见输出：

```text
> Task :compileJava UP-TO-DATE
```

### 28.2 任务状态

| 状态 | 含义 |
| :--- | :--- |
| `UP-TO-DATE` | 输入输出未变化，跳过执行 |
| `FROM-CACHE` | 从构建缓存恢复输出 |
| `NO-SOURCE` | 没有源文件 |
| `SKIPPED` | 被条件跳过 |
| `FAILED` | 执行失败 |

### 28.3 自定义任务支持增量的关键

必须声明：

- 输入属性
- 输入文件
- 输出文件
- 输出目录

示例：

```kotlin
abstract class GenerateFileTask : DefaultTask() {
    @get:Input
    abstract val content: Property<String>

    @get:OutputFile
    abstract val outputFile: RegularFileProperty

    @TaskAction
    fun run() {
        outputFile.get().asFile.writeText(content.get())
    }
}
```

如果不声明输入输出，Gradle 无法准确判断任务是否需要执行。

### 28.4 强制重新执行

```bash
./gradlew build --rerun-tasks
```

### 28.5 clean 是否总是必要

不建议每次都 `clean build`。

原因：

```text
clean 会删除输出，破坏增量构建优势。
```

CI 可以根据需要使用 `clean`，本地开发通常直接：

```bash
./gradlew test
./gradlew build
```

## 29. Build Cache 构建缓存

### 29.1 构建缓存是什么

Build Cache 用于复用任务输出。

如果两个任务的输入完全一致，Gradle 可以直接从缓存恢复输出，而不是重新执行。

常见输出：

```text
> Task :app:compileJava FROM-CACHE
```

### 29.2 启用本地构建缓存

命令：

```bash
./gradlew build --build-cache
```

或 `gradle.properties`：

```properties
org.gradle.caching=true
```

### 29.3 settings.gradle.kts 配置

```kotlin
buildCache {
    local {
        isEnabled = true
    }
}
```

### 29.4 远程构建缓存

企业 CI 中可配置远程缓存：

```kotlin
buildCache {
    local {
        isEnabled = true
    }

    remote<HttpBuildCache> {
        url = uri("https://cache.example.com/cache/")
        isPush = providers.environmentVariable("CI").isPresent
    }
}
```

常见策略：

- CI 负责写入远程缓存。
- 开发者只读取远程缓存。
- 避免不可信本地输出污染远程缓存。

### 29.5 Build Cache 生效前提

任务必须：

- 正确声明输入输出。
- 输出可复现。
- 不依赖未声明的环境状态。
- 任务类型支持缓存。

## 30. Configuration Cache 配置缓存

### 30.1 配置缓存是什么

Configuration Cache 缓存配置阶段结果。

普通构建：

```text
初始化 -> 配置 -> 执行
```

配置缓存命中后：

```text
初始化 -> 复用配置结果 -> 执行
```

### 30.2 启用配置缓存

命令：

```bash
./gradlew build --configuration-cache
```

或 `gradle.properties`：

```properties
org.gradle.configuration-cache=true
```

### 30.3 什么时候收益大

配置缓存对大型多模块项目收益明显。

典型场景：

- Android 多模块项目
- Kotlin 多模块项目
- 插件较多的企业项目
- 配置阶段耗时较长的构建

### 30.4 常见不兼容原因

- 构建脚本在配置阶段读取任务输出。
- 使用 `project` 对象进入任务执行逻辑。
- 任务中访问不可序列化对象。
- 使用 `afterEvaluate` 做复杂跨项目配置。
- 在配置阶段读取环境状态但未声明。

### 30.5 修复方向

推荐：

- 使用 Provider API。
- 使用 `tasks.register`。
- 使用 `tasks.named`。
- 避免配置阶段解析依赖。
- 避免任务执行时捕获 Project。
- 将构建逻辑抽成插件并遵守 Gradle API。

## 31. Gradle Daemon 与性能优化

### 31.1 Gradle Daemon

Gradle Daemon 是后台常驻进程。

作用：

- 避免每次启动 JVM。
- 缓存 Gradle 内部状态。
- 提升连续构建速度。

查看 Daemon：

```bash
./gradlew --status
```

停止 Daemon：

```bash
./gradlew --stop
```

### 31.2 JVM 参数

`gradle.properties`：

```properties
org.gradle.jvmargs=-Xmx4g -Dfile.encoding=UTF-8
```

Android 大项目可能需要：

```properties
org.gradle.jvmargs=-Xmx6g -XX:MaxMetaspaceSize=1g -Dfile.encoding=UTF-8
```

不要盲目设置过大内存，否则可能影响系统整体性能。

### 31.3 并行构建

```properties
org.gradle.parallel=true
```

或命令：

```bash
./gradlew build --parallel
```

适合多模块项目。

### 31.4 性能分析

生成 profile：

```bash
./gradlew build --profile
```

生成 Build Scan：

```bash
./gradlew build --scan
```

关注：

- 配置阶段耗时
- 慢任务
- 依赖下载耗时
- 测试耗时
- 缓存命中率
- 插件耗时

### 31.5 常见优化方向

- 使用 Wrapper 固定版本。
- 使用较新的 Gradle 和插件版本。
- 使用 `implementation` 替代不必要的 `api`。
- 启用构建缓存。
- 尝试配置缓存。
- 避免每次 clean。
- 减少根脚本 `subprojects` 复杂逻辑。
- 使用 convention plugin。
- 避免配置阶段解析依赖。
- 优化测试任务。
- Android 项目减少无用 flavor 和 module。

## 32. 测试、代码质量与报告

### 32.1 JUnit 5

```kotlin
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.12.0")
}

tasks.test {
    useJUnitPlatform()
}
```

运行：

```bash
./gradlew test
```

### 32.2 测试报告

默认位置：

```text
build/reports/tests/test/index.html
```

### 32.3 过滤测试

```bash
./gradlew test --tests "com.example.UserServiceTest"
./gradlew test --tests "*UserServiceTest"
./gradlew test --tests "*shouldCreateUser"
```

### 32.4 JaCoCo

```kotlin
plugins {
    jacoco
}

tasks.jacocoTestReport {
    dependsOn(tasks.test)
    reports {
        xml.required.set(true)
        html.required.set(true)
    }
}
```

运行：

```bash
./gradlew test jacocoTestReport
```

### 32.5 Checkstyle

```kotlin
plugins {
    checkstyle
}

checkstyle {
    toolVersion = "10.21.0"
}
```

### 32.6 常见验证任务

| 任务 | 作用 |
| :--- | :--- |
| `test` | 运行单元测试 |
| `check` | 运行所有验证任务 |
| `jacocoTestReport` | 生成覆盖率报告 |
| `checkstyleMain` | 检查主代码 |
| `checkstyleTest` | 检查测试代码 |
| `lintDebug` | Android Lint |

## 33. 打包与发布

### 33.1 jar

```bash
./gradlew jar
```

输出：

```text
build/libs/
```

### 33.2 Maven Publish 插件

```kotlin
plugins {
    `java-library`
    `maven-publish`
}

group = "com.example"
version = "1.0.0"

publishing {
    publications {
        create<MavenPublication>("mavenJava") {
            from(components["java"])
        }
    }

    repositories {
        maven {
            name = "internal"
            url = uri("https://repo.example.com/repository/maven-releases/")
            credentials {
                username = providers.gradleProperty("repoUser").orNull
                password = providers.gradleProperty("repoPassword").orNull
            }
        }
    }
}
```

发布：

```bash
./gradlew publish
```

发布到本地 Maven 仓库：

```bash
./gradlew publishToMavenLocal
```

### 33.3 sourcesJar 和 javadocJar

```kotlin
java {
    withSourcesJar()
    withJavadocJar()
}
```

发布库时通常需要源码包和文档包。

### 33.4 SNAPSHOT 和 Release

```kotlin
version = "1.0.0-SNAPSHOT"
```

SNAPSHOT：

- 开发版本。
- 可以变化。
- 不适合生产依赖长期使用。

Release：

- 正式版本。
- 发布后不应覆盖。
- 适合生产环境使用。

## 34. CI/CD 中使用 Gradle

### 34.1 CI 中推荐命令

```bash
./gradlew clean check
```

或：

```bash
./gradlew build --stacktrace --warning-mode all
```

### 34.2 GitHub Actions 示例

```yaml
name: Build

on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21

      - uses: gradle/actions/setup-gradle@v4

      - name: Build
        run: ./gradlew build --stacktrace
```

### 34.3 CI 缓存

常见缓存目录：

```text
~/.gradle/caches
~/.gradle/wrapper
```

注意：

```text
不要缓存项目 build/ 目录作为长期策略，容易引入污染。
```

### 34.4 CI 最佳实践

- 使用 Wrapper。
- 固定 JDK 版本。
- 不依赖本地 IDE 配置。
- 敏感信息放 CI Secret。
- 开启依赖校验。
- 使用 `--stacktrace` 保留失败信息。
- 发布任务和普通构建任务分开。
- Release 发布前跑 `check`。

## 35. 依赖安全与供应链治理

### 35.1 依赖校验

Gradle 支持 dependency verification。

生成校验元数据：

```bash
./gradlew --write-verification-metadata sha256 build
```

常见文件：

```text
gradle/verification-metadata.xml
```

作用：

- 校验依赖文件哈希。
- 防止依赖被篡改。
- 提升供应链安全。

### 35.2 依赖锁定

启用：

```kotlin
dependencyLocking {
    lockAllConfigurations()
}
```

生成锁文件：

```bash
./gradlew dependencies --write-locks
```

作用：

- 固定解析结果。
- 避免动态版本导致构建不可复现。
- 便于审查依赖变化。

### 35.3 避免动态版本

不推荐：

```kotlin
implementation("com.example:lib:latest.release")
implementation("com.example:lib:1.+")
```

推荐：

```kotlin
implementation("com.example:lib:1.2.3")
```

### 35.4 SBOM

现代项目可生成 SBOM：

- CycloneDX
- SPDX

用途：

- 漏洞扫描
- 许可证合规
- 供应链审计

### 35.5 依赖锁定 Dependency Locking

依赖锁定用于把解析结果固定下来，减少“今天能构建、明天依赖漂移”的问题。

启用示例：

```kotlin
dependencyLocking {
    lockAllConfigurations()
}
```

生成或更新锁文件：

```bash
./gradlew dependencies --write-locks
```

适合：

- CI/CD 构建。
- 发布库或应用。
- 依赖版本治理严格的企业项目。

### 35.6 依赖验证 Dependency Verification

依赖验证可以校验下载的依赖文件，降低依赖被篡改的风险。

生成验证元数据：

```bash
./gradlew --write-verification-metadata sha256 help
```

会生成：

```text
gradle/verification-metadata.xml
```

建议把该文件提交到仓库，并在依赖升级时审查变更。

## 36. 常见错误排查

### 36.1 Could not resolve dependency

现象：

```text
Could not resolve all files for configuration ':runtimeClasspath'
```

常见原因：

- 仓库没配置。
- 网络不可用。
- 依赖版本不存在。
- 私服认证失败。
- Gradle 离线模式。
- 本地缓存损坏。

排查：

```bash
./gradlew dependencies --configuration runtimeClasspath
./gradlew build --refresh-dependencies
./gradlew build --info
```

### 36.2 Plugin was not found

常见原因：

- `pluginManagement.repositories` 缺少 `gradlePluginPortal()`。
- Android 插件缺少 `google()`。
- 插件 id 写错。
- 插件版本不存在。

检查：

```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### 36.3 Unsupported class file major version

常见原因：

- Gradle 版本不支持当前 JDK。
- 插件不支持当前 JDK。
- 编译目标和运行环境不匹配。

处理：

- 检查 `./gradlew -v`。
- 检查 Java 版本。
- 升级 Gradle Wrapper。
- 使用 Java Toolchain。

### 36.4 Deprecated Gradle features were used

现象：

```text
Deprecated Gradle features were used in this build, making it incompatible with Gradle 10.0.
```

排查：

```bash
./gradlew build --warning-mode all
```

处理：

- 找到弃用 API。
- 升级插件。
- 修改构建脚本。
- 不要等到大版本升级时集中处理。

### 36.5 依赖冲突导致 NoSuchMethodError

现象：

```text
java.lang.NoSuchMethodError
```

常见原因：

```text
编译时使用一个版本，运行时实际加载另一个版本。
```

排查：

```bash
./gradlew dependencyInsight --dependency jackson --configuration runtimeClasspath
```

解决：

- 使用 constraints。
- 使用 BOM。
- 排除错误传递依赖。
- 统一版本目录。

### 36.6 Android Duplicate class

现象：

```text
Duplicate class ... found in modules ...
```

原因：

- 两个依赖包含同名类。
- AndroidX 和 Support Library 混用。
- 引入了重复 jar。

排查：

```bash
./gradlew :app:dependencies --configuration debugRuntimeClasspath
./gradlew :app:dependencyInsight --dependency xxx --configuration debugRuntimeClasspath
```

### 36.7 Configuration cache problems

排查：

```bash
./gradlew build --configuration-cache
```

Gradle 会输出问题报告。

修复方向：

- 避免任务 action 捕获 Project。
- 避免配置阶段做 I/O。
- 使用 Provider API。
- 升级不兼容插件。

### 36.8 build 很慢

排查：

```bash
./gradlew build --scan
./gradlew build --profile
```

检查：

- 是否每次 clean。
- 是否依赖下载慢。
- 是否配置阶段慢。
- 是否测试慢。
- 是否存在无缓存任务。
- 是否有跨项目 eager configuration。

### 36.9 系统化排查流程

排查 Gradle 问题时按层次拆开：

1. 版本层：`./gradlew -v`，确认 Gradle、JVM、OS、Kotlin/Android 插件兼容。
2. 脚本层：`./gradlew help --warning-mode all`，先让配置阶段成功。
3. 任务层：`./gradlew tasks --all`，确认任务是否存在。
4. 依赖层：`dependencies` 和 `dependencyInsight` 查 classpath。
5. 性能层：`--scan`、`--profile`、configuration cache 报告定位慢点。
6. 缓存层：确认任务 input/output 是否声明正确，是否每次 `clean`。
7. CI 层：确认 JDK、环境变量、Gradle User Home、网络代理和私服凭证。

常用组合：

```bash
./gradlew help --warning-mode all
./gradlew build --stacktrace --info
./gradlew dependencyInsight --dependency guava --configuration runtimeClasspath
./gradlew build --configuration-cache
./gradlew build --scan
```

### 36.10 clean 不是万能解法

`clean` 可以排除部分旧产物影响，但会破坏增量构建和缓存收益。长期依赖 `clean build` 往往说明：

- 任务 input/output 声明不完整。
- 有任务写入了未声明输出。
- 代码生成目录混乱。
- 插件不支持增量或配置缓存。
- 构建脚本在配置阶段做了不可复现操作。

## 37. Gradle 最佳实践

### 37.1 永远优先使用 Wrapper

项目命令统一写：

```bash
./gradlew build
```

不要要求团队成员全局安装 Gradle。

### 37.2 新项目优先 Kotlin DSL

推荐：

```text
build.gradle.kts
settings.gradle.kts
```

### 37.3 统一仓库配置

仓库放在 `settings.gradle.kts`：

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
```

### 37.4 使用 Version Catalog

推荐：

```text
gradle/libs.versions.toml
```

集中管理：

- 插件版本
- 依赖版本
- 依赖别名
- 测试依赖 bundle

### 37.5 少用 allprojects / subprojects

不推荐在根脚本写大量：

```kotlin
allprojects { }
subprojects { }
```

推荐：

- convention plugin
- settings 中统一仓库
- 子模块显式应用约定插件

### 37.6 优先 implementation

库模块中：

```kotlin
implementation(...)
```

只有 public API 暴露依赖类型时才使用：

```kotlin
api(...)
```

### 37.7 不使用动态版本

避免：

```kotlin
implementation("com.example:lib:1.+")
```

### 37.8 不把敏感信息写进构建脚本

不要：

```kotlin
password = "123456"
```

推荐：

- Gradle properties
- 环境变量
- CI secrets

### 37.9 让自定义任务声明输入输出

否则：

- 无法增量构建。
- 无法缓存。
- 无法正确并行。

### 37.10 升级前先看兼容矩阵

升级时检查：

- Gradle 版本
- JDK 版本
- Kotlin Gradle Plugin
- Android Gradle Plugin
- Spring Boot Gradle Plugin
- 第三方插件

### 37.11 不要每次 clean build

本地开发优先：

```bash
./gradlew test
./gradlew build
```

只有遇到缓存异常或 CI 策略需要时才 clean。

## 38. 学习路线

### 阶段 1：会用 Gradle

掌握：

- `./gradlew build`
- `./gradlew test`
- `./gradlew clean`
- `./gradlew tasks`
- `./gradlew dependencies`
- Wrapper 文件作用

### 阶段 2：理解项目结构

掌握：

- `settings.gradle.kts`
- `build.gradle.kts`
- `gradle.properties`
- `libs.versions.toml`
- 单模块和多模块结构

### 阶段 3：理解任务和生命周期

掌握：

- 初始化阶段
- 配置阶段
- 执行阶段
- task graph
- `dependsOn`
- `tasks.register`
- `tasks.named`

### 阶段 4：理解依赖管理

掌握：

- `implementation`
- `api`
- `compileOnly`
- `runtimeOnly`
- `testImplementation`
- 传递依赖
- 版本冲突
- `dependencyInsight`
- BOM / platform

### 阶段 5：理解插件

掌握：

- 核心插件
- 外部插件
- `pluginManagement`
- `apply false`
- convention plugin

### 阶段 6：理解性能优化

掌握：

- Daemon
- 增量构建
- Build Cache
- Configuration Cache
- 懒配置
- Build Scan

### 阶段 7：工程实践

掌握：

- 多模块治理
- 发布到 Maven 仓库
- CI/CD 构建
- 依赖锁定
- 依赖校验
- Android 构建变体
- 构建逻辑复用

## 39. 命令速查表

### 39.1 基础

```bash
./gradlew -v
./gradlew help
./gradlew tasks
./gradlew tasks --all
./gradlew projects
./gradlew properties
```

### 39.2 构建

```bash
./gradlew clean
./gradlew assemble
./gradlew check
./gradlew build
```

### 39.3 Java

```bash
./gradlew compileJava
./gradlew classes
./gradlew test
./gradlew jar
```

### 39.4 Application

```bash
./gradlew run
./gradlew installDist
./gradlew distZip
```

### 39.5 Android

```bash
./gradlew assembleDebug
./gradlew installDebug
./gradlew testDebugUnitTest
./gradlew connectedDebugAndroidTest
./gradlew lintDebug
./gradlew assembleRelease
./gradlew bundleRelease
./gradlew signingReport
```

### 39.6 依赖

```bash
./gradlew dependencies
./gradlew dependencies --configuration runtimeClasspath
./gradlew dependencyInsight --dependency guava --configuration runtimeClasspath
./gradlew buildEnvironment
```

### 39.7 缓存和性能

```bash
./gradlew build --build-cache
./gradlew build --configuration-cache
./gradlew build --parallel
./gradlew build --scan
./gradlew build --profile
```

### 39.8 调试

```bash
./gradlew build --stacktrace
./gradlew build --info
./gradlew build --debug
./gradlew build --warning-mode all
./gradlew build --refresh-dependencies
./gradlew build --rerun-tasks
```

### 39.9 发布

```bash
./gradlew publish
./gradlew publishToMavenLocal
```

### 39.10 Wrapper

```bash
gradle wrapper
./gradlew wrapper --gradle-version=9.5.1
./gradlew wrapper
```

## 40. 参考资料与扩展阅读

建议优先阅读 Gradle 官方文档：

- [Gradle Releases](https://gradle.org/releases/)
- [Gradle Release Notes](https://docs.gradle.org/current/release-notes.html)
- [Gradle User Manual](https://docs.gradle.org/current/userguide/userguide.html)
- [Installing Gradle](https://docs.gradle.org/current/userguide/installation.html)
- [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)
- [Understanding Tasks](https://docs.gradle.org/current/userguide/more_about_tasks.html)
- [Declaring Dependencies](https://docs.gradle.org/current/userguide/dependencies_intermediate.html)
- [Dependency Configurations](https://docs.gradle.org/current/userguide/dependency_configurations.html)
- [Version Catalogs](https://docs.gradle.org/current/userguide/version_catalogs.html)
- [Incremental Build](https://docs.gradle.org/current/userguide/incremental_build.html)
- [Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)
- [Configuration Cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
- [Lazy Configuration](https://docs.gradle.org/current/userguide/lazy_configuration.html)
- [Dependency Locking](https://docs.gradle.org/current/userguide/dependency_locking.html)
- [Dependency Verification](https://docs.gradle.org/current/userguide/dependency_verification.html)
- [Toolchains for JVM projects](https://docs.gradle.org/current/userguide/toolchains.html)
- [Build Scans](https://docs.gradle.com/gradle-enterprise/gradle-plugin/)
- [Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)

实践检索关键词：

- `Gradle dependencyInsight 依赖冲突`
- `Gradle configuration cache problems`
- `Gradle build cache incremental build`
- `Gradle version catalog libs.versions.toml`
- `Gradle wrapper validation dependency verification`

## 最后总结

Gradle 的核心可以浓缩为：

```text
Wrapper 固定 Gradle 版本
settings 决定构建结构
build script 配置项目
plugin 添加能力和约定
dependency 声明依赖
configuration 决定依赖作用域
task 执行具体工作
task graph 决定执行顺序
incremental build 避免重复执行
build cache 复用任务输出
configuration cache 复用配置结果
version catalog 统一依赖版本
convention plugin 复用构建逻辑
```

学习 Gradle 时不要只背命令，而要理解一条命令背后的流程。

例如：

```bash
./gradlew clean build
```

背后大致发生：

1. Wrapper 检查并使用指定 Gradle 版本。
2. Gradle 读取 `settings.gradle.kts`。
3. Gradle 确定参与构建的项目。
4. Gradle 执行构建脚本并应用插件。
5. 插件注册任务和依赖配置。
6. Gradle 根据请求的 `clean` 和 `build` 生成任务图。
7. Gradle 解析需要的依赖。
8. Gradle 判断任务是否可跳过或可从缓存恢复。
9. Gradle 按任务图执行任务。
10. Gradle 输出测试报告、构建产物和错误信息。

当你能解释 `implementation`、`api`、`runtimeClasspath`、`tasks.register`、`configuration cache`、`dependencyInsight`、`libs.versions.toml`、`pluginManagement` 这些概念，并能用它们排查真实项目问题时，才算真正入门 Gradle。
