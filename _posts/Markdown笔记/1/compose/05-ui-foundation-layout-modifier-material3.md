# 05. UI 基础：Composable、Modifier、布局、Lazy 与 Material 3

最后调研时间：2026-06-11  
主要来源：Android Developers Modifiers、Layouts、Lists、Material 3、Animation 文档。

## 1. Composable 组件设计

推荐组件参数顺序：

```kotlin
@Composable
fun UserCard(
    user: UserUiModel,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Surface(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(user.name, style = MaterialTheme.typography.titleMedium)
            Text(user.email, style = MaterialTheme.typography.bodyMedium)
        }
    }
}
```

约定：

- `modifier` 放在第一个可选参数位置。
- 组件不要内部固定外层尺寸，除非它就是固定尺寸组件。
- 事件用 `onXxx` 命名。
- 状态参数和事件参数成对出现，例如 `checked` + `onCheckedChange`。
- 可复用组件尽量无状态。

## 2. Modifier 的本质

`Modifier` 是不可变链式对象，用来修饰 Composable 的布局、绘制、点击、语义、焦点等行为。

```kotlin
Modifier
    .fillMaxWidth()
    .padding(16.dp)
    .clip(RoundedCornerShape(12.dp))
    .background(MaterialTheme.colorScheme.surfaceVariant)
    .clickable(onClick = onClick)
    .padding(16.dp)
```

顺序非常重要。

上例含义：

1. 宽度填满父级。
2. 外边距 16dp。
3. 裁剪圆角。
4. 绘制背景。
5. 添加点击区域。
6. 内边距 16dp。

如果把 `clickable` 放在最前面，点击区域可能包含外部 padding；如果把 `background` 放在 padding 前后，背景覆盖范围不同。

## 3. Modifier 顺序示例

```kotlin
Text(
    text = "A",
    modifier = Modifier
        .background(Color.Yellow)
        .padding(16.dp)
)
```

背景只包住原始 Text 尺寸，然后 padding 在背景外。

```kotlin
Text(
    text = "A",
    modifier = Modifier
        .padding(16.dp)
        .background(Color.Yellow)
)
```

先扩大布局空间，再给扩大后的区域画背景。

实际经验：

- 尺寸、布局相关通常放前面。
- 语义、点击根据希望的命中区域决定位置。
- 绘制类 Modifier 的位置决定绘制范围。
- `padding` 前后语义不同，不能当普通 CSS margin/padding 简单类比。

## 4. 基础布局

### Column

```kotlin
Column(
    modifier = Modifier.fillMaxSize().padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(12.dp),
    horizontalAlignment = Alignment.CenterHorizontally
) {
    Text("标题")
    Button(onClick = {}) { Text("确定") }
}
```

### Row

```kotlin
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
) {
    Text("用户名")
    IconButton(onClick = {}) {
        Icon(Icons.Default.Edit, contentDescription = "编辑")
    }
}
```

### Box

```kotlin
Box(Modifier.fillMaxSize()) {
    Image(
        painter = painterResource(R.drawable.header),
        contentDescription = null,
        modifier = Modifier.fillMaxWidth()
    )
    Text(
        text = "标题",
        modifier = Modifier.align(Alignment.BottomStart).padding(16.dp)
    )
}
```

`Box` 适合叠放、对齐、浮层。

## 5. 约束与测量

Compose 布局基于约束：

1. 父布局给子布局约束。
2. 子布局在约束内测量自己。
3. 父布局决定子布局位置。

常见尺寸 API：

| API | 作用 |
|---|---|
| `fillMaxWidth()` | 尽量填满最大宽度 |
| `wrapContentSize()` | 根据内容包裹 |
| `size(48.dp)` | 固定宽高 |
| `requiredSize(48.dp)` | 强制尺寸，可能突破约束 |
| `weight(1f)` | Row/Column 中按剩余空间分配 |
| `aspectRatio(16f / 9f)` | 保持宽高比 |
| `heightIn(min, max)` | 限制高度范围 |

`weight` 示例：

```kotlin
Row(Modifier.fillMaxWidth()) {
    Text(
        text = "标题",
        modifier = Modifier.weight(1f)
    )
    IconButton(onClick = {}) {
        Icon(Icons.Default.MoreVert, contentDescription = "更多")
    }
}
```

## 6. Lazy 列表

`LazyColumn` 类似 RecyclerView，只组合和布局可见区域附近的 item。

```kotlin
LazyColumn(
    modifier = Modifier.fillMaxSize(),
    contentPadding = PaddingValues(16.dp),
    verticalArrangement = Arrangement.spacedBy(8.dp)
) {
    items(
        items = articles,
        key = { it.id }
    ) { article ->
        ArticleItem(article = article, onClick = { onArticleClick(article.id) })
    }
}
```

必须重视 `key`：

