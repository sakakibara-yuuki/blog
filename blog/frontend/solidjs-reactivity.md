---
title: 'fine-grained reactivit'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2025-10-20
tags: ["astro", "math"]
---

# Introduction
## Contents
## Fix Task
## Section1
React の “update queue + 再レンダー” モデルと、SolidJS の “fine-grained reactivity（細粒度リアクティビティ）” モデルを、構造レベルで比較していきましょう。

---

## TLDT;

| 観点                           | **React**                  | **SolidJS**                                    |
| :--------------------------- | :------------------------- | :--------------------------------------------- |
| 更新モデル                        | **バッチ処理＋再レンダー**            | **リアクティブ依存関係の自動伝播**                            |
| `setState(fn)` の意味           | 「更新要求をキューに積み、後で再計算する」      | 「信号（signal）値を即座に更新し、依存している計算を再実行」              |
| 更新のタイミング                     | **非同期**（次のレンダーサイクルで処理）     | **同期的に即時反映**（Signal更新時に反応）                     |
| コンポーネント再レンダー                 | stateが変わると**コンポーネント全体再実行** | 依存しているDOMや計算部分だけ再実行（**部分更新**）                  |
| `setState(prev => prev + 1)` | 関数はキューに保存され、後で実行される        | `setCount(count() + 1)` と書く、即座に評価される（そもそも関数不要） |

---

## Reactの仕組み

Reactのstate更新はこう動きます：

1. `setCount(x)` or `setCount(prev => prev + 1)` を呼ぶ → **更新キューに積まれる**
2. Reactが「次のレンダー」でキューを処理
3. 新しいstateを計算し、コンポーネントを**再レンダー**

つまり：

* Reactは**バッチ的（遅延的）**
* 更新時点では**まだstateは変わらない**
* **再レンダー**によってUIが更新される

---

## SolidJSの仕組み

### Solidの基本メカニズム

```jsx
import { createSignal } from "solid-js";

const [count, setCount] = createSignal(0);

setCount(count() + 1);
```

#### 内部的には：

* `createSignal` は getter/setter を作る：

  ```js
  let value = 0;
  const subscribers = new Set();
  function read() { registerDependency(subscribers); return value; }
  function write(newValue) {
    value = newValue;
    subscribers.forEach(fn => fn()); // ← 依存する計算を再実行
  }
  return [read, write];
  ```
* `count()` を読むと、**依存関係が登録される**（どの計算がこの値を使っているかを記録）。
* `setCount()` を呼ぶと、**即座に値が変わり**、依存している部分（DOM更新関数など）だけが再実行される。

これが「**fine-grained reactivity（細粒度リアクティビティ）**」と呼ばれる仕組みです。

---

## 「評価タイミング」の違い（React vs Solid）

| 振る舞い                         | React                         | SolidJS                                            |
| :--------------------------- | :---------------------------- | :------------------------------------------------- |
| `setCount(count + 1)`        | 値が即評価されるが、stateは次レンダーまで反映されない | 即座に実行・反映される（signal内部の値が変わる）                        |
| `setCount(prev => prev + 1)` | 関数がキューに保存され、Reactがstate更新時に実行 | 関数版は通常不要。Signalは即更新なので `setCount(count() + 1)` で十分 |
| 更新伝搬                         | 次レンダーで一括                      | 即座に依存箇所へ伝搬（同期的）                                    |

Solidでは「**setCountを呼んだ瞬間に値が変わる**」。
Reactでは「**setCountを呼んだ瞬間には値は変わらない（次のレンダーで反映）**」。

---

## なぜSolidでは再レンダーが要らないのか？

Reactは「**コンポーネント関数を再実行して仮想DOMを再生成**」するアーキテクチャ。
一方、Solidは「**リアクティブグラフを構築して、依存箇所だけ再計算**」する仕組み。

つまり：

* React: 「state変わった → 全体再描画 → 差分計算 → DOM反映」
* Solid: 「signal変わった → 関連するDOM更新関数だけ再実行」

だからSolidは「**超高速で、評価タイミングが直感的（同期的）**」。

---

## 実例で見る違い

```jsx
// React
const [count, setCount] = useState(0);
setCount(count + 1);
console.log(count); // ← まだ古い値（非同期更新）
```

```jsx
// SolidJS
const [count, setCount] = createSignal(0);
setCount(count() + 1);
console.log(count()); // ← 新しい値（同期的に更新済み）
```

Reactでは「まだ更新されていない」。
Solidでは「もう更新されている」。

---

## Reactでいう“キュー”はSolidには存在しない

React:

* `setState()` 呼び出し → update queue に積まれる
* 次レンダー時に順に処理（`updater(prevState)` 関数もここで実行）

Solid:

* `setSignal()` 呼び出し → 値を即変更し、依存ノード（effect, memo, DOM更新など）を**逐次再評価**
* 再レンダー概念自体が存在しない

---

## まとめ

| 特性                               | React                   | SolidJS                     |
| :------------------------------- | :---------------------- | :-------------------------- |
| アーキテクチャ                          | Virtual DOM + 再レンダー     | Fine-grained reactive graph |
| 更新モデル                            | 非同期・バッチ                 | 同期・即時                       |
| 更新粒度                             | コンポーネント単位               | 変数単位（signal単位）              |
| 計算モデル                            | `setState`キューを解決して再レンダー | signal → effect 依存グラフを自動伝搬  |
| `setCount(prev => prev + 1)` の意味 | 更新を遅延登録して後で実行           | 不要。即評価されるため常に最新値を扱える        |
| パフォーマンス戦略                        | Virtual DOM diff        | 依存関係追跡による最小限再実行             |


Reactは「宣言的で汎用的なUIモデル」で、**状態変化を再描画に変換するフレームワーク**。
Solidは「リアクティブシステム」で、**依存グラフ上の伝搬を最適化するライブラリ**。

だから、
Reactの「関数形式アップデート」みたいな概念自体がSolidでは**不要**なんです。
Solidでは`setCount(count() + 1)`だけで十分安全。

