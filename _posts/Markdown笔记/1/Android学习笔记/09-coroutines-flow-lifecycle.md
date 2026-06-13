# 09. 协程、Flow 与生命周期

## 为什么需要协程

Android 主线程负责 UI。网络请求、数据库查询、文件读写等耗时任务不能阻塞主线程。Kotlin Coroutines 提供轻量异步编程模型。

## suspend 函数

```kotlin
suspend fun loadUsers(): List<User> {
    return api.getUsers()
}
```

`suspend` 函数可以挂起，不会阻塞线程。

## CoroutineScope

ViewModel 中使用 `viewModelScope`：

```kotlin
viewModelScope.launch {
    val users = repository.loadUsers()
}
```

不要使用 `GlobalScope`。它不受生命周期管理，容易泄漏和失控。

## Dispatcher

常见调度器：

- `Dispatchers.Main`：主线程，更新 UI。
- `Dispatchers.IO`：网络、文件、数据库。
- `Dispatchers.Default`：CPU 密集计算。

示例：

```kotlin
withContext(Dispatchers.IO) {
    repository.refresh()
}
```

Room 和 Retrofit 的 suspend API 通常已经处理线程，不要重复过度切换。

## 结构化并发

协程应该有父子关系。父协程取消时，子协程也会取消。

```kotlin
viewModelScope.launch {
    val user = async { loadUser() }
    val orders = async { loadOrders() }
    combine(user.await(), orders.await())
}
```

结构化并发让任务生命周期可控。

## 异常处理

```kotlin
viewModelScope.launch {
    runCatching {
        repository.refresh()
    }.onFailure { error ->
        _state.update { it.copy(errorMessage = error.message) }
    }
}
```

注意：

- `launch` 中未捕获异常会向父作用域传播。
- `async` 的异常通常在 `await` 时暴露。
- 不要吞掉取消异常。

## Flow

Flow 表示异步数据流：

```kotlin
val users: Flow<List<User>> = repository.observeUsers()
```

收集：

```kotlin
viewModelScope.launch {
    users.collect { list ->
        // update state
    }
}
```

## StateFlow

StateFlow 表示可观察状态：

```kotlin
private val _state = MutableStateFlow(UiState())
val state = _state.asStateFlow()
```

更新：

```kotlin
_state.update { it.copy(isLoading = true) }
```

## SharedFlow

SharedFlow 适合事件流：

```kotlin
private val _events = MutableSharedFlow<UiEvent>()
val events = _events.asSharedFlow()
```

## 常用 Flow 操作符

```kotlin
flow
    .map { it.toUiModel() }
    .filter { it.isVisible }
    .distinctUntilChanged()
    .catch { emit(defaultValue) }
    .collect { render(it) }
```

组合多个流：

```kotlin
combine(userFlow, settingsFlow) { user, settings ->
    buildUiState(user, settings)
}
```

## stateIn

把 Flow 转成 StateFlow：

```kotlin
val state = repository.observeUsers()
    .map { users -> UiState(users = users) }
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = UiState(isLoading = true)
    )
```

## 生命周期感知收集

Compose：

```kotlin
val state by viewModel.state.collectAsStateWithLifecycle()
```

View 系统：

```kotlin
lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.state.collect { state ->
            render(state)
        }
    }
}
```

## 本章检查清单

- 是否知道不能阻塞主线程？
- 是否理解 suspend 不等于切线程？
- 是否知道 viewModelScope 的作用？
- 是否能区分 StateFlow 和 SharedFlow？
- 是否会使用 collectAsStateWithLifecycle？

## 协程结构化并发

结构化并发的核心是：协程有明确父子关系，父作用域取消时子协程也取消。

常见作用域：

| 作用域 | 生命周期 | 适合 |
| --- | --- | --- |
| `viewModelScope` | ViewModel 清除时取消 | 页面数据加载、UI 状态编排 |
| `lifecycleScope` | Lifecycle 销毁时取消 | Activity / Fragment 绑定任务 |
| `rememberCoroutineScope` | Composable 离开组合时取消 | UI 交互触发的短任务 |
| `CoroutineScope` 注入 | 由业务自己定义 | 应用级后台任务，需谨慎管理 |

不要在业务代码里随意使用 `GlobalScope`。它没有明确生命周期，容易造成泄漏、重复任务和测试困难。

## Dispatcher 边界

| Dispatcher | 用途 | 注意点 |
| --- | --- | --- |
| `Dispatchers.Main` | UI 状态更新 | 不做阻塞任务 |
| `Dispatchers.IO` | 文件、数据库、网络阻塞调用 | 网络库若已异步，不一定需要手动切 |
| `Dispatchers.Default` | CPU 密集计算 | 适合排序、解析、大量计算 |
| Test dispatcher | 单元测试 | 让协程可控、可推进时间 |

`suspend` 不等于后台线程。真正是否切线程，要看函数内部是否切换 Dispatcher 或调用的库是否异步。

## Flow 冷流与热流

| 类型 | 特点 | Android 常见用途 |
| --- | --- | --- |
| `Flow` | 冷流，收集时才执行 | Repository 查询、Room Flow |
| `StateFlow` | 热流，有当前值 | UI State |
| `SharedFlow` | 热流，可配置重放 | 事件流、广播式数据 |
| `Channel` | 点对点事件 | 一次性事件 |

UI 状态优先使用 `StateFlow`，因为页面随时需要当前状态。Toast、导航这类一次性事件不要放进长期状态。

## Flow 操作符常用组合

搜索框：

```kotlin
query
    .debounce(300)
    .distinctUntilChanged()
    .flatMapLatest { keyword -> repository.search(keyword) }
```

合并多个状态：

```kotlin
combine(userFlow, settingsFlow) { user, settings ->
    ProfileUiState(user = user, darkMode = settings.darkMode)
}
```

错误处理：

```kotlin
repository.observeArticles()
    .map { articles -> UiState(articles = articles) }
    .catch { emit(UiState(errorMessage = it.message)) }
```

注意：`catch` 只捕获它上游的异常，不捕获下游 `collect` 里的异常。

## 生命周期感知收集的原因

直接在 UI 层 `launch { flow.collect {} }` 可能在页面不可见时仍然收集，浪费资源或更新不可见 UI。`repeatOnLifecycle` 会在生命周期到达目标状态时启动收集，低于目标状态时取消收集。

Compose 项目优先使用：

```kotlin
val state by viewModel.state.collectAsStateWithLifecycle()
```

View 系统优先使用：

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.state.collect(::render)
    }
}
```

## 协程排错清单

- UI 卡顿：检查是否在 Main 线程做 IO 或 CPU 密集任务。
- 请求重复：检查 Flow 是否被多处收集，是否需要 `stateIn` 或 `shareIn`。
- 取消无效：检查是否调用阻塞 API、长循环中是否检查取消。
- 错误吞掉：检查 `try/catch` 和 `CoroutineExceptionHandler` 的位置。
- 测试不稳定：使用 `runTest` 和测试 Dispatcher，不依赖真实时间。
