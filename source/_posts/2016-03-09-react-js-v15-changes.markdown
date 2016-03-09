---
layout: post
title: "React.js v0.15 changes"
date: 2016-03-09 13:07:52 +0900
comments: true
categories:
---

React.js v15のRC版がリリースされたので変更内容などを整理したいと思います。

https://facebook.github.io/react/blog/2016/03/07/react-v15-rc1.html

```
% npm install --save react@15.0.0-rc.1 react-dom@15.0.0-rc.1
```

今回の一番大きな変更はバージョン番号かなと思います。

0.14から15に。

0.x系だとproduction readyではないと思われることから一気に15.0になりましたが0.がなくなっただけで大きな変化があるわけでもないです。
なぜ1.0ではないのかというと1.0というバージョン番号は特別意味のあるものとして扱われるので、そうではなくてすでにproduction readyでありsemverに従っているということを明確にするために0.を取って15.0になりました。

https://facebook.github.io/react/blog/2016/02/19/new-versioning-scheme.html

ちなみにこれまでもminor version(0.13 -> 0.14)などでは破壊的な変更がありましたがpatch version(0.14.1 -> 0.14.2)などは基本的には破壊的な変更はなかったのでバージョンアップのサイクルなどが変わることはないと思います。
（patch versionの更新でUndocumentedなfeatureで破壊的な変更が入ることはありましたが...）

これまでも破壊的な変更をする際は基本的には前のバージョンでwarningを入れてから更新するので、今回もすでに0.14.7を使っていて特にwarningなどが出力されていないのであれば問題なく15.0にアップデートできると思います。

<!-- more -->

ちなみにIE8のサポートについてはまだIE8対応のコードは削除されていないので動作するはずですが、今後はIE8のためだけのバグFixなどは行わないというステータスです。

https://facebook.github.io/react/blog/2016/01/12/discontinuing-ie8-support.html


## Major changes

### document.createElement is in and data-reactid is out

これまではReactで構築した全てのDOMに対して`data-reactid`という属性が付与されていましたがそれが付与されなくなりました。すっきりしていいですね。
ReactDOM.renderを行ったルートの要素には`data-reactroot`という属性が付与されます。

またこれまでは多くの場合で`document.createElement`を使うよりも高速であるという理由から初期マウント時にはHTML文字列を生成してinnerHTMLで流し込んでいましたが、ブラウザーの改善などにより必ずしもそうとも言えなくなってきたので`document.createElement`を使って作成するように変更されました。

`data-reactid`がなぜ必要だったのかはReactのイベントの仕組みに関係しています。
ReactではイベントハンドリングはそれぞれのReactElementと対応付けられたDOM要素にイベントリスナーを登録してハンドリングするのではなく、`ReactDOM.render`で指定したルートのDOM要素だけにイベントリスナーを登録してそこで全てのイベントをハンドリングしています。
ルートで受け取ったイベントがどのReactElementと対応付けられたDOMで発生したのかを判定するために`data-reactid`が使用されていました。

イベントは頻繁に発生するため内部ではキャッシュなどを駆使して高速化が図られていたのですがそれによるバグも多く、今回HTML文字列ではなくDOM要素を作成するようになり、DOM要素を保持しておけばいいので`data-reactid`を使ったマッピング情報を保持しておく必要がなくなりました。

ちなみに`ReactDOM.renderToString`を使って生成したHTML文字列には変わらず`data-reactid`が付与されています。

### No more extra `<span>`s

`{name}`などのように変数を文字列として埋め込んだ際にこれまでは差分更新のために`span`タグで囲まれていたのがcomment nodeに変更されました。

* v0.14

```html
<div id="app">
<div data-reactid=".0">
<span data-reactid=".0.0">Hello </span>
<span data-reactid=".0.1">React</span>
</div>
</div>
```

* v15

```html
<div id="app">
<div data-reactroot="">
<!-- react-text: 2 -->Hello <!-- /react-text -->
<!-- react-text: 3 -->React<!-- /react-text -->
</div>
</div>
```

この変更はマークアップ構造の変更を生むので更新する際には注意が必要です。
特にCSS周りやテストでspanが挿入されることに依存したコードを書いていると壊れます。

元々が意図しないマークアップが挿入されていたのでそれがなくなってよかったんじゃないでしょうか。

### Rendering null now uses comment nodes

renderメソッドでnullを返した場合に、これまでは`<noscript>`タグがrenderされていましたがcomment nodeに変更されました。
この変更もマークアップ構造の変更を生むので特に`:nth-child`などのセレクターを使っている場合には注意が必要です。

また下記のエントリーにもあるように無駄に`<noscript>`タグが更新されていたような場合に対するパフォーマンスの改善となります。

http://benchling.engineering/deep-dive-react-perf-debugging/

### Improved SVG support

全てのSVGタグがサポートされるようになりました。一般的ではないタグは`React.DOM`のヘルパーとしては提供されていませんが、`React.createElement`で全てのSVGタグを作成できます。
全てのSVGタグはキャメルケースやハイフンなどそのままの指定で作成できます。
`gradientTransform`は`gradientTransform`のままで`clip-path`は`clip-path`のまま指定します。

