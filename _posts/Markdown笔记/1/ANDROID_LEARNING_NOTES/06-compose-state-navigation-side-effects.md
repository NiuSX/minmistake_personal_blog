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

