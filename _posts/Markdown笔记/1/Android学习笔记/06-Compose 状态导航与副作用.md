# 06. Compose 状态、导航与副作用

## Compose 的核心思想

Compose 是声明式 UI。界面是状态的函数：

```text
UI = f(state)
```

状态变化后，相关 Composable 会重组，界面自动更新。

## remember

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}
```

`remember` 保存组合期间的状态。配置变化后可能丢失。

## rememberSaveable

```kotlin
var text by rememberSaveable { mutableStateOf("") }
```

可在配置变化后保存简单状态。

复杂业务状态应放入 ViewModel。

## 状态提升

不推荐子组件自己持有所有状态。更推荐状态提升：

```kotlin
@Composable
fun SearchBox(
    query: String,
    onQueryChange: (String) -> Unit
) {
    TextField(
        value = query,
        onValueChange = onQueryChange
    )
}
```

好处：

- 组件更可复用。
- 状态来源清晰。
- 更容易测试。

## UI State

ViewModel 暴露 UI State：

```kotlin
data class UserListUiState(
    val isLoading: Boolean = false,
    val users: List<UserUiModel> = emptyList(),
    val errorMessage: String? = null
)
```

Compose 收集：

```kotlin
val state by viewModel.state.collectAsStateWithLifecycle()
```

界面根据状态渲染：

```kotlin
when {
    state.isLoading -> CircularProgressIndicator()
    state.errorMessage != null -> Text(state.errorMessage)
    else -> UserList(state.users)
}
```

## 事件

UI 事件由界面传给 ViewModel：

```kotlin
sealed interface UserListEvent {
    data object Refresh : UserListEvent
    data class UserClicked(val id: String) : UserListEvent
}
```

ViewModel 处理：

```kotlin
fun onEvent(event: UserListEvent) {
    when (event) {
        UserListEvent.Refresh -> refresh()
        is UserListEvent.UserClicked -> openUser(event.id)
    }
}
```

## 一次性事件

Toast、Snackbar、导航属于一次性事件。常见方式：

- 使用 Channel。
- 使用 SharedFlow。
- 通过导航回调由 UI 层处理。

示例：

```kotlin
private val _effects = MutableSharedFlow<UiEffect>()
val effects = _effects.asSharedFlow()
```

## 副作用 API

### LaunchedEffect

进入组合时启动协程：

```kotlin
LaunchedEffect(userId) {
    viewModel.load(userId)
}
```

key 变化会重新启动。

### DisposableEffect

需要清理资源：

```kotlin
DisposableEffect(Unit) {
    val listener = register()
    onDispose {
        unregister(listener)
    }
}
```

### SideEffect

每次成功重组后执行：

```kotlin
SideEffect {
    analytics.setScreen("Home")
}
```

### derivedStateOf

派生状态：

```kotlin
val showButton by remember {
    derivedStateOf { listState.firstVisibleItemIndex > 0 }
}
```

## Navigation Compose

基本结构：

```kotlin
val navController = rememberNavController()

NavHost(
    navController = navController,
    startDestination = "home"
) {
    composable("home") {
        HomeScreen(onOpenDetail = { id ->
            navController.navigate("detail/$id")
        })
    }
    composable("detail/{id}") { backStackEntry ->
        val id = backStackEntry.arguments?.getString("id")
        DetailScreen(id = id)
    }
}
```

实际项目中建议封装路由，避免到处拼字符串。

## Compose 性能注意

- 避免在 Composable 中创建昂贵对象。
- 列表 item 使用稳定 key。
- UI 参数尽量稳定。
- 不要把整个大状态传给所有子组件。
- 使用 `remember` 缓存局部计算。
- 使用 Layout Inspector 和 Compose tooling 分析重组。

## 本章检查清单

- 是否理解 UI 是状态的函数？
- 是否会进行状态提升？
- 是否知道 ViewModel 暴露 UI State？
- 是否能区分状态和一次性事件？
- 是否知道 LaunchedEffect 的 key 变化会重新启动？

## 单向数据流模板

推荐数据流：

```text
User action -> ViewModel event -> UseCase / Repository
            -> new UI State -> Composable recomposition
```

ViewModel 示例：

```kotlin
class SearchViewModel(
    private val searchArticles: SearchArticlesUseCase
) : ViewModel() {
    private val query = MutableStateFlow("")

    val state: StateFlow<SearchUiState> =
        query
            .debounce(300)
            .distinctUntilChanged()
            .flatMapLatest { keyword -> searchArticles(keyword) }
            .map { articles -> SearchUiState(articles = articles) }
            .stateIn(
                scope = viewModelScope,
                started = SharingStarted.WhileSubscribed(5_000),
                initialValue = SearchUiState()
            )

    fun onQueryChange(value: String) {
        query.value = value
    }
}
```

UI 只调用事件：

```kotlin
SearchScreen(
    state = state,
    onQueryChange = viewModel::onQueryChange
)
```

## 状态与事件的区分

| 类型 | 示例 | 推荐表达 |
| --- | --- | --- |
| 持久 UI 状态 | 列表、加载中、错误文案、输入框内容 | `StateFlow<UiState>` |
| 一次性事件 | Toast、Snackbar、导航、打开系统页面 | `Channel` / `SharedFlow` |
| 业务数据 | 用户、文章、订单 | Domain Model，经 Repository 暴露 |

不要把一次性事件长期保存在 `UiState` 里，否则旋转屏幕或重新收集后可能重复弹 Toast、重复导航。

## Effect API 使用边界

| API | 适用场景 | 注意点 |
| --- | --- | --- |
| `LaunchedEffect` | 进入组合后启动协程、收集一次性事件 | key 变化会重启 |
| `DisposableEffect` | 注册和注销监听器 | 必须释放资源 |
| `SideEffect` | 每次成功重组后同步非 Compose 状态 | 不做耗时任务 |
| `rememberUpdatedState` | Effect 内引用最新 lambda 或值 | 避免旧闭包 |
| `produceState` | 把外部异步数据转换为 Compose State | 注意取消 |

收集一次性事件示例：

```kotlin
LaunchedEffect(Unit) {
    viewModel.events.collect { event ->
        when (event) {
            is UiEvent.ShowMessage -> snackbarHostState.showSnackbar(event.message)
            is UiEvent.NavigateBack -> navController.popBackStack()
        }
    }
}
```

## Navigation 实践

简单项目可以用字符串路由，但中大型项目建议集中定义：

```kotlin
object Routes {
    const val HOME = "home"
    const val DETAIL = "detail/{id}"

    fun detail(id: String): String = "detail/$id"
}
```

导航参数原则：

- 路由里只传 id、filter、tab 这类轻量参数。
- 不传大对象，不传完整 JSON。
- 详情页通过 id 从 Repository 重新读取数据。
- 登录态、用户信息这类全局状态不要塞进导航参数。

## 重组排查思路

- 检查是否在 Composable 内创建新的 lambda、大列表、复杂对象。
- 检查子组件是否接收了整个页面 State，而不是只接收自己需要的字段。
- 检查 `LazyColumn` item 是否有稳定 key。
- 使用 Layout Inspector 和 Compose recomposition tooling 观察重组次数。
- 不要为了“减少重组”过早优化，先保证状态模型正确。
