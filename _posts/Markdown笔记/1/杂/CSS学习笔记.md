# CSS 完整学习笔记

> 适合对象：前端初学者、后端开发者、UI 开发者、需要系统掌握样式、布局、响应式、动画、可访问性、现代 CSS 和工程化写法的人。

CSS 是 Cascading Style Sheets，层叠样式表。它用于描述 HTML 或 XML 文档如何呈现，包括颜色、字体、间距、布局、响应式、动画、视觉层级和打印样式等。HTML 负责结构和语义，CSS 负责样式和布局，JavaScript 负责交互和行为。

如果你只会写 `color`、`margin` 和 `display: flex`，还不算真正理解 CSS。真正掌握 CSS，需要理解：层叠规则、继承、优先级、盒模型、格式化上下文、布局模型、Flexbox、Grid、定位、堆叠上下文、响应式、媒体查询、容器查询、自定义属性、现代选择器、动画、可访问性和工程化组织方式。

最后调研：2026-06-13。

版本说明：截至 2026-06-13，CSS 不是一个单一版本号标准，而是由多个模块组成。W3C CSS Snapshot 2026 汇总了 CSS 当前稳定状态，MDN CSS Reference 适合作为日常开发参考。学习时不要只停留在“CSS3”这个笼统说法，应按模块理解：Selectors、Cascade、Box Model、Flexbox、Grid、Color、Fonts、Transforms、Animations、Container Queries 等。

学习目标：

- 能解释层叠、继承、优先级、盒模型和格式化上下文。
- 能用 Flexbox、Grid、Subgrid 和 Container Queries 构建响应式布局。
- 能写出可维护的组件样式、主题变量和基础设计 token。
- 能处理可访问性、暗色模式、动效降级和性能问题。
- 能用浏览器 DevTools 定位样式不生效、布局溢出、层级异常等问题。

## 目录

1. CSS 是什么
2. CSS、HTML、JavaScript 的关系
3. CSS 基本语法
4. CSS 引入方式
5. 选择器基础
6. 现代选择器
7. 层叠 Cascade
8. 优先级 Specificity
9. 继承 Inheritance
10. Cascade Layers
11. CSS 值、单位与函数
12. 颜色系统
13. 自定义属性 CSS Variables
14. 盒模型 Box Model
15. display 与文档流
16. 尺寸、间距与溢出
17. 视觉格式化与 BFC
18. Flexbox
19. Grid
20. Subgrid
21. Position 定位
22. z-index 与堆叠上下文
23. 响应式设计
24. Media Queries
25. Container Queries
26. 字体与文本
27. 背景、边框、阴影
28. 图片和替换元素样式
29. Transform、Transition、Animation
30. 伪类与交互状态
31. 表单样式
32. 表格样式
33. 逻辑属性与国际化布局
34. CSS Reset、Normalize 与基础样式
35. CSS 架构与命名
36. 可访问性与 CSS
37. 性能优化
38. 调试 CSS
39. 常见错误和反模式
40. 常用属性速查
41. 学习路线
42. 参考资料与扩展阅读

## 1. CSS 是什么

CSS 用来控制网页呈现。

它可以控制：

- 颜色
- 字体
- 字号
- 行高
- 间距
- 边框
- 背景
- 阴影
- 布局
- 响应式
- 动画
- 打印样式

一句话理解：

```text
HTML 决定内容是什么，CSS 决定内容长什么样。
```

## 2. CSS、HTML、JavaScript 的关系

| 技术 | 作用 | 示例 |
| :--- | :--- | :--- |
| HTML | 结构和语义 | 标题、段落、按钮、表单 |
| CSS | 样式和布局 | 颜色、间距、网格、动画 |
| JavaScript | 行为和交互 | 点击事件、数据请求、状态更新 |

示例：

```html
<button class="primary-button">提交</button>
```

```css
.primary-button {
  padding: 0.75rem 1rem;
  color: white;
  background: #2563eb;
  border: 0;
  border-radius: 0.5rem;
}
```

HTML 提供按钮语义，CSS 提供视觉样式。

## 3. CSS 基本语法

CSS 规则由选择器和声明块组成：

```css
selector {
  property: value;
}
```

示例：

```css
p {
  color: #222;
  line-height: 1.6;
}
```

其中：

- `p` 是选择器
- `color` 是属性
- `#222` 是属性值
- `color: #222;` 是声明
- `{ ... }` 是声明块

### 3.1 注释

```css
/* 这是 CSS 注释 */
```

### 3.2 多个声明

```css
.card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: white;
}
```

### 3.3 CSS 容错

浏览器遇到不认识的属性或值，会跳过该声明。

```css
.box {
  unknown-property: value;
  color: red;
}
```

`color` 仍会生效。

## 4. CSS 引入方式

### 4.1 外部样式表

推荐方式：

```html
<link rel="stylesheet" href="/assets/css/main.css">
```

优点：

- 可缓存
- 可复用
- 结构清晰
- 便于维护

### 4.2 内部样式

```html
<style>
  body {
    font-family: system-ui, sans-serif;
  }
</style>
```

适合：

- 小页面
- Demo
- 临界 CSS

### 4.3 行内样式

