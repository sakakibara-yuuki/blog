---
layout: ../../../../layouts/MarkdownPostLayout.astro
title: "位相空間"
author: "sakakibara"
description: "位相空間"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "Astroの光線のサムネイル。"
pubDate: 2024-03-19
tags: ["位相空間", "トポロジー"]
---

# 位相
空でない集合$X$について、$X$の部分集合の族$\mathcal{O}$が以下を充たすとき、$\mathcal{O}$を**位相**という。
$$
\begin{aligned}
\mathbf{O}_ 1 : &\ X \in \mathcal{O}, \phi \in \mathcal{O} \\
\mathbf{O}_ 2 : &\ O_1, O_2, \ldots, O_k \in \mathcal{O} \implies O_1\cap O_2\cap\cdots\cap O_k \in \mathcal{O}\\
\mathbf{O}_ 3 : &\ \{O_{\lambda}\}_ {\lambda \in \Lambda} \in \mathcal{O} \implies \bigcup_{\lambda \in \Lambda} O_\lambda \in \mathcal{O}
\end{aligned}
$$
位相$\mathcal{O}$が備わった空でない集合$X$を, 集合と位相の組$(X, \mathcal{O})$で表し**位相空間**とよぶ。$\mathcal{O}$の元$O$を(位相$\mathcal{O}の$)**開集合**と呼ぶ。

初見で見ると何の役に立つのかわからず、定義も意味不明だし、具体例もわからず面喰らうだろう。
だが、よくこの定義を見てみるととても素朴なことを要請していることに気づく。
ラフに言ってしまえば、位相$\mathcal{O}$は全体集合$X$と空集合$\phi$を元に持ち、その元の有限積と無限和で閉じているような集合族のことを指すのである。

なぜ和に関しては無限で積に関しては有限なの？という疑問があるかもしれない。
これは無限の積を許すと$X$の元すべてを位相$\mathcal{O}$の元として入れなければならないことに起因する。
なぜ$X$のすべての元を位相$\mathcal{O}$の元とすることを避けているのかということについては後々。

そもそもなぜ位相を定義したのかがよくわからいだろう。
これは連続な写像を持つ集合すべてが位相を持ち、極限という操作を行える集合がすべてこの位相空間を前提としているという事実が極めて重要だからである。
つまり、解析における基礎土台となる概念である。

位相を定義したが、具体性が低くてよくわからないと思う。
意地悪をするつもりはないがよく知られる具体例を出そう
#### 離散位相
空でない集合$X$の冪集合$2^{X}$を位相とする位相空間を離散位相と呼ぶ。  
よりイメージしなくくなったという批判は甘んじて受け入れよう。
これは開集合が小粒であり、バラバラであることから離散位相と呼ばれている。

#### 密着位相
空でない集合$X$について$\set{O| O=X \lor O=\phi}$を位相とする位相空間を密着位相と呼ぶ。  
反省も後悔もしてない。
これは開集合が塊になっていることから密着位相と呼ばれる。

これらの例を通して知ってほしいのは位相の定義は$\mathbf{O}_ 1 \sim \mathbf{O}_ 3$を充たす集合族のことだが、実際に位相を定義する際には内包的な定義をするということである。
開集合を一つ一つ述べる外延的な定義のほうがイメージしやすいのはわかるが基本的にはその性質を述べる内包的な定義を述べ、$\mathbf{O}_ 1 \sim \mathbf{O}_ 3$によりそれが位相と呼べるかどうかを確かめるという流れが多い。(というか記号遊び以上でも以下でもないから特別な期待しないで)

以下では位相により作り出された位相について説明する。
#### 相対位相
#### 積位相
#### 商位相
特別に使われる位相について説明する。
#### 自然な位相

#### 距離空間
#### ハウスドルフ空間
#### 完備距離空間
