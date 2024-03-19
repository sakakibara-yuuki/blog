---
layout: ../../../layouts/MarkdownPostLayout.astro
title: "辺ベースの電磁場解析"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "Astroの光線のサムネイル。"
pubDate: 2024-03-18
tags: ["有限要素法", "電磁場解析", "数値解析"]
---

# 電磁界解析
マクスウェル方程式を手で解く人はいない。  
解析的に解けないケースがほとんどだからだ。
実際に電磁界解析を行おうと思うとコンピュータによる数値解析が必須になってくる。
だが、電磁界解析を行うソフトは非常に高価で数100万~数1000万程度の金かかる。
それにカスタマイズ性も低く、使いこなすのに練度が必要となる。

そこで、自前の電磁界解析プログラムを作成して、様々な実験を行う。

以下ではどのようにしてマクスウェル方程式を数値解析に落とし込むか。
より具体的に言えばどのようにして微分方程式を行列計算に落とし込むかについて説明する。

## 重み付き残差法
### 内積
内積という概念が広いことを知っている人は多いだろう。
$$
\langle\cdot \rangle: V\times V \rightarrow \mathbb{R} \\
$$
$a, b, c \in V$, $\alpha \in \mathbb{R}$について以下が成り立つなら演算子$\langle\cdot\rangle$を内積という。
$$
\begin{aligned}
\text{(正値性)}&\  \langle a\cdot a \rangle \ge 0\ \land\ \langle a\cdot a \rangle = 0 \implies a = 0\\
\text{(対称性)}&\  \langle a\cdot b \rangle = \langle b \cdot a \rangle \\
\text{(多重線形性)}&\  \alpha \langle a \cdot b \rangle = \langle \alpha a \cdot b \rangle \\
&\  \langle a + b \cdot c \rangle = \langle a \cdot c \rangle + \langle b \cdot c \rangle
\end{aligned}
$$
複素数を前提とした定義もあるが、あまり使用しないので今回は以上を満たす演算$\langle \cdot \rangle$を内積とする。

内積という概念は距離の概念を拡張したものと取られられている。
これは関数としての距離が内積の定義に含まれるからである。

