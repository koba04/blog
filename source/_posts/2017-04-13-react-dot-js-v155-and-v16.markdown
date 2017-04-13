---
layout: post
title: "React v15.5(6) and v16"
date: 2017-04-13 20:07:05 +0900
comments: true
categories: react.js
---

Reactのv15.5がリリースされたので、v15.5での変更点とv16についてのまとめです。

v15.5はバグフィックスとv16での変更点に対する準備なので、可能ならあげておいた方がスムーズにv16がリリースされた時に対応できると思います。

また、当初の予定ではv15.5がv15系の最後のリリースになる予定でしたが、色々と混乱もあったためフォローアップとしてv15.6もリリースされることになりました。
なので、v15.6がリリースされてから対応するのもアリだと思います。

それでは、大きな変更点を見ていきたいと思います。
基本的には、v16で色々と廃止するための警告が主になります。
最近のバージョンと同様に、コアから必要なもの以外をどんどん削ぎ落としていく流れです。

廃止されるものは色々ありますが、基本的に全てのものに対してマイグレーションのパスは提供されているので対応可能だと思います。
ただ、対応版をリリースしていないライブラリーを使っていると色々警告が出ると思います。
場合によっては、その警告によってテストが壊れることがあるかもしれません。

<!-- more -->

## Deprecated React.createClass

廃止されること自体は前から言われていたので、使わないようにしていた人も多いと思いますが、`create-react-class`として別パッケージとなり、v16では`react`からは削除されます。

```js
import createReactClass from 'create-react-class';
```

そのためv15.5では、`React.createClass`を使おうとすると警告が出ます。

自分の書いたコードで`React.createClass`を使っている場合は、`React.Component`を使ったComponent定義かStateless Functional Componentsに書き換える必要があります。

mixinを使っているなど、どうしても`React.createClass`を使いたい場合は`create-react-class`を使うこともできますが、可能な限りReact本体が提供する方法を利用する方がいいと思います。

`React.createClass`から`React.Component`の定義に書き換えるcodemodも提供されているので、使ってみるのもいいかもしれません。

* https://github.com/reactjs/react-codemod

このcodemodでは、`React.createClass`が提供するautobindを実現するために、property initializerのシンタックスを利用するので、変換後は`babel-plugin-transform-class-properties`を使用する必要があります。(Stage 2)

* http://babeljs.io/docs/plugins/transform-class-properties/

`React.createClass`を使っているライブラリーを利用している場合には、PR送って対応してもらうか、`React.createClass`に`create-react-class`を代入して対応するなどが必要になるかもしれません。
(v15.5では、警告を出すために`React.createClass`には`Object.defineProperty`でgetterが設定されており、`configurable`でないので置き換えることはできません)

## Deprecated React.PropTypes

これも、`React.createClass`と同様にずっと言われていましたが、`prop-types`として別パッケージとなり、v16では`react`から削除されます。

```js
import PropTypes from 'prop-types';
```

そのためv15.5では、`React.PropTypes`を使おうとすると警告が出るようになりました。

これもcodemodが提供されているので、それを使って一括で変換することができます。

* https://github.com/reactjs/react-codemod#react-proptypes-to-prop-types

PropTypesに関しては、FlowやTypeScriptへの移行が勧められているもののハードルもあるので、別パッケージ化された`prop-types`をしばらく使い続けるのは選択肢としてあるのかなと思います。
今回別パッケージとなったので、組み込みのvalidationロジックであり、PropTypesのチェック機構自体がなくなることは、まだ予定されていないので。

ちなみに、将来的にAPIの変更が予定されているContextを使う場合にも、変わらず`prop-types`を使って指定します。
（実際には`contextTypes`の定義でマスクしているだけなので、`prop-types`を使う必要はないのですが）

## Deprecated Addons

React本体がアドオンとして提供していた諸々が、廃止されたり別パッケージ化したり、移動したりしています。
v16では、`react-with-addons`のUMDビルドも提供されなくなります。

* `react-addons-create-fragment`は、v16のFiber化により配列を返すことができるようになるため、多くの場面で不要となるので削除されます。
* `react-addons-css-transition-group`と`react-addons-transition-group`は、`react-transition-group`の別パッケージになりました。`CSSTransitionGroup`と`TransitionGroup`して利用できます。ただし、全く実装が一緒というわけではないので移行する際には注意が必要です。すでに修正済みですが下記のようなバグとかもあったりするので...。
    * https://github.com/reactjs/react-transition-group
    * https://github.com/reactjs/react-transition-group/pull/13
* `react-addons-linked-state-mixin`と`react-linked-input`は、明示的に`value`と`onChange`を指定すればいいので削除されます。
* `react-addons-pure-render-mixin`と`react-addons-shallow-compare`は、`React.PureComponent`を代わりに利用できます。
* `react-addons-update`は`immutability-helper`が代わりに利用できます。
    * https://github.com/kolodny/immutability-helper

