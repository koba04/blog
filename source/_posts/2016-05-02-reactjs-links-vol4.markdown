---
layout: post
title: "React.js Links vol.4"
date: 2016-05-11 18:41:13 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->


## React v15.0.2 (React Release)

* https://github.com/facebook/react/releases/tag/v15.0.2

Reactのv15.0.2がリリースされています。Bug fixが中心です。

## React Core Meeting Note April 28 (React Meeting Note)

* https://github.com/reactjs/core-notes/blob/master/2016-04/april-28.md
* https://github.com/reactjs/core-notes/pull/10

React Coreチームのmeeting noteです。
v15になったこともあり、リリースサイクルについての議論が行われているようです。

また、`Experimenting with StyleSheet.create() on the web`のようなトピックもあり、こちらも興味深いです。

## React Core Meeting Note May 5 (React Meeting Note)

* https://github.com/reactjs/core-notes/blob/master/2016-05/may-05.md
* https://github.com/reactjs/core-notes/pull/13

React Coreチームのmeeting noteです。


また、`airbnb/enzyme`をofficialのTestUtilsに？みたいな話もあってこちらも注目です。

あとは、Server Side RenderingやCSSのvendor prefixについての議論もされています。

## Add new ReactPerf #6046 (React PR)

* https://github.com/facebook/react/pull/6046

Dan Abramovが作業していたReactPerfのrewriteされたものがmergeされました。
`react@15.1.0-alpha.1`で試すことができます。

## RFC: New Reconciler Infra (React PR)

* https://github.com/facebook/react/pull/6690

Reactのコア部分であるReconcilerと呼ばれているComponentの更新処理を管理する部分の新しいアウトラインとなる実装がmergeされました。まだ初期という感じですが。。
通常、Reactを使う場合にこのReconcilerは使われないので、コンセプトを共有するための実装という感じです。

後、コードベースがFlowになっていますね。ReactNativeのコードはFlowが使われていたりするので、今後Reactの本体のコードにもFlowが使われていくようになるかもしれません。

## React Native 0.25.1 (React Native Release)

* https://github.com/facebook/react-native/releases/tag/v0.25.1

これまでは、

```js
import React, { Component, View } from 'react-native';
```

と`react-native`からReactもComponentもimportする必要あったのが、

```js
import React, { Component } from 'react';
import { View } from 'react-native';
```

のようにView部分だけを`react-native`からimportする形になり、rendererの1つとしてのReact Nativeという形に近づきました。

## Flux 3.0 (Flux Release)

* https://github.com/facebook/flux/blob/master/CHANGELOG.md#300

大きなところでは、Immutable.jsのMapをStateとして使うためのMapStoreが削除されました。

## React Native Express (React Native Tutorial)

* http://www.reactnativeexpress.com/

ReactNativeのためのチュートリアル的なサイトです。サンプルが`react-native-web`を使って確認できるのは面白いですね。

## Proof of Concept: Enhancer Overhaul #1702 (Redux PR)

* https://github.com/reactjs/redux/pull/1702

Storeを拡張する辺りについての新しいコンセプトについて議論されています。

## Mobile Twitter Web(React Users)

* https://mobile.twitter.com/

TwitterのモバイルWeb版がいつの間にかリニューアルされていて、Reactが使われています。
React Developer Toolsで見る限り、`react-router`と`redux`も使われているようです。

## State management is easy - Introduction to MobX (Slide)

* https://speakerdeck.com/mweststrate/state-management-is-easy-introduction-to-mobx

Mendixというところが作ったMobXの紹介スライドです。
Storeとなるクラスの値をobservableにして、Compnentがobserveとなるような感じです。
これだとデータの流れが不明確になって大規模だと辛そうですが...。

