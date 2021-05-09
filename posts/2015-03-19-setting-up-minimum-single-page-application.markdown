---
layout: post
title: "Setting up minimum single page application"
date: 2015-03-19 18:54:49 +0900
comments: true
categories: react.js browserify karma npm
---

React.jsなどを試そうとするときに、browserify? gulp? grunt? webpack? どれ使えばいいのとか、テストは何を使えばいいのかとかよくわからないというのをたまに聞くので、最低限の設定だけどES6で書けたりautobuildやlivereloadが出来る構成のサンプルを作ってみました。

あと、テストはkarma + mocha + power-assertでchromeでテスト出来るようにしています。

<!-- more -->

本当はpackage.jsonだけにしたかったのですがkarmaの設定だけは別ファイルになってます...。
テストが必要ない場合は、package.jsonの指定だけで大丈夫です。


* https://github.com/koba04/minimum-spa-boilerplate

git cloneして`npm install`して`npm start`すればいいだけの設定になっています。

```
git clone git@github.com:koba04/minimum-spa-boilerplate.git
npm install
npm start
```

![gif](http://i.gyazo.com/f906464bfb325437c5c905f80a5b976d.gif)


## 概要

### tree

```
➜  tree -L 1
.
├── README.md
├── index.js         // エントリーポイント
├── karma.conf.js    // karmaの設定
├── lib              // ソース
├── node_modules
├── package.json     // 設定はこの中
├── public           // document root
└── test             // テスト
```

### package.json

基本的には`npm init`で作ったものに色々インストールしてnpm scriptの設定をしているだけです。

```json
  "scripts": {
    "build": "NODE_ENV=production browserify index.js -t babelify | uglifyjs > public/bundle.js",
    "watch": "watchify -d index.js -t babelify -o public/bundle.js -v",
    "server": "browser-sync start --server public --files public/**/*",
    "test": "karma start",
    "start": "npm run watch & npm run server & npm test"
  },

  "dependencies": {
    "react": "^0.13.1"
  },
  "devDependencies": {
    "babelify": "^5.0.4",
    "browser-sync": "^2.3.1",
    "browserify": "^9.0.3",
    "espowerify": "^0.10.0",
    "karma": "^0.12.31",
    "karma-browserify": "^4.0.0",
    "karma-chrome-launcher": "^0.1.7",
    "karma-cli": "0.0.4",
    "karma-mocha": "^0.1.10",
    "mocha": "^2.2.1",
    "power-assert": "^0.10.2",
    "uglify-js": "^2.4.17",
    "watchify": "^2.4.0"
  }
```
https://github.com/koba04/minimum-spa-boilerplate/blob/master/package.json

* `npm run build`

これはReactに依存したビルドになっているのですが、production用にビルドされたファイルを生成することを想定しています。

* `npm run watch`

watchifyによってファイルが変更されたら自動的にbrowserifyのビルドが走るようになっています。
watchifyはキャッシュするので二回目以降のビルドが高速化されるのもポイントです。

* `npm run server`

BrowserSyncによって`public`をrootにしたserverを立ちあげつつ、`public`以下のファイルを監視してlivereloadするようになっています。

* `npm test`

テストはkarmaを使うので`karma start`しているだけです。`karma`の設定は`karma.conf.js`にあります。

* `npm start`

上記のweatchとbrowserとtestをまとめて実行するコマンドで、これだけ実行すれば開発を始められるようになっています。

### karma

karmaは`karma init`で対話的に作成出来る`karma.conf.js`にbrowserifyの設定を追加したくらいです。

```js
// frameworks to use
// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
frameworks: ['mocha', 'browserify'],


// list of files / patterns to load in the browser
files: [
  'test/**/*.js'
],


// list of files to exclude
exclude: [
],


// preprocess matching files before serving them to the browser
// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
preprocessors: {
  'test/**/*.js': 'browserify'
},

browserify: {
  debug: true,
  transform: [
    "babelify",
    "espowerify"
  ]
},
```

karmaについては以前にも書いたのでそちらも。

* http://blog.koba04.com/post/2014/06/23/karma-for-javascript-test-runner/

今回はカジュアルさを優先したので設定していませんが、travis-ciを使いたい場合は、`karma-phantomjs-launcher`を入れて`npm test`でPhantomJSで実行出来るようにすればOKだと思います。


### Code

コードはこんな感じで書けます。

```js
import React from 'react';

export default class App extends React.Component {
  render() {
    return <div>Hello World</div>;
  }
}
```
https://github.com/koba04/minimum-spa-boilerplate/blob/master/lib/components/app.js


### Test

テストはこんな感じ

```js
import assert from 'power-assert';
import React from 'react/addons';
import App from '../../lib/components/app';

const {TestUtils} = React.addons;

describe("App", () => {
  let component;

  beforeEach(() => {
    component = TestUtils.renderIntoDocument(<App />);
  });

  it("returns Hello World in div", () => {
    const div = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
    assert(
      React.findDOMNode(div).textContent
      ===
      'Hello World'
    );
  });
});
```

## おまけ

### karma-browserify + power-assert + babel

npm scriptでbrowserifyとwatchifyの引数に`babelify`を指定していますが、本当は↓のようにbrowserifyのtransformフィールドにだけ指定してkarmaには`espowerify`だけを指定したいところなのですが、`karma-browserify`に指定するtransformはbrowserifyにoptionとしてそのまま渡されるのではなくて事前にtransformするので、`espowerify`が`babelify`される前のコードを対象としてしまいエラーになります...。

なのでここでは、それぞれに個別に設定する形になっています...。
レアケースですがなんとかしたいなぁと思いつつ...。


```
"browserify": {
  "transform": [
    ["babelify"]
  ]
}
```

------

そこそこカジュアルな感じになっているかなぁと思います。

