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
GraphQLには含まれていない部分で、データソースから効率的にデータを取得する方法については、Dataloaderを紹介しています。
Dataloaderを使うことで、N+1問題やオーバーフェッチングを回避しています。

* https://github.com/facebook/dataloader

最後に、GraphQL概念として下の3つを紹介していました。

* Think Graphs, not Endpoints
* Single Source of Truth
* Thin API layer

Talkの後の休憩でQ&Aが盛り上がってたことが印象的でした。

## Jeff Morrison - A Deepdive Into Flow

<iframe width="560" height="315" src="https://www.youtube.com/embed/VEaDsKyDxkY" frameborder="0" allowfullscreen></iframe>

Flowの内部についてのTalkです。
FlowがどのようにJavaScriptのコードを解析しているのか、Parse(AST) 後の InferのフェーズでTypeHeapやOpenTを使ってどのように型情報を保持しているのかなど、かなりテクニカルな情報です。

ただ、内容自体は難しいというわけでもなく丁寧に説明されているので、面白いと思います。

Flowの使い方を知るのではなく、Flowがどのように型チェックを行っているのかを知りたい人にとっては面白いTalkだと思います。
個人的には、OpenTを利用して複数ファイルを並列にチェックしてる話とか面白いなぁと思いました。
また、FlowGraphはDead Code Eliminationなど様々なことにも利用できるとしています。

## Mihail Diordiev - Debugging flux applications in production

<iframe width="560" height="315" src="https://www.youtube.com/embed/cbXLohVbzNI" frameborder="0" allowfullscreen></iframe>

昨年のDan AbramovのReact Europeでのタイムトラベルのデモをさらに発展させたようなデモ中心のTalkです。

Redux DevTool Extensionを使ったActionとStateのexport、importやテストケースの作成の他、Remote Redux DevToolsを使い、本番でエラーや特定のActionが発生した時にActionとStateのhistoryを送信して手元で再現できるようにしています。

バグが起きるActionとStateをファイルに記録しておいて、記録したActionとStateを再生しながら修正するのはよさそうです。

また、ReduxだけでなくRxJSなどとも組み合わせて使ったり、ReactNativeやElectron環境でも使えるようです。

## Cheng Lou - On the Spectrum of Abstraction

<iframe width="560" height="315" src="https://www.youtube.com/embed/mVVNJKv9esE" frameborder="0" allowfullscreen></iframe>

ReactMotionやAnimationの話をするのかと思っていたら、ライブラリーやフレームワークなどの抽象化についてのTalkでした。

抽象化によるコスト、ライブラリーとフレームワークの違い、抽象化のレイヤーの違いによってどんな影響があるのか、Reactはなぜ今のようなアーキテクチャになっているのかといったことについて熱く話されています。

Grunt vs Gulp、React vs Templates、Immutability vs Mutability、CSS in JS vs Traditional CSSなどのわかりやすい例を用いた説明もあって面白いです。

* Don't Cover Every Use-case
* Not DRY is Fine
* Don't Be Swayed by Elegance
* When in Doubt, Use Examples

## Bertrand Karerangabo & Evan Schultz - React Redux Analytics

<iframe width="560" height="315" src="https://www.youtube.com/embed/MBTgiMLujek" frameborder="0" allowfullscreen></iframe>

Lean Analyticsを回すにあたり、Reduxでどのように計測するのかというTalkです。
後半はSegment.ioと組み合わせて使うためのredux-segmentというライブラリーの紹介やデモです。

----------------------------

## Day 2

https://www.youtube.com/playlist?list=PLCC436JpVnK0LTDKW3O_BGTZnrZ8dBAof

## Jonas Gebhardt - Evolving the Visual Programming Environment with React

<iframe width="560" height="315" src="https://www.youtube.com/embed/WjJdaDXN5Vs" frameborder="0" allowfullscreen></iframe>

ブラウザー上でのビジュアルプログラミングについてのデモと解説によるTalkです。
React、Flow、Redux、Immutable.js、RxJSなどを使い、データの流れをコードとビジュアルプログラミングをうまく連携させていて、とても面白いです。Flowの型情報を使って接続できる要素を可視化しているところとか。

ビジュアルプログラミングもただのデータの入力と出力であることがよくわかります。

## Bonnie Eisenman - React Native Retrospective

<iframe width="560" height="315" src="https://www.youtube.com/embed/-vl57brMWNg" frameborder="0" allowfullscreen></iframe>

オライリーから出ている「Learning ReactNative」の作者の人のTalkです。

* http://shop.oreilly.com/product/0636920041511.do

