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

