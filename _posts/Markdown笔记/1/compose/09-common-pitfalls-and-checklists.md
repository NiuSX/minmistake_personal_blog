# 09. 常见坑与检查清单

最后调研时间：2026-06-11  
来源：官方文档规则 + 中文社区 CSDN、掘金、博客园、SegmentFault 中关于 Compose 状态、重组、LazyColumn、副作用的实战经验综合。

## 1. 状态相关坑

### 普通变量不会触发 UI 更新

错误：

```kotlin
var count = 0
Button(onClick = { count++ }) {
    Text("$count")
}
```

正确：

```kotlin
var count by remember { mutableIntStateOf(0) }
```

### 可变集合变化不一定触发重组

错误：

```kotlin
val list = remember { mutableListOf<String>() }
list.add("A")
```

正确：

```kotlin
var list by remember { mutableStateOf(emptyList<String>()) }
list = list + "A"
```

或：

```kotlin
val list = remember { mutableStateListOf<String>() }
list.add("A")
```

### 把业务状态放在 `remember`

问题：

- 配置变更丢失。
- 页面离开丢失。
- 进程死亡不可恢复。
- 无法被业务层复用。

修正：页面业务状态放 ViewModel，持久状态放 Repository/DataStore/Room。

## 2. 副作用相关坑

### 在 Composable 函数体里请求网络

错误：

```kotlin
@Composable
fun UserScreen(repo: UserRepository) {
    val user = repo.loadUser()
}
```

修正：

- ViewModel `init` 加载。
- 或 `LaunchedEffect(key)` 触发。

### `LaunchedEffect` key 选择错误

key 太宽：

```kotlin
LaunchedEffect(uiState) { ... }
```

可能每次状态变化都重启。

key 太窄：

```kotlin
LaunchedEffect(Unit) {
    load(userId)
}
```

如果 `userId` 变化但页面未离开，不会重新加载。

修正：

```kotlin
LaunchedEffect(userId) {
    load(userId)
}
```

### `DisposableEffect` 忘记释放

错误：

```kotlin
DisposableEffect(Unit) {
    listener.start()
    onDispose { }
}
```

正确：

```kotlin
DisposableEffect(Unit) {
    listener.start()
    onDispose { listener.stop() }
}
```

## 3. LazyColumn 相关坑

### 没有 stable key

错误：

```kotlin
items(users) { user -> UserRow(user) }
```

正确：

```kotlin
items(users, key = { it.id }) { user -> UserRow(user) }
```

### index 当 key

```kotlin
itemsIndexed(users, key = { index, _ -> index }) { _, user -> }
```

插入、删除、排序后 index 变化，状态可能错位。应使用业务 ID。

### item 内做重计算

错误：

```kotlin
items(orders) { order ->
    Text(order.items.sumOf { it.price }.toString())
}
```

修正：在 ViewModel 中转换成 UI model，或 `remember(order.id, order.items)` 缓存。

### 图片无固定尺寸

网络图加载前后尺寸变化会导致布局跳动。

```kotlin
AsyncImage(
    model = url,
    contentDescription = title,
    modifier = Modifier
        .fillMaxWidth()
        .aspectRatio(16f / 9f),
    contentScale = ContentScale.Crop
)
```

## 4. Modifier 相关坑

### 顺序错误导致点击区域不符合预期

```kotlin
Modifier
    .padding(16.dp)
    .clickable { }
```

点击区域不包含外部 padding。

```kotlin
Modifier
    .clickable { }
    .padding(16.dp)
```

点击区域包含 padding。

没有绝对对错，只看目标命中区域。

### 组件内部吞掉外部 modifier

错误：

```kotlin
@Composable
fun UserCard(user: User) {
    Card(Modifier.fillMaxWidth()) { }
}
```

正确：

```kotlin
@Composable
fun UserCard(
    user: User,
    modifier: Modifier = Modifier
) {
    Card(modifier.fillMaxWidth()) { }
}
```

## 5. Navigation 相关坑

### 路由传大对象

问题：

- 参数过大。
- 序列化复杂。
- 进程恢复困难。
- 数据可能过期。

修正：只传 ID。

### 底部导航重复创建页面

切换 tab 时建议：

```kotlin
navController.navigate(route) {
    popUpTo(navController.graph.findStartDestination().id) {
        saveState = true
    }
    launchSingleTop = true
    restoreState = true
}
```

### 在 Screen 里直接依赖 NavController

不推荐：

```kotlin
fun DetailScreen(navController: NavController)
```

推荐：

```kotlin
fun DetailScreen(onBack: () -> Unit, onOpenUser: (String) -> Unit)
```

这样 Screen 更容易预览和测试。

## 6. 性能相关坑

### 传整个 UiState 到所有子组件

问题：任何字段变化都可能影响多个子组件。

修正：子组件只接收需要的字段。

### 滥用 `derivedStateOf`

适合输入频繁变化、输出低频变化的场景，不适合简单拼接。

### 滥用 `remember`

`remember` 是缓存，不是性能护身符。简单表达式不用缓存，昂贵计算才缓存。

### 不稳定 UI State

避免：

```kotlin
data class UiState(
    val items: MutableList<Item>
)
```

推荐：

```kotlin
data class UiState(
    val items: List<ItemUiModel>
)
```

## 7. 测试和无障碍坑

### 图标按钮无描述

错误：

```kotlin
Icon(Icons.Default.Delete, contentDescription = null)
```

如果图标是按钮核心含义，应写：

```kotlin
Icon(Icons.Default.Delete, contentDescription = "删除")
```

### 测试只依赖层级

Compose UI 树可能变化，不要写过度依赖层级结构的测试。优先通过文本、语义、testTag 查找。

### 大字体裁剪

固定高度按钮、卡片、列表 item 在系统字体放大时容易裁剪。重要页面要测试大字体。

## 8. 代码审查清单

状态：

- 状态是否放在正确拥有者。
- UI State 是否不可变。
- 是否避免普通变量保存 UI 状态。
- 是否避免可变集合直接暴露给 UI。
- 是否区分持续状态和一次性事件。

副作用：

- 是否没有在 Composable 函数体直接做请求、写库、埋点。
- `LaunchedEffect` key 是否准确。
- `DisposableEffect` 是否释放资源。
- 长生命周期 Effect 是否需要 `rememberUpdatedState`。

组件：

- 是否暴露 `modifier`。
- 是否尽量无状态。
- 是否从 MaterialTheme 读取颜色和字体。
- 是否支持预览。
- 文案变长时是否正常。

列表：

- 是否有 stable key。
- 是否需要 contentType。
- item 是否避免重计算。
- 图片是否有尺寸约束。

导航：

- 是否只传 ID 或简单参数。
- Screen 是否不直接依赖 NavController。
- 顶层 tab 是否处理状态保存。

性能：

- 是否避免过宽状态读取。
- 是否避免不必要的重组热点。
- 是否用工具验证过关键路径。

无障碍和测试：

- 图标按钮是否有描述。
- 装饰图是否 description 为 null。
- 点击区域是否足够大。
- 关键状态是否有 UI 测试。

