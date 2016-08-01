---
layout: post
title: "React.js Links vol.10"
date: 2016-08-04 19:38:19 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。
10回目!!!

<!-- more -->

## Create Apps with No Configuration

* https://facebook.github.io/react/blog/2016/07/22/create-apps-with-no-configuration.html
* https://github.com/facebookincubator/create-react-app

Reactを使ったSingle Page Applicationのひな形を作成している公式のcliがリリースされました。
これまでFacebookは自分たちが実際にプロダクトで使っているものだけをOSSにする方針でしたが、今回はコミュニティーの声に応えて作成したものです。

インストールして、`create-react-app hello-world`として、`npm start`すればもう開発できるのは手軽でいいですね。
また、`npm run eject`すると`react-scripts`というパッケージの内部に隠れていたwebpackの設定などが全部展開されてカスタマイズ出来るようになるのも面白いですね。

まだ公開されてすぐなので、`facebookincubator/create-react-app`のリポジトリが、Reactを使ったプロジェクトの構成について多くの人が意見を交わしていてなかなか混沌としています。

## Jest 14.0: React Tree Snapshot Testing

* http://facebook.github.io/jest/blog/2016/07/27/jest-14.html

Jestが密かに追加されている新しいテスト用のrendererを使って、snapshot testをサポートしたという話です。
snapshot testなので、一度テストを実行するとスナップショットのファイルが作成されて、次回からはそのスナップショットとテストが一致するかどうかを判定する感じです。

その他にもReactNativeのサポートや、今後の予定(Jasmine捨てる)などが書かれています。

## React.js in patterns

* http://krasimirtsonev.com/blog/article/react-js-in-design-patterns

High Order ComponentsやContextをDIなど、Reactのパターン集です。

## Function as Child Components

* https://medium.com/@iammerrick/function-as-child-components-5f3920a9ace9#.bnfwsk5un

公式のブログでも言及されて、広く使われるようになったHigh Order Components(HOC)ですが、HOCではなくてchildrenに関数を渡すFunction as Child Componentsのパターンの方が有効ではないかとエントリーです。

Function as Child Componentsにすることで、不要なComponentのラッピングをなくすことが出来たり、Propsの衝突を避けることも容易だとしています。

## Use RxJS with React

* http://michalzalecki.com/use-rxjs-with-react/

RxJSを使ってReduxライクな状態管理を行う方法についてのエントリーです。

## How to handle state in React. The missing FAQ.

* https://medium.com/react-ecosystem/how-to-handle-state-in-react-6f2d3cd73a0c

Reactを学ぶ時に最初からReduxなどを使うのではなくて、ReactのStateから始めようってことで、Stateを扱う方法についてエントリーです。

## Redux vs MobX vs Flux vs... Do you even need that?

* http://goshakkk.name/redux-vs-mobx-vs-flux-etoomanychoices/

上記のエントリーと同じように、まずはReactだけで始めて必要になったらReduxやMobXについて検討しましょうというエントリーです。
Reactだけだと何が辛くて、何を解決するためにReduxなどのライブラリーを使うのかを理解してないと、ただ覚えることが増えたみたいに感じるということはありそうです。
