---
layout: post
title: "React v16 changes"
date: 2017-09-27 16:00:07 +0900
comments: true
categories: react.js
---

Reactのv16がリリースされたので、変更点などを整理したいと思います。

* https://facebook.github.io/react/blog/2017/09/26/react-v16.0.html
* https://code.facebook.com/posts/1716776591680069/react-16-a-look-inside-an-api-compatible-rewrite-of-our-frontend-ui-library/

React v16やReact Fiberについては、下記で書いたりもしているのでそちらも参考にしてみてください。

* [React Fiber現状確認](http://blog.koba04.com/post/2017/04/25/a-state-of-react-fiber/)
* [Capability of React Fiber](https://speakerdeck.com/koba04/capability-of-react-fiber)
* [React v16 and beyond React Fiber](https://speakerdeck.com/koba04/react-v16-and-beyond-react-fiber)
* [ReactはなぜFiberで書き直されたのか？Reactの課題と将来像を探る](https://html5experts.jp/shumpei-shiraishi/23265/)

## 新機能

### render関数から文字列や配列を直接返せるように

地味に嬉しい機能ですね。これまでは無駄にspanやdivで囲むしかなかったのが、直接文字列や配列を返すことができるようになります。

```js
// 文字列を直接返す
const DisplayName = ({user}) => `${user.name} (@${user.id})`;

// 配列
const Row = ({children}) => <tr>{children}</tr>;
const Columns = ({items}) => (
  items.map((item, id) => <td key={i}>{item}</td>)
);
<Row>
    <Columns items={['foo', 'bar', 'baz']} />
</Row>
```

配列を返す場合は、`key`を必ずつける必要があります。
それをJSXのSyntaxレベルでサポートするという議論もあったりします。

* https://github.com/facebook/jsx/issues/84

```js
[
    <li key={1}>foo</li>,
    <li key={2}>bar</li>,
    <li key={3}>baz</li>,
]

↓↓↓

// こんな感じで書けるようにしたいという議論
<>
  <li>foo</li>
  <li>bar</li>
  <li>baz</li>
</>
```

### Error Boundaries

子のComponentのrender関数やライフサイクルメソッドで起きたエラーを、`componentDidCatch`というライフサイクルメソッドでキャッチできるようになります。
これによって、エラーが起きたことをユーザーに伝えたり、エラーリポートのサービスに送信できるようになります。

```js
class Child extends React.Component {
    componentDidMount() {
        // 〜 is not a functionみたいなエラーでも同様
        throw new Error('Something went wrong!!');
    }
    render() {
      return <p>Child!</p>;
    }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }
  componentDidCatch(error, info) {
    this.setState({error});
    console.log(error.message, info.componentStack);
    // Something went wrong!! 
    // in Child (created by App)
    // in section (created by App)
    // in App
  }
  render() {
    return (
      <section>
        {this.state.error ? <p>エラーが発生しました</p> : <Child />}
      </section>
    );
  }
}
```

上記のように、componentDidCatchの引数には、Errorオブジェクト以外に`info`というオブジェクトを受け取ります。`info`は今のところ`componentStack`のプロパティしか持っていません。`componentStack`には、Compnentのスタックトレースが文字列で入っています。したがって、これをエラーと一緒に送信すると、どこのComponentでどのエラーが発生したのかがわかります。

**Error Boundariesの対象になるのは、render関数とライフサイクルメソッドの中のエラーだけです。**なので、イベントハンドラーの中で起きたエラーや、ライフサイクルメソッドの中での非同期処理（HTTP Requestなど)で起きたエラーは対象になりません。

また、もう一点、上記のError Boundariesの対象となるエラーに対する扱いが変更されています。

v15までは、エラーが発生したらそこで処理が中断されていました。したがって、途中のComponentのrenderで処理が止まるなど、不整合なViewをユーザーに見せてしまう可能性がありました。

v16では、エラーが発生すると、`ReactDOM.render`で指定したRoot Containerから全てアンマウント（DOMから削除）されるようになります。
それを避けたい場合には、上記の例のように`componentDidCatch`を定義して`setState`するなどしてエラー用の表示を行う必要があります。
なので、親のComponentで`componentDidCatch`を定義したり、`componentDidCatch`を定義したComponentでアプリケーション全体のComponentをラップしておくと安心かと思います。

### Portals

ReactDOM.createPortalというAPIが追加されました。

* https://facebook.github.io/react/docs/portals.html

これは、Componentrツリーの外側に対するrenderをComponentツリーの一部として扱えるようにする機能です。
文字だけで書くとわかりにくいので例として、どこかアプリケーションの外側にモーダル用のDOMがあって、アプリケーションのStateによってモーダルを表示したい場合を考えてみます。

Portalを使わずに書くと、

```js
class App extends React.Component {
    componentDidUpdate() {
        const container = document.querySelector('.modal-container');
        if (this.state.modal) {
            ReactDOM.render(
                <Modal
                    type={this.state.modal}
                    onClose={() => {
                        this.setState(
                            () => ({modal: null}),
                            () => ReactDOM.unmountComponentAtNode(container)
                        )
                    }}
                >
            );
        }
    }
    render() {
        // ....
    }
}
```

と`componentDidUpdate`や`componentDidMount`のライフサイクルメソッドの中で扱う形になりますが、Portalを使うと、

```js
class App extends React.Component {
    render() {
        <section>
            <Contents />
            {this.state.modal && ReactDOM.createPortal(
                <Modal
                    type={this.state.modal}
                    onClose={() => {
                        this.setState(() => ({modal: null}))
                    }}
                />,
                document.querySelector('.modal-container')
            )}
        </section>
    }
}
```

というように、render関数の中に書くことが出来ます。
この場合Modalは、Contentsの隣に配置されたComponentと同様に処理されます。

なので、

```js
<section>
    <div onClick={() => console.log('click')}>
        {ReactDOM.createPortal(
            <p>Portal</p>,
            document.querySelector('.somewhere')
        )}
    </div>
</section>
```

とあった場合、`<p>Portal</p>`をクリックした場合にも、`cosole.log('click')`が呼ばれます。

### ServerSide Rendering

サーバーサイドレンダリングは完全にリライトされました（既存の実装をベースに）。
これまでは、クライアントでのDOM構築と同じ流れでHTMLを構築していたのですが、下記の1ファイルに切り離されました。

* https://github.com/facebook/react/blob/master/src/renderers/shared/server/ReactPartialRenderer.js

これにより、無駄な処理が減ったことによる高速化やStreamサポートが簡単に行えるようになりました。
また、独立したファイルになったことで、今後のパフォーマンスチューニングもやりやすくなったと思います。

その他サーバーサイドレンダリングに対する変更は、Node Stream対応のAPIの追加とHydarationの方法の変更です。

Node Streamの対応については、`renderToNodeStream`と`renderToStaticNodeStream`のAPIが追加されたので、それを使うだけです。

```js
import ReactDOMServer from 'react-dom/server';

const App = () => (
    <div>
        <p>Hello Stream</p>
    </div>
);

ReactDOMServer.renderToNodeStream(<App />).pipe(process.stdin);
// <div data-reactroot=""><p>Hello Stream!</p></div>

ReactDOM.server.renderToStaticNodeStream(<App />).pipe(process.stdin);
// <div><p>Hello Stream!</p></div>
```

Hydrationの方法の変更については、クライアント側の変更とバリデーションロジックの変更があります。

ここでいうHydrationとは、サーバーサイドレンダリングで返したHTMLが生成したDOM要素を、クライアント側でのレンダリング時に再利用することを指します。

クライアント側でのAPIの変更については、`ReactDOM.render`の代わりに`ReactDOM.hydrate`という専用のAPIを使うようになります。
v16の段階では、`ReactDOM.render`によるHydrationもサポートされますが、将来的に廃止される予定です。

ちなみに、`renderToNodeStream`と`renderToStaticNodeStream`による出力の違いは、Rootの要素に`data-reactroot`があるかないかの違いだけです。この`data-reactroot`は`ReactDOM.render`でHydrationするかどうかの判定に使われているだけです。
なので、将来的にはどちらか1つのAPIだけになると思います。`ReactDOM.hydrate`を使う場合は、`renderToStaticNodeStream`で生成したHTMLに対してもHydration出来ます。

Hydrationの方法については、v15までは`renderToString`で生成したHTMLの`data-react-check-sum`という属性につけられたチェックサムを使い、クライアント側で生成したReactElementの構造が一致するかどうか判定し、一致すればDOMを再利用して一致しなければDOMを再構築する方法を採用していました。

v16では、サーバーサイドレンダリングで構築したDOMを、React.hydrateの際に可能な限り再利用しようとします。
ReactElementの構造が一致するかどうかの確認が、ReactElementの単位で行われるようになります。
（一致しない場合は、引き続きwarningが出力されます）
ただし、バリデーションするというよりも可能な限り再利用する方針であるため、サーバーサイドレンダリングした内容とのdiff次第では、意図しない結果となる場合があります。

* https://github.com/facebook/react/issues/10591

これにより、`data-react-check-sum`だけでなく、`react-text`のコメントや`data-react-id`もHTMLに付加されなりました。

### DOM Attributes

これまでは、ホワイトリストで管理された属性以外は、warningを出しつつDOMには反映されなかったのですが、v16からは反映されるようになります。
これにより、`ng-xx`とか`v-xx`みたいな属性や、一部ブラウザーが実装しているけどまだ標準化されていないような属性値も使えるようになります。
ただし、`on〜`といった属性値については、セキュリティ的なリスクから反映されません。

また、属性が期待している型とは異なる値を渡した場合に、値が反映されなくなります。
例えば`className`に`false`を渡した場合は、v15までは"false"という文字列がクラス名と設定されていましたが、v16からはwarningが出て反映されなくなります。


詳細は、下のブログに。

* https://facebook.github.io/react/blog/2017/09/08/dom-attributes-in-react-16.html

### Bundle Size

Browserifyを使ったビルドからRollupを使ったビルドに変更されて、フラットバンドルになりました。
Rollupを使って1つのモジュールとしてビルドすることで、Browserifyが付加する依存関係解決のためのコードが不要になります。
その結果、ファイルサイズの削減やブラウザー上での初回読み込みの時間が短縮されます。

reactとreact-domのv16をnpmからインストールすると、下記のような構造になっており、内部モジュールの構造は維持されていません。

* react

```
node_modules/react/
├── LICENSE
├── README.md
├── cjs
│   ├── react.development.js
│   └── react.production.min.js
├── index.js
├── node_modules
├── package.json
└── umd
    ├── react.development.js
    └── react.production.min.js
```

* react-dom

```
node_modules/react-dom/
├── LICENSE
├── README.md
├── cjs
│   ├── react-dom-server.browser.development.js
│   ├── react-dom-server.browser.production.min.js
│   ├── react-dom-server.node.development.js
│   ├── react-dom-server.node.production.min.js
│   ├── react-dom-test-utils.development.js
│   ├── react-dom-unstable-native-dependencies.development.js
│   ├── react-dom-unstable-native-dependencies.production.min.js
│   ├── react-dom.development.js
│   └── react-dom.production.min.js
├── index.js
├── node_modules
├── package.json
├── server.browser.js
├── server.js
├── test-utils.js
├── umd
│   ├── react-dom-server.browser.development.js
│   ├── react-dom-server.browser.production.min.js
│   ├── react-dom-unstable-native-dependencies.development.js
│   ├── react-dom-unstable-native-dependencies.production.min.js
│   ├── react-dom.development.js
│   └── react-dom.production.min.js
└── unstable-native-dependencies.js
```

上記の`cjs`がcommonJSのビルドが入っているディレクトリです。`〜.development.js`と`〜.production.min.js`があるのは本番用のビルドと開発用のビルドを分けるためです。
この分岐は`index.js`の中で`process.env.NODE_ENV`によって行われています。

* `node_modules/react/index.js`

```js
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}
```

これにより、Direct importと言われている`react/lib/xxx`のような形での内部モジュール参照が出来なくなります。これは、主にカスタムレンダラーの実装や内部の挙動を変更させるために行われており、そういったライブラリーを使っている場合には注意が必要です。

ちなみに、下記をwebpackとBabel(es2015とreactのprest)でビルドして、比較してみるとこんな感じでした。

```js
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <div>Hello</div>;

ReactDOM.render(<App />, document.getElementById('app'));
```

* v15.6.2

```
bundle.js  742 kB
bundle.js  151 kB // with `-p` option
```

* 16.0.0

```
bundle.js  794 kB
bundle.js  117 kB // with `-p` option
```

production buildは小さくなってますね。

また、UMDビルドのディレクトリ名とファイル名が変更になっているので、CDNから利用する場合などは注意してください。

### License

ライセンスがBSD + PATENTSからMITになりました。

* https://code.facebook.com/posts/300798627056246/relicensing-react-jest-flow-and-immutable-js/

### Addons

v15.5の時点で、廃止するアナウンスが出ていましたが、`react-addons-xxx`のパッケージは廃止になります。
基本的には、別パッケージになったりしているので使っているものがあれば下記で移行パスを確認してみてください。

* https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html#discontinuing-support-for-react-addons

`react-addons-perf`に関しては、`?react_perf`をURLにつけてBrowserのPerformanceのTimelineで計測する方法になります。

* https://facebook.github.io/react/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab

`react-with-addons.js`のようなUMDビルドももう提供されません。

## Breaking Changes

React Fiberに実装が変わったことによる、処理順の変更などが多いです。

* `ReactDOM.render`と`ReactDOM.unstable_renderIntoContainer`をライフサイクルメソッドの中で読んだ場合には`null`が返るようになります。
* `setState`で`null`を渡した場合、更新処理が行われなくなります。
* `render`の中での`setState`は常に更新処理が行われるようになります（以前はされない場合があったらしい）。そもそも`render`の中でsetStateを呼び出すべきではないですが。
* `setState`の第2引数のコールバックは`componentDidMount`と`componentDidUpdate`の後すぐに呼び出されるようになります。以前は全てのComponentがrenderされた後に呼び出されていました。 **???以前のバージョンの挙動が確認できなかった**
* `<A />`から`<B />`に置き換えたとき、`B.componentWillMount`が常に`A.componentWillUnmount`の前に呼ばれるようになります。
* 以前は、refを更新する際のデタッチ(`null`での呼び出し)はComponentのrender関数の前に呼ばれていましたが、render関数の後に変更になります。
* React以外によって、編集されたDOMに対して再度ReactDOM.renderを行った時にwarningが出るようになりました。この場合は一度ReactDOM.unmountComponentAtNodeでアンマウントしてから再度renderを行います。
* `componentDidUpdate`のライフサイクルメソッドが第3引数としてprevContextを受け取らなくなりました。
* ShallowRendererに`unstable_batchedUpdates`はもう実装されません。

下記はすでにwarningの対象で今回のバージョンで完全に削除されたものです。

* `React.createClass`が削除されました。代わりに`create-react-class`を使います。
* `React.PropTypes`が削除されました。代わりに`pro-types`を使います。
* `React.DOM.xxx`が削除されました。代わりに`react-dom-factories`を使います。

## JavaScript Environment Requirements

動作環境として、`Map`と`Set`と`requestAnimationFrame`が必要になりました。

```js
import 'core-js/es6/map';
import 'core-js/es6/set';

import raf from 'raf';
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = raf;
    // or
    window.requestAnimationFrame = cb => {
        setTimeout(cb, 0);
    }
}
```

## React Fiber

React Fiberについてはすでに書いたので省略しますが、v16の時点ではv15と互換性のある同期モードで動作します。
したがって、v16にあげたからといって、大きくパフォーマンスが向上したりするようなことはありません（多少のパフォーマンスが上がるかもですが）。

現時点では、いくつかの方法を使うことで、非同期renderingを試すことができるので紹介します。ただし、非同期rendering周りはまだ安定しておらず、コードもガンガン変わっているので注意が必要です。

### ReactDOM.unstable_deferredUpdates

`ReactDOM.unstable_deferredUpdates`で囲んだ中での`setState`などの更新処理は、Low Priorityとして扱われて、requestIdleCallbackを使って非同期に処理されます。

```js
ReactDOM.unstable_deferredUpdates(() => {
    this.setState(() => newState);
});
```

### React.unstable_AsyncComponent

`React.unstable_AsyncComponent`の中で起きた更新処理はLow Priorityとして扱われるようになります。
直接Componentとして使う方法と、PureComponentのようにextends対象として使う方法があります。

```js
const AsyncComponent = React.unstable_AsyncComponent;

ReactDOM.render(
    <AsyncComponent><App /></AsyncComponent>,
    container
);

// or

class App extends AsyncComponent {
}
```

### ReactDOM.flushSync

`ReactDOM.flushSync`で囲んだ中での更新処理は、同期(Sync)のPriorityとして扱われます。
v16ではデフォルトが同期のPriorityなので、効果ありませんが、上記のunstableなAPIの中で同期的な更新を行いたい場合に、使用します。

```js
ReactDOM.flushSync(() => {
    this.setState(() => newState);
});
```

あとは、今後の非同期renderingに備えて、既存のStateの値を元に更新処理を行う場合は、第1引数に関数を渡す方法でのsetState呼び出しをするようにしておいた方がいいと思います。

```js
this.setState(newState)
// ↓↓↓
this.setState(prevState => newState);
```

React Fiberでは、柔軟なスケジューリングを可能にすることで、UIのレスポンス性を向上させることが目的です。

## Custom Renderer

Custom Rendererを実装するためのパッケージはv16には間に合いませんでしたが、下記のPRで作業中なので、気になる人はwatchしておくといいと思います。

* https://github.com/facebook/react/pull/10758

## Test Renderer

主にsnapshot testingなどで使われていたTest Rendererに便利なAPIが追加されて使いやすくなりました。
Shallow Rendereは指定したComponentだけがrenderされますが、Test Rendererはツリー全体をrenderします。

下記のように`find〜`や`findAll〜`のAPIが追加されており、インスタンスにもアクセスできるため、`setState`を呼び出したりもできます。
また、Test RendererはReact Fiberに対するRendererとして実装されているため、React Fiberが提供する機能を利用できます。

```js
import React from 'react';
import TestRenderer from 'react-test-renderer';

const Child = props => <div>{props.children}</div>;
const Counter = props => <div>{props.count}</div>;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  render() {
    return (
      <section>
        <div>bar</div>
        <Child><p>Hello</p></Child>
        <div>bar</div>
        <button onClick={() => this.setState({count: this.state.count + 1})}>
          ++
        </button>
        <Counter count={this.state.count} />
      </section>
    );
  }
}

const root = TestRenderer.create(<App />).root;

// find a component by Type
console.assert(root.find(node => node.type === Child).props.children.type === 'p');
// find a component by Props
console.assert(root.findByProps({children: 'Hello'}).type === 'p');

// find all components by Type
console.assert(root.findAllByType('div').length === 4);

// initial state
const instance = root.instance;
console.assert(root.findByType(Counter).props.count === 0);
console.assert(instance.state.count === 0);

// click the button
const button = root.findByType('button').props.onClick();
console.assert(root.findByType(Counter).props.count === 1);
console.assert(instance.state.count === 1);

// setState directly
instance.setState({count: instance.state.count + 1});
console.assert(root.findByType(Counter).props.count === 2);
console.assert(instance.state.count === 2);
```

後、DOMComponentのrefに対するMockの挙動を定義することもできます。

Test Rendererのドキュメントを書いてみたので、そちらも参照してみてください。

* https://facebook.github.io/react/docs/test-renderer.html

英語ですがブログも書いたのでそっちも。

* https://medium.com/@koba04/testing-react-components-with-react-test-renderer-b4df590d0320

## Enzyme

`enzyme`も同じタイミングでv3がリリースされました。
v3からはAdapterのアーキテクチャになっており、対象とするReactのバージョンに応じたAdapterをインストールして設定します。

```js
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
```

上記をNodeやMochaの`--require`オプションに設定したり、Jestの`setupFiles`に定義すれば毎回書く必要はありません。

これにより、今後はpreactのアプリケーションもサポートできるようになるかもしれません。

* https://github.com/aweary/preact-enzyme-adapater
