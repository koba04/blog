---
layout: post
title: "React v16.3 changes"
date: 2018-04-04 15:25:23 +0900
comments: true
categories: react.js
---

React v16.3.0 がリリースされました。

**※4/4 にバグフィックスを含む v16.3.1 がリリースされています**

このバージョンでは、基本的には v17 で有効化される非同期レンダリングへの対応が中心になっています。変更点は多いですが、ほとんどが機能追加であり破壊的な変更はないため、v16.2 から v16.3 へのアップグレードは比較的簡単じゃないかなと思います。

https://reactjs.org/blog/2018/03/29/react-v-16-3.html

<!-- more -->

当初の予定からはかなり延びたため、直前に発表された React Suspense の機能も入れるのかと思いましたが入りませんでした。まだ最終的な API は決まってないようなので今後に期待。
React Suspense については、v16.3 と関係ないので今回は省略します。

https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html

---

長いので 3 行で知りたい人向けのまとめ

* v16.3 は、v17 移行で有効になる非同期レンダリングに移行するための機能追加が中心で、このバージョンでの破壊的な変更はない
* ライフサイクルメソッドの変更、新しい Ref の API と Context の API が入る
* StrictMode の Component、`react-lifecycles-compat` 、`react-is`、`create-subscription`パッケージが追加された

---

それでは、大きな変更だけ見ていきたいと思います。

## Lifecycle Methods

もっとも大きな変更は、将来のライフサイクルメソッドの変更に備えて新しいライフサイクルメソッドが追加されたことです。

ただ実際には、v16.3 の段階では破壊的な変更はありません。ライフサイクルメソッドの変更は下記のようなスケジュールで適用されます。

{% img /images/posts/react-163-changes/lifecycle-methods.png 'React Lifecycle Methods Changes' %}

上記を見てわかる通り、v16.3 の段階では新しい`static getDerivedStateFromProps` と `getSnapshotBeforeUpdate` と`UNSAFE_xxx`メソッドの追加のみです。
`UNSAFE_xxx` のメソッドは既存実装の Alias で今のところ、削除される予定は決まっていません。したがって、他のメソッドへのマイグレーションが難しい場合にはとりあえず使い続けることも可能です。
`UNSAFE_`の prefix がついていないメソッドは、v16 系のマイナーリリースの中で警告が出るようになって、v17 系のリリースで削除されます。（React では Breaking Change をするときは、前のバージョンで警告を出すようになっています）この警告は、当初は v16.4 のリリースと計画されていたのですが最新のブログでは v16.x となっています。

ちなみに、この後で紹介する`react-lifecycles-compat`というライブラリを使うことで、新しく追加された static getDerivedStateFromProps や getSnapshotBeforeUpdate を使った Component でも古いバージョンの React をサポートすることが可能です。

### なぜこれらのライフサイクルメソッドが廃止されるのか？

React は v16 で React Fiber と呼ばれる実装に内部実装が書き換えられましたが、v16 系ではこれまでのバージョンと互換性のある挙動をするようになっています（同期的）。
v17 では、ここの挙動がデフォルトで変更されます。その際、Render Phase と Commit Phase のうち、Render Phase の方は非同期で処理され、さらに何度も呼ばれる可能性があります。

Render Phase はインスタンスを作ったり差分を計算するいわゆる副作用のない部分です。Commit Phase は、Render Phase の結果を元に実際に DOM などの Host 環境に適用する Phase で、同期的に処理されます。

そのため、Render Phase で呼ばれるライフサイクルメソッド（componentWillMount, componentWillReceiveProps, shouldComponentUpdate, componentWillUpdate）のうち shouldComponentUpdate 以外は、安全性を保証できないため廃止されることになりました。

`UNSAFE_`という prefix が付いた形では残りますが、前述した通り、これらのメソッドは何度も呼ばれる可能性があるため、副作用のある処理を行う場合には注意が必要です。例えば、イベントの登録・解除の処理など、1 対 1 で結びついていることを期待する処理を componentWillMount と componentWillUnmount を組み合わせて行った場合、1 対 1 であることが保証されないため壊れる可能性があります。この場合は、Commit Phase で実行される componentDidMount と componentWillUnmount を組み合わせて使う必要があります。

これらの話は、以前にも書いたのでそちらを参照してもらうとイメージ出来ると思います。（Render Phase という名前は最近使われるようになったので、参照先では、beginWork〜completeWork として書かれている部分です）

