# 11. 实战串联：Feed 列表页到详情页

最后调研时间：2026-06-13  
主要来源：Android Developers Compose Architecture、State、Side-effects、Navigation Compose、Lists、Testing、Performance 文档。

这一章把前面分散的知识串成一个典型业务：文章 Feed 列表、下拉刷新、错误提示、点击进入详情、详情页收藏。示例重点不是 UI 样式，而是状态边界、导航边界、副作用边界和测试边界。

## 1. 目标结构

```text
feature/feed/
  FeedRoute.kt
  FeedScreen.kt
  FeedViewModel.kt
  FeedUiState.kt
  FeedItemUiModel.kt

feature/article/
  ArticleRoute.kt
  ArticleScreen.kt
  ArticleViewModel.kt
  ArticleUiState.kt

app/navigation/
  AppNavHost.kt
  Destinations.kt
```

职责划分：

| 文件 | 责任 |
|---|---|
| `Route` | 连接 ViewModel、生命周期收集、一次性事件、导航回调 |
| `Screen` | 接收状态和事件，负责展示 |
| `ViewModel` | 处理业务事件，调用 Repository，产出 UI State/Effect |
| `UiState` | 页面可持续展示状态 |
| `Effect` | Snackbar、导航、Toast 等一次性动作 |
| `Destinations` | 类型安全导航目的地 |

## 2. UI State 与事件建模

```kotlin
@Immutable
data class FeedUiState(
    val loading: Boolean = true,
    val refreshing: Boolean = false,
    val items: List<FeedItemUiModel> = emptyList(),
    val errorMessage: String? = null
)

@Immutable
data class FeedItemUiModel(
    val id: String,
    val title: String,
    val summary: String,
    val coverUrl: String?,
    val authorName: String,
    val publishDateText: String,
    val kind: FeedItemKind
)

enum class FeedItemKind {
    Article,
    Ad,
    Recommendation
}

sealed interface FeedEvent {
    data object Refresh : FeedEvent
    data class ArticleClick(val articleId: String) : FeedEvent
    data object RetryClick : FeedEvent
}

sealed interface FeedEffect {
    data class OpenArticle(val articleId: String) : FeedEffect
    data class ShowMessage(val message: String) : FeedEffect
}
```

建模原则：

- `FeedUiState` 表达屏幕持续状态，旋转屏幕后仍然应该能重新渲染。
- `FeedEffect` 表达一次性动作，不放进普通 `UiState`，避免重复导航或重复弹 Snackbar。
- `FeedItemUiModel` 是 UI 层模型，不直接暴露数据库实体或网络 DTO。
- `kind` 可作为 Lazy 列表的 `contentType`，帮助混合 item 复用。

## 3. ViewModel

```kotlin
class FeedViewModel(
    private val repository: ArticleRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(FeedUiState())
    val uiState: StateFlow<FeedUiState> = _uiState.asStateFlow()

    private val _effects = MutableSharedFlow<FeedEffect>()
    val effects: SharedFlow<FeedEffect> = _effects.asSharedFlow()

    init {
        load()
    }

    fun onEvent(event: FeedEvent) {
        when (event) {
            FeedEvent.Refresh -> refresh()
            FeedEvent.RetryClick -> load()
            is FeedEvent.ArticleClick -> openArticle(event.articleId)
        }
    }

    private fun load() {
        viewModelScope.launch {
            _uiState.update { it.copy(loading = true, errorMessage = null) }
            runCatching { repository.getFeed() }
                .onSuccess { articles ->
                    _uiState.value = FeedUiState(
                        loading = false,
                        items = articles.map { it.toFeedItemUiModel() }
                    )
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(
                            loading = false,
                            errorMessage = error.userMessage()
                        )
                    }
                }
        }
    }

    private fun refresh() {
        viewModelScope.launch {
            _uiState.update { it.copy(refreshing = true, errorMessage = null) }
            runCatching { repository.refreshFeed() }
                .onSuccess { articles ->
                    _uiState.value = FeedUiState(
                        loading = false,
                        refreshing = false,
                        items = articles.map { it.toFeedItemUiModel() }
                    )
                }
                .onFailure { error ->
                    _uiState.update { it.copy(refreshing = false) }
                    _effects.emit(FeedEffect.ShowMessage(error.userMessage()))
                }
        }
    }

    private fun openArticle(articleId: String) {
        viewModelScope.launch {
            _effects.emit(FeedEffect.OpenArticle(articleId))
        }
    }
}
```

