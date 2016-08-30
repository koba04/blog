---
layout: post
title: "React.js Links vol.11"
date: 2016-08-25 14:13:04 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## React Core Meeting Notes

7/21, 28, 8/4のMeeting Noteがまとめて公開されました。

`React.createClass`のES classes化については、引き続き進められているようで、すでに80%がES classesになったそうです。
Public Class Fieldsがstage2になったことも紹介されています。

その他には、`create-react-app`をリリースしたことや、そこでのJestサポートについても紹介されています。
また7/28のMeeting Noteでは、Reconcilerの位置付けについて解説されています。Reconcilerはrendererに属するものであり、react本体にはComponentやReactElementを作成する部分のみが含まれているという形です。
それにより、新しいReactFiberのReconcilerの導入もすでにあるReact Componentに手を入れることなくできるとしています。

（Reactの中では、完全にrenderer毎にコードが分かれているわけではなくて、共通化されている部分もありますが）

* https://github.com/reactjs/core-notes/blob/master/2016-07/july-21.md
* https://github.com/reactjs/core-notes/blob/master/2016-07/july-28.md
* https://github.com/reactjs/core-notes/blob/master/2016-08/august-04.md

## PATTERNS FOR STYLE COMPOSITION IN REACT

CSS in JSでのパターン集です。

* http://jxnblk.com/writing/posts/patterns-for-style-composition-in-react/

## Strip flow-only class props without needing transform-class-properties. #3655 (Babel)

`babel-plugin-transform-flow-strip-types`でtype annotationのためだけに使われているclass propertiesを削除するというPRです。
これがmergeされると、Flowのtype annotationのためだけに`babel-plugin-transform-class-properties`を追加する必要はなくなります。

* https://github.com/babel/babel/pull/3655

## exponentjs/exponent

ReactEurope 2016でAndroid版の事例を紹介していたReactNativeで作られたExponentのiOS/Android版が公開されています。

* https://github.com/exponentjs/exponent

## react-history

* https://github.com/ReactTraining/react-history

## Animating in React

* http://slides.com/sdrasner/react-rally#/

## Async Redux Actions With RxJS

* http://www.slideshare.net/benlesh1/async-redux-actions-with-rxjs-react-rally-2016
