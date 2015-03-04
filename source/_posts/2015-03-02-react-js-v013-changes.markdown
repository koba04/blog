---
layout: post
title: "React.js v0.13 changes"
date: 2015-03-02 23:23:28 +0900
comments: true
categories: react.js 
---

React.js v0.13のRC2がリリースされたのでまとめてみます。

* http://facebook.github.io/react/blog/2015/02/24/react-v0.13-rc1.html
* http://facebook.github.io/react/blog/2015/03/03/react-v0.13-rc2.html
* http://facebook.github.io/react/blog/2015/02/24/streamlining-react-elements.html

今回のバージョンで何か大きく変更があるというよりもv0.14でやりたいことに向けての布石が多いように感じます。

<!-- more -->

## Propを変更するとwarninngが出ます (Breaking Change)

development環境でPropをelement作成後に変更することはdeprecatedになってwarningが出るようになりました。
つまりimmutableなものとして扱う必要があります。

```js
var element = <Foo bar={false} />;
if (shouldUseFoo) {
  element.props.foo = 10;
  element.props.bar = true;
}
```

### これまでの問題点

* Propを直接変更してしまうと元の値を破棄してしまうのでdiffがなくなってしまいます。この場合、`shouldComponentUpdate`を実装している場合に比較時に差分を検出出来なくてDOM構造に差分があるはずなのに実際には反映されない可能性がありました。
* またPropが変更されることがあるためcreateElementの時点でPropTypesのValidationも出来ず、それによってエラー時のstacktraceが深くなったりFlowによる静的解析にとっても都合がよくなかったりという面もありました。

#### それに対しての提案

* 動的にしたい場合は↓のような形で書くことでも可能です。

```js
if (shouldUseFoo) {
  return <Foo foo={10} bar={true} />;
} else {
  return <Foo bar={false} />;
}

var props = { bar: false };
if (shouldUseFoo) {
  props.foo = 10;
  props.bar = true;
}
return <Foo {...props} />;
```

* 現時点ではネストしたオブジェクトについては変更してもwarningは出ません。基本的にはimmutable.jsなどを使って完全にimmutableに扱った方がいいですが、mutableなオブジェクトは多くの場面で便利だし今回はネストしたオブジェクトはwarningの対象外となりました。

```js
return <Foo nestedObject={this.state.myModel} />;
```

* PropTypesのwarningをReactElementの作成時に行うなうようになりました。Propを変更するために↓のようにcloneしてReactElementにPropに値を追加するのは正しい方法です。

```js
var element1 = <Foo />; // extra prop is optional
var element2 = React.addons.cloneWithProps(element1, { extra: 'prop' });
```


## statics内のメソッドに対してautobindingされなくなりました (Breaking Change)

`statics`に定義したメソッドをonClickなどにバインドした時にcomponentをバインドしなくなりました。

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


## refを設定する処理の順番が変わりました (Breaking Change)

`ref`に指定されたcomponentの`componentDidMount`が呼ばれた後になります。
これは親componentのcallbackを`componentDidMount`の中で読んでいる場合だけ気にする必要があります。そもそれもこれはアンチパターンなので避けるべきですが...。

* `componentDidMount`は子componentから順番に呼ばれるので下記の`refDiv`はChildの`componentDidMount`の時点では設定されていません。
  
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

## `this.setState()`が第1引数に関数を受け取れるようになりました

```js
this.setState((state, props) => ({count: state.count + 1}));
```

のようにすることで`this._pendingState`を使うことなくトランザクションが必要とされるstateの更新を行うことが出来ます。

```js
console.log(this.state.count) // 0
this.setState({ count: this.state.count + 1 })
this.setState({ count: this.state.count + 1 })
// state.count will render as 1

console.log(this.state.count) // 0
this.setState(function(state, props) { return { count: state.count + 1 } });
this.setState(function(state, props) { return { count: state.count + 1 } });
// state.count will render as 2
```


