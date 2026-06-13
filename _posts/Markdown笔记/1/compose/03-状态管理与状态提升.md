# 03. 状态管理与状态提升

最后调研时间：2026-06-13  
主要来源：Android Developers State、State hoisting、Save UI state、Lifecycle Compose 文档。

## 1. 什么是状态

状态是任何会随时间变化并影响 UI 的值。官方文档对状态的核心定义是：应用中任何会随时间变化的值都可以被看作状态。

常见状态：

- 文本输入框内容。
- 当前选中的 Tab。
- 网络请求加载中、成功、失败。
- 列表数据。
- 当前用户登录状态。
- 弹窗是否显示。
- 滚动位置。

Compose 只会自动观察 Compose State，例如：

```kotlin
var name by remember { mutableStateOf("") }
```

如果你修改普通变量：

```kotlin
var count = 0
Button(onClick = { count++ }) { Text("$count") }
```

UI 不会可靠更新，因为 Compose 没有观察这个普通变量。

## 2. 状态分类

| 类型 | 生命周期 | 放在哪里 |
|---|---|---|
| 瞬时 UI 状态 | 只影响当前组件，比如输入框焦点、展开状态 | `remember` |
| 可保存 UI 状态 | 旋转屏幕后应恢复，比如输入文字、选中 tab | `rememberSaveable` 或 `SavedStateHandle` |
| 页面 UI 状态 | 页面内容、加载状态、错误信息 | ViewModel |
| 业务状态 | 登录态、订单、用户资料、数据库数据 | Repository / UseCase / 数据层 |
| 导航状态 | 当前页面、返回栈、参数 | Navigation |

原则：状态应放在所有需要读取和修改它的最小共同拥有者处。

## 3. `remember`

```kotlin
@Composable
fun ExpandableTitle(title: String) {
    var expanded by remember { mutableStateOf(false) }

    Column {
        Row(Modifier.clickable { expanded = !expanded }) {
            Text(title)
        }
        if (expanded) {
            Text("详细内容")
        }
    }
}
```

适合：

- 临时 UI 状态。
- 不需要配置变更恢复。
- 不需要跨页面共享。

不适合：

- 从网络或数据库来的业务数据。
- 页面主要状态。
- 需要进程死亡恢复的重要输入。

## 4. `rememberSaveable`

`rememberSaveable` 使用 Android 保存实例状态机制保存可序列化/可 Bundle 化的数据。

```kotlin
@Composable
fun SearchInput() {
    var query by rememberSaveable { mutableStateOf("") }
    TextField(
        value = query,
        onValueChange = { query = it },
        label = { Text("搜索") }
    )
}
```

适合：

- 文本输入。
- 选中 Tab。
- 简单筛选项。
- 列表滚动状态可以用对应 state 的 Saver。

限制：

- 数据大小不能太大。
- 复杂对象需要自定义 `Saver`。
- 不应保存网络列表、图片、缓存对象、数据库实体全集。

自定义 Saver：

```kotlin
data class Filter(val keyword: String, val onlyFavorite: Boolean)

val FilterSaver = Saver<Filter, List<Any>>(
    save = { listOf(it.keyword, it.onlyFavorite) },
    restore = { Filter(it[0] as String, it[1] as Boolean) }
)

@Composable
fun FilterPanel() {
    var filter by rememberSaveable(stateSaver = FilterSaver) {
        mutableStateOf(Filter("", false))
    }
}
```

## 5. Compose State 类型

常见创建方式：

```kotlin
val state = remember { mutableStateOf("text") }
var text by remember { mutableStateOf("text") }
var count by remember { mutableIntStateOf(0) }
var checked by remember { mutableStateOf(false) }
```

基本类型建议使用专用 State：

```kotlin
mutableIntStateOf(0)
mutableLongStateOf(0L)
mutableFloatStateOf(0f)
mutableDoubleStateOf(0.0)
```

原因：减少装箱开销，尤其在频繁变化的状态中更有意义。

## 6. 不可观察集合的坑

错误：

```kotlin
val items = remember { mutableListOf<String>() }
Button(onClick = { items.add("new") }) {
    Text("添加")
}
LazyColumn {
    items(items) { Text(it) }
}
```

`mutableListOf` 的内部变化不会自动通知 Compose。

正确方式 1：使用不可变列表替换引用。

```kotlin
var items by remember { mutableStateOf(listOf<String>()) }
Button(onClick = { items = items + "new" }) {
    Text("添加")
}
```

正确方式 2：使用 Snapshot State List。

```kotlin
val items = remember { mutableStateListOf<String>() }
Button(onClick = { items.add("new") }) {
    Text("添加")
}
```

工程中更推荐：页面列表状态由 ViewModel 输出不可变 `UiState`。

## 7. 状态提升

状态提升是把状态从子组件移动到调用者，让组件变成可复用、可测试、可控制的无状态组件。

有状态组件：

```kotlin
@Composable
fun SearchBar() {
    var query by rememberSaveable { mutableStateOf("") }
    TextField(value = query, onValueChange = { query = it })
}
```

无状态组件：

