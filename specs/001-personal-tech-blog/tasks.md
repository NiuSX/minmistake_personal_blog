---

description: "个人技术博客基础站点实现任务"
---

# 任务：个人技术博客基础站点

**输入**：`specs/001-personal-tech-blog/` 下的规格、计划、研究、数据模型、路由契约和快速开始文档

**前置条件**：`plan.md`、`spec.md`、`research.md`、`data-model.md`、`quickstart.md` 和
`contracts/site-routes.md` 已完成

**测试策略**：规格没有明确要求 TDD 或自动化测试，因此不生成独立测试任务；每个用户故事都必须
包含可执行的构建、生成路由、资源、响应式、键盘和可访问性验证。

**任务格式**：每个任务都包含复选框、顺序 ID、可选并行标记、用户故事标记和准确文件路径。

## 格式：`[ID] [P?] [Story?] 描述`

- **[P]**：可以并行执行，且不依赖尚未完成的共享文件变更。
- **[Story]**：用户故事标识，例如 `[US1]`、`[US2]`、`[US3]`、`[US4]`。
- 用户故事阶段的每个任务都必须带对应的 `[Story]` 标记。
- 每个任务描述都必须包含一个或多个准确的仓库文件或目录路径。

## 路径约定

- `_posts/`：Markdown 技术文章和 front matter。
- `_pages/`：关于、归档、分类、搜索和 404 页面。
- `_layouts/`：Minimal Mistakes 页面和文章布局覆盖。
- `_includes/`：导航、元数据、目录、归档、搜索和页脚片段。
- `_data/`：导航和 UI 文本数据。
- `_sass/`：主题变量、组件样式和项目自定义样式。
- `assets/`：样式表、脚本、图片和字体。
- `_config.yml`、`Gemfile`、`Gemfile.lock`：构建、主题和默认内容配置。
- `.github/workflows/pages.yml`：GitHub Pages 构建和跨仓库发布工作流。
- `README.md`、`docs/`：运行、发布、设计和内容维护文档。
- `_site/`：生成产物，只用于验证，不得手动编辑或作为源内容提交。

## 阶段 1：准备工作（共享基础设施）

**目的**：确认现有 Jekyll、Minimal Mistakes 和 GitHub Pages 扩展点，建立实现基线。

- [x] T001 阅读 `specs/001-personal-tech-blog/spec.md`、`specs/001-personal-tech-blog/plan.md` 和 `docs/DESIGN.md`，整理文章阅读、内容发现、内容发布和静态访问四条用户故事的验收边界。
- [x] T002 [P] 核对 `_config.yml`、`Gemfile` 和 `Gemfile.lock` 中的 Jekyll、Minimal Mistakes、归档、搜索、分页和插件配置，记录不可变的生产约束。
- [x] T003 [P] 核对 `_layouts/`、`_includes/`、`_pages/`、`_data/` 和 `_sass/`，为每个用户故事确认最小可复用扩展点。
- [x] T004 [P] 核对 `.github/workflows/pages.yml`、`README.md` 和 `specs/001-personal-tech-blog/quickstart.md`，确认本地构建、生产 `baseurl` 构建和跨仓库发布步骤一致。

---

## 阶段 2：基础能力（阻塞前置条件）

**目的**：建立所有用户故事共享的内容、布局、URL、样式和发布基础。

**关键要求**：本阶段完成前不得开始用户故事实现。

- [x] T005 更新 `_config.yml` 的 `url`、`baseurl`、搜索、分类归档、标签归档和文章默认 front matter，使其与 `specs/001-personal-tech-blog/contracts/site-routes.md` 一致。
- [x] T006 [P] 整理 `_data/navigation.yml` 和 `_data/ui-text.yml`，确保首页、关于、归档、分类、标签和搜索入口名称统一，并为缺失或错误状态准备中文文案。
- [x] T007 [P] 在 `_sass/_blog-overrides.scss` 中建立博客级颜色、排版、间距、卡片、代码块、表格和响应式覆盖，并在 `assets/css/main.scss` 中以单一入口加载。
- [x] T008 统一 `_layouts/default.html`、`_layouts/single.html`、`_layouts/posts.html`、`_layouts/search.html`、`_layouts/categories.html`、`_layouts/category.html` 和 `_layouts/tag.html` 的页面职责与元数据传递方式。
- [x] T009 [P] 核对 `_includes/head.html`、`_includes/masthead.html`、`_includes/sidebar.html`、`_includes/page__meta.html`、`_includes/page__taxonomy.html`、`_includes/toc.html`、`_includes/page__related.html` 和 `_includes/footer.html` 的复用边界，删除或避免重复的页面结构。
- [x] T010 在 `.github/workflows/pages.yml` 中补充或确认构建产物存在性检查，确保构建失败、首页缺失或订阅源缺失时不会继续同步到发布仓库。

