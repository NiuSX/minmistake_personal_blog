# 08. 测试、无障碍与 View 互操作

最后调研时间：2026-06-13  
主要来源：Android Developers Compose Testing、Accessibility、Interop 文档。

## 1. Compose 测试基础

测试依赖：

```kotlin
dependencies {
    androidTestImplementation(platform("androidx.compose:compose-bom:2026.05.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
```

测试规则：

```kotlin
@get:Rule
val composeTestRule = createComposeRule()
```

简单测试：

```kotlin
@Test
fun counter_incrementsWhenClicked() {
    composeTestRule.setContent {
        CounterScreen()
    }

    composeTestRule.onNodeWithText("Count: 0").assertExists()
    composeTestRule.onNodeWithText("增加").performClick()
    composeTestRule.onNodeWithText("Count: 1").assertExists()
}
```

## 2. 语义树

Compose 测试主要通过 Semantics 查找节点。Semantics 同时服务测试和无障碍。

常用查找：

```kotlin
onNodeWithText("登录")
onNodeWithContentDescription("返回")
onNodeWithTag("login_button")
onNode(hasClickAction() and hasText("保存"))
```

添加测试 tag：

```kotlin
Button(
    onClick = onLoginClick,
    modifier = Modifier.testTag("login_button")
) {
    Text("登录")
}
```

建议：

- 优先用用户可见文本和 contentDescription。
- 对动态文本、重复节点、复杂组件用 testTag。
- 不要为了测试加无意义可见文本。

## 3. 状态提升让测试更容易

无状态组件：

```kotlin
@Composable
fun LoginScreen(
    username: String,
    password: String,
    onUsernameChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onLoginClick: () -> Unit
) { }
```

测试时可以直接传假状态和记录事件：

```kotlin
@Test
fun loginButton_emitsClick() {
    var clicked = false

    composeTestRule.setContent {
        LoginScreen(
            username = "a",
            password = "b",
            onUsernameChange = {},
            onPasswordChange = {},
            onLoginClick = { clicked = true }
        )
    }

    composeTestRule.onNodeWithText("登录").performClick()
    assertThat(clicked).isTrue()
}
```

## 4. ViewModel 测试与 UI 测试分工

| 测试对象 | 测什么 |
|---|---|
| ViewModel 单元测试 | 事件处理、状态转换、错误处理 |
| Composable UI 测试 | 给定状态时显示什么、点击是否发出事件 |
| Navigation 测试 | 点击后是否导航到目标目的地 |
| Screenshot 测试 | 视觉回归，需额外工具 |
| Macrobenchmark | 启动、滚动、帧性能 |

不要用 UI 测试覆盖所有业务逻辑；业务逻辑放 ViewModel/UseCase 单元测试更稳定。

## 5. 动画、协程与测试时钟

Compose 测试默认会等待 UI 空闲。对于动画或延迟，可以控制测试时钟。

```kotlin
@Test
fun splash_navigatesAfterDelay() {
    composeTestRule.mainClock.autoAdvance = false

    var navigated = false
    composeTestRule.setContent {
        SplashScreen(onTimeout = { navigated = true })
    }

    composeTestRule.mainClock.advanceTimeBy(1_999)
    assertThat(navigated).isFalse()

    composeTestRule.mainClock.advanceTimeBy(1)
    assertThat(navigated).isTrue()
}
```

注意：

- 不要在 UI 测试里 `Thread.sleep()` 等动画。
- 对 `LaunchedEffect` 中的 `delay`，测试时钟通常能推进 Compose 相关协程时间。
- ViewModel 中复杂协程逻辑更适合用 coroutine test 单元测试。

## 6. 列表测试

Lazy 列表中不可见 item 不一定存在于语义树里，需要先滚动。

```kotlin
composeTestRule
    .onNodeWithTag("feed_list")
    .performScrollToIndex(30)

composeTestRule
    .onNodeWithText("第 30 篇文章")
    .assertIsDisplayed()
```

给列表添加 tag：

```kotlin
LazyColumn(
    modifier = Modifier.testTag("feed_list")
) {
    items(items, key = { it.id }) { item ->
        ArticleRow(item)
    }
}
```

建议：

- 测试滚动目标时，用稳定文本或 tag。
- 不要假设 LazyColumn 会组合所有 item。
- 对重复文本节点，用 `onAllNodesWithText()` 或更精确 matcher。

