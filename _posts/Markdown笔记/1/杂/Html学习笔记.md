# HTML 完整学习笔记

> 适合对象：前端初学者、后端开发者、UI/网页开发学习者、需要系统掌握网页结构、语义化、表单、多媒体、可访问性、SEO 和现代 HTML 最佳实践的人。

HTML 是 HyperText Markup Language，超文本标记语言。它不是编程语言，而是用于描述网页结构和内容语义的标记语言。浏览器读取 HTML，解析成 DOM 树，再结合 CSS 形成视觉样式，结合 JavaScript 形成交互行为。

如果你只会写 `<div>`、`<span>` 和 `<br>`，还不算真正理解 HTML。真正掌握 HTML，需要理解：文档结构、语义化标签、块级/行内内容模型、标题层级、链接、图片、响应式图片、表格、表单、原生验证、可访问性、SEO、脚本加载、安全属性、嵌入内容、交互元素、全局属性以及浏览器如何解析 HTML。

最后调研：2026-06-13。

版本说明：截至 2026-06-13，HTML 的主标准是 WHATWG 维护的 HTML Living Standard。HTML 不再像过去那样以 HTML4、HTML5、HTML6 的方式作为主要学习路径，而是以 Living Standard 持续演进。日常开发建议参考 WHATWG HTML Standard 和 MDN HTML Reference。

学习目标：

- 能写出结构完整、语义清晰、可访问的 HTML 页面。
- 能正确使用标题层级、landmark、表单、图片、多媒体和交互元素。
- 能理解 `defer`、`async`、`module`、预加载、懒加载等性能相关写法。
- 能处理 SEO、社交分享、安全属性、iframe 风险和用户输入边界。
- 能用验证工具和浏览器 DevTools 检查 HTML 结构问题。

## 目录

1. HTML 是什么
2. HTML、CSS、JavaScript 的关系
3. 浏览器如何解析 HTML
4. HTML 文档基本结构
5. DOCTYPE、html、head、body
6. meta、title、link、style、script
7. 元素、标签、属性
8. 全局属性
9. 文本内容与标题层级
10. 语义化 HTML
11. 页面结构标签
12. 链接与路径
13. 图片与 figure
14. 响应式图片 picture、srcset、sizes
15. 音频、视频与嵌入内容
16. 列表
17. 表格
18. 表单基础
19. input 类型详解
20. label、fieldset、legend
21. select、textarea、button、datalist
22. 表单提交与原生验证
23. 交互元素 details、summary、dialog
24. template、slot 与 Web Components 基础
25. data-* 自定义数据属性
26. HTML 与可访问性
27. ARIA 基础与使用边界
28. SEO 与文档元信息
29. Open Graph、Twitter Card 与社交分享
30. script 加载：defer、async、module
31. iframe 与嵌入安全
32. HTML 安全基础
33. 性能相关 HTML
34. 移动端与响应式基础
35. HTML 编码规范
36. 常见错误与反模式
37. 常用标签速查
38. 学习路线
39. 参考资料与扩展阅读

## 1. HTML 是什么

HTML 用来描述网页内容结构。

它告诉浏览器：

- 哪部分是标题
- 哪部分是段落
- 哪部分是导航
- 哪部分是主要内容
- 哪部分是文章
- 哪部分是表格
- 哪部分是表单
- 哪部分是图片、视频、链接

HTML 的重点是：

```text
结构和语义
```

不是：

```text
样式和交互
```

样式交给 CSS，交互交给 JavaScript。

## 2. HTML、CSS、JavaScript 的关系

| 技术 | 作用 | 类比 |
| :--- | :--- | :--- |
| HTML | 内容结构和语义 | 骨架 |
| CSS | 样式和布局 | 外观 |
| JavaScript | 行为和交互 | 动作 |

示例：

```html
<button class="primary-button" id="submitButton">提交</button>
```

HTML 表示：

```text
这里有一个按钮，文字是“提交”。
```

CSS 控制：

```text
按钮颜色、大小、边距、圆角。
```

JavaScript 控制：

```text
点击按钮后做什么。
```

## 3. 浏览器如何解析 HTML

浏览器大致流程：

```text
读取 HTML 字节
  ↓
根据编码解码成字符
  ↓
词法分析成 token
  ↓
构建 DOM 树
  ↓
加载 CSS 构建 CSSOM
  ↓
合成渲染树
  ↓
布局
  ↓
绘制
  ↓
合成显示
```

HTML 容错能力很强。

例如：

```html
<p>hello
```

浏览器会自动补全结束标签。

但不要依赖浏览器容错。规范、清晰、可维护的 HTML 更重要。

## 4. HTML 文档基本结构

最小现代 HTML：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>页面标题</title>
  </head>
  <body>
    <h1>页面主标题</h1>
    <p>这是一个 HTML 页面。</p>
  </body>
</html>
```

结构说明：

| 部分 | 作用 |
| :--- | :--- |
| `<!doctype html>` | 声明使用标准模式 |
| `<html>` | 文档根元素 |
| `<head>` | 文档元信息 |
| `<body>` | 页面可见内容 |
| `<meta charset>` | 字符编码 |
| `<meta viewport>` | 移动端视口 |
| `<title>` | 页面标题 |

## 5. DOCTYPE、html、head、body

### 5.1 DOCTYPE

现代 HTML 使用：

```html
<!doctype html>
```

作用：

```text
让浏览器使用标准模式渲染页面。
```

不要写旧式复杂 DOCTYPE：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" ...>
```

### 5.2 html

```html
<html lang="zh-CN">
```

`lang` 很重要。

作用：

- 告诉浏览器页面语言
- 帮助搜索引擎
- 帮助屏幕阅读器正确发音
- 帮助翻译工具识别语言

常见：

```html
<html lang="zh-CN">
<html lang="en">
<html lang="ja">
```

### 5.3 head

`head` 放页面元信息。

常见内容：

- `meta`
- `title`
- `link`
- `style`
- `script`
- `base`

### 5.4 body

`body` 放页面主体内容。

例如：

```html
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</body>
```