`react-addons-test-utils`は、`react-dom`のrendererに依存している部分が多いため、`react-dom/test-utils`に移動されました。

```js
import TestUtils from 'react-dom/test-utils';
```

ShallowRenderに関しては`react-dom`に依存していないため、`react-test-renderer/shallow`に移動されました。
ちなみに`react-test-renderer`はJestがsnapshot testingで使っていたりする、ReactElementをJSONとして返すrendererです。
ShallowRenderは、これのトップレベルのComponentまでしかrenderしない版として考えることができます。

```js
import {createRenderer} from 'react-test-renderer/shallow';
```

`react-addons-perf`だけは、特に何もなくこのままですが、`react-addons-perf`は同期的なrenderが前提となっているため、将来的にFiberで非同期的なrenderをする場合には正しく計測できません。
これに変わる何かが将来的に提供される可能性もありますが、とりあえずは`?react_perf`によるBroser Timelineを使った計測が推奨されています。

* https://facebook.github.io/react/docs/optimizing-performance.html#profiling-components-with-chrome-timeline

## 15.6（予定）

* `React.DOM.{p, div,...}`として提供されていたファクトリ関数が廃止となります。
* APIの廃止などの警告は、これまでは`console.error`として出力されていましたが、`console.warn`で出力されるようになります。

## 16に向けて

v16はすでに`@next`でインストールできます。
そのため、まだ実装されていないサーバーサイドレンダリングとShallowRenderを使っていない部分では試すことが可能です。

```
npm i react@next react-dom@next
```

### Fiber

v16の一番大きな目玉は、Fiberに内部実装が置き換えられることです。
ただし、v16の時点ではFiberは現在のStackのrendererと互換性のあるモードで動作します。
そのため、Fiberの特徴である`requestIdleCallback`によってスケジューリングされた非同期なrenderではなく、同期的なrenderとなるため、利用者として大きな違いは感じないかもしれません。
（call stack見ると全く変わっていることがわかると思いますが）

文字列や配列をComponentでラップすることなく直接返すことができるのは嬉しい部分かもしれません。

```js
const Text = ({text}) => text;
const List = () => [1, 2, 3];
```

ちなみに、v16の時点でも`ReactDOM.unstable_deferredUpdates`を使うことで、非同期なrenderが出来るようにはなりそうです。
あとは、`ReactDOMFiber.js`にある`useSyncScheduling`というフラグを無理やり`false`にすればデフォルトで非同期なrenderになります。（軽く試した感じだと問題なく動いていた）

非同期のrenderをどのようにユーザー側のAPIとして見せるのかは、まだ明らかになっていなくてこれから議論していくようです。

Fiberについては、下記に集めたリソースを読むとわかると思います。（今後紹介的な何かを書くかも）

* https://github.com/koba04/react-fiber-resources

最初に見るものとしてのおすすめは、Lin ClarkによるA Cartoon Intro to Fiber(React.js Conf 2017)です。

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZCuYPiUIONs?ecver=1" frameborder="0" allowfullscreen></iframe>

互換モードによるFiber自体はfacebook.comでも問題なく動作しているようです。
ただし、サーバーサイドレンダリングに対する対応は、まだ全く入っておらず今後どうなっていくのかは不明です。FiberになるとStreaming renderingもやりやすくなるのではとは思いますが。

### No more direct import!

v16からは、それぞれのエントリーポイントがRollupを使ってバンドルされたものになります。
なので下のような構造になります。

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">react@next and react-dom@next are flat bundles! 👀 <a href="https://twitter.com/hashtag/reactjs?src=hash">#reactjs</a> <a href="https://t.co/5ezjjf08sd">pic.twitter.com/5ezjjf08sd</a></p>&mdash; Toru Kobayashi (@koba04) <a href="https://twitter.com/koba04/status/850180571653222400">April 7, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

これにより、初期ロード時間の短縮やサーバーサイドでのパフォーマンスの向上が見込まれています。
また、利用者側には関係ないですがビルド周りが見直されており、GruntやgulpやBrowserifyのタスクがリポジトリから削除されています。すっきり。

この変更による、一番大きな影響は`react/lib/xxxx`として直接Reactの内部ライブラリを利用しているライブラリが動作しなくなることです。
`enzyme`などのメジャーなライブラリはReact側でもケアされていますが、それ以外のライブラリーは壊れてどうにもならなくなることがあるかもしれません。
したがって、そのようなハックをしているライブラリーを利用している場合は注意した方がよさそうです。

### リリース？

ちなみにv16は、夏くらい(?)をターゲットに考えているようです。