ReactNativeが発表されてから、今までの流れを時系列にわかりやすく説明しています。
具体的な使い方などではなくて、モバイルアプリ開発の状況やReactNativeの状況など、どのようにReactNativeが捉えられているのかがよくわかります。

ReactNativeに手を出してみようかと思っている人にとっては参考になると思います。

## Max Stoiber & Nik Graf - The Evolution of React UI Development

<iframe width="560" height="315" src="https://www.youtube.com/embed/0IkWuXeKPV0" frameborder="0" allowfullscreen></iframe>

Hot Reloadingを使って、Componentをインタラクティブに開発していくことについてのTalkです。
紹介していたCarte Blancheというライブラリーでは、PropTypes or FlowtypeからPropデータをランダムに生成してComponentの表示を確認できるようになっています。

* https://github.com/carteb/carte-blanche

また、データはファイルとして書き出されて、それを編集することでHot Reloadingで反映されるようになっています。
今は、React用でwebpackに依存していますが、様々な環境やライブラリーに対応する予定があるそうです。

react-storybookと似ていますが、こちらはデータをランダムに生成してくれる点などが違う点なのかなと思います。
どちらも使っていないので間違っているかもですが...。

* https://github.com/kadirahq/react-storybook

## Andrew Clark - Recomposing your React application

<iframe width="560" height="315" src="https://www.youtube.com/embed/zD_judE-bXk" frameborder="0" allowfullscreen></iframe>

ReactEuropeの中で数少ない、Reactに関するTalkです。
High Order Componentsとは何か、どんなユースケースがあるのか、パフォーマンスについてはどうなのかについて話されています。

```
// High Order Components
(...args) => Component => EnhancedComponent
```

Reduxなどを使う中で、HOCを使っている人も多いと思いますが、実際どうなっているのかやどんなことができるのかを知りたい人にとっては面白いTalkです。
また、HOCを多用した場合にComponentが深くネストした構造になり、パフォーマンスに影響を与えることについても、`compose`を使った方法やStateless Functional Componentsの場合にはその場でReactElementに展開するようにするといった方法を紹介しています。

実際のHigh Order Componentsの例については、本人が作っている`recompose`をみるといいと思います。

いかにPresentational Componentにロジックを入れないようにするかのヒントとなるTalkだと思います。

* https://github.com/acdlite/recompose

## Tadeu Zagallo - JavaScript, React Native and Performance

<iframe width="560" height="315" src="https://www.youtube.com/embed/1oL_OJ3UePU" frameborder="0" allowfullscreen></iframe>

ReactNativeが起動時にJavaScriptの部分で内部でどのように高速化しているのかという話です。

初期化をマルチスレッド化やモジュール初期化の遅延の他、プラットフォーム固有のコードのDead Code Eliminationなど。

またiOSではJITが使えず、AndroidではJITが使えたけど結果的に遅いという中で、ProfileをとってParse結果をバイトコードでキャッシュして改善していく流れが解説されています。
この最適化は今のところAndroidだけでまた有効化されているわけではないようです。

ReactNativeの内部的な話とか、JavaScriptの最適化に興味がある人にとっては面白いTalkだと思います。

## Jafar Husain - Falcor: One Model Everywhere

<iframe width="560" height="315" src="https://www.youtube.com/embed/nxQweyTUj5s" frameborder="0" allowfullscreen></iframe>

NetflixのTechnical LeadであるJafar HusainさんによるFalcorについてのTalkです。
話すペースは速いですが、さすが話し慣れているだけあってわかりやすいです。

https://twitter.com/jhusain

なぜNetflixがFalcorを作ったのか、Falcorの基本的な説明から、
ReactEuropeなのでGraphQLと比較しつつ、Falcorの方がシンプルで小さく簡単に始められることを強調しています。
GraphQLのように型が必要な場合は、JSONSchemaやTypeScriptと組み合わせることも可能だと説明しています。
また、GraphQLのQueriesのアプローチとFalcorのPathsの違いについても解説しています。

ベタに書いたJSONデータからFalcorを使うように変えていく説明もわかりやすいです。

Falcorの基本を知るにはとてもいいTalkです。JSON Graphをどのように実現しているのかなど。

## Brent Vatne - Building li.st for Android with Exponent and React Native

<iframe width="560" height="315" src="https://www.youtube.com/embed/cI9bDvDEsYE" frameborder="0" allowfullscreen></iframe>

ExponentでReactNativeを使ってAndroidのアプリを作った時の話です。
Nativeのカスタムビューを作成することなくできる、かなり実践的な快適なUIを実現する方法が解説されています。