注意点：

- 首次加载失败可以进入全屏错误状态；刷新失败通常保留旧列表并弹 Snackbar。
- `MutableSharedFlow` 默认不 replay，适合“当前页面可见时消费”的 UI 动作。
- ViewModel 不依赖 `NavController`、`SnackbarHostState`、Compose `State`。
- 列表日期格式化、作者名拼接等展示逻辑可以在 mapper 中做，避免 item 重组时重复计算。

## 4. Route

```kotlin
@Composable
fun FeedRoute(
    onOpenArticle: (String) -> Unit,
    viewModel: FeedViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(viewModel) {
        viewModel.effects.collect { effect ->
            when (effect) {
                is FeedEffect.OpenArticle -> onOpenArticle(effect.articleId)
                is FeedEffect.ShowMessage -> {
                    snackbarHostState.showSnackbar(effect.message)
                }
            }
        }
    }

    FeedScreen(
        uiState = uiState,
        snackbarHostState = snackbarHostState,
        onEvent = viewModel::onEvent
    )
}
```

`Route` 的重点是“连接”，不要在这里堆复杂布局。这样 `FeedScreen` 可以脱离 ViewModel 预览和测试。

## 5. Screen 与 Lazy 列表

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedScreen(
    uiState: FeedUiState,
    snackbarHostState: SnackbarHostState,
    onEvent: (FeedEvent) -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = { TopAppBar(title = { Text("Feed") }) },
        modifier = modifier
    ) { innerPadding ->
        when {
            uiState.loading -> FeedLoading(Modifier.padding(innerPadding))
            uiState.errorMessage != null && uiState.items.isEmpty() -> {
                FeedError(
                    message = uiState.errorMessage,
                    onRetryClick = { onEvent(FeedEvent.RetryClick) },
                    modifier = Modifier.padding(innerPadding)
                )
            }
            else -> {
                FeedList(
                    items = uiState.items,
                    onArticleClick = { onEvent(FeedEvent.ArticleClick(it)) },
                    modifier = Modifier.padding(innerPadding)
                )
            }
        }
    }
}

@Composable
private fun FeedList(
    items: List<FeedItemUiModel>,
    onArticleClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val listState = rememberLazyListState()

    LazyColumn(
        state = listState,
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = modifier.fillMaxSize()
    ) {
        items(
            items = items,
            key = { it.id },
            contentType = { it.kind }
        ) { item ->
            FeedArticleItem(
                item = item,
                onClick = { onArticleClick(item.id) }
            )
        }
    }
}
```

Lazy 列表关键点：

- `key = { it.id }` 不能用 index，否则插入、删除、排序时状态可能错位。
- 混合 item 类型建议提供 `contentType`。
- 图片使用 `aspectRatio` 或固定尺寸，避免加载后列表跳动。
- `rememberLazyListState()` 属于列表，不属于每个 item。

## 6. 类型安全导航

```kotlin
@Serializable
data object FeedDestination

@Serializable
data class ArticleDestination(val articleId: String)

