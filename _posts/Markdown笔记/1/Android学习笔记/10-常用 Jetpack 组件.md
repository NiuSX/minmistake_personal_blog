# 10. 常用 Jetpack 组件

## Jetpack 是什么

Jetpack 是 Android 官方提供的一组库，帮助开发者处理生命周期、导航、数据存储、后台任务、分页、UI、测试等问题。

常用组件：

- ViewModel。
- Lifecycle。
- Navigation。
- Room。
- DataStore。
- WorkManager。
- Paging。
- Hilt。
- Compose。

## ViewModel

ViewModel 保存 UI 状态，并在配置变化后保留。

```kotlin
class HomeViewModel : ViewModel() {
    private val _state = MutableStateFlow(HomeUiState())
    val state = _state.asStateFlow()
}
```

ViewModel 不应持有 Activity、Fragment 或 View 引用。

## Lifecycle

Lifecycle 让组件感知生命周期。

常用：

- `lifecycleScope`
- `repeatOnLifecycle`
- `collectAsStateWithLifecycle`

生命周期感知能避免界面不可见时继续无意义收集数据。

## Navigation

Navigation 管理页面跳转和返回栈。

Compose 示例：

```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") { HomeScreen() }
    composable("detail/{id}") { DetailScreen() }
}
```

建议：

- 路由集中定义。
- 参数类型清晰。
- 不在深层组件直接持有 NavController，优先传递回调。

## Hilt

Hilt 是 Android 官方推荐的依赖注入库之一。

```kotlin
@HiltAndroidApp
class DemoApp : Application()
```

ViewModel 注入：

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel()
```

Module：

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindUserRepository(
        impl: UserRepositoryImpl
    ): UserRepository
}
```

## WorkManager

WorkManager 用于可延期、可靠执行的后台任务。

适合：

- 后台同步。
- 上传日志。
- 定期清理。
- 网络恢复后执行任务。

示例：

```kotlin
class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        return try {
            sync()
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}
```

不适合：

- 需要立即执行的短任务。
- 长时间前台任务。
- 精确到秒的定时任务。

## Paging

Paging 用于分页加载大量数据。

常见组合：

- PagingSource。
- Pager。
- LazyPagingItems。
- RemoteMediator。

适合：

- 长列表。
- 搜索结果。
- Feed 流。
- 数据库和网络分页组合。

## Room

Room 提供 SQLite 抽象：

- Entity。
- Dao。
- Database。
- Migration。

Room 支持 Flow，适合响应式 UI。

## DataStore

DataStore 替代 SharedPreferences，提供异步、类型更安全的数据存储方式。

适合保存用户设置和小型偏好。

## 本章检查清单

- 是否知道 ViewModel 的作用？
- 是否能使用 Navigation 管理页面？
- 是否知道 Hilt 用于依赖注入？
- 是否知道 WorkManager 适合可靠后台任务？
- 是否知道 Paging 适合长列表分页？

## Jetpack 组件选型表

| 组件 | 解决什么问题 | 不适合什么 |
| --- | --- | --- |
| ViewModel | 保存 UI 状态、处理界面事件 | 存放 Activity、View、Context 引用 |
| Navigation | 页面跳转和返回栈 | 传输大对象或业务状态 |
| Room | 结构化本地数据库 | 小型偏好设置 |
| DataStore | 异步偏好和小配置 | 复杂查询和大列表 |
| WorkManager | 可延迟、可靠后台任务 | 需要立即执行的前台交互 |
| Paging | 大列表分页加载 | 小列表或一次性加载数据 |
| Hilt | 依赖注入和生命周期绑定 | 替代架构设计 |

## ViewModel 实践边界

ViewModel 应该：

- 暴露不可变 `StateFlow`。
- 接收 UI 事件。
- 调用 UseCase 或 Repository。
- 管理加载、错误和一次性事件。

ViewModel 不应该：

- 持有 Activity、Fragment、View。
- 直接操作 Navigation Controller。
- 直接显示 Toast。
- 直接依赖 Retrofit、DAO，除非项目非常小且有意识接受耦合。

## WorkManager 使用场景

适合：

- 日志上传。
- 离线数据同步。
- 定期清理缓存。
- 网络可用后重试任务。
- 需要进程重启后仍可靠执行的任务。

不适合：

- 精确定时任务。
- 音乐播放、导航定位这类持续前台任务。
- 用户点击后必须立即完成的同步操作。

示例：

```kotlin
class SyncWorker(
    context: Context,
    params: WorkerParameters,
    private val syncRepository: SyncRepository
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        return syncRepository.sync()
            .fold(
                onSuccess = { Result.success() },
                onFailure = { Result.retry() }
            )
    }
}
```

## Paging 实践要点

Paging 适合数据量大、需要分批加载的场景。常见组合：

```text
Pager -> PagingData -> ViewModel cachedIn -> LazyPagingItems
```

如果需要数据库和网络组合，使用 `RemoteMediator`：

```text
UI reads Room paging source
RemoteMediator fetches network pages
Network results are written into Room
Room invalidates and UI refreshes
```

不要为了十几条数据引入 Paging，它会增加状态和错误处理复杂度。

## Hilt / DI 的价值

依赖注入不是为了“高级”，而是为了：

- 统一对象创建。
- 管理生命周期。
- 隔离接口和实现。
- 方便测试替换 fake/mock。
- 避免到处手写单例。

常见作用域：

| 作用域 | 生命周期 |
| --- | --- |
| `SingletonComponent` | 应用进程 |
| `ActivityRetainedComponent` | Activity 配置变更期间保留 |
| `ViewModelComponent` | ViewModel |
| `ActivityComponent` | Activity |

作用域过大容易持有过久，作用域过小会导致重复创建。按真实生命周期选择。
