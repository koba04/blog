---
layout: post
title: "React v16.3 changes"
date: 2018-04-03 20:59:23 +0900
comments: true
categories: react.js
---

React v16.3.0がリリースされました。

**※4/4にバグフィックスを含むv16.3.1がリリースされています**

このバージョンでは、基本的にはv17で有効化される非同期レンダリングへの対応が中心になっています。
変更点は多いですが、ほとんどが機能追加であり破壊的な変更はないため、v16.2からv16.3へのアップグレードは比較的簡単じゃないかなと思います。

https://reactjs.org/blog/2018/03/29/react-v-16-3.html

<!-- more -->

当初の予定からはかなり延びたため、直前に発表されたReact Suspenseの機能も入れるのかと思いましたが入りませんでした。
まだ最終的なAPIは決まってないようなので今後に期待。
React Suspenseについては、v16.3と関係ないので今回は省略します。

https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html

-----------------------

長いので3行で知りたい人向けのまとめ


- v16.3は、v17移行で有効になる非同期レンダリングに移行するための機能追加が中心で、このバージョンでの破壊的な変更はない
- ライフサイクルメソッドの変更、新しいRefのAPIとContextのAPIが入る
- StrictModeのComponent、`react-lifecycle-compat` 、`react-is`、`create-subscription`パッケージが追加された

-----------------------


それでは、大きな変更だけ見ていきたいと思います。

## Lifecycle Methods

もっとも大きな変更は、将来のライフサイクルメソッドの変更に備えて新しいライフサイクルメソッドが追加されたことです。

ただ実際には、v16.3の段階では破壊的な変更はありません。
ライフサイクルメソッドの変更は下記のようなスケジュールで適用されます。

{% img /images/posts/react-163-changes/lifecycle-methods.png 'React Lifecycle Methods Changes' %}


上記を見てわかる通り、v16.3の段階では新しい`static getDerivedStateFromProps` と `getSnapshotBeforeUpdate` と`UNSAFE_xxx`メソッドの追加のみです。
UNSAFE_xxxのメソッドは既存実装のAliasで今のところ、削除される予定は決まっていません。
したがって、他のメソッドへのマイグレーションが難しい場合にはとりあえず使い続けることも可能です。
UNSAFE_のprefixがついていないメソッドは、v16系のマイナーリリースの中で警告が出るようになって、v17系のリリースで削除されます。
（ReactではBreaking Changeをするときは、前のバージョンで警告を出すようになっています）
この警告は、当初はv16.4のリリースと計画されていたのですが最新のブログではv16.xとなっています。

ちなみに、この後で紹介する`react-lifecycle-compat`というライブラリを使うことで、新しく追加されたstatic getDerivedStateFromPropsやgetSnapshotBeforeUpdateを使ったComponentでも古いバージョンのReactをサポートすることが可能です。

### なぜこれらのライフサイクルメソッドが廃止されるのか？

Reactはv16でReact Fiberと呼ばれる実装に内部実装が書き換えられましたが、v16系ではこれまでのバージョンと互換性のある挙動をするようになっています（同期的）。
v17では、ここの挙動がデフォルトで変更されます。
その際、Render PhaseとCommit Phaseのうち、Render Phaseの方は非同期で処理され、さらに何度も呼ばれる可能性があります。

Render Phaseはインスタンスを作ったり差分を計算するいわゆる副作用のない部分です。Commit Phaseは、Render Phaseの結果を元に実際にDOMなどのHost環境に適用するPhaseで、同期的に処理されます。

そのため、Render Phaseで呼ばれるライフサイクルメソッド（componentWillMount, componentWillReceiveProps, shouldComponentUpdate, componentWillUpdate）のうちshouldComponentUpdate以外は、安全性を保証できないため廃止されることになりました。

UNSAFE_というprefixが付いた形では残りますが、前述した通り、これらのメソッドは何度も呼ばれる可能性があるため、副作用のある処理を行う場合には注意が必要です。
例えば、イベントの登録・解除の処理など、1対1で結びついていることを期待する処理をcomponentWillMountとcomponentWillUnmountを組み合わせて行った場合、1対1であることが保証されないため壊れる可能性があります。
この場合は、Commit Phaseで実行されるcomponentDidMountとcomponentWillUnmountを組み合わせて使う必要があります。

