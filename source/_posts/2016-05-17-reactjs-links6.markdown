---
layout: post
title: "React.js Links vol.6 5/19〜5/27"
date: 2016-05-18 19:04:55 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## React v15.1.0

* https://github.com/facebook/react/releases/tag/v15.1.0

React v15.1.0がリリースされています。
基本的にはbug fixなどですが、Perfが書き直されています。その際、`printDOM`はdeprecatedになり、代わりに`printOperations`を使うようになりました。

## React Core Team meeting notes

* https://github.com/reactjs/core-notes/blob/master/2016-05/may-19.md

恒例のmeeting noteです。
今回のものは、`React.createClass`のAPIについてや、`PropTypes`の扱いなどについて触れられており、今後どうなっていくかに関わる重要なポイントに触れられています。

Stateless Functional ComponentsとES2015 ClassesによるComponent定義が中心であり、PropTypesについてはFlowやTypeScriptなどで置き換えていきたいという流れです。
まだ先の話になると思いますが。

その他にも、パッチ、マイナーリリースを2週間ごとに行う計画や、複数パッケージの管理に[Lerna](https://lernajs.io/)を使う計画などについても言及されています。


## RFC: Should createClass be considered legacy? (React PR)

* https://github.com/facebook/react/pull/6811

上記のmeeting notesにも関わる内容で、`React.createClass`をlegacyとして扱うためのブログポストのPRです。
結局、まだその時ではないということでmergeされませんでしたが、meeting note以上に詳しく書かれているので興味のある人はみるといいと思います。

## Support Server Rendering of `amp` Attribute #6798

* https://github.com/facebook/react/issues/6798

`amp`のタグをSSRでサポートするかどうかについてのIssueです。

## Redux 4.0 ?

Reduxで4.0に向けた議論が始まっています。

### RFC: Simplify middleware signature

* https://github.com/reactjs/redux/issues/1744

これは結局入らないみたいですね。

### Proof of Concept: Enhancer Overhaul

* https://github.com/reactjs/redux/pull/1702

`store base`と呼ばれているこちらのStore enhancerのAPI変更については議論中です。

## Spectacle 

* http://formidable.com/open-source/spectacle/

Reactを使い、JSXでスライドを作成するライブラリーです。
Markdownなんかも使えるようです。