## 6. meta、title、link、style、script

### 6.1 charset

```html
<meta charset="utf-8">
```

推荐放在 `head` 最前面。

### 6.2 viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

移动端响应式页面几乎必须写。

### 6.3 title

```html
<title>HTML 学习笔记</title>
```

作用：

- 浏览器标签页标题
- 搜索结果标题参考
- 收藏夹标题
- 可访问性辅助信息

每个页面都应有明确、唯一的 `title`。

### 6.4 link 引入 CSS

```html
<link rel="stylesheet" href="/assets/css/main.css">
```

### 6.5 favicon

```html
<link rel="icon" href="/favicon.ico">
```

### 6.6 style

```html
<style>
  body {
    font-family: system-ui, sans-serif;
  }
</style>
```

适合少量页面内样式。大型项目推荐外部 CSS。

### 6.7 script

```html
<script src="/assets/js/main.js" defer></script>
```

推荐普通脚本加 `defer`，避免阻塞 HTML 解析。

## 7. 元素、标签、属性

### 7.1 元素

HTML 元素通常由开始标签、内容、结束标签组成：

```html
<p>这是一段文字。</p>
```

### 7.2 标签

开始标签：

```html
<p>
```

结束标签：

```html
</p>
```

### 7.3 属性

```html
<a href="https://example.com" target="_blank">访问网站</a>
```

其中：

- `href` 是属性名
- `https://example.com` 是属性值
- `target="_blank"` 表示新窗口或新标签打开

### 7.4 布尔属性

布尔属性只要出现就表示 true。

```html
<input type="checkbox" checked>
<button disabled>不可点击</button>
<video controls></video>
```

不推荐写：

```html
<button disabled="false">仍然是禁用</button>
```

因为布尔属性出现就生效。

### 7.5 空元素

有些元素没有结束标签：

```html
<meta charset="utf-8">
<img src="photo.jpg" alt="照片">
<input type="text">
<br>
<hr>
```

HTML 中不需要写：

```html
<br />
```

但写了通常也能被解析。

## 8. 全局属性

全局属性可用于大多数 HTML 元素。

### 8.1 id

```html
<section id="intro">...</section>
```

要求：

```text
同一页面中 id 应唯一。
```

用途：

- 锚点跳转
- CSS 选择
- JS 查询
- label 关联 input

### 8.2 class

```html
<button class="button button-primary">提交</button>
```

用于：

- CSS 样式
- JS 选择
- 组件状态标记

### 8.3 title

```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

不要把重要信息只放在 `title` 属性里，因为移动端和辅助技术支持并不总是理想。

### 8.4 hidden

```html
<div hidden>暂时隐藏</div>
```

表示元素当前不相关。

### 8.5 lang

```html
<p lang="en">Hello world.</p>
```

当局部语言不同于页面语言时使用。

### 8.6 tabindex

```html
<div tabindex="0">可聚焦区域</div>
```

建议：

- `tabindex="0"`：加入自然 Tab 顺序
- `tabindex="-1"`：可 JS 聚焦，但不进入 Tab 顺序
- 避免正数 tabindex

### 8.7 data-*

```html
<button data-user-id="42">查看用户</button>
```

用于存放自定义数据。

## 9. 文本内容与标题层级

### 9.1 标题 h1-h6

```html
<h1>页面主标题</h1>
<h2>章节标题</h2>
<h3>小节标题</h3>
```

原则：

- 一个页面通常有一个明确的 `h1`
- 标题层级不要乱跳
- 不要为了字体大小选择标题级别

错误示例：

```html
<h1>标题</h1>
<h4>下一节</h4>
```

### 9.2 段落 p

```html
<p>这是一个段落。</p>
```

不要用 `<br>` 模拟段落间距。

### 9.3 强调 strong / em

```html
<strong>重要内容</strong>
<em>语气强调</em>
```

区别：

| 元素 | 语义 |
| :--- | :--- |
| `strong` | 重要性 |
| `em` | 强调语气 |
| `b` | 无额外重要语义的视觉加粗 |
| `i` | 无额外强调语义的偏移文本 |

### 9.4 code、pre

行内代码：

```html
<p>使用 <code>npm install</code> 安装依赖。</p>
```

代码块：

```html
<pre><code>const name = "HTML";</code></pre>
```

### 9.5 blockquote

```html
<blockquote cite="https://example.com">
  <p>这是一段引用。</p>
</blockquote>
```

### 9.6 time

```html
<time datetime="2026-06-07">2026 年 6 月 7 日</time>
```

`datetime` 使用机器可读格式。

## 10. 语义化 HTML

语义化 HTML 是指：

```text
根据内容含义选择正确标签，而不是只根据视觉效果选择标签。
```

### 10.1 为什么语义化重要

语义化有助于：

- 可访问性
- SEO
- 浏览器默认行为
- 代码可维护性
- 团队协作
- 自动化测试
- 阅读器模式

### 10.2 不推荐全用 div

不推荐：

```html
<div class="header"></div>
<div class="nav"></div>
<div class="main"></div>
<div class="footer"></div>
```

推荐：

```html
<header></header>
<nav></nav>
<main></main>
<footer></footer>
```

### 10.3 标签选择思路

问自己：

```text
这段内容是什么？
```

而不是：

```text
这段内容长什么样？
```

## 11. 页面结构标签

### 11.1 header

```html
<header>
  <h1>网站名称</h1>
  <nav>...</nav>
</header>
```

可用于页面头部，也可用于文章头部。

### 11.2 nav

```html

<nav aria-label="主导航">
    <a href="/">首页</a>
    <a href="/blog">博客</a>
    <a href="/about">关于</a>
</nav>
```

用于主要导航链接组。

### 11.3 main

```html
<main>
  <h1>文章标题</h1>
  <p>正文内容。</p>
</main>
```

一个页面通常只有一个主要可见的 `main`。

### 11.4 section

```html
<section>
  <h2>功能介绍</h2>
  <p>...</p>
</section>
```

`section` 表示有主题的一节，通常应有标题。

### 11.5 article

```html
<article>
  <h2>博客文章标题</h2>
  <p>文章内容。</p>
