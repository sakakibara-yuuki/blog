---
title: 'solidjsのReactive System'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2025-10-20
tags: ["astro", "math"]
---

# Introduction
SolidjsにはReactivityを実現するために２つの要素がある。
一つは**Signals**もう一つが**Subscriber**である。
## Contents

## Signals
signalはReactive systemの中核を成すオブジェクトであり、要するにデータを保管する入れ物のようなものだ。
signalに対してGetter(Accecser)とSetterを用いて参照、更新を行える。

```typescript
const [count, setCount] = createSignal<number>(0);
```
`count`がgetter, `setCount`がsetterだ。

signalの中身を取り出す際にはgetterを用いて
```typescript
count()
```
のようにして取り出さなくてはならない。
(ここがReactとは違う)

**setterを呼び出すことでReactive Updateをトリガーすることができる。**
```typescript
setCount(1) // trigger on
```

> ところで、`setCount((prev) => prev + 1)`のような記述も見かける。
> 何が違うのかは
> - ![fine grained reactivity](./solidjs-reactivity.md)
> - ![react rendering](./react-fiber.md)
> を参照

## Subscriber

Subscriberはsignalとは別にSolidjsのReactive systemの中核を成す要素である。
名前の通り、**signalで管理されている値が更新されたかどうかを追跡し、最新の値になるように自動的にレンダリングする。**

Subscriberは基本的にObservationとResponseという２つの働きをする。
- Observatoin: signalを観測する。追跡中のsignalがトリガーされれば、Subscriberに通知され、それを拾うことができる。
- Response: signalの値の変化がトリガーとなり、UIの更新や外部関数の呼び出しなどが行われる。

Subsscriberとなる処理として
- コンポーネントの表示部分: `<div>{count}</div>`
- `createEffect`や`createMemo`

などがある。
```typescript
function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount((prev) => prev + 1);

  createEffect(() => {
    console.log(count());
  });
  // the `createEffect` will trigger the console log every time `count` changes.
}
```
たとえば、`createEffect`はSubscriberなので、後々incrementが呼ばれてsetCountでcount signalが更新されたときに`console.log`が呼ばれる。

<!-- ## 状態管理 -->
<!-- Reactなどで採用されていた`createState`をSignalとSubscriber、つまり、状態と購読に分けたことには意味がある。 -->
<!-- Signalはデータの保存と更新に、Subscriberはデータの変更に対応する。 -->
<!---->
<!-- これら一連のプロセスを **状態管理** と呼ぶ。 -->
<!-- 平たくいえば状態管理とはアプリケーションの状態を管理するプロセスである。 -->
<!---->
<!-- ### 変化の追求 -->

