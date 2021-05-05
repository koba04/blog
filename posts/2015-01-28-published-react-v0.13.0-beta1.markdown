---
layout: post
title: "React v0.13.0 Beta1でclassでComponentが作れるようになった"
date: 2015-01-28 17:20:35 +0900
comments: true
categories: react.js
---

React.js Confの前日にv0.13.0 Beta1がnpmにpublishされました。

http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html

featureは色々あるみたいですが、↑のブログにはその1つとしてClassによるReact Componentの作成が紹介されていたのでそれについて書きたいと思います。

ちなみに`React.createClass`を使う場合はこれまでと同じままで大丈夫なはずです。

<!-- more -->

## ES6 Classes

`React.createClass`ではなくて、ES6のclassを使って↓みたいな感じで書けるようになります。

```js
import {React} from 'react';

export class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = { val: props.foo * 2 };
  }
  onClick() {
    this.setState({ val: this.state.val * 2 });
  }
  render() {
    return (
      <div>
        <p>state is {this.state.val}. props is {this.props.foo}</p>
        <button onClick={this.onClick.bind(this)}>click</button>
      </div>
    );
  }
}
Hello.propTypes = {
  foo: React.PropTypes.number
};
```

ポイントとしては

* `React.Component`をextendsします。
* `constructor`に`props`が引数として渡ってくるのでそれを使って必要に応じて`state`の初期化をする。
  * `getInitialState`は使うことができません。(warnが出ます)
*  Autobindingはされなくなったので明示的に`this.onClick.bind(this)`のようにする必要があります。
* `propTypes`や`defaultProps`はconstructorのpropertyとして指定する必要があります。
* 現時点で`mixin`はclassで書いた場合は使うことができません。

といった辺りです。

### 変換

ES6のコードの変換は、これまで通りreact-toolsでjsxの`--harmony`optionを有効にしたり6to5使ったりする感じです。

### 今後

今の書き方だと微妙に感じるところも結構あるのですが、最終的には↓のような形で書けるようにしたいみたいです。

```js
import {React} from 'react';

export class Hello extends React.Component {
  propTypes = { foo: React.PropTypes.number };
  state = { val: this.props.foo * 2 };
  onClick = () => {
    this.setState({ val: this.state.val * 2 });
  };
  render() {
    return (
      <div>
        <p>state is {this.state.val}. props is {this.props.foo}</p>
        <button onClick={this.onClick}>click</button>
      </div>
    );
  }
}
```

mixinについてはreact-futureを見る限りこんな感じになるのかもしれないですね。

https://github.com/reactjs/react-future/blob/master/01%20-%20Core/02%20-%20Mixins.js

```js
import { mixin } from "react-utils";
import { Component } from "react";

const A = {
  componentDidMount() {
    super();
    console.log('A');
  }
};

class Hello extends mixin(Component, A) {
  render() {
    return <div />;
  }
}
```

### CoffeeScript & TypeScript

ちなみにES6だけでなく、CoffeescriptやTypeScriptのClass syntaxでもかけます。


-----------

React.js自体でやることを減らしてES6、7のfeatureに任せることが出来るところは任せようといった方向性を感じて個人的にはいいんじゃないかと思っています。

React.js Conf行きたかった...