```kotlin
@Composable
fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    TextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier,
        singleLine = true
    )
}
```

调用者持有状态：

```kotlin
@Composable
fun SearchScreen() {
    var query by rememberSaveable { mutableStateOf("") }
    SearchBar(query = query, onQueryChange = { query = it })
}
```

状态提升的好处：

- 组件可复用。
- UI 测试更简单。
- 预览更容易。
- 状态来源明确。
- 业务逻辑可以放到 ViewModel。

## 8. ViewModel 与 UI State

推荐模式：

```kotlin
data class ArticleListUiState(
    val loading: Boolean = false,
    val articles: List<ArticleUiModel> = emptyList(),
    val errorMessage: String? = null
)

class ArticleListViewModel(
    private val repository: ArticleRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(ArticleListUiState(loading = true))
    val uiState: StateFlow<ArticleListUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, errorMessage = null)
            runCatching { repository.getArticles() }
                .onSuccess { articles ->
                    _uiState.value = ArticleListUiState(
                        loading = false,
                        articles = articles.map { it.toUiModel() }
                    )
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        loading = false,
                        errorMessage = error.message ?: "加载失败"
                    )
                }
        }
    }
}
```

Compose 收集：

```kotlin
@Composable
fun ArticleListRoute(
    viewModel: ArticleListViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    ArticleListScreen(
        uiState = uiState,
        onRetry = viewModel::load
    )
}
```

`collectAsStateWithLifecycle()` 比普通 `collectAsState()` 更适合 Android，因为它会结合 Lifecycle，在合适状态收集 Flow。

## 9. Route 与 Screen 分层

```kotlin
@Composable
fun LoginRoute(
    viewModel: LoginViewModel = viewModel(),
    onLoginSuccess: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(uiState.loggedIn) {
        if (uiState.loggedIn) onLoginSuccess()
    }

    LoginScreen(
        uiState = uiState,
        onUsernameChange = viewModel::onUsernameChange,
        onPasswordChange = viewModel::onPasswordChange,
        onSubmit = viewModel::submit
    )
}

@Composable
fun LoginScreen(
    uiState: LoginUiState,
    onUsernameChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onSubmit: () -> Unit
) {
    // 只负责展示和把事件抛出
}
```

分层原则：

| 层 | 责任 |
|---|---|
| Route | 连接 ViewModel、导航、生命周期、一次性 Effect |
| Screen | 展示 UI，接收状态和事件 |
| Component | 可复用局部 UI |
| ViewModel | 处理事件、更新 UI State、调用领域层 |

## 10. 事件设计

简单页面可直接传 lambda：

```kotlin
ProfileScreen(
    uiState = uiState,
    onEditClick = viewModel::startEdit,
    onNameChange = viewModel::updateName,
    onSaveClick = viewModel::save
)
```

复杂页面可使用事件 sealed interface：

```kotlin
sealed interface ProfileEvent {
    data object EditClick : ProfileEvent
    data class NameChange(val value: String) : ProfileEvent
    data object SaveClick : ProfileEvent
}

@Composable
fun ProfileScreen(
    uiState: ProfileUiState,
    onEvent: (ProfileEvent) -> Unit
) { }
```

取舍：

| 方式 | 优点 | 缺点 |
|---|---|---|
| 多个 lambda | 简单、类型直接、调用清晰 | 参数多时冗长 |
| 单个事件入口 | 适合复杂页面、方便记录事件 | 可能让 UI 和事件定义耦合更重 |

## 11. 派生状态 `derivedStateOf`

当某个值由其他状态计算得出，且计算结果变化频率低于输入变化频率时，可以用 `derivedStateOf`。

典型场景：滚动位置频繁变化，但 UI 只关心是否超过第一个 item。

```kotlin
@Composable
fun ScrollToTopButton(listState: LazyListState) {
    val showButton by remember {
        derivedStateOf {
            listState.firstVisibleItemIndex > 0
        }
    }

    AnimatedVisibility(visible = showButton) {
        FloatingActionButton(onClick = { /* scroll */ }) {
            Icon(Icons.Default.KeyboardArrowUp, contentDescription = "回到顶部")
        }
    }
}
```

不要滥用：

```kotlin
val fullName by remember {
    derivedStateOf { "$firstName $lastName" }
}
```

这种简单字符串拼接没必要。

## 12. `snapshotFlow`

如果需要把 Compose State 转成 Flow，例如监听滚动变化并做分析：

```kotlin
LaunchedEffect(listState) {
    snapshotFlow { listState.firstVisibleItemIndex }
        .distinctUntilChanged()
        .filter { it > 0 }
        .collect {
            analytics.logScrolledPastFirstItem()
        }
}
```

注意：

- `snapshotFlow` 适合从 Compose 状态桥接到 Flow。
- 不要在里面做重活。
- 配合 `distinctUntilChanged()`、`debounce()` 等限制频率。

## 13. 状态保存策略

