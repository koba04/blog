---
layout: post
title: "React.js Links vol.3 4/20〜4/29"
date: 2016-04-28 19:19:19 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## Move React Core Integration and Injection to the Core Repo #6338 (React Issue)

* https://github.com/facebook/react/pull/6338

React NativeのReactとの連携部分がReactのリポジトリの中に含まれるようになりました。
特に何か変わることはないと思いますが、よりReact Nativeはreact-domのようにただのrendererの1つであるという位置付けになっていく流れなのかなと思います。

(実際なかなかそこまでうまく分割できていないようですが...)

## Add comments/attribute indicating which component was rendered #6559 (React Issue)

* https://github.com/facebook/react/issues/6559

ChromeとFirefox以外のReactのDevToolsを持っていないブラウザーだと、どのComponentがrenderされたのかわからないので、`data-reactcomponent`のような属性をDOMに付与するのはどうかという提案です。
もちろん開発環境のみで、別のフラグでOn/Offできるような感じで。

いるのかな...。

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
