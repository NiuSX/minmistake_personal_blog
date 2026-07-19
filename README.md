# NiuSX.github.io

这是基于 Jekyll 和 Minimal Mistakes 的个人静态站点，部署到 GitHub Pages。

## 本地预览

```bash
bundle install
bundle exec jekyll serve
```

## 构建

```bash
bundle exec jekyll build
```

构建产物会生成到 `_site/`，该目录不需要提交。

## 部署到 https://NiuSX.github.io/blog

站点配置使用 `url: https://NiuSX.github.io` 和 `baseurl: /blog`，因此页面链接和静态资源路径都会生成到 `/blog/` 前缀下。

推送源码到 `master` 后，`.github/workflows/pages.yml` 会自动构建站点，并把 `_site/` 内容同步到 `NiuSX.github.io` 仓库的 `blog/` 目录下。

跨仓库发布需要在当前源码仓库配置一个 Action Secret：

1. 创建 GitHub fine-grained personal access token。
2. Token 只授予 `NiuSX/NiuSX.github.io` 仓库的 `Contents: Read and write` 权限。
3. 在 `minmistake_personal_blog` 仓库进入 `Settings -> Secrets and variables -> Actions`。
4. 新增 secret：`BLOG_DEPLOY_TOKEN`，值填入上面创建的 token。

之后只需要提交并推送源码仓库，工作流会自动发布到 `https://NiuSX.github.io/blog/`。
## 文章写作

新增文章请参考 [`docs/POST_TEMPLATE.md`](docs/POST_TEMPLATE.md)。文章放在 `_posts/`，提交符合约定的 Markdown 文件后，Jekyll 会自动更新首页、归档、分类、标签和搜索入口。

发布前建议执行：

```bash
bundle exec jekyll build --trace --baseurl "/blog"
```

构建产物 `_site/` 只用于发布和验证，不要手动编辑或提交。