# 实施计划：个人技术博客基础站点

**分支**：`001-personal-tech-blog` | **日期**：2026-07-19 | **规格**：[`spec.md`](./spec.md)

**输入**：来自 `specs/001-personal-tech-blog/spec.md` 的功能规格

## 摘要

本计划将个人技术博客定义为一个以长期技术内容沉淀为核心的 Jekyll 静态站点。实现以现有
Minimal Mistakes 主题能力为基础，通过 `_posts/` 管理文章，通过 `_pages/`、`_layouts/`、
`_includes/`、`_data/` 和 `_sass/` 组织页面、共享结构、导航数据和样式扩展；最终由 GitHub
Actions 构建并同步到 `NiuSX/NiuSX.github.io` 仓库的 `/blog` 目录。

本阶段只完成设计和实施计划，不直接改造页面代码。实现顺序以文章阅读和内容发现为核心，
优先保证文章、归档、分类、标签、搜索、关于页、404 页和 `/blog` 部署路径的完整性。

## 技术背景

**语言/版本**：Ruby 3.2（GitHub Actions）；Jekyll 4.4.1（`Gemfile.lock`）

**主要依赖**：Minimal Mistakes 4.28.0、jekyll-paginate 1.1.0、jekyll-sitemap 1.4.0、
jekyll-feed 0.17.0、jekyll-include-cache 0.2.1、jekyll-gist 1.5.0、tzinfo 2.0.6

**存储**：Markdown 文章、YAML 导航/站点数据、front matter 和静态资源；不使用运行时数据库

**测试**：`bundle exec jekyll build`、生产 `baseurl` 构建、生成路由检查、链接和资源检查，
以及移动端、键盘焦点、替代文本和对比度检查

**目标平台**：GitHub Pages；源码仓库推送到 `master` 后，由 `.github/workflows/pages.yml`
构建，并同步发布仓库的 `/blog` 目录

**项目类型**：使用 Minimal Mistakes 的 Jekyll 个人技术博客静态网站

**性能目标**：核心页面生成稳定、正文布局不发生页面级横向溢出、核心阅读不依赖第三方资源，
新增资源不引入不必要的阻塞脚本或大体积文件

**约束**：必须使用静态输出；必须兼容 `url: https://NiuSX.github.io` 和 `baseurl: /blog`；
必须优先复用 Minimal Mistakes；不得引入后台、数据库、登录和未声明运行时 API；文章主要使用中文

**规模/范围**：一个公开访问的个人博客，包含 Markdown 文章集合、首页、文章详情、文章归档、
分类、标签、搜索、关于页、404 页、导航、订阅源、站点地图和自定义 Sass 样式

## 宪章检查（Constitution Check）

*门禁：研究阶段开始前通过；设计阶段完成后重新检查。*

- [x] **静态优先**：所有核心用户故事均可由 Jekyll 静态输出完成，不依赖服务端、数据库或运行时 API。
- [x] **主题优先**：优先使用 Minimal Mistakes 的布局、include、配置、Liquid 归档和 Sass 扩展点。
- [x] **内容优先**：规格以文章阅读、内容发现、发布维护和稳定访问为主要用户价值。
- [x] **部署完整**：计划明确处理 `/blog` `baseurl`、生产构建和跨仓库发布工作流。
- [x] **响应式与可访问**：规格已要求移动端、键盘、语义结构、焦点、替代文本和对比度检查。
- [x] **构建可复现**：快速开始文档包含本地开发、生产构建和发布前验证命令。
- [x] **范围受控**：本计划不新增后台、客户端框架、数据库或非必要第三方服务。

**门禁结论**：通过。当前没有需要记录的宪章违反项。

## 项目结构

### 文档结构（当前功能）

```text
specs/001-personal-tech-blog/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── site-routes.md
└── checklists/
    └── requirements.md
```

### 源码结构（仓库根目录）

```text
_posts/                    # Markdown 技术文章
_pages/                    # 关于、归档、分类、搜索和 404 页面
_layouts/                  # Minimal Mistakes 页面布局覆盖
_includes/                 # 导航、归档、元信息、目录和页脚片段
_data/                     # 导航和 UI 文本数据
_sass/                     # 主题变量、组件样式和项目自定义样式
assets/                    # 样式表、脚本、图片和字体
_config.yml                # Jekyll、主题、URL、归档和默认 front matter 配置
Gemfile                    # 顶层构建依赖
Gemfile.lock               # 锁定依赖版本
.github/workflows/pages.yml # GitHub Pages 构建和跨仓库发布
README.md                  # 本地运行、构建和部署说明
docs/DESIGN.md             # 视觉、交互和内容设计规范
```

