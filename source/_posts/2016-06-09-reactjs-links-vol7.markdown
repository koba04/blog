---
layout: post
title: "React.js Links vol.7"
date: 2016-06-16 13:33:36 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## React Core Team meeting notes

恒例のCore Teamのmeeting noteです。

### May 26

* https://github.com/reactjs/core-notes/blob/master/2016-05/may-26.md

主にES classesによるComponent定義で`React.createClass`による定義を置き換えることについて書かれています。
ドキュメントやMixinをどうするか、Class Property Initializerについてのスタンスなど。

その他では、Incremental Reconcilerが入った時にTestUtilsのrenderIntoDocumentが同期的なことについてどうするかについても触れられています。

### June 2

* https://github.com/reactjs/core-notes/blob/master/2016-06/june-02.md

PureComponentによるStateless Functional Componentsの最適化について多く触れられています。
また、Facebookのコードベースを`React.createClass`からES classesに移行する計画があるようです。

* https://github.com/facebook/react/pull/6914

### June 9

* https://github.com/reactjs/core-notes/blob/master/2016-06/june-09.md

主に新しいReconcilerの状況についてや、問題となる点について話されています。

あとは、Facebook内の`React.createClass`からES classesに移行する方法についてが引き続き触れられています。

新しいトピックでいうと、大きなfeatureについてはTC39のようにchampionを立てて進めていくプロセスを採用するかどうかが検討されているようです。

## RFC: Make Refs Opt-in #6974

* https://github.com/facebook/react/issues/6974

Refsをopt-inの機能にするという提案(discussion)です。

## React ContextTypes, PropTypes when using an already static typed language like TypeScript #6525

* https://github.com/facebook/react/issues/6525

PropTypesのFlowやTypeScriptで置き換えた場合でもContextTypesを使う必要があることについてのIssue(?)です。

## New marketing copy on homepage #7012

* https://github.com/facebook/react/pull/7012

Reactのトップページに、特徴として書かれていた「JUST THE UI」、「VIRTUAL DOM」、「DATA FLOW」が「Declarative」、「Component-Based」、「Learn Once, Write Anywhere」に更新されました。

この変更は、Reactは「JUST THE UI」でありMVCのVだという記述が、Reactを使う時にReduxなどのFlux系のライブラリーが必ず必要であるかのように捉えられてしまっている現状なんかも踏まえたもののようです。

## ReactEurope

ReactEuropeの動画が公開されています。

* https://www.react-europe.org/
* https://www.youtube.com/playlist?list=PLCC436JpVnK09bZeayg-KeLuHfHgc-tDa (Day1)
* https://www.youtube.com/playlist?list=PLCC436JpVnK0LTDKW3O_BGTZnrZ8dBAof (Day2)

## Experimenting with React Native at Khan Academy

* https://docs.google.com/document/d/1PU51njrUweehKFgSu69C7OAEdyp6rHmsvQ7KIcLaHqw/edit#

Khan AcademyでのReactNativeについてのレポートです。実際に取り入れようとした時に何が問題になったかなど触れられていて参考になります。

## Q&A with Ben Alpert

* https://github.com/reactiflux/q-and-a/blob/master/ben-alpert_react-core.md

Reactのcore memberであるBen Alpertに対するQ&Aです。
New renconcilerについてのトピックが多くて興味深いです。

## State Streams and React

* https://medium.com/@markusctz/state-streams-and-react-7921e3c376a4#.39bp3z2fa

RxJSでRedux風なアーキテクチャを構築し、Reactと組み合わせて作るというエントリーです。わかりやすいです。
後半は作者が実際に作った`udeo`というライブラリーについての説明です。

* https://github.com/mcoetzee/udeo

## react-enroute

* https://github.com/tj/react-enroute

TJが開発しているreact-router風なlightweightなルーティングライブラリーです。
ルーティングにはenrouteというライブラリーを使っていて、react-enrouteはReactとの繋ぎこみだけをやっているような感じです。

* https://github.com/lapwinglabs/enroute

## 3 Reasons why I stopped using React.setState

* https://medium.com/@mweststrate/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e#.umnvins0y

ReactのsetStateのハマリどころなどについて解説したエントリーです。
MobXの作者なので、後半はMobX最高という感じになっています。

## Feature Request: Allow reducers to consult global state #1768

* https://github.com/reactjs/redux/pull/1768

Reduxのreducerで各ReducerでグローバルなStateも受け取れるようにしようというfeature requestです。
mergeされそうな雰囲気?
