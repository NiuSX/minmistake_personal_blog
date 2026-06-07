# 07. 架构：MVVM 与 Clean Architecture

## 为什么需要架构

架构的目的不是让项目看起来复杂，而是解决：

- UI 和业务逻辑混杂。
- 网络、数据库和界面强耦合。
- 测试困难。
- 需求变化导致大量联动修改。
- 多人协作边界不清。

Android 项目常见架构是 MVVM + Repository，复杂项目可进一步采用 Clean Architecture。

## MVVM

MVVM 包含：

- Model：数据和业务对象。
- View：界面，Activity、Fragment、Composable。
- ViewModel：管理 UI State，处理界面事件，调用业务逻辑。

数据流：

```text
View 发送事件
  ↓
ViewModel 处理事件
  ↓
UseCase / Repository 执行业务
  ↓
ViewModel 更新 UI State
  ↓
View 根据 State 重绘
```

## UI State

```kotlin
data class LoginUiState(
    val username: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)
```

ViewModel：

```kotlin
class LoginViewModel(
    private val login: LoginUseCase
) : ViewModel() {
    private val _state = MutableStateFlow(LoginUiState())
    val state = _state.asStateFlow()
}
```

## Clean Architecture 分层

推荐模块：

```text
project/
├── app/
├── core/
├── domain/
├── data/
├── presentation/
├── design-system/
└── feature/
```

职责：

- `app`：应用入口、导航容器、DI 装配。
- `core`：通用工具、错误类型、基础扩展。
- `domain`：用例、领域模型、仓库接口，保持纯 Kotlin。
- `data`：仓库实现、网络、数据库、DTO、Entity。
- `presentation`：ViewModel、UI State、UI Model。
- `design-system`：主题、组件、图标、排版。
- `feature`：大型项目按功能拆模块。

## 依赖规则

```text
app → presentation, domain, data, core
presentation → domain, design-system, core
data → domain, core
domain → core 或无依赖
core → 无依赖
```

关键规则：

- `domain` 不能依赖 Android 框架。
- `domain` 不能依赖 `data` 或 `presentation`。
- Repository 接口定义在 `domain`。
- Repository 实现在 `data`。
- UI 不直接访问 DAO 或 API。

## Domain 层

领域模型：

```kotlin
data class Article(
    val id: String,
    val title: String,
    val content: String
)
```

Repository 接口：

```kotlin
interface ArticleRepository {
    fun observeArticles(): Flow<List<Article>>
    suspend fun refreshArticles(): Result<Unit>
}
```

UseCase：

```kotlin
class ObserveArticlesUseCase(
    private val repository: ArticleRepository
) {
    operator fun invoke(): Flow<List<Article>> {
        return repository.observeArticles()
    }
}
```

## Data 层

Repository 实现：

```kotlin
class ArticleRepositoryImpl(
    private val local: ArticleLocalDataSource,
    private val remote: ArticleRemoteDataSource
) : ArticleRepository {
    override fun observeArticles(): Flow<List<Article>> {
        return local.observeAll().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun refreshArticles(): Result<Unit> {
        return runCatching {
            val remoteArticles = remote.fetchArticles()
            local.upsert(remoteArticles.map { it.toEntity() })
        }
    }
}
```

映射器：

```kotlin
fun ArticleEntity.toDomain() = Article(
    id = id,
    title = title,
    content = content
)
```

## Presentation 层

```kotlin
class ArticleListViewModel(
    observeArticles: ObserveArticlesUseCase,
    private val refreshArticles: RefreshArticlesUseCase
) : ViewModel() {
    val state: StateFlow<ArticleListUiState> =
        observeArticles()
            .map { articles -> ArticleListUiState(articles = articles) }
            .stateIn(
                scope = viewModelScope,
                started = SharingStarted.WhileSubscribed(5_000),
                initialValue = ArticleListUiState(isLoading = true)
            )
}
```

## 依赖注入

Hilt 示例：

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindArticleRepository(
        impl: ArticleRepositoryImpl
    ): ArticleRepository
}
```

Koin 示例：

```kotlin
val domainModule = module {
    factory { ObserveArticlesUseCase(get()) }
}

val dataModule = module {
    single<ArticleRepository> { ArticleRepositoryImpl(get(), get()) }
}
```

## 常见反模式

- ViewModel 直接调用 Retrofit API。
- Composable 里写业务逻辑。
- Domain 层引用 Context、Room、Retrofit。
- UI 层暴露 Entity 或 DTO。
- Repository 过于臃肿，没有拆 DataSource。
- 所有模块互相依赖，形成循环。

## 本章检查清单

- 是否能解释 MVVM 数据流？
- 是否知道 domain 必须保持纯 Kotlin？
- 是否知道 Repository 接口和实现应该分层？
- 是否能区分 Entity、DTO、Domain Model、UI Model？
- 是否知道 UI 不应直接访问数据库或网络？

