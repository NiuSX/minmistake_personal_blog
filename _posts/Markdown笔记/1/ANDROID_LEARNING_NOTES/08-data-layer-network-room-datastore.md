# 08. 数据层：网络、Room、DataStore 与 Repository

## 数据层职责

数据层负责：

- 网络请求。
- 本地数据库。
- 缓存。
- 数据同步。
- DTO / Entity / Domain 映射。
- 错误处理。
- Repository 实现。

UI 层不应知道数据来自网络还是数据库。

## Repository

Repository 对外提供统一数据接口：

```kotlin
interface UserRepository {
    fun observeUsers(): Flow<List<User>>
    suspend fun refreshUsers(): Result<Unit>
}
```

实现中协调数据源：

```kotlin
class UserRepositoryImpl(
    private val local: UserLocalDataSource,
    private val remote: UserRemoteDataSource
) : UserRepository
```

## 网络层

常见选择：

- Retrofit：Android 项目常用。
- Ktor Client：KMP 和 Kotlin 生态常用。
- OkHttp：底层 HTTP 客户端。

Retrofit 示例：

```kotlin
interface UserApi {
    @GET("users")
    suspend fun getUsers(): List<UserDto>
}
```

DTO：

```kotlin
data class UserDto(
    val id: String,
    val name: String
)
```

## Room

Room 是 Android 官方数据库库，基于 SQLite。

Entity：

```kotlin
@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val name: String
)
```

DAO：

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun observeAll(): Flow<List<UserEntity>>

    @Upsert
    suspend fun upsertAll(users: List<UserEntity>)

    @Query("DELETE FROM users")
    suspend fun clear()
}
```

Database：

```kotlin
@Database(
    entities = [UserEntity::class],
    version = 1
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}
```

## DataStore

DataStore 适合保存小型配置，例如：

- 用户设置。
- 开关。
- token 元信息。
- 本地偏好。

Preferences DataStore 示例：

```kotlin
val Context.dataStore by preferencesDataStore(name = "settings")

class SettingsDataSource(
    private val dataStore: DataStore<Preferences>
) {
    val darkMode: Flow<Boolean> = dataStore.data.map { prefs ->
        prefs[booleanPreferencesKey("dark_mode")] ?: false
    }
}
```

不要用 DataStore 保存大量结构化业务数据，应该使用 Room。

## DTO、Entity、Domain Model

DTO：网络数据结构。

Entity：数据库表结构。

Domain Model：业务模型。

UI Model：界面展示模型。

不要混用：

- DTO 可能随接口变化。
- Entity 可能受数据库约束。
- Domain Model 应表达业务含义。
- UI Model 应适配界面展示。

## 离线优先

离线优先常见流程：

```text
UI 观察 Room
  ↓
Repository 从网络刷新
  ↓
写入 Room
  ↓
Room Flow 推送新数据
  ↓
UI 自动更新
```

优点：

- UI 有本地缓存可显示。
- 网络失败时仍可使用。
- 数据流稳定。

## 缓存策略

常见策略：

- Cache Only：只读缓存。
- Network Only：只读网络。
- Cache First：先显示缓存，再刷新网络。
- Network First：优先网络，失败回退缓存。
- Stale While Revalidate：先返回旧数据，同时后台刷新。

选择取决于业务对实时性和可用性的要求。

## 错误处理

数据层应区分：

- 网络不可用。
- 超时。
- 401 未授权。
- 服务器错误。
- 数据库错误。
- JSON 解析错误。

建议映射为统一错误类型：

```kotlin
sealed interface AppError {
    data object NetworkUnavailable : AppError
    data object Unauthorized : AppError
    data class Server(val code: Int) : AppError
    data class Unknown(val message: String) : AppError
}
```

## 本章检查清单

- 是否知道 Repository 的作用？
- 是否能区分 DTO、Entity、Domain Model？
- 是否会使用 Room 的 Entity、Dao、Database？
- 是否知道 DataStore 适合保存什么？
- 是否理解离线优先数据流？

