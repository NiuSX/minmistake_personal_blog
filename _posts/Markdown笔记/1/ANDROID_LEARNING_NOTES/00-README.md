# Android 学习笔记总目录

本目录是一份独立的 Android 系统化学习笔记，按章节拆分为多个 Markdown 文档。内容覆盖 Android 基础、Kotlin、生命周期、Jetpack Compose、应用架构、数据层、协程 Flow、Jetpack 组件、测试调试、性能、安全和发布上线。

> 说明：本目录只新增 Android 学习笔记文件，不修改仓库中已有 Android 文章。

## 推荐阅读顺序

1. `01-overview-and-environment.md`：Android 生态、开发环境、项目结构概览。
2. `02-project-structure-gradle-manifest-resources.md`：Gradle、Manifest、资源系统。
3. `03-kotlin-for-android.md`：Android 开发常用 Kotlin 基础。
4. `04-activity-fragment-lifecycle.md`：Activity、Fragment、生命周期。
5. `05-ui-view-system-and-compose.md`：传统 View 系统与 Compose 基础。
6. `06-compose-state-navigation-side-effects.md`：Compose 状态、导航、副作用。
7. `07-architecture-mvvm-clean-architecture.md`：MVVM、分层架构、Clean Architecture。
8. `08-data-layer-network-room-datastore.md`：网络、Room、DataStore、Repository。
9. `09-coroutines-flow-lifecycle.md`：协程、Flow、结构化并发、生命周期感知。
10. `10-jetpack-components.md`：Navigation、ViewModel、WorkManager、Paging 等。
11. `11-permissions-security-privacy.md`：权限、安全、隐私与合规。
12. `12-performance-and-memory.md`：性能、内存、启动优化。
13. `13-testing-debugging-observability.md`：测试、调试、日志、崩溃分析。
14. `14-release-and-distribution.md`：打包、签名、混淆、发布。
15. `15-roadmap-and-reference.md`：学习路线、项目建议和参考资料。

## Android 学习主线

Android 学习不只是学习 API。更重要的是建立几条主线：

### 生命周期

Android 组件会被系统创建、暂停、恢复、销毁。Activity、Fragment、ViewModel、Compose、协程都要和生命周期配合。

### 状态管理

界面应该由状态驱动。无论使用 XML View 还是 Compose，都要理解 UI State、事件、一次性事件和数据流。

### 架构分层

真实项目通常采用 Presentation、Domain、Data 分层。UI 负责展示和交互，Domain 负责业务规则，Data 负责网络、数据库和缓存。

### 异步与并发

Android 主线程负责 UI，耗时任务必须放到后台。Kotlin Coroutines 和 Flow 是现代 Android 异步开发核心。

### 工程化

Gradle、依赖管理、测试、构建变体、混淆、签名、CI、性能分析和发布流程，是从 Demo 到生产必须掌握的内容。

## 推荐技术栈

现代 Android 新项目常见组合：

- Kotlin。
- Jetpack Compose。
- Material 3。
- ViewModel。
- Kotlin Coroutines。
- Flow。
- Hilt 或 Koin。
- Room。
- DataStore。
- Retrofit 或 Ktor。
- Navigation。
- WorkManager。
- Paging。
- JUnit、MockK、Turbine、Compose UI Test。

## 学习建议

- 先理解 Activity、生命周期和资源系统，再深入 Compose。
- Compose 学习重点是状态和重组，不是只会堆 UI。
- 协程学习重点是结构化并发和取消，不是只会 `launch`。
- 架构学习重点是依赖方向和职责边界，不是文件夹命名。
- 数据层学习重点是 Repository、缓存策略、错误处理和离线能力。
- 测试学习重点是 ViewModel、UseCase、Repository 和 UI 关键流程。

## 最小实战项目

推荐做一个“离线优先的待办或笔记 App”：

- Compose UI。
- Navigation 页面跳转。
- ViewModel 管理 UI State。
- Room 本地存储。
- DataStore 保存设置。
- Repository 封装数据源。
- UseCase 承载业务逻辑。
- WorkManager 做后台同步。
- 单元测试和 Compose UI 测试。

