# 04. 副作用与生命周期

最后调研时间：2026-06-11  
主要来源：Android Developers Side-effects、Lifecycle、State 文档。

## 1. 什么是副作用

副作用是 Composable 函数作用域之外发生的变化，例如：

- 发起网络请求。
- 写数据库。
- 上报埋点。
- 订阅传感器、广播、回调。
- 启动协程。
- 调用导航。
- 显示 Snackbar。

Composable 可能被多次执行、跳过、取消，因此副作用不能直接写在函数体里。

错误：

```kotlin
@Composable
fun ProfileScreen(userId: String, repo: UserRepository) {
    repo.loadUser(userId) // 错：重组时可能重复调用
    Text("Profile")
}
```

正确方向：

- 页面数据加载放 ViewModel。
- 与 Composition 生命周期绑定的任务用 Effect API。
- 与 Android Lifecycle 绑定的收集用 lifecycle-compose。

## 2. Effect API 总览

| API | 适合场景 |
|---|---|
| `LaunchedEffect` | 在 Composition 中启动协程，key 变化时重启 |
| `rememberCoroutineScope` | 在事件回调中启动协程，例如点击后显示 Snackbar |
| `DisposableEffect` | 注册/注销监听器，进入时注册，离开或 key 变时清理 |
| `SideEffect` | 每次成功重组后同步外部对象 |
| `produceState` | 把外部异步数据源转换成 Compose State |
| `derivedStateOf` | 从其他 State 派生低频变化状态 |
| `snapshotFlow` | 把 Compose State 读取转换成 Flow |
| `rememberUpdatedState` | 在长生命周期 Effect 中拿到最新 lambda/值 |

## 3. `LaunchedEffect`

`LaunchedEffect` 会在进入 Composition 时启动协程；当 key 改变时，旧协程取消，新协程启动；离开 Composition 时协程取消。

```kotlin
@Composable
fun AutoRefresh(userId: String, onRefresh: suspend (String) -> Unit) {
    LaunchedEffect(userId) {
        onRefresh(userId)
    }
}
```

常见用途：

- 根据参数变化加载数据。
- 收集一次性事件 Flow。
- 执行动画。
- 进入页面后触发滚动。
- 根据状态触发导航。

不推荐把 ViewModel 已经在 `init` 做的数据加载又放进 `LaunchedEffect(Unit)`，否则职责重复。

### key 的选择

```kotlin
LaunchedEffect(userId) {
    viewModel.load(userId)
}
```

`userId` 变化时重新加载。

```kotlin
LaunchedEffect(Unit) {
    viewModel.loadOnce()
}
```

当前 Composition 生命周期内只启动一次。注意：页面离开后再回来仍会重新启动。

危险写法：

```kotlin
LaunchedEffect(uiState) {
    // uiState 每次变化都重启，可能造成循环或重复请求
}
```

除非确实需要监听整个状态对象，否则 key 应尽量具体。

## 4. `rememberCoroutineScope`

事件回调不是 Composable 作用域，不能直接调用 suspend 函数。可以用 `rememberCoroutineScope()` 获取与 Composition 绑定的 scope。

```kotlin
@Composable
fun SnackbarButton(snackbarHostState: SnackbarHostState) {
    val scope = rememberCoroutineScope()

    Button(
        onClick = {
            scope.launch {
                snackbarHostState.showSnackbar("已保存")
            }
        }
    ) {
        Text("保存")
    }
}
```

适合：

- 点击后显示 Snackbar。
- 点击后滚动列表。
- 与 UI 控件状态相关的短任务。

不适合：

- 页面业务请求主流程。业务请求应由 ViewModel 管理。

## 5. `DisposableEffect`

用于需要清理的副作用。

```kotlin
@Composable
fun LifecycleLogger(
    lifecycleOwner: LifecycleOwner = LocalLifecycleOwner.current,
    onStart: () -> Unit,
    onStop: () -> Unit
) {
    val currentOnStart by rememberUpdatedState(onStart)
    val currentOnStop by rememberUpdatedState(onStop)

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_START -> currentOnStart()
                Lifecycle.Event.ON_STOP -> currentOnStop()
                else -> Unit
            }
        }

        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }
}
```

适合：

- 注册广播、传感器、监听器。
- 添加生命周期观察者。
- 连接第三方 SDK 回调。
- 需要 `add` 和 `remove` 成对出现的逻辑。

注意：`onDispose` 必须释放资源。

## 6. `rememberUpdatedState`

长时间运行的 Effect 捕获 lambda 时，可能捕获旧值。`rememberUpdatedState` 可以让 Effect 不重启，同时拿到最新 lambda。

```kotlin
@Composable
fun SplashScreen(onTimeout: () -> Unit) {
    val currentOnTimeout by rememberUpdatedState(onTimeout)

    LaunchedEffect(Unit) {
        delay(2000)
        currentOnTimeout()
    }
}
```