ちなみにクラスを指定する場合は`className`ではなくて、`class`で指定します。custom elementsと同じです。
それに関するissueはこちら。

https://github.com/facebook/react/issues/6211

## Breaking changes

v15で最も大きなBreaking changeは上に書いたspanタグを使わなくなったことによるマークアップ構造の変化です。

その他では、v0.14でwaringsを出力していたDeprecatedなAPIが完全に削除されました。

* Reactのパッケージから`findDOMNode`, `render`, `renderToString`, `renderToStaticMarkup`, `unmountComponentAtNode`が削除されました。代わりにReactDOMのパッケージにある同名のAPIを使います。

* Addonとして提供されていた`batchedUpdates`と`cloneWithProps`が削除されました。

* `setProps`, `replaceProps`, `getDOMNode`のAPIが削除されました。

## New deprecations, introduced with a warning

`LinkedStateMixin`と`valueLink`はほとんど使われておらず、v16で廃止するためのwarningを追加されます。

https://facebook.github.io/react/docs/two-way-binding-helpers.html

必要な場合は下記のパッケージを利用してください。

https://www.npmjs.com/package/react-linked-input

## New helpful warnings

* developmentビルド(`NODE_ENV`が`production`でない)にも関わらずminifiedされている場合はproductionビルドを使うようにwarningが出ます。
  * Reactの中のコードを見たことがある人であればproductionビルドにする必要性がわかるはず...。developmentビルドには大量のデバッグやwarning用のコードが含まれています。
* styleのwidthやmarginに数値を渡すと自動で単位(px)を付与してくれますが、その際に数値を文字列として渡しているとwarningが出ます。将来のバージョンでは文字列の場合は単位が自動で付与されなくなります。
  * `<div style={ {width: 10} }>`はOK、`<div style={ {width: "10"} }>`はwarningが出ます。
* SyntheticEventに追加でpropertyをセットしようとしたり、すでに解放されているのにアクセスしようとするとwarningが出力されます。
  * 追加でpropertyをセットした場合にwarningが出るのはES2015のProxiesがサポートされている環境のみです。ちなみに自分が実装しました。
* ReactElementの`ref`と`key`のPropにアクセスしようとするとwarningが出力されます。これらはReact自体が使うためのPropでkeyで使った値が必要な場合は別途Propとして設定する必要があります。
* DOM ElementのPropに対して、`onClick`を`onclick`のように大文字・小文字の指定が間違っている場合にはwarningが出力されるようになりました。

## Notable bug fixes

* 幾つかのメモリリークが修正されています。

---------------------

SyntheticEventでのメモリリークについては自分が修正したので紹介しておくとSyntheticEventの`target`属性が正しく解放されるようになりました。

SyntheticEventはPoolingされており、イベントハンドラーの処理が終了すると初期化されPoolに戻るのですが一番よく使う`target`属性だけ解放されていませんでした。
したがって、下記のようなコードはv0.14では動作していましたがv15では動作しません。

```js
const Component = () => (
    <div onClick={e => {
      setTimeout(() => console.log(e.target)); // <div>click</div>
    }}>
      click
    </div>
);
```

これは`onClick`が実行された時点でSyntheticEvent(`e`)が初期化されており、setTimeoutのコールバック実行時にはすでにtargetの値が初期化(null)されているためです。
上記の場合、`target`をローカル変数として保持するか`e.persist()`を使って保持する必要があります。

SyntheticEventがPoolingされているのは大量のイベントオブジェクトを作成することで発生するGCを避けるなどパフォーマンス上の理由からなのですが、モダンなブラウザーではもう必要ないのではないかということでPoolingをやめることが検討されています。

SyntheticEvent周りは自分が追加したProxyを使ったコードなどかなり混沌としてきているのでPoolingやめてリファクタリングするのはとてもいいと思います。やりたい...。

https://github.com/facebook/react/issues/6190

---------------------

* Mobile SafariやIE10, 11などでのイベントの扱いが改善されています。
* `cite`と`profile`の属性がサポートされました。
* `onAnimationStart`, `onAnimationEnd`, `onAnimationIteration`, `onTransitionEnd`, `onInvalid`のイベントがサポートされました。また`object`要素に`onLoad`イベントが追加されました。
* ReactTransitionGroupで同時に複数要素を削除しようとした場合にも正しくハンドリングできるようになりました。
* shallowCompareなどのいくつかの場所で`Object.is`による比較が行われるようになりました(実際にはpolyfill)。これにより、`+0 !== -0`となったり`NaN === NaN`となります。
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
* ReactDOMがデフォルトではpropertyとしてではなくattributeとして扱うようになります。これによるEdge caseなバグが修正されました。また属性値が`null`の場合に属性が完全に削除されるようになりました。これによりブラウザーがデフォルト値を設定しないようになります。

* あとblogにはありませんでしたが、Stateless Componentsが`null`を返せるようになったのは地味に嬉しいですね！

## Regression?

* 15.0.0-rc.1では`onTouchTap`が動作していないようなので使っている人は注意した方がよさそうです。
  * https://github.com/facebook/react/issues/6221