## 7. 无障碍基础

Compose 无障碍依赖语义信息。

图标按钮：

```kotlin
IconButton(onClick = onBack) {
    Icon(
        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
        contentDescription = "返回"
    )
}
```

装饰性图片：

```kotlin
Image(
    painter = painterResource(R.drawable.divider),
    contentDescription = null
)
```

规则：

- 有功能的图标必须有 `contentDescription`。
- 装饰图传 `null`，避免读屏噪音。
- 文本本身已经说明含义时，图标可传 `null`。
- 点击区域至少 48dp。
- 不要只用颜色表达状态。
- 表单错误要能被读屏理解。

## 8. 自定义语义

```kotlin
Box(
    modifier = Modifier.semantics {
        contentDescription = "进度 60%"
        progressBarRangeInfo = ProgressBarRangeInfo(
            current = 0.6f,
            range = 0f..1f
        )
    }
) {
    LinearProgressIndicator(progress = { 0.6f })
}
```

合并子节点：

```kotlin
Row(
    modifier = Modifier.semantics(mergeDescendants = true) {}
) {
    Text("订单号")
    Text("123456")
}
```

适合让读屏把多个视觉元素当成一个逻辑元素。

## 9. 文本与动态字体

Compose 应支持用户系统字体缩放。

注意：

- 不要固定高度导致大字体被裁剪。
- 按钮和卡片要允许文本换行或省略。
- 使用 `sp` 而不是 `dp` 作为文字大小。
- 对关键操作按钮测试大字体。

## 10. View 中嵌入 Compose

在 XML/View 项目中逐步迁移时，可以用 `ComposeView`。

```kotlin
class ProfileFragment : Fragment(R.layout.fragment_profile) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val composeView = view.findViewById<ComposeView>(R.id.compose_view)
        composeView.setViewCompositionStrategy(
            ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed
        )
        composeView.setContent {
            AppTheme {
                ProfileRoute()
            }
        }
    }
}
```

关键点：

- 设置合适的 `ViewCompositionStrategy`。
- Fragment 中通常用 `DisposeOnViewTreeLifecycleDestroyed`。
- 避免因为 View 生命周期和 Composition 生命周期不匹配导致泄漏。

## 11. Compose 中嵌入 View

使用 `AndroidView`：

```kotlin
@Composable
fun MapPanel(
    modifier: Modifier = Modifier
) {
    AndroidView(
        modifier = modifier,
        factory = { context ->
            MapView(context).apply {
                // 初始化
            }
        },
        update = { mapView ->
            // 根据 Compose state 更新 View
        }
    )
}
```

适合：

- 地图。
- 视频播放器。
- 广告 SDK。
- 复杂富文本编辑器。
- 尚无 Compose 版本的第三方控件。

注意：

- `factory` 创建 View。
- `update` 会在状态变化时调用，保持幂等。
- View 生命周期资源要正确释放，必要时结合 `DisposableEffect`。

`AndroidView` 的 `update` 可能频繁执行，不要在里面重复创建昂贵对象或重复注册监听器。监听器注册通常在 `factory` 或 `DisposableEffect` 中处理，`update` 只同步当前状态。

## 12. Fragment 与 Compose 导航迁移

渐进迁移策略：

1. 新页面用 Compose。
2. 老 Fragment 中局部嵌入 ComposeView。
3. 稳定后把整个 Fragment 内容替换为 Compose。
4. 再考虑迁移到 Navigation Compose。

不要一次性重写所有导航，风险较高。先从边界清晰、依赖少的页面开始。

## 13. 测试与无障碍清单

- 关键按钮是否可通过文本或 contentDescription 找到。
- 图标按钮是否有正确描述。
- 装饰图片是否 `contentDescription = null`。
- 自定义组件是否有语义。
- 大字体下文本是否裁剪。
- 表单错误是否可读。
- UI 测试是否覆盖空、加载、成功、失败。
- ViewModel 测试是否覆盖状态转换。
- ComposeView 是否设置 CompositionStrategy。
- AndroidView 是否处理 update 和资源释放。
- 动画测试是否使用 `mainClock`，没有真实 sleep。
- Lazy 列表测试是否先滚动到目标 item。
