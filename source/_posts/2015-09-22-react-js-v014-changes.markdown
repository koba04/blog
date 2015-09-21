---
layout: post
title: "React.js v0.14 changes"
date: 2015-09-22 00:00:00 +0900
comments: true
categories: react.js
---

React v0.14のRC版が出たので紹介したいと思います。
http://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html

インストールはnpmからバージョン指定でインストールするかscriptを読み込むことで試すことが出来ます。
`react-dom`が何なのかは後ほど説明します。

```
npm install react@0.14.0-rc1
npm install react-dom@0.14.0-rc1
```

or

```html
<script src="https://fb.me/react-0.14.0-rc1.js"></script>
<!--  https://fb.me/react-with-addons-0.14.0-rc1.js -->
<script src="https://fb.me/react-dom-0.14.0-rc1.js"></script>
```

<!-- more -->

## Major changes

### ReactとReactDOMのパッケージが分割されました

`react-native`や`react-canvas`など、DOM以外の環境で使われるようになってくる中で、Reactのコアの部分とDOMに関わる部分がパッケージとして分割されるようになりました。

Reactのパッケージには、`React.createElement`、`React.createClass`、`React.Component`、`React.PropTypes`、`React.Children`が含まれています。

ReactDOMのパッケージには、`ReactDOM.render`、`ReactDOM.unmountComponentAtNode`、`ReactDOM.findDOMNod`が含まれています。
また、ReactDOMのパッケージには`react-dom/server`として`ReactDOMServer.renderToString`と`ReactDOMServer.renderToStaticMarkup`が含まれています。

```js
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() [
    return <div>Hello</div>
  ]
}

ReactDOM.render(<App />, document.getElementById('app'));

// サーバーサイド
import ReactDOMServer from 'react-dom/server';
const html  = ReactDOMServer.renderToString(<App />);
```

scriptタグで読み込んで利用する場合は、ReactとReactDOMそれぞれを読み込んで利用する必要があります。

```html
<script src="https://fb.me/react-0.14.0-rc1.js"></script>
<script src="https://fb.me/react-dom-0.14.0-rc1.js"></script>
<div id="app"></div>
<script>
var App = React.createClass({
	render: function() {
        return React.createElement('div', {}, 'hello', 'world');
    }
});

ReactDOM.render(React.createElement(App), document.getElementById('app'));
</script>
```

codemodも提供されているので既存のコードを一括で変換したい場合は使ってみるといいかもしれません。
https://github.com/facebook/react/blob/master/packages/react-codemod/README.md

#### Addons

また、Addonもそれぞれ個別のパッケージに分割されたので必要に応じてnpmでインストールするようになりました。

* react-addons-clone-with-props
* react-addons-create-fragment
* react-addons-css-transition-group
* react-addons-linked-state-mixin
* react-addons-perf
* react-addons-pure-render-mixin
* react-addons-shallow-compare
* react-addons-test-utils
* react-addons-transition-group
* react-addons-update

これによって、1つのAddonを使いたい時にその他全部のAddonがbundleされることがなくなりました。
scriptタグで読み込むための`react-with-addons`のJSにはこれまで通り全てのAddonが含まれています。

また、`batched_updates`としてあったReactのイベントやライフサイクル以外でもバッチによる一括アップデートを行えるAddonは`ReactDOM.unstable_batchedUpdates`に移動しました。

```js
let count = 0;
cost component = ReactDOM.render(<App />, document.getElementById('app'));
ReactDOM.unstable_batchedUpdates(() => {
  component.setState({count: ++count});
  component.setState({count: ++count});
});
```

ちなみにunstable_batchedUpdatesという名前になっているけど今後どうする予定なのかを聞いたところ、全ての更新をバッチ更新にしたいということだったので最終的には不必要にしたいようです。


**ReactとReactDOMやAddon** のパッケージは意図しない挙動を避けるために同じバージョンを使うことが推奨されています。


### DOMComponentに対するrefによる参照でDOM Nodeが取得出来るようになりました

これまでDOM node`React.findDOMNode(this.refs.div)` のようにする必要がありましたが、`this.refs.div`で直接DOM nodeを取得することが出来るようになりました。
findDOMNodeの呼び出しを書かなくてもいいというだけですが簡単になりました。
それと同時にrefでのComponentの参照はDOM Component以外では使わないようにしておかないと混乱を招きそうではあります。

また、`ReactDOM.render(<div>foo</div>)` とした場合の返り値もDOM Nodeになります。
ReactDOM.findDOMNodeは以降もComposite Componentに対するDOM nodeを取得する場合に利用することが出来ます。

### Stateless Components

Propsだけに依存するような状態を持たないComponentを定義するための新しい方法が追加されました。