```html
<p style="color: red;">文本</p>
```

不推荐长期使用。

原因：

- 维护困难
- 复用差
- 优先级高
- 不利于主题化

### 4.4 @import

```css
@import url("./reset.css");
```

现代项目中更推荐构建工具或 HTML `link`，避免额外阻塞和复杂加载顺序。

## 5. 选择器基础

### 5.1 类型选择器

```css
p {
  color: #333;
}
```

选择所有 `<p>`。

### 5.2 类选择器

```css
.button {
  padding: 0.5rem 1rem;
}
```

HTML：

```html
<button class="button">提交</button>
```

### 5.3 ID 选择器

```css
#main {
  max-width: 960px;
}
```

不建议大量用 ID 写样式，因为优先级太高。

### 5.4 属性选择器

```css
input[type="email"] {
  border-color: #2563eb;
}
```

常见：

```css
a[target="_blank"] {}
[disabled] {}
[aria-expanded="true"] {}
```

### 5.5 后代选择器

```css
.article p {
  line-height: 1.8;
}
```

选择 `.article` 内部所有 `p`。

### 5.6 子代选择器

```css
.nav > li {
  display: inline-block;
}
```

只选择直接子元素。

### 5.7 相邻兄弟选择器

```css
h2 + p {
  margin-top: 0;
}
```

选择紧跟在 `h2` 后面的第一个 `p`。

### 5.8 通用兄弟选择器

```css
h2 ~ p {
  color: #555;
}
```

选择同级后续所有 `p`。

## 6. 现代选择器

### 6.1 :is()

```css
:is(h1, h2, h3) {
  line-height: 1.2;
}
```

用于合并选择器。

### 6.2 :where()

```css
:where(h1, h2, h3) {
  margin-block: 0 0.75em;
}
```

`:where()` 的优先级为 0，适合基础样式。

### 6.3 :not()

```css
button:not(:disabled) {
  cursor: pointer;
}
```

### 6.4 :has()

```css
.card:has(img) {
  display: grid;
  grid-template-columns: 12rem 1fr;
}
```

`:has()` 可根据子元素或后代状态选择父元素。

表单示例：

```css
.field:has(input:invalid) {
  color: #dc2626;
}
```

### 6.5 :nth-child()

```css
li:nth-child(odd) {
  background: #f8fafc;
}
```

每 3 个：

```css
.item:nth-child(3n) {
  margin-right: 0;
}
```

### 6.6 :focus-visible

```css
button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

比 `:focus` 更适合键盘焦点样式。

## 7. 层叠 Cascade

CSS 中的 C 就是 Cascading。

当多个规则作用到同一个元素同一个属性时，浏览器通过层叠算法决定谁生效。

影响层叠的因素大致包括：

1. 来源和重要性
2. Cascade layer
3. 优先级
4. Scope proximity
5. 代码顺序

### 7.1 来源

CSS 来源包括：

- 浏览器默认样式
- 用户样式
- 作者样式
- 行内样式
- 动画
- 过渡

日常开发主要处理作者样式。

### 7.2 后写覆盖先写

```css
p {
  color: red;
}

p {
  color: blue;
}
```

结果是蓝色。

但只有在优先级等条件相同时，后写才覆盖先写。

## 8. 优先级 Specificity

优先级用于判断选择器强弱。

大致规则：

| 选择器 | 优先级 |
| :--- | :--- |
| 内联样式 | 最高 |
| ID | 高 |
| class、属性、伪类 | 中 |
| 元素、伪元素 | 低 |
| `:where()` | 0 |

### 8.1 示例

```css
p {
  color: black;
}

.text {
  color: blue;
}

#intro {
  color: red;
}
```

HTML：

```html
<p id="intro" class="text">文字</p>
```

结果是红色，因为 ID 优先级最高。

### 8.2 不要滥用 ID 和 !important

不推荐：

```css
#app #main .card .title {
  color: red !important;
}
```

这种写法难覆盖、难维护。

### 8.3 !important

```css
.hidden {
  display: none !important;
}
```

`!important` 会提升声明重要性。

只在这些场景谨慎使用：

- 工具类
- 覆盖第三方不可控样式
- 无障碍强制样式
- 紧急修复

## 9. 继承 Inheritance

有些 CSS 属性会继承。

常见可继承属性：

- `color`
- `font-family`
- `font-size`
- `line-height`
- `text-align`
- `visibility`

常见不可继承属性：

- `margin`
- `padding`
- `border`
- `width`
- `height`
- `display`
- `position`

### 9.1 inherit

```css
button {
  font: inherit;
}
```

### 9.2 initial

```css
.box {
  color: initial;
}
```

恢复属性初始值。

### 9.3 unset

```css
.box {
  color: unset;
}
```

如果属性可继承，则像 `inherit`；否则像 `initial`。

### 9.4 revert

```css
.box {
  all: revert;
}
```

回到上一级来源的样式。

## 10. Cascade Layers

Cascade Layers 用 `@layer` 控制样式层级。

### 10.1 基本用法

```css
@layer reset, base, components, utilities;

@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

@layer components {
  .button {
    padding: 0.5rem 1rem;
    background: blue;
  }
}

