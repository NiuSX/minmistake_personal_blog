# Maven 完整学习笔记

> 适合对象：Java 初学者、后端开发学习者、Spring Boot 学习者、需要系统掌握 Java 项目构建和依赖管理的人。

Maven 是 Java 生态中非常重要的项目构建和依赖管理工具。它不仅能下载 jar 包，还负责项目标准目录、编译、测试、打包、安装、发布、插件执行、多模块管理、依赖传递、版本统一、私服部署和 CI/CD 构建。

如果你只会执行 `mvn package`，还不算真正理解 Maven。真正掌握 Maven，需要理解：POM 是什么、坐标是什么、依赖如何解析、生命周期如何驱动插件、插件 goal 如何绑定到 phase、多模块如何聚合构建、父 POM 和 dependencyManagement 有什么区别、settings.xml 和 pom.xml 分别管什么、为什么会依赖冲突、如何排查构建失败。

版本说明：截至 2026-06-07，Apache Maven 官方下载页显示 Maven 3.9.16 是当前推荐版本；Maven 4.0.0-rc-5 是预览版本，官方提示 Maven 4 仍在开发中，不建议用于生产。Maven 3.9+ 运行 Maven 本身需要 JDK 8 或以上；Maven 4.0+ 运行 Maven 本身需要 JDK 17 或以上。具体版本请始终以 Apache Maven 官方下载页为准。

## 目录

1. Maven 是什么
2. Maven 解决什么问题
3. Maven、Gradle、Ant 的区别
4. Maven 安装与环境配置
5. Maven 核心概念总览
6. Maven 标准目录结构
7. POM 是什么
8. Maven 坐标
9. packaging 打包类型
10. Super POM 与 Effective POM
11. Maven 生命周期
12. phase、goal、plugin 的关系
13. 常用 Maven 命令
14. 依赖管理基础
15. 依赖作用域 scope
16. 传递依赖
17. 依赖冲突与版本调解
18. optional 和 exclusions
19. dependencyManagement
20. BOM
21. properties 属性
22. repositories 仓库
23. 本地仓库、中央仓库、远程仓库
24. settings.xml
25. mirror 镜像
26. profile 构建环境
27. 插件 plugin
28. pluginManagement
29. 常用插件详解
30. 资源文件与过滤
31. 测试：Surefire 与 Failsafe
32. 多模块项目
33. 父 POM 与聚合 POM
34. Maven Wrapper
35. Archetype 项目模板
36. SNAPSHOT 与 Release
37. 发布到私服 Nexus / Artifactory
38. Maven 与 Spring Boot
39. Maven 与 CI/CD
40. 依赖安全与依赖治理
41. 常见错误排查
42. Maven 最佳实践
43. 学习路线
44. 常用命令速查
45. 官方参考资料

## 1. Maven 是什么

Maven 是 Apache 开源的项目管理和构建工具，主要用于 Java 项目。

它的核心功能：

- 项目构建
- 依赖管理
- 插件执行
- 测试
- 打包
- 安装到本地仓库
- 发布到远程仓库
- 多模块管理
- 项目文档和报告

Maven 的核心思想：

```text
约定优于配置
```

也就是说，只要你按 Maven 推荐的目录结构组织项目，Maven 就知道：

- 源代码在哪里
- 测试代码在哪里
- 资源文件在哪里
- 编译结果放哪里
- 打包结果放哪里

你不需要为每个项目重复写大量构建脚本。

## 2. Maven 解决什么问题

### 2.1 依赖管理问题

没有 Maven 时，Java 项目依赖 jar 包通常要手动下载，然后放到 `lib` 目录。

问题：

- jar 包版本容易混乱
- 依赖的依赖也要手动找
- 团队成员本地 jar 不一致
- 升级版本很麻烦
- 不知道 jar 从哪里来

Maven 解决方式：

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-context</artifactId>
  <version>6.2.0</version>
