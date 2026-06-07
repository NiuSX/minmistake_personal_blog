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

