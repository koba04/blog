---
layout: post
title: "React.js v0.13 changes"
date: 2015-03-02 23:23:28 +0900
comments: true
categories: 
---

React.js v0.13のRCがリリースされて、blogで変更点についても説明があったのでまとめてみます。

* http://facebook.github.io/react/blog/2015/02/24/react-v0.13-rc1.html
* http://facebook.github.io/react/blog/2015/02/24/streamlining-react-elements.html

<!-- more -->


## React Core


### Breaking Changes

* `props`をelement作成後に変更することはdeprecatedになってwarningが出るようになりました(development only)。これは今後`props`がimmutableであることを前提としたパフォーマンスチューニングを行うことへの布石のようです。
  * 詳しくは後半のReactElementの変更についてのところで書きます。

* `statics`内に定義されたメソッドをonClickなどにバインドするときにautobindingされなくなりました。

```js
class Hello extends React.Component {
  statics: {
    foo() {
      this.bar();  // v0.13では呼べない
    },
    bar() {
      console.log("bar");
    }
  }
  render() {
    return <div>hello <button onClick={Hello.foo}>click</button>;
  }
}
```

* `ref`を設定する処理の順番が変わりました。`ref`に指定されたcomponentの`componentDidMount`が呼ばれた後になります。親のcomponentのcallbackを`componentDidMount`の中で読んでいる場合だけ気にする必要があります。そもそれもこれはアンチパターンなので避けるべきです。
  * `componentDidMount`は子のcomponentから順番に呼ばれるので下記の`refDiv`はChildの`componentDidMount`の時点では設定されていません。
  
```js
class Hello extends React.Component {
  foo() {
    console.log(this.refs.refDiv);
  }
  render() {
    return (
      <div>
        <Child foo={this.foo} />
        <div ref="refDiv">hello</div>
      </div>
    );
  }
}

class Child extends React.Component {
  componentDidMount() {
    this.props.foo(); // v0.13 "undefined"
  }
  render() {
    return <div>child</div>;
  }
}
```

* ライフサイクルメソッドの中での`setState`の呼び出しが常に非同期でバッチとして処理されます。以前は最初のマウント時の初回の呼び出しは同期的に行われていました。

```
componentDidMount() {
  console.log(this.state.count) // 0
  this.setState({ count: this.state.count + 1 }) // v0.13 state.count is 1 (v0.12 state.count is 0) 
  this.setState({ count: this.state.count + 1 }) // v0.13 state.count is 2 (v0.12 state.count is 0)
}
```

* `setState`と`forceUpdate`をアンマウントされたcomponentで呼んだときにエラーを投げる代わりにwarningが出るようになりました。
  * `isMounted`でブロックしなくてもよくなったのはいいですね。

* `this._pendingState`や`this._rootNodeID`などのprivateなプロパティが削除されました。


### New Features

* ES6 classesによるReactComponentの作成がサポートされました。
  * これについてはここに書きました。
  * http://blog.koba04.com/post/2015/01/28/published-react-v0.13.0-beta1/

* `React.findDOMNode(component)`のAPIが追加されました。これは既存の`component.getDOMNode()`を置き換えるAPIです。
  * `getDOMNode()`はES6 classesによって作成されたcomponentでは提供されていません。

* `ref`がcallbackスタイルで指定できるようになりました。
  * `<Photo ref={(c) => this._photo = c} />`
  * この変更はこの後で書く`owner`の扱いの変更に関係しています。

* `this.setState()`が第1引数に関数を受け取れるようになりました。 `this.setState((state, props) => ({count: state.count + 1}));`のようにすることで`this._pendingState`を使うことなくトランザクションが必要とされるstateの更新を行うことが出来ます。

```js
console.log(this.state.count) // 0
this.setState({ count: this.state.count + 1 }) // state.count is 0
this.setState({ count: this.state.count + 1 }) // state.count is 0
// state.count will render as 1

console.log(this.state.count) // 0
this.setState(function(state, props) { return { count: state.count + 1 } }); // state.count is 0
this.setState(function(state, props) { return { count: state.count + 1 } }); // state.count is 0
// state.count will render as 2
```