これらの話は、以前にも書いたのでそちらを参照してもらうとイメージ出来ると思います。
（Render Phaseという名前は最近使われるようになったので、参照先では、beginWork〜completeWorkとして書かれている部分です）


- http://blog.koba04.com/post/2017/04/25/a-state-of-react-fiber/
- https://speakerdeck.com/koba04/react-v16-and-beyond-react-fiber
- https://speakerdeck.com/koba04/capability-of-react-fiber

前述した通り、非同期レンダリングの世界では、更新処理の割り込みにより様々なタイミングでRender Phaseが複数回実行されます。
そのため、Reactが管理するPropsやState以外のインスタンスが持つ状態を保証するのが難しくなります。そのため、この後紹介するcomponentWillReceivePropsの代わりと使われることが想定されるgetDerivedStateFromPropsは、staticメソッドになっています。

将来的には、ClassによるComponent APIとは違う、Reactが管理するStateなど以外の状態を持つことができないComponentを作成する新しいAPIも計画されているようです。
（つまりクラスではないStateful Functional Componentのような?）

shouldComponentUpdateについては、基本的にはこのような副作用が書かれていることはないということと影響の大きさから、残されたのかなと思います。
将来的にstaticなメソッドになる可能性はあるかなと思います。

### `static getDerivedStateFromProps(nextProps, prevState)`

Render Phaseで呼ばれます。
タイミングとしては、新しいPropsが渡された場合に、componentWillReceivePropsと同じタイミングで呼ばれます。
componentWillReceivePropsと違い、更新時だけでなくマウント時にも呼ばれます。

引数として新しいPropsと現在のStateを受け取ります。
このメソッドで返した値は現在のStateの値とマージされます。
つまり受け取ったPropsを元にStateの値を更新したいような場面で使います。
返した値がStateの値とマージされるというのは、setStateの挙動と同じです。

componentWillReceivePropsと違いstaticになっているのは、前述した通りRender Phaseでいつ呼ばれてもいいように、PropsとState以外の状態に依存させないためです。

Stateを更新する必要がない時は、`null`を返します。

実際に使おうとするとprevPropsが取得出来ないのを不便に感じるのですが、下記の理由からprevPropsを渡さないようになったとのことです。
ドキュメントでは、prevPropsが欲しい場合は、Stateとして保存することが推奨されています。

- getDerivedStateFromPropsはマウント時にも呼ばれ、マウント時はprevPropsは`null`になるので、prevPropsを使おうとする`null`かどうかのチェックが常に必要になってしまう
- prevPropsを渡さないことで、メモリ常に保持しておく必要がなくなるので将来的に最適化が可能になる

あんまりいい例が思いつかなかったのですが、getDerivedStateFromPropsの例はこんな感じ。

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

Commit Phaseで呼ばれます。
したがって、Render Phaseで呼ばれるcomponentWillUpdateと違い、更新前に必ず一度だけ呼ばれることが保証されます。

用途としては、スクロール位置などHost環境(DOM)の更新前後の値を比較して何かしたい場合に使います。
これまでは、componentWillUpdateでインスタンスプロパティに保存して、componentDidUpdateでそれを参照し比較していたのを、componentWillUpdateの代わりにgetSnapshotBeforeUpdateを使います。
getSnapshotBeforeUpdateでは、名前の通りsnapshotを返します。
snapshotはどんな値でもよく、上記の場合はスクロール位置をsnapshotとして返します。

getSnapshotBeforeUpdateで返したsnapshotは、componentDidUpdateの第3引数として渡されます。
したがってcomponentDidUpdateの中では、snapshotと現在の値を比較できます。

ちなみにgetDerivedStateFromPropsもgetSnapshotBeforeUpdateも長くて覚えにくい名前だと思いますが、これはこれらのライフサイクルメソッドは頻繁に使うようなものではないため、あえてそういう名前にしたという話もあります。
（名前決める議論の中でそんなことを言っていた記憶がないので本当かは不明）

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


- Initializing state
  - Stateの初期化をcomponentWillMountで初期化を行なっていた場合は、constructorに移動させることが出来ます
- Fetching external data
  - 外部リソースの取得をcomponentWillMountで行なっていた場合は、componentDidMountで行うようにします。
  - ただ、この辺りは将来的にはReact Suspenseで置き換えることを想定しているようです。SSR時の外部リソースの取得についても言及されているので、React SuspenseはSSRの時にもうまく動作するようになるのかもしれないですね。（既存のSSRのRendererはFiberベースではないのでどう実装するのかは不明ですが…）