- 保持 item 身份。
- 避免重排序时状态错位。
- 帮助 Lazy 复用和动画。

内容类型：

```kotlin
items(
    items = messages,
    key = { it.id },
    contentType = { it.type }
) { message ->
    MessageItem(message)
}
```

`contentType` 可以帮助 Lazy 列表更好地复用相同类型布局。

## 7. Lazy 列表状态

```kotlin
@Composable
fun MessageList(messages: List<Message>) {
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    Box {
        LazyColumn(state = listState) {
            items(messages, key = { it.id }) { message ->
                MessageItem(message)
            }
        }

        FloatingActionButton(
            onClick = {
                scope.launch {
                    listState.animateScrollToItem(0)
                }
            },
            modifier = Modifier.align(Alignment.BottomEnd).padding(16.dp)
        ) {
            Icon(Icons.Default.KeyboardArrowUp, contentDescription = "回到顶部")
        }
    }
}
```

不要把 `rememberLazyListState()` 放进每个 item 中，通常列表级别持有一个。

## 8. Scaffold

`Scaffold` 提供 Material 页面基础结构：

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() {
    val snackbarHostState = remember { SnackbarHostState() }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("首页") })
        },
        floatingActionButton = {
            FloatingActionButton(onClick = {}) {
                Icon(Icons.Default.Add, contentDescription = "新增")
            }
        },
        snackbarHost = {
            SnackbarHost(snackbarHostState)
        }
    ) { innerPadding ->
        HomeContent(
            modifier = Modifier.padding(innerPadding)
        )
    }
}
```

注意：必须处理 `innerPadding`，否则内容可能被 top bar 或 bottom bar 遮挡。

## 9. Material 3 主题

主题通常包含：

- ColorScheme。
- Typography。
- Shapes。
- 动态颜色。
- 暗色模式。

```kotlin
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        darkColorScheme()
    } else {
        lightColorScheme()
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = AppTypography,
        shapes = AppShapes,
        content = content
    )
}
```

使用主题值：

```kotlin
Text(
    text = "标题",
    color = MaterialTheme.colorScheme.onSurface,
    style = MaterialTheme.typography.titleLarge
)
```

不要在业务页面到处硬编码颜色、字号。可复用 UI 应从 `MaterialTheme` 或自定义 design token 读取。

## 10. CompositionLocal

`CompositionLocal` 用于向子树隐式提供值，例如主题、权限、当前用户显示策略等。

```kotlin
val LocalSpacing = staticCompositionLocalOf {
    Spacing()
}

data class Spacing(
    val small: Dp = 8.dp,
    val medium: Dp = 16.dp,
    val large: Dp = 24.dp
)

@Composable
fun AppTheme(content: @Composable () -> Unit) {
    CompositionLocalProvider(LocalSpacing provides Spacing()) {
        MaterialTheme(content = content)
    }
}
```

使用：

```kotlin
val spacing = LocalSpacing.current
Column(Modifier.padding(spacing.medium)) { }
```

慎用：

- 不要用 CompositionLocal 传业务数据。
- 不要隐藏关键依赖，导致组件难测试。
- 更适合全局 UI 环境值。

## 11. 动画基础

状态驱动动画：

```kotlin
val alpha by animateFloatAsState(
    targetValue = if (visible) 1f else 0f,
    label = "alpha"
)

Box(Modifier.graphicsLayer { this.alpha = alpha })
```

显示隐藏：

```kotlin
AnimatedVisibility(visible = expanded) {
    Text("更多内容")
}
```

内容切换：

```kotlin
AnimatedContent(
    targetState = count,
    label = "count"
) { targetCount ->
    Text("Count: $targetCount")
}
```

原则：

- 动画目标由状态决定。
- 不要在 Composable 函数体中手写无限循环动画，使用 Effect 或动画 API。
- 列表大量 item 同时动画要谨慎测量性能。

## 12. 图片加载

Compose 官方基础库提供 Image，但网络图片通常使用第三方库，例如 Coil。

```kotlin
AsyncImage(
    model = imageUrl,
    contentDescription = title,
    contentScale = ContentScale.Crop,
    modifier = Modifier
        .fillMaxWidth()
        .aspectRatio(16f / 9f)
)
```

注意：

- 列表图片要给稳定尺寸，避免加载完成后布局跳动。
- `contentDescription` 根据语义决定，装饰图传 `null`。
- 大图、圆角、阴影、模糊会增加绘制成本。

## 13. 组件 API 设计清单

- 是否暴露 `modifier`。
- 是否可预览。
- 是否无状态。
- 是否使用主题颜色和字体。
- 点击区域是否至少 48dp。
- 文本是否考虑长文案、换行、省略。
- 图片是否有尺寸约束。
- 列表 item 是否有 stable key。
- `contentDescription` 是否正确。
- 是否把业务逻辑挤进 UI 组件。

