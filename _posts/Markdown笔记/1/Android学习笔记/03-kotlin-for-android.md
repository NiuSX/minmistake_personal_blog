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

