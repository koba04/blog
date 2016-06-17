---
layout: post
title: "A brief memo of ReactEurope2016 sessions"
date: 2016-06-13 18:33:46 +0900
comments: true
categories:
---

https://www.react-europe.org/

メインのTalkの動画を一通り見たので、一言解説を。

<!-- more -->

## Day 1

https://www.youtube.com/playlist?list=PLCC436JpVnK09bZeayg-KeLuHfHgc-tDa

## Dan Abramov - The Redux Journey

<iframe width="560" height="315" src="https://www.youtube.com/embed/uvAXVMwHJXU" frameborder="0" allowfullscreen></iframe>

去年のReactEuropeでのTalkで一躍有名になり、Reactの中の人になったDan AbramovによるKeynoteです。
Reduxを発表してから何が起きたのか、何を大事にしているのかについて話しています。

改めてReduxのパターンを説明しつつ、ConstraintsとしてReduxが大事に考えていることについて話されています。
Reduxの考え方や現状がわかりやすく説明されています。

また、Talkの最後には新しいReduxのegghead.ioのビデオが公開されました。
これは、前回のものに比べて、より実践的な内容になっています(まだ見てないけど...)。

* https://egghead.io/courses/building-react-applications-with-idiomatic-redux

## Eric Vicenti - Native Navigation for Every Platform

<iframe width="560" height="315" src="https://www.youtube.com/embed/dOSwHABLvdM" frameborder="0" allowfullscreen></iframe>

ReactNativeでiOS、Android、Webの各Platform共通で使えるNavigationExperimentalについてのTalkです。

* https://github.com/ericvicenti/navigation-rfc

DeeplinkやAndroidのバックボタンなど様々なActionを、ReduxのようにStateをReducerを使って宣言的に処理するアプローチです。
また、アプリの中の1機能としてNavigationを持った機能を埋め込む方法についても解説されています。

## Lin Clark - A cartoon guide to performance in React

<iframe width="560" height="315" src="https://www.youtube.com/embed/-t8eOoRsJ7M" frameborder="0" allowfullscreen></iframe>

Code CartoonsでおなじみのLin ClarkによるReactアプリケーションのパフォーマンスについてのTalkです。

https://code-cartoons.com/

Reactをガッツリ使っている人は知っていることが多いと思いますが、Reactでのパフォーマンスのポイントをブラウザーのレンダリングの仕組みからReactでのレンダリングの流れまで通してわかりやすく説明しています。

## Krzysztof Magiera - React Native ❤ 60FPS -- Improving React Native

<iframe width="560" height="315" src="https://www.youtube.com/embed/qgSMjYWqBk4" frameborder="0" allowfullscreen></iframe>

ReactNativeでのアニメーションについてのTalkです。
Platform固有のNativeComponentを使ったAnimationと、LayoutAnimationとAnimated.jsを使った場合のそれぞれCons,Prosについて、パフォーマンスチューニングついてのポイントについて解説しています。

* https://facebook.github.io/react-native/docs/animations.html
* http://facebook.github.io/react-native/docs/interactionmanager.html

## Christopher Chedeau - Being Successful at Open Source

<iframe width="560" height="315" src="https://www.youtube.com/embed/nRF0OVQL9Nw" frameborder="0" allowfullscreen></iframe>

CSS in JSのプレゼンでもおなじみで、ReactやReactNative、css-layoutをやっているvjeuxによる、OSSを成功に導くために必要なことについてのTalkです。
テクニカルな内容ではなく、ReactをどのようにOSSとして成功させたのかということについて解説しています。
OSSのプロジェクトをやっていたり、参加したいと思っている人にとっては面白いTalkだと思います。
GitHubのIssueスタイルなプレゼンも面白いです。

* Demo Driven Development

## Dan Schafer - GraphQL at Facebook

<iframe width="560" height="315" src="https://www.youtube.com/embed/etax3aEe2dA" frameborder="0" allowfullscreen></iframe>

GraphQLの基本的な概念の説明と、認証はどのように実装するのか、効果的なデータの取得方法などを実際のコードを出しながら解説したTalkです。

GraphQLの3つの概念。

* Think Graphs, not Endpoints
* Single Source of Truth
* Thin API layer

Talkの後の休憩でQ&Aが盛り上がってたことが印象的でした。

## Jeff Morrison - A Deepdive Into Flow

<iframe width="560" height="315" src="https://www.youtube.com/embed/VEaDsKyDxkY" frameborder="0" allowfullscreen></iframe>

## Mihail Diordiev - Debugging flux applications in production

<iframe width="560" height="315" src="https://www.youtube.com/embed/cbXLohVbzNI" frameborder="0" allowfullscreen></iframe>

## Cheng Lou - On the Spectrum of Abstraction

<iframe width="560" height="315" src="https://www.youtube.com/embed/mVVNJKv9esE" frameborder="0" allowfullscreen></iframe>

## Bertrand Karerangabo & Evan Schultz - React Redux Analytics

<iframe width="560" height="315" src="https://www.youtube.com/embed/MBTgiMLujek" frameborder="0" allowfullscreen></iframe>

----------------------------

## Day 2

https://www.youtube.com/playlist?list=PLCC436JpVnK0LTDKW3O_BGTZnrZ8dBAof

## Jonas Gebhardt - Evolving the Visual Programming Environment with React

<iframe width="560" height="315" src="https://www.youtube.com/embed/WjJdaDXN5Vs" frameborder="0" allowfullscreen></iframe>

## Bonnie Eisenman - React Native Retrospective

<iframe width="560" height="315" src="https://www.youtube.com/embed/-vl57brMWNg" frameborder="0" allowfullscreen></iframe>

## Max Stoiber & Nik Graf - The Evolution of React UI Development

<iframe width="560" height="315" src="https://www.youtube.com/embed/0IkWuXeKPV0" frameborder="0" allowfullscreen></iframe>

## Andrew Clark - Recomposing your React application

<iframe width="560" height="315" src="https://www.youtube.com/embed/zD_judE-bXk" frameborder="0" allowfullscreen></iframe>

## Tadeu Zagallo - JavaScript, React Native and Performance

<iframe width="560" height="315" src="https://www.youtube.com/embed/1oL_OJ3UePU" frameborder="0" allowfullscreen></iframe>

## Jafar Husain - Falcor: One Model Everywhere

<iframe width="560" height="315" src="https://www.youtube.com/embed/nxQweyTUj5s" frameborder="0" allowfullscreen></iframe>

## Brent Vatne - Building li.st for Android with Exponent and React Native

<iframe width="560" height="315" src="https://www.youtube.com/embed/cI9bDvDEsYE" frameborder="0" allowfullscreen></iframe>

## Laney Kuenzel & Lee Byron - GraphQL Future

<iframe width="560" height="315" src="https://www.youtube.com/embed/ViXL0YQnioU" frameborder="0" allowfullscreen></iframe>

## Martijn Walraven - Building native mobile apps with GraphQL

<iframe width="560" height="315" src="https://www.youtube.com/embed/z5rz3saDPJ8" frameborder="0" allowfullscreen></iframe>

## Question and Answers with core team members

<iframe width="560" height="315" src="https://www.youtube.com/embed/5pMDd1t2thc" frameborder="0" allowfullscreen></iframe>
