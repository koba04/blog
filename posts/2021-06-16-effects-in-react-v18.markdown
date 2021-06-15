---
title: "React v18 での Effects に関する変更内容（予定）"
date: 2021-06-16 00:00:00 +0900
---

[The Plan for React 18](https://reactjs.org/blog/2021/06/08/the-plan-for-react-18.html) のブログで React v18 の計画が発表され、アルファもリリースされました。当初の計画からは色々と変わりましたが、順調に進めば今年中に v18 がリリースされそうです。

このアルファリリースは、React 関連のライブラリ作者に試してもらってフィードバックもらうことを目的にしているため、現時点でプロダクトのコードに導入することは推奨していません。
アルファリリースなのでまだまだ破壊的な API も予想されます。

## reactwg/react-18

フィードバックをもらう場所として、[reactwg/react-18](https://github.com/reactwg/react-18) という GitHub Discussions のためのリポジトリが作成されています。この Discussions は誰でも見ることはできますが書き込めるのは Collaborators になっている人のみです。そのため比較的議論の内容が追いやすい形になっています。

この Discussion の中で v18 での変更内容の計画が説明されているので興味ある人は読んでみるといいと思います。

**今の段階はまだまだ予定でこれから変わるものなので、v18 の変更内容だけを知りたい人は RC などのタイミングで出るであろうユーザー向けの記事を待つのがいいと思います。特に今の段階で頑張って追う必要はないと思います。**

既にトピックがいっぱいあるため、Discussion の中から個人的に気になったものを少し紹介します。

- [Introducing React 18 #4](https://github.com/reactwg/react-18/discussions/4)
    - 全体の概要になっている Discussion なのでこちらをまず最初に見て、そこから興味のあるトピックの Discussion を見ていくとよさそうです
- [Glossary + Explain Like I'm Five #46](https://github.com/reactwg/react-18/discussions/46)
    - Concurrency や Suspense、Hydration といった概念を 5 歳児にもわかるように説明する Discussion です。概念を理解するのに役立ちそうです
- [Pitfalls and surprises in data fetching #35](https://github.com/reactwg/react-18/discussions/35)
    - Concurrent APIs を使う場合に State 管理のライブラリはどのような点に気をつければいいのかについての Discussion です。 Tearing や `useMutableSource`、`<Cache />` と言った API について議論されています。
    - `<Cache />` についてはこちらでも議論されています。 [Built-in Suspense Cache #25](https://github.com/reactwg/react-18/discussions/25)
- [Replacing render with createRoot #5](https://github.com/reactwg/react-18/discussions/5)
    - 新しい `createRoot` API の使い方です
- [New Suspense SSR Architecture in React 18 #37](https://github.com/reactwg/react-18/discussions/37)
    - 新しい SSR の Architecture についてです。図もあってわかりやすいです。
    - 新しい SSR ではこれまでの API と違い、`pipeToNodeWritable` を利用します。
    - Event Replay なんかも仕組みも面白いですね。
- [What changes are planned for Suspense in 18? #47](https://github.com/reactwg/react-18/discussions/47)
    - 今回紹介されているものは、全てが v18.0 の時点で計画されているものではありません。どれが v18.0 でどれがそれ以降なのかを知るのに便利な Discussion です。
- [New feature: startTransition #41](https://github.com/reactwg/react-18/discussions/41)
    - すでに紹介されていますが、`startTransition` の API について知りたい人向けの Discussion です。
- [Automatic batching for fewer renders in React 18 #21](https://github.com/reactwg/react-18/discussions/21)
    - v18 からデフォルトで提供されるバッチ更新についての Discussion です。これまでは、`ReactDOM.unstable_batchedUpdates`で囲む必要があったのですがデフォルトで提供されるようになるので待望の変更ですね。特に非同期処理の結果を受けて同期的に複数回 State を更新するようなケースでは無駄な再 render が減ります。
-  [Planned changes to `act` testing API #23](https://github.com/reactwg/react-18/discussions/23)
    - テスト用の API である `act` の変更についてです。開発ビルドのみで動作するようになりますが、同期的にキューイングされている更新処理を flush してくれるようになり `await` が不要になるようです。
    - プロダクションビルドでテストしたい場合は、E2E になるため `act` に頼る必要はなく、開発ビルドに向けにすることで上記のような同期的な flush が可能になるとしています。

それぞれの内容については、機会があれば別記事として個別に説明していきたいと思います。

今回は Discussion で紹介されているものの中から Effects 系の変更について紹介したいと思います。
（**繰り返しですが、これはあくまで現在の予定で変更の可能性があることに注意してください**）

## useEffect, useLayoutEffect が複数回実行されるケース

関連 Discussion

- [How to support strict effects #18](https://github.com/reactwg/react-18/discussions/18)
- [Adding Strict Effects to StrictMode #19](https://github.com/reactwg/react-18/discussions/19)

[Adding Strict Effects to StrictMode #19](https://github.com/reactwg/react-18/discussions/19) では StrictMode に追加される "strict effects" のモードについて説明があります。

追加のモードのような形で実装されていますが現状では "strict effects" のみを opt-out する方法はないので StrictMode を実装すると一緒に有効になります。
"strict effects" が有効になると、マウント時の Effects が mount -> unmount -> mount のような形で実行されるようになります。
つまり `useEffect(effect, [])` or `useLayoutEffect(effect, [])` と書いた場合、

- `effect` が呼ばれる
- `effect` のクリーンアップ関数が呼ばれる
- `effect` が再び呼ばれる

という挙動になります。

つまり、`[]` を第二引数に指定していることで一度しか呼ばれないことを保証しているコードは壊れてしまうことになります。例えばマウントされたことをイベントとして送信しているようなケースです。

この挙動は `useEffect` or `useLayoutEffect` だけでなく Class Component のライフサイクルメソッドにも適用されるため、Class Component の場合には

- `componentDidMount` が呼ばれる
- `componentWillUnmount` が呼ばれる
- `componentDidMount` が再び呼ばれる

という挙動になります。

詳しい人だと Concurrent Rendering になった場合でも `useEffect` や `useLayoutEffect`、`componentDidMount`、`componentWillUnmount` は Commit Phase で呼ばれるため一回の更新処理に対して一度しか呼ばれないことは保証されるのでは考えると思いますが、そうではないケースがあるため今回 StrictMode に追加されています。
現状具体的なケースとして下記の二点が紹介されています。

**言い換えると、下記の部分以外ではこれまで通り一度しか呼ばれないということです。**

### Fast Refresh

Fast Refresh はページを再読み込みすることなくコンポーネントを更新するための機能で、Next.js や Create React App、React Native で既に利用されています。Fast Refresh でコンポーネントが差し替えられる場合、コンポーネントが持つ State は保持されたままコンポーネントの実装が差し替えられます。この際には `useEffect` などの Effect 関数は "strict effects" と同様に再度呼ばれます。

そのため、Next.js などを使ってアプリケーションを作っている場合には、開発時に既に "strict effects" と同じ挙動になっているケースがあります。
ただ、Fast Refresh は本番では使わない機能なので、そこまで気にしない人も多いと思います。

### Offscreen API

本番環境での影響のある機能としては Offscreen API があります。
この機能は名前も含めて最終的な API もまだ決まっておらず、v18.0 の時点では入らない予定の機能です。
以前は `<div hidden>` のような形で実装されていたため、それで認識している人もいるかもしれません。

Offscreen API に対する具体的な説明はなくまだ現状全体像は見えないですが、これまでに入っていたものとは異なる形になりそうです。
仮想リストの Viewport 外の要素に対して使ったり、タブでコンテンツを切り替えるようなページにおいて隠れているタブに対して使うことがユースケースとして紹介されています。例えとして `content-visibility` が紹介されているのでそれをイメージしておくといいかもしれません。
タブのケースにおいては、これまでのように親に状態をリフトアップして消えないようにするのではなく、Offscreen API を使うことで表示はされないけど状態を保持したままでいることができるようになるといった説明があります。つまりアンマウントするのではなく隠しておくことができる API なようです。

Offscreen API に対する挙動の説明として

> When a component is hidden– whether it’s in a tabbed container or a virtualized list– it is no longer visible in the DOM, just like if it was unmounted (removed) from the DOM. It isn’t actually unmounted (because we want to preserve the state) but from a user’s perspective they are the same.

https://github.com/reactwg/react-18/discussions/19#discussion-3385715

とあり、実際には DOM は削除されるのではなく隠されるけど、アンマウントされず状態などは保持され、次に表示される時にはマウント時の Effect が呼ばれるということなのかなと思います。

ちなみに以前の Offscreen API では Suspense と同様に `display: none;` を指定すること非表示にされていました。

[ReactDOMHostConfig#hideInstance の実装](https://github.com/facebook/react/blob/9212d994ba939f20a04220a61e9776b488381596/packages/react-dom/src/client/ReactDOMHostConfig.js#L631-L641)

また、別のコメントでは、

> We haven't started on the API yet, but you would render a tree wrapped in something like `<Offscreen visible={false} />` to pre-render it. That means we would render the tree at a lower priority that what's visible, but wouldn't fire any effects. When the user navigates to it, you could make it visible and we would just need to show what was rendered and mount all of the effects for the first time.

https://github.com/reactwg/react-18/discussions/19#discussioncomment-798356

とあり、`<Offscreen visible={false} />` の中では最初はレンダーはされるけど visible ではなく、Offscreen が visible になったタイミングで初めて最初の Effect が呼ばれることが想定されているようです。

ただ、まだリサーチ段階だとコメントしている通り、この辺りはまだまだ変わりそうです。

`useEffect` の中の処理が一度しか呼ばれないことを保証したい場合は、サンプルで紹介されているように `useRef` を使って呼ばれたという状態を管理するのがいいと思います。

```jsx
const didLogRef = useRef(false);

useEffect(() => {
  // In this case, whether we are mounting or remounting,
  // we use a ref so that we only log an impression once.
  if (didLogRef.current === false) {
    didLogRef.current = true;

    SomeTrackingAPI.logImpression();
  }
}, []);
```

https://github.com/reactwg/react-18/discussions/18#discussion-3385714

**まとめとしては、「Offscreen などの API を使わない限り本番環境で問題になることはないが `useEffect` や `useLayoutEffect` の第二引数に空配列を指定することで一度しか呼ばれないことを保証するのは将来的に壊れる可能性がある」ということです。**

## Suspense 内で useLayoutEffect が複数回実行されるケース

関連 Discussion

- [Changes to Suspense effects semantics #31](https://github.com/reactwg/react-18/discussions/31)
- [How to support strict effects #18](https://github.com/reactwg/react-18/discussions/18)

上記の `useEffect` に対する挙動の変更とは別に `useLayoutEffect` に対する変更もあります。

Suspense boundary の中のコンポーネントが `useLayoutEffect` を持っている場合、Suspense の fallback UI の表示、resolve のタイミングでそれぞれ `useLayoutEffect` のクリーンアップ関数、と `useLayoutEffect` が呼ばれるようになります。
また `componentDidMount` と `componentWillUnmount` も同様に呼ばれます。

下記のようなコンポーネントがあった場合に、

```jsx
<Suspense fallback={<Spinner />}>
  <Component />
</Suspense>
```

- Suspense の中身が通常通り表示
    - → `<Component />` の `useLayoutEffect` or `componentDidMount` が呼ばれる
- `<Component />` の中から Promise が throw されて、fallback UI (`<Spinner />`) が表示
    - → `<Component />` の `useLayoutEffect` のクリーンアップ関数 or `componentWillUnmount` が呼ばれる
- `<Component />` から throw された Promise が resolve して再レンダー
    - → `<Component />` の `useLayoutEffect` or `componentDidMount` が呼ばれる

**つまり、Suspense の中では `useLayoutEffect(cb, [])` した場合でも複数回呼ばれることがあります。**

ただし、`useLayoutEffect` の場合は DOM 操作をしてクリーンアップ関数で後始末するという実装になっているケースが多いので特に問題ないんじゃないかなと思います。
また、`useTransition` の API もあるため、そもそも再び Suspense の fallback に戻ることはそんなにないというコメントもあります。

## まとめ

現在はまだアルファ版でまだまだ決まってないことも多くこれから変わっていくことが予想されますが、現時点で出ている情報を元に Effect 周りの変更点について書きました。

いよいよ [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) などで繰り返し言及されているようにコンポーネントに対するライフサイクルという考え方から、レンダリングに対する副作用を定義するというメンタルモデルの変換が必要だなと感じます。

他にも興味深い変更が v18 にはあるので別途書きたいなと思っています。
