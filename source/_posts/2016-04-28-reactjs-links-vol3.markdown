---
layout: post
title: "React.js Links vol.3 4/20〜4/29"
date: 2016-04-28 19:19:19 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

# Move React Core Integration and Injection to the Core Repo #6338 (React Issue)

* https://github.com/facebook/react/pull/6338

React NativeのReactとの連携部分がReactのリポジトリの中に含まれるようになりました。
特に何か変わることはないと思いますが、よりReact Nativeはreact-domのようにただのrendererの1つであるという位置付けになっていく流れなのかなと思います。

(実際なかなかそこまでうまく分割できていないようですが...)