</dependency>
```

Maven 会自动下载这个依赖，以及它需要的传递依赖。

### 2.2 构建流程问题

没有统一工具时，每个项目构建方式不同：

- 有的用脚本
- 有的用 IDE
- 有的手动编译
- 有的手动打包

Maven 提供统一命令：

```bash
mvn clean
mvn compile
mvn test
mvn package
mvn install
```

### 2.3 项目结构问题

Maven 提供标准目录。

这样团队成员看到项目就知道：

- 主代码在哪里
- 测试代码在哪里
- 配置文件在哪里
- 构建产物在哪里

### 2.4 多模块管理问题

大型 Java 项目通常拆成多个模块：

- api
- common
- service
- web
- data

Maven 可以管理模块之间依赖和构建顺序。

## 3. Maven、Gradle、Ant 的区别

| 工具 | 特点 | 适合场景 |
| :--- | :--- | :--- |
| Ant | 早期构建工具，过程式脚本 | 老项目 |
| Maven | 约定优于配置，依赖管理成熟 | Java 后端、企业项目 |
| Gradle | 灵活、性能好、脚本能力强 | Android、复杂构建 |

### 3.1 Maven 优点

- 标准化强
- 学习资料多
- Java 生态支持好
- 企业项目常用
- 依赖管理成熟
- 多模块项目稳定

### 3.2 Maven 缺点

- XML 配置较冗长
- 灵活性不如 Gradle
- 复杂定制时不够直观
- 构建性能有时不如 Gradle

### 3.3 初学建议

如果你学习 Java 后端、Spring Boot、企业项目：

```text
先学 Maven
```

因为 Maven 是大量 Java 项目的基础。

## 4. Maven 安装与环境配置

### 4.1 前置条件

需要安装 JDK。

检查：

```bash
java -version
javac -version
```

Maven 3.9+ 运行 Maven 本身需要 JDK 8+。

注意：

运行 Maven 的 JDK 和项目编译目标版本不是一回事。项目可以通过 compiler 配置或 toolchains 指定目标 Java 版本。

### 4.2 安装 Maven

常见方式：

- 从 Apache Maven 官网下载 zip / tar.gz
- 使用 SDKMAN
- 使用 Homebrew
- 使用系统包管理器
- 使用 Maven Wrapper

Windows 手动安装大致步骤：

1. 下载 Maven binary zip
2. 解压到目录，例如 `D:\dev\apache-maven`
3. 配置环境变量 `MAVEN_HOME`
4. 把 `%MAVEN_HOME%\bin` 加入 `Path`
5. 打开新终端验证

验证：

```bash
mvn -version
```

### 4.3 mvn -version 输出看什么

示例关注：

```text
Apache Maven ...
Maven home: ...
Java version: ...
Java home: ...
OS name: ...
```

需要确认：

- Maven 版本正确
- Java 版本正确
- Java home 正确

## 5. Maven 核心概念总览

| 概念 | 含义 |
| :--- | :--- |
| POM | Maven 项目配置文件 |
| groupId | 组织或公司标识 |
| artifactId | 项目或模块名 |
| version | 版本号 |
| packaging | 打包类型 |
| dependency | 项目依赖 |
| repository | 仓库 |
| lifecycle | 生命周期 |
| phase | 生命周期阶段 |
| plugin | 插件 |
| goal | 插件目标 |
| scope | 依赖作用域 |
| profile | 环境配置 |
| module | 多模块子项目 |

Maven 的核心可以这样理解：

```text
POM 描述项目
坐标定位项目
依赖声明需要什么
仓库提供依赖
生命周期定义构建流程
插件执行具体任务
```

## 6. Maven 标准目录结构

标准结构：

```text
my-app/
  pom.xml
  src/
    main/
      java/
      resources/
    test/
      java/
      resources/
  target/
```

### 6.1 目录说明

| 目录 | 作用 |
| :--- | :--- |
| `pom.xml` | Maven 配置文件 |
| `src/main/java` | 主 Java 源码 |
| `src/main/resources` | 主资源文件 |
| `src/test/java` | 测试 Java 源码 |
| `src/test/resources` | 测试资源文件 |
| `target` | 构建输出目录 |

### 6.2 Web 项目常见目录

```text
src/main/webapp
```

用于传统 WAR 项目的 Web 资源。

### 6.3 为什么目录结构重要

因为 Maven 默认按这个结构工作。

如果你遵守约定，就少写配置。

如果你不遵守，就需要额外配置插件和路径。

## 7. POM 是什么

POM 是 Project Object Model，项目对象模型。

文件名：

```text
pom.xml
```

它描述：

- 项目坐标
- 项目名称
- 项目版本
- 打包方式
- 依赖
- 插件
- 构建配置
- 模块
- 仓库
- profile

### 7.1 最小 POM

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>demo</artifactId>
  <version>1.0.0</version>
</project>
```

### 7.2 常见 POM 元素

| 元素 | 作用 |
| :--- | :--- |
| modelVersion | POM 模型版本，通常是 4.0.0 |
| groupId | 组织标识 |
| artifactId | 项目标识 |
| version | 项目版本 |
| packaging | 打包方式 |
| name | 项目名称 |
| description | 项目描述 |
| properties | 属性 |
| dependencies | 依赖 |
| dependencyManagement | 依赖版本管理 |
| build | 构建配置 |
| plugins | 插件 |
| profiles | 环境配置 |
| modules | 多模块 |

## 8. Maven 坐标

Maven 用坐标唯一定位一个构件。

核心坐标：

```text
groupId:artifactId:version
```

完整还可能包含：

```text
groupId:artifactId:packaging:classifier:version
```

### 8.1 groupId

通常是公司或组织域名反写。

例子：

```text
com.example
org.springframework
com.fasterxml.jackson.core
```

### 8.2 artifactId

项目或模块名称。

例子：

```text
spring-core
jackson-databind
my-service
```

### 8.3 version

版本号。

例子：

```text
1.0.0
1.0.0-SNAPSHOT
2.3.1
```

### 8.4 坐标例子

```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.17.2</version>
</dependency>
```

## 9. packaging 打包类型

packaging 表示项目打包方式。

常见：

| packaging | 含义 |
| :--- | :--- |
| jar | 普通 Java jar |
| war | Web 应用 |
| pom | 父工程或聚合工程 |
| maven-plugin | Maven 插件 |
| ear | 企业应用归档 |

如果不写：

```text
默认 jar
```

### 9.1 jar

普通 Java 项目。

### 9.2 war

传统 Servlet Web 项目。

Spring Boot 现在更常打可执行 jar，但仍可打 war。

### 9.3 pom

常用于：

- 父 POM
- 多模块聚合 POM
- BOM

父工程通常：

```xml
<packaging>pom</packaging>
```

## 10. Super POM 与 Effective POM

### 10.1 Super POM

