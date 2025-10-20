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

逆に注意すべきなのが
```typescript
function ThemeProvider() {

  ...

  const themeStyle = {
    'dark-theme': $theme() == Theme.dark,
    'light-theme': $theme() == Theme.light,
    'theme-container': true
  }

  return <div classList={themeStyle}>
}
```
では`$theme()`が変化した際にそのコンポーネントは更新されず、

```typescript
function ThemeProvider() {

  ...

  return (
    <div classList={{
      'dark-theme': $theme() == Theme.dark,
      'light-theme': $theme() == Theme.light,
      'theme-container': true
    }}>
  )
}
```
のようにしなければ更新されないということだ。
これは`themeStyle`の代入文がsubscriberではないことに起因する。

ちなみにこれを回避する手段として以下が考えられる。
```typescript
function ThemeProvider() {

  ...

  const themeStyle = createMemo(() => {
    'dark-theme': $theme() == Theme.dark,
    'light-theme': $theme() == Theme.light,
    'theme-container': true
  })

  return <div classList={themeStyle}>
}
```

これはつまり、`themeStyle`の代入操作の前にsubscriberを呼び出すことで`themeStyle`を更新するようにしている。


## 状態管理
状態管理はアプリケーションの状態を管理するプロセスである。
このプロセスにはデータを貯めたり更新したり、データの変化に対応したりすることを含む。
solidjsでは状態管理はsignalとsubscribersを通して行われる。
signalはデータを貯めたり更新したりすることに使われ、subscriberはそのデータの変化に対応したりすることに使われる。

### 変化の追跡
変換の追跡はデータの更新を監視することや、その更新に対応することを含む。
これはsubscriberを通して行われる。

**signalが追跡スコープ内でアクセスされていないとき、signalの(中身の)更新は(reactiveな)更新をトリガーしない。**

これはsignalが追跡されていないことが原因で、signalがその変化をどのsubscriberにも通知できないためである。

ここで、追跡スコープとは後で述べるがJSXやcreateEffectなどで使われるスコープである。

```typescript
const [count, setCount] = createSignal(0);

console.log("Count:", count());

setCount(1);

// Output: Count: 0

// `count` is not being tracked, so the console log will not update when `count` changes.
```

初期化は一度きりのイベントであるため、signalが追跡スコープの外からアクセスされると、signalはトラックされない。
signalをトラックするとき、subscriberのスコープでアクセスする必要がある。
effectsのようなReactive primitivesがsubscriberを作るために使われる。

```typescript
const [count, setCount] = createSignal(0);

createEffect(() => {
  console.log("Count:", count());
});

setCount(1);

// Output: Count: 0
//         Count: 1
```

### UIの更新
solidアプリケーションのUIはJSX, TSXを使って構築される。
**JSXは裏で追跡スコープを作成し、コンポーネントのreturn文の中でsignalを追跡できるようにする。**

```typescript
function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount((prev) => prev + 1);

  return (
    <div>
      <span>Count: {count()}</span>{" "}
      {/* ✅ will update when `count()` changes. */}
      <button type="button" onClick={increment}>
        Increment
      </button>
    </div>
  );
}
```

他の関数と同様にコンポーネントは一度だけ実行される。
つまり、もし、signalがreturn 文の外からアクセスされた場合、初期化時に実行されるが、signal(の中身)が更新されても(UIの)更新は行われない。

```typescript
function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount((prev) => prev + 1);

  console.log("Count:", count()); // ❌ not tracked - only runs once during initialization.

  createEffect(() => {
    console.log(count()); // ✅ will update whenever `count()` changes.
  });

  return (
    <div>
      <span>Count: {count()}</span>{/* ✅ will update whenever `count()` changes. */}
      <button type="button" onClick={increment}>
        Increment
      </button>
    </div>
  );
}
```


## 同期 vs 非同期
Reactive systemはデータの変更に応答するように設計されている。
応答にはsystemの性質によって即座にするもの、遅れてするものがある。
しばしば、その２つの選択はアプリケーションの要求やタスクが持つ性質に依存する。

## 同期 reactivity
同期reactivity はSolidのデフォルトのreactivity モードであり、systemは変更に直接的かつ直線的に対応する。
signalが変化したとき、対応するsubscribersは即座に順番に更新される。

同期reactivityを使うと、systemはわかりやすいな方法で変更に対応することができる。
これは更新の順序が重要であるようなシナリオで便利である。
例えば、subscriberが他のsignalに依存していて、subscriberが依存しているsignalの後で更新されることが重要な場合である。

```typescript

const [count, setCount] = createSignal(0);
const [double, setDouble] = createSignal(0);

createEffect(() => {
  setDouble(count() * 2);
});
```
この例では、`double` signalは常に`count`の後で同期的な反応によって更新される。
これによって最新の`count`で`double`が常に最新であることが保証される。