@Composable
fun AppNavHost(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = FeedDestination
    ) {
        composable<FeedDestination> {
            FeedRoute(
                onOpenArticle = { articleId ->
                    navController.navigate(ArticleDestination(articleId))
                }
            )
        }

        composable<ArticleDestination> {
            ArticleRoute(onBack = navController::popBackStack)
        }
    }
}
```

详情页 ViewModel 从 `SavedStateHandle` 读取参数：

```kotlin
class ArticleViewModel(
    savedStateHandle: SavedStateHandle,
    repository: ArticleRepository
) : ViewModel() {
    private val args = savedStateHandle.toRoute<ArticleDestination>()

    val uiState: StateFlow<ArticleUiState> =
        repository.observeArticle(args.articleId)
            .map { article -> ArticleUiState.Content(article.toUiModel()) }
            .stateIn(
                scope = viewModelScope,
                started = SharingStarted.WhileSubscribed(5_000),
                initialValue = ArticleUiState.Loading
            )
}
```

导航原则：

- 传 `articleId`，不传完整 `Article` 对象。
- 目标页负责根据 ID 读取最新数据。
- `Screen` 不接收 `NavController`，只接收 `onBack`、`onOpenXxx`。

## 7. 详情页状态

详情页通常更适合 sealed state：

```kotlin
sealed interface ArticleUiState {
    data object Loading : ArticleUiState
    data class Content(
        val id: String,
        val title: String,
        val body: String,
        val favorite: Boolean
    ) : ArticleUiState
    data class Error(val message: String) : ArticleUiState
}
```

适合 sealed state 的情况：

- Loading、Content、Error 明显互斥。
- 页面主体只有一种主要内容。
- 希望避免 `loading = true` 且 `error != null` 的非法组合。

不适合 sealed state 的情况：

- 表单字段多，局部校验状态多。
- 列表页同时可能有旧数据、刷新状态、分页错误。

## 8. UI 测试样例

```kotlin
@Test
fun feed_clickArticle_emitsEvent() {
    var clickedId: String? = null

    composeTestRule.setContent {
        FeedScreen(
            uiState = FeedUiState(
                loading = false,
                items = listOf(
                    FeedItemUiModel(
                        id = "a1",
                        title = "Compose 状态管理",
                        summary = "状态应该放在哪里",
                        coverUrl = null,
                        authorName = "Android",
                        publishDateText = "2026-06-13",
                        kind = FeedItemKind.Article
                    )
                )
            ),
            snackbarHostState = remember { SnackbarHostState() },
            onEvent = { event ->
                if (event is FeedEvent.ArticleClick) clickedId = event.articleId
            }
        )
    }

    composeTestRule.onNodeWithText("Compose 状态管理").performClick()
    assertThat(clickedId).isEqualTo("a1")
}
```

测试建议：

- Screen 测试只验证“给定状态显示什么、点击发出什么事件”。
- ViewModel 单元测试验证状态转换、错误分支、Effect 发射。
- Navigation 测试单独验证目的地跳转。
- 动画或延迟逻辑使用 `mainClock` 控制时间，不依赖真实 sleep。

## 9. 性能检查点

Feed 页面上线前至少检查：

| 检查点 | 原因 |
|---|---|
| item 有 stable key | 避免重排序状态错位 |
| 混合 item 有 contentType | 提升 Lazy item 复用 |
| 图片尺寸稳定 | 避免加载后反复测量 |
| item 不做日期格式化 | 避免滚动时重复重计算 |
| 子组件只接收必要字段 | 缩小状态读取范围 |
| UI model 不暴露 MutableList | 提升稳定性和可推理性 |
| 首屏和滚动可 Macrobenchmark | 用数据确认优化效果 |

## 10. 常见变体

| 需求 | 推荐做法 |
|---|---|
| 下拉刷新 | 使用 Material/Accompanist 对应刷新组件，刷新状态放 `UiState.refreshing` |
| 分页 | 使用 Paging Compose，item key 仍使用业务 ID |
| 离线缓存 | Repository 先读数据库，再后台刷新网络 |
| 搜索 | query 用 `SavedStateHandle` 或 `rememberSaveable`，结果由 ViewModel 输出 |
| 列表滚动埋点 | `snapshotFlow { listState.firstVisibleItemIndex }` + `distinctUntilChanged()` |
| 详情页收藏 | 点击事件进 ViewModel，乐观更新要能失败回滚 |

## 11. 本章小结

一个可维护的 Compose 页面，不是把所有代码写成 Composable，而是把边界放对：

- `Composable` 负责描述 UI。
- `ViewModel` 负责状态转换和业务事件。
- `Repository` 负责真实数据来源。
- `Navigation` 只传简单参数。
- `Effect` 只处理受约束的副作用。
- `Test` 分层验证，不把所有逻辑压进 UI 测试。

参考资料见 [10-references.md](10-references.md)。
