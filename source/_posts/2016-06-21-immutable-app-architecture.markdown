---
layout: post
title: "Immutable App ArchitectureについてのTalkを観た"
date: 2016-06-21 01:30:35 +0900
comments: true
categories: architecture
---

<iframe src="https://player.vimeo.com/video/166790294" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/166790294">Render 2016 - Lee Byron</a> from <a href="https://vimeo.com/whiteoctober">White October</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

* https://vimeo.com/166790294
* http://2016.render-conf.com/talks.php#immutable-user-interfaces

Dan AbramovもReact EuropeのQ&AでおすすめしていたTalkで、改めて見て面白い内容だったので紹介します。

FacebookがReactやGraphQL、Immutable.jsを使ってどのようなアーキテクチャでアプリケーションを作成しているのかということを解説したTalkです。
特にFluxのような新しい概念が提唱されているわけではありませんが、最近のフロントエンドの流れやFacebookが目指しているものがわかりやすく解説されています。

Architectureの話が中心で各ライブラリーの説明や、細かい実装についてのTalkではありません。
各ライブラリーの使い方が〜という話ではなく、どういったArchitectureでWebやiOSやAndroidなどのクライアントサイドを作っていくのかを考えたい人にとっては、参考になるTalkだと思います。

というわけで、軽く内容を。
いろいろ省略しているので、気になった人はぜひTalkを観てください。

<!-- more -->

## Immutable App Architecture

まず最初に、Architectureの選択は、アプリケーションの品質、開発の簡単さや難しさ、リリース後の改善のサイクルにも大きく影響を及ぼすものであるとしています。

> Architecture is about Choosing Elements of Abstraction

例として、MVC & RESTなArchitectureをInformation Richなアプリケーションで採用した場合、**What Changed** と **Data Synchronization** の部分が問題になるとしています。
変更管理とデータ同期の部分ですね。

特にFacebookは、ネットワーク環境が整備されていない国も含めた全世界にサービスを提供しているので、**Data Synchronization** におけるネットワークのレイテンシーの解決については力を注いでいるように感じます。

Webの場合、 **What Changed** の部分にはReactを使ったComponentによるViewの抽象化とImmutable.jsによるデータ管理の単純化、 **Data Synchronization** の部分にはGraphQLを使って必要最低限のデータのやりとりのみ行う方法を解説しています。

これらを踏まえて、Immutable App Architectureとして、下記の図のような構成を紹介しています。

![Immutable App Architecture](/images/posts/immutable-app-architecture/immutable-app-architecture.png)

詳細については動画を見てほしいのですが下のような要素があります。
Fluxについて聞いたことがあるとだいたいイメージできると思います。

### Component

Componentは下のようなStateを受け取りViewを返すピュアな関数です。
Viewへの反映を最適化します。

```
(State) => View
```

ReactやReactNative、ComponentKitが担っている部分です。

### View

DOMやUIViewやAndroidのViewなど各Platformが提供しているViewです。
Mutationが前提になっていて、管理や最適化が難しいとしています。

### Actions

新しいStateを作成する部分です。

```
(State) => State
```

ActionごとにStateを再作成するのはパフォーマンス的にツラいのでは？ということに対しては、**Structural Sharing** のアプローチを紹介しています。

Structural Sharingは、Immurable.jsなどで使われていて、変更があった箇所とその上位の要素だけを再作成して、その他は参照を付け替えるだけなので全体を毎回再生成しているわけではないということです。
もちろん、Immutable.jsを使わなくても実装することは可能で、Reduxを使っている人にはおなじみだと思います。

![Structural Sharing](/images/posts/immutable-app-architecture/structual-sharing.png)

Immutableにすることにより、Memoizationなどの最適化のテクニックも適用しやすいとしています。

また、サーバーからデータを取得するActionのI/Fは下記のように定義しています。

```
(State) => State, Promise<State>
```

`(State) => Promise<State>`の場合、ネットワークが貧弱な環境ではユーザーにすぐにレスポンスを返せないので、「すぐに反映させるためにクライアント側で作成したState」と「サーバーからのレスポンスを反映したStateを返すPromise」の2つを返しています。
このアプローチは次のQueueの部分でも重要になってきます。

もっと複雑な非同期処理をやっている人にとっては、Observableなどで処理した方がいいのかもしれませんが、これで十分なことも多いのかなと思います。

### Queue

同時に発生する複数のActionをシリアライズして処理するためのQueueです。

`(State) => State, Promise<State>`のActionの場合、Promiseで解決されるStateを本当のState(**True State**)として、Promiseでない方のStateを **Optimistic State** として扱います。

```
(State) => State, Promise<State>
   |         |              |--------> True State
   |         |----> Optimistic State
   |--> Current State
```

`(State) => State, Promise<State>`の場合、まずは **Optimistic State** の方をStateとして扱いViewが更新されます。その後、Promiseがresolveされた時に、**True State** が更新されてQueueにあるActionが再度適用されます。

TODOアイテムの作成を例にすると、下記のような流れになると解説されています。

-----------------------

* 入力したTODOのテキストをOptimistic Stateとして即時にStateに反映する
* QueueにあるActionをOptimistic Stateに適用する

〜サーバーからレスポンスが返ってくる〜

* サーバーから受け取ったidなどを持った完全な形のTODOをTrue Stateに反映する
* QueueにあるActionを再度True Stateに適用する

-----------------------

これにより、ネットワークリクエストが失敗した場合は、 **Optimistic State** から **True State** に戻せばいいだけなのでロールバックも簡単だとしています。

![Action Queue](/images/posts/immutable-app-architecture/action-queue.png)

それぞれ依存する`(State) => State, Promise<State>`のActionが複数Queueに積まれた時にどう処理するのかなど細かい不明な点はありますが、こんな感じだと思います。

### State

Stateはアプリケーションの状態でImmutableです。
Action毎に作成されます。

Initial Stateはサーバーから作成されます。

### Models

ModelはStateを構成するComponentが必要とするGraphQLのTypeで定義されたデータの形です。

> Colocated Data Dependencies

Plainなオブジェクト（JavaでいうPOJO）であることを推奨しています（JSの場合はImmutable.jsのデータ構造の場合も）。

![Model](/images/posts/immutable-app-architecture/immutable-app-model.png)

## まとめ

![Immutable App Architecture](/images/posts/immutable-app-architecture/immutable-app-architecture.png)

上記のように構成されるImmutable App Architectureは **Pure Function**、**Immutability**、**Composition** を組み合わせた **Composition of Simple Elements** だとしています。
Immutable App ArchitectureはFacebookのアプリでも使われていてフィットしているとのことです。

と、しながらもArchitectureの選択はトレードオフだとしています。
なのでアプリケーションを完成させた後も、すぐにゼロから再構築することを考えて、よりよいArchitectureを常に探求する必要があるとしています。

> There is no Architecture Nirvana.

> Exploration and Improvement.

Please watch the video!

* https://vimeo.com/166790294

(詳細が聞き取れなかった部分もあるので、間違ってるところがあったら指摘してもらえるとありがたいです)
