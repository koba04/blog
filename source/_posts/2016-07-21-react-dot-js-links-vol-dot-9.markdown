---
layout: post
title: "React.js Links vol.9"
date: 2016-07-21 19:38:19 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## React v15.2.1

* https://github.com/facebook/react/releases/tag/v15.2.1

Bug Fixやwarningの追加などが中心です。

## Introducing React's Error Code System

* https://facebook.github.io/react/blog/2016/07/11/introducing-reacts-error-code-system.html

React v15.2.0で導入されたエラーコードシステムの解説です。
これにより、プロダクションビルドでもエラーの詳細を確認することができるようになります。

## Core Team meeting note

* https://github.com/reactjs/core-notes/blob/master/2016-07/july-07.md

ReactComponentは複数のReactElementを返すことができないので、`<div>`などで囲む必要があるのですが、これをFragmentsのようなものを導入してどうにかするという話が出ています。
2016年中には入れたいという感じのようです。

Rollupを使ったUMD Bundleのサイズ削減も取り上げられています。
ReactはCommonJSで書かれているのでCommonJSからES Moudlesに変換してRollupに渡す形になっていて、将来的にはES Modulesに移行したいけど、Facebook内部のビルドシステムでES Modulesを使えないのでそうせざるを得ないということのようです。

ファイルサイズについて考えた時に、Reactのイベントシステムの部分が大きな割合を占めていて、これはブラウザー間のAPIや挙動の違いを吸収するレイヤーになっているけど、必要なのかということも取り上げられています。

## [META] v3.0.0 (ReactRouter)

* https://github.com/reactjs/react-router/issues/3611

ReactRouter v3.0.0についてのIssueです。
alpha.1から結構経ってますがそろそろ出そうですね。

## You might not need React Router

* https://medium.com/@tarkus/you-might-not-need-react-router-38673620f3d#.3ech54krr

ReactRouterを使わずに、ReactRouterが内部で使っている`history`を直接使えばいいのではというエントリーです。
