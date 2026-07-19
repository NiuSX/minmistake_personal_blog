# 快速开始：个人技术博客基础站点

## 1. 环境要求

- Ruby 3.2 或与 `Gemfile.lock` 兼容的 Ruby 版本。
- Bundler。
- Git。
- 能够访问 RubyGems 的网络环境，或已经准备好依赖缓存。
- Windows、macOS 和 Linux 均可进行本地构建；GitHub Actions 使用 Ubuntu 构建。

## 2. 安装依赖

在仓库根目录执行：

```bash
bundle install
```

Windows PowerShell 同样执行：

```powershell
bundle install
```

## 3. 本地预览

执行：

```bash
bundle exec jekyll serve
```

默认本地地址为：

```text
http://localhost:4000/blog/
```

本地预览时重点检查：

- 首页是否展示博客定位和文章入口。
- 文章详情是否显示标题、日期、分类、标签、目录和正文。
- 归档、分类、标签和搜索入口是否可用。
- 图片、代码块、表格和外部链接是否正常。
- 移动端是否出现页面级横向滚动。
- 键盘是否可以访问导航、搜索、目录和文章链接。

## 4. 构建站点

开发环境构建：

```bash
bundle exec jekyll build
```

Windows PowerShell：

```powershell
bundle exec jekyll build
```

生产路径构建：

```bash
JEKYLL_ENV=production bundle exec jekyll build --trace --baseurl "/blog"
```

Windows PowerShell：

```powershell
$env:JEKYLL_ENV = "production"
bundle exec jekyll build --trace --baseurl "/blog"
```

构建产物位于 `_site/`。该目录是生成产物，不得手动编辑，也不应作为文章和页面的源代码提交。

## 5. 新增文章

在 `_posts/` 下创建符合日期命名约定的 Markdown 文件，例如：

```text
_posts/2026-07-19-文章主题.md
```

使用以下 front matter：

```yaml
---
title: "文章标题"
date: 2026-07-19
categories:
  - 技术方向
tags:
  - 具体技术
excerpt: "帮助读者判断文章内容的简短摘要。"
---
```

文章正文建议包含：

1. 问题背景或学习目标。
2. 核心概念和必要上下文。
3. 可验证的步骤、代码或示例。
4. 限制、常见错误和结论。
5. 参考资料。

新增文章后不需要手动维护首页、归档、分类、标签或搜索页面；构建过程会根据 front matter 生成相关聚合内容。

## 6. 新增静态页面

静态页面放在 `_pages/`，必须定义标题、布局和稳定 permalink：

```yaml
---
title: "页面标题"
layout: single
permalink: /page-name/
---
```

页面内容和样式必须遵守 `docs/DESIGN.md`。如果页面需要共享结构，优先修改 `_layouts/` 或 `_includes/`，
不要复制一套新的页面模板。

## 7. 资源和 URL 规则

- 模板中的站内链接使用 `relative_url` 或 `absolute_url`。
- 文章和页面中的资源路径必须考虑 `/blog` 前缀。
- 新图片放在合适的 `assets/` 或 `imgs/` 目录，并提供替代文本或图注。
- 代码块、表格和长链接必须在移动端保持可读。
- 不要把 `_site/` 中生成的路径复制回源文件作为永久修复。

## 8. 发布到 GitHub Pages

推送源码仓库的 `master` 分支后，`.github/workflows/pages.yml` 会：

1. 使用 Ruby 3.2 安装 Bundler 依赖。
2. 使用生产环境和 `--baseurl "/blog"` 执行 Jekyll 构建。
3. 检出 `NiuSX/NiuSX.github.io` 的 `main` 分支。
4. 将 `_site/` 内容同步到发布仓库的 `blog/` 目录。
5. 提交并推送发布产物。

跨仓库发布需要在当前源码仓库配置：

```text
BLOG_DEPLOY_TOKEN
```

该令牌只应拥有目标发布仓库内容写入所需的最小权限，不能写入源码或提交到仓库。

生产访问路径：

```text
https://NiuSX.github.io/blog/
```

## 9. 发布前检查

```text
[ ] 文章 front matter 可解析，标题和日期完整。
[ ] 文章中的图片、代码和站内链接路径正确。
[ ] 首页、文章、归档、分类、标签、搜索、关于和 404 页面可访问。
[ ] 生产 baseurl 构建成功。
[ ] 页面在移动端无意外横向滚动。
[ ] 键盘焦点清晰，图片有替代文本，颜色不是唯一状态表达方式。
[ ] 外部资源失败不会阻断文章正文。
[ ] 未直接修改 _site/，未提交缓存和构建产物。
```

## 10. 常见问题

### 页面资源在本地正常、生产失效

检查模板和导航是否硬编码了根路径，统一使用 Jekyll URL 过滤器，并确认生产构建使用了 `--baseurl "/blog"`。

### 新文章没有出现在归档或首页

检查文件是否位于 `_posts/`、文件名是否包含有效日期、front matter 是否闭合，以及文章日期是否晚于当前构建时间。

### 构建失败

先执行：

```bash
bundle exec jekyll build --trace
```

根据错误定位 front matter、Liquid、插件或资源路径。不要通过修改 `_site/` 绕过源代码错误。

### GitHub Pages 没有更新

检查工作流是否在 `master` 分支触发、`BLOG_DEPLOY_TOKEN` 是否存在且权限足够、目标发布仓库的 `main` 分支是否可写，
以及 Actions 日志中的构建和跨仓库推送步骤。
## 当前验证基线

2026-07-19 已在本地执行以下命令并成功完成构建：

```powershell
bundle exec jekyll build --trace
$env:JEKYLL_ENV = "production"
bundle exec jekyll build --trace --baseurl "/blog"
```

生成的 `_site/` 包含首页、文章详情、归档、分类、标签、搜索、关于、404、订阅源和站点地图。
构建仍会输出现有 Minimal Mistakes/Sass 的弃用警告，但没有构建错误。