## setStateの呼び出しが常に非同期になります (Breaking Change)

ライフサイクルメソッドの中での`setState`の呼び出しが常に非同期でバッチとして処理されます。以前は最初のマウント時の呼び出しは同期的に行われていました。

```
componentDidMount() {
  console.log(this.state.count) // 0
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count) // v0.13 is 2 (v0.12 is 0)
}
```


## setStateとforceUpdateをunmountされたcomponentに対して呼んだ時に、エラーではなくwarningが出るようになりました (Breaking Change)

非同期処理の結果を`setState`して反映させるときに、`isMounted`でブロックしなくてもよくなったのはいいですね。


## privateなプロパティが整理されました (Breaking Change)

`this._pendingState`や`this._rootNodeID`などのprivateなプロパティが削除されました。


## ES6 classesによるReactComponentの作成がサポートされました
  
これについては↓に書きましたが、ES6 classesによって作成されたcomponentには`createClass`にはある`getDOMNode`、`setProps`、`replaceState`が含まれていなかったりmixinが指定出来ないなど注意点がいくつかあります。

* http://blog.koba04.com/post/2015/01/28/published-react-v0.13.0-beta1/


## `React.findDOMNode(component)`のAPIが追加されました

これは既存の`component.getDOMNode()`を置き換えるAPIです。
`getDOMNode()`はES6 classesによって作成されたcomponentでは提供されていません。

## `ref`がcallbackスタイルで指定できるようになりました。

```js
<Photo ref={(c) => this._photo = c} />
```

この変更はこの後で書く`owner`の扱いの変更に関係しています。


## childrenにiteratorやimmutable-jsのsequenceを指定出来るようになりました

immutable-jsを使っている人にとってはいいですね。


## `ComponentClass.type`はdeprecatedになりました

代わりに`ComponentClass`をそのまま使ってください。


## ownerベースのcontextを使っていてparentベースのcontextと一致しない場合にwarningが出るようになります

そもそもowner? parent?という感じかと思うので簡単に説明します。

### owner and parent

Reactは"parent"と"owner"を持っています。"owner"はReactElementを作ったcomponentです。

```js
class Foo {
  render() {
    return <div><span /></div>;
  }
}
```

この場合、`span`のownerは`Foo`でparentは`div`になります。

### context

これはdocument化されてないfeatureですが、"owner"から子に渡すことが出来る"context"というものがあります。

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

### 問題点

* ownerは密かにReactElementに追加されているので気づかないうちに挙動が変わることが発生します。↓の場合はそれぞれのinputのownerが異なりますし、`React.addons.cloneWithProps`を使った場合もownerが変わります。

```js
var foo = <input className="foo" />;
class Component {
  render() {
    return bar ? <input className="bar" /> : foo;
  }
}
```

* ownerは実行時のstackによって決定します。↓の場合、`span`のonwerは実際は`B`で`A`ではありません。これはcallbackが実行されたタイミングに依存するからです。

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

* また、JSXが書いているscope内にReactが必要なのは、Reactが現在のownerを保持していてJSXの変換がそれに依存しているからという意外なところに影響があったりもします。

### それに対する提案

* ownerベースのcontextの代わりにparentベースのcontextの導入を考えているのでそれを使うことです。ほとんどのケースはparentベースのcontextでも問題ないです。
* ownerベースのcontextが必要になる場合はほとんどないはずだしコードを見直すべきです。

### 未解決

* `ref`はまだownerベースのままで、これについてはまだ完全に解決出来ていません。
  * v0.13ではcallbackでもrefが定義出来るようなりましたがこれまでの宣言的な定義方法も残されています。宣言的な定義方法に代わる何かいい方法がない限りこのAPIは廃止されません。


## `{key: element}`(Keyed Object)の形式でchildに渡すとwarningが出るようになりました

v0.12では`{key: element}`の形式でkeyが指定したらelementを渡すことが出来ましたが、これはあまり使われてないし問題となる場合があるので使うべきではないのでwarningが出るようになりました。

