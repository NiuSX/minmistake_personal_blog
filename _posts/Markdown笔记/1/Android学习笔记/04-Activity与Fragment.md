# 04. Activity、Fragment 与生命周期

## Activity

Activity 是 Android 应用的界面入口。每个 Activity 都有生命周期，由系统管理。

常见生命周期方法：

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onStart() {
        super.onStart()
    }

    override fun onResume() {
        super.onResume()
    }

    override fun onPause() {
        super.onPause()
    }

    override fun onStop() {
        super.onStop()
    }

    override fun onDestroy() {
        super.onDestroy()
    }
}
```

## 生命周期顺序

典型启动：

```text
onCreate → onStart → onResume
```

退到后台：

```text
onPause → onStop
```

重新回到前台：

```text
onRestart → onStart → onResume
```

销毁：

```text
onPause → onStop → onDestroy
```

## 生命周期设计原则

- `onCreate`：初始化界面、依赖、状态观察。
- `onStart`：界面可见相关操作。
- `onResume`：开始前台交互。
- `onPause`：暂停动画、保存轻量状态。
- `onStop`：释放可见性相关资源。
- `onDestroy`：清理资源，但不要假设一定会被调用。

不要在 Activity 中放大量业务逻辑。

## 配置变化

屏幕旋转、语言变化、深色模式切换等可能导致 Activity 重建。

应使用 ViewModel 保存 UI 状态：

```kotlin
class UserViewModel : ViewModel() {
    private val _state = MutableStateFlow(UserUiState())
    val state: StateFlow<UserUiState> = _state
}
```

不要依赖 Activity 字段保存关键状态。

## Fragment

Fragment 是可复用 UI 片段，传统 View 项目常见。它也有生命周期，并且有 View 生命周期。

Fragment 生命周期和 View 生命周期不同：

- Fragment 对象可能存在。
- Fragment 的 View 可能已销毁。

因此在 Fragment 中观察 UI 数据时要绑定 `viewLifecycleOwner`。

## Fragment 常见问题

- 在 `onCreateView` 之前访问 View。
- 在 View 销毁后继续持有 View 引用。
- 使用 Fragment 构造函数传参。
- 在 Fragment 中放过多业务逻辑。

推荐通过 `arguments` 或 Navigation Safe Args 传参。

## ViewModel

ViewModel 的作用：

- 保存 UI 状态。
- 执行界面相关业务逻辑。
- 在配置变化后保留。
- 调用 UseCase 或 Repository。

ViewModel 不应持有 Activity、Fragment、View 的强引用。

## SavedStateHandle

用于保存可恢复的小状态：

```kotlin
class DetailViewModel(
    savedStateHandle: SavedStateHandle
) : ViewModel() {
    private val id: String = checkNotNull(savedStateHandle["id"])
}
```

适合导航参数、搜索关键字等。

## Lifecycle-aware API

现代 Android 推荐使用生命周期感知 API：

```kotlin
repeatOnLifecycle(Lifecycle.State.STARTED) {
    viewModel.state.collect { state ->
        render(state)
    }
}
```

Compose 中使用：

```kotlin
val state by viewModel.state.collectAsStateWithLifecycle()
```

## 本章检查清单

- 是否能描述 Activity 生命周期？
- 是否知道配置变化会导致 Activity 重建？
- 是否理解 ViewModel 的作用？
- 是否知道 Fragment 生命周期和 View 生命周期不同？
- 是否能使用生命周期感知方式收集 Flow？

## 生命周期的三个层次

Android 生命周期至少要分三层理解：

| 层次 | 典型对象 | 关注点 |
| --- | --- | --- |
| 组件生命周期 | Activity、Fragment、Service | 系统何时创建、暂停、销毁组件 |
| UI 生命周期 | Fragment View、Compose Composition | 界面树何时存在、何时可绘制、何时退出组合 |
| 状态生命周期 | ViewModel、SavedStateHandle、数据库 | 状态是否能跨旋转、进程死亡、应用重启 |

常见错误是把这三层混在一起。例如 Fragment 对象还活着，不代表它的 View 还活着；ViewModel 还活着，不代表页面还可见；Compose 重新组合，不代表 Activity 重新创建。

## Activity 生命周期重点

典型回调：

```text
onCreate -> onStart -> onResume -> onPause -> onStop -> onDestroy
```

实践建议：

- `onCreate`：初始化依赖、设置 UI、读取启动参数。
- `onStart`：开始可见时需要的轻量资源。
- `onResume`：恢复前台交互。
- `onPause`：提交短小、必须立即保存的状态。
- `onStop`：停止可见时资源，例如相机预览。
- `onDestroy`：只做组件释放，不要假设一定会被调用。

耗时初始化不要全部塞进 `onCreate`，否则会拖慢冷启动。

## Fragment View 生命周期

Fragment 有两个生命周期：

- Fragment 自身生命周期。
- Fragment 创建出来的 View 生命周期。

收集 UI Flow 时应绑定 `viewLifecycleOwner`：

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.state.collect { state ->
            render(state)
        }
    }
}
```

不要在 Fragment 的 `lifecycleScope` 中长期持有 View 引用，否则 View 销毁后仍可能更新旧 View，造成崩溃或内存泄漏。

## Compose 生命周期关注点

Compose 中要区分：

- Recomposition：状态变化导致函数重新执行。
- Composition：Composable 进入或离开组合。
- Activity lifecycle：宿主 Activity 的生命周期。

副作用要放在 Effect API 中：

```kotlin
LaunchedEffect(userId) {
    viewModel.loadUser(userId)
}
```

`LaunchedEffect` 的 key 变化会取消旧协程并启动新协程。key 选择错误会导致重复请求或请求不触发。

## 进程死亡与状态恢复

ViewModel 可以跨配置变更，但不能保证跨进程死亡。重要状态分三类保存：

| 状态类型 | 示例 | 保存位置 |
| --- | --- | --- |
| UI 临时状态 | 输入框文本、当前 tab | `rememberSaveable`、`SavedStateHandle` |
| 业务状态 | 笔记内容、用户设置 | Room、DataStore、后端 |
| 可重新加载状态 | 列表数据、详情数据 | Repository 重新拉取或本地缓存 |

不要把大量对象塞进 `Bundle` 或 `SavedStateHandle`，它们适合保存小型、可序列化、用于恢复入口的状态，例如 id、筛选条件、页码。

## 生命周期相关排错清单

- 旋转屏幕后状态丢失：检查是否只存在 Composable 局部 `remember` 中。
- 返回上一页后崩溃：检查协程是否仍在更新已销毁的 View。
- 重复请求接口：检查 `LaunchedEffect` key、`init` 和导航回退栈。
- 内存泄漏：检查静态单例、长生命周期对象是否持有 Activity、View、Context。
- 后台回来 UI 旧数据：检查 Repository 是否有刷新策略和缓存失效策略。
