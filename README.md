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

## 部署到当前仓库的 gh-pages 分支

推荐方式是提交源码到 `master` 分支，由 `.github/workflows/pages.yml` 自动构建并把 `_site/` 发布到当前仓库的 `gh-pages` 分支，不需要手动提交 `_site/`。

如果继续使用当前仓库 `minmistake_personal_blog`，访问地址会是 `https://NiuSX.github.io/minmistake_personal_blog/`。

在 GitHub 仓库页面进入 `Settings -> Pages`，把 `Build and deployment` 的 `Source` 设置为 `Deploy from a branch`，分支选择 `gh-pages`，目录选择 `/root`。之后推送到 `master` 分支即可自动部署。