| 需求 | 推荐 |
|---|---|
| 重组保留 | `remember` |
| 旋转屏幕保留简单 UI 状态 | `rememberSaveable` |
| 页面级状态保留 | ViewModel |
| 进程死亡后恢复关键输入 | `SavedStateHandle` + Repository 重拉数据 |
| 大列表数据 | Repository/数据库/缓存，不放 Bundle |
| 导航参数 | Navigation 参数，ViewModel 通过 `SavedStateHandle` 读取 |

ViewModel 中使用 `SavedStateHandle`：

```kotlin
class DetailViewModel(
    savedStateHandle: SavedStateHandle,
    repository: ArticleRepository
) : ViewModel() {
    private val articleId: String = checkNotNull(savedStateHandle["articleId"])
}
```

### `SavedStateHandle.saveable`

对于简单 UI 元素状态，`SavedStateHandle` 也可以配合 `saveable` 保存 Compose `MutableState`。它适合 ViewModel 中的输入框草稿、筛选条件、tab 等小状态。

```kotlin
class SearchViewModel(
    savedStateHandle: SavedStateHandle,
    private val repository: SearchRepository
) : ViewModel() {
    var query by savedStateHandle.saveable {
        mutableStateOf("")
    }
        private set

    fun onQueryChange(value: String) {
        query = value
    }
}
```

注意：

- 只保存小而关键的 UI 元素状态。
- 不要把完整列表、图片、网络响应、复杂对象塞进 `SavedStateHandle`。
- 进程恢复后，仍应通过 Repository 重新拉取权威数据。

## 14. StateHolder 模式

不是所有状态都必须进 ViewModel。纯 UI 交互状态可以封装成普通 state holder，尤其是复杂组件内部状态。

```kotlin
@Stable
class SearchPanelState(
    initialQuery: String = ""
) {
    var query by mutableStateOf(initialQuery)
        private set

    var filtersExpanded by mutableStateOf(false)
        private set

    fun onQueryChange(value: String) {
        query = value
    }

    fun toggleFilters() {
        filtersExpanded = !filtersExpanded
    }
}

@Composable
fun rememberSearchPanelState(
    initialQuery: String = ""
): SearchPanelState {
    return remember(initialQuery) {
        SearchPanelState(initialQuery)
    }
}
```

适合 StateHolder：

- 只服务某个复合 UI 组件。
- 不直接调用 Repository。
- 不包含跨页面业务规则。
- 想减少 Screen 参数数量，但又不想引入 ViewModel。

不适合 StateHolder：

- 需要持久化业务状态。
- 需要调用 UseCase/Repository。
- 需要跨多个页面共享。
- 需要进程死亡后可靠恢复大量数据。

## 15. 表单状态建模

表单页常见错误是每个 `TextField` 自己 `remember`，最后提交时父级拿不到完整状态。更推荐把字段集中建模。

```kotlin
data class LoginUiState(
    val username: String = "",
    val password: String = "",
    val usernameError: String? = null,
    val passwordError: String? = null,
    val submitting: Boolean = false
) {
    val canSubmit: Boolean
        get() = username.isNotBlank() && password.isNotBlank() && !submitting
}
```

事件：

```kotlin
sealed interface LoginEvent {
    data class UsernameChange(val value: String) : LoginEvent
    data class PasswordChange(val value: String) : LoginEvent
    data object SubmitClick : LoginEvent
}
```

Screen：

```kotlin
@Composable
fun LoginScreen(
    uiState: LoginUiState,
    onEvent: (LoginEvent) -> Unit
) {
    TextField(
        value = uiState.username,
        onValueChange = { onEvent(LoginEvent.UsernameChange(it)) },
        isError = uiState.usernameError != null,
        supportingText = {
            uiState.usernameError?.let { Text(it) }
        }
    )
}
```

表单建议：

- 字段值和错误文案放在同一个 `UiState`。
- 提交中状态要禁用按钮，避免重复提交。
- 密码明文/密文切换属于 UI 状态，可在 Screen 或 ViewModel，取决于是否要恢复。
- 错误不要只靠 Toast，字段错误应能显示在对应字段附近。

## 16. 常见错误

| 错误 | 后果 | 修正 |
|---|---|---|
| 在 Composable 中创建 Repository | 每次重组可能重复创建，生命周期错误 | 用 DI 或 ViewModel |
| 普通变量保存 UI 状态 | UI 不更新或状态丢失 | 用 Compose State / ViewModel |
| 可变集合直接 add/remove | Compose 不知道集合变化 | 替换不可变列表或 `mutableStateListOf` |
| 子组件私有持有业务状态 | 父级无法控制、难测试 | 状态提升 |
| Flow 用 `collectAsState()` 忽略 Lifecycle | 后台也可能收集 | Android 中优先 `collectAsStateWithLifecycle()` |
| UI State 暴露可变对象 | 难追踪，影响稳定性 | 使用不可变 data class |
| 把所有状态都放 ViewModel | UI 组件难复用，ViewModel 变胖 | 临时局部状态用 `remember`/StateHolder |
| 把大型对象保存进 `SavedStateHandle` | Bundle 过大、恢复慢、可能崩溃 | 保存 ID/查询条件，数据重拉 |