@layer utilities {
  .bg-red {
    background: red;
  }
}
```

后声明层优先级更高。

### 10.2 为什么有用

传统 CSS 中覆盖关系容易失控。

Cascade Layers 可以让你明确：

```text
reset < base < components < utilities
```

### 10.3 未分层样式

未放入 layer 的作者样式通常优先级高于已分层样式。

因此项目中使用 layer 时要有统一策略。

## 11. CSS 值、单位与函数

### 11.1 绝对单位

```css
width: 200px;
```

常见：

- `px`
- `pt`
- `cm`
- `mm`

网页开发最常用 `px`。

### 11.2 相对单位

| 单位 | 相对对象 |
| :--- | :--- |
| `%` | 父元素或上下文 |
| `em` | 当前元素字体大小 |
| `rem` | 根元素字体大小 |
| `vw` | 视口宽度 |
| `vh` | 视口高度 |
| `svh` | 小视口高度 |
| `lvh` | 大视口高度 |
| `dvh` | 动态视口高度 |

### 11.3 rem

```css
.card {
  padding: 1rem;
}
```

适合字号、间距等可随根字体缩放的尺寸。

### 11.4 clamp

```css
.title {
  font-size: clamp(1.5rem, 2vw + 1rem, 3rem);
}
```

含义：

```text
最小值，中间理想值，最大值
```

注意：不要过度依赖视口单位缩放正文文字，避免可读性和可访问性问题。

### 11.5 calc

```css
.main {
  width: calc(100% - 2rem);
}
```

### 11.6 min / max

```css
.box {
  width: min(100%, 60rem);
}
```

```css
.box {
  width: max(20rem, 50%);
}
```

## 12. 颜色系统

### 12.1 关键字

```css
color: red;
color: transparent;
```

### 12.2 十六进制

```css
color: #2563eb;
color: #fff;
```

### 12.3 rgb / rgba

现代写法：

```css
color: rgb(37 99 235);
background: rgb(37 99 235 / 0.1);
```

### 12.4 hsl

```css
color: hsl(221 83% 53%);
background: hsl(221 83% 53% / 0.1);
```

HSL 适合按色相、饱和度、亮度调整颜色。

### 12.5 currentColor

```css
.icon {
  color: #2563eb;
  border: 1px solid currentColor;
}
```

### 12.6 color-scheme

```css
:root {
  color-scheme: light dark;
}
```

告诉浏览器页面支持浅色/深色配色，有助于表单控件等原生 UI。

## 13. 自定义属性 CSS Variables

### 13.1 定义变量

```css
:root {
  --color-primary: #2563eb;
  --space-4: 1rem;
}
```

### 13.2 使用变量

```css
.button {
  padding: var(--space-4);
  background: var(--color-primary);
}
```

### 13.3 默认值

```css
.button {
  color: var(--button-color, white);
}
```

### 13.4 主题切换

```css
:root {
  --bg: white;
  --text: #111827;
}

