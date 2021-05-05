---
layout: post
title: "Release Marionette 2.0!"
date: 2014-06-19 00:53:03 +0900
comments: true
categories: marionette.js
---

Marionette.jsの2.0がリリースされましたね！(2.0.1も出ましたが..)

1.x系では入れることが出来なかったbreakingな変更がかなりあるので内容を確認してみました。

https://github.com/marionettejs/backbone.marionette/releases/tag/v2.0.0

<!-- more -->

## Translate release note in Japanese

というわけで、上記のリリースノートをざっくり日本語に訳してみたのを @samccone が公開してもいいと言ってくれたので公開します。
実際に動作確認して確証を取るまではやってないので間違っているところがあれば指摘してもらえるとありがたいです。

https://gist.github.com/koba04/c375231f871a6cd1a42c

view.closeがview.destoryになったり、LayoutがLayoutViewに変わったりといったI/Fがガッツリ変わるものから、triggerMethodがmethodが呼ばれたあとにeventがtriggerされるように順番が変わったなど、地味だけどハマりそうな変更まで色々あります。

ただ、基本的には大きな機能追加というよりはbreakingになるため出来なかったわかりにくいかった部分の改善などが主な感じです。

わかりやすくなってよくなったと思います。


## 1.x to 2.0

実際にどうかなと思って、1系で作ってたMarionetteのサンプルプロジェクトを2.0に移行してみました。

* 2.0対応したコミットログはこの辺り

  * https://github.com/koba04/backbone-boilerplate/commit/7eb3ae0537be2c8a004aed31743bc7ece46c6f95

LayoutをLayoutViewにしたりitemViewをchildViewにしたりと機械的に出来る変更だけでいけるかなと思いましたが、regionのelがDOMに存在しない時に例外を投げるようになった変更の影響でテストの時にDOMへの反映をちゃんとやってなくてエラーになり、その対応に地味に時間を取られたりしました。

実際のプロダクトの方はちょっと大変かもと思いましたが、テスト書いてあればまぁ移行できそうな印象です。


## Upgrade Guide

あた、ここにpython製の1.xから2.0への移行scriptがあるのでそれを試してみるのもいいかもしれないですね。

https://github.com/marionettejs/Marionette.Upgrade


## Announce

蛇足ですが、「天下一クライアントサイドJS MV\*フレームワーク武道会」でMarionette派としてLTします。2.0がいいタイミングで出たので2.0のコードベースで出来るのでよかったです。

http://connpass.com/event/6910/

