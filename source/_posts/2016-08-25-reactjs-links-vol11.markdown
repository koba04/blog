---
layout: post
title: "React.js Links vol.11"
date: 2016-08-25 14:13:04 +0900
comments: true
categories: react.js react-links
---

これはReactに関する記事や気になるissueなどのリンクを紹介する記事です。

<!-- more -->

## PATTERNS FOR STYLE COMPOSITION IN REACT

CSS in JSでのパターン集です。

* http://jxnblk.com/writing/posts/patterns-for-style-composition-in-react/

## Strip flow-only class props without needing transform-class-properties. #3655 (Babel)

`babel-plugin-transform-flow-strip-types`でtype annotationのためだけに使われているclass propertiesを削除するというPRです。
これがmergeされると、Flowのtype annotationのためだけに`babel-plugin-transform-class-properties`を追加する必要はなくなります。

* https://github.com/babel/babel/pull/3655
