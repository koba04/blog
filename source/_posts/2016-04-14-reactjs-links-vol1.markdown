---
layout: post
title: "React Links vol.1 4/16〜4/14"
date: 2016-04-14 13:17:31 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事やきになるissueなどのリンクを紹介する記事です。


# React Links vol.1 4/6〜4/14


今週はF8があったのでReact Native関連の記事が多くありました。


## React v15

* http://facebook.github.io/react/blog/2016/04/07/react-v15.html
* https://facebook.github.io/react/blog/2016/04/08/react-v15.0.1.html

React v15がリリースされました。バグがあったのですぐに15.0.1がリリースされています。インストールする際には15.0.1を使用してください。

細かいfeatureについてはブログ書いたのでそちらをみてください

* http://blog.koba04.com/post/2016/03/09/react-js-v15-changes/

## React Native: A year in review

* https://code.facebook.com/posts/597378980427792/react-native-a-year-in-review/

React Nativeが2013年の夏に社内の(?)hackathonで誕生してから、30,000以上のstarをgithubで得るようになるまでのStoryが書かれています。
"The React Native team has grown from around 10 to around 20 engineers in the past year"や"we are 1 percent finished. "とあるように、今後も力を入れていくことがわかります。
Facebookのエンジニア以外からのcommitも30%くらいあって、Facebook以外でも使われていることがわかります。

また、facebookがreact-nativeのリポジトリをどのように管理しているのかや、たくさんのissueやPRを処理するために作ったmention-botなどについても書かれていて、巨大なOSSをgithubでどう管理するかという点でも面白いです。

https://github.com/facebook/mention-bot


## Building the F8 2016 App

* http://makeitopen.com/

ReactNativeを使ってF8のiOSとAndroidのアプリを作った際のことを、チュートリアルとして紹介しています。
どのような構成にするのかを検討して、マルチプラットフォーム対応をどうするか、データ管理をどうするか、テストをどうするかなどが書かれていてとても参考になります。

React使っている人は一度見てみるといいんじゃないかと思います。

ReactNative + Flow + Redux + Jestな構成でサーバーサイドにはOSSのParse Serverを使っているようです。
エディターはNuclideだそうです。


## React Native on the Universal Windows Platform

* https://blogs.windows.com/buildingapps/2016/04/13/react-native-on-the-universal-windows-platform/

MicroSoftがUniversal Windows Platform (UWP)対応をReactNativeに追加することが書かれています。
これにより、WindowsのPCがモバイルだけでなく、Xbox OneやHoloLensのためのアプリをReactNativeで作れるようになります。
記事では、F8のアプリをWindows 10 mobileとDesktop向けに作ったことが紹介されています。

JavaScriptのランタイムにはChakraが使われているみたいです。

また、VSCodeのReactNative拡張やReactNativeを使ったWindowsアプリに対するCodePush対応などを行っているようです。

* http://microsoft.github.io/code-push/articles/ReactNativeWindows.html

現在はforkしたrepositoryになっていますが、将来的にはReactNative本体と同期が取れるようにうまくやっていくようです。

https://github.com/ReactWindows/react-native


## core note 4/7

* https://github.com/reactjs/core-notes/blob/master/2016-04/april-7.md

Reactのcoreチームのmeeting noteが公開されています。
以前はあったものの途中で削除されたBrowser Testingについて言及されているのは注目です。

その他では、*ReactDOM.render() return value being ~~deprecated~~ legacy* ([#6400](https://github.com/facebook/react/pull/6400)) も注目です。
内部的なアルゴリズムの見直しをするために、ReactDOM.renderが将来的に戻り値を返さなくなります。
戻り値を使いたい場合は、Refsを指定して取得することになりそうです。

また、*Sebastian is moving some files from React Native to React* ([#6338](https://github.com/facebook/react/pull/6338))としてReactNativeのrenderer周りをreactのrepositoryに持ってきて、`react-native-renderer`として別パッケージにすることも予定されています。
さらに`react-dom`から`react-dom-renderer`も切り離すことを検討されています。

これによってカスタムrendererを作る時のI/Fが整備されて、わかりやすくなるといいなと思います。
Windows対応もあったりでこの辺りを整理する優先度は高そうです。


## Improve React performance with Babel

* https://medium.com/doctolib-engineering/improve-react-performance-with-babel-16f1becfaa25

productionビルドやBabelの最適化を使った場合のパフォーマンスについてのエントリーです。当たり前ですが、developmentビルドとproductionビルドのパフォーマンスの違いが目立っています。
Babelを使った最適化の場合でも数%の向上が見られますが、アプリケーションによるので利用する際は計測してみて導入することをおすすめします。


## unofficial React Router docs

* http://knowbody.github.io/react-router-docs/

[knowbody](https://github.com/knowbody)さんによる非公式なReact Routerのドキュメントです。WIPですが、公式を読んでよくわからなかった人は確認してみるといいかもしれません。


## React Router is dead. Long live rrtr.

**下のエントリーは現在は削除されています。**

* ~~https://medium.com/@taion/react-router-is-dead-long-live-rrtr-d229ca30e318#.vd0qjkccc~~

React Routerでここ数ヶ月中心的にcontributeしていた[taion](https://github.com/taion)さんがリリースのサイクルの遅さやプロセスに不満を抱いてforkして[rrtr](https://github.com/taion/rrtr)を作ったことを表明したエントリーです。

それに対して、React Routerのオーナーである[ryanflorence](https://github.com/ryanflorence)さんもgistでリアクションしています。

* ~~https://gist.github.com/ryanflorence/08a056374e24a7cda3c459e3d7d63e6e~~ (**これも削除済み**)

で下の通り、結局丸く収まりました。

* https://medium.com/rackt-and-roll/rrtr-is-dead-long-live-react-router-ce982f6f1c10

結果的に、PRをmergeするプロセスや定期的なリリースなど、プロジェクトの運営方針が行われました。

ちなみにtaionさんはhistoryと組み合わせてscroll位置の復元などをサポートするscroll-behaviorというライブラリーも公開しています。

* https://github.com/taion/scroll-behavior

## crysislinux/chrome-react-perf

* https://github.com/crysislinux/chrome-react-perf

Perfによる計測をChrome Developer Toolsで行うことができるライブラリーです。
カジュアルに計測が出来そうなのでよさそうです。
