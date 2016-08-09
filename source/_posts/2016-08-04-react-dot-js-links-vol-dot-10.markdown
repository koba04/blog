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

## React v15.3.0

* https://github.com/facebook/react/releases/tag/v15.3.0

Reactのv15.3.0がリリースされました。

今回の大きな変更点は、`React.PureComponent`の追加です。
これは、PureRenderMixinのES Classes版というような実装で、自動的に`shouldComponentUpdate`にshallowEqualが適用されるというものです。
最初このPRが出された時には、内部のStateless Functional Componentにも最適化が適用されるという実装も含まれていましたが、PR内での議論で問題点などが見えたため、今回はただのPureRenderMixin for ES Claseesとして入りました。

今後、v16のタイミングなどでさらなる最適化が追加される可能性はあります。

もう一つ、大きな点は`react-test-render`というパッケージのリリースです。
これは、TestUtilsのShallowRenderと似ていますが、Shallowではなく子孫までrenderして結果をReactElementのJSONとして返します。
refやライフサイクルメソッドなどが呼ばれる点もShallowRenderとは異なります。

```js
import renderer from 'react-test-renderer';

const json = renderer.create(<App />).toJSON();
```

Jestにはこれを使ったsnapshottestが追加されました。


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

## A STEP-BY-STEP TDD APPROACH ON TESTING REACT COMPONENTS USING ENZYME

* http://thereignn.ghost.io/a-step-by-step-tdd-approach-on-testing-react-components-using-enzyme/

Enzymeを使って、React ComponentをTDDでテストを書いていく方法についてのエントリーです。
TDDの流れに沿って順番にテストを書いていく方法が丁寧に解説されています。

## The Problem with CSS-In-JS, circa Mid-2016

* https://medium.com/@taion/the-problem-with-css-in-js-circa-mid-2016-14060e69bf68#.ndfajua3p

CSS in JSやCSS ModulesのようなComponentに閉じたCSSを使う場合の問題点についてのエントリーです。
コンテキストによるスタイルの違いを、CSSがそれぞれ独立している中でどのようにComponentとして表現するかという内容です。

## React Native at SoundCloud

* https://developers.soundcloud.com/blog/react-native-at-soundcloud

SoundCloudがReactNativeでSoundCloud Purseのアプリを作った時の話です。
なぜReactNativeを使ったのか、実際使ってみてどうだったのかが書かれています。

## A Glimpse Into The Future With React Native For Web

* https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/

`react-native-web`の現状についてのエントリーです。
基本的には、まだプロダクションで使うレベルにはなっていないけど今後に期待という感じです。

## React Fiber Architecture

* https://github.com/acdlite/react-fiber-architecture

現在実装が進められているReact内部のアルゴリズムであるReact Fiberについてのエントリーです。
詳細については書かれていませんが、導入としては良さそうです。

ちなみにacdliteさんは、今setStateのReact Fiber対応をやっています。

* https://github.com/facebook/react/pull/7344

## Internationalization in React

* https://medium.freecodecamp.com/internationalization-in-react-7264738274a0#.33osi3w58

`react-intl`を使ったReactを使ったアプリケーションでのi18n対応についてのエントリーです。

## Flow: Mapping an object

* https://medium.com/@thejameskyle/flow-mapping-an-object-373d64c44592#.xm62m8pic

Flowでどのように型付けをしていけばいいのかということを、`map-obj`に型付けしていきながら解説しているエントリーです。
わかりやすいです。
