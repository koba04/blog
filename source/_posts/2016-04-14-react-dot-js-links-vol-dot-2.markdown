---
layout: post
title: "React.js Links vol.2"
date: 2016-04-14 19:27:37 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->


## Server-side Environments (React documentation)

* http://facebook.github.io/react/docs/environments.html

あんまり内容はありませんが、NashornとNode環境でReactを使った例を紹介するドキュメントが追加されました。


## Two Weird Tricks with Redux

* http://jlongster.com/Two-Weird-Tricks-with-Redux

Firefox Developer Toolの開発をしている[@jlongster](https://twitter.com/jlongster)さんによるFirefox Developer Toolsの開発にReduxを使った時の話です。
非同期処理をどうやって扱ったかということが書かれています。

言及されているソースはこのあたりにあるので気になる人は見るといいと思います。

* https://github.com/mozilla/gecko-dev/tree/master/devtools/client/debugger/content


## React Flip Move

* https://github.com/joshwcomeau/react-flip-move/

React Componentをアニメーションさせるためのライブラリーです。
READMEを見る限り、シンプルで使いやすそうです。react-motionを使っているのかと思ったけど独自実装でした。


## What to use for React styling?

* http://andrewhfarmer.com/how-to-style-react/

ReactとCSSをどのように組み合わせるのかを解説したエントリーです。
MethodologiesとPreprocessorsとPostprocessorsとInline Style Helpersのアプローチに分けて、それぞれどんな特徴でどんなライブラリーがあるということが解説されています。
ReactとCSSの扱いに悩んでいる人は見てみるといいかもしれません。


## Proposal: Add support for observable spec interop point #1631 (Redux)

* https://github.com/reactjs/redux/issues/1631
* https://github.com/reactjs/redux/pull/1632

ReduxのStoreを現在stage1のes-observableの`Symbol.observable`に対応させるIssueとPRです。
これにより、RxJS 5やその他のライブラリーとも組み合わせやすくなります。

PR出してるのがRxJS 5のメインの開発者である[blesh](https://github.com/blesh)なのも面白いですね。
`Symbol.observable`のponyfillには[blesh/symbol-observable](https://github.com/blesh/symbol-observable)が使われています。


## eslint-config-airbnb 7,0

* https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/CHANGELOG.md#700--2016-04-11

Reactに関するLintも含んでいるeslint-config-airbnbの7.0がリリースされています。
React Componentのaccessibilityを検査する`eslint-plugin-a11y`が依存に追加されたので、アップデートする際は追加でインストールする必要があります。

* https://github.com/evcohen/eslint-plugin-jsx-a11y


## 5 Open Source React Native Projects To Learn From

* https://medium.com/@bilalbudhani/5-open-source-react-native-projects-to-learn-from-fb7e5cfe29f2

ソースが公開されている5つのReactNativeのアプリが紹介されています。

## React Hot Loader 3.0 alpha demo

* https://github.com/gaearon/react-hot-loader/pull/240

React Hot Loaderの3.0のalpha版がリリースされています。2は飛ばして一気に3になったんですね。
3.0のデモは下記で紹介されていますので使っている人は確認してみるといいと思います。

* https://github.com/gaearon/react-hot-boilerplate/pull/61

個人的には使っていないので詳細はわからないですが、Stateless ComponentsやHOC辺りのサポートや設定周りが改善されたようです。