**检查点**：共享配置、导航、样式入口、布局职责和发布门禁均已确定，用户故事可以独立实现。

---

## 阶段 3：用户故事 1——阅读和理解技术文章（优先级：P1）

**目标**：让读者在文章详情页中清晰阅读中文技术长文、代码、图片、表格和参考资料。

**独立测试**：使用 `_posts/2026-06-22-DESIGN-md学习笔记.md` 作为代表文章，完成构建后检查文章标题、元信息、目录、正文、代码块、表格、图片、相关内容和移动端阅读体验。

### 内容与结构

- [x] T011 [US1] 调整 `_layouts/single.html` 的文章详情结构，确保页面按标题、日期/更新日期、分类标签、摘要、目录、正文和文章尾部内容顺序输出。
- [x] T012 [P] [US1] 统一 `_includes/page__meta.html`、`_includes/page__date.html`、`_includes/page__taxonomy.html` 和 `_includes/page__related.html` 的文章元信息、分类标签和相关文章展示规则。
- [x] T013 [P] [US1] 调整 `_includes/toc.html` 和 `_includes/post_pagination.html`，使长文目录、上一篇/下一篇和返回归档入口在桌面端与移动端都可理解。

### 展示与行为

- [x] T014 [US1] 在 `_sass/_blog-overrides.scss` 中实现正文宽度、中文字号、行高、标题层级、链接状态、引用、代码块、表格和图片的 `docs/DESIGN.md` 规范。
- [x] T015 [P] [US1] 在 `_sass/_blog-overrides.scss` 和 `assets/css/main.scss` 中补充代码块、宽表格和长链接的局部横向滚动规则，禁止页面级横向溢出。

### 验证

- [x] T016 [US1] 执行 `bundle exec jekyll build --trace`，检查 `_site/2026/06/22/DESIGN-md学习笔记/` 或实际生成的文章路径、`_site/assets/css/main.css` 和 `_site/feed.xml`，确认文章结构与资源均生成。
- [x] T017 [US1] 在 `specs/001-personal-tech-blog/quickstart.md` 记录代表文章的桌面端、移动端、键盘焦点、图片替代文本和第三方资源失败检查结果。

**检查点**：读者可以独立打开并完成一篇长技术文章的阅读，核心内容不依赖 JavaScript 或外部资源。

---

## 阶段 4：用户故事 2——发现和定位文章（优先级：P1）

**目标**：让读者通过导航、归档、分类、标签和搜索定位文章，并在无结果时获得明确反馈。

**独立测试**：验证首页导航、`/year-archive/`、`/categories/`、`/tags/`、`/search/` 和对应生成页面能够互相进入文章详情，并覆盖空结果场景。

### 页面与聚合结构

- [x] T018 [US2] 完善 `_pages/year-archive.md`、`_pages/categories.md` 和 `_pages/search.md` 的标题、布局、permalink 和页面说明，使其与 `specs/001-personal-tech-blog/contracts/site-routes.md` 一致。
- [x] T019 [P] [US2] 调整 `_layouts/posts.html`、`_layouts/categories.html`、`_layouts/category.html` 和 `_layouts/tag.html` 的列表、分类和标签聚合结构，统一标题、日期、摘要和分页信息。
- [x] T020 [P] [US2] 调整 `_includes/archive-single.html`、`_includes/paginator.html`、`_includes/category-list.html`、`_includes/tag-list.html` 和 `_includes/posts-taxonomy.html` 的聚合组件，确保每个条目可返回文章详情页。
- [x] T021 [US2] 调整 `_layouts/search.html`、`_includes/search/search_form.html` 和 `_includes/search/lunr-search-scripts.html` 的搜索输入、结果摘要、无结果反馈和键盘操作行为。

### 导航与状态

- [x] T022 [US2] 在 `_data/navigation.yml`、`_layouts/default.html` 和 `_includes/masthead.html` 中确认当前页面状态、移动端导航收起/展开、搜索入口和 `baseurl` 安全链接。
- [x] T023 [P] [US2] 在 `_layouts/posts.html`、`_layouts/category.html`、`_layouts/tag.html` 和 `_layouts/search.html` 中补充空归档、空分类、空标签和无搜索结果的中文状态与替代入口。

### 验证

- [x] T024 [US2] 执行生产构建 `bundle exec jekyll build --trace --baseurl "/blog"`，检查 `_site/year-archive/index.html`、`_site/categories/index.html`、`_site/search/index.html`、`_site/feed.xml` 和 `_site/sitemap.xml`。
- [x] T025 [US2] 按 `specs/001-personal-tech-blog/contracts/site-routes.md` 逐项检查首页、归档、分类、标签、搜索和文章详情之间的链接、摘要、分页和空状态。