* http://blog.koba04.com/post/2017/04/25/a-state-of-react-fiber/
* https://speakerdeck.com/koba04/react-v16-and-beyond-react-fiber
* https://speakerdeck.com/koba04/capability-of-react-fiber

前述した通り、非同期レンダリングの世界では、更新処理の割り込みにより様々なタイミングで Render Phase が複数回実行されます。そのため、React が管理する Props や State 以外のインスタンスが持つ状態を保証するのが難しくなります。そのため、この後紹介する componentWillReceiveProps の代わりと使われることが想定される getDerivedStateFromProps は、static メソッドになっています。

将来的には、Class による Component API とは違う、React が管理する State など以外の状態を持つことができない Component を作成する新しい API も計画されているようです。（つまりクラスではない Stateful Functional Component のような?）

shouldComponentUpdate については、基本的にはこのような副作用が書かれていることはないということと影響の大きさから、残されたのかなと思います。将来的に static なメソッドになる可能性はあるかなと思います。

### `static getDerivedStateFromProps(nextProps, prevState)`

Render Phase で呼ばれます。タイミングとしては、新しい Props が渡された場合に、componentWillReceiveProps と同じタイミングで呼ばれます。
componentWillReceiveProps と違い、更新時だけでなくマウント時にも呼ばれます。

引数として新しい Props と現在の State を受け取ります。このメソッドで返した値は現在の State の値とマージされます。つまり受け取った Props を元に State の値を更新したいような場面で使います。返した値が State の値とマージされるというのは、setState の挙動と同じです。

componentWillReceiveProps と違い static になっているのは、前述した通り Render Phase でいつ呼ばれてもいいように、Props と State 以外の状態に依存させないためです。

State を更新する必要がない時は、`null`を返します。

実際に使おうとすると prevProps が取得出来ないのを不便に感じるのですが、下記の理由から prevProps を渡さないようになったとのことです。ドキュメントでは、prevProps が欲しい場合は、State として保存することが推奨されています。

* getDerivedStateFromProps はマウント時にも呼ばれ、マウント時は prevProps は`null`になるので、prevProps を使おうとする`null`かどうかのチェックが常に必要になってしまう
* prevProps を渡さないことで、メモリ常に保持しておく必要がなくなるので将来的に最適化が可能になる

あんまりいい例が思いつかなかったのですが、getDerivedStateFromProps の例はこんな感じ。

```js
static getDerivedStateFromProps(nextProps, prevState) {
  // カテゴリが変わったらデータをリセット
  if (nextProps.category !== prevState.category) {
    return {
      data: null,
      category: null,
    }
  }
  return null;
}
componentDidUpdate() {
  if (this.state.category == null) {
    fetchData(this.props.category).then((data) => {
      this.setState({category: this.props.category, data});
    });
  }
}
```

### `getSnapshotBeforeUpdate(prevProps, prevState)`

Commit Phase で呼ばれます。したがって、Render Phase で呼ばれる componentWillUpdate と違い、更新前に必ず一度だけ呼ばれることが保証されます。

用途としては、スクロール位置など Host 環境(DOM)の更新前後の値を比較して何かしたい場合に使います。これまでは、componentWillUpdate でインスタンスプロパティに保存して、componentDidUpdate でそれを参照し比較していたのを、componentWillUpdate の代わりに getSnapshotBeforeUpdate を使います。
getSnapshotBeforeUpdate では、名前の通り snapshot を返します。
snapshot はどんな値でもよく、上記の場合はスクロール位置を snapshot として返します。

getSnapshotBeforeUpdate で返した snapshot は、componentDidUpdate の第 3 引数として渡されます。したがって componentDidUpdate の中では、snapshot と現在の値を比較できます。

ちなみに getDerivedStateFromProps も getSnapshotBeforeUpdate も長くて覚えにくい名前だと思いますが、これはこれらのライフサイクルメソッドは頻繁に使うようなものではないため、あえてそういう名前にしたという話もあります。（名前決める議論の中でそんなことを言っていた記憶がないので本当かは不明）

例として、タイムラインのようにどんどん先頭に要素が追加されていく状態で、表示されている要素を維持し続けるために更新前のスクロール位置を保持して、追加された要素分位置を調整する例はこんなイメージ。

