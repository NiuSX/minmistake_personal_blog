# 15. 学习路线与参考资料

## 阶段一：Android 基础

目标：能创建并运行简单 App。

学习内容：

- Android Studio。
- Gradle 基础。
- Manifest。
- Activity。
- 资源系统。
- Logcat。
- 基本调试。

练习：

- 简单计数器。
- 单页表单。
- 多语言字符串资源。

## 阶段二：Kotlin 与 UI

目标：能写基本界面和状态交互。

学习内容：

- Kotlin 空安全。
- data class。
- sealed 类型。
- Compose 基础。
- Material 3。
- 状态提升。
- LazyColumn。

练习：

- 待办列表。
- 搜索过滤。
- 表单校验。

## 阶段三：架构与数据

目标：能写可维护的中小型应用。

学习内容：

- MVVM。
- ViewModel。
- UI State。
- Repository。
- Room。
- DataStore。
- Retrofit / Ktor。
- 错误处理。

练习：

- 离线优先笔记 App。
- 用户列表和详情页。
- 设置页。

## 阶段四：协程与 Jetpack

目标：能处理异步数据流和后台任务。

学习内容：

- Coroutines。
- Flow。
- StateFlow。
- SharedFlow。
- Navigation。
- WorkManager。
- Paging。
- Hilt 或 Koin。

练习：

- 分页列表。
- 后台同步。
- 多页面导航。

## 阶段五：生产能力

目标：能发布和维护真实应用。

学习内容：

- 单元测试。
- Compose UI Test。
- Profiler。
- 性能优化。
- 权限安全。
- R8。
- 签名。
- AAB 发布。
- 崩溃分析。

练习：

- 完整 release 构建。
- 接入测试和 CI。
- 做一次灰度发布演练。

## 推荐实战项目

### 离线优先笔记 App

功能：

- 笔记列表。
- 创建编辑删除。
- Room 存储。
- DataStore 设置。
- 搜索。
- Compose UI。
- ViewModel 状态管理。

进阶：

- 云端同步。
- WorkManager 后台同步。
- 冲突解决。
- 测试覆盖。

### 新闻阅读 App

功能：

- API 请求。
- 列表分页。
- 详情页。
- 收藏。
- 离线缓存。

进阶：

- Paging。
- Room + RemoteMediator。
- 错误重试。
- 深色模式。

### 个人记账 App

功能：

- 账单录入。
- 分类统计。
- 图表。
- 本地数据库。
- 设置页。

进阶：

- 数据导出。
- 预算提醒。
- 后台通知。

## 面试复习重点

- Activity 生命周期。
- Fragment View 生命周期。
- ViewModel 作用。
- Compose 重组。
- 状态提升。
- StateFlow 与 SharedFlow。
- 协程结构化并发。
- Room 和 DataStore 区别。
- Repository 模式。
- MVVM 数据流。
- Hilt 依赖注入。
- WorkManager 使用场景。
- Android 权限。
- 内存泄漏。
- ANR。
- R8 与混淆。

## 官方参考资料

- Android Developers：https://developer.android.com/
- Android app architecture guide：https://developer.android.com/topic/architecture
- Jetpack Compose：https://developer.android.com/compose
- Android Kotlin guides：https://developer.android.com/kotlin
- Kotlin Coroutines on Android：https://developer.android.com/kotlin/coroutines
- Kotlin Flow on Android：https://developer.android.com/kotlin/flow
- Android Gradle Plugin：https://developer.android.com/build
- Material Design：https://m3.material.io/
- Codelabs：https://developer.android.com/codelabs

## 持续更新建议

Android 生态变化很快，建议定期检查：

- Android Studio 和 AGP 版本。
- targetSdk 要求。
- Compose BOM。
- Kotlin 版本。
- Jetpack 组件版本。
- Google Play 发布规则。
- 权限和隐私要求。

更新笔记时优先更新：

- Gradle 配置示例。
- targetSdk 和权限变化。
- Compose API。
- 架构推荐实践。
- 发布和数据安全要求。

