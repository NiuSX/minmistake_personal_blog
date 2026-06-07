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