```js
function Hello(props) {
  return <div>Hello {props.name}
}

// Arrow Functions
const Hello = (props) => {
  return <div>Hello {props.name}</div>;
};

// Arror Functions and Destructuring Assignment
const Hello = ({name}) => {
  return <div>Hello {name}</div>;
}
```

また、PropTypesやdefaultPropsも定義することが出来ます。

```js
function Hello(props) {
  return <div>Hello {props.name}
}
Hello.propTypes = {
  name: React.PropTypes.string
};
Hello.defaultProps = {
  name: 'World'
};
```

あとContextも。

```js
function Hello(props, context) {
  return <div>{context.version}</div>
}
Hello.contextTypes = {
  version: React.PropTypes.number
}
```

v0.14では最低限の実装のみになっていますが、以降のバージョンではStateless Componentsで書いておくことでパフォーマンス最適化の恩恵が受けられるようになる予定です。
v0.14以降ではStateless ComponentsがComponent定義の第一の選択肢になっていきそうです。

### react-toolsは廃止されました

これは以前にもブログで紹介されていましたが、`react-tools`は非推奨になります(もう更新されない)。代わりにBabelを利用しましょう。

http://facebook.github.io/react/blog/2015/06/12/deprecating-jstransform-and-react-tools.html

* jsxコマンドは`babel`コマンドになります。
* browserifyのtransformであるreactifyは`babelify`になります。
* webpackのjsx-loaderは`babel-loader`になります
* Node.jsのサーバー上で動かすときに`require('node-jsx').install()`としていたものは`require('babel/register')`になります。
* ブラウザでJSXを変換するために使うJSXTransformはbabel-core/browser.jsを読み込んでtypeを`text/babel`にして使用します。

```html
<script src="https://fb.me/react-0.14.0-rc1.js"></script>
<script src="https://fb.me/react-dom-0.14.0-rc1.js"></script>
<script src="node_modules/babel-core/browser.js"></script>
<script type="text/babel">
const Hello = ({name}) => <div>{name}</div>
</script>
```

ちなみにBabelは6.0でTransformが全て外出しになり使う場合はpluginとして読み込みようになることが予定されています。

```
"plugins": ["preset-es2015", "preset-react"]
```

### Babelによるコンパイル最適化が実施されるようになりました

Babel5.8.23以降のバージョンを利用することで、`inlineElements`と`constantElements`を２つの最適化を行うことが出来るようになります。
これらは開発用のwarningやPropTypesによるチェックを無効化するので、productionモードの場合だけで有効にすることが推奨されています。

下記のコードを元に変換内容を確認してみます。

```js
// hello.js
class App extends React.Component {
  render() {
    return (
      <div>
        <p>Hello</p>
        <p>{this.props.name}</p>
      </div>
    )
  }
}
```

最適化なし

```js
var App = (function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          "Hello"
        ),
        React.createElement(
          "p",
          null,
          this.props.name
        )
      );
    }
  }]);

  return App;
})(React.Component);
```

#### inlineElements

inlineElementsの最適化を行うことでJSXの変換が`React.createElement`への変換ではなくてただのオブジェクトへの変換となります。


```
babel --optional optimisation.react.inlineElements test.js
```

```js
_createClass(App, [{
  key: "render",
  value: function render() {
    return {
      $$typeof: _typeofReactElement,
      type: "div",
      key: null,
      ref: null,
      props: {
        children: [{
          $$typeof: _typeofReactElement,
          type: "p",
          key: null,
          ref: null,
          props: {
            children: "Hello"
          },
          _owner: null
        }, {
          $$typeof: _typeofReactElement,
          type: "p",
          key: null,
          ref: null,
          props: {
            children: this.props.name
          },
          _owner: null
        }]
      },
      _owner: null
    };
  }
}]);

return App;
})(React.Component);
```

#### constantElements

`constantElements`では、変数の含まれていないReactElementに対する呼び出しを`render`の外に出すことで不必要な`React.createElement`の呼び出しを避ける事が出来ます。

```
babel --optional optimisation.react.constantElements test.js
```

```js
var _ref = React.createElement(
  "p",
  null,
  "Hello"
);

var App = (function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        _ref,
        React.createElement(
          "p",
          null,
          this.props.name
        )
      );
    }
  }]);

  return App;
})(React.Component);
```

## Breaking changes

ここでのBreaking changeはv0.13でwarningとして出力されていたものです。

* Propsは変更不可として扱われます。開発用のビルドでは`Object.freeze`されています。Propsの値を変更したい場合は、`React.cloneElement`によって再生成する必要があります。
* childrenにオブジェクト形式で渡すことはサポートされなくなりました。配列に変更するか`react-addons-create-fragment`を使う必要があります。
* `classSet`は削除されたので代わりに`classnames`のnpm packageを利用してください。

-----------

以下はv0.13でwarningが出力されていなかったものですが、簡単に修正することが出来る変更点です。

