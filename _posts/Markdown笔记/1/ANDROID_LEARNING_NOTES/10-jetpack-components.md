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

