---
layout: post
title: "vueifyでcomponent化"
date: 2014-10-07 15:29:06 +0900
comments: true
categories: vue.js browserify
---

https://github.com/vuejs/vueify

vueifyというVue.js用のbrowserifyのtransformが出てたので紹介。

<!-- more -->

以前にpartialifyやstylify、coffeeify、insert-cssなどを組み合わせてHTML、JavaScript、CSSをComponent化する方法を紹介しましたがそれをさらに進めて1つのファイルで完結することが出来るようになっています。

http://blog.koba04.com/post/2014/04/17/reusable-components-by-vuejs-and-browserify/

## 使い方

vueifyを使うと1つのファイルにHTMLとJavaScriptとCSSを全部まとめて書くようになり、1ファイルが1Componentという形になります。

```
<script lang="coffee">
  module.exports =
    data: ->
      view: "top"
</script>

<template>
  <div v-component="{{view}}" v-transition></div>
</template>

<style lang="stylus">
  #app
    .v-enter
      -webkit-animation: fadein 0.5s
      -webkit-animation-delay: 0.2s
      animation: fadein 0.5s
      animation-delay: 0.2s
      opacity: 0
    .v-leave
      -webkit-animation: fadeout 0.2s
      animation: fadeout 0.2s

  @keyframes fadein
    0%
      transform: scale(0.5)
      -webkit-transform: scale(0.5)
      opacity: 0
    50%
      transform: scale(1.2)
      -webkit-transform: scale(1.2)
      opacity: 0.7
    100%
      transform: scale(1)
      -webkit-transform: scale(1)
      opacity: 1

  @keyframes fadeout
    0%
      transform: scale(1)
      -webkit-transform: scale(1)
    100%
      transform: scale(0)
      -webkit-transform: scale(0)
</style>
```

https://github.com/koba04/vue-boilerplate/tree/master/src

coffeescriptとstylus以外にも、less、scss(node-sass)、jadeなどを指定することが出来ます。

## syntax highlight

1つにまとめて、vueっていう拡張子付けたりするとシンタックスハイライトどうするのかという問題になりますが、SublimeTextだとこれで大丈夫なようです
(使ってないのでわからないですが)

https://gist.github.com/yyx990803/9194f92d96546cebd033

vimとかの場合は...


まぁ、ちょっとしたものを作るときにvueify使ってみるのもいいのではないでしょうか。