Maven 内置一个默认父 POM，所有项目都会继承它。

它提供默认配置，例如：

- 默认目录
- 默认插件绑定
- 默认仓库

### 10.2 Effective POM

Effective POM 是最终生效的 POM。

它由多部分合并：

- Super POM
- 父 POM
- 当前 POM
- profiles
- 默认配置

查看：

```bash
mvn help:effective-pom
```

这是排查配置问题的重要命令。

## 11. Maven 生命周期

Maven 生命周期定义构建流程。

Maven 有三套主要生命周期：

| 生命周期 | 作用 |
| :--- | :--- |
| clean | 清理构建输出 |
| default | 编译、测试、打包、安装、部署 |
| site | 生成项目站点文档 |

### 11.1 clean 生命周期

常用阶段：

```text
pre-clean
clean
post-clean
```

常用命令：

```bash
mvn clean
```

作用：

- 删除 `target` 目录

### 11.2 default 生命周期

最常用。

重要阶段：

| phase | 作用 |
| :--- | :--- |
| validate | 验证项目是否正确 |
| compile | 编译主代码 |
| test | 运行单元测试 |
| package | 打包 |
| verify | 验证包是否符合质量要求 |
| install | 安装到本地仓库 |
| deploy | 部署到远程仓库 |

### 11.3 phase 是顺序执行的

执行：

```bash
mvn package
```

会依次执行：

```text
validate -> compile -> test -> package
```

执行：

```bash
mvn install
```

会执行到 install 之前的所有阶段。

## 12. phase、goal、plugin 的关系

这是 Maven 最重要也最容易混淆的部分。

### 12.1 lifecycle

生命周期是一套流程。

例如 default lifecycle。

### 12.2 phase

phase 是生命周期中的阶段。

例如：

- compile
- test
- package

### 12.3 plugin

plugin 是真正干活的插件。

例如：

- maven-compiler-plugin
- maven-surefire-plugin
- maven-jar-plugin

### 12.4 goal

goal 是插件中的具体任务。

例如：

```text
compiler:compile
surefire:test
jar:jar
```

### 12.5 关系总结

```text
执行 phase
  -> Maven 找到绑定到这个 phase 的 plugin goal
    -> plugin goal 执行具体任务
```

例如：

```bash
mvn compile
```

会触发 compiler 插件的 compile goal。

### 12.6 直接执行插件 goal

```bash
mvn dependency:tree
mvn help:effective-pom
```

这不是执行生命周期阶段，而是直接执行某个插件 goal。

## 13. 常用 Maven 命令

### 13.1 清理

```bash
mvn clean
```

删除 `target`。

### 13.2 编译

```bash
mvn compile
```

编译主代码。

### 13.3 测试

```bash
mvn test
```

运行单元测试。

### 13.4 打包

```bash
mvn package
```

生成 jar / war。

### 13.5 安装到本地仓库

```bash
mvn install
```

把构件安装到本地仓库。

### 13.6 部署到远程仓库

```bash
mvn deploy
```

发布到 Nexus、Artifactory 等远程仓库。

### 13.7 跳过测试

只跳过测试执行：

```bash
mvn package -DskipTests
```

跳过测试编译和执行：

```bash
mvn package -Dmaven.test.skip=true
```

一般更推荐 `-DskipTests`。

### 13.8 强制更新依赖

```bash
mvn clean package -U
```

`-U` 强制更新 SNAPSHOT 依赖。

### 13.9 查看依赖树

```bash
mvn dependency:tree
```

## 14. 依赖管理基础

依赖写在：

```xml
<dependencies>
  <dependency>
    ...
  </dependency>
</dependencies>
```

### 14.1 基本依赖

```xml
<dependency>
  <groupId>org.apache.commons</groupId>
  <artifactId>commons-lang3</artifactId>
  <version>3.17.0</version>
</dependency>
```

### 14.2 Maven 如何下载依赖

流程：

```text
查本地仓库
  -> 没有则查远程仓库
    -> 下载到本地仓库
      -> 加入项目 classpath
```

默认远程仓库通常是 Maven Central。

### 14.3 本地仓库路径

默认：

```text
~/.m2/repository
```

Windows 通常：

```text
C:\Users\<用户名>\.m2\repository
```

## 15. 依赖作用域 scope

scope 决定依赖在哪些阶段可用。

| scope | 编译 | 测试 | 运行 | 打包 | 典型用途 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| compile | 是 | 是 | 是 | 是 | 默认 |
| provided | 是 | 是 | 否 | 否 | Servlet API |
| runtime | 否 | 是 | 是 | 是 | JDBC 驱动 |
| test | 否 | 是 | 否 | 否 | JUnit |
| system | 是 | 是 | 否 | 否 | 不推荐 |
| import | 特殊 | 特殊 | 特殊 | 特殊 | BOM 导入 |

### 15.1 compile

默认 scope。

编译、测试、运行都需要。

### 15.2 provided

编译需要，运行环境提供。

例子：

```xml
<dependency>
  <groupId>jakarta.servlet</groupId>
  <artifactId>jakarta.servlet-api</artifactId>
  <version>6.1.0</version>
  <scope>provided</scope>
</dependency>
```

### 15.3 runtime

编译不需要，运行需要。

例子：

- 数据库驱动

### 15.4 test

只在测试时需要。

例子：

- JUnit
- Mockito

### 15.5 system