</article>
```

适合可独立分发的内容：

- 博客文章
- 新闻
- 评论
- 帖子
- 商品说明

### 11.6 aside

```html
<aside>
  <h2>相关文章</h2>
  <ul>...</ul>
</aside>
```

表示与主内容相关但可分离的附加内容。

### 11.7 footer

```html
<footer>
  <p>&copy; 2026 Example</p>
</footer>
```

可用于页面页脚，也可用于文章页脚。

## 12. 链接与路径

### 12.1 a 标签

```html
<a href="https://example.com">访问 Example</a>
```

### 12.2 页面内锚点

```html
<a href="#contact">联系我</a>

<section id="contact">
  <h2>联系我</h2>
</section>
```

### 12.3 相对路径

```html
<a href="about.html">关于</a>
<img src="images/logo.png" alt="Logo">
```

### 12.4 绝对路径

```html
<a href="/about/">关于</a>
```

### 12.5 完整 URL

```html
<a href="https://developer.mozilla.org/">MDN</a>
```

### 12.6 新窗口打开

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  新窗口打开
</a>
```

使用 `target="_blank"` 时建议加：

```html
rel="noopener noreferrer"
```

### 12.7 下载链接

```html
<a href="/files/report.pdf" download>下载报告</a>
```

## 13. 图片与 figure

### 13.1 img

```html
<img src="cat.jpg" alt="一只坐在窗边的猫">
```

### 13.2 alt 很重要

`alt` 用于：

- 图片加载失败时显示
- 屏幕阅读器朗读
- SEO 图片理解

装饰性图片：

```html
<img src="decoration.png" alt="">
```

有意义图片：

```html
<img src="chart.png" alt="2026 年第一季度销售额同比增长 18%">
```

### 13.3 width 和 height

```html
<img src="photo.jpg" alt="照片" width="800" height="600">
```

建议写宽高，减少布局偏移。

### 13.4 loading

```html
<img src="photo.jpg" alt="照片" loading="lazy">
```

非首屏图片可懒加载。

首屏关键图片不要随意 lazy。

### 13.5 figure 和 figcaption

```html
<figure>
  <img src="chart.png" alt="销售额柱状图">
  <figcaption>图 1：2026 年第一季度销售额</figcaption>
</figure>
```

适合带说明的图片、图表、代码、插图。

## 14. 响应式图片 picture、srcset、sizes

### 14.1 srcset

```html
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 600px"
  alt="风景照片">
```

浏览器会根据屏幕、DPR 和布局选择合适图片。

### 14.2 高分屏图片

```html
<img
  src="avatar.png"
  srcset="avatar.png 1x, avatar@2x.png 2x"
  alt="用户头像">
```

### 14.3 picture

```html
<picture>
  <source media="(max-width: 600px)" srcset="hero-mobile.jpg">
  <source media="(min-width: 601px)" srcset="hero-desktop.jpg">
  <img src="hero-desktop.jpg" alt="产品展示图">
</picture>
```

适合艺术方向裁剪，也就是不同屏幕使用不同构图。

### 14.4 WebP / AVIF

```html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="照片">
</picture>
```

浏览器会选择支持的格式。

## 15. 音频、视频与嵌入内容

### 15.1 audio

```html
<audio controls>
  <source src="music.mp3" type="audio/mpeg">
  <source src="music.ogg" type="audio/ogg">
  你的浏览器不支持 audio 元素。
</audio>
```

### 15.2 video

```html
<video controls width="640" poster="poster.jpg">
  <source src="movie.mp4" type="video/mp4">
  <track src="captions.vtt" kind="captions" srclang="zh" label="中文字幕">
  你的浏览器不支持 video 元素。
</video>
```

### 15.3 常见属性

| 属性 | 作用 |
| :--- | :--- |
| `controls` | 显示控制条 |
| `autoplay` | 自动播放 |
| `muted` | 静音 |
| `loop` | 循环 |
| `poster` | 视频封面 |
| `preload` | 预加载策略 |

很多浏览器要求自动播放视频必须静音。

### 15.4 iframe

```html
<iframe
  src="https://example.com"
  title="嵌入页面"
  width="600"
  height="400"
  loading="lazy">
</iframe>
```

`iframe` 必须有可理解的 `title`。

## 16. 列表

### 16.1 无序列表

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

### 16.2 有序列表

```html
<ol>
  <li>安装依赖</li>
  <li>启动项目</li>
  <li>打开浏览器</li>
</ol>
```

### 16.3 描述列表

```html
<dl>
  <dt>HTML</dt>
  <dd>用于描述网页结构。</dd>
  <dt>CSS</dt>
  <dd>用于控制网页样式。</dd>
</dl>
```

### 16.4 不要用 div 模拟列表

不推荐：

```html
<div class="list">
  <div>第一项</div>
  <div>第二项</div>
</div>
```

推荐：

```html
<ul>
  <li>第一项</li>
  <li>第二项</li>
</ul>
```

## 17. 表格

### 17.1 基本表格

```html
<table>
  <caption>学生成绩表</caption>
  <thead>
    <tr>
      <th scope="col">姓名</th>
      <th scope="col">语文</th>
      <th scope="col">数学</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">张三</th>
      <td>90</td>
      <td>95</td>
    </tr>
  </tbody>
</table>
```

### 17.2 表格标签

| 标签 | 作用 |
| :--- | :--- |
| `table` | 表格 |
| `caption` | 表格标题 |
| `thead` | 表头 |
| `tbody` | 表体 |
| `tfoot` | 表尾 |
| `tr` | 行 |
| `th` | 表头单元格 |
| `td` | 数据单元格 |

### 17.3 scope

```html
<th scope="col">列标题</th>
<th scope="row">行标题</th>
```

有助于屏幕阅读器理解表格关系。

### 17.4 表格不要用于布局

表格用于表格数据，不应用于页面布局。

布局用 CSS。

## 18. 表单基础

### 18.1 form