* `React.initializeTouchEvents`は不要になったので削除してください。タッチイベントはデフォルトでサポートされるようになりました。
* 前述したDOM Componentに対するrefの変更により、`TestUtils.findAllInRenderedTree`とそれに関連するhelperはComposite Componentのみを受け取るようになりました。(`scryRendered〜`、`findRendered〜`系のTestUtils)

## Deprecations

* `getDOMNode`は非推奨になったので代わりに`ReactDOM.findDOMNode`を利用してください。前述したとおりDOM Componentの場合は`ReactDOM.findDOMNode`も不要です。
* `setProps`と`replaceProps`は非推奨になります。代わりに親のComponentから再度`ReactDOM.render`を呼んでください。
* ES6 ClassesによるComponent定義で`React.Component`を継承することが必須になりました。[ES3 module pattern](http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#other-languages)はまだ使用することが出来ます。
* `style`のPropsを別のrenderと共有し変更することはPropsが変更不可として扱われる影響で非推奨となりました。
* `react-addons-clone-with-props`は非推奨になりました。代わりに`React.cloneElement`を使用してください。`cloneElement`は`cloneWithProps`と違い、`className`と`style`のmergeは行いません。必要であれば開発者がmergeする必要があります。
* 信頼性向上のために`react-addons-css-transition-group`がtransition eventをlistenしなくなりました。そのため`transitionEnterTimeout={500}`のように明示的にdurationをPropsに指定する必要があります。

## Enhancements

* `React.Children.toArray`が追加されました。ネストしたchildrenを受け取りkeyを設定したフラットな配列として返すことが出来ます。また`React.Children.map`もただの配列を返すようになりました。

```js
React.Children.toArray(
  [
    <div>foo</div>, <div>bar</div>,
    [<div>baz</div>]
  ]
);

// [<div key=".0">foo</div>, <div key=".1">bar</div>, <div key=".2:0">baz</div>]
```

* `console.warn`の代わりに`console.error`でwarningを出力するようになりました(stack traceを出すため)。`console.error`として出力されるwarningは将来のバージョンで壊れるような使い方をしていた場合であり、`must-fix`なエラーとして扱われるべきです。

* 可能であればReactDOMがXHTML互換なHTMLを生成するようになりました。

* ReactDOMが`capture、challenge、inputMode、is、keyParams、keyType、minLength、summary、wrap`といった標準の属性や`autoSave、results、security`といった非標準な属性をサポートするようになりました。

* SVG属性のサポートが追加されました。

```
xlinkActuate、xlinkArcrole、xlinkHref、xlinkRole、xlinkShow、xlinkTitle、xlinkType、xmlBase、xmlLang、xmlSpace
```

* `image`のSVGタグがサポートされました。

* custome elementsで任意の属性がサポートされるようになりました。

* `audio`と`video`タグに対するイベントのサポートが追加されました。

```
onAbort、onCanPlay、onCanPlayThrough、onDurationChange、onEmptied、onEncrypted、onEnded、onError
onLoadedData、onLoadedMetadata、onLoadStart、onPause、onPlay、onPlaying
onProgress、onRateChange、onSeeked、onSeeking、onStalled、onSuspend、onTimeUpdate、onVolumeChange、onWaiting
```

* `shallowCompare`のAddonがES6 ClassesのComponentで`PureRenderMixn`を使うためのマイグレーションのパスとして用意されました。

* `CSSTransitionGroup`が`xxx-enter-active`のようにclassNameに追加する名前を任意に指定出来るようになりました。

```js
<ReactCSSTransitionGroup
   transitionName={
     enter: 'enter',
     enterActive: 'enterActive',
     leave: 'leave',
     leaveActive: 'leaveActive',
     appear: 'appear',
     appearActive: 'appearActive'
   }>
   {item}
 </ReactCSSTransitionGroup>

 <ReactCSSTransitionGroup
   transitionName={
     enter: 'enter',
     leave: 'leave',
     appear: 'appear'
   }>
   {item2}
 </ReactCSSTransitionGroup>
```

## Helpful warnings

* ReactDOMがHTML構造と不正な要素を受け取った時点でwarningを出力するようになり、更新時に突然エラーとして表面化するよりわかりやすくなりました。

* `document.body`に対して`ReactDOM.render`使用するとwarningを出力するようになりました。

* 複数の異なるReactのオブジェクトを同時に利用しようとした場合に、warningを出力するようになりました。これはnpmとbrowserifyなどを組み合わせている場合に意図せずに起こってしまうことがあります。

## Bug fixes

* Mobile Browsersにおいてのクリックイベントのハンドリング(cursor: pointer周り？)にあったバグが修正されました。(特にMobile Safari)

* SVG Elementが多くの場合で正しい名前空間と一緒に描画されるようになりました。

* ReactDOMで複数のchildrenを持ったoptionの場合(`<select><option value={val}>{label}:{val}</option></select>`)にエラーとなっていたバグが修正されました。

* サーバーサイドレンダリング時にselectタグのvalueがoptionタグのselectedとして反映されるようになりました。

* 同じdocumentに対して複数のReactのオブジェクトで要素を追加した状態になった時、イベントハンドリングのタイミングで発生していたエラーがなるべく起きないようになりました。但し、radio buttonを同じnameでrenderしていた場合などエラーになる状況は残っています。

* 小文字でないHTMLタグ名をReactDOMで使った場合でも問題にならないようになりました。ただしDOM Componentの場合には小文字で指定することを変わらずに推奨します。

* ReactDOMが`animationIterationCount`、`boxOrdinalGroup`、`flexOrder`、`tabSize`、`stopOpacity`のCSSプロパティに対して'px'を追加しないようになりました。

* `react-addons-test-utils`で`Simulate.mouseEnter`と`Simulate.mouseLeave`が利用可能になりました。

* `react-addons-transition-group`で複数のnodeが同時に削除された場合にも正しく処理出来るようになりました。

## ReactElement tags by Symbol

https://github.com/facebook/react/pull/4832

Reactではv0.14から`React.createElement`でReactElementのインスタンスではなくてただのオブジェクトが返ってくるようになっていたり、上の方で紹介したBabelによるinlineElementsの最適化によってcreateElementの呼び出しがただのオブジェクトに変換されることからも分かる通り、オブジェクトをそのままVIRTUAL DOMとして扱いDOMを生成することが出来ます。
前提としてユーザーが任意のオブジェクトをそのままReactElementとして描画出来ること自体が問題でありますが、ユーザーによって作成されるオブジェクトをそのままrenderに渡していると意図しないコンテンツを表示されたりXSSのリスクがあります。

* [How Much XSS Vulnerability Protection is React Responsible For? #3473](https://github.com/facebook/react/issues/3473)

そのため、信頼されたReactElementかどうかを判別するための方法が議論されていました。セキュリティに興味のある人はこの辺りのissueを見てみると面白いと思います。

* [[RFC] Trusted sources for React elements. #3583](https://github.com/facebook/react/pull/3583)

Reactでは最初はinstanceofでReactElementかどうかのチェックが行われていたのですが、それだと常にReactElementのインスタンスである必要がありオブジェクト化による最適化や複数のReactを使っていた場合にチェックが失敗するなど制限が多くなってしまいます。そのため、`_isReactElement`というがtrueかどうかをみるように変わりましたがこれでは信頼されたオブジェクトであるかを判定することは出来ません。

ユーザーが`_isReactElement`をオブジェクトに指定することでReactElementとして評価され、さらにReactには`dangerouslySetInnerHTML`というPropでHTMLをそのまま渡すことが出来るので...。

```js
{
  type:"div",
  _isReactElement: true,
  props: {
    dangerouslySetInnerHTML: {
      __html: "<img onload='alert(123)' src='/favicon.ico' />".
    }
  }
}
```

v0.14ではSymbolを使って信頼されたReactElementかどうかを判定するようになります。

* [Use a Symbol to tag every ReactElement #4832](https://github.com/facebook/react/pull/4832)

### How it works?

```js
var TYPE_SYMBOL = (typeof Symbol === 'function' && Symbol.for &&
                  Symbol.for('react.element')) || 0xeac7;
```
* https://github.com/sebmarkbage/react/blob/031fc24daeae6bcdc5e5f6959b778e1c2ed5f378/src/isomorphic/classic/element/ReactElement.js#L20-L21

上記のようにSymbolを保持していおいて、それを`React.createElement`で作成したObjectにも`$$typeof`というpropertyとして渡しておいて、ReactElementが有効であるかを返す`isValidElement`という関数の中の比較で利用しています。

`Symbol.for`は指定されたSymbolがあればそれを返しなければ作成して返すので、グローバルなSymbolとして扱うことが出来ます。これによってただのオブジェクトも複数のReactを使っていた場合もサポートすることが出来ます。
(複数のReactがある場合は既に書いた通り別途warningが出ます)

Symbolが実装されていないような環境だと固定の値(0xeac7)になるので、この機能を有効にしたい場合はSymbolのpolyfillを入れておく必要があります。

https://kangax.github.io/compat-table/es6/#Symbol

また、BabelのinlineElementsの最適化を使った場合にどうなるんだと思った人もいると思いますがすでに対応されて5.8.24としてリリースにされています。

https://github.com/babel/babel/pull/2352

## v0.15?

v0.15はGarbage collection releaseと位置づけられていて、つまりAPIの整理などに重点が置かれたリリースになる予定でv0.14のリリースから遠くないタイミングで出るそうです。