不推荐。

需要手动指定本地 jar 路径，破坏可移植性。

## 16. 传递依赖

如果你的项目依赖 A，而 A 依赖 B，那么你的项目也会间接依赖 B。

这叫传递依赖。

例子：

```text
你的项目 -> spring-web -> spring-core
```

Maven 会自动处理传递依赖。

### 16.1 好处

- 不用手动写所有间接依赖
- 依赖声明更简洁

### 16.2 风险

- 引入不需要的 jar
- 版本冲突
- 安全漏洞来自传递依赖
- 包体积膨胀

查看：

```bash
mvn dependency:tree
```

## 17. 依赖冲突与版本调解

同一个依赖可能被不同路径引入不同版本。

例子：

```text
project -> A -> C:1.0
project -> B -> C:2.0
```

Maven 需要决定用哪个版本。

### 17.1 最近路径优先

Maven 依赖调解通常遵循 nearest definition。

路径更短的版本优先。

### 17.2 路径长度相同

如果路径长度相同，通常先声明的依赖优先。

### 17.3 如何解决冲突

推荐方式：

- 在当前项目直接声明需要的版本
- 使用 dependencyManagement 统一版本
- 使用 BOM
- 排除错误传递依赖

## 18. optional 和 exclusions

### 18.1 optional

optional 表示这个依赖不会自动传递给下游项目。

```xml
<dependency>
  <groupId>com.example</groupId>
  <artifactId>feature-x</artifactId>
  <version>1.0.0</version>
  <optional>true</optional>
</dependency>
```

适合：

- 可选功能
- 避免强制下游引入某依赖

### 18.2 exclusions

排除传递依赖。

```xml
<dependency>
  <groupId>com.example</groupId>
  <artifactId>demo-lib</artifactId>
  <version>1.0.0</version>
  <exclusions>
    <exclusion>
      <groupId>commons-logging</groupId>
      <artifactId>commons-logging</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

使用场景：

- 排除冲突依赖
- 排除安全漏洞依赖
- 排除不需要的日志实现

注意：

不要盲目排除，排除后可能运行时报 ClassNotFound。

## 19. dependencyManagement

dependencyManagement 用于统一依赖版本，但不会自动引入依赖。

### 19.1 例子

父 POM：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.17.2</version>
    </dependency>
  </dependencies>
</dependencyManagement>
```

子模块：

```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
</dependency>
```

子模块省略 version，但仍需要显式声明 dependency。

### 19.2 dependencyManagement 的作用

- 统一版本
- 避免子模块重复写版本
- 管理传递依赖版本
- 降低版本冲突

### 19.3 常见误区

误区：

```text
写进 dependencyManagement 就会自动引入依赖
```

纠正：

```text
不会。dependencyManagement 只管理版本。
```

## 20. BOM

BOM 是 Bill of Materials。

在 Maven 中，BOM 是一份依赖版本清单。

常用于统一一组相关依赖版本。

### 20.1 导入 BOM

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>3.4.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

### 20.2 BOM 的作用

导入后，可以省略版本：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

版本由 BOM 管理。

### 20.3 BOM 适合

- Spring Boot
- Spring Cloud
- Quarkus
- Netty
- Jackson 依赖组
- 企业内部统一依赖版本

## 21. properties 属性

properties 用于定义变量。

### 21.1 定义 Java 版本

```xml
<properties>
  <maven.compiler.source>17</maven.compiler.source>
  <maven.compiler.target>17</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

### 21.2 定义依赖版本

```xml
<properties>
  <junit.version>5.11.0</junit.version>
</properties>
```

使用：

```xml
<version>${junit.version}</version>
```

### 21.3 常见内置属性

| 属性 | 含义 |
| :--- | :--- |
| `${project.groupId}` | 项目 groupId |
| `${project.artifactId}` | 项目 artifactId |
| `${project.version}` | 项目版本 |
| `${project.basedir}` | 项目根目录 |
| `${project.build.directory}` | 构建目录 |

## 22. repositories 仓库

repositories 用于声明远程依赖仓库。

```xml
<repositories>
  <repository>
    <id>my-repo</id>
    <url>https://repo.example.com/maven2</url>
  </repository>
</repositories>
```

### 22.1 不建议在业务项目乱写仓库

原因：

- 影响构建可重复性
- 可能引入不可信依赖
- 团队环境不统一

企业项目通常通过 settings.xml mirror 或私服统一管理仓库。

## 23. 本地仓库、中央仓库、远程仓库

### 23.1 本地仓库

默认：

```text
~/.m2/repository
```

作用：

- 缓存下载的依赖
- 保存本地 install 的构件

### 23.2 Maven Central

Maven 官方默认中央仓库。

大量开源 Java 依赖发布在这里。

### 23.3 私服

常见：

- Nexus Repository
- JFrog Artifactory

作用：

- 缓存中央仓库
- 发布公司内部 jar
- 管理权限
- 统一依赖来源
- 提升下载速度

## 24. settings.xml

settings.xml 是 Maven 用户或全局配置。

位置：

用户级：

```text
~/.m2/settings.xml
```

全局级：

```text
${MAVEN_HOME}/conf/settings.xml
```

### 24.1 settings.xml 管什么

常见：

- localRepository
- mirrors
- proxies
- servers
- profiles
- activeProfiles

### 24.2 pom.xml 和 settings.xml 区别

| 文件 | 作用 | 是否应提交代码仓库 |
| :--- | :--- | :--- |
| pom.xml | 项目构建配置 | 是 |
| settings.xml | 用户/机器环境配置 | 通常否 |

pom.xml 应描述项目本身。

settings.xml 应描述本地或企业环境。

## 25. mirror 镜像

mirror 用于把一个仓库请求镜像到另一个仓库。

常用于：

- 公司私服代理 Maven Central
- 国内镜像加速

### 25.1 示例

```xml
<mirrors>
  <mirror>
    <id>company-mirror</id>
    <mirrorOf>*</mirrorOf>
    <url>https://repo.company.com/repository/maven-public/</url>
  </mirror>