```js
getSnapshotBeforeUpdate() {
  const body = document.body;
  return {
    scrollHeight: body.scrollHeight,
    scrollTop: body.scrollTop
  };
}
componentDidUpdate(prevProps, prevState, snapshot) {
  const body = document.body;
  body.scrollTop = snapshot.scrollTop + (body.scrollHeight - snapshot.scrollHeight);
}
```

### Migration paths

今回のライフサイクルメソッドの変更で影響のありそうなパターンについては、下記のブログで丁寧に触れられているので、移行作業をする際には確認することをオススメします。

https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples

以下、簡単に紹介しておきます。

* Initializing state
  * State の初期化を componentWillMount で初期化を行なっていた場合は、constructor に移動させることが出来ます
* Fetching external data
  * 外部リソースの取得を componentWillMount で行なっていた場合は、componentDidMount で行うようにします。
  * ただ、この辺りは将来的には React Suspense で置き換えることを想定しているようです。SSR 時の外部リソースの取得についても言及されているので、React Suspense は SSR の時にもうまく動作するようになるのかもしれないですね。（既存の SSR の Renderer は Fiber ベースではないのでどう実装するのかは不明ですが…）
* Adding event listeners (or subscriptions)
  * componentWillMount で行なっていたイベントの購読については、componentDidMount で行うようにします。
  * 一点注意点としては、componentWillMount は親 → 子の順番で呼ばれますが、componentDidMount は子 → 親の順番で呼ばれます。そのため、親の componentDidMount でイベントの購読を行う場合、子の componentDidMout 発行されたイベントについては購読出来ません（子がイベントを発行していた時点で、親はまだイベントを購読してないため）。
  * イベントの処理については、後述する`create-subscription`を使う方法もあります。
* Updating state based on props
  * componentWillReceiveProps で新しい Props の値をもとに State の値を更新していたような場合は、static getDerivedStateFromProps を代わりに使います。
* Invoking external callbacks
  * State が変更されたタイミングで何かコールバックを実行したいような場合は、componentWillUpdate ではなくて、componentDidUpdate を使います。
* Side effects on props change
  * Props の変更に応じて何か副作用を呼び出したい場合は、componentWillReceiveProps や componentWillUpdate ではなく、componentDidUpdate を使います。
* Fetching external data when props change
  * Props の変更に応じて外部リソースをフェッチしたい場合には、static getDerivedStateFropProps でデータをリセットして、componentDidUpdate でデータをフェッチする方法が推奨されています。（componentDidUpdate で呼ばないと何度もリクエストが投げられる可能性があります）
* Reading DOM properties before an update
  * 更新前の DOM の状態を取得して更新後の値と比較したい場合は、getSnapshotBeforeUpdate で取得した値を返して、componentDidUpdate の第 3 引数として受け取ります。

ライフサイクルメソッドについての公式のドキュメント

https://reactjs.org/docs/react-component.html#the-component-lifecycle

## createRef API

新しい Ref に対する API です。`React.createRef()`で作成した変数を ref に設定します。簡単ですね。

```js
const ref = React.createRef();
<button ref={ref} />;
```

注意点としては、上記の場合、button 要素は ref の変数に入っているのではなく、`ref.current`に入っています。したがって上記の場合、focus をあてたい場合には`ref.current.focus()`とします。

これまでは、文字列とコールバックを使った Ref 指定が可能でした。文字列を使った Ref は、利用者としては単純でわかりやすいですが、Owner コンテキストで評価されるなど内部の実装としても好ましくない部分があったり、最適化や静的型チェックが難しいという問題がありました。そのため、ずっと廃止予定とアナウンスされていて、今回それに変わる`React.createRef()`が登場したため、廃止されることが決定しました。（どのバージョンで廃止されるのかはまだ未定です）

コールバックを使った Ref 指定はそのまま残るので、コールバックで指定しているものはそのままで問題ありません。実際 Functional Component の中でただ focus を当てたいような場合には、ref の参照を保持しておく必要がないので、コールバックで処理した方が便利です。

```js
const Text = () => <input ref={el => el && el.focus()} />;
```

公式のドキュメント

https://reactjs.org/docs/refs-and-the-dom.html

## forwardRef API

主に HOC でラップされた Component に対して Ref を指定した場合に使います。

