---
---

# 简介

Maven 是一个项目管理工具，可以对 Java 项目进行构建、依赖管理。
Maven 也可被用于构建和管理各种项目，例如 C#，Ruby，Scala 和其他语言编写的项目
Maven 是一个 项目管理与构建自动化工具，主要用于 Java 项目，但也可用于其他语言（如 Kotlin、Scala）。

Maven 解决了软件构建的两方面问题：
- 一是软件是如何构建的。
- 二是软件的依赖关系。


**Maven功能**：
- 构建
- 文档生成
- 报告
- 依赖
- SCMs
- 发布
- 分发
- 邮件列表

**Maven核心功能**包括：
- 项目构建（编译、测试、打包、部署）
- 赖管理（自动下载和管理第三方库）
- 标准化项目结构（约定优于配置）
- 插件扩展（支持自定义构建流程)

**Maven 特点**
- 约定优于配置：提供标准化的项目结构和构建生命周期(提供 clean、compile、test、package 等标准生命周期,快速生成项目结构（如 maven-archetype-quickstart）)
- 依赖管理：自动处理项目依赖关系(自动下载和管理 .jar 文件，避免手动管理依赖)
- 插件体系：丰富的插件支持各种构建任务(支持自定义构建任务（如 maven-compiler-plugin 指定 Java 版本）)
- 多模块支持：简化大型项目的管理(适用于大型项目，可以拆分为多个子模块)
- 中央仓库：访问全球共享的库资源

**约定配置**
Maven 提倡使用一个共同的标准目录结构，Maven 使用约定优于配置的原则，尽可能的遵守这样的目录结构。
如下所示：

|目录	|目的|
|---|---|
|${basedir}	|存放pom.xml和所有的子目录|
|${basedir}/src/main/java	|项目的java源代码|
|${basedir}/src/main/resources	|项目的资源，比如说property文件，springmvc.xml|
|${basedir}/src/test/java	|项目的测试类，比如说Junit代码|
|${basedir}/src/test/resources	|测试用的资源|
|${basedir}/src/main/webapp/WEB-INF	|web应用文件目录，web项目的信息，比如存放web.xml、本地图片、jsp视图页面|
|${basedir}/target	|打包输出目录|
|${basedir}/target/classes	|编译输出目录|
|${basedir}/target/test-classes	|测试编译输出目录|
|Test.java	|Maven只会自动运行符合该命名规则的测试类|
|~/.m2/repository	|Maven默认的本地仓库目录位置|


**Mave vs Gradle**

|特性	|Maven	|Gradle|
|---|---|---|
|核心模型	|生命周期 (线性阶段)	|任务依赖图 (有向无环图)|
|流程定义	|声明式：你声明项目最终要达到的阶段，Maven负责执行所有前置步骤。	|可编程的：通过DSL（Groovy/Kotlin）定义任务及其依赖关系，可以编写复杂的构建逻辑。|
|性能	|全量构建：每次都会执行阶段中的所有目标，即使只有一小部分代码发生变化。	|增量构建：通过跟踪任务的输入/输出，仅执行那些输入发生变化的任务，并支持构建缓存和常驻进程，速度通常快很多。|
|配置文件	|pom.xml (XML)	|build.gradle (Groovy) 或 build.gradle.kts (Kotlin)|
|适用场景	|中小型项目、结构标准化的项目、对构建速度不敏感的团队。	|大型多模块项目、需要高度定制构建逻辑的项目、Android开发|









