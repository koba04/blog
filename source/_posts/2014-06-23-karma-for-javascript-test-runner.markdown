---
layout: post
title: "Karma for JavaScript test runner"
date: 2014-06-23 00:48:32 +0900
comments: true
categories: javascript, test, karma
---

{% img /images/karma.png 'karma' %}

今まではなんとなくtestemを使っていたのですが、Karmaを検討する必要があったので試してみました。

サンプルの設定などは↓で見ることが出来ます。

* https://github.com/koba04/backbone-boilerplate

<!-- more -->


## testem to karma

これまでは業務でもtestemを使っていて、テストの数が少ないうち(1000以下)は問題なかったのですが、
段々テストが増えてくるとCPU100%になってテストが走るブラウザが固まることが増えてきて辛い感じになってきました。

そんなときに下記の記事を見て同じような現象だなと思いKarmaを試してみることにしました。

* http://developer.cybozu.co.jp/tech/?p=7089


## Installation

インストールは**npm install karma**するだけです。

globalでkarmaのコマンドが使いたい場合はgruntのように**npm install -g karma-cli**します。

* karmaはglobalに入れません。


## Easy to use

テストを読み込むためのHTMLを用意して色々書いたりする必要がなくて、**karma init**してframeworkやテスト対象のファイルを指定して、
**karma start**するだけで変更を監視しての自動テストを行うことが出来ます。簡単です。


## Configration

最初の設定は、**karma init**することで対話的に作成することが出来て、終了すると**karma.conf.js**が作成されます。

ちなみに**karma init karma.conf.coffee**のように拡張子をcoffeeにして指定することでcoffeescriptで作成することも出来ます。

生成されたファイルはこんな感じで、使うフレームワークや対象ファイル、実行するブラウザ、出力形式、ファイルの変更を監視して自動でテストするか、テスト終了後もプロセスを残すかどうかなどを設定します。

* 設定項目の抜粋

```js
module.exports = function(config) {
  config.set({

    // ベースとなるパス
    basePath: '',

    // 使用するフレームワーク。ここから探せる https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // 読み込むファイル(テスト対象のファイルやテストファイルなど)。
    files: ['js/*.js'],

    // filesから除外したファイル
    exclude: [],

    // テストの実行前に差し込む処理。ここから探せる https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {}

    // テストの結果を出力する形式。ここから探せる https://npmjs.org/browse/keyword/karma-reporter
    // 'dots'と'progress'は最初から使える
    reporters: ['progress'],

    // 使用するport
    port: 9876,

    // 出力に色を付けるか
    colors: true,

    // ログレベル: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // ファイルの変更を監視してテストを自動的に実行するかどうか
    autoWatch: true,

    // テストするブラウザ。ここから探せる https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // trueにすると一回テストを実行するとプロセスが終了する
    // CIのときに使ったり。
    singleRun: false
  });
};
```

その他では、**autoWatchBatchDelay**を使うと指定したms内での変更をまとめて一つとして扱ってくれるので、監視対象のファイルが短い時間に連続して更新されて複数回テストが実行される場合は、この値を長めにするといいかもしれません(defaultは250ms)。


## Browsers

ブラウザはChromeやSafariやPhantomJSなど色々ありますので、**karma-xxx-launcher**で探すことが出来ます。


## Frameworks

**mocha**や**jasmine**や**qunit**などの場合は**karma-mocha**のようにすでにadapterが用意されているので、
ここにframeworkを設定に書いてadapterをインストールするだけで使うことが出来ます。

### karma-mocha-debug

* https://github.com/maksimr/karma-mocha-debug

```js
frameworks: ['mocha-debug', 'mocha'],
```

testem+mochaでやっている時に、ブラウザで結果を確認してそこから指定したテストだけを再実行出来るのが便利だったので
karmaでも出来ないないかな思って調べるみると、karma-mocha-debugを使うと出来るようでした。
karmaのブラウザからdebugボタンを押してdebug.htmlを開くと見ることが出来ます。素晴らしい！

{% img /images/karma-mocha-debug.png 'karma mocha debug' %}


## Preprocessors

preprocessorsを指定することで**files**に書いたファイルに対してテストを実行する前に処理を挟むことが出来、柔軟なテストの設定が可能です。

coffeescriptのコンパイルだったりbrowserifyのビルドなどで**karma-xxxx-preprocessor**で探すことが出来ます。

```js
preprocessors: {
  '**/*.coffee': ['coffee']
}
```

### karma-html2js-preprocessor

* https://github.com/karma-runner/karma-html2js-preprocessor

また、karma-html2js-preprocessorというものもあって、これを使うと指定したHTMLを**window.\_\_html\_\_['name.html']**に入れてくれるので、fixtureデータとして使うことが出来ます。アプリのテストだとどうしてもDOMが必要になるので便利です。

```js
files: [
  '**/*.html'
],
preprocessors: {
  '**/*.html': ['html2js']
},
```

```coffeescript
before ->
  $('body').append window.__html__['fixture.html']
```


## Reporters

reporterを指定することで、様々な形式でテストの結果を出力したり通知したりすることが出来ます。

karma-xxxx-reporterで探すことが出来て、
nyanやtapやmocha形式のような出力形式のカスタマイズ以外にも、結果をgrowlやmp3で通知したりcoverageを計測したりなどさまざまなreporterがあります。


### karma-nyan-reporter

* https://github.com/dgarlitt/karma-nyan-reporter

```js
reporters: ["nyan"]
```

nyanの形式でテストを出力してくれるのでもっとテスト書こうという気持ちになっていいです。(バグってたのpull reqして直してもらいました...)

{% img /images/karma-nyan-reporter.gif 'karma nyan reporter' %}


### karma-growl-reporter,karma-osx-reporter

* https://github.com/petrbela/karma-osx-reporter
* https://github.com/karma-runner/karma-growl-reporter

```js
reporters: ["growl", "osx"]
```

GrowlかNotificationCenterでテストの結果を通知してくれるので便利です。


### karma-mp3-reporter

https://github.com/x2es/karma-mp3-reporter

成功したとき、失敗したときに好きな音が流せて楽しいですね。

```js
reporters: ["mp3"]

mp3Reporter: {
  red: "go-to-hell.mp3",
  green: "happy.mp3"
}
```

## Conclution

というわけでKarmaを試したのですが、思った以上に簡単に始めることが出来て、**preprocessors**や**reporters**などの仕組みがあってプラガブルな感じがとてもいいなぁと思いました。

今後もっとpluginが増えていくことに期待です。


## おまけ

### power-assert対応しました

もともとbrowserifyを使っていたので、transformにespowerifyを指定してあとはテストをassertに書き換えるだけだったのでとても簡単に出来てよかったです！素晴らしい！

コミットログはこの辺り。 https://github.com/koba04/backbone-boilerplate/commit/2fadec43e46f99cce0d3d828c66d4b12d758f4f0

{% img /images/power-assert.png 'power-assert' %}
