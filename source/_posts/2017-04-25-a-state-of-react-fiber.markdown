---
layout: post
title: "React Fiber現状確認"
date: 2017-04-25 02:00:55 +0900
comments: true
categories: react.js
---

[F8](https://developers.facebook.com/videos/?category=f8_2017)でもReact Fiberについての発表もあったので、気になっている人も多いReact Fiberの現状について簡単に書きたいと思います。

Reactの完全な書き換えということで、使い方も変わってしまうと思っている人もいると思いますが、内部実装の書き換えであり、利用者から見える部分ではほとんど変更はありません。

もちろん、react-fiberというパッケージをインストールするというわけでもありません。

むしろ、`v16`の時点では現在の実装と互換性を保たれているので、`v16`がリリースされた時に、`v15.5`を使っていればほとんどそのまま`v16`に更新できると思います。
そして、言われなければ内部実装が変わっていることに気づかないのではないかと思います。


## とりあえずどうなるのか知りたい人向けのまとめ


- v16では、基本的にはv15の時と同じように動作します。逆に言うとパフォーマンスもそんなに変わらない（はず）です
- renderメソッドから`[<Foo />, <Bar />]` みたいに配列で返したり、文字列をReactElementでラップすることなく返せるようになります
- v17では、デフォルトで非同期のrendering（後述）になります。v16でも何らかのAPIでopt-inで試せるようにはなりそうです。現状は`ReactDOM.unstable_deferredUpdates`で一部試すことができます
- v17では、劇的に高速になるというよりは、ユーザーの入力をブロックしないようにしたり、柔軟に更新処理をスケジューリング出来るようになる予定です

## 注意点

**以下の情報は、Reactをただ使いたい人にとっては知る必要のない内部実装の話です。多くの人にとってはここまでの情報でReact FiberについてはOKだと思います。v17になるまでは。**

<!-- more -->

## Reactの構成

新しいFiberについて説明するために、まずは現状の実装について確認しましょう。
Reactのソースコードは下記のような構成になっています。


```
    src
    ├── fb
    ├── isomorphic
    │   ├── children
    │   ├── classic
    │   │   ├── class
    │   │   ├── element
    │   │   └── types
    │   ├── hooks
    │   └── modern
    │       ├── class
    │       └── element
    ├── renderers
    │   ├── art
    │   ├── dom
    │   │   ├── fiber
    │   │   ├── shared
    │   │   └── stack
    │   ├── native
    │   ├── noop
    │   ├── shared
    │   │   ├── fiber
    │   │   ├── hooks
    │   │   ├── shared
    │   │   ├── stack
    │   │   └── utils
    │   └── testing
    │       └── stack
    ├── shared
    │   ├── types
    │   └── utils
    └── test
    (テストなどの一部ディレクトリは省略)
```

上記の通り、Fiberは`renderers` の中にありrendererの1つであることがわかります。`fiber` と同列にある`stack` は現在の実装のrendererです。

`renderes/shared/` に`fiber` と`stack` のディレクトリがあって、`renderers/dom/` にも`stack` と`fiber` があります。rendererの中にはStackとFiberの2種類の実装があり、それぞれに対応するDOMやNativeなどの環境毎のrendererがさらにあるような構成になっています。

FiberやStackは、reconciliationと呼ばれる部分の役割を担っています。
reconciliationとは、ReactElementからComponentのインスタンスを生成したり差分を計算してHost(DOM)に反映したり、ライフサイクルメソッドの呼び出しといったことを行う部分です。
Hostに反映させる部分はHostが何かによっても異なり、反映方法もreconciliationによって異なるため、`renderers/dom/` 以下にもStackとFiberが存在します。

Hostとは各環境のことです。ブラウザー環境であればDOMであり、ReactNativeであればネイティブのビューとなります。

## Stack

それでは、まずは現在使われているStackのrendererについて簡単に触れます。
Stackは、ReactElementがツリー構造になるのと同様に、親から子、子から孫に処理を行っていきます。


{% img /images/posts/a-state-of-react-fiber/ReactDOM.png 'ReactDOM Stack' %}


上記では、`mountComponent` がどんどん入れ子になって呼ばれているのがわかります。
加えてこれは同期的に行われます。

つまり、トップレベルのComponentから再renderした場合、


- 子孫の全てのComponentに対するrender処理を行いReactElementのツリーを構築する
- 更新の場合は、前のReactElementツリーと比較を行う
- 差分をHostに適用する
- ライフサイクルメソッドの呼び出しなどを行う

という処理が同期的に処理されます。
そのため、例えば複雑なツリー構造を持っていて上記の処理に時間がかかる場合、UIを完全にブロックしてしまいます。

また、例えばアニメーションやユーザーのタイピングなど、即時に反映する必要のある処理を行っている時にサーバーから結果が返ってきた時を考えてみます。
Stackは全てが同期的に処理されるため、サーバーからの結果の反映処理が、アニメーションやタイピングの反映に割り込んでブロックしてしまうことも起きます。

これらは、単純なパフォーマンスのベンチマークでは現れない指標ですが、ユーザー体験という意味では重要です。

これらの問題を解決するためのものとしてReact Fiberはあります。

ちなみにStackに関連するソースは、v16のリリース時には削除されそうな感じではあります。

## Fiber

Fiberは、wikipediaによると「軽量な実行スレッド」とされています。

https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%90%E3%83%BC_(%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF)

React Fiberでは、Fiberの単位でreconciliationが行われます。
Fiberは、基本的には1つのReactElementと対応すると考えることができます。

厳密にはReactElementの単位とFiberが必ずしも一致するわけでありません。
さらにFiberは、`fiber.alternate` として自身をcloneしたFiberを持っており再利用されています。
ただ、考える上ではFiberをReactElementの単位でイメージするとわかりやすいと思います。

FiberはFlowの型で下記のように指定されています。

```js
    // 一部省略
    type Fiber = {
      tag: TypeOfWork,
      key: null | string,
      type: any,
      stateNode: any,
      return: Fiber | null,
      child: Fiber | null,
      sibling: Fiber | null,
      index: number,
      ref: null | (((handle: mixed) => void) & {_stringRef: ?string}),
      pendingProps: any, // This type will be more specific once we overload the tag.
      memoizedProps: any, // The props used to create the output.
      updateQueue: UpdateQueue | null,
      memoizedState: any,
      effectTag: TypeOfSideEffect,
      nextEffect: Fiber | null,
      firstEffect: Fiber | null,
      lastEffect: Fiber | null,
      pendingWorkPriority: PriorityLevel,
      progressedPriority: PriorityLevel,
      progressedChild: Fiber | null,
      progressedFirstDeletion: Fiber | null,
      progressedLastDeletion: Fiber | null,
      alternate: Fiber | null,
    };
```

- https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/ReactFiber.js

各プロパティについては解説しませんが、`return` や`child` や`sibling` など、他のFiberへの参照を持っていることがわかります。
FiberはLinked Listの構造になっています。Stackの場合はTree構造を掘り下げていくように処理をしていましたが、Fiberでは、`return` や`child` や`sibling` などをたどることで順番にReactElementを処理していきます。
そのことは、下記のスタックツリーを見てもわかります。


{% img /images/posts/a-state-of-react-fiber/ReactDOMFiber.png 'ReactDOM Fiber' %}


上記の通り、Stackのようにスタックがたくさん積まれていないことがわかります。

Stackでは処理が1つのツリーを単位として行われていましたが、FiberではFiberの単位で処理されます。Stackでは処理を同期的に行うしかできませんでしたが、FiberではこのFiberに対する処理をスケジューリングすることができます。

つまり、A → B → C とLinkedListを構成しているFiberがあった時に、A → B まで処理して中断し、またB → Cから処理を再開できます。
これはStackのような構造では難しいことです。
Generatorsだとどうでしょうか？それに対しては、[Sebastian Markbåge](https://github.com/sebmarkbage)が下記でGeneratorsを採用しなかった理由を書いているので興味のある人は見て見るといいと思います。

* https://github.com/facebook/react/issues/7942


### Fiberのスケジューリング

では、具体的にどのようにスケジューリングが行われるのかを見ていきます。

Fiberは、`beginWork` と`completeWork` と`commitWork` という3つのフェーズがあります。
beginWorkはcomponentのインスタンス化やrenderメソッドの呼び出し、shouldComponentUpdateなどによる比較を行います。


- https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/ReactFiberBeginWork.js

completeWorkは副作用を示すeffectTagを設定したり、Hostインスタンスを作成したりなどを行います。（末端のHostなどでのみ実行される）


- https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/ReactFiberCompleteWork.js

副作用は下記のように定義されています。

```js
    module.exports = {
      NoEffect: 0, //           0b0000000
      Placement: 1, //          0b0000001
      Update: 2, //             0b0000010
      PlacementAndUpdate: 3, // 0b0000011
      Deletion: 4, //           0b0000100
      ContentReset: 8, //       0b0001000
      Callback: 16, //          0b0010000
      Err: 32, //               0b0100000
      Ref: 64, //               0b1000000
    };
```

- https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/ReactTypeOfSideEffect.js

commitWorkでは、componentDid(Mount|Update)などのライフサイクルメソッドの呼び出しや、completeWorkで設定されたeffectTagに基づいてHostに結果を反映します。


- https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/ReactFiberCommitWork.js

この中で、beginWorkとcompleteWorkはFiber単位で実行されます。
commitWorkは、全てのFiberに対する処理が終わった後にまとめて実行されます。

例えば、下記のような構成のComponentがある場合、

```js
    Text = () => '...';
    List = () => [
      <div>...</div>,
      <div>...</div>,
      <div>...</div>,
    ];
    
    class App extends React.Component {
        render() {
            return (
                <main>
                <h2>...</h2>
                <p>...</p>
                <div>
                    <Text />
                    <List />
                </div>
                </main>
            );
        }
    }
```

下記のような流れで処理されます。


1. **beginWork** … (HostRoot)
2. **beginWork …**  `<App>` (ClassComponent)
3. **beginWork** …  `<main>` (HostComponent)
4. **beginWork, completeWork …**  `<h2>` (HostComponent)
5. **beginWork, completeWork …** `<p>` (HostComponent)
6. **beginWork …** `<div>` (HostComponent)
7. **beginWork …** `<Text>` (FunctionalComponent)
8. **beginWork completeWork …** '...' (HostText)
9. **beginWork …** `<List>` (Functional Component)
10. **beginWork, completeWork …** : `<div>` (HostComponent)
11. **beginWork, completeWork …** : `<div>` (HostComponent)
12. **beginWork, completeWork …** : `<div>` (HostComponent)
13. **commitAllWork …** (HostRoot)

React Fiberは、非同期renderingの場合には、後述する優先度が高くないものについてはrequestIdleCallback（サポートしてなければpolyfill実装）を使い、これらをスケジューリングして非同期に処理していきます。
requestIdleCallbackでは、アイドル時間を`timeRemaining`の関数から受け取ることができるため、この値を元に処理できる時間がなくなると再び`requestIdleCallback` に処理を登録して次のアイドル時間に処理するようになっています。
これにより、優先度が高くない処理がUIや他の処理をブロックしないようになっています。


- https://developer.mozilla.org/ja/docs/Web/API/Window/requestIdleCallback

下記はFiberを同期モードで実行した時のスタックです。
全てが同期的に行われていることがわかります。この間はUIを完全にブロックしてしまいます。

{% img /images/posts/a-state-of-react-fiber/ReactDOMFiber-sync.png 'ReactDOM Fiber Sync' %}

下記は同じ処理を非同期で実行したスタックです。
スタックが途切れ途切れになっていることがわかります。そのためUIをブロックしません。
右端にある細いスタックはcommitWorkによるものです。
Renderingの処理はcommitWorkの以降でだけ発生していることがわかります。


{% img /images/posts/a-state-of-react-fiber/ReactDOMFiber-async.png 'ReactDOM Fiber Async' %}


このとき、HostのViewに反映するといった副作用をこのbeginWork〜completeWorkの中で行わないというのは1つのポイントです。
例えば、Viewへの反映をこの非同期処理の中で行ってしまうと、Viewが部分部分更新される形になり、UIがガタガタしてしまいます。
React Fiberでは、commitWorkで全てのViewへの更新をまとめて行うため、このようなことは起こりません。
逆にcommitWorkの部分は時間がかかりやすくframeを落としてしまうこともあるためパフォーマンスチューニングが注意深く行われています。
componentDid(Mount|Update)もこの中で行われるため、この中で重い処理を行わないように注意が必要です。

余談ですが、上記のようにライフサイクルメソッドがボトルネックになる場面が想定されるため、ライフサイクルメソッドをPromiseを返す非同期なAPIとする案もあります。
あと、実はマウント時はcompleteWorkでもSideEffectが処理されています。これはマウント時にはまだHostContainerはDOMに追加されていないため追加しても表示されず問題ないためです。
これもcommitWorkでframeを落とさないための工夫の1つです。

また、上記のようなrequestIdleCallbackを使ったスケジュール以外にも、優先度に応じたスケジューリングも可能です。
優先度は下記のように定義されています。

```js
    export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;
    
    module.exports = {
      NoWork: 0, // No work is pending.
      SynchronousPriority: 1, // For controlled text inputs. Synchronous side-effects.
      TaskPriority: 2, // Completes at the end of the current tick.
      AnimationPriority: 3, // Needs to complete before the next frame.
      HighPriority: 4, // Interaction that needs to complete pretty soon to feel responsive.
      LowPriority: 5, // Data fetching, or result from updating stores.
      OffscreenPriority: 6, // Won't be visible but do the work in case it becomes visible.
    };
```

- https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/ReactPriorityLevel.js

更新処理に優先度を持たせることで、ユーザーインタラクションやアニメーションなどの更新処理を、APIレスポンスの反映など、優先度の低いタスクが邪魔しないようにすることができます。

下記はそれを表したサンプルです。「Async mode」の場合、5000個のlist itemは100ms毎に`LowPriority`で更新されます。「Sync mode」の場合は`SynchronousPriority`として同期的にレンダリングされます。

* https://koba04.github.io/react-fiber-resources/examples/

上にある入力フィールドに何か入力してください。「Async mode」の場合は入力中はlist itemが更新されず、入力も多少引っかかりますがスムーズに反映されます。「Sync mode」の場合は入力中もlist itemが更新されてユーザーの入力を邪魔してしまっています。

優先度の低い処理はrequestIdleCallbackを使ってアイドル時間がある時に、優先度の高い処理はrequestAnimationFrameを使うか同期的にASAPで反映されます。

優先度の低いタスクを実行中に、優先度の高いタスクが割り込んで来た場合、優先度の低いタスクは中断されて、優先度の高いタスクが先に行われます。
優先度の高いタスクが終了後、再び優先度の低いタスクが実行されます。
この際、割り込まれる前に優先度の低いタスクが実行していたFiberのうち、優先度の高いタスクが処理しなかったものは再利用されます。

このように、タスクの割り込みによっては複数回Fiberが処理されることがあるため、非同期のレンダリングの場合には、componentWillMountなどのライフサイクルメソッドが複数回呼び出されることがあります。componentDidMountなどはcommitWorkで呼ばれるため複数回呼ばれることはありません。

また、OffscreenPriorityというPriorityがあります。これを利用することで初回のレンダリングでは必要ない部分をプリレンダリングしたり、ダブルバッファリングが可能となります。ReactDOMでは、`hidden`属性のあるものはOffscreenPriorityとして扱われます。

他にもAnimationPriorityなどのPriorityがありますが、現時点ではまだPriorityを制御するようなAPIはないため、どのように利用するのかは見えていません。（facebook.comでの非同期レンダリングの実験をやりながらAPIを決めていくらしい）

その他の細かい挙動については、`ReactIncremental-test.js`のテストを見るとどんなことができるのかわかるかと思います。


- https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/__tests__/ReactIncremental-test.js

ここで使われている`ReactNoop` というrendererはテスト用のrendererです。UIは全く持っておらずテスト用に`timeRemaining` などが柔軟に制御可能であり、React Fiberの開発は初期の頃はこのrendererに対して行われていました。custom rendererを作る際の参考にもいいかもしれません。


- https://github.com/facebook/react/blob/master/src/renderers/noop/ReactNoop.js

## Error Boundary

あと、Fiber自体には直接関係ないですが、Error Boundaryの機能も公式にサポートされるようになりそうです。
Error Boundaryとは、これまでは子孫Componentのrender時にエラーが発生した場合は、何も表示されなくなってしまいましたが、Error Boundaryの機能を使うことで握り潰したりエラーハンドリングができるようになるものです。

```js
    class App extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                error: null
            };
        }
        // エラーハンドリングを定義する
        unstable_handleError(error) {
            this.setState({error});
        }
        render() {
            if (this.state.error) {
                return <div>エラーが発生しました</div>;
            }
            return this.props.children;
        }
    }
```


## CoroutineComponent

Fiberには`CoroutineComponent` や`CoroutineHandlerPhase` や`YieldComponent`といったComponentもあります。これはどうやら、親のComponentのレンダリングを途中で止めて、子のComponentからの結果を受けて親のComponentのレンダリングを再開するみたいなこともできるっぽいです（あんまりわかってない）。例えばレイアウトを行うComponentで子を実際にレンダリングしてみて、サイズなどの結果を持って親のComponentを再度レンダリングするみたいなことが、ユースケースとしてどこかで説明されていました。

これの動作については、上記であげた`ReactCoroutin-test.js` の中にあるので見てみるといいかと思います。状態としてはとりあえず動いてるっぽいという感じだとは思います。 


- https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/__tests__/ReactCoroutine-test.js

## Custom Renderer

Stackでは、Custom Rendererを作成するためにはハックが必要でしたが、React FiberではFlowによって型付けされているため、わかりやすくなりました。

```js
    export type HostConfig<T, P, I, TI, PI, C, CX, PL> = {
      getRootHostContext(rootContainerInstance: C): CX,
      getChildHostContext(parentHostContext: CX, type: T): CX,
      getPublicInstance(instance: I | TI): PI,
    
      createInstance(
        type: T,
        props: P,
        rootContainerInstance: C,
        hostContext: CX,
        internalInstanceHandle: OpaqueHandle,
      ): I,
      appendInitialChild(parentInstance: I, child: I | TI): void,
      finalizeInitialChildren(
        parentInstance: I,
        type: T,
        props: P,
        rootContainerInstance: C,
      ): boolean,
    
      prepareUpdate(
        instance: I,
        type: T,
        oldProps: P,
        newProps: P,
        rootContainerInstance: C,
        hostContext: CX,
      ): null | PL,
      commitUpdate(
        instance: I,
        updatePayload: PL,
        type: T,
        oldProps: P,
        newProps: P,
        internalInstanceHandle: OpaqueHandle,
      ): void,
      commitMount(
        instance: I,
        type: T,
        newProps: P,
        internalInstanceHandle: OpaqueHandle,
      ): void,
    
      shouldSetTextContent(props: P): boolean,
      resetTextContent(instance: I): void,
      shouldDeprioritizeSubtree(type: T, props: P): boolean,
    
      createTextInstance(
        text: string,
        rootContainerInstance: C,
        hostContext: CX,
        internalInstanceHandle: OpaqueHandle,
      ): TI,
      commitTextUpdate(textInstance: TI, oldText: string, newText: string): void,
    
      appendChild(parentInstance: I | C, child: I | TI): void,
      insertBefore(parentInstance: I | C, child: I | TI, beforeChild: I | TI): void,
      removeChild(parentInstance: I | C, child: I | TI): void,
    
      scheduleAnimationCallback(callback: () => void): number | void,
      scheduleDeferredCallback(
        callback: (deadline: Deadline) => void,
      ): number | void,
    
      prepareForCommit(): void,
      resetAfterCommit(): void,
    
      useSyncScheduling?: boolean,
    };
```

- https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/ReactFiberReconciler.js

実際に実装する際には、先ほど紹介した`ReactNoop` や、Test用のrendererでありReactElementからJSONを返す`ReactTestRenderer` や`ReactART` などが参考になると思います。


- https://github.com/facebook/react/blob/master/src/renderers/testing/ReactTestRendererFiber.js
- https://github.com/facebook/react/blob/master/src/renderers/art/ReactARTFiber.js

ただ、Reactはv16からFlat bundleになり、内部ライブラリーを`react/lib/xxx`のように利用出来なくなったので、Custom Renderer作る人向けに何かが提供されるのかは不明なところです。


## Server Side Rendering

サーバーサイドレンダリングについては、Facebookで使っていないということもあり後回しになっていて、まだ実装されていません。
ただ、今までの`renderToString` は完全に同期でしたが、ReactFiberになることでイベントループをブロックしないようにHTML文字列を生成することは簡単になりそうです（v16には入るかどうかは不明）。`renderToStream` みたいなのは、副作用はcommitWorkでまとめてやるというところからは外れてしまうのでどうなんでしょうね。


## v16でも非同期レンダリングを試したい


- 現時点では、`ReactDOMFeatureFlags` に`fiberAsyncScheduling` というフラグがあるので、それを無理やり`true` に書き換えることでデフォルトで非同期のレンダリングに出来ます。ただまだそんなにテストされていないと思うのでバグなどはありそうです
- または、`ReactDOM.unstable_deferredUpdates` を使うとその中の更新処理は`lowPriority` として処理されるため、非同期となります


## その他リソース

Fiberで何が嬉しいのかを知りたい人は、F8のTom OcchinoのTalkがとてもわかりやすいと思います。


- The Evolution of React and GraphQL at Facebook and Beyond
  - https://developers.facebook.com/videos/f8-2017/the-evolution-of-react-and-graphql-at-facebook-and-beyond/

Lin ClarkがReact ConfでCode Cartoonを使ってReact Fiberについて説明していたのもわかりと思います。

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZCuYPiUIONs?ecver=1" frameborder="0" allowfullscreen></iframe>


あとはSebastian MarkbågeのReact ConfのキーノートでもReact Fiberについて触れられています。

<iframe width="560" height="315" src="https://www.youtube.com/embed/bvFpe5j9-zQ?ecver=1" frameborder="0" allowfullscreen></iframe>

あとは、個人的にReact Fiberについてまとめたリポジトリもあります。

* https://github.com/koba04/react-fiber-resources


## で結局何が嬉しいの？

React Fiberに変わることで、よくフレームワークのパフォーマンス比較にあるようなベンチマークのスコアがよくなるといったことはおそらくないと思います。
React Fiberになることで、これまで同期的にツリーを処理していくしかなかったものが非同期に、より柔軟に処理出来るようになるのがメリットです。
これにより、アニメーションやユーザーのインタラクションに対して可能な限り早く反応出来るように出来ます。また、このような基盤としてReact Fiberがあるので、今後そういった機能追加が行われていくのではないかと思います。

というで、v16ではそんなに変わりませんが、今後の機能追加を楽しみにしましょう。
また、React Fiberの実装も勉強になるので興味のある人は是非読んでみてください。

ちなみにReact Fiberの最初のPRはこれのようですね。


- https://github.com/facebook/react/pull/6690