[data-theme="dark"] {
  --bg: #111827;
  --text: white;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

### 13.5 变量会继承

CSS 自定义属性默认会继承。

这使它非常适合：

- 主题
- 设计 token
- 组件局部配置

## 14. 盒模型 Box Model

每个元素都可以看成一个盒子：

```text
content
padding
border
margin
```

### 14.1 标准盒模型

默认：

```css
box-sizing: content-box;
```

`width` 只包含 content。

实际宽度：

```text
width + padding + border
```

### 14.2 border-box

推荐全局设置：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

此时 `width` 包含 content、padding、border。

### 14.3 margin 折叠

垂直方向相邻块级元素的 margin 可能折叠。

```css
h1 {
  margin-bottom: 2rem;
}

p {
  margin-top: 1rem;
}
```

实际间距可能不是 3rem，而是较大值 2rem。

避免方式：

- 使用 Flex/Grid 的 `gap`
- 父元素创建 BFC
- 用 padding
- 统一只设置一个方向的 margin

## 15. display 与文档流

### 15.1 block

```css
div {
  display: block;
}
```

特点：

- 独占一行
- 默认宽度撑满父容器
- 可设置宽高

### 15.2 inline

```css
span {
  display: inline;
}
```

特点：

- 不独占一行
- 宽高通常不生效
- padding 水平方向更自然，垂直方向不影响行盒布局方式

### 15.3 inline-block

```css
.tag {
  display: inline-block;
}
```

特点：

- 像 inline 一样排在一行
- 又可以设置宽高

### 15.4 none

```css
.hidden {
  display: none;
}
```

元素不参与布局，也通常不会被屏幕阅读器读取。

### 15.5 contents

```css
.wrapper {
  display: contents;
}
```

让元素自身盒子消失，子元素参与父级布局。

使用时要注意可访问性和浏览器行为。

## 16. 尺寸、间距与溢出

### 16.1 width / height

```css
.box {
  width: 20rem;
  height: 10rem;
}
```

### 16.2 max-width

```css
.container {
  max-width: 72rem;
  margin-inline: auto;
}
```

网页容器常用。

### 16.3 min-height

```css
.page {
  min-height: 100svh;
}
```

移动端更推荐 `svh`/`dvh`，避免传统 `100vh` 在浏览器工具栏变化时的问题。

### 16.4 margin

```css
.card {
  margin: 1rem;
}
```

逻辑属性：

```css
.card {
  margin-block: 1rem;
  margin-inline: auto;
}
```

### 16.5 padding

```css
.card {
  padding: 1rem;
}
```

### 16.6 overflow

```css
.panel {
  overflow: auto;
}
```

常见值：

- `visible`
- `hidden`
- `auto`
- `scroll`
- `clip`

### 16.7 文本溢出省略

单行：

```css
.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

## 17. 视觉格式化与 BFC

BFC 是 Block Formatting Context，块级格式化上下文。

常见创建 BFC 的方式：

- `overflow` 非 `visible`
- `display: flow-root`
- `display: flex`
- `display: grid`
- `position: absolute/fixed`

### 17.1 flow-root

```css
.container {
  display: flow-root;
}
```

用途：

- 包含浮动元素
- 阻止 margin 折叠

### 17.2 清除浮动

旧方式：

```css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

现代方式：

```css
.container {
  display: flow-root;
}
```

## 18. Flexbox

Flexbox 是一维布局模型。

适合：

- 横向或纵向排列
- 居中
- 导航栏
- 工具栏
- 卡片内部布局

### 18.1 基本用法

```css
.row {
  display: flex;
  gap: 1rem;
}
```

### 18.2 主轴方向

```css
.row {
  flex-direction: row;
}

.column {
  flex-direction: column;
}
```

### 18.3 换行

```css
.list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
```

### 18.4 主轴对齐

```css
.nav {
  display: flex;
  justify-content: space-between;
}
```

常见：

- `flex-start`
- `center`
- `flex-end`
- `space-between`
- `space-around`
- `space-evenly`

### 18.5 交叉轴对齐

```css
.toolbar {
  display: flex;
  align-items: center;
}
```

### 18.6 flex

```css
.item {
  flex: 1;
}
```

等价于常见的可伸缩项。

更明确：

```css
.item {
  flex: 1 1 0;
}
```

### 18.7 常见居中

```css
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## 19. Grid

Grid 是二维布局模型。

适合：

- 页面整体布局
- 卡片网格
- 仪表盘
- 复杂行列布局

### 19.1 基本用法

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

### 19.2 repeat

```css
.grid {
  grid-template-columns: repeat(4, 1fr);
}
```

### 19.3 minmax

```css
.grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

### 19.4 自动响应式网格

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}
```

### 19.5 grid-template-areas

```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 16rem 1fr;
  gap: 1rem;
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}

.footer {
  grid-area: footer;
}
```

### 19.6 place-items

```css
.grid-center {
  display: grid;
  place-items: center;
}
```

## 20. Subgrid

Subgrid 允许子网格继承父网格的轨道。

### 20.1 示例

```css
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

适合让卡片内部标题、内容、按钮在多个卡片之间对齐。

### 20.2 使用场景

- 卡片列表对齐
- 表格式布局
- 嵌套组件与父网格对齐
- 复杂设计系统布局

### 20.3 注意

Subgrid 支持情况已经比早期好很多，但实际项目仍建议查目标浏览器兼容性。

## 21. Position 定位

### 21.1 static

默认值：

```css
position: static;
```

### 21.2 relative

```css
.badge {
  position: relative;
  top: -0.25rem;
}
```

相对自身原位置偏移，仍占原空间。

### 21.3 absolute

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
}
```

相对最近的非 static 定位祖先。

### 21.4 fixed

```css
.back-to-top {
  position: fixed;
  inset-inline-end: 1rem;
  inset-block-end: 1rem;
}
```

相对视口固定。

### 21.5 sticky

```css
.section-title {
  position: sticky;
  top: 0;
  background: white;
}
```

在滚动范围内粘住。

常见失效原因：

- 父级 overflow 设置不当
- 没有设置 top/bottom
- 父容器高度不足

## 22. z-index 与堆叠上下文

### 22.1 z-index 基础

```css
.modal {
  position: fixed;
  z-index: 1000;
}
```

`z-index` 通常需要定位元素才生效。

### 22.2 堆叠上下文

会创建堆叠上下文的常见情况：

- `position` + `z-index`
- `opacity < 1`
- `transform`
- `filter`
- `isolation: isolate`
- `will-change`
- `contain`

### 22.3 常见问题

元素 `z-index: 9999` 仍被盖住，可能因为它在较低的堆叠上下文里。

### 22.4 isolation

```css
.app {
  isolation: isolate;
}
```

可创建新的堆叠上下文，减少 z-index 污染。

## 23. 响应式设计

响应式设计是让页面适配不同屏幕和容器。

核心思路：

- 流式布局
- 弹性单位
- 媒体查询
- 容器查询
- 响应式图片
- 合理断点

### 23.1 移动优先

先写小屏样式：

```css
.layout {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: 16rem 1fr;
  }
}
```

### 23.2 不要只按设备命名断点

不推荐：

```css
@media (min-width: 768px) {
  /* iPad */
}
```

推荐按内容需要设置断点。

### 23.3 容器限制

```css
.container {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}
```

## 24. Media Queries

### 24.1 宽度查询

```css
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 24.2 prefers-color-scheme

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111827;
    --text: white;
  }
}
```

### 24.3 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 24.4 hover 和 pointer

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover {
    transform: translateY(-2px);
  }
}
```