- Adding event listeners (or subscriptions)
  - componentWillMountで行なっていたイベントの購読については、componentDidMountで行うようにします。
  - 一点注意点としては、componentWillMountは親 → 子の順番で呼ばれますが、componentDidMountは子→ 親の順番で呼ばれます。そのため、親のcomponentDidMountでイベントの購読を行う場合、子のcomponentDidMout発行されたイベントについては購読出来ません（子がイベントを発行していた時点で、親はまだイベントを購読してないため）。
  - イベントの処理については、後述する`create-subscription`を使う方法もあります。
- Updating state based on props
  - componentWillReceivePropsで新しいPropsの値をもとにStateの値を更新していたような場合は、static getDerivedStateFromPropsを代わりに使います。
- Invoking external callbacks
  - Stateが変更されたタイミングで何かコールバックを実行したいような場合は、componentWillUpdateではなくて、componentDidUpdateを使います。
- Side effects on props change
  - Propsの変更に応じて何か副作用を呼び出したい場合は、componentWillReceivePropsやcomponentWillUpdateではなく、componentDidUpdateを使います。
- Fetching external data when props change
  - Propsの変更に応じて外部リソースをフェッチしたい場合には、static getDerivedStateFropPropsでデータをリセットして、componentDidUpdateでデータをフェッチする方法が推奨されています。（componentDidUpdateで呼ばないと何度もリクエストが投げられる可能性があります）
- Reading DOM properties before an update
  - 更新前のDOMの状態を取得して更新後の値と比較したい場合は、getSnapshotBeforeUpdateで取得した値を返して、componentDidUpdateの第3引数として受け取ります。

ライフサイクルメソッドについての公式のドキュメント

https://reactjs.org/docs/react-component.html#the-component-lifecycle

## createRef API

新しいRefに対するAPIです。`React.createRef()`で作成した変数をrefに設定します。
簡単ですね。

```js
const ref = React.createRef();
<button ref={ref} />
```

注意点としては、上記の場合、button要素はrefの変数に入っているのではなく、`ref.current`に入っています。したがって上記の場合、focusをあてたい場合には`ref.current.focus()`とします。

これまでは、文字列とコールバックを使ったRef指定が可能でした。
文字列を使ったRefは、利用者としては単純でわかりやすいですが、Ownerコンテキストで評価されるなど内部の実装としても好ましくない部分があったり、最適化や静的型チェックが難しいという問題がありました。そのため、ずっと廃止予定とアナウンスされていて、今回それに変わる`React.createRef()`が登場したため、廃止されることが決定しました。
（どのバージョンで廃止されるのかはまだ未定です）

コールバックを使ったRef指定はそのまま残るので、コールバックで指定しているものはそのままで問題ありません。
実際Functional Componentの中でただfocusを当てたいような場合には、refの参照を保持しておく必要がないので、コールバックで処理した方が便利です。

```js
const Text = () => (
  <input ref={el => el && el.focus()} />
);
```

公式のドキュメント

https://reactjs.org/docs/refs-and-the-dom.html

## forwardRef API

主にHOCでラップされたComponentに対してRefを指定した場合に使います。

`React.forwardRef((props, ref) => <Component {…props} ref={ref}  />)`のような形式にすることで、指定されたrefを引数として受け取ることが出来るようになるので、そのまま子のComponentのrefに指定できます。

RefはPropsと違い伝播させることができなかったので、これまでは、componentRefのようなPropsとして渡す必要があったのですが、これを使うことで、refとして渡すことができるようになります。

Refで子のComponentを参照することが自体が避けるべきことではあるので、そんなに用途はないように思いますが…。

無理やり例を考えて見ると、HOCでラップしたComponentに対するrefを指定したい場合、

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

のように`buttonRef`などのようにPropsの一部として渡す必要があったのが、

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

のように`React.forwardRef`を使うことで、直接Componentを利用する時のようにrefとして指定出来るようになります。

公式のドキュメント

https://reactjs.org/docs/forwarding-refs.html

## Strict Mode

新しいComponentです。Componentなので、`<React.StrictMode>…</React.StrictMode>`のように利用します。
Strict ModeのComponent自体は何もUIを描画せず、後述するチェックもdevelopment環境の場合のみチェックするので、本番環境のコードに含めたままでも問題ありません。