</mirrors>
```

### 25.2 mirrorOf

常见：

| mirrorOf | 含义 |
| :--- | :--- |
| `*` | 镜像所有仓库 |
| `central` | 只镜像 central |
| `external:*` | 外部仓库 |
| `*,!repo1` | 所有但排除 repo1 |

### 25.3 注意

mirror 是 settings.xml 配置，不建议写到 pom.xml。

## 26. profile 构建环境

profile 用于不同环境配置。

例如：

- dev
- test
- prod
- local

### 26.1 POM 中定义 profile

```xml
<profiles>
  <profile>
    <id>dev</id>
    <properties>
      <env.name>dev</env.name>
    </properties>
  </profile>
</profiles>
```

激活：

```bash
mvn package -Pdev
```

### 26.2 profile 可以做什么

- 切换属性
- 切换插件配置
- 切换依赖
- 切换资源过滤
- 切换仓库

### 26.3 不要滥用 profile

不要把大量业务差异都塞进 profile。

如果 dev/prod 差异主要是配置文件，通常交给应用配置系统更好。

## 27. 插件 plugin

Maven 插件是真正执行任务的组件。

### 27.1 插件配置位置

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.13.0</version>
      <configuration>
        <release>17</release>
      </configuration>
    </plugin>
  </plugins>
</build>
```

### 27.2 插件由 goal 组成

例如 maven-compiler-plugin：

- compiler:compile
- compiler:testCompile

### 27.3 插件版本要显式声明

推荐明确声明插件版本，尤其在企业项目和 CI 中。

否则 Maven 使用默认版本，可能随环境变化。

## 28. pluginManagement

pluginManagement 用于统一插件版本和默认配置，但不会自动执行插件。

父 POM：

```xml
<build>
  <pluginManagement>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.13.0</version>
        <configuration>
          <release>17</release>
        </configuration>
      </plugin>
    </plugins>
  </pluginManagement>
</build>
```

子模块：

```xml
<build>
  <plugins>
    <plugin>
      <artifactId>maven-compiler-plugin</artifactId>
    </plugin>
  </plugins>
</build>
```

### 28.1 pluginManagement 和 plugins 区别

| 配置 | 是否自动生效 |
| :--- | :--- |
| plugins | 会参与构建 |
| pluginManagement | 只管理版本和配置，子模块声明后才生效 |

## 29. 常用插件详解

### 29.1 maven-compiler-plugin

用于编译 Java。

推荐使用 `release`：

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>3.13.0</version>
  <configuration>
    <release>17</release>
  </configuration>
</plugin>
```

`release` 比单独 source/target 更能保证 API 兼容性。

### 29.2 maven-surefire-plugin

运行单元测试。

常用于：

```text
src/test/java
```

默认绑定到 test 阶段。

### 29.3 maven-failsafe-plugin

运行集成测试。

通常绑定：

- integration-test
- verify

常用于命名：

```text
*IT.java
```

### 29.4 maven-jar-plugin

打 jar 包。

可以配置 Manifest。

### 29.5 maven-source-plugin

打源码包。

常用于发布库。

### 29.6 maven-javadoc-plugin

生成 JavaDoc。

发布开源库到中央仓库时常需要。

### 29.7 maven-dependency-plugin

依赖分析。

常用：

```bash
mvn dependency:tree
mvn dependency:analyze
mvn dependency:copy-dependencies
```

### 29.8 maven-shade-plugin

打 fat jar / uber jar。

适合：

- 命令行工具
- 独立运行程序

注意：

- 可能有资源合并问题
- 可能有依赖冲突
- Spring Boot 项目通常用 spring-boot-maven-plugin

### 29.9 maven-assembly-plugin

打分发包。

例如：

- zip
- tar.gz
- 带脚本和配置的发布包

### 29.10 maven-enforcer-plugin

强制规则。

例如：

- Maven 版本
- Java 版本
- 禁止 SNAPSHOT 依赖
- 依赖收敛

非常适合企业项目。

## 30. 资源文件与过滤

资源文件目录：

```text
src/main/resources
src/test/resources
```

### 30.1 resources

构建时会复制到 classpath。

例如：

- application.yml
- logback.xml
- mapper.xml

### 30.2 资源过滤 filtering

可以把 Maven 属性替换到资源文件中。

POM：

```xml
<build>
  <resources>
    <resource>
      <directory>src/main/resources</directory>
      <filtering>true</filtering>
    </resource>
  </resources>
