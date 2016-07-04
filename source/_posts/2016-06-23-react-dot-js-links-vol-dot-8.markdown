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
