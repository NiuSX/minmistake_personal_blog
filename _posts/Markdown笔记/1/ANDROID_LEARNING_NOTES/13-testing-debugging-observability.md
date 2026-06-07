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