</build>
```

资源文件：

```text
app.version=${project.version}
```

### 30.3 注意

不要对二进制资源开启 filtering。

例如：

- 图片
- 字体
- keystore

否则文件可能损坏。

## 31. 测试：Surefire 与 Failsafe

### 31.1 单元测试

由 Surefire 执行。

命令：

```bash
mvn test
```

### 31.2 集成测试

由 Failsafe 执行。

通常：

```bash
mvn verify
```

### 31.3 为什么区分

单元测试：

- 快
- 不依赖外部服务
- 每次构建都跑

集成测试：

- 较慢
- 可能依赖数据库、容器、网络
- 通常在 verify 阶段运行

## 32. 多模块项目

大型项目常拆成多个模块。

结构：

```text
my-project/
  pom.xml
  common/
    pom.xml
  domain/
    pom.xml
  service/
    pom.xml
  web/
    pom.xml
```

父 POM：

```xml
<packaging>pom</packaging>

<modules>
  <module>common</module>
  <module>domain</module>
  <module>service</module>
  <module>web</module>
</modules>
```

### 32.1 Reactor

Maven 会构建 Reactor，自动分析模块依赖顺序。

例如：

```text
common -> domain -> service -> web
```

Maven 会先构建被依赖模块。

### 32.2 构建指定模块

```bash
mvn install -pl web
```

同时构建依赖模块：

```bash
mvn install -pl web -am
```

构建依赖当前模块的模块：

```bash
mvn install -pl common -amd
```

### 32.3 常用参数

| 参数 | 含义 |
| :--- | :--- |
| `-pl` | 指定模块 |
| `-am` | 同时构建所需依赖模块 |
| `-amd` | 同时构建依赖当前模块的模块 |
| `-T` | 并行构建 |

## 33. 父 POM 与聚合 POM

父 POM 和聚合 POM 经常是同一个文件，但概念不同。

### 33.1 父 POM

用于继承配置。

子模块中：

```xml
<parent>
  <groupId>com.example</groupId>
  <artifactId>my-parent</artifactId>
  <version>1.0.0</version>
</parent>
```

继承：

- properties
- dependencyManagement
- pluginManagement
- repositories
- profiles

### 33.2 聚合 POM

用于聚合模块。

```xml
<modules>
  <module>module-a</module>
  <module>module-b</module>
</modules>
```

### 33.3 区别

| 概念 | 作用 |
| :--- | :--- |
| parent | 配置继承 |
| aggregator | 模块聚合构建 |

一个 POM 可以既是 parent，又是 aggregator。

## 34. Maven Wrapper

Maven Wrapper 让项目自带 Maven 启动脚本。

文件：

```text
mvnw
mvnw.cmd
.mvn/wrapper/
```

### 34.1 好处

- 团队使用同一 Maven 版本
- CI 不必预装 Maven
- 降低环境差异

使用：

Linux/macOS：

```bash
./mvnw clean package
```

Windows：

```powershell
.\mvnw.cmd clean package
```

### 34.2 适合

推荐现代项目使用 Maven Wrapper。

## 35. Archetype 项目模板

Archetype 是 Maven 项目模板。

创建项目：

```bash
mvn archetype:generate
```

常见用途：

- 快速生成 Java 项目
- 快速生成 Web 项目
- 企业内部项目模板

现代 Spring Boot 项目通常更多使用 Spring Initializr。

## 36. SNAPSHOT 与 Release

### 36.1 SNAPSHOT

开发版本。

例如：

```text
1.0.0-SNAPSHOT
```

特点：

- 可能变化
- Maven 会根据更新策略检查远程版本
- 适合开发阶段

### 36.2 Release

正式版本。

例如：

```text
1.0.0
```

特点：

- 不应该变化
- 适合生产使用
- 发布后不要覆盖

### 36.3 原则

- 开发中用 SNAPSHOT
- 发布正式版本去掉 SNAPSHOT
- Release 不应重复覆盖
- 生产依赖尽量不用 SNAPSHOT

## 37. 发布到私服 Nexus / Artifactory

### 37.1 distributionManagement

POM 中配置发布地址：

```xml
<distributionManagement>
  <repository>
    <id>releases</id>
    <url>https://repo.company.com/repository/maven-releases/</url>
  </repository>
  <snapshotRepository>
    <id>snapshots</id>
    <url>https://repo.company.com/repository/maven-snapshots/</url>
  </snapshotRepository>
</distributionManagement>
```

### 37.2 settings.xml 配账号

```xml
<servers>
  <server>
    <id>releases</id>
    <username>your-user</username>
    <password>your-password</password>
  </server>
  <server>
    <id>snapshots</id>
    <username>your-user</username>
    <password>your-password</password>
  </server>
</servers>
```

注意：

`server.id` 必须和 `distributionManagement` 中的 id 对应。

### 37.3 发布命令

```bash
mvn deploy
```

## 38. Maven 与 Spring Boot

Spring Boot 项目常见 Maven 配置：

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.4.0</version>
  <relativePath/>
</parent>
```

### 38.1 starter

Spring Boot starter 是依赖集合。

例如：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

它会引入 Web 开发所需的一组依赖。

### 38.2 spring-boot-maven-plugin

用于：

- 打可执行 jar
- repackage
- 运行 Spring Boot 应用

常见：

```bash
mvn spring-boot:run
```

### 38.3 Spring Boot 依赖版本

Spring Boot 通常通过 parent 或 BOM 管理依赖版本。

一般不要随意给 starter 内部依赖单独指定版本，除非你知道原因。

## 39. Maven 与 CI/CD

CI 中常用：

```bash
mvn -B clean verify
```

