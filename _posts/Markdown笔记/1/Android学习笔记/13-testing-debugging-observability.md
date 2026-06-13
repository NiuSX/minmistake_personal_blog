# 13. 测试、调试与可观测性

## 测试类型

Android 测试分为：

- 本地单元测试：运行在 JVM。
- Instrumented Test：运行在设备或模拟器。
- UI Test：验证界面交互。
- 集成测试：验证多个模块协作。
- 端到端测试：模拟真实用户流程。

## 本地单元测试

适合测试：

- UseCase。
- Repository 纯逻辑。
- ViewModel。
- Mapper。
- 校验函数。

示例：

```kotlin
class LoginUseCaseTest {
    @Test
    fun loginFailsWhenPasswordEmpty() {
        val result = useCase(username = "a", password = "")
        assertTrue(result.isFailure)
    }
}
```

## ViewModel 测试

ViewModel 测试重点：

- 初始状态。
- 事件处理。
- Flow 状态变化。
- 错误处理。
- 协程调度。

常用：

- kotlinx-coroutines-test。
- Turbine。
- MockK。

## Compose UI Test

```kotlin
@get:Rule
val composeRule = createComposeRule()

@Test
fun buttonShowsText() {
    composeRule.setContent {
        SaveButton(onClick = {})
    }

    composeRule
        .onNodeWithText("Save")
        .assertExists()
}
```

建议给关键组件设置语义信息，提升测试稳定性。

## Room 测试

可以使用内存数据库：

```kotlin
Room.inMemoryDatabaseBuilder(
    context,
    AppDatabase::class.java
).build()
```

测试：

- DAO 查询。
- 插入更新。
- Migration。
- Flow 观察。

## 调试

Android Studio 调试能力：

- 断点。
- 条件断点。
- Evaluate Expression。
- 查看调用栈。
- 查看变量。
- Logcat。
- Layout Inspector。
- Profiler。

调试建议：

- 先复现问题。
- 缩小范围。
- 查看日志和状态。
- 使用断点验证假设。
- 不要只靠猜。

## 日志

日志应包含：

- 关键路径。
- 错误信息。
- 请求 ID 或业务 ID。
- 重要状态变化。

避免：

- token。
- 密码。
- 用户隐私。
- 大量无意义日志。

## 崩溃分析

生产环境建议接入崩溃分析工具，关注：

- 崩溃率。
- 受影响用户数。
- 设备型号。
- Android 版本。
- 堆栈。
- 最近版本变化。

## 可观测性

除了崩溃，还应关注：

- 冷启动耗时。
- 页面加载耗时。
- API 成功率。
- ANR。
- 内存峰值。
- 用户关键路径转化。
- 后台任务成功率。

## 测试策略

优先测试：

- Domain 层业务规则。
- ViewModel 状态机。
- Repository 缓存策略。
- 数据映射。
- 权限和错误路径。
- 关键 UI 流程。

不要把所有测试都写成慢速 UI 测试。

## 本章检查清单

- 是否能区分本地测试和设备测试？
- 是否会测试 ViewModel 的状态变化？
- 是否知道 Compose UI Test 的基本用法？
- 是否会使用 Profiler 和 Layout Inspector？
- 是否知道生产环境要关注崩溃和 ANR？

## 测试金字塔

Android 测试应尽量让大多数测试快速、稳定、可在本地 JVM 跑：

```text
少量端到端 UI 测试
中等数量组件 / Repository / 数据库测试
大量单元测试：UseCase、Mapper、ViewModel 状态机
```

不要把所有逻辑都留到 UI 测试验证。UI 测试慢、易受设备状态影响，适合覆盖关键路径，不适合覆盖所有分支。

## ViewModel 测试重点

测试 ViewModel 时关注“输入事件 -> 状态变化”：

```kotlin
@Test
fun login_failed_shows_error() = runTest {
    val viewModel = LoginViewModel(fakeLoginUseCase)

    viewModel.onUsernameChange("user")
    viewModel.onPasswordChange("bad")
    viewModel.onLoginClick()

    assertThat(viewModel.state.value.errorMessage).isEqualTo("用户名或密码错误")
}
```

如果使用 Flow，可配合 Turbine 测试发射序列。

## Repository 测试重点

Repository 测试覆盖：

- 网络成功后是否写入本地数据库。
- 网络失败时是否返回缓存。
- 401 是否映射为 Unauthorized。
- JSON 缺字段是否有兼容处理。
- 数据库迁移后旧数据是否保留。

可使用 fake API、内存 Room 数据库和测试 Dispatcher。

## Compose UI Test

Compose 测试建议给关键节点设置语义：

```kotlin
Button(
    modifier = Modifier.testTag("login_button"),
    onClick = onLogin
) {
    Text("登录")
}
```

测试示例：

```kotlin
composeTestRule
    .onNodeWithTag("login_button")
    .performClick()

composeTestRule
    .onNodeWithText("用户名不能为空")
    .assertIsDisplayed()
```

不要只依赖文案查找节点。多语言、文案调整会让测试脆弱，关键控件可使用 `testTag`。

## 调试工具使用场景

| 工具 | 适合排查 |
| --- | --- |
| Logcat | 崩溃、业务日志、系统事件 |
| Debugger | 变量、调用栈、条件断点 |
| Layout Inspector | View / Compose 层级、布局问题 |
| App Inspection | Room、Network、Background Task |
| Profiler | CPU、内存、网络、能耗 |
| Macrobenchmark | 启动、滚动、帧率等性能基准 |

日志要分级、可过滤、可脱敏。不要让生产日志成为敏感数据泄漏源。

## 可观测性指标

生产环境建议至少关注：

- Crash-free users / sessions。
- ANR 率。
- 冷启动和热启动耗时。
- 页面加载耗时。
- 网络错误率和超时率。
- 后台同步成功率。
- 内存峰值和 OOM。
- 关键业务漏斗。

指标要能关联版本、机型、系统版本和网络环境，否则很难定位问题。