`<StrictMode>`で囲まれたComponentの中では、廃止予定のAPIや問題になりそうな使い方をチェックして問題を検出してくれます。
現時点では、下記のようなチェックが行われています。

- Identifying components with unsafe lifecycles
  - componentWillMountやcomponentWillReceivePropsやcomponentWillUpdateなどの廃止予定のAPIを使用していないかをチェックして、見つかった場合にはコンソールに出力します。
- Warning about legacy string ref API usage
  - 文字列を使ったref指定をチェックして、見つかった場合にはコンソールに出力します。
- Detecting unexpected side effects
  - 非同期レンダリングが有効になった場合をシミュレートすることで、非同期レンダリングが有効になった時に問題となる副作用のあるコードがないかを検出します。ただし、副作用のあるコードがあるかどうかを検出することはできないので、Strict Modeでは、下記のAPIが意図的に2回呼ばれるようになります。
    - constructor
    - renderメソッド
    - setStateの第1引数に指定する関数
    - static getDerivedStateFromProps
  - これにより、完璧ではないですが、複数回呼ばれると壊れるような副作用のある実装をできることを期待しています。

ちなみに、なぜ`React.strictMode = true`のようになっていないのか疑問に思うかもしれませんが、Componentの形式になっていることでアプリケーションの一部だけチェックすることが出来るようになります。
これはFacebookが50,000以上のComponentを持っていることから来ているマイグレーションの戦略かなと思います。

## New Context API

長くなってきたのでここからは簡潔に...。

APIの変更があるとずっと予告されていたContextの新しいAPIです。

既存のContextも少なくv16系ではサポートされ続けます。
既存のContextは、`react-redux`や`react-router`などのライブラリが内部で使っているので、多くの人に関係あるといえばある変更です。
これらのライブラリがどのように対応するのかは、issueなどで議論は行われていますがまだ不明です。

* https://github.com/reactjs/react-redux/pull/898
* https://github.com/ReactTraining/react-router/pull/5908

また最近軽量なRedux風なライブラリが増えているのはこのContext APIの影響もあると思います。

* https://github.com/jamiebuilds/unstated

今回のNew Context APIは正式な機能としてリリースされましたが、Contextをabuseするのではなく、Propsを使ってデータのやりとりをするのが基本であるのは変わりません。
テーマや言語のような様々な場所、階層で利用されるようなものやFluxのStoreなど本当に必要な部分のみで利用することが推奨されています。

新しいContextのAPIは、Componentベースになっていて、`const ThemeContext = React.createContext('themeName')`でContextを作成し、`ThemeContext.Provider`と`ThemeContext.Consumer`を組み合わせます。

`ThemeContext.Provider`がContextの値を管理する、親となるComponentです。`ThemeContext.Consumer`は、Providerの子孫要素であり、Contextの値を利用する側です。Providerの子孫であればどこでも利用出来ます。

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

Render Functionのパターンになっているので、複数種類のContextを組み合わせて使うことも勿論可能です。

```js
const LangContext = React.createContext('lang');
const ThemeContext = React.createContext('dark');

<LangContext.Provider value="en">
  <ThemeContext.Provider value="dark">
    <Child>
      <LangContext.Consumer>
        {(lang) => (
          <ThemeContext.Consumer>
            {(theme) => <button className={theme}>{getMessage('click', lang)}</button>}
          </ThemeContext.Consumer>
        )}
      </LangContext.Consumer>
    </Child>
  </ThemeContext.Provider>
</LangContext.Provider>
```

### newContext and legacyContext

なぜ既存のContext APIが置き換えられることになったかというと、Static Type Checkingが難しいなどの問題がありますが、一番大きいのはContextの伝播が途中ComponentがshouldComponentUpdateでfalseを返した場合、子孫のComponentは再renderされないので、Contextの変更が伝わらなくなってしまうことです。

下記のサンプルを見てもらうとoldContextの方は変更が反映されていないことがわかります。

https://codepen.io/koba04/pen/OvvzXb?editors=0010

### observedBits 

新しいContextのAPIはobservedBitsという面白い機能を持っています。unstableですが...。
通常Contextに変更があると対応する全てのConsumerを再renderしますが、observedBitsを指定することで、関連のあるConsumerのみ再renderさせることができます。