```html
<form action="/login" method="post">
  <label for="email">邮箱</label>
  <input id="email" name="email" type="email" required>

  <label for="password">密码</label>
  <input id="password" name="password" type="password" required>

  <button type="submit">登录</button>
</form>
```

### 18.2 action

```html
<form action="/submit">
```

表示提交地址。

### 18.3 method

```html
<form method="get">
<form method="post">
```

| method | 用途 |
| :--- | :--- |
| `get` | 查询、筛选、搜索 |
| `post` | 创建、提交敏感或较大数据 |

### 18.4 name

```html
<input name="email">
```

表单提交时，只有有 `name` 的控件通常才会提交。

### 18.5 autocomplete

```html
<input type="email" name="email" autocomplete="email">
<input type="password" name="password" autocomplete="current-password">
```

正确使用 autocomplete 有助于浏览器自动填充和可访问性。

## 19. input 类型详解

常见 input 类型：

```html
<input type="text">
<input type="email">
<input type="password">
<input type="number">
<input type="tel">
<input type="url">
<input type="search">
<input type="date">
<input type="time">
<input type="datetime-local">
<input type="checkbox">
<input type="radio">
<input type="file">
<input type="range">
<input type="color">
<input type="hidden">
```

### 19.1 email

```html
<input type="email" name="email" required>
```

浏览器会做基础邮箱格式验证。

### 19.2 number

```html
<input type="number" name="age" min="0" max="120" step="1">
```

### 19.3 checkbox

```html
<label>
  <input type="checkbox" name="agree" required>
  我同意服务条款
</label>
```

### 19.4 radio

```html
<fieldset>
  <legend>支付方式</legend>
  <label><input type="radio" name="payment" value="wechat"> 微信</label>
  <label><input type="radio" name="payment" value="alipay"> 支付宝</label>
</fieldset>
```

同一组 radio 使用相同 `name`。

### 19.5 file

```html
<input type="file" name="avatar" accept="image/*">
```

多文件：

```html
<input type="file" name="photos" multiple>
```

## 20. label、fieldset、legend

### 20.1 label 显式关联

```html
<label for="username">用户名</label>
<input id="username" name="username" type="text">
```

### 20.2 label 包裹

```html
<label>
  用户名
  <input name="username" type="text">
</label>
```

### 20.3 为什么 label 重要

label 可以：

- 提升可访问性
- 增加可点击区域
- 让屏幕阅读器知道控件名称
- 改善表单可用性

### 20.4 fieldset 和 legend

```html
<fieldset>
  <legend>收货地址</legend>

  <label for="province">省份</label>
  <input id="province" name="province">

  <label for="city">城市</label>
  <input id="city" name="city">
</fieldset>
```

用于分组相关表单控件。

## 21. select、textarea、button、datalist

### 21.1 select

```html
<label for="city">城市</label>
<select id="city" name="city">
  <option value="">请选择</option>
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
</select>
```

### 21.2 optgroup

```html
<select name="city">
  <optgroup label="华北">
    <option value="beijing">北京</option>
    <option value="tianjin">天津</option>
  </optgroup>
  <optgroup label="华东">
    <option value="shanghai">上海</option>
  </optgroup>
</select>
```

### 21.3 textarea

```html
<label for="message">留言</label>
<textarea id="message" name="message" rows="5"></textarea>
```

### 21.4 button

```html
<button type="submit">提交</button>
<button type="reset">重置</button>
<button type="button">普通按钮</button>
```

表单中的 button 建议明确写 `type`。

否则默认可能是 `submit`。

### 21.5 datalist

```html
<label for="browser">浏览器</label>
<input id="browser" name="browser" list="browser-options">

<datalist id="browser-options">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
</datalist>
```

提供输入建议。

## 22. 表单提交与原生验证

### 22.1 required

```html
<input name="email" type="email" required>
```

### 22.2 minlength / maxlength

```html
<input name="username" minlength="3" maxlength="20">
```

### 22.3 min / max / step

```html
<input type="number" name="count" min="1" max="10" step="1">
```

### 22.4 pattern

```html
<input
  name="code"
  pattern="[A-Z]{3}[0-9]{3}"
  title="请输入 3 个大写字母和 3 个数字">
```

### 22.5 novalidate

```html
<form novalidate>
```

关闭浏览器原生验证。

### 22.6 form 属性

控件可以关联表单，即使不在 form 内部：

```html
<form id="searchForm" action="/search"></form>

<input form="searchForm" name="q">
<button form="searchForm" type="submit">搜索</button>
```

## 23. 交互元素 details、summary、dialog

### 23.1 details / summary

```html
<details>
  <summary>查看详情</summary>
  <p>这里是详细内容。</p>
</details>
```

默认关闭，点击展开。

默认展开：

```html
<details open>
  <summary>查看详情</summary>
  <p>这里是详细内容。</p>
</details>
```

### 23.2 dialog

```html
<dialog id="confirmDialog">
  <form method="dialog">
    <p>确认删除吗？</p>
    <button value="cancel">取消</button>
    <button value="confirm">确认</button>
  </form>
</dialog>
```

JavaScript：

```html
<script>
  const dialog = document.getElementById("confirmDialog");
  dialog.showModal();
</script>
```

`dialog` 提供原生模态能力，但样式和可访问性仍要认真处理。

## 24. template、slot 与 Web Components 基础

### 24.1 template

`template` 中的内容不会立即渲染。

```html
<template id="cardTemplate">
  <article class="card">
    <h2></h2>
    <p></p>
  </article>
</template>
```

JavaScript 可克隆使用。

### 24.2 slot

`slot` 用于 Web Components 内容分发。

```html
<template id="user-card-template">
  <article>
    <slot name="avatar"></slot>
    <slot name="name"></slot>
  </article>
</template>
```

### 24.3 自定义元素

```html
<user-card>
  <img slot="avatar" src="avatar.jpg" alt="头像">
  <span slot="name">张三</span>
</user-card>
```

Web Components 涉及 JavaScript API，这里只需知道 HTML 侧有 `template` 和 `slot`。

## 25. data-* 自定义数据属性