`-B` 表示 batch mode，适合 CI。

### 39.1 常见 CI 步骤

```text
checkout
setup JDK
cache ~/.m2/repository
mvn -B clean verify
package artifact
deploy
```

### 39.2 CI 缓存 Maven 依赖

缓存：

```text
~/.m2/repository
```

可以减少构建时间。

注意：

缓存损坏时可清理。

### 39.3 CI 中不要依赖本地特殊配置

构建应可重复。

避免：

- 依赖本地 jar
- 依赖 IDE 配置
- 依赖未提交的 settings
- 依赖机器上手工安装的库

## 40. 依赖安全与依赖治理

依赖治理关注：

- 版本统一
- 漏洞扫描
- 不必要依赖
- 传递依赖风险
- License 合规
- 依赖升级

### 40.1 常用工具方向

- Maven Dependency Plugin
- Maven Enforcer Plugin
- OWASP Dependency-Check
- CycloneDX Maven Plugin
- versions-maven-plugin

### 40.2 dependency:analyze

```bash
mvn dependency:analyze
```

可发现：

- 已使用但未声明
- 已声明但未使用

### 40.3 生成 SBOM

现代供应链安全中，SBOM 越来越重要。

常见格式：

- CycloneDX
- SPDX

## 41. 常见错误排查

### 41.1 Could not resolve dependencies

原因：

- 网络问题
- 仓库地址错误
- 依赖版本不存在
- 私服无权限
- 本地缓存损坏

处理：

```bash
mvn clean package -U
```

必要时删除本地仓库中对应目录。

### 41.2 package not found / class not found

原因：

- 依赖没加
- scope 错
- 依赖被 exclusions 排除了
- 打包时没包含运行依赖

查看：

```bash
mvn dependency:tree
```

### 41.3 Source option 5 is no longer supported

原因：

编译插件默认 source 太旧。

解决：

```xml
<properties>
  <maven.compiler.release>17</maven.compiler.release>
</properties>
```

或配置 compiler plugin。

### 41.4 Tests failed

处理：

- 查看 `target/surefire-reports`
- 修测试
- 临时跳过：`-DskipTests`

不要长期跳过测试。

### 41.5 Non-resolvable parent POM

原因：

- parent 坐标错误
- parent 还没 install
- relativePath 错
- 私服下载不到 parent

处理：

- 先构建父项目
- 检查 parent 坐标
- 检查 relativePath
- 检查 settings 仓库

### 41.6 依赖版本冲突

现象：

- NoSuchMethodError
- ClassNotFoundException
- 运行时行为异常

排查：

```bash
mvn dependency:tree -Dverbose
```

解决：

- dependencyManagement 统一版本
- exclusions 排除错误版本
- 显式声明需要版本

### 41.7 编译通过，运行失败

常见原因：

- scope 用了 provided
- runtime 依赖没打进去
- shade/assembly 配置错误
- Spring Boot 没 repackage

## 42. Maven 最佳实践

### 42.1 固定插件版本

不要完全依赖默认插件版本。

在父 POM 用 pluginManagement 统一。

### 42.2 用 dependencyManagement 管版本

多模块项目不要每个模块随意写版本。

### 42.3 使用 BOM

对于 Spring Boot、Spring Cloud 等生态，优先使用官方 BOM。

### 42.4 不提交本地 settings.xml

settings.xml 常包含账号、密码、个人路径。

不应提交。

可以提交示例：

```text
settings-example.xml
```

### 42.5 避免 system scope

system scope 破坏可移植性。

应把第三方 jar 安装到私服或本地仓库。

### 42.6 使用 Maven Wrapper

保证团队和 CI 使用一致 Maven 版本。

### 42.7 定期查看依赖树

```bash
mvn dependency:tree
```

尤其是：

- 升级框架
- 引入新 starter
- 出现运行时冲突

### 42.8 CI 使用 clean verify

```bash
mvn -B clean verify
```

比只跑 package 更适合质量检查。

## 43. 学习路线

### 阶段 1：会用 Maven

掌握：

- 安装 Maven
- 创建项目
- 运行 `mvn test`
- 运行 `mvn package`
- 添加依赖

### 阶段 2：理解 POM

掌握：

- groupId
- artifactId
- version
- packaging
- dependencies
- properties
- build/plugins

### 阶段 3：理解生命周期和插件

掌握：

- clean/default/site
- phase
- goal
- plugin
- compiler/surefire/jar

### 阶段 4：理解依赖机制

掌握：

- scope
- transitive dependency
- dependency tree
- conflict
- exclusions
- optional
- dependencyManagement
- BOM

### 阶段 5：多模块和企业实践

掌握：

- parent
- modules
- reactor
- pluginManagement
- profiles
- settings.xml
- mirror
- private repository
- deploy

### 阶段 6：工程治理

掌握：

- Maven Wrapper
- CI
- 依赖安全
- enforcer
- reproducible builds
- 版本发布

## 44. 常用命令速查

### 基础构建

```bash
mvn clean
mvn compile
mvn test
mvn package
mvn install
mvn deploy
```

### 跳过测试

```bash
mvn package -DskipTests
mvn package -Dmaven.test.skip=true
```

### 依赖分析

```bash
mvn dependency:tree
mvn dependency:analyze
mvn dependency:copy-dependencies
```

### 查看有效 POM

