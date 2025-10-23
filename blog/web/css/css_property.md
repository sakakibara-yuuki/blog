---
title: 'css_property'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2025-10-23
tags: ["astro", "math"]
---

# Introduction
## Contents
## Padding と Marginの使い分け
- padding: 子要素との間隔を調整する。
- margin: 兄弟要素との間隔を調整する。

## grid box内でoverflow-xが効かない
```html
<div class="box">
    <div>A</div>
    <pre>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</pre>
    <div>B</div>
</div>
```
```css
.box {
    display: grid;
    grid-template-columns: 2fr 8fr 2fr;
}

.pre {
    grid-column: 2/3;
    overflow-x: scroll;
}
```

[grid-template-columnsの値の説明](https://developer.mozilla.org/ja/docs/Web/CSS/flex_value)を読んでみると、このように指定した場合には真ん中のitemは`minmax(auto, 8fr)`のようになる。
ここで、[`auto`](https://developer.mozilla.org/ja/docs/Web/CSS/grid-template-columns#auto)は最大で`max-content`、最小で`min-content`である。つまり、コンテンツの幅に合わせることになる。

真ん中のフレームの幅は実質的に`minmax(min-content, max-content)`なのだ。

これがgrid box内でoverflow-xが効かない原因である。
grid boxは子の内容に応じて幅を決めようとし、子はoverflow-xが指定されていたとしても自分の親が子を縮めようとしないため子は常にmin-contentの幅を有する。