### 25.1 基本用法

```html
<button data-user-id="42" data-action="delete">删除</button>
```

JavaScript：

```js
const button = document.querySelector("button");
console.log(button.dataset.userId);
console.log(button.dataset.action);
```

### 25.2 适合场景

- 存储少量与元素相关的数据
- 给 JS 读取
- 标记组件状态
- 传递 ID

### 25.3 不适合场景

不要把大量业务数据塞进 HTML 属性。

不要存敏感信息：

```html
<div data-token="secret"></div>
```

## 26. HTML 与可访问性

可访问性是让更多人能使用网页，包括：

- 屏幕阅读器用户
- 键盘用户
- 低视力用户
- 色弱用户
- 行动不便用户
- 临时受限用户

### 26.1 使用正确标签

按钮用：

```html
<button type="button">打开菜单</button>
```

不要用：

```html
<div onclick="openMenu()">打开菜单</div>
```

链接用：

```html
<a href="/detail">查看详情</a>
```

不要用按钮伪装跳转，除非它真的是执行动作。

### 26.2 图片 alt

```html
<img src="product.jpg" alt="黑色无线耳机正面图">
```

### 26.3 表单 label

```html
<label for="email">邮箱</label>
<input id="email" type="email" name="email">
```

### 26.4 键盘可用

交互控件应能通过键盘操作。

原生元素天然支持：

- `button`
- `a href`
- `input`
- `select`
- `textarea`

### 26.5 跳过导航

```html
<a class="skip-link" href="#main">跳到主要内容</a>

<main id="main">
  ...
</main>
```

方便键盘和屏幕阅读器用户跳过重复导航。

## 27. ARIA 基础与使用边界

ARIA 可以补充语义，但不能替代正确 HTML。

### 27.1 第一原则

```text
能用原生 HTML，就不要用 ARIA 重新造。
```

推荐：

```html
<button>提交</button>
```

不推荐：

```html
<div role="button" tabindex="0">提交</div>
```

### 27.2 aria-label

图标按钮：

```html
<button type="button" aria-label="关闭">
  ×
</button>
```

### 27.3 aria-labelledby

```html
<section aria-labelledby="profile-title">
  <h2 id="profile-title">个人资料</h2>
</section>
```

### 27.4 aria-describedby

```html
<label for="password">密码</label>
<input id="password" type="password" aria-describedby="password-help">
<p id="password-help">至少 8 位，包含字母和数字。</p>
```

### 27.5 aria-hidden

装饰图标：

```html
<span aria-hidden="true">★</span>
```

不要对可聚焦元素使用 `aria-hidden="true"`。

### 27.6 可访问性检查清单

写完页面后至少检查：

1. 页面是否只有一个清晰的 `h1`，标题层级是否连续表达结构。
2. 主要区域是否有 `header`、`nav`、`main`、`footer` 等 landmark。
3. 所有表单控件是否有可关联的 `label`。
4. 图标按钮是否有可访问名称，例如 `aria-label`。
5. 图片 `alt` 是说明内容，还是应为空字符串表示装饰图。
6. 交互元素能否只用键盘完成操作。
7. 焦点顺序是否符合视觉和语义顺序。
8. 是否优先使用原生元素，而不是 `div + role` 模拟控件。

## 28. SEO 与文档元信息

### 28.1 title

```html
<title>HTML 学习笔记 - 前端基础</title>
```

### 28.2 description

```html
<meta name="description" content="系统学习 HTML 文档结构、语义化、表单、多媒体、可访问性和 SEO。">
```

### 28.3 canonical

```html
<link rel="canonical" href="https://example.com/html-notes">
```

用于告诉搜索引擎规范 URL。

### 28.4 robots

```html
<meta name="robots" content="index, follow">
```

不希望索引：

```html
<meta name="robots" content="noindex, nofollow">
```

### 28.5 语义结构

SEO 不只是 meta。

还包括：

- 正确标题层级
- 语义化结构
- 可读正文
- 有意义链接文字
- 图片 alt
- 页面性能
- 移动端体验

## 29. Open Graph、Twitter Card 与社交分享

### 29.1 Open Graph

```html
<meta property="og:title" content="HTML 学习笔记">
<meta property="og:description" content="系统学习现代 HTML。">
<meta property="og:type" content="article">
<meta property="og:url" content="https://example.com/html-notes">
<meta property="og:image" content="https://example.com/images/html-cover.jpg">
```

### 29.2 Twitter Card

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="HTML 学习笔记">
<meta name="twitter:description" content="系统学习现代 HTML。">
<meta name="twitter:image" content="https://example.com/images/html-cover.jpg">
```

### 29.3 注意

社交图片应使用绝对 URL。

## 30. script 加载：defer、async、module

### 30.1 普通 script

```html
<script src="main.js"></script>
```

会阻塞 HTML 解析。

### 30.2 defer

```html
<script src="main.js" defer></script>
```

特点：

- 不阻塞 HTML 解析
- DOM 解析完成后执行
- 多个 defer 脚本按顺序执行

适合大多数普通脚本。

### 30.3 async

```html
<script src="analytics.js" async></script>
```

特点：

- 不阻塞下载
- 下载完成后尽快执行
- 执行顺序不保证

适合独立第三方脚本，如统计脚本。

### 30.4 module

```html
<script type="module" src="main.js"></script>
```

模块脚本默认类似 defer。

支持：

```js
import { createApp } from "./app.js";
```

### 30.5 nomodule

```html
<script nomodule src="legacy.js"></script>
```

给不支持模块的旧浏览器使用。

## 31. iframe 与嵌入安全

### 31.1 基本 iframe

```html
<iframe
  src="https://example.com"
  title="示例页面"
  width="600"
  height="400">
</iframe>
```

### 31.2 sandbox

```html
<iframe
  src="https://example.com"
  title="受限页面"
  sandbox>
</iframe>
```

允许部分能力：

```html
<iframe
  src="https://example.com"
  title="受限页面"
  sandbox="allow-scripts allow-forms">