### 残差を求める方法
ベクトル空間$V$、$f : V\rarr V$とする。  
$\bm{a}, \bm{b} \in V$にたいして
$$
f(\bm{a}) = \bm{b}
$$
以上のような関数を考える。ここで$f, \bm{b}$を既知として$\bm{a}$を求めたいがどのようにすればよいだろうか。  
最初に考得られる手段が最小二乗法である。  
$\bm{a}'$を$\bm{a}$の近似解とする。以下で定義する$\bm{R}$を残差という。
$$
\bm{R} = \bm{b} - f(\bm{a}')
$$
最小二乗法は残差の二乗和(内積)を最小にするような近似解$\bm{a}'$を$\bm{a}$とする手法である。
$$
\bm{a} = \min_{\bm{a'}} \big(\langle\bm{R}(\bm{a}')\cdot\bm{R}(\bm{a}')\rangle\big)
$$

残差の二乗を最小にするベクトルが解であるというのは非常に直感的だが、この他にこれに近い考えとして重み付き残差法というのものがある。

$$
0 = \langle\bm{w}\cdot\bm{R}(\bm{a}')\rangle
$$
ここで$\bm{w}$は重み関数と呼ばれる関数で、この種類によって様々なバリエーションが生まれる。

### ガラーキン法
ベクトル空間$V$が基底$\langle \bm{N}_ 1, \bm{N}_ 2, \ldots, \bm{N}_ E \rangle$によって生成されているとする。
$\bm{a}\in V$について以下が成り立つ。
$$
\bm{a} = \sum a_e \bm{N}_ e
$$
そこで、重み付き残差法における$\bm{w}$を$\bm{N}_ e$とすると、
$$
0 = \langle\bm{N}_ e\cdot\bm{R}(\bm{a}')\rangle
$$
が得られる。  
$\bm{N}_ e$が$E$個あるため方程式が$E$個得られる。
これにより$E$個の$a_e$を変数とする方程式が得られるため、行列で計算できる。
ガラーキン法の特徴として残差が基底により生成する空間の直交空間となることである。

## 有限要素法
有限要素法とは対象(これを$M$とする。)を複数の要素(または有限要素)と呼ばれる領域に分割して、各領域で物理量を補間することにより実際の現象をシミュレーションする手法のことだ。
分割された要素は$2$次元であれば三角形や四角形であったり、$3$次元であれば四面体、六面体、プリズム、などに分割される。基本的に分割が細ければ細かいほどシミュレーションとしての精度は向上するが、計算コストが増大する。  
また、要素内における物理量の補間に関しても1次補間、2次補間、...といった分類やラグランジュ補間、ルジャンドル補間などの補間手法による分類などががある。

今回は最も単純な四面体要素、1次ラグランジュ補間について解説する。

## A-$\phi$法
<!-- 対象$M$を四面体で分割し、その要素一つを$m$としよう。 -->
よく知られたようにマクスウェル方程式は以下の４つの式で表される。
$$
\begin{align}
\mathrm{div}\bm{D} &= \rho \\
\mathrm{div}\bm{B} &= 0 \\
\mathrm{rot}\bm{E} &= -\frac{\partial \bm{B}}{\partial t} \\
\mathrm{rot}\bm{H} &= \bm{J}+\frac{\partial \bm{D}}{\partial t}
\end{align}
$$
ただし、適当なテンソル$\epsilon, \mu, \sigma$を用いて
$$
\bm{D} = \epsilon \bm{E} \\
\bm{B} = \mu \bm{H} \\
\bm{J} = \sigma \bm{E} + \bm{J}_ {source}
$$
のような関係がある。

磁束密度$\bm{B}$はベクトル・ポテンシャルにより表現することもできる。
ベクトル・ポテンシャルを$\bm{A}$とすると。
$$
\bm{B} = \mathrm{rot}(\bm{A} + \mathrm{grad}\chi)
$$
のように表現できる。実質的に$\bm{B}$の値を決定しているのは$\bm{A}$であるが、
$\mathrm{rot}$の演算は$\mathrm{grad}$を$0$にするために$\mathrm{grad}\chi$の分だけ自由度が残る。
これをゲージ自由度という。
これを$3$つめの式に代入すると
$$
\begin{align}
\mathrm{rot}\bm{E} &= -\frac{\partial \bm{B}}{\partial t} \\
&= -\frac{\partial}{\partial t}\mathrm{rot}(\bm{A} + \mathrm{grad}\chi) \\
&= -\mathrm{rot}(\frac{\partial \bm{A}}{\partial t} + \frac{\partial}{\partial t}\chi)
\end{align}
$$
より
$$
\mathrm{rot}(\bm{E} + \frac{\partial \bm{A}}{\partial t} + \frac{\partial}{\partial t}\chi) = \bm{0}
$$
これにより(ヘルムホルツの原理)、
$$
\bm{E} + \frac{\partial \bm{A}}{\partial t} + \frac{\partial}{\partial t}\chi = \mathrm{grad}\chi'
$$

$$
\bm{E} = -\frac{\partial \bm{A}}{\partial t} - \frac{\partial}{\partial t}\chi + \mathrm{grad}\chi'
$$

ここでも$\chi, \chi'$の分だけ不定となる。
この不定を決定することによりさまざまなパターンのベクトル・ポテンシャルが定義できる。
不定の値を様々にチューニングしてベクトル・ポテンシャル間を変換することをゲージ変換という。
逆にマクスウェル方程式はゲージ変換の元で普遍な理論という見方もできる。
(実用上、計算がしやすくなる以上の意味は見いだせない。)


以降の有限要素法では$\chi=0$, $\mathrm{grad}\chi' = \frac{\partial \phi}{\partial t}$とする。つまり
$$
\begin{aligned}
\bm{B} &= \mathrm{rot}\bm{A} \\
\bm{E} &= -\frac{\partial \bm{A}}{\partial t} + \frac{\partial \phi}{\partial t}
\end{aligned}
$$
を選択する。
したがって。
$$
\begin{aligned}
\bm{J} &= \sigma\bm{E} + \bm{J}_ {source} \\
&= -\sigma\frac{\partial \bm{A}}{\partial t} - \sigma\frac{\partial \phi}{\partial t} + \bm{J}_ {source}
\end{aligned}
$$

少しだけ注意すべきは$\bm{E}$の第二項が$\frac{\partial \phi}{\partial t}$となっていることである。
多くの参考資料ではこの代わりに$\bm{E} = -\frac{\partial \bm{A}}{\partial t} + \bm{\phi}$となっていることがおおいだろう。

さて、これまでの$\bm{A}, \frac{\partial \phi}{\partial t}$の導入から式$3$を満たすことは自明である。
式$4$について考える。
$$
\begin{aligned}
\mathrm{rot}\bm{H} &= \bm{J}+\frac{\partial \bm{D}}{\partial t} \\
\mathrm{rot}\mu^{-1}\bm{B} &= \bm{J}+\epsilon\frac{\partial \bm{E}}{\partial t} \\
\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} &= \bm{J}-\epsilon\frac{\partial^2 \bm{A}}{\partial t^2} + \epsilon\frac{\partial^2 \phi}{\partial t^2} \\
\end{aligned}
$$
これ以上の式変形は不要に複雑になるのでここで留めておこう。

有限要素法では右辺第二項以降を無視することが多い。
これは準静的過程(quasi-static)と呼ばれる。英語名が不思議なので検索に意外と引っかからない。
第二項を無視できる条件は周波数と誘電率と伝導率が関わるが、大体無視できるのでよい。

$$
\begin{aligned}
\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} &= \bm{J} \\
\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} &= -\sigma\frac{\partial \bm{A}}{\partial t} - \sigma\frac{\partial \phi}{\partial t} + \bm{J}_ {source} \\
\end{aligned}
$$
少し整理して
$$
\begin{equation}
\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} + \sigma\frac{\partial \bm{A}}{\partial t} + \sigma\frac{\partial \phi}{\partial t} = \bm{J}_ {source} \tag{eq:$A-\phi$} \\
\end{equation}
$$
有限要素法ではこの式$(eq:A-\phi)$を解く。

### 補間と形状関数
位置次元$\mathbb{R}$上で定義された実数値関数$f(x)$について, $f(x_1), f(x_2), \ldots, f(x_n)$が与えれているとする。この元の関数$f(x)$はどのような関数だろうか？

単純な考えとして、実数値関数$f(x)$を多項式$p_{n-1}(x)$で近似する方法だ。
$$
\begin{aligned}
p_{n-1}(x) &= a_0 + a_1 x + a_2 x^2 + a_3 x^3 \cdots + a_{n-1} x^{n-1} \\
&\simeq f(x)
\end{aligned}
$$
このような関数を補間する多項式のことを補間多項式と呼ぶ。
のように表現して連立方程式を解く方法が考えられる。
$$
\begin{pmatrix}
f(x_1) \\
f(x_2) \\
\vdots \\
f(x_n)
\end{pmatrix}

=

\begin{pmatrix}
1 & x_1 & x_1^2 & \cdots & x_1^{n-1} \\
1 & x_2 & x_2^2 & \cdots & x_2^{n-1} \\
&&&\vdots& \\
1 & x_{n-1} & x_{n-1}^2 & \cdots & x_{n-1}^{n-1} \\
\end{pmatrix}

\begin{pmatrix}
a_0 \\
a_1 \\
\vdots \\
a_{n-1} 
\end{pmatrix}
$$
この真ん中の行列はヴァンデルモンドの行列として行列式が非常にきれいに求められることが知られている。
この解法に見られる特徴として、$f(x_i)=p(x_i)$となっている点である。これは補間という考えで非常に重要な性質である。

実際にこれは最もシンプルな方法であり、計算もうまくことが知られている。
ただし、これは計算コストが高いことが知られている。(LU分解ができない)

もっとうまいやり方がある。

それは以下のような補間多項式を用いる方法だ。

$$
p_{2}(x) = f(x_1)L_1(x) + f(x_2)L_2(x) + f(x_3)L_3(x)
$$
ただし、$L_i$は$2$次の多項式であり以下を満たす。
$$
L_i(x_j) = 
\begin{cases}
1 & \text{if } (i = j) \\
0 & \text{if } (i \neq j)
\end{cases}
$$

補間多項式は$3$つの項で表されているが、実際には$2$次の多項式となる。
この関数$\phi_i$を用いる補間をラグランジュ補間と呼ぶ。  
これらは具体的に以下のように書き下せる。
$$
\begin{aligned}
L_1(x) = \frac{(x - x_2)(x - x_3)}{(x_1 - x_2)(x_1 - x_3)} \\
L_2(x) = \frac{(x - x_1)(x - x_3)}{(x_2 - x_1)(x_2 - x_3)} \\
L_3(x) = \frac{(x - x_1)(x - x_2)}{(x_3 - x_1)(x_3 - x_2)}
\end{aligned}
$$
また、これらの関数は互いに直交することがわかる。(部分積分をしてみればすぐに気づく。どのみち$x_i$を代入すれば$0$になるため)

まとめる。  
一般に$n-1$次の多項式は
$$
p_{n-1}(x) = f(x_1)L_1(x) + f(x_2)L_2(x) + \cdots + f(x_{n})L_{n}(x)
$$
ただし、$L_i(x_j)$は以下を満たす$n-1$次多項式である。
$$
L_i(x_j) = 
\begin{cases}
1 & \text{if } (i = j) \\
0 & \text{if } (i \neq j)
\end{cases}
$$

標本点を多く取れば取るほど精度が高くなると考えられる。しかし、ラグランジュ補間は急峻な関数を近似する際、標本点を多く取ると多項式補間が振動する現象(ルンゲ現象)を引き起こすことが知られている。

(なんと、この関数は1779年に考え出されたものらしい。しかも発案者はラグランジュではなく、エドワード・ワーリングという人らしい。)

<!-- ### ガウス型積分 -->
### 要素内補間
対象$M$のある$3$次元四面体要素を$m$とする。
$m$内の物理量$\phi$を補間する方法について考える。予め名前をつけておくが、要素内の点における物理量はたいていある関数の線形和で表される。その関数を形状関数とか基底関数などと呼ばれる。
$m$は$4$つの頂点と$6$つの辺と$4$つの面を持つ。
$4$つの頂点に$\phi(\bm{x}_ 0), \phi(\bm{x}_ 1), \phi(\bm{x}_ 2), \phi(\bm{x}_ 3)$が割てられているとする。この定数をそれぞれ$\phi_0, \phi_1, \phi_2, \phi_3$とする。
$$
\phi(\bm{x}) = \phi_0L_0(\bm{x}) + \phi_1L_1(\bm{x}) + \phi_2L_2(\bm{x}) + \phi_3L(\bm{x})
$$



### 有限要素行列
対象$M$のある要素を$m$とする。


## 不完全コレスキー分解
そしてそれは$G^Tb=0$として表される。
これを確認することで方程式が事前によく解けるかどうかが判断できる。