避免给触摸设备强行设计 hover 交互。

## 25. Container Queries

容器查询根据容器大小变化，而不是视口大小。

### 25.1 启用容器

```css
.card-wrapper {
  container-type: inline-size;
}
```

### 25.2 查询容器

```css
@container (min-width: 40rem) {
  .card {
    display: grid;
    grid-template-columns: 12rem 1fr;
  }
}
```

### 25.3 命名容器

```css
.sidebar {
  container-name: sidebar;
  container-type: inline-size;
}

@container sidebar (min-width: 30rem) {
  .widget {
    display: grid;
  }
}
```

### 25.4 容器查询单位

常见：

- `cqw`
- `cqh`
- `cqi`
- `cqb`
- `cqmin`
- `cqmax`

示例：

```css
.card-title {
  font-size: clamp(1rem, 5cqi, 1.5rem);
}
```

谨慎使用，确保文字不会过小或过大。

## 26. 字体与文本

### 26.1 font-family

```css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

### 26.2 font-size

```css
body {
  font-size: 1rem;
}
```

正文不要过小。

### 26.3 line-height

```css
body {
  line-height: 1.6;
}
```

推荐使用无单位 line-height。

### 26.4 font-weight

```css
h1 {
  font-weight: 700;
}
```

### 26.5 text-align

```css
.center {
  text-align: center;
}
```

### 26.6 text-decoration

```css
a {
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.16em;
}
```

### 26.7 @font-face

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
```

`font-display: swap` 可减少文字不可见时间。

## 27. 背景、边框、阴影

### 27.1 background

```css
.hero {
  background-color: #111827;
  background-image: url("/images/hero.jpg");
  background-size: cover;
  background-position: center;
}
```

### 27.2 border

```css
.card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}
```

### 27.3 outline

```css
button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

`outline` 不占布局空间，适合焦点样式。

### 27.4 box-shadow

```css
.card {
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.08);
}
```

不要滥用大面积阴影，会影响性能和视觉清晰度。

## 28. 图片和替换元素样式

### 28.1 img 响应式

```css
img {
  max-width: 100%;
  height: auto;
}
```

### 28.2 object-fit

```css
.avatar {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 50%;
}
```

### 28.3 aspect-ratio

```css
.thumb {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

适合固定比例卡片、视频、图片容器。

## 29. Transform、Transition、Animation

### 29.1 transform

```css
.card {
  transform: translateY(0);
}

.card:hover {
  transform: translateY(-4px);
}
```

常见：

- `translate`
- `scale`
- `rotate`
- `skew`

### 29.2 transition

```css
.button {
  transition: background-color 150ms ease, transform 150ms ease;
}

.button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}
```

### 29.3 animation

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel {
  animation: fade-in 200ms ease-out;
}
```

### 29.4 尊重 reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .panel {
    animation: none;
  }
}
```

## 30. 伪类与交互状态

### 30.1 hover

```css
a:hover {
  text-decoration: underline;
}
```

### 30.2 active

```css
button:active {
  transform: translateY(1px);
}
```

### 30.3 focus-visible

```css
input:focus-visible {
  outline: 2px solid #2563eb;
}
```

### 30.4 disabled

```css
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 30.5 invalid

```css
input:invalid {
  border-color: #dc2626;
}
```

注意：页面初始状态下 `:invalid` 可能立即触发，实际表单体验需要谨慎设计。

## 31. 表单样式

### 31.1 基础输入框

```css
.field {
  display: grid;
  gap: 0.375rem;
}

.input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font: inherit;
}

.input:focus-visible {
  border-color: #2563eb;
  outline: 3px solid rgb(37 99 235 / 0.2);
}
```

### 31.2 继承字体

```css
button,
input,
select,
textarea {
  font: inherit;
}
```

### 31.3 不要移除焦点样式

不推荐：

```css
*:focus {
  outline: none;
}
```

除非你提供了清晰替代焦点样式。

## 32. 表格样式

### 32.1 基础表格

```css
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

thead th {
  background: #f9fafb;
  font-weight: 600;
}
```

### 32.2 响应式表格

```css
.table-wrapper {
  overflow-x: auto;
}
```

HTML：

```html
<div class="table-wrapper">
  <table>...</table>
</div>
```

## 33. 逻辑属性与国际化布局

传统方向属性：

```css
margin-left: 1rem;
padding-right: 1rem;
```

逻辑属性：

```css
margin-inline-start: 1rem;
padding-inline-end: 1rem;
```

常用：

| 传统 | 逻辑 |
| :--- | :--- |
| `margin-left/right` | `margin-inline-start/end` |
| `margin-top/bottom` | `margin-block-start/end` |
| `padding-left/right` | `padding-inline-start/end` |
| `top/bottom` | `inset-block-start/end` |
| `left/right` | `inset-inline-start/end` |

### 33.1 margin-inline

```css
.container {
  margin-inline: auto;
}
```

### 33.2 inset

```css
.badge {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
}
```

逻辑属性对多语言布局更友好。

## 34. CSS Reset、Normalize 与基础样式

### 34.1 为什么需要基础样式

浏览器有默认样式。

不同浏览器默认样式可能不同。

项目通常会写基础 reset。

### 34.2 简单 reset

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}

img,
picture,
svg,
video {
  display: block;
  max-width: 100%;
}

button,
input,
textarea,
select {
  font: inherit;
}
```