</iframe>
```

### 31.3 loading lazy

```html
<iframe
  src="https://example.com"
  title="延迟加载 iframe"
  loading="lazy">
</iframe>
```

### 31.4 referrerpolicy

```html
<iframe
  src="https://example.com"
  title="页面"
  referrerpolicy="no-referrer">
</iframe>
```

## 32. HTML 安全基础

### 32.1 target blank 安全

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  外部链接
</a>
```

### 32.2 不信任用户输入

不要直接把用户输入拼成 HTML。

危险：

```html
<div>用户输入的 HTML</div>
```

如果后端或 JS 未转义，可能导致 XSS。

### 32.3 表单不能只靠前端验证

HTML 原生验证有用，但不能替代服务端验证。

服务端必须验证：

- 必填字段
- 类型
- 长度
- 权限
- CSRF
- 文件类型和大小

### 32.4 文件上传

```html
<input type="file" accept="image/*">
```

`accept` 只是提示，不是安全保证。

服务端必须检查文件。

### 32.5 iframe sandbox

嵌入不可信页面时使用 sandbox。

### 32.6 表单安全边界

HTML 表单属性能改善体验，但不是安全边界：

| HTML 能做 | 不能替代 |
| :--- | :--- |
| `required` 提示必填 | 服务端必填校验 |
| `type="email"` 提示格式 | 服务端邮箱格式校验 |
| `minlength` / `maxlength` | 服务端长度限制 |
| `accept` 限制文件选择器 | 服务端 MIME、扩展名、内容扫描 |
| `autocomplete` 改善填充 | 身份认证和权限控制 |

所有来自浏览器的提交都应视为不可信输入。

## 33. 性能相关 HTML

### 33.1 preload

```html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
```

用于提前加载关键资源。

### 33.2 preconnect

```html
<link rel="preconnect" href="https://cdn.example.com">
```

提前建立连接。

### 33.3 dns-prefetch

```html
<link rel="dns-prefetch" href="//cdn.example.com">
```

提前 DNS 解析。

### 33.4 图片懒加载

```html
<img src="below-fold.jpg" alt="..." loading="lazy">
```

### 33.5 fetchpriority

```html
<img src="hero.jpg" alt="主视觉图" fetchpriority="high">
```

可提示浏览器该资源优先级。

不要滥用。

### 33.6 减少布局偏移

图片和 iframe 建议设置尺寸：

```html
<img src="photo.jpg" alt="照片" width="800" height="600">
```

### 33.7 LCP 图片建议

首屏关键图片通常不应该懒加载：

```html
<img
  src="/hero.jpg"
  alt="产品主图"
  width="1200"
  height="800"
  fetchpriority="high">
```

非首屏图片再使用：

```html
<img src="/gallery-1.jpg" alt="..." loading="lazy">
```

不要对所有图片都加 `fetchpriority="high"`，优先级提示应只给真正关键资源。

## 34. 移动端与响应式基础

### 34.1 viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

没有这个，移动端页面可能按桌面宽度缩放。

### 34.2 输入类型影响移动键盘

```html
<input type="email">
<input type="tel">
<input type="number">
<input type="url">
```

移动端会显示更合适的键盘。

### 34.3 inputmode

```html
<input inputmode="numeric" pattern="[0-9]*">
```

提示输入模式。

### 34.4 autocomplete

```html
<input name="name" autocomplete="name">
<input name="email" autocomplete="email">
<input name="tel" autocomplete="tel">
```

有助于移动端自动填充。

常见登录表单：

```html
<input name="username" autocomplete="username">
<input name="password" type="password" autocomplete="current-password">
```

注册或重置密码：

```html
<input name="new-password" type="password" autocomplete="new-password">
```

正确的 `name` 和 `autocomplete` 能改善密码管理器、移动端键盘和无障碍体验。

## 35. HTML 编码规范

### 35.1 使用小写标签和属性

推荐：

```html
<section class="content">
```

不推荐：

```html
<SECTION CLASS="content">
```

### 35.2 属性值加引号

推荐：

```html
<input type="text" name="username">
```

### 35.3 合理缩进

```html
<main>
  <article>
    <h1>标题</h1>
    <p>正文。</p>
  </article>
</main>
```

### 35.4 不省略关键结构

虽然部分标签可省略，但推荐完整写：

```html
<!doctype html>
<html lang="zh-CN">
  <head>...</head>
  <body>...</body>
</html>
```

### 35.5 使用语义类名

```html
<article class="post-card">
```

不要用纯视觉类名表达结构：

```html
<div class="red-big-box">
```

视觉交给 CSS。

## 36. 常见错误与反模式

### 36.1 用 div 当按钮

不推荐：

```html
<div onclick="submitForm()">提交</div>
```

推荐：

```html
<button type="button">提交</button>
```

### 36.2 链接文字无意义

不推荐：

```html
<a href="/article">点击这里</a>
```

推荐：

```html
<a href="/article">阅读 HTML 语义化指南</a>
```

### 36.3 图片缺少 alt

不推荐：

```html
<img src="product.jpg">
```

推荐：

```html
<img src="product.jpg" alt="银色笔记本电脑打开状态">
```

### 36.4 表单控件没有 label

不推荐：

```html
<input placeholder="邮箱">
```

推荐：

```html
<label for="email">邮箱</label>
<input id="email" name="email" type="email" placeholder="name@example.com">
```

placeholder 不能替代 label。

### 36.5 用 br 控制布局

不推荐：

```html
标题<br><br>正文
```

推荐：

```html
<h1>标题</h1>
<p>正文</p>
```

间距用 CSS。

### 36.6 标题层级混乱

不推荐为了字号使用 `h1`。

标题级别表示内容结构，不是视觉大小。

### 36.7 表格用于布局

不推荐用 `table` 做页面布局。

### 36.8 滥用 role

不推荐：

```html
<button role="button">提交</button>
```

button 已经有语义，不需要重复 role。

### 36.9 页面提交前检查清单