**检查点**：读者可以通过至少一种内容发现路径定位文章，空结果不会导致空白页面或死路。

---

## 阶段 5：用户故事 3——发布和维护技术内容（优先级：P1）

**目标**：作者只新增或修改符合约定的 Markdown 文件，就能完成文章发布并自动进入各类聚合入口。

**独立测试**：使用 `specs/001-personal-tech-blog/quickstart.md` 的 front matter 示例新增一篇临时文章，构建后验证文章详情、首页、归档、分类、标签和搜索结果，再删除临时文件。

### 内容约定

- [x] T026 [P] [US3] 创建 `docs/POST_TEMPLATE.md`，记录文章命名、中文标题、日期、分类、标签、摘要、正文结构、图片、代码和参考资料约定。
- [x] T027 [US3] 在 `_config.yml` 中统一文章默认 `layout`、`author_profile`、`read_time`、`comments`、`share`、`related` 和 `toc` 行为，并确保页面级例外有明确理由。
- [x] T028 [P] [US3] 审核 `_posts/` 中代表性的文章 front matter，统一 `categories`、`tags`、`excerpt`、日期格式和中文命名，不改变文章正文语义。
- [x] T029 [P] [US3] 调整 `index.html` 和 `_includes/archive-single.html` 的文章摘要、日期、分类、标签数量和文章链接展示，使新文章无需手动同步列表。
- [x] T030 [US3] 调整 `_includes/page__related.html`、`_includes/post_pagination.html` 和 `_config.yml` 的相关文章、上一篇/下一篇和分类标签关联规则。

### 发布验证

- [x] T031 [US3] 使用临时文章验证 `_posts/` 的 front matter 能生成文章详情、首页列表、归档、分类、标签和搜索入口，并在验证后删除临时文件。
- [x] T032 [US3] 在 `specs/001-personal-tech-blog/quickstart.md` 和 `docs/POST_TEMPLATE.md` 记录新增文章后的最小发布检查，确保作者不需要修改聚合页面模板。

**检查点**：作者可以通过单篇 Markdown 文件完成常规发布，且所有聚合入口自动反映新文章。

---

## 阶段 6：用户故事 4——可靠地访问静态站点（优先级：P1）

**目标**：确保 GitHub Pages `/blog` 路径、错误页、外部资源失败和键盘访问都不会破坏核心阅读。

**独立测试**：执行生产构建并检查 `_site/index.html`、`_site/404.html`、`_site/feed.xml`、`_site/sitemap.xml` 及页面中的 `/blog/` 链接和资源路径。

### 路由与错误处理

- [x] T033 [US4] 重写 `_pages/404.md` 的中文标题、错误说明、首页、归档和搜索入口，并确保 `permalink: /404.html` 保持稳定。
- [x] T034 [US4] 审核 `_layouts/`、`_includes/`、`_pages/`、`index.html` 和 `_data/navigation.yml` 中的站内 URL，将根路径硬编码替换为 `relative_url` 或 `absolute_url`。
- [x] T035 [P] [US4] 审核 `_includes/comments.html`、`_includes/analytics.html`、`_includes/scripts.html`、`_includes/head.html` 和 `_includes/seo.html` 的可选外部资源加载，确保失败时正文和导航继续输出。

### CI 与发布

- [x] T036 [US4] 更新 `.github/workflows/pages.yml`，保留 Ruby 3.2、生产 `JEKYLL_ENV`、`--baseurl "/blog"` 和跨仓库 `/blog` 同步逻辑，并为构建产物增加最小存在性检查。
- [x] T037 [US4] 更新 `README.md`，明确 `bundle install`、本地预览、生产构建、`BLOG_DEPLOY_TOKEN`、`master` 触发条件和发布仓库路径。

### 验证

- [x] T038 [US4] 执行 `$env:JEKYLL_ENV = "production"; bundle exec jekyll build --trace --baseurl "/blog"`，检查 `_site/index.html`、`_site/404.html`、`_site/feed.xml` 和 `_site/sitemap.xml`。
- [x] T039 [US4] 使用 `specs/001-personal-tech-blog/contracts/site-routes.md` 检查生成 HTML 中的站内链接、资源、规范链接、订阅源和站点地图是否使用 `/blog` 前缀。
- [x] T040 [US4] 在移动端和键盘场景下检查 `_includes/masthead.html`、`_includes/search/search_form.html`、`_includes/toc.html` 和 `_layouts/single.html` 的焦点顺序、焦点样式和导航可达性。

**检查点**：本地构建和生产部署路径都可访问，404、外部资源失败和键盘访问均有可理解行为。

---