### 34.3 不要过度 reset

过度 reset 可能破坏：

- 表单默认可访问性
- 列表语义视觉
- 焦点样式
- 可读性

## 35. CSS 架构与命名

### 35.1 组件化思路

```css
.card {}
.card__title {}
.card__body {}
.card__footer {}
```

### 35.2 BEM

```css
.button {}
.button--primary {}
.button--large {}
.form-field__label {}
.form-field__input {}
```

### 35.3 Utility 类

```css
.mt-4 {
  margin-top: 1rem;
}

.text-center {
  text-align: center;
}
```

适合少量工具类或 Tailwind 这类体系。

### 35.4 设计 Token

```css
:root {
  --color-primary: #2563eb;
  --color-text: #111827;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius-md: 0.5rem;
}
```

### 35.5 分层组织

```css
@layer reset, base, tokens, components, utilities;
```

## 36. 可访问性与 CSS

### 36.1 保留焦点样式

```css
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

### 36.2 颜色对比度

文本和背景要有足够对比度。

不要只用颜色表达状态。

错误：

```css
.error {
  color: red;
}
```

更好：

```html
<p class="error" role="alert">错误：邮箱格式不正确。</p>
```

### 36.3 reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }
}
```

### 36.4 不用 display none 隐藏给屏幕阅读器的内容

视觉隐藏但保留给辅助技术：

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 37. 性能优化

### 37.1 避免过深选择器

不推荐：

```css
body .app .main .content .card .header .title {}
```

推荐：

```css
.card-title {}
```

### 37.2 动画优先 transform 和 opacity

性能较好：

```css
transform: translateX(10px);
opacity: 0.8;
```

容易触发布局：

```css
width
height
top
left
margin
```

### 37.3 谨慎使用 will-change

```css
.panel {
  will-change: transform;
}
```

不要长期大量使用，会消耗内存。

### 37.4 减少大面积阴影和滤镜

这些可能带来绘制成本。

### 37.5 CSS 文件优化

- 移除未使用 CSS
- 压缩 CSS
- 合理拆分关键 CSS
- 避免加载不必要字体
- 使用现代图片格式和尺寸

## 38. 调试 CSS

### 38.1 浏览器开发者工具

重点看：

- Elements
- Styles
- Computed
- Layout
- Accessibility
- Network
- Performance

### 38.2 查看最终生效属性

DevTools 的 Computed 面板可以查看最终计算值。

### 38.3 排查覆盖问题

检查：

- 是否选择器没匹配
- 是否被后续规则覆盖
- 是否优先级不够
- 是否 layer 顺序影响
- 是否属性值无效
- 是否媒体查询没命中

### 38.4 outline 调试布局

```css
* {
  outline: 1px solid rgb(255 0 0 / 0.2);
}
```

临时查看盒子边界。

### 38.5 检查滚动溢出

```css
html,
body {
  overflow-x: hidden;
}
```

这只是临时止血，不应替代真正查出哪个元素超宽。

### 38.6 样式不生效排查流程

1. 在 Elements 面板确认目标元素是否选对。
2. 在 Styles 面板确认规则是否被划线、覆盖或未命中。
3. 在 Computed 面板确认最终计算值和来源规则。
4. 检查选择器优先级、`@layer` 顺序、媒体查询、容器查询是否符合预期。
5. 检查属性和值是否被浏览器支持，必要时用 MDN 和 Can I use 核对。
6. 临时关闭相关规则，确认是否有布局、滚动、层叠上下文或继承影响。

常见定位技巧：

```css
/* 查超宽元素 */
* {
  outline: 1px solid rgb(255 0 0 / 0.15);
}

/* 查元素是否命中选择器 */
.suspect {
  background: rgb(255 255 0 / 0.3);
}
```

## 39. 常见错误和反模式

### 39.1 全局滥用 !important

会让样式越来越难维护。

### 39.2 使用 ID 写大量样式

ID 优先级太高，不利于组件复用。

### 39.3 固定高度导致内容溢出

不推荐：

```css
.card {
  height: 200px;
}
```

更稳：

```css
.card {
  min-height: 200px;
}
```

### 39.4 移除 outline

不推荐：

```css
button:focus {
  outline: none;
}
```

### 39.5 用 margin 撑开父子关系

父子 margin 折叠容易造成意外。

可用：

- padding
- gap
- flow-root

### 39.6 在所有设备依赖 hover

触摸设备没有传统 hover。

使用：

```css
@media (hover: hover) {}
```

### 39.7 魔法数字太多

```css
top: 137px;
left: 43px;
```

如果不是明确设计值，容易难维护。

### 39.8 只按屏幕宽度做响应式

很多组件真正关心的是自身容器宽度，而不是整个 viewport。组件级响应式优先考虑 Container Queries：