如果把 `onTimeout` 放进 key：

```kotlin
LaunchedEffect(onTimeout) { ... }
```

上层重组导致 lambda 引用变化时，计时会重启，可能不是想要的结果。

## 7. `SideEffect`

`SideEffect` 在每次成功重组后执行，用来把 Compose 状态同步给非 Compose 对象。

```kotlin
@Composable
fun AnalyticsUserProperty(userType: String, analytics: Analytics) {
    SideEffect {
        analytics.setUserProperty("userType", userType)
    }
}
```

适合：

- 更新外部对象当前属性。
- 同步主题、系统 UI 状态的一些轻量值。

不适合：

- suspend 函数。
- 耗时操作。
- 需要清理的监听。

## 8. `produceState`

`produceState` 可以把异步来源转换为 Compose `State<T>`。

```kotlin
@Composable
fun rememberImageState(url: String, loader: ImageLoader): State<ImageResult> {
    return produceState<ImageResult>(initialValue = ImageResult.Loading, url, loader) {
        value = runCatching { loader.load(url) }
            .fold(
                onSuccess = { ImageResult.Success(it) },
                onFailure = { ImageResult.Error(it) }
            )
    }
}
```

适合封装 UI 层数据源桥接。大型业务数据仍建议 ViewModel 处理。

## 9. 一次性事件

常见一次性事件：

- 导航到新页面。
- 显示 Snackbar。
- Toast。
- 弹系统权限请求。

推荐 ViewModel 暴露 `SharedFlow`：

```kotlin
sealed interface LoginEffect {
    data object NavigateHome : LoginEffect
    data class ShowMessage(val message: String) : LoginEffect
}

class LoginViewModel : ViewModel() {
    private val _effects = MutableSharedFlow<LoginEffect>()
    val effects = _effects.asSharedFlow()

    fun submit() {
        viewModelScope.launch {
            _effects.emit(LoginEffect.NavigateHome)
        }
    }
}
```

Compose 收集：

```kotlin
@Composable
fun LoginRoute(
    viewModel: LoginViewModel = viewModel(),
    navController: NavController,
    snackbarHostState: SnackbarHostState
) {
    LaunchedEffect(viewModel) {
        viewModel.effects.collect { effect ->
            when (effect) {
                LoginEffect.NavigateHome -> navController.navigate("home")
                is LoginEffect.ShowMessage -> snackbarHostState.showSnackbar(effect.message)
            }
        }
    }
}
```

注意：

- 不要把一次性事件放进普通 `UiState` 后忘记消费，否则旋转屏幕可能重复触发。
- 如果用 `UiState` 存事件，需要设计明确的消费机制。
- `SharedFlow` 默认没有 replay，页面不在前台时可能错过事件；这通常符合导航/Snackbar，但要根据业务判断。

## 10. 生命周期感知 Flow 收集

在 Android 上优先：

```kotlin
val uiState by viewModel.uiState.collectAsStateWithLifecycle()
```

它会结合 Lifecycle，在合适生命周期状态收集，避免后台无意义收集。

如果你在非 Android Compose 或特殊场景中使用：

```kotlin
val uiState by viewModel.uiState.collectAsState()
```

要明确生命周期语义。

## 11. `LaunchedEffect` 与 ViewModel 的边界

| 逻辑 | 放哪里 |
|---|---|
| 页面初始化加载业务数据 | ViewModel `init` 或接收参数后加载 |
| 用户点击后保存 | ViewModel |
| 点击后滚动列表 | `rememberCoroutineScope` |
| 进入页面后滚到指定位置 | `LaunchedEffect(targetId)` |
| 收集 ViewModel 一次性事件 | `LaunchedEffect(viewModel)` |
| 注册系统监听器 | `DisposableEffect` |
| 同步分析用户属性 | `SideEffect` |

经验规则：如果逻辑即使 UI 换成 XML/View 也仍然存在，通常不属于 Composable。

## 12. 常见错误

| 错误 | 问题 | 修正 |
|---|---|---|
| 在 Composable 函数体直接请求网络 | 重组重复请求 | ViewModel 或 `LaunchedEffect` |
| `LaunchedEffect(true)` 中捕获旧 lambda | 执行旧回调 | `rememberUpdatedState` |
| `DisposableEffect` 不清理 | 泄漏监听器 | `onDispose` 中释放 |
| key 太宽泛 | 频繁取消重启协程 | 使用具体 key |
| key 太窄 | 参数变化但 Effect 不更新 | 把影响任务的参数放入 key |
| ViewModel 暴露 Channel 但 UI 未及时收集 | 事件丢失或阻塞 | 根据语义选 `SharedFlow`/`StateFlow`/Channel |