## 阶段 7：收尾与跨领域工作

**目的**：统一最终质量检查，避免实现过程中出现无关风格、构建或发布回归。

- [x] T041 [P] 对照 `docs/DESIGN.md` 检查 `_sass/_blog-overrides.scss`、`assets/css/main.scss`、`_layouts/` 和 `_includes/` 是否引入未定义的颜色、字号、圆角、阴影或复杂动效。
- [x] T042 [P] 优化 `assets/` 和 `imgs/` 中本功能新增或修改的图片、脚本、字体和图标资源，确保不引入不必要的大文件。
- [x] T043 [P] 更新 `docs/PROJECT_STRUCTURE_ANALYSIS.md` 和 `README.md` 中与实际目录、构建和发布行为不一致的说明。
- [x] T044 执行 `bundle exec jekyll build --trace` 和生产 `bundle exec jekyll build --trace --baseurl "/blog"`，确认 `_site/index.html`、`_site/404.html`、`_site/feed.xml` 和 `_site/sitemap.xml` 均存在。
- [x] T045 检查 `git status --short`、`.gitignore`、`_site/` 和 `.jekyll-cache/`，确保只提交源代码、文档和配置，不提交生成产物或缓存。

---

## 依赖关系与执行顺序

### 阶段依赖

- **阶段 1 准备工作**：无依赖；T001–T004 可在不同文件范围内并行检查。
- **阶段 2 基础能力**：依赖阶段 1；T005–T010 完成前不得开始用户故事实现。
- **阶段 3 用户故事 1**：依赖阶段 2；完成后提供最小可用的文章阅读体验。
- **阶段 4 用户故事 2**：依赖 T005、T006、T008；可与用户故事 1 的部分样式任务并行，但必须在共享布局稳定后完成。
- **阶段 5 用户故事 3**：依赖 T005、T006、T008；可在文章详情结构稳定后开始。
- **阶段 6 用户故事 4**：依赖阶段 2，并在共享 URL、布局和工作流确定后执行；最终部署验证依赖用户故事 1–3 的相关页面完成。
- **阶段 7 收尾**：依赖所有用户故事实现和验证完成。

### 用户故事完成顺序

```text
阶段 1 -> 阶段 2
              ├─> US1 文章阅读 ──┐
              ├─> US2 内容发现 ──┼─> US4 静态访问与发布验证
              └─> US3 内容维护 ──┘
                                  └─> 阶段 7 收尾
```

### 每个用户故事内部

- 先完成页面结构和内容数据，再完成样式和交互状态。
- 共享布局、include、配置和导航必须先于页面专用覆盖。
- 每个故事都必须完成自己的生成构建、路由、资源、响应式和可访问性检查。
- 只有独立测试通过，才可以进入下一个故事的低优先级增强工作。

### 可并行机会

- T002、T003、T004 可以并行读取和记录，不修改同一文件。
- T006、T007、T009 可以并行处理不同共享文件，但合并前必须统一 `assets/css/main.scss` 的加载顺序。
- T012、T013、T019、T020、T026、T028、T029、T035、T041、T042、T043 可在文件范围不重叠时并行。
- 不得并行修改 `_config.yml`、`_data/navigation.yml`、`assets/css/main.scss`、`.github/workflows/pages.yml` 等共享文件。

## 实施策略

### 先完成最小可用版本

1. 完成阶段 1 和阶段 2，锁定主题扩展、URL、默认 front matter 和构建门禁。
2. 完成 US1 的文章详情页和阅读样式。
3. 执行代表文章构建和移动端/键盘检查。
4. 完成 US2 的归档、分类、标签和搜索，形成内容发现闭环。
5. 验证 US1 + US2 后再扩展内容发布文档和生产发布可靠性。

**MVP 范围**：阶段 1、阶段 2、US1（T001–T017）。如果需要可被读者使用的最小版本，建议将 US2（T018–T025）一并纳入首个发布。

### 增量交付

1. 每完成一个用户故事，先执行其独立验证，再合并下一个故事。
2. 优先修改配置、布局、include 和自定义 Sass，不复制主题供应代码。
3. 任何新外部资源都必须先证明必要，再实现失败降级。
4. 最终发布前必须执行开发构建和生产 `/blog` 构建，并检查生成产物路径。

## 说明

- 本文件包含 45 个可执行任务；不包含未编号的示例任务。
- 任务 ID 按执行顺序连续编号，用户故事任务均带 `[US1]`–`[US4]` 标签。
- 自动化测试不是本规格的明确要求，但构建、路由、资源、响应式和可访问性验证是必需的。
- 不得通过直接编辑 `_site/` 修复源代码问题。
- 除非先修订项目宪章，不得添加后端模型、服务、接口、数据库、迁移或认证任务。