`React.forwardRef((props, ref) => <Component {…props} ref={ref} />)`のような形式にすることで、指定された ref を引数として受け取ることが出来るようになるので、そのまま子の Component の ref に指定できます。

Ref は Props と違い伝播させることができなかったので、これまでは、componentRef のような Props として渡す必要があったのですが、これを使うことで、ref として渡すことができるようになります。

Ref で子の Component を参照することが自体が避けるべきことではあるので、そんなに用途はないように思いますが…。

無理やり例を考えて見ると、HOC でラップした Component に対する ref を指定したい場合、

```js
const withColor = Component => color => ({buttonRef, ...props}) => (
  <Component {...props} color={color} ref={buttonRef} />
);

const TomatoButton = withColor(Button)('tomato');

const App = () => (
  <div>
    <!-- buttonRefとして渡す必要がある -->
    <TomatoButton id="foo" buttonRef={button => button && button.focus()} />
  </div>
);
```

https://codepen.io/koba04/pen/dmKyNd?editors=0010

のように`buttonRef`などのように Props の一部として渡す必要があったのが、

```js
const withColor = Component => color => React.forwardRef((props, ref) => (
  <Component {...props} color={color} ref={ref} />
));

const TomatoButton = withColor(Button)('tomato');

const App = () => (
  <div>
    <!-- refとして渡すことが出来る -->
    <TomatoButton id="foo" ref={button => button && button.focus()} />
  </div>
);
```

https://codepen.io/koba04/pen/pLKobo?editors=0010

のように`React.forwardRef`を使うことで、直接 Component を利用する時のように ref として指定出来るようになります。

公式のドキュメント

https://reactjs.org/docs/forwarding-refs.html

## Strict Mode

新しい Component です。Component なので、`<React.StrictMode>…</React.StrictMode>`のように利用します。
Strict Mode の Component 自体は何も UI を描画せず、後述するチェックも development 環境の場合のみチェックするので、本番環境のコードに含めたままでも問題ありません。

`<StrictMode>`で囲まれた Component の中では、廃止予定の API や問題になりそうな使い方をチェックして問題を検出してくれます。現時点では、下記のようなチェックが行われています。

* Identifying components with unsafe lifecycles
  * componentWillMount や componentWillReceiveProps や componentWillUpdate などの廃止予定の API を使用していないかをチェックして、見つかった場合にはコンソールに出力します。
* Warning about legacy string ref API usage
  * 文字列を使った ref 指定をチェックして、見つかった場合にはコンソールに出力します。
* Detecting unexpected side effects
  * 非同期レンダリングが有効になった場合をシミュレートすることで、非同期レンダリングが有効になった時に問題となる副作用のあるコードがないかを検出します。ただし、副作用のあるコードがあるかどうかを検出することはできないので、Strict Mode では、下記の API が意図的に 2 回呼ばれるようになります。
    * constructor
    * render メソッド
    * setState の第 1 引数に指定する関数
    * static getDerivedStateFromProps
  * これにより、完璧ではないですが、複数回呼ばれると壊れるような副作用のある実装をできることを期待しています。

ちなみに、なぜ`React.strictMode = true`のようになっていないのか疑問に思うかもしれませんが、Component の形式になっていることでアプリケーションの一部だけチェックすることが出来るようになります。これは Facebook が 50,000 以上の Component を持っていることから来ているマイグレーションの戦略かなと思います。

## New Context API

長くなってきたのでここからは簡潔に...。

API の変更があるとずっと予告されていた Context の新しい API です。

既存の Context も少なく v16 系ではサポートされ続けます。既存の Context は、`react-redux`や`react-router`などのライブラリが内部で使っているので、多くの人に関係あるといえばある変更です。これらのライブラリがどのように対応するのかは、issue などで議論は行われていますがまだ不明です。

* https://github.com/reactjs/react-redux/pull/898
* https://github.com/ReactTraining/react-router/pull/5908

また最近軽量な Redux 風なライブラリが増えているのはこの Context API の影響もあると思います。

* https://github.com/jamiebuilds/unstated

今回の New Context API は正式な機能としてリリースされましたが、Context を abuse するのではなく、Props を使ってデータのやりとりをするのが基本であるのは変わりません。テーマや言語のような様々な場所、階層で利用されるようなものや Flux の Store など本当に必要な部分のみで利用することが推奨されています。

