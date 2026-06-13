# 05. UI：View 系统与 Jetpack Compose

## Android UI 两种主要方式

传统方式：

- XML 布局。
- View / ViewGroup。
- Activity / Fragment 控制界面。

现代方式：

- Jetpack Compose。
- Kotlin 声明式 UI。
- 状态驱动界面。

新项目通常优先选择 Compose，但理解 View 系统仍然有价值，因为大量历史项目和部分组件仍然基于 View。

## View 系统基础

XML 示例：

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello" />
</LinearLayout>
```

常见 ViewGroup：

- LinearLayout。
- FrameLayout。
- ConstraintLayout。
- RecyclerView。

## RecyclerView

RecyclerView 用于列表：

- Adapter 提供数据。
- ViewHolder 复用 item view。
- LayoutManager 控制布局。

在 Compose 中，列表通常使用 `LazyColumn` 或 `LazyRow`。

## Compose 基础

Composable 函数：

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name")
}
```

组合 UI：

```kotlin
@Composable
fun ProfileCard(user: User) {
    Column {
        Text(text = user.name)
        Text(text = user.email)
    }
}
```

## Modifier

Modifier 用于修饰布局、大小、点击、背景等：

```kotlin
Text(
    text = "Hello",
    modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
)
```

Modifier 顺序会影响结果。

## Compose 布局

常见布局：

- Column：垂直排列。
- Row：水平排列。
- Box：叠放。
- LazyColumn：懒加载垂直列表。
- LazyRow：懒加载水平列表。

示例：

```kotlin
LazyColumn {
    items(users) { user ->
        Text(text = user.name)
    }
}
```

## Material 3

Material 3 提供现代 Android 组件：

- Button。
- TextField。
- Card。
- Scaffold。
- TopAppBar。
- NavigationBar。
- FloatingActionButton。

示例：

```kotlin
Scaffold(
    topBar = { TopAppBar(title = { Text("Home") }) }
) { padding ->
    Column(modifier = Modifier.padding(padding)) {
        Text("Content")
    }
}
```

## 主题

Compose 主题通常包含：

- ColorScheme。
- Typography。
- Shapes。

```kotlin
@Composable
fun AppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(),
        typography = Typography(),
        content = content
    )
}
```

## 预览

```kotlin
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    AppTheme {
        Greeting("Android")
    }
}
```

Preview 能提高 UI 开发效率，但不能替代真机测试。

## View 与 Compose 混用

在 View 项目中嵌入 Compose：

```kotlin
ComposeView(context).setContent {
    AppTheme {
        Greeting("Android")
    }
}
```

在 Compose 中嵌入 View：

```kotlin
AndroidView(factory = { context ->
    TextView(context)
})
```

混用适合渐进迁移。

## UI 设计建议

- UI 由状态驱动。
- Composable 尽量保持无副作用。
- 复杂界面拆分小组件。
- 可复用组件放到 design-system。
- 列表 item 提供稳定 key。
- 不在 Composable 中直接执行耗时任务。

## 本章检查清单

- 是否理解 View 系统和 Compose 的区别？
- 是否会写基本 Composable？
- 是否知道 Modifier 顺序重要？
- 是否会使用 LazyColumn？
- 是否知道 Scaffold 和 Material 3 的作用？

## View 系统与 Compose 的本质区别

| 维度 | View 系统 | Compose |
| --- | --- | --- |
| UI 描述方式 | XML 或命令式创建 View | Kotlin 函数声明 UI |
| 更新方式 | 手动 `setText()`、`notifyDataSetChanged()` | 状态变化触发重组 |
| 状态保存 | View、Fragment、ViewModel 混合 | `remember`、`rememberSaveable`、ViewModel |
| 复用单位 | View、Fragment、自定义 View | Composable 函数 |
| 迁移方式 | 已有项目常见 | 可通过 `ComposeView` 渐进接入 |

Compose 不是“用 Kotlin 写 XML”，而是“UI = f(state)”。你不应该手动寻找某个 TextView 再改文字，而是改变状态，让 UI 根据状态重新计算。

## Composable 设计原则

推荐把界面拆成两类函数：

```kotlin
@Composable
fun ArticleRoute(
    viewModel: ArticleViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    ArticleScreen(
        state = state,
        onRefresh = viewModel::refresh,
        onOpenArticle = viewModel::openArticle
    )
}

@Composable
fun ArticleScreen(
    state: ArticleUiState,
    onRefresh: () -> Unit,
    onOpenArticle: (String) -> Unit
) {
    // 只负责展示状态和发送事件
}
```

- `Route` 负责连接 ViewModel、导航和生命周期。
- `Screen` 负责纯展示，更容易 Preview 和 UI Test。

## Modifier 顺序示例

Modifier 是有顺序的：

```kotlin
Text(
    text = "Android",
    modifier = Modifier
        .padding(16.dp)
        .background(Color.Yellow)
)
```

和：

```kotlin
Text(
    text = "Android",
    modifier = Modifier
        .background(Color.Yellow)
        .padding(16.dp)
)
```

视觉结果不同。前者先加外边距再绘制背景，后者先绘制背景再给内容留内边距。写布局问题时先检查 Modifier 顺序。

## 列表与 key

`LazyColumn` 中稳定 key 很重要：

```kotlin
LazyColumn {
    items(
        items = articles,
        key = { it.id }
    ) { article ->
        ArticleRow(article = article)
    }
}
```

没有稳定 key 时，插入、删除、排序可能导致状态错位，例如复选框、展开状态、输入框内容出现在错误 item 上。

## Preview 和设计系统

建议为设计系统组件写 Preview：

```kotlin
@Preview(showBackground = true)
@Composable
private fun ArticleRowPreview() {
    AppTheme {
        ArticleRow(
            article = ArticleUiModel(
                id = "1",
                title = "Compose 入门",
                summary = "状态驱动 UI"
            )
        )
    }
}
```

Preview 不代替测试，但能快速发现布局溢出、深色模式、长文本和空状态问题。

## UI 常见坑

- 在 Composable 里直接发网络请求，导致重组时重复请求。
- `LazyColumn` 不设置 key，列表状态错位。
- 把大对象或不稳定对象层层传递，导致重组范围过大。
- 所有页面直接使用 Material 组件，没有抽设计系统，后期统一风格困难。
- 只测正常长度文案，没有测试长标题、多语言、无数据、错误状态。
