---
layout: post
title: "Marionette Behaivors (1.7 feature)"
date: 2014-03-23 15:14:30 +0900
comments: true
categories: marionette.js
---

## Release 1.7

https://github.com/marionettejs/backbone.marionette/blob/master/changelog.md

Marionette 1.7がリリースされましたね。今回の大きな変更はBehaivorsというのが追加されたことです。

## Behaivors

BehaivorsというのはViewでのMixinみたいなもので、MarionetteでViewを作っていると共通の処理をまとめたいけど、継承関係にするのもなんか違うなぁということがあってそういうときに使うことが出来ます。

<!-- more -->

* https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.behavior.md
* https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.behaviors.md

上のドキュメントを見るとだいたいわかるのですが、例にあるようにtooltipだったりViewを閉じるときにalertを出したりしたいときに便利です。

## How to use

ここでは指定された秒数経過すると消えるviewを作ってみます

### Marionette.Behaviors.behaviorsLookup

Behaivorsを使うには最低限、Marionette.Behaviors.behaviorsLookupを実装する必要があります。

behaviorsLookupで返した値を元にgetBehaviorClassというメソッドでBehaivorを取得するような処理になっていて、getBehaivorClassのデフォルトの実装は、**Behaviors.behaviorsLookup[key]**のようにbehaviorsLookupで返したオブジェクトにkeyを渡して取得するようになっています。

なのでここでは単純にオブジェクトを返してみます。

```coffeescript
Backbone.Marionette.Behaviors.behaviorsLookup =  ->
  return {
    Close: CloseBehavior
  }
```

### Behaivor

BehaivorではonShow、onRenderなどのイベント、$,$elがproxyされていて、Behaivorを使用しているviewもviewとして参照できるのでその辺りを使って処理を書いていきます。

```coffeescript
class CloseBehavior extends Backbone.Marionette.Behavior
  defaults:
    seconds: 3  # 指定がない場合は3秒で閉じる
  onShow: ->
    setTimeout =>
      @view.close()
    ,@options.seconds * 1000
```

### View

Viewではbehaivorsとして使いたいBehaivorのkey(getBehaivorClassに渡される)とoptionを指定するだけです

```coffeescript
class SomeView extends Backbone.Marionette.ItemView
  behaviors:
    Close:
      seconds: 10
```


View周りの処理をまとめやすくなっていいですね！

