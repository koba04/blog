---
layout: post
title: "React.js Links vol.2 4/15〜4/19"
date: 2016-04-19 19:19:19 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## Server-side Environments (React documentation)

* http://facebook.github.io/react/docs/environments.html

あまり内容はありませんが、NashornとNode環境でReactを使った例を紹介するドキュメントが追加されました。


## Error reporting in production #2686 (React Issue)

* https://github.com/facebook/react/issues/2686

かなり前のIssueですが、最近また盛り上がっているので紹介します。

Reactでは、warningとerrorの2種類のログレベルがありますが、現在は`NODE_ENV`がproductionであるかどうかでログを有効にするか無効にするかを切り替えることしかできません。
このissueはその辺りの改善に関するものです。

前回紹介したリンクでも、developmentビルドとproductionビルドのパフォーマンスの違いについてありましたが、developmentビルドでは実行速度を気にせずにデバッグログを出力していて、productionビルドでは速度優先で不要なチェックは一切行われていません。
その結果、パフォーマンスに大きな違いがあります。

そのため、developmentビルドのままで本番に投入することも難しく、かといってproductionビルドのままでerrorのログを確認したいという場面に対応できていません。
現在作り直しが行われているPerf周りでもPROFILEフラグをという話もあるので、その辺りとあわせて`REACT_ENV`のような新しい仕組みが入るかもしれません。

## Two Weird Tricks with Redux (Blog)

* http://jlongster.com/Two-Weird-Tricks-with-Redux

Firefox Developer Toolの開発をしている[@jlongster](https://twitter.com/jlongster)さんによるFirefox Developer Toolsの開発にReduxを使った時の話です。
非同期処理をどうやって扱ったかということが書かれています。

言及されているソースはこのあたりにあるので気になる人は見るといいと思います。

* https://github.com/mozilla/gecko-dev/tree/master/devtools/client/debugger/content


## React Flip Move (Library)

* https://github.com/joshwcomeau/react-flip-move/

React Componentをアニメーションさせるためのライブラリーです。
READMEを見る限り、シンプルで使いやすそうです。react-motionを使っているのかと思ったけど独自実装でした。


## What to use for React styling? (Blog)

* http://andrewhfarmer.com/how-to-style-react/

ReactとCSSをどのように組み合わせるのかを解説したエントリーです。
MethodologiesとPreprocessorsとPostprocessorsとInline Style Helpersのアプローチに分けて、それぞれどんな特徴でどんなライブラリーがあるということが解説されています。
ReactとCSSの扱いに悩んでいる人は見てみるといいかもしれません。


## Proposal: Add support for observable spec interop point #1631 (Redux Issue)

* https://github.com/reactjs/redux/issues/1631
* https://github.com/reactjs/redux/pull/1632

ReduxのStoreを現在stage1のes-observableの`Symbol.observable`に対応させるIssueとPRです。
これにより、RxJS 5やその他のライブラリーとも組み合わせやすくなります。

PR出してるのはRxJS 5のメインの開発者である[blesh](https://github.com/blesh)さんです。
`Symbol.observable`のponyfillには[blesh/symbol-observable](https://github.com/blesh/symbol-observable)が使われています。


## eslint-config-airbnb 7,0 (Library)

* https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/CHANGELOG.md#700--2016-04-11

Reactに関するLintも含んでいるeslint-config-airbnbの7.0がリリースされています。
React Componentのaccessibilityを検査する`eslint-plugin-a11y`が依存に追加されたので、アップデートする際は追加でインストールする必要があります。

* https://github.com/evcohen/eslint-plugin-jsx-a11y


## 5 Open Source React Native Projects To Learn From (React Native Blog)

* https://medium.com/@bilalbudhani/5-open-source-react-native-projects-to-learn-from-fb7e5cfe29f2

ソースが公開されている5つのReactNativeのアプリが紹介されています。

## React Hot Loader 3.0 alpha demo (Library)

* https://github.com/gaearon/react-hot-loader/pull/240

React Hot Loaderの3.0のalpha版がリリースされています。2は飛ばして一気に3になったようです。
3.0のデモは下記で紹介されていますので使っている人は確認してみるといいと思います。

* https://github.com/gaearon/react-hot-boilerplate/pull/61

個人的には使っていないので詳細はわからないですが、Stateless ComponentsやHOC辺りのサポートや設定周りが改善されたようです。
