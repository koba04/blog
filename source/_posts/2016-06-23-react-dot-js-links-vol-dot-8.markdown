---
layout: post
title: "React.js Links vol.8"
date: 2016-06-23 13:33:36 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## React v15.2.0

* https://github.com/facebook/react/releases/tag/v15.2.0

15.2.0がリリースされました。

プロダクションビルドでエラーコードが付加されるようになりエラーの調査がしやすくなったことや、PropTypesやkeyのwarning時のスタックトレースがComponentのツリーで表示されるようになりました。
開発をサポートするための機能です。

その他はちょっとしたバグ修正などが中心です。

## Core Notes June 23

* https://github.com/reactjs/core-notes/blob/master/2016-06/june-23.md

恒例のCore TeamのMeeting Noteです。

Facebook内での`React.createClass`からClassによるComponent定義への移行作業は引き続き行われているようです。

## Core Notes June 30

* https://github.com/reactjs/core-notes/blob/master/2016-06/june-30.md

こちらもMeeting Noteです。
新しいReconcilerが徐々に動き始めているようです。
また、`React.createClass`からClassによるComponentによる移行についても進んでいるようです。
下のcodemodを使って、ClassによるComponent定義&property initializer&Flowに変換を行っているようです。

* https://github.com/reactjs/react-codemod/pull/54

React Teamとしては、Class + property initializer + Flowの組み合わせについては、ドッグフーディング中なので現時点では推奨しているわけでないという立場です。

また、Facebook内部ではPureRenderMixinがたくさん使われていて、それを置き換えるためのものとして`React.PureComponent`が考えられているようです。

`React.PureComponent`に関しては、最初のProposalでは内部のStateless Functional Componentsにも最適化が適用される予定でしたが、混乱や問題点があることから、新しく出されたPRではただのClass版のPureRenderMixinとなっています。

* https://github.com/facebook/react/pull/7195
* https://github.com/facebook/react/issues/6914

また、`React.createClass`をAddonにして、さらに`Perf`と`TestUtils`以外のAddonsについては、React Team外にownershipを移して管理するも考えているようです。

## Resolve refs in the order of the children #7101

* https://github.com/facebook/react/pull/7101

更新時の新しくマウントされるReactElementに対するRefの解決する順番を変更するPRです。
詳しくはPRにある画像を見るとわかると思います。

## Added jsx-self babel transform plugin #3540

* https://github.com/babel/babel/pull/3540

warning目的でReactElementに`__self`のPropを追加するBabelのtransfomerです。
developmentの時だけ有効にすることが推奨されています。

## Spec proposal: extending the language to allow spreading children #57

* https://github.com/facebook/jsx/issues/57

JSXでのchildrenの仕様に対するProposalです。
JSXChildを拡張して`{...children}`を許容するようにするものです。

## RFC: Flat bundle using Rollup

* https://github.com/facebook/react/pull/7178

現在CommonJSベースで書かれているReactのコードをRollupでバンドルしてTree ShakingやDead Code Eliminationによりファイルサイズを削減するPRです。React Teamのインターンの人ですね。

まずはトップレベルでない`require`を全てトップレベルにしてES Modulesに変換できるようにして、BabelでCommonJSをES Modulesに変換してRollupでバンドルするという方法を採っているようです。
(RollupのCommonJSプラグインを使う方法よりサイズが小さくなるらしいです)

## Flow v0.28.0

* https://github.com/facebook/flow/releases/tag/v0.28.0

Flowの0.28.0がリリースされています。
変更内容については、下記のブログでも書かれています。

* https://flowtype.org/blog/2016/07/01/New-Unions-Intersections.html

## ReactNative v0.29.0

* https://github.com/facebook/react-native/releases/tag/v0.29.0

ReactNativeの0.29.0がリリースされています。
