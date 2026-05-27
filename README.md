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

要让访问地址变成 `https://NiuSX.github.io/blog/`，需要把构建产物发布到 `NiuSX.github.io` 仓库的 `blog/` 目录下。

当前仓库的工作流仍会把构建产物发布到本仓库 `gh-pages` 分支；如果需要自动同步到 `NiuSX.github.io/blog/`，需要在 GitHub Actions 中配置目标仓库写入权限。
