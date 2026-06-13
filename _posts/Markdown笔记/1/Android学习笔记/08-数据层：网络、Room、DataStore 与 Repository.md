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

## 数据层职责边界

Data layer 的目标是给上层提供稳定、可测试的数据接口，而不是把 Retrofit、Room、DataStore 直接暴露给 UI。

推荐结构：

```text
data/
├── remote/
│   ├── ArticleApi
│   └── ArticleDto
├── local/
│   ├── ArticleDao
│   ├── ArticleEntity
│   └── AppDatabase
├── mapper/
│   └── ArticleMappers.kt
└── ArticleRepositoryImpl
```

Domain 层只看到：

```kotlin
interface ArticleRepository {
    fun observeArticles(): Flow<List<Article>>
    suspend fun refresh(): AppResult<Unit>
}
```

## 离线优先数据流

离线优先通常不是“没网时读缓存”这么简单，而是让本地数据库成为 UI 的主要数据源：

```text
UI observes Room Flow
        ^
        |
Repository refreshes network
        |
Remote DTO -> Entity -> Room transaction
```

示例：

```kotlin
class ArticleRepositoryImpl(
    private val api: ArticleApi,
    private val dao: ArticleDao
) : ArticleRepository {
    override fun observeArticles(): Flow<List<Article>> {
        return dao.observeAll()
            .map { entities -> entities.map { it.toDomain() } }
    }

    override suspend fun refresh(): AppResult<Unit> {
        return runCatching {
            val articles = api.fetchArticles()
            dao.replaceAll(articles.map { it.toEntity() })
        }.fold(
            onSuccess = { AppResult.Success(Unit) },
            onFailure = { AppResult.Error(it.toAppError()) }
        )
    }
}
```

这样 UI 不需要知道数据来自网络还是缓存。

## Room 实践要点

- 数据库操作不要阻塞主线程。
- 多表更新使用 `@Transaction`。
- 数据库迁移必须测试，不能只开发期 `fallbackToDestructiveMigration()`。
- Entity 不要承担业务逻辑。
- DAO 返回 `Flow` 时，Room 会在表变化后重新发射数据。

迁移示例：

```kotlin
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("ALTER TABLE articles ADD COLUMN summary TEXT NOT NULL DEFAULT ''")
    }
}
```

## DataStore 使用边界

DataStore 适合：

- 用户设置。
- 小型 key-value 配置。
- 简单持久状态，例如主题、排序方式、是否首次打开。

不适合：

- 大量结构化列表数据。
- 需要复杂查询的数据。
- 关系型数据。
- 高频大体积写入。

这类数据应使用 Room。

## 网络层实践

网络层至少要处理：

- 超时和重试。
- 认证失效。
- 错误响应体解析。
- JSON 字段缺失或类型变化。
- 分页和缓存策略。
- 日志脱敏。

不要让 ViewModel 直接判断 HTTP code。Repository 应把底层异常映射为业务可理解的错误：

```kotlin
fun Throwable.toAppError(): AppError {
    return when (this) {
        is IOException -> AppError.NetworkUnavailable
        is HttpException -> {
            if (code() == 401) AppError.Unauthorized else AppError.Server(code())
        }
        else -> AppError.Unknown(message.orEmpty())
    }
}
```

## 数据层测试重点

- Mapper：DTO、Entity、Domain 转换是否正确。
- DAO：增删改查、排序、事务、迁移。
- Repository：网络成功、网络失败、缓存回退、错误映射。
- DataStore：默认值、写入、读取、迁移。
- 分页：刷新、追加、空列表、错误重试。