**结构决策**：

- 文章内容继续放在 `_posts/`，不创建新的内容存储层。
- 站点页面继续使用 `_pages/` 和 Minimal Mistakes 既有布局，不创建平行页面框架。
- 共享结构优先在 `_includes/` 和 `_layouts/` 中扩展，避免在每篇文章中重复 Liquid 或 HTML。
- 站点级默认值和归档/搜索配置集中在 `_config.yml`。
- 视觉变化集中在 `_sass/` 和必要的 `assets/` 文件，并遵守 `docs/DESIGN.md`。
- 发布逻辑保留在现有 `.github/workflows/pages.yml`，只在验证发现缺陷时最小修改。

## 设计决策摘要

1. **文章模型**：以 front matter 作为文章元数据契约，正文仍由 Markdown 表达。
2. **内容发现**：复用 Minimal Mistakes 的归档、分类、标签和搜索能力，不新增搜索服务。
3. **页面层级**：首页负责定位和最新内容，归档/分类/标签负责发现，详情页负责长文阅读。
4. **主题扩展**：优先修改配置和自定义扩展文件，不直接修改主题供应代码。
5. **部署路径**：所有模板资源使用 Jekyll URL 过滤器，生产构建显式使用 `/blog`。
6. **错误降级**：第三方资源和可选脚本失败时，文章正文和本地导航继续可用。
7. **测试策略**：以生成构建、生产路径、静态输出、响应式和可访问性检查为主，不为静态内容引入不必要的后端测试体系。

## 实施阶段

### 阶段 0：研究与约束确认

- 汇总 Jekyll、Minimal Mistakes、现有插件和 GitHub Actions 的实际使用方式。
- 确认 `url`、`baseurl`、归档、分类、标签、搜索和默认 front matter 的现有配置。
- 明确不创建外部 API 契约；以站点路由和文章 front matter 作为公开接口契约。
- 研究结论记录在 `research.md`。

### 阶段 1：结构与内容设计

- 在 `data-model.md` 定义文章、分类、标签、页面、导航和静态资源的字段与关系。
- 在 `contracts/site-routes.md` 定义公共页面路由、文章元数据和失败降级约定。
- 在 `quickstart.md` 记录本地预览、构建、发布前检查和 GitHub Pages 发布流程。
- 更新 `AGENTS.md`，让后续代理读取当前实施计划。

### 阶段 2：实现前验证

- 根据计划拆分内容、布局、include、样式、配置和工作流任务。
- 实现阶段必须先完成文章阅读和内容发现的 P1 路径，再扩展低优先级视觉或可选服务。
- 每组变更都必须执行最小相关验证，并在最终阶段执行生产 `baseurl` 构建。

## 复杂度追踪

无宪章违反项。本计划不引入新的项目、后端服务、数据库、认证体系或前端应用框架。
## 设计后宪章复查

- [x] **静态优先**：研究、数据模型、路由契约和快速开始均未引入运行时后端、数据库或认证系统。
- [x] **主题优先**：设计明确复用 Minimal Mistakes 的布局、include、配置和 Liquid 聚合能力。
- [x] **内容优先**：文章 front matter、聚合页面、文章详情、代码、图片、表格和参考资料均有契约。
- [x] **部署完整**：路由契约和快速开始明确了 `url`、`baseurl`、生产构建和跨仓库发布流程。
- [x] **响应式与可访问**：数据模型、路由契约和快速开始均包含移动端、键盘、焦点和资源失败检查。
- [x] **构建可复现**：已执行 `bundle exec jekyll build --trace` 和生产 `--baseurl "/blog"` 构建，均成功。
- [x] **范围受控**：未创建 API 契约、数据库、后台或新增项目；公共接口仅定义为静态路由和内容契约。

**验证结果**：构建退出码为 0。当前输出包含 Ruby `fiddle/import`、Faraday retry 和旧版 Sass API 的弃用/兼容性警告；
这些警告未阻塞本次规划，但后续升级依赖或 Sass 时应单独处理。