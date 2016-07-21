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

## Design Principles

* https://facebook.github.io/react/contributing/design-principles.html

Reactのドキュメントに新しく「Contributing」というセクションが追加されて、Design Principlesというドキュメントが追加されました。
今後、実装のOverviewなどが追加される予定で楽しみです。

Design Principlesでは、Reactが何を重要に考えていてどのように開発をされているかということを「Composition」「Common Abstraction」「Escape Hatches」「Stability」「Interoperability」「Scheduling」「Developer Experience」「Debugging」「Configuration」「Beyond the DOM」「Implementation」「Optimized for Tooling」「Driven by Facebook」という分類で解説されています。

Reactを始める時に最初に読む必要はないですが、Reactについてもっと知りたい人や、Reactを使うかどうか判断する場合に、とてもドキュメントになっています。

## Mixins Considered Harmful

* https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html

Facebook内のコードからMixinを削除しているという話をCore Noteで何度か紹介していましたが、その際の知見も含めた形で、Mixinからの移行を促すエントリーです。
（Mixin自体は、`React.createClass`に残されます）

Facebook内でMixinが利用されていたケースを取り上げ、High Order Componentsなどのパターンで置き換える方法が丁寧に説明されています。

Design Principlesのドキュメントもそうですが、Dan AbramovがReact Teamに加わってから色々整備されて、よくなってきてるのを感じます。

## Core Team meeting note

* https://github.com/reactjs/core-notes/blob/master/2016-07/july-07.md

ReactComponentは複数のReactElementを返すことができないので、`<div>`などで囲む必要があるのですが、これをFragmentsのようなものを導入してどうにかするという話が出ています。
2016年中には入れたいという感じのようです。

Rollupを使ったUMD Bundleのサイズ削減も取り上げられています。
ReactはCommonJSで書かれているのでCommonJSからES Moudlesに変換してRollupに渡す形になっていて、将来的にはES Modulesに移行したいけど、Facebook内部のビルドシステムでES Modulesを使えないのでそうせざるを得ないということのようです。

ファイルサイズについて考えた時に、Reactのイベントシステムの部分が大きな割合を占めていて、これはブラウザー間のAPIや挙動の違いを吸収するレイヤーになっているけど、必要なのかということも取り上げられています。

## Optimizing Compiler: Component Folding #7323

* https://github.com/facebook/react/issues/7323

## [META] v3.0.0 (ReactRouter)

* https://github.com/reactjs/react-router/issues/3611

ReactRouter v3.0.0についてのIssueです。
alpha.1から結構経ってますがそろそろ出そうですね。

## You might not need React Router

* https://medium.com/@tarkus/you-might-not-need-react-router-38673620f3d#.3ech54krr

ReactRouterを使わずに、ReactRouterが内部で使っている`history`を直接使えばいいのではというエントリーです。