新しい Context の API は、Component ベースになっていて、`const ThemeContext = React.createContext('themeName')`で Context を作成し、`ThemeContext.Provider`と`ThemeContext.Consumer`を組み合わせます。

`ThemeContext.Provider`が Context の値を管理する、親となる Component です。`ThemeContext.Consumer`は、Provider の子孫要素であり、Context の値を利用する側です。Provider の子孫であればどこでも利用出来ます。

```js
const ThemeContext = React.createContext('dark');

<ThemeContext.Provider value={'dark'}>
  <!-- このツリーの中では、ThemeContext.Consumerを通じてThemeContextの値を参照できる -->
  <Child>
    <ThemeContext.Consumer>
      {(theme) => <button className={theme}>click</button>}
    </ThemeContext.Consumer>
  </Child>
</ThemeContext.Provider>
```

Render Function のパターンになっているので、複数種類の Context を組み合わせて使うことも勿論可能です。

```js
const LangContext = React.createContext("lang");
const ThemeContext = React.createContext("dark");

<LangContext.Provider value="en">
  <ThemeContext.Provider value="dark">
    <Child>
      <LangContext.Consumer>
        {lang => (
          <ThemeContext.Consumer>
            {theme => (
              <button className={theme}>{getMessage("click", lang)}</button>
            )}
          </ThemeContext.Consumer>
        )}
      </LangContext.Consumer>
    </Child>
  </ThemeContext.Provider>
</LangContext.Provider>;
```

### newContext and legacyContext

なぜ既存の Context API が置き換えられることになったかというと、Static Type Checking が難しいなどの問題がありますが、一番大きいのは Context の伝播が途中 Component が shouldComponentUpdate で false を返した場合、子孫の Component は再 render されないので、Context の変更が伝わらなくなってしまうことです。

下記のサンプルを見てもらうと oldContext の方は変更が反映されていないことがわかります。

https://codepen.io/koba04/pen/OvvzXb?editors=0010

### observedBits

新しい Context の API は observedBits という面白い機能を持っています。unstable ですが...。通常 Context に変更があると対応する全ての Consumer を再 render しますが、observedBits を指定することで、関連のある Consumer のみ再 render させることができます。

方法は、React.createContext の第二引数に、関数を定義します。この関数は変更前後の Context の値を受け取るので、変更内容を示すビット列を返します。

```js
// foo === 0b01, bar === 0b10のビット列を設定する
const StoreContext = React.createContext(null, (prev, next) => {
  let result = 0;
  if (prev.foo !== next.foo) result |= 0b01;
  if (prev.bar !== next.bar) result |= 0b10;
  return result;
});
```

説明するまでもないですが、上記の場合は、foo が変更されたら`0b01`を、bar が変更されたら`0b10`のビットを立てています。

そして、Context.Consumer に、`unstable_observedBits`の Props として、Consumer が受け取っている値に関連するビット列を指定します。そうすることで、createContext の第 2 引数が返すビット列(changedBits)と Consumer の unstable_observedBits の論理積(`&`)をとって 0 じゃない場合のみ再 render されます。

```js
// foo(0b01)が変わった場合のみrenderされる
<StoreContext.Consumer unstable_observedBits={0b01}>
  {({foo}) => <div>{foo}</div>
</StoreContext.Consumer>

// bar(0b10)が変わった場合のみrenderされる
<StoreContext.Consumer unstable_observedBits={0b10}>
  {({bar}) => <div>{bar}</div>
</StoreContext.Consumer>

// どちらでも(このば場合、unstable_observedBitsは省略できる
<StoreContext.Consumer unstable_observedBits={0b11}>
  {({foo, bar}) => <div>{foo}:{bar}</div>
</StoreContext.Consumer>
```

Redux のようなライブラリを組み合わせる時の最適化として使えそうですね。

詳しくは下記のサンプルを見てください。

https://codepen.io/koba04/pen/WzzXJx?editors=0010

ちなみに React の内部でも、Mode や SideEffect はビット列を使って定義されていて、ビット演算を使って処理されています。

* https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactTypeOfMode.js

```js
export const NoContext = 0b00;
export const AsyncMode = 0b01;
export const StrictMode = 0b10;
```

* https://github.com/facebook/react/blob/master/packages/shared/ReactTypeOfSideEffect.js