```bash
mvn help:effective-pom
mvn help:effective-settings
```

### 多模块

```bash
mvn install -pl module-a
mvn install -pl module-a -am
mvn install -pl module-a -amd
mvn install -T 4
```

### profile

```bash
mvn package -Pdev
mvn package -Pprod
```

### 强制更新

```bash
mvn clean package -U
```

### 离线构建

```bash
mvn -o package
```

前提是依赖已在本地仓库。

### 调试输出

```bash
mvn -X package
```

## 45. 官方参考资料

建议优先阅读 Apache Maven 官方文档：

- [Maven 官方网站](https://maven.apache.org/)
- [Maven 下载页](https://maven.apache.org/download.cgi)
- [Maven 安装说明](https://maven.apache.org/install.html)
- [Maven 官方文档入口](https://maven.apache.org/guides/)
- [POM Reference](https://maven.apache.org/pom.html)
- [Introduction to the Build Lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [Introduction to the Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
- [Standard Directory Layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html)
- [Settings Reference](https://maven.apache.org/settings.html)
- [Available Plugins](https://maven.apache.org/plugins/)
- [Maven Releases History](https://maven.apache.org/docs/history)

## 最后总结

Maven 的核心可以浓缩为：

```text
POM 描述项目
坐标定位构件
仓库存放构件
依赖声明需要什么
scope 决定依赖在哪用
生命周期定义构建流程
插件执行具体任务
dependencyManagement 管版本
BOM 管一组版本
parent 负责继承
modules 负责聚合
settings 管本地和企业环境
```

初学时最重要的不是背 XML，而是理解 Maven 的工作模型：

1. Maven 读取 POM。
2. 合成 Effective POM。
3. 解析依赖。
4. 从本地或远程仓库获取构件。
5. 按生命周期阶段执行。
6. 调用绑定的插件 goal。
7. 输出构建产物到 target。
8. install 或 deploy 到仓库。

当你能解释一条命令 `mvn clean package` 背后发生了什么，并能用 `dependency:tree`、`effective-pom`、`settings.xml`、`dependencyManagement` 排查问题时，就已经真正入门 Maven。

## 46. 2026-06 深化补充：企业项目中的 Maven 判断力

截至 2026-06-13，Apache Maven 下载页显示 Maven 3.9.16 是推荐稳定版本，Maven 4.0.0-rc-5 仍属于预览版本；Maven 3.9+ 运行 Maven 本身要求 JDK 8+，Maven 4.0+ 运行 Maven 本身要求 JDK 17+。生产项目升级 Maven 大版本前，应先在 CI 中验证插件、私服、父 POM、Wrapper 和多模块构建。

### 46.1 依赖治理的优先级

| 问题 | 首选手段 | 说明 |
| --- | --- | --- |
| 版本散落 | `dependencyManagement` 或 BOM | 子模块只声明依赖，不重复写版本 |
| 插件版本不稳定 | `pluginManagement` | 避免 Maven 默认插件版本随环境变化 |
| 传递依赖冲突 | `mvn dependency:tree -Dverbose` | 先看谁引入，再决定排除或统一版本 |
| 构建环境不一致 | Maven Wrapper + CI 固定 JDK | 不依赖开发者本机 Maven |
| 安全漏洞 | SBOM + 依赖扫描 | 关注直接依赖和传递依赖 |
| 私服污染 | 统一 mirror 和仓库策略 | 不在业务 POM 到处写第三方仓库 |

### 46.2 多模块项目推荐结构

```text
root
├── pom.xml                  # 聚合 + 统一版本
├── app                      # 启动入口
├── domain                   # 领域模型和业务接口
├── application              # 用例服务
├── infrastructure           # 数据库、消息、外部服务适配
└── interfaces               # REST/RPC/CLI 入口
```

父 POM 负责“统一约束”，不应该塞业务代码。聚合 POM 负责“把模块一起构建”，不一定承担继承职责。大型项目中可以把继承父 POM 和聚合根 POM 分开，避免所有模块被迫继承同一套业务配置。

### 46.3 排查 Maven 构建问题的固定顺序

1. `mvn -version`：确认 Maven、JDK、系统编码和运行目录。
2. `mvn help:effective-pom`：确认最终 POM 是否符合预期。
3. `mvn help:effective-settings`：确认 mirror、profile、server 是否生效。
4. `mvn dependency:tree`：确认依赖版本和冲突路径。
5. `mvn -X`：只在前面看不出来时打开 debug 日志。
6. CI 失败但本地成功时，优先比较 JDK、环境变量、settings、私服权限和缓存。

### 46.4 常见反模式

- 在子模块到处写相同依赖版本，导致升级成本失控。
- 为了解决冲突随手 `exclusion`，但没有记录为什么排除。
- 在业务 POM 中配置多个外部仓库，导致构建不可复现。
- 滥用 `system` scope 引入本地 jar，破坏团队和 CI 构建。
- 只运行 `mvn package -DskipTests`，长期不运行 `verify`。
- 父 POM 过度复杂，导致新模块无法判断配置从哪里来。

## 47. 补充参考资料

- [Apache Maven Download](https://maven.apache.org/download.cgi)
- [Maven POM Reference](https://maven.apache.org/pom.html)
- [Maven Build Lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [Maven Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
- [Maven Settings Reference](https://maven.apache.org/settings.html)
- [Maven Wrapper](https://maven.apache.org/wrapper/)
