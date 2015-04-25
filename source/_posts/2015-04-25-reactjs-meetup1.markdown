---
layout: post
title: "React.js meetup #1を開催しました"
date: 2015-04-25 17:11:35 +0900
comments: true
categories: react.js
---

http://reactjs-meetup.connpass.com/event/11232/

一人Advent Calendar書いた時にやりたいと言っていたのでReact.js meetup #1 を[@yosuke_furukawa](http://twitter.com/yosuke_furukawa)さんと開催しました。

 DeNAさんが会場から懇親会のお酒や寿司、当日の運営まで全てやってくださったので自分はほとんど何もしてないですが..。
 本当にありがとうございました！！

やりたいって言ってこの規模の勉強会を開催させてもらえるの本当にスゴいなぁと思います...。

 <blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/hashtag/reactjs_meetup?src=hash">#reactjs_meetup</a> <a href="https://twitter.com/hashtag/react_sushi?src=hash">#react_sushi</a> です <a href="http://t.co/GdpyF7Paqk">pic.twitter.com/GdpyF7Paqk</a></p>&mdash; Toru Kobayashi (@koba04) <a href="https://twitter.com/koba04/status/591580062702383107">April 24, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<!-- more -->

ある程度予想はしていたのですが、Talkが10分と短かったりで押して慌ただしい感じになってしまったのは申し訳なかったなぁと思ってます。
ただ、色んなテーマのTalkを一度に聞くことが出来たのはよかったかなと思っています。

## Talks

各Talkの資料についてはconpassのページに追加しておいたのでそちらを見て頂くとして簡単な一言感想です。

http://reactjs-meetup.connpass.com/event/11232/presentation/

### [@naoya_ito](https://twitter.com/naoya_ito) - React概論

Reactの特徴をわかりやすく説明していてReact.js触ってない人にとってもわかりやすい説明だったんじゃないかなと思います。

### [@hokaccha](https://twitter.com/hokaccha) - react-rails

Railsと一緒に使いたい人にとってはかなり有益な情報だったんじゃないかなと思います。Turbolinksどうするのとか。

### [@azu_re](https://twitter.com/azu_re) - 10分で実装するFlux

Fluxを最小限の構成にしてデータの流れを一方向にするということがどういうことなのか説明していてわかりやすかったです。console.traceを使っての説明もなるほどなぁと思いました。

### [@yosuke_furukawa](http://twitter.com/yosuke_furukawa) - mercury/mithril.js

React.jsのVIRTUAL DOMのdiffアルゴリズムの説明からmercuryやmithril.jsといった他のライブラリがどうやってReact.jsより高速化しているのかという説明で面白かったです。

### [@mizchi](https://twitter.com/mizchi) - React/FluxでSPAを開発してぶちあたった問題

KobitoをReact.js + Fluxで作った時の問題になった点と解決方法について説明していて、ないものは作る姿勢がスゴイなぁ思いました。

### [@sugyan](https://twitter.com/sugyan) - React.jsと、 Railsとかアイドルとか (LT)

React.jsとRailsでReactRouter使ったり色々組み合わてみた話でツラいと言いながらちゃんと作ってしまうところがスゴイなぁと思いました。

### [@making](https://twitter.com/making) - Java + React.jsでSever Side Rendering (LT)

SPAで作ったブログが検索に引っかからないからReact.js + Javaでserver-side renderingするようにしたという話で、最後のオチも含めて面白かったです。

### [@tyshgc](https://twitter.com/tyshgc) - Rapid React Prototyping : React.jsでUIデザインプロトタイプを作る (LT)

React.jsでプロトタイプを作る話で、Photoshopのレイヤー情報からReact.jsのComponentを生成するようにしていてスゴかったです。

### [@teppeis](https://twitter.com/teppeis) - Flowtype (LT)

懇親会の時にFlowtypeについてのLTをしてくれて、デモもあったりFacebookが開発中のElectron(旧:AtomShell)ベースのNuclideの話まであって面白かったです。

## LiveCodingやった

ぼっちでも懇親会に参加して欲しかったので、ぼーっと見ていたり会話のネタになるかなと思ってLiveCodeingをやってみました。

最近だとJSの環境を作るにも何を使えばいいのかわからないという声も聞くので、0から簡単なアプリを作るところまでの流れを伝えられればと思い、HackerNewsのAPIを使ってTopStoryの一覧を表示するものを作ってみました。

あと、3分間クッキングみたいに事前に色々用意しておくのもライブ感がないなぁと思ったので`mkdir`から全部その場で作ることにしました。

https://github.com/koba04/react-hacker-news-stories/tree/meetup

環境構築は、browserifyとwatchifyとbabelifyで変換を行ってlivereloadするためのbrowser-syncを使いました。

LiveCodingの流れとしては

* ディレクトリ作ったり`npm init`したり`npm install`したりして環境を作る
* Hello Worldしてみる(Hellって書いたけど...)
* 各Componentを作成する
* HackerNewsのAPI叩いて一覧が出るようにする
* `React.addons.Perf`を使ってDOMが無駄に更新されていることとkeyが指定されていないwarningが出ていることを確認
* keyを指定することで無駄のDOM操作がなくなることを確認
* diffの時間を減らすために`Immutable.js`を使いつつ`shouldComponentUpdate`を実装

という感じで行いました。

ライブコーディングが初めてで緊張していたのとお酒が入っていたのもあって(言い訳)、いつもと同じ感覚でコーディング出来なくてtypoしまくってしまい、「これ終わらないかも...」とかなり駆け足になってしまったのは反省です...。
(事前に練習はしたんですが...)

でも、とりあえず最後まで出来てよかった...。

## まとめ

イベントの管理者側でやるのは初めてだったので色々至らない点があったかもしれませんが、準備してくださったDeNAの方々、発表者の方々、参加者の皆様、本当にありがとうございました！！

感想とかブログに書いてもらえると嬉しいです！
