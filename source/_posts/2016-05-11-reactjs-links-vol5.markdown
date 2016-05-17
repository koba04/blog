---
layout: post
title: "React.js Links vol.5"
date: 2016-05-18 23:27:34 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## React Core Meeting Note May 12 (React Meeting Note)

* https://github.com/reactjs/core-notes/blob/master/2016-05/may-12.md

恒例のCore TeamのMeeting Noteです。
現在だと、production build時のエラーがわかりにくいものであったりとエラー周りの仕組みに不便なところがあるのでそれを改善することをReact Teamに来たインターンの人がやるそうです。すごい環境のインターンだ...。

RustやEmber参考にしたRFCのプロセスを構築することが検討されているようです。
また、ShallowRenderingとは別のテスト用にrendererのプロトタイプが作られていたりとこちらも興味深いです。

## Docs need one or more diagrams #653 (Redux Issue)

* https://github.com/reactjs/redux/issues/653#issuecomment-216844781

Reduxでのデータの流れがダイアグラムで示されていてわかりやすいので、はじめて触る人は見ておくといいかもしれません。

## Tiny React Renderer (GitHub Repository)

* https://github.com/iamdustan/tiny-react-renderer

ReactのRendererを理解するための小さな実装です。カスタムRendererを作りたかったり、Reactの内部を知りたい人はソースをみるといいんじゃないかと思います。

## react-router-scroll (GitHub Repository)

* https://github.com/taion/react-router-scroll

ReactRouterでスクロールマネージメントを行うためのライブラリーです。
scroll-behaviorをラップする感じになっているようです。

## flow-typed (GitHub Repository)

* https://github.com/flowtype/flow-typed

Flowの型定義を管理するリポジトリーです。前に公開されたリポジトリーですが、最近型定義が集まり出しています。

## Higher Order Components: Theory and Practice

* http://engineering.blogfoster.com/higher-order-components-theory-and-practice/

ReactでMixinの代わりとしてよく使われるHigh Order Componentsのパターンについてのエントリーです。

## redux-observable (Redux Middleware)

* https://medium.com/@benlesh/redux-observable-ec0b00d2eb52

ReduxとRxJS v5を組み合わせるためのライブラリーについてのエントリーです。
Ben LeshさんはRxJS v5のメインの開発者であり、以前に紹介した通りReduxに`es-observable`のspecに対応させるPRを送っていましたがここで結びつきました。このライブラリーはNetflixでも使っているようです。

http://blog.koba04.com/post/2016/04/19/reactjs-links-vol2/

## React Elements vs React Components vs Component Backing Instances (React)

* https://medium.com/@fay_jai/react-elements-vs-react-components-vs-component-backing-instances-14d42729f62

ReactElementとReact ComponentとComponentのinstanceの違いについてのエントリーです。

## Getting Started with React Native Development on Windows

* https://shift.infinite.red/getting-started-with-react-native-development-on-windows-90d85a72ae65

ReactNativeの開発をWindows上で行う方法について解説したエントリーです。

## UI Testing in React

* https://voice.kadira.io/ui-testing-in-react-74fd90a5d58b#.tr0046jgs

ReactでのUIテストについてのエントリーです。
テストをFunctional TestingとVisual Testingに分類して、Functional Testingはenzymeを、Visual TestingはReact 
Storybookをそれぞれ使う方法が紹介されています。

## React Amsterdam

* https://speakerdeck.com/reactamsterdam
* https://www.youtube.com/channel/UCsFrt8oKNYXGspSlX9u6uXw

React Amsterdamのスライドと動画が公開されています。
ReactNativeのinternalの話もあったりして色々面白そうです。

* https://speakerdeck.com/reactamsterdam/tadeu-zagallo-facebook-london-react-native-architecture-overview