```css
.card-list {
  container-type: inline-size;
}

@container (min-width: 480px) {
  .card {
    display: grid;
    grid-template-columns: 12rem 1fr;
  }
}
```

### 39.9 物理方向属性写死

在多语言、RTL、竖排或国际化界面中，优先考虑逻辑属性：

```css
.box {
  margin-inline: auto;
  padding-block: 1rem;
  border-inline-start: 4px solid currentColor;
}
```

### 39.10 忽略用户偏好

暗色模式、减少动画、输入设备类型都可能影响体验：

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
    scroll-behavior: auto;
  }
}
```

### 39.11 现代 CSS 实战清单

新组件样式可以按这个顺序检查：

1. 语义结构是否来自 HTML，而不是靠 CSS 假装语义。
2. 布局用 Flex 还是 Grid，是否需要 container query。
3. 尺寸是否避免固定高度，是否能容纳动态内容。
4. 文本是否考虑换行、溢出、省略、最小宽度。
5. 颜色是否来自 token，是否支持暗色模式。
6. 交互状态是否覆盖 hover、focus-visible、active、disabled。
7. 动效是否尊重 `prefers-reduced-motion`。
8. 是否避免过高优先级、全局污染和长期 `!important`。
9. 是否能在 DevTools 中快速定位来源和覆盖关系。

## 40. 常用属性速查

### 40.1 布局

```css
display
position
inset
z-index
overflow
float
clear
```

### 40.2 Flex

```css
display: flex
flex-direction
flex-wrap
justify-content
align-items
align-content
gap
flex
flex-grow
flex-shrink
flex-basis
order
```

### 40.3 Grid

```css
display: grid
grid-template-columns
grid-template-rows
grid-template-areas
grid-column
grid-row
place-items
place-content
gap
```

### 40.4 盒模型

```css
box-sizing
width
height
min-width
max-width
min-height
max-height
margin
padding
border
```

### 40.5 文字

```css
font-family
font-size
font-weight
line-height
letter-spacing
text-align
text-decoration
text-transform
white-space
overflow-wrap
```

### 40.6 视觉

```css
color
background
border-radius
box-shadow
opacity
filter
transform
transition
animation
```

### 40.7 响应式

```css
@media
@container
clamp()
min()
max()
calc()
```

## 41. 学习路线

### 阶段 1：基础语法

掌握：

- 选择器
- 属性和值
- CSS 引入方式
- 注释
- class 命名

### 阶段 2：核心机制

掌握：

- 层叠
- 优先级
- 继承
- 盒模型
- display
- margin 折叠

### 阶段 3：布局

掌握：

- Flexbox
- Grid
- position
- z-index
- overflow
- gap

### 阶段 4：响应式

掌握：

- 相对单位
- media queries
- container queries
- responsive images
- clamp

### 阶段 5：视觉和动效

掌握：

- color
- typography
- background
- border
- shadow
- transform
- transition
- animation

### 阶段 6：现代 CSS

掌握：

- custom properties
- cascade layers
- `:is`
- `:where`
- `:has`
- nesting
- subgrid
- logical properties

### 阶段 7：工程实践

掌握：

- reset/base
- 设计 token
- 组件样式
- 命名规范
- 可访问性
- 性能优化
- DevTools 调试

## 42. 参考资料与扩展阅读

建议优先阅读官方标准和 MDN，再用兼容性数据决定生产环境写法。

官方资料：

- [W3C CSS Snapshot 2026](https://www.w3.org/TR/css-2026/)
- [W3C CSS Current Work](https://www.w3.org/Style/CSS/current-work.en)
- [CSS Working Group Drafts](https://drafts.csswg.org/)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [MDN CSS Cascade](https://developer.mozilla.org/docs/Web/CSS/CSS_cascade/Cascade)
- [MDN Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
- [MDN Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
- [MDN Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)
- [MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables)
- [MDN CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [MDN Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [web.dev Learn CSS](https://web.dev/learn/css)
- [Can I use](https://caniuse.com/)

实践检索关键词：

- `CSS container queries 组件响应式`
- `CSS cascade layers 架构`
- `CSS z-index stacking context 排查`
- `CSS overflow-x 页面横向滚动`
- `CSS prefers-reduced-motion 可访问性`

## 最后总结

CSS 的核心可以浓缩为：

```text
选择器找到元素
声明设置样式
层叠决定谁生效
继承减少重复
盒模型决定尺寸
布局模型决定排列
响应式适配环境
变量和层级提升维护性
```

真正写好 CSS 的关键不是背属性，而是理解：

1. 为什么这个规则会生效？
2. 为什么这个规则没有生效？
3. 这个布局应该用 Flex 还是 Grid？
4. 这个尺寸应该固定还是自适应？
5. 这个样式是否可访问？
6. 这个组件以后是否容易维护？

当你能解释层叠、优先级、继承、盒模型、Flex 主轴交叉轴、Grid 行列轨道、BFC、z-index 堆叠上下文、media query 和 container query 的区别、CSS variables 如何做主题时，就已经真正入门现代 CSS。

## 2026-06 深化整理：CSS 的工程化学习框架

Last researched: 2026-06-16

### 1. 学习定位

CSS 这类知识不适合只按“概念清单”记忆，更适合按可交付能力组织。本文后续复习时，应围绕这条主线展开：层叠、继承、选择器、盒模型、布局、响应式、动画、可访问性和性能。如果只会照抄命令、配置或示例，而不能解释输入、输出、边界、失败模式和验证方法，知识在真实项目里会很快失效。

一份万字级笔记要承担三个作用：第一，建立准确概念，避免把相似术语混在一起；第二，形成可执行流程，知道从零搭建、调试和交付的顺序；第三，沉淀排错经验，遇到异常时能按证据定位，而不是凭感觉改配置。学习时建议把每个小节都对应到“是什么、为什么、怎么做、什么时候不用、出了问题怎么查”五个问题。

### 2. 核心模块

- 层叠算法决定最终样式
- 盒模型决定尺寸计算
- Flex/Grid 是现代布局主力
- 响应式不是只写媒体查询
- 性能和可访问性是样式工程的一部分

这些模块之间不是孤立关系。通常先有需求和约束，再选择架构或工具；工具落地后会产生配置、接口、状态和制品；运行阶段再通过日志、指标、测试和回滚机制验证结果。真正掌握本主题，意味着能从一次失败现象反推到是哪一层出了问题。

```mermaid
flowchart LR
  A[目标与约束] --> B[核心概念]
  B --> C[工程实现]
  C --> D[测试与验证]
  D --> E[上线或交付]
  E --> F[日志、指标、反馈]
  F --> B