```js
export const NoEffect = /*              */ 0b000000000000;
export const PerformedWork = /*         */ 0b000000000001;
// You can change the rest (and add more).
export const Placement = /*             */ 0b000000000010;
export const Update = /*                */ 0b000000000100;
export const PlacementAndUpdate = /*    */ 0b000000000110;
export const Deletion = /*              */ 0b000000001000;
export const ContentReset = /*          */ 0b000000010000;
export const Callback = /*              */ 0b000000100000;
export const DidCapture = /*            */ 0b000001000000;
export const Ref = /*                   */ 0b000010000000;
export const ErrLog = /*                */ 0b000100000000;
export const Snapshot = /*              */ 0b100000000000;
// Union of all host effects
export const HostEffectMask = /*        */ 0b100111111111;
export const Incomplete = /*            */ 0b001000000000;
export const ShouldCapture = /*         */ 0b010000000000;
```

## Others

その他、細かい変更についても、軽く触れておきます。

### Rename React.unstable_AsyncComponent to React.unstable_AsyncMode

指定した Component の中で発生した更新処理をデフォルト Low Priority として扱うことのできる`React.unstable_AsyncComponent`が、`React.unstable_AsyncMode`にリネームされました。また、以前は可能だった extends する使い方が出来なくなっています。

### New react-is package

`react-is`という新しいパッケージが公開されました。この中には様々な Component 種別に対する比較処理などを、内部実装を直接参照することなくできます。
Component の種別を使って何かしたい場合に使えます。色々な API が定義されているので、ドキュメントを参照してください。

```js
import * as ReactIs from 'react-is';

ReactIs.isValidElementType(ClassComponent); // true
ReactIs.isContextConsumer(<ThemeContext.Consumer />); // true
:
:
```

https://github.com/facebook/react/tree/master/packages/react-is

### New react-lifecycles-compat package

static getDerivedStateFromProps や getSnapshotBeforeUpdate を使って書かれた Component をこれらをサポートしていない、古いバージョンの React でも動作させるためのパッケージです。

これを使うことで、Component の開発者は新しいライフサイクルメソッドの API を、古いバージョンの React のサポートを切り捨てることなく利用出来ます。
HOC として提供されています。

内部では、static getDerivedStateFromProps や getSnapshotBeforeUpdate の動作を、既存の componentWillMount や componentWillReceiveProps、componentWillUpdate でエミュレートする形になっています。

```js
import React from "react";
import polyfill from "react-lifecycles-compat";

class ExampleComponent extends React.Component {
  // ...
}
polyfill(ExampleComponent);

export default ExampleComponent;
```

https://github.com/reactjs/react-lifecycles-compat

### New create-subscription package

非同期レンダリングを考慮した、イベントを購読する処理を実装するためのライブラリです。これは Flux ライブラリの実装として利用することを想定されているのではなく、Geolocation などの API を監視して何かしたい場合の使用が想定されています。そこまで利用シーンは多くない気はしています。（IntersectionObserver とかと組み合わせると良さそう？）

```js
import { createSubscription } from "create-subscription";

const Subscription = createSubscription({
  getCurrentValue(source) {
    // 現在の値を返します
  },
  subscribe(source, callback) {
    // sourceのPropsを受け取って、変更があった時にcallbackを呼びます
  }
});

<Subscription source={eventDispatcher}>
  {value => <AnotherComponent value={value} />}
</Subscription>;
```

Component がマウントされているかどうかの状態も考慮してくれているので、Promise を使って非同期処理の結果を Component に適用することを安全に行うために使うことも出来ます。

https://github.com/facebook/react/tree/master/packages/create-subscription

### Expose react-reconciler/persistent

カスタムレンダラーを作成するための`react-reconciler`で、persistent モデルの reconciler が外部に公開されました。これ何かやってるなぁと認識してはいたものの、しっかり見ていないのでどういうものかはわかっていません。

### Remove useSyncScheduling

フラグが削除されています。なので現時点では前述した`React.unstable_AsyncMode`で使い分ける形になります。

その他の CHANGELOG は下記にあります。自分の PR も 2 つほど入ってました（実装したことも忘れてましたが…）

https://github.com/facebook/react/blob/master/CHANGELOG.md#1630-march-29-2018

---

というわけで色々入りましたが、どれも必要に応じて使えばいいものなので、出来るようになったことを把握しつつ、ゆっくり v17 の準備をするのがいいのかなと思います。