* UIをブロックしないスムーズなListViewを、IncrementalなRenderingにより実現した話
* アニメーションを処理の前後で行うのではなく、同時にバックグラウンドの処理を実行することにより快適なアニメーションの実現する方法
* `ex-navigation`を使ったNavigationについて
* ユーザーインプットについて。キーボードイベントをどのようにハンドリングするか
* タッチやジェスチャーをどのようにハンドリングするのか

ReactNativeのAndroidでの事例として貴重なTalkだと感じました。

* https://github.com/exponentjs/

## Laney Kuenzel & Lee Byron - GraphQL Future

<iframe width="560" height="315" src="https://www.youtube.com/embed/ViXL0YQnioU" frameborder="0" allowfullscreen></iframe>

GraphQL TeamのメンバーによるGraphQLがオープンソースになってから起きたことと、GraphQLのこれからについてのTalkです。Keynoteっ
ぽい感じもあり、GraphQL使ってない人でも面白いTalkです。

> We only open source what we use

> We release what is generally useful

というFacebookの考えの中で、Facebook内で試していることをあくまでExperimentalとして紹介されています。

* 少しでも早く最初のコンテンツを返すための工夫としての`@defer`や`@stream`ディレクティブ
* リアルタイムアップデートを行うための`@live`ディレクティブ（プロダクションではまだ使われていない）
* 現時点ではReactiveなバックエンドを持っていないFacebookでは`@live`ディレクティブの導入も難しく、さらに複雑な依存関係の中で全ての変更を追従することが難しく、そのような状況の中でイベントベースのSubscriptionをGraphQLで実現するGraphQL Subscriptionsについて
    * Facebookでは、GraphQL SubscriptionsをMQTTを使って実現しているようです。
    * `subscription`のキーワード自体はgraphql-jsでもサポートされているようです。pubsubの処理は自身で実装する必要がありますが。このあたりはもっと一般化された際にはオープンソースになるかも？
    * Facebooで実際に使われている規模としては、`150B daily subscribes`、`35B daily payload deliveries`、`〜30 subscriptions in schema`だそうです。
    * GraphQL Subscriptionsによって、「xxx is writing a comment...」の表示や、live video上でのlive reactionの機能など多くのことが可能になったそうです。

## Martijn Walraven - Building native mobile apps with GraphQL

<iframe width="560" height="315" src="https://www.youtube.com/embed/z5rz3saDPJ8" frameborder="0" allowfullscreen></iframe>

Facebookの外ではまだまだGraphQL導入の敷居が高く、その中でiOSやAndroidアプリからどのようにGraphQLを使えばいいのかというTalkです。
GraphQL Schemaを使ってクライアントでどのように型付けをするのか、RelayのようにGraphQLから取得したデータをどのように一元管理するかという内容です。
ちょっと消化不良感がありました。

* https://medium.com/apollo-stack

## Question and Answers with core team members

<iframe width="560" height="315" src="https://www.youtube.com/embed/5pMDd1t2thc" frameborder="0" allowfullscreen></iframe>

Sessionに登壇していたFacebookのエンジニアによるQ&Aです。
ざっくりまとめると前半がGraphQLについて、後半がアーキテクチャについての話が多い印象です。

GraphQLについては、どのようにSQLに変換すればいいか、本編のTalkにあったGraphQL Subscriptionsについて、GraphQL Fragmentをどうやってテストするのか、バージョニングについてなどの質問がありました。

Reactについては、DevTool APIがそのうち公開されるという話がありました。内部的にはReactPerfで使われているものです。
あとはHigh Order Componentsについての質問もありました。
このあたりは「Andrew Clark - Recomposing your React application」や下記のブログで詳しく解説されています。

＊ https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html

後半はImmutable.jsについての質問や、1からFacebookを作り直すならどういうアーキテクチャで作るかという質問から、アーキテクチャの話になっています。
JavaScriptにImmutableなデータ型があれば何が変わるのかと言ったことや、Immutabilityとパフォーマンスについてなど。
JavaScriptではMutablityがデフォルトなので、Immutablityが複雑なものとして捉えられますがそれはコンテキストによるもので、デフォルトがImmutableでで例外としてMutableを扱う言語もあり、Immutabilityの方がローレベルでシンプルなだという話など。

途中で紹介されるImmutable App Architectureについては別でブログ書いたのでそちらを。

* http://blog.koba04.com/post/2016/06/21/immutable-app-architecture/

その他には、TypeScriptではなくFlowを採用するメリットについての質問やTypeScriptとFlowを組み合わせることについてなど、Flowについての質問もありました。

全体的には、Lee Byron劇場な感じですが、とても面白いQ&Aになっています。
