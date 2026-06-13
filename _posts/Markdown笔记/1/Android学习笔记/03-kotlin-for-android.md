# 03. Android 常用 Kotlin 基础

## Kotlin 在 Android 中的定位

Kotlin 是现代 Android 开发的首选语言。它相比 Java 更简洁，并提供：

- 空安全。
- 数据类。
- 扩展函数。
- 高阶函数。
- 协程。
- Flow。
- sealed class / sealed interface。
- 更友好的集合 API。

## 变量

```kotlin
val name: String = "Android"
var count: Int = 0
```

- `val`：只读引用，优先使用。
- `var`：可变引用，必要时使用。

类型可推导：

```kotlin
val age = 18
```

## 空安全

不可空：

```kotlin
var name: String = "Alice"
```

可空：

```kotlin
var nickname: String? = null
```

安全调用：

```kotlin
val length = nickname?.length
```

Elvis 运算符：

```kotlin
val displayName = nickname ?: "Unknown"
```

非空断言：

```kotlin
val length = nickname!!.length
```

`!!` 可能导致崩溃，应尽量避免。

## data class

```kotlin
data class User(
    val id: String,
    val name: String,
    val age: Int
)
```

自动生成：

- `equals`
- `hashCode`
- `toString`
- `copy`
- 解构函数

更新状态常用 `copy`：

```kotlin
val newUser = user.copy(name = "Bob")
```

## sealed class / sealed interface

适合表达有限状态：

```kotlin
sealed interface UiState {
    data object Loading : UiState
    data class Success(val users: List<User>) : UiState
    data class Error(val message: String) : UiState
}
```

配合 `when`：

```kotlin
when (state) {
    UiState.Loading -> showLoading()
    is UiState.Success -> showUsers(state.users)
    is UiState.Error -> showError(state.message)
}
```

## 扩展函数

```kotlin
fun String.isEmail(): Boolean {
    return contains("@")
}
```

Android 中常用于：

- DTO 到 Domain 映射。
- View 工具函数。
- 格式转换。

注意不要滥用扩展函数隐藏复杂业务逻辑。

## 高阶函数

函数作为参数：

```kotlin
fun retry(times: Int, block: () -> Unit) {
    repeat(times) {
        block()
    }
}
```

Compose 中事件回调大量使用函数参数：

```kotlin
@Composable
fun SaveButton(onClick: () -> Unit) {
    Button(onClick = onClick) {
        Text("Save")
    }
}
```

## 集合

只读集合：

```kotlin
val names: List<String> = listOf("A", "B")
```

可变集合：

```kotlin
val names = mutableListOf<String>()
names.add("A")
```

常用操作：

```kotlin
users.map { it.name }
users.filter { it.age >= 18 }
users.firstOrNull { it.id == id }
users.groupBy { it.department }
```

## object

单例：

```kotlin
object AppConfig {
    const val BASE_URL = "https://example.com"
}
```

伴生对象：

```kotlin
class User {
    companion object {
        const val DEFAULT_NAME = "Unknown"
    }
}
```

## scope functions

常见作用域函数：

- `let`
- `run`
- `with`
- `apply`
- `also`

示例：

```kotlin
val user = User(name = "Alice").also {
    println("created $it")
}
```

建议：不要为了链式调用牺牲可读性。

## Result

```kotlin
fun loadUser(): Result<User> {
    return runCatching {
        api.fetchUser()
    }
}
```

Android 项目也常定义自己的错误类型，而不是只用 Kotlin 标准 `Result`。

## 本章检查清单

- 是否理解 `val` 和 `var`？
- 是否能正确处理可空类型？
- 是否会用 data class 表达状态？
- 是否知道 sealed 类型适合 UI 状态？
- 是否能使用 map、filter、firstOrNull 等集合操作？

## Android 中最常用的 Kotlin 思维

Kotlin 在 Android 中的核心价值不是语法更短，而是更适合表达状态、结果和异步流程。

### 用不可变数据表达 UI 状态

```kotlin
data class ArticleListUiState(
    val isLoading: Boolean = false,
    val articles: List<ArticleUiModel> = emptyList(),
    val errorMessage: String? = null
)
```

更新状态时使用 `copy`：

```kotlin
_state.update {
    it.copy(isLoading = true, errorMessage = null)
}
```

这样比在多个可变字段之间同步更容易测试，也更适合 Compose 重组。

### 用 sealed 表达有限结果

```kotlin
sealed interface LoadState<out T> {
    data object Loading : LoadState<Nothing>
    data class Success<T>(val data: T) : LoadState<T>
    data class Error(val cause: AppError) : LoadState<Nothing>
}
```

适合用于：

- 页面加载状态。
- 网络请求结果。
- 表单提交结果。
- 权限授权状态。

如果结果类型只有成功和失败，也可以定义业务自己的 `AppResult`，不要把异常、HTTP 状态码、数据库错误直接暴露给 UI。

## 空安全实践

不要滥用 `!!`。它通常表示“我没有建模清楚这个值是否可能为空”。

更好的写法：

```kotlin
val userName = user?.name.orEmpty()
```

或显式提前返回：

```kotlin
val id = savedStateHandle["id"] ?: return
```

当空值本身有业务含义时，要把语义写出来：

```kotlin
data class ProfileUiState(
    val avatarUrl: String?,
    val hasCustomAvatar: Boolean
)
```

## 扩展函数的边界

扩展函数适合做局部、无状态、可读性强的转换：

```kotlin
fun ArticleDto.toDomain(): Article {
    return Article(
        id = id,
        title = title,
        content = content.orEmpty()
    )
}
```

不适合把复杂业务藏进扩展函数，尤其是需要依赖网络、数据库、Context 或时钟的逻辑。那类逻辑应该进入 Repository、UseCase 或明确的服务类。

## 协程前置概念

学习协程前先记住三点：

- `suspend` 表示函数可以挂起，不表示它一定在后台线程执行。
- 切线程通常由调用链中的合适层负责，例如数据层使用 `withContext(Dispatchers.IO)`。
- 取消是协作式的，长循环、阻塞 IO 和第三方回调都要额外处理取消。

错误示例：

```kotlin
viewModelScope.launch {
    val user = api.getUser() // 如果 API 内部没有切 IO，可能阻塞主线程
    _state.value = UserUiState(user)
}
```

更好的边界是 Repository 保证耗时操作不阻塞主线程，ViewModel 只负责编排状态。

## 代码风格建议

- 优先 `val`，只有确实需要重新赋值时使用 `var`。
- 集合转换链超过三步时考虑拆中间变量。
- `let`、`also`、`apply`、`run` 不要混用到难以阅读。
- DTO、Entity、Domain Model、UiModel 不要复用同一个 data class。
- 不要把 `Context` 传进纯 Kotlin 业务类，除非它确实是 Android 边界对象。