1. `html` 是否设置正确 `lang`。
2. `head` 是否包含 `charset`、`viewport`、`title`、`description`。
3. 页面是否有清晰的 `main`，重复导航前是否需要 skip link。
4. 标题层级是否表达内容结构。
5. 链接文字脱离上下文后是否仍然有意义。
6. 所有表单控件是否有关联 label 和合理 autocomplete。
7. 图片是否设置合适 alt，关键图片是否设置 width / height。
8. 首屏关键脚本是否使用合适的 `defer`、`async` 或 `type="module"`。
9. 外部链接和 iframe 是否设置必要安全属性。
10. 是否通过 HTML Validator 和浏览器 Accessibility 面板检查。

## 37. 常用标签速查

### 37.1 文档结构

```html
<!doctype html>
<html>
<head>
<body>
```

### 37.2 元信息

```html
<meta>
<title>
<link>
<style>
<script>
```

### 37.3 页面结构

```html
<header>
<nav>
<main>
<section>
<article>
<aside>
<footer>
```

### 37.4 文本

```html
<h1> ... <h6>
<p>
<strong>
<em>
<small>
<mark>
<code>
<pre>
<blockquote>
<time>
```

### 37.5 链接和媒体

```html
<a>
<img>
<picture>
<source>
<figure>
<figcaption>
<audio>
<video>
<track>
<iframe>
```

### 37.6 列表

```html
<ul>
<ol>
<li>
<dl>
<dt>
<dd>
```

### 37.7 表格

```html
<table>
<caption>
<thead>
<tbody>
<tfoot>
<tr>
<th>
<td>
```

### 37.8 表单

```html
<form>
<label>
<input>
<textarea>
<select>
<option>
<button>
<fieldset>
<legend>
<datalist>
```

### 37.9 交互

```html
<details>
<summary>
<dialog>
```

### 37.10 通用容器

```html
<div>
<span>
```

`div` 和 `span` 没有语义，应在没有更合适标签时使用。

## 38. 学习路线

### 阶段 1：掌握基础结构

掌握：

- `<!doctype html>`
- `html`
- `head`
- `body`
- `meta charset`
- `viewport`
- `title`

### 阶段 2：掌握常用内容标签

掌握：

- 标题
- 段落
- 链接
- 图片
- 列表
- 表格

### 阶段 3：掌握语义化

掌握：

- `header`
- `nav`
- `main`
- `section`
- `article`
- `aside`
- `footer`

### 阶段 4：掌握表单

掌握：

- `form`
- `input`
- `label`
- `button`
- `select`
- `textarea`
- 原生验证
- autocomplete

### 阶段 5：掌握可访问性

掌握：

- alt
- label
- 标题层级
- 键盘操作
- landmark
- ARIA 的边界

### 阶段 6：掌握工程实践

掌握：

- SEO meta
- Open Graph
- script 加载
- iframe 安全
- 性能提示
- HTML 验证

## 39. 参考资料与扩展阅读

建议优先阅读标准、MDN 和验证工具：

- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
- [WHATWG HTML for Web Developers](https://html.spec.whatwg.org/dev/)
- [WHATWG HTML elements index](https://html.spec.whatwg.org/multipage/indices.html)
- [MDN HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference)
- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [MDN HTML forms guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [MDN Responsive images](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images/Responsive_images)
- [MDN Script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
- [web.dev Learn HTML](https://web.dev/learn/html)
- [W3C Markup Validator](https://validator.w3.org/)

实践检索关键词：

- `HTML semantic landmark accessibility`
- `HTML form autocomplete current-password new-password`
- `HTML iframe sandbox security`
- `HTML preload preconnect fetchpriority LCP`
- `HTML button vs anchor accessibility`

## 最后总结

HTML 的核心可以浓缩为：

```text
HTML 负责结构和语义
CSS 负责样式和布局
JavaScript 负责行为和交互
```

写好 HTML 的关键不是记住所有标签，而是能判断：

```text
这段内容的语义是什么？
用户和浏览器应该如何理解它？
搜索引擎和辅助技术能否正确读取它？
```

学习 HTML 时要优先建立这些习惯：

1. 页面必须有完整文档结构。
2. 标题层级要表达内容大纲。
3. 能用语义标签就不要只用 div。
4. 图片要写合适的 alt。
5. 表单控件要有 label。
6. 链接和按钮不要混用。
7. 重要交互要支持键盘和辅助技术。
8. 外部链接、iframe、用户输入要考虑安全。

当你能解释 `main` 和 `section` 的区别、`button` 和 `a` 的区别、`alt` 为什么不能省、`label` 为什么重要、`defer` 和 `async` 的区别、`srcset` 和 `picture` 解决什么问题时，就已经真正入门现代 HTML。

<!-- research-notes: enhanced-v1 -->

## 研究笔记增强

> Last reviewed: 2026-06-17。此节用于把《HTML 完整学习笔记》从阅读笔记推进到可复习、可实践、可验证的研究笔记；具体版本、参数和环境仍需结合官方资料、项目约束和实测结果校准。

### 知识定位

按概念理解、最小实践、故障排查、复盘沉淀的路径学习，既记录是什么，也记录什么时候用、什么时候不用和失败后如何定位。

### 重点补充
- 明确该技术解决的问题、输入输出、边界条件和依赖环境。
- 把核心概念落到一个最小可运行示例。
- 记录版本、配置、命令、日志和错误信息，保证以后可以复现。
- 明确适用场景、限制条件、替代方案和迁移成本。

### 实践清单
- 为本章整理一张概念关系图、流程图或最小系统图。
- 写一个最小可运行示例，并保留运行命令、输入、输出和环境版本。
- 列出常见错误、排查命令、关键日志和修复动作。
- 补充安全、性能、兼容性、可维护性和上线运维注意事项。
- 用一次真实问题或练习项目复盘验证笔记是否可用。

### 常见误区
- 只摘抄定义或命令，没有记录上下文、前提条件和边界。
- 只记录成功路径，不记录失败样本、异常现象和排查过程。
- 没有版本、环境和数据样本，导致后续无法复现。
- 把教程默认值直接用于真实项目，没有结合约束重新评估。

### 复盘问题
- 学完《HTML 完整学习笔记》后，能否用自己的话说明它解决什么问题、不解决什么问题？
- 如果要在真实项目中使用，需要哪些前置条件、依赖版本、输入数据和验证手段？
- 失败时最先检查哪三类证据：日志、指标、抓包、堆栈、配置、样本还是硬件测量？
- 有没有形成可重复的最小实验、测试用例或排查命令？

### 延伸方向
- 官方文档和版本变更记录。
- 同类技术、框架或方案对比。
- 面向真实项目的最小实践。
- 故障排查清单和复盘案例库。

### 复盘记录模板

```text
主题：HTML 完整学习笔记
日期：
目标：本次要验证或掌握的具体问题
环境：系统 / 语言 / 框架 / 工具 / 设备 / 版本
步骤：最小可复现流程
现象：成功输出、失败输出、日志、指标或测量数据
分析：为什么会出现该现象，和哪些概念相关
结论：可复用的规则、命令、配置或设计取舍
风险：边界条件、性能、安全、兼容性或维护成本
下一步：继续实验、补充资料或应用到项目
```

<!-- lecture-notes:start -->

## 讲义级补充：如何真正学懂《HTML 完整学习笔记》

> 适用位置：杂\Html学习笔记.md  
> 说明：本补充用于把原始提纲扩展成课堂讲义式学习材料。阅读时建议先看原文，再用本节建立知识框架、例子、实践和自测闭环。

### 1. 这一讲要解决什么问题

工具类知识的目标是提高交付效率和可复现性。学习时不要只背命令，要理解工具解决的工程问题、输入输出、缓存机制、常见失败模式和团队协作约定。

学习本讲时，可以用三个问题检查自己是否真的理解：

1. 它解决的真实问题是什么？
2. 如果没有它，系统会出现什么具体麻烦？
3. 在真实项目中，应该用什么现象或指标判断它做得好不好？

### 2. 核心知识拆解

可以把本讲拆成几块来学：

- 模型：工具认为什么是项目、任务、依赖和产物。
- 配置：命令行参数、配置文件、环境变量和版本锁定。
- 缓存：哪些结果会被复用，什么时候会失效。
- 协作：团队如何共享脚本、规范、流水线和排错流程。

拆解的好处是防止“整章都懂一点，但哪块都说不清”。复习时可以逐块追问：它的输入是什么、输出是什么、依赖什么、失败时有什么表现。

### 3. 通俗类比

可以把本主题看成一个“输入-处理-输出-反馈”的系统：先弄清输入从哪里来，经过哪些规则或算法，输出给谁使用，再看错误如何被发现和修正。

类比不是严格定义，但能帮助初学者先建立直觉。真正使用时，还要回到术语、公式、接口、数据结构、时序图或工程规范上，把“感觉理解”变成“可验证理解”。

### 4. 具体例子

学习《HTML 完整学习笔记》时，先做一个最小可验证例子：输入要小，步骤要清楚，输出要能检查。然后故意制造一个错误，观察系统如何失败，并记录排查顺序。

讲义级学习不能只停留在“概念解释”。至少要有一个能跑、能算、能画或能检查的例子。例子越小，越容易看清关键机制；等机制清楚后，再逐步扩展到复杂项目。

### 5. 学习路径

- 先弄清工具的输入、输出和状态存放位置，例如配置文件、缓存目录、锁文件和环境变量。
- 再学习最常用的 20% 命令，并理解它们背后的模型。
- 最后整理可复制的项目模板和排错清单，减少每次从零摸索。

建议每学完一小节都做一次“复述练习”：不用看笔记，用自己的话讲清楚概念、输入、输出、关键步骤和常见错误。如果讲不清，通常说明还没有真正掌握。

### 6. 课堂讲解框架

可以按下面顺序讲解或复习本主题：

1. 背景：先讲这个知识为什么出现，它试图降低什么成本、解决什么风险或提升什么能力。
2. 基本概念：给出核心名词的准确定义，说明它们之间的关系。
3. 工作流程：按时间顺序描述一次完整过程，必要时画出流程图、状态机或数据流图。
4. 关键细节：解释最容易误解的机制，例如边界条件、异常处理、性能限制、资源生命周期或安全约束。
5. 实战例子：用一个足够小但完整的例子，把概念落到命令、代码、图纸、配置、数据或操作步骤上。
6. 反例与排错：展示错误做法会导致什么现象，再说明如何定位和修复。
7. 总结迁移：最后说明它和相邻知识点的区别、联系以及后续该学什么。

### 7. 最小实践任务

为了避免“看懂了但不会用”，建议为本讲配一个最小实践：

- 选一个可以在 30 到 90 分钟内完成的小任务。
- 明确输入、预期输出和验收标准。
- 记录遇到的第一个错误、定位过程和最终修复方法。
- 完成后写 5 行复盘：我原来以为是什么，实际是什么，下次会如何更快处理。

如果本主题偏理论，实践可以是手算一个小例子、画一张流程图、推导一个简化公式或解释一段真实日志；如果偏工程，实践应该尽量落到可运行命令、可测试代码、可检查配置或可测量硬件现象上。

### 8. 常见误区

- 只记结论，不理解适用条件。
- 只看正常流程，不看异常、边界和失败恢复。
- 学完没有做最小实践，导致知识停留在熟悉感。

遇到这些问题时，不要急着背更多资料。更有效的办法是回到一个最小例子，把输入、状态变化、输出和验证方式重新走一遍。

### 9. 自测题

1. 用一句话说明本讲主题解决的核心问题。
2. 列出本讲最重要的 3 个概念，并说明它们的关系。
3. 举一个生活类比，再指出这个类比在哪些地方不严谨。
4. 写出一个最小实践任务的验收标准。
5. 如果结果不符合预期，你会优先检查哪 3 个环节？为什么？
6. 本讲和相邻章节的知识边界是什么？哪些问题应该交给其他章节解决？

### 10. 复习口诀

先问场景，再看输入；先拆结构，再走流程；先做小例，再谈优化；先会排错，再做规模化。

<!-- lecture-notes:end -->
