---
layout: post
title: "React.js Links vol.3 4/20〜4/28"
date: 2016-04-28 19:19:19 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## React core meeting notes April 21 (React)

* https://github.com/reactjs/core-notes/blob/master/2016-04/april-21.md

ReactのCore Teamによるmeeting note(4/21)が公開されています。

特に大きな何かがあるわけではないですが、いくつかのbugをfixした`15.0.2`が今週にも出そうです。
その他では、v15のリリース時にバタバタしたのでリリースプロセスの見直しなどが検討されているようです。
あとは、ReactのコードベースをFlow化することも議題に挙がっていました。

次の大きなfeatureとしては下のNew Core AlgorithmのIssueです。
詳細はまだわかりませんが、現在一度にまとめて行っているDOMの更新を分割して行うような感じになるなのかなと思います。
最初に表示されている部分だけを更新して、その後に非表示エリアのDOMを非同期で更新するみたいな。

この内容はこの後で紹介するDan AbamovのQ&Aでも言及されていたので興味のある人は見てみるといいと思います。

* https://github.com/facebook/react/issues/6170

## Disabled inputs should not respond to clicks in IE (React Issue)

* https://github.com/facebook/react/pull/6215

IE11でdisableだった場合にもonChageイベントが発行されるバグを修正するPRがmergeされました。

## Move React Core Integration and Injection to the Core Repo #6338 (React Issue)

* https://github.com/facebook/react/pull/6338

React NativeのReactとの連携部分がReactのリポジトリの中に含まれるようになりました。
特に何か変わることはないと思いますが、よりReact Nativeはreact-domのようにただのrendererの1つであるという位置付けになっていく流れなのかなと思います。

(実際なかなかそこまでうまく分割できていないようですが...)

## Provide info about component tree to devtools #6549 (React Issue)

* https://github.com/facebook/react/pull/6549

React Perfの再構築に伴って、React DevToolのようなものを作るための環境が整備されてきています。
ソースを見る感じ、EventHandlerを登録しておくことで、Reactの中で起こるイベントをlistenすることができるようになるのでthird partyのライブラリーも作りやすくなるのかなと思います。

## Add comments/attribute indicating which component was rendered #6559 (React Issue)

* https://github.com/facebook/react/issues/6559

ChromeとFirefox以外のReactのDevToolsを持っていないブラウザーだと、どのComponentがrenderされたのかわからないので、`data-reactcomponent`のような属性をDOMに付与するのはどうかという提案です。
もちろん開発環境のみで、別のフラグでOn/Offできるような感じで。

いるのかな...。

## QA with Dan Abramov in Reactiflux (Link)

* https://github.com/reactiflux/q-and-a/blob/master/dan-abramov_react-core.md

Dan AbramovがReactifluxのDiscordで行ったQ&Aのまとめです。
Facebookで何をやってるとかRedux、Reactについての質問に答えています。

今後の予定は下記で確認できます。Ben Alpertの会が個人的に楽しみです。そして何気にJonathan Carterが。

* https://paper.dropbox.com/doc/Reactiflux-QA-Schedule-7QAfGzEqfKjtN9UmhYYM9

## Remove unneeded code #1640 (Redux Issue)

* https://github.com/reactjs/redux/pull/1640

Reduxのutils/warningがなぜ↓のようなことをしているのか。

```js
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message)
  /* eslint-disable no-empty */
  } catch (e) { }
```

https://github.com/reactjs/redux/blob/master/src/utils/warning.js#L13-L19

"break on all exceptions"を有効にしている時にここで止まるようにしているんですね。なるほど。

## How to sync Redux state and url hash tag params (Redux Stackoverflow)

* http://stackoverflow.com/questions/36722584/how-to-sync-redux-state-and-url-hash-tag-params/36749963#36749963

ReduxでURLのqueryやhashで状態を管理したい時にStateとどう同期すればいいの？`react-router-redux`使えばいいの？という質問です。
それに対して作者のDan Abramovが解答しています。
Reduxの質問に解答しているのをよく見るのでわからないことがあったらstackoverflowで聞いてみるといいかもしれないですね。

Stateと管理する必要はなくて、必要となった時にURLから値を取得して使えばいいという答えです。
StateにすることでActionになるので、リプレイなどがやりやすくなるメリットはありますが、必要でない場合は複雑になるだけです。

## MobX (Library)

* https://github.com/mobxjs/mobx

Observableを活用したReduxライクなState Managementのライブラリーです。
TypeScriptで書かれています。
Reactと組み合わせることが想定されているようで、Reactとbindingするためのライブラリーもあります。

10分でわかる説明

* https://mobxjs.github.io/mobx/getting-started.html

ちゃんと中身見てないので、イマイチどのあたりが素晴らしいのかわからかなったので、気が向いたらまた見てみます。
`@observable decorator (ES2015)`って書いたのがとても気になりました...。

## AMA with Lee Byron (Link)

* https://hashnode.com/ama/with-lee-byron-cin0kpe8p0073rb53b19emcda

GraphQLやImmutable.jsのメンテナーであるLee Byronが 4/28 AM3:00(何時間??)にAMAやるみたいなので質問がある人は書いてみるといいと思います。