* childrenにiteratorやimmutable-jsのsequencesを指定出来るようになりました。immutable-jsを使っている人にとってはいいですね。


### Deprecations

* `ComponentClass.type`はdeprecatedなので`ComponentClass`をそのまま使ってください。
* ES6 classesによって作成されたComponentには`createClass`にはある`getDOMNode`、`setProps`、`replaceState`が含まれていません。


## React with Add-Ons


### Deprecations

* `React.addons.classSet`はdeprecatedです。必要な場合は[classnames](https://www.npmjs.com/package/classnames)などを使用してください。


## React Tools

### Breaking Changes

* ES6 syntaxで変換した際に、classメソッドがdefaultではenumerableではなくなりました。`Object.defineProperty`を使用しているため、IE8などをサポートしたい場合は`--target es3`optionを渡す必要があります。

### New Features

* jsxコマンドで`--target`optionとしてECMAScript versionを指定出来るようになりました。
  * `es5`がデフォルトです。
  * `es3`はこれまでの挙動です。追加で予約語を安全に扱うようになりました(eg `this.static`は`this['static']`にIE8での互換性のために変換されます)。

```js original
class Hello extends React.Component {
  foo() {
    console.log("foo");
  }
  render() {
    return <div>hello</div>;
  }
}
Hello.static = {
  bar() {
    console.log("bar");
  }
};
```

```js es5
var ____Class0=React.Component;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){Hello[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;Hello.prototype=Object.create(____SuperProtoOf____Class0);Hello.prototype.constructor=Hello;Hello.__superConstructor__=____Class0;function Hello(){"use strict";if(____Class0!==null){____Class0.apply(this,arguments);}}
  Object.defineProperty(Hello.prototype,"foo",{writable:true,configurable:true,value:function() {"use strict";
    console.log("foo");
  }});
  Object.defineProperty(Hello.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
    return React.createElement("div", null, "hello");
  }});

Hello.static = {
  bar:function() {
    console.log("bar");
  }
};
```

```js es3
var ____Class0=React.Component;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){Hello[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;Hello.prototype=Object.create(____SuperProtoOf____Class0);Hello.prototype.constructor=Hello;Hello.__superConstructor__=____Class0;function Hello(){"use strict";if(____Class0!==null){____Class0.apply(this,arguments);}}
  Hello.prototype.foo=function() {"use strict";
    console.log("foo");
  };
  Hello.prototype.render=function() {"use strict";
    return React.createElement("div", null, "hello");
  };

Hello["static"] = {
  bar:function() {
    console.log("bar");
  }
};
```

* またspreead operatorも有効になりました(JSXの中ではこれまでもspread attributesとしてサポートしていましたが)。


## JSX

### Breaking Changes

* JSXのparseに変更があります。elementの内側に`>` or `}` を使った時に以前は文字列として扱われましたがparseエラーになります。

```js
render() {
  return <div>} or ></div>; // parse error!
}
```


------------



## ReactElement

ここからはReact v0.13でのReactElementの変更について書きたいと思います。
v0.13ではReactElementの挙動の変更はありませんが、v0.14での変更を見据えていくつかのwarningが仕込まれています。

ReactをReactらしく使っていればwarningを目にすることはないはずで、この変更はシンプルな構文、よりわかりやすいエラーメッセージやstacktrace、コンパイルの最適化のためのものです。


## Immutable Props

propsを変更するとwarningが出るようになります。

```js
var element = <Foo bar={false} />;
if (shouldUseFoo) {
  element.props.foo = 10;
  element.props.bar = true;
}
```


### Problem: Mutating Props You Don’t Own

`props`を直接変更してしまうと元の値を破棄してしまうのでdiffがなくなってしまいます。

```js
var element = this.props.child;
element.props.count = this.state.count;
return element;
```

ここでは`props.child`を通じてpropsをレンダリングする前に変更しています。この時、`props.child`は同じReactElementのままでpropsが更新された状態になります。

この場合、componentやそれ以下のcomponentが`shouldComponentUpdate`を実装していた時に、DOM構造に差分があるのに実際には反映されない可能性があります。
なぜなら、propsを直接変更しているために`shouldComponentUpdate`での比較時に更新前後のpropsが同じオブジェクトを指しているために差分を検出出来ないからです。
なのでこの場合、初回を除いて変更が伝播しなくなる可能性があります。

渡されたpropsを変更することは常に間違っていて、そのときにwarningで伝えることが出来ていない点が問題です。


### Problem: Too Late Validation

v0.12では`PropTypes`のvalidationをmount時に内部の深いところで行っていましたが、これはエラー時のstacktraceが深くなってしまいデバックを難しくする問題がありました。
createElementからmountまでの間validationを行う必要がありますが、Flowによる静的解析にとってもそれは都合のいいタイミングではありません。


### Solution: Immutable Props

上記のProblemから、propsはimmutableでcreateElementの時点で変更不可なものとして扱いたいので、v0.13ではpropsを変更するとwarningが出るようになります。

ReactElementを動的に出し分けたい場合はこんな感じにすることが出来ます。

```js
if (shouldUseFoo) {
  return <Foo foo={10} bar={true} />;
} else {
  return <Foo bar={false} />;
}
```

また、spread attributesを使うことも出来ます。

```js
var props = { bar: false };
if (shouldUseFoo) {
  props.foo = 10;
  props.bar = true;
}
return <Foo {...props} />;
```

現時点ではネストしたオブジェクトについては変更してもwarningは出ません。

```js
return <Foo nestedObject={this.state.myModel} />;
```

基本的にはimmutable.jsなどを使って完全にimmutableに扱った方がいいですが、変更可能なオブジェクトは多くの場面で便利だし今回はネストしたオブジェクトはwarningの対象外となりました。


### Solution: Early PropType Warnings

また、PropTypesのwarningをReactElementの作成時に行うなうようになりました。これによってstacktraceの深さが改善されます。FlowもまたPropTypesのvalidationをReactElementの作成時に行うようになります。


↓のようにcloneしてReactElementに新しいpropsを追加するのは正しい方法です。

```js
var element1 = <Foo />; // extra prop is optional
var element2 = React.addons.cloneWithProps(element1, { extra: 'prop' });
```


## Owner

Reactは"parent"と"owner"を持っています。"owner"はReactElementを作ったcomponentです。

```js
class Foo {
  render() {
    return <div><span /></div>;
  }
}
```

この場合、`span`のownerは`Foo`でparentは`div`です。

またdocument化されていないfeatureとして、"owner"から子に渡すことが出来る"context"というものがあります。

簡単にコードを書くとこんな感じです。見てもらえればどんなfeatureなのかわかるかと思います。

```js
var Parent = React.createClass({
    childContextTypes: {
      name: React.PropTypes.string,
      age: React.PropTypes.number
    },
    getChildContext: function() {
      return {
        name: "parent",
        age: 50
      };
  },
  render: function() {
    return <Child />;
  }
});

var Child = React.createClass({
    contextTypes: {
      name: React.PropTypes.string,
      age: React.PropTypes.number
    },
    componentDidMount: function() {
      console.log("Child",this.context); // {name: "parent", age: 50}
    },
    render: function() {
      return <GrandChild />;
    }
});

var GrandChild = React.createClass({
    contextTypes: {
      name: React.PropTypes.string
    },
    componentDidMount: function() {
      console.log("GrandChild",this.context); // {name: "parent"}
    },
    render: function() {
      return <div>hello</div>;
    }
});

React.render(<Parent />, document.body);
```


### Problem: The Semantics are Opaque and Confusing

ownerは密かにReactElementに追加されているので気づかないうちに挙動が変わることが発生します。

```js
var foo = <input className="foo" />;
class Component {
  render() {
    return bar ? <input className="bar" /> : foo;
  }
}
```

↑のそれぞれのinputはownerが異なりますし変更したことを示すものはありません。
また、`React.addons.cloneWithProps`を使った場合もownerが変わります。


### Problem: Timing Matters

ownerは実行時のstackによって決定します。

```js
class A {
  render() {
    return <B renderer={text => <span>{text}</span>} />;
  }
}
class B {
  render() {
    return this.props.renderer('foo');
  }
}
```

`span`のonwerは実際は`B`で`A`ではありません。これはcallbackが実行されたタイミングに依存するからです。


### Problem: It Couples JSX to React

なぜJSXがReactに依存してるのか不思議に思ったことはありませんか？
なぜtranspilerがruntimeに埋め込むことができないのかと。
それはReactが現在のownerを保持していてそれに依存しているからです。
これがなければReactがscopeに定義されている必要はありません。


### Solution: Make Context Parent-Based Instead of Owner-Based

ownerベースのContextを使っていてparentベースのContextと一致しない場合にwarningが出るようになります。
その代わりにparentベースのContextを考えています。
ほとんどのケースはparentベースのContextでも問題ないです。


### Solution: Remove the Semantic Implications of Owner

ownerベースのContextが必要になる場合はほとんどないはずだし、そうすべきではありません。
おかしな最適化などをしていない限りこのwarningを見ることはないでしょう。

### Pending: Change the refs Semantics

`refs`はまだownerベースのままで、これについてはまだ完全に解決出来ていません。

v0.13ではcallbackでもrefが定義出来るようなりましたがこれまでの宣言的な定義方法も残されています。
これに代わるいい方法がない限りこのAPIは廃止されません。


### Keyed Objects as Maps

v0.12では`{key: element}`の形式でkeyが指定したらelementを渡すことが出来ました。
ですがこれはあまり使われてないし問題となる場合があるので使うべきではありません。

```js
<div>{ {a: <span />, b: <span />} }</div>
```

### Problem: Relies on Enumeration Order

問題点の一つが列挙される順番です。
これは列挙される順番はkeyに数値を指定した場合を除いては仕様として定義されてないので実装次第です。


### Problem: Using Objects as Maps is Bad

一般的にobjectをmapとして扱うことは型システムやVMの最適化やコンパイラーにとって好ましくないです。
この場合、ES6のMapのようなデータ構造を使ったほうがいいです。

といいながらMap使うとこんなwarningが出ますが...。

```
Warning: Using Maps as children is not yet fully supported. It is an experimental feature that might be removed. Convert it to a sequence / iterable of keyed ReactElements instead.
```

重要なのはセキュリティ上のリスクもあって、↓のような場合にもし`item.title === '__proto__'` を指定されたら....

```js
var children = {};
items.forEach(item => children[item.title] = <span />);
return <div>{children}</div>;
```

### Problem: Can’t be Differentiated from Arbitrary Objects

これらのObjectと区別するために、ReactElementは`_isReactElement`というpropertyを持っています。
これによって、インラインのReactElementをシンプルなObjectとして扱った時の問題を避けています。


### Solution: Just use an Array and key={…}

ほとんどの場合、`key`を設定したReactElementの配列にすれば問題ないはずです。

```js
var children = items.map(item => <span key={item.title} />);
<div>{children}</div>
```

### Solution: React.addons.createFragment

しかしながら、`this.props.childred`を使った場合など、`key`を指定することが出来ない場合もあるかもしれません。
その場合、追加された`React.addons.createFragment`を使うことでKeyed ObjectからReactElementを作成することが出来ます。

```js
<div>{React.addons.createFragment({ a: <div />, b: this.props.children })}</div>
```

これはimmutable sequenceのように遅延評価されます。
The exact signature of this kind of fragment will be determined later. It will likely be some kind of immutable sequence.

注意: これはまだrenderの戻り値として直接渡せるものではないので、<div>などでラップしてあげる必要があります。


## Compiler Optimizations: Unlocked!

これらの変更はReact v0.14で静的な要素においていくつかの最適化を可能にします。
これらの最適化は以前はtemplate-baseなフレームワークでのみ可能でしたが、ReactでもJSXや`React.createElement/Factory`で可能になるでしょう。

詳細は下記のissueにあります。

- [Reuse Constant Value Types](https://github.com/facebook/react/issues/3226)
- [Tagging ReactElements](https://github.com/facebook/react/issues/3227)
- [Inline ReactElements](https://github.com/facebook/react/issues/3228)


## Rationale

これらの変更は重要だと考えていて、なぜならcomponentでさえもこれらのパターンに従わないとコストを払わなければならないことを意味してるからです。？
状態の変更のような問題もありますが、少なくとも局所化したcompnentのサブツリーではエコシステムを損なわない。