```js
<div>{ {a: <span />, b: <span />} }</div>
```

### 問題点

* 列挙される順番はkeyに数値を指定した場合を除いては仕様として定義されてないので実装次第になってしまいます。
* 一般的にobjectをmapとして扱うことは型システムやVMの最適化やコンパイラーにとって好ましくないし、さらにセキュリティ上のリスクもあって↓のような場合にもし`item.title === '__proto__'` を指定されたら....

```js
var children = {};
items.forEach(item => children[item.title] = <span />);
return <div>{children}</div>;
```

### それに対する解決

* ほとんどの場合、`key`を設定したReactElementの配列にすれば問題ないはずです。

```js
var children = items.map(item => <span key={item.title} />);
<div>{children}</div>
```

* `this.props.children`を使った場合など、`key`を指定することが出来ない場合もあるかもしれません。その場合はv0.13で追加された`React.addons.createFragment`を使うことでKeyed ObjectからReactElementを作成することが出来ます。
  * 注意として、これはまだrenderの戻り値として直接渡せるものではないので<div>などでラップしてあげる必要があります。

```js
<div>{React.addons.createFragment({ a: <div />, b: this.props.children })}</div>
```


## `React.cloneElement`が追加されました

これはこれまで`React.addons.cloneWithProps`と似たAPIです。
異なる点としては、`style`や`className`のmergeが行われなかったり`ref`が保持される点があります。
`cloneWithProps`を使ってchildrenを複製した時に`ref`が保持されなくて問題となるという報告が多くあったのでこのAPIでは`ref`を保持するようになりました。
`cloneElement`時に`ref`を指定すると上書きされます。

```js
var newChildren = React.Children.map(this.props.children, function(child) {
  return React.cloneElement(child, { foo: true })
});
```

このAPIはv0.13でPropがimmutableなものとして扱われるようになったことで、Propを変更するためにelementをcloneする機会が増えたため必要となりました。
`React.addons.cloneWithProps`はそのうちdeprecateになりますが今回のタイミングではなりません。


## `React.addons.classSet`がdeprecatedになりました

必要な場合は[classnames](https://www.npmjs.com/package/classnames)などを使用してください。


## jsxコマンドで`--target`optionとしてECMAScript versionを指定出来るようになりました。 (Breaking Change)

`es5`がデフォルトです。
`es3`はこれまでの挙動ですが追加で予約語を安全に扱うようになりました(eg `this.static`は`this['static']`にIE8での互換性のために変換されます)。


## jsxコマンドでES6 syntaxで変換した際にclassメソッドがdefaultではenumerableではなくなりました

`Object.defineProperty`を使用しているため、IE8などをサポートしたい場合は`--target es3`optionを渡す必要があります。

* Original

```js
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

* ES5

```js
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

* ES3

```js
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

## JSXによる変換でharmony optionを有効にすることでspread operatorを使えるようになりました

JSXの中ではこれまでもspread attributesとしてサポートしていましたが、JSのコード内でも使えるようになりました。

```js
var [a, b, ...other] = [1,2,3,4,5];
```


## JSXのparseに変更があります (Breaking Change)

elementの内側に`>` or `}` を使った時に以前は文字列として扱われましたがparseエラーになるようになりました。

```js
render() {
  return <div>} or ></div>; // parse error!
}
```

## v0.14に向けて

今回の変更を踏まえてReact v0.14では静的な要素においていくつかの最適化が可能になります。
これらの最適化は以前はtemplate-baseなフレームワークでのみ可能でしたが、ReactでもJSXと`React.createElement/Factory`のどちらでも可能になります。

詳細は下記のissueにあります。

- [Reuse Constant Value Types](https://github.com/facebook/react/issues/3226)
- [Tagging ReactElements](https://github.com/facebook/react/issues/3227)
- [Inline ReactElements](https://github.com/facebook/react/issues/3228)

---------


というわけで、React v0.13をダラダラと書いてみました。