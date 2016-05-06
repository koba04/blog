---
layout: post
title: "React.js Links vol.4"
date: 2016-05-02 09:41:13 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->


## React v15.0.2 (React Release)

* https://github.com/facebook/react/releases/tag/v15.0.2

## React Core Meeting Note April 28 (React Meeting Note)

* https://github.com/reactjs/core-notes/blob/master/2016-04/april-28.md
* https://github.com/reactjs/core-notes/pull/10

## Add new ReactPerf #6046 (React PR)

* https://github.com/facebook/react/pull/6046

## Refactor composite component update flow #1965 (React PR)

* https://github.com/facebook/react/pull/1965

## Only fire input value change events when the value changes #5746 (React PR)

* https://github.com/facebook/react/pull/5746

## RFC: New Reconciler Infra (React PR)

* https://github.com/facebook/react/pull/6690

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

## Mobile Twitter Web(React Users)

* https://mobile.twitter.com/

TwitterのモバイルWeb版がいつの間にかリニューアルされていて、Reactが使われています。
React Developer Toolsで見る限り、`react-router`と`redux`も使われているようです。

## State management is easy - Introduction to MobX (Slide)

* https://speakerdeck.com/mweststrate/state-management-is-easy-introduction-to-mobx

Mendixというところが作ったMobXの紹介スライドです。
Storeとなるクラスの値をobservableにして、Compnentがobserveとなるような感じです。
これだとデータの流れが不明確になって大規模だと辛そうですが...。

