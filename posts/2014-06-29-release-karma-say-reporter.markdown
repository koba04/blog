---
layout: post
title: "Release karma-say-reporter"
date: 2014-06-29 01:14:36 +0900
comments: true
categories: karma
---

最近karmaを使っているのもあって、karma-say-reporterっていうのをリリースしました。

https://www.npmjs.org/package/karma-say-reporter

<!-- more -->

karmaでテストの結果によって通知するものとしては、[karma-mp3-reporter](https://www.npmjs.org/package/karma-mp3-reporter)というものがありますが、好きな言葉を指定したいということでOSXにあるsayコマンドで結果を通知してくれるものです。


## Config

こんな感じでreportersにsayを追加して、successとfailのときのメッセージを指定出来るようになっています。また、sayコマンドの-vで指定出来るvoiceの種類も設定出来るようになっています。

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['progress', 'say'],

    sayReporter: {
      success: "test all successs",
      fail: "test failed",
      voice: "Agnes"
    }
  });
};
```


## Kyoko for Japanese

デフォルトだと日本語を指定することが出来ないのですが、環境設定の「音声入力と読み上げ」からKyokoさんを追加すれば日本語を指定できるようになるので、Kyokoさんを追加した後に下記のように設定することで日本語で通知することも出来ます。

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['progress', 'say'],

    sayReporter: {
      success: "やったね",
      fail: "テストこけてるで",
      voice: "Kyoko"
    }
  });
};
```


## Linux...

ソース見てもらえれば分かる通り、voiceを覗いてはただsayコマンドに渡してるだけなので、独自にsayコマンドを定義してあげれば多分動くと思います。

なので汎用的なreporterとしても使えるかもしれないです。


## Enjoy!

Karmaのpluginはまだ未開の地な感があるのでいろんなplugin作っていくと楽しくテスト書けそうでいいですね！