```

Figure: 通用学习与工程闭环，结合官方文档、标准资料和社区实践重新整理。

### 3. 实践路线

建议按四轮学习。第一轮只跑通最小例子，不追求复杂度；第二轮补齐关键概念，明确每个配置项和命令的作用；第三轮做故障注入，主动制造常见错误并记录现象；第四轮整理成项目模板，把目录结构、命名规范、检查清单和参考链接固化下来。

对技术笔记而言，最小例子必须可重复。命令类主题要记录操作系统、Shell、权限、工作目录和返回码；框架类主题要记录版本、依赖、构建命令、目录结构和运行入口；工程设计类主题要记录标准依据、图纸、点表、验收项和变更记录。没有环境信息的示例，后续很难判断是知识错误、版本差异还是本机配置问题。

### 4. 常见错误

- 选择器权重堆太高
- 固定宽高导致移动端溢出
- z-index 没理解 stacking context
- 动画触发布局抖动
- 颜色对比度不足

排查时先收集事实：版本、配置、输入、输出、日志、错误码、时间点、复现步骤。不要一开始就改多个参数。一次只改一个变量，并记录改动前后的现象。对于涉及安全、权限、部署、数据库、电气或工业控制的主题，要优先查官方文档和标准，社区文章只能作为实践参考，不能作为唯一依据。

### 5. 笔记维护建议

后续更新这篇文档时，建议保留 `Last researched` 日期，并把新增内容放到“版本差异”“实践坑”“调试清单”“参考资料”中。对于快速变化的工具链，例如 Android、Gradle、Docker、CI/CD、Redis、uv、Qt 和前端标准，至少在重新实践前核对一次官方文档。对于工业、电气、PLC、RBAC 这类涉及安全、权限或标准的内容，应明确标准编号、适用地区、适用版本和项目约束。

## References and further reading

- [Official] [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Official] [CSS Snapshot](https://www.w3.org/TR/CSS/)
- [Official] [Web.dev CSS](https://web.dev/learn/css/)
- [Official] [MDN Web Docs](https://developer.mozilla.org/)
- [Official] [Microsoft Learn](https://learn.microsoft.com/)
- [Official] [Docker Docs](https://docs.docker.com/)
- [Official] [GitHub Actions documentation](https://docs.github.com/actions)
- [Official] [GitLab CI/CD documentation](https://docs.gitlab.com/ci/)
- [Official] [CMake Documentation](https://cmake.org/cmake/help/latest/)
- [Official] [Gradle User Manual](https://docs.gradle.org/)
- [Official] [Apache Maven Guides](https://maven.apache.org/guides/)
- [Official] [Redis Documentation](https://redis.io/docs/latest/)
- [Official] [Qt Documentation](https://doc.qt.io/qt-6/)
- [Course] [MIT 6.006 Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)

<!-- research-notes: enhanced-v1 -->

## 研究笔记增强

> Last reviewed: 2026-06-17。此节用于把《CSS 完整学习笔记》从阅读笔记推进到可复习、可实践、可验证的研究笔记；具体版本、参数和环境仍需结合官方资料、项目约束和实测结果校准。

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
- 学完《CSS 完整学习笔记》后，能否用自己的话说明它解决什么问题、不解决什么问题？
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
主题：CSS 完整学习笔记
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

## 讲义级补充：如何真正学懂《CSS 完整学习笔记》

> 适用位置：杂\CSS学习笔记.md  
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

学习《CSS 完整学习笔记》时，先做一个最小可验证例子：输入要小，步骤要清楚，输出要能检查。然后故意制造一个错误，观察系统如何失败，并记录排查顺序。

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