方法は、React.createContextの第二引数に、関数を定義します。この関数は変更前後のContextの値を受け取るので、変更内容を示すビット列を返します。

```js
// foo === 0b01, bar === 0b10のビット列を設定する
const StoreContext = React.createContext(null, (prev, next) => {
  let result = 0;
  if (prev.foo !== next.foo) result |= 0b01;
  if (prev.bar !== next.bar) result |= 0b10;
  return result;
})
```

説明するまでもないですが、上記の場合は、fooが変更されたら`0b01`を、barが変更されたら`0b10`のビットを立てています。

そして、Context.Consumerに、`unstable_observedBits`のPropsとして、Consumerが受け取っている値に関連するビット列を指定します。
そうすることで、createContextの第2引数が返すビット列(changedBits)とConsumerのunstable_observedBitsの論理積(`&`)をとって0じゃない場合のみ再renderされます。

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

Reduxのようなライブラリを組み合わせる時の最適化として使えそうですね。

詳しくは下記のサンプルを見てください。

https://codepen.io/koba04/pen/WzzXJx?editors=0010

ちなみにReactの内部でも、ModeやSideEffectはビット列を使って定義されていて、ビット演算を使って処理されています。

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

指定したComponentの中で発生した更新処理をデフォルトLow Priorityとして扱うことのできる`React.unstable_AsyncComponent`が、`React.unstable_AsyncMode`にリネームされました。
また、以前は可能だったextendsする使い方が出来なくなっています。

### New react-is package

`react-is`という新しいパッケージが公開されました。
この中には様々なComponent種別に対する比較処理などを、内部実装を直接参照することなくできます。
Componentの種別を使って何かしたい場合に使えます。
色々なAPIが定義されているので、ドキュメントを参照してください。

```js
import * as ReactIs from 'react-is';

ReactIs.isValidElementType(ClassComponent); // true
ReactIs.isContextConsumer(<ThemeContext.Consumer />); // true
:
:
```

https://github.com/facebook/react/tree/master/packages/react-is

### New react-lifecycle-compat package

static getDerivedStateFromPropsやgetSnapshotBeforeUpdateを使って書かれたComponentをこれらをサポートしていない、古いバージョンのReactでも動作させるためのパッケージです。

これを使うことで、Componentの開発者は新しいライフサイクルメソッドのAPIを、古いバージョンのReactのサポートを切り捨てることなく利用出来ます。
HOCとして提供されています。

内部では、static getDerivedStateFromPropsやgetSnapshotBeforeUpdateの動作を、既存のcomponentWillMountやcomponentWillReceiveProps、componentWillUpdateでエミュレートする形になっています。

```js
import React from 'react';
import polyfill from 'react-lifecycles-compat';

class ExampleComponent extends React.Component {
  // ...
}
polyfill(ExampleComponent);

export default ExampleComponent;
```

https://github.com/reactjs/react-lifecycles-compat

### New create-subscription package

非同期レンダリングを考慮した、イベントを購読する処理を実装するためのライブラリです。
これはFluxライブラリの実装として利用することを想定されているのではなく、GeolocationなどのAPIを監視して何かしたい場合の使用が想定されています。
そこまで利用シーンは多くない気はしています。
（IntersectionObserverとかと組み合わせると良さそう？）

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
</Subscription>
```

Componentがマウントされているかどうかの状態も考慮してくれているので、Promiseを使って非同期処理の結果をComponentに適用することを安全に行うために使うことも出来ます。

https://github.com/facebook/react/tree/master/packages/create-subscription

### Expose react-reconciler/persistent

カスタムレンダラーを作成するための`react-reconciler`で、persistentモデルのreconcilerが外部に公開されました。
これ何かやってるなぁと認識してはいたものの、しっかり見ていないのでどういうものかはわかっていません。

### Remove useSyncScheduling

フラグが削除されています。なので現時点では前述した`React.unstable_AsyncMode`で使い分ける形になります。

その他のCHANGELOGは下記にあります。
自分のPRも2つほど入ってました（実装したことも忘れてましたが…）

https://github.com/facebook/react/blob/master/CHANGELOG.md#1630-march-29-2018

----------------

というわけで色々入りましたが、どれも必要に応じて使えばいいものなので、出来るようになったことを把握しつつ、ゆっくりv17の準備をするのがいいのかなと思います。


