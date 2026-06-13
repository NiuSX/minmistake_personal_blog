# 12. 性能与内存优化

## 性能关注点

Android 性能常见维度：

- 启动速度。
- 页面流畅度。
- 内存占用。
- 电量消耗。
- 网络效率。
- APK / AAB 体积。
- 列表滚动性能。
- Compose 重组性能。

优化原则：先测量，再优化。

## 启动优化

冷启动流程包含：

- 进程创建。
- Application 初始化。
- Activity 创建。
- 首帧绘制。

建议：

- Application 中少做耗时初始化。
- 第三方 SDK 延迟初始化。
- 避免主线程 I/O。
- 首页首屏数据分阶段加载。
- 使用 Baseline Profile 改善启动和运行性能。

## 主线程

主线程不能执行：

- 网络请求。
- 大文件读写。
- 数据库重任务。
- 大量 JSON 解析。
- 复杂计算。

使用协程：

```kotlin
withContext(Dispatchers.IO) {
    loadFromDisk()
}
```

## 内存泄漏

常见泄漏：

- 单例持有 Activity。
- 静态集合持有 View。
- 长生命周期对象持有短生命周期 Context。
- 未取消回调或监听。
- Fragment 持有已销毁 View。

建议：

- ViewModel 不持有 Activity。
- 使用 Application Context 时明确场景。
- 生命周期结束时注销监听。
- Fragment 中不要长期保存 View 引用。

## Compose 性能

建议：

- 使用稳定参数。
- 大列表使用 LazyColumn。
- 为列表 item 提供 key。
- 避免在 Composable 中做耗时计算。
- 使用 `remember` 缓存局部对象。
- 使用 `derivedStateOf` 降低派生状态重算。
- 拆分 Composable，缩小重组范围。

## 列表性能

传统 RecyclerView：

- 使用 DiffUtil。
- ViewHolder 复用。
- 避免 item 中复杂嵌套。
- 图片加载设置合适尺寸。

Compose LazyColumn：

```kotlin
LazyColumn {
    items(
        items = users,
        key = { it.id }
    ) { user ->
        UserItem(user)
    }
}
```

## 图片优化

建议：

- 按显示尺寸加载图片。
- 使用 Coil、Glide 等成熟库。
- 启用缓存。
- 避免加载超大原图到内存。
- 使用 WebP 或合适格式。

## 网络优化

建议：

- 合理缓存。
- 分页加载。
- 压缩响应。
- 避免重复请求。
- 超时和重试策略清晰。
- 离线优先降低网络依赖。

## APK / AAB 体积

优化方式：

- 启用 R8。
- 移除无用资源。
- 使用 Android App Bundle。
- 使用 vector drawable。
- 压缩图片。
- 检查依赖体积。

## 性能工具

常用：

- Android Studio Profiler。
- Memory Profiler。
- CPU Profiler。
- Layout Inspector。
- Compose Recomposition tools。
- Macrobenchmark。
- Baseline Profile。

## 本章检查清单

- 是否知道主线程不能做耗时任务？
- 是否能识别常见内存泄漏？
- 是否知道 Compose 重组可能影响性能？
- 是否会使用 Profiler 分析问题？
- 是否理解启动优化要减少首屏前工作？

## 性能问题分类

| 类型 | 表现 | 常见原因 |
| --- | --- | --- |
| 启动慢 | 点击图标后长时间白屏 | Application 初始化过重、首屏同步 IO |
| 掉帧 | 滚动卡顿、动画不顺 | 主线程计算、布局过深、重组过多 |
| ANR | 应用无响应 | 主线程阻塞、广播处理过慢、锁竞争 |
| 内存泄漏 | 内存持续上涨、页面退出不释放 | 长生命周期对象持有 Activity / View |
| OOM | 崩溃、加载大图失败 | 图片过大、缓存无上限、对象过多 |
| 耗电 | 后台耗电高 | 频繁唤醒、定位、网络轮询 |

性能优化先测量再修改，不要靠猜。

## 启动优化

启动阶段目标是尽快完成首屏可交互。

建议：

- Application 只做必要初始化。
- SDK 初始化延迟到首次使用或后台。
- 首屏数据优先读本地缓存。
- 大型 JSON、数据库迁移、文件扫描不要阻塞主线程。
- 使用 SplashScreen API 控制启动体验。
- 用 Macrobenchmark 和 Baseline Profile 衡量真实启动性能。

常见错误：

```kotlin
class App : Application() {
    override fun onCreate() {
        super.onCreate()
        // 一次性初始化所有 SDK、读大文件、同步请求网络
    }
}
```

## Compose 性能实践

- 列表使用稳定 key。
- 避免把整个页面状态传给每个 item。
- 对昂贵计算使用 `remember` 或提前在 ViewModel 处理。
- 使用 `derivedStateOf` 管理由状态派生且计算昂贵的值。
- 避免频繁创建不稳定对象作为参数。
- 不要为了减少重组破坏代码清晰性；重组本身不一定是问题，昂贵重组才是问题。

列表 item 示例：

```kotlin
items(
    items = articles,
    key = { it.id }
) { article ->
    ArticleRow(
        title = article.title,
        isFavorite = article.isFavorite,
        onClick = { onOpen(article.id) }
    )
}
```

## 内存泄漏高发点

- 单例持有 Activity Context。
- Fragment ViewBinding 没有在 `onDestroyView` 清空。
- 长生命周期协程持有 View。
- 回调、监听器、广播没有注销。
- WebView、Bitmap、大缓存没有释放或无上限。
- 静态集合保存页面对象。

排查工具：

- Memory Profiler 看对象增长。
- Heap dump 查引用链。
- LeakCanary 可用于开发期快速发现泄漏。

## ANR 排查

ANR 本质是主线程长时间无法响应。排查时看：

- 主线程堆栈。
- 是否有同步网络、数据库、文件 IO。
- 是否有锁等待。
- BroadcastReceiver 是否执行太久。
- 是否在启动期做大量初始化。

优化方向：

- 把阻塞任务移到后台线程。
- 拆分长任务，必要时让用户可取消。
- 减少主线程锁竞争。
- 使用 WorkManager 处理可靠后台任务。

## 体积优化

- Release 开启 R8 和资源压缩。
- 使用 Android App Bundle 让 Play 按设备分发。
- 检查大依赖和重复依赖。
- 图片使用合适尺寸和格式。
- 可矢量化图标使用 vector drawable。
- 删除未使用语言、ABI、资源时要确认业务需要。
