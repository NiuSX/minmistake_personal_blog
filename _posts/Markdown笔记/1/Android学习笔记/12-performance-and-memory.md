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

