---
layout: post
title: "browserify in Backbone.Marionette project"
date: 2014-03-22 13:39:46 +0900
comments: true
categories: browserify backbone.js marionette.js
---

## browserify

* http://browserify.org/

browserifyはbrowser環境でもnodeのようにrequire('xxx')というスタイルで依存しているライブラリを読み込むことが出来るようになるもので、最近盛り上がってますね。

(Backboneなど色々なプロジェクトでbrowserifyについて議論されていたり)

ここでは基本的な使い方は省略して、Backbone + Marionetteなサンプルプロジェクトをbrowserify対応してみたのでその構成についてを書きたいと思います。

<!-- more -->

(まだ全然理解出来てないので、もっといい方法があれば教えて欲しいです)

## Sample Project

* https://github.com/koba04/backbone-boilerplate

サンプルプロジェクト過ぎると役に立たないと思うので、webアプリっぽくLast.FMのAPI使ってアーティストの人気の曲一覧を表示するようなアプリにしてみました。

{% img /images/last-fm-top-tracks.png 'Atrist Top Tracks by Last.FM' %}

* http://koba04.com/last-fm-top-tracks/


## grunt-browserify

* Gruntfile.coffee
```coffeescript
    browserify:
      app:
        files: "public/js/app.js": [ "coffee/**/*.coffee", "template/**/*.hbs" ]
        options:
          ignore: ["coffee/vendor.coffee"]
          extensions: [".coffee", ".hbs"]
          transform: ["coffeeify", "hbsfy"]
          aliasMappings: [
            {
              cwd: 'coffee'
              dest: 'myapp'
              src: ['**/*.coffee']
            }
            {
              cwd: 'template'
              dest: 'template'
              src: ['**/*.hbs']
            }
          ]
          external: [
            "jquery"
            "underscore"
            "backbone"
            "backbone.marionette"
            "handlebars"
          ]
          alias: [ "hbsfy/runtime:handlebars" ]
      vendor:
        files: "public/js/vendor.js": ["coffee/vendor.coffee"]
        options:
          transform: ["coffeeify"]
          alias: [
            "jquery"
            "underscore"
            "backbone"
            "backbone.marionette"
          ]
      spec:
        files: "specs/spec.js": [ "specs/**/*.coffee" ]
        options: "<%= browserify.app.options %>"
```

### transform

coffeescriptのcompileやhandlebarsのprecompileは、coffeeifyとhbsfyというtransformを使っています。

coffeescriptやhandlebarsのgrunt pluginを別途使用する必要がなくていいですね。

### separate files

ライブラリ(vendor)とアプリ(app)のjsを分けているのは、ブラウザでのキャッシュやビルド時間を少しでも短くするためです。

### external

vendor.jsのaliasで指定して、app.jsのexternalでそれを指定することでapp.js側にライブラリが含まれないようになります。

hbsfy/runtimeもそうしたかったのですが、どうしてもapp.js内で展開されてしまったのでapp.js内で指定しています...


### aliasMappings

browserifyはそのファイルからの相対パスを指定する必要があるので階層が深くなってくると階層を意識するのが面倒になります。

そこで、aliasmappingsを使ってどこからでも同じパス指定(**require 'myapp/collections/users'**)のように指定出来るようにしています。

```
# coffee/view/items/hoge.coffee

# before
users = require '../../collections/users'

# after (anywhere!)
users = require 'myapp/collections/users'
```

### ???
テスト用のspec.jsにアプリのjsも含まれてしまっているので、ホントはspec.jsにはテストだけが含まれてapp.jsを別に読み込むようにしたいのですがその方法がわからず・・・

* aliasで全部のmodelとかviewを指定すれば出来そうな気もするけどそれは面倒なのでやりたくない・・・。

## 使う例

* アプリ(coffee/views/layouts/top.coffee)

```coffeescript
'use strict'

Backbone          = require 'backbone'
ArtistSearchView  = require 'myapp/views/items/artist_search'
TracksView        = require 'myapp/views/collections/tracks'
Artist            = require 'myapp/models/artist'
tracks            = require 'myapp/collections/tracks'
template          = require 'template/layouts/top'

module.exports = class extends Backbone.Marionette.Layout
  template: template
  regions:
    artistSearch: ".js-artist-search"
    topTracks:    ".js-top-tracks"

  onRender: ->
    @artistSearch.show new ArtistSearchView model: new Artist
    @listenTo tracks, 'reset', @showTracks

  showTracks: ->
    @topTracks.show new TracksView collection: tracks
```

* テスト(specs/views/layouts/top_spec.coffee)

```coffeescript
describe "views/layouts/top", ->
  expect            = require 'expect.js'
  sinon             = require 'sinon'
  Backbone          = require 'backbone'
  TopView           = require 'myapp/views/layouts/top'
  ArtistSearchView  = require 'myapp/views/items/artist_search'
  TracksView        = require 'myapp/views/collections/tracks'
  Artist            = require 'myapp/models/artist'
  tracks            = require 'myapp/collections/tracks'
  template          = require 'template/layouts/top'

  view = null
  beforeEach ->
    view = new TopView

  it "extends Marionette.Layout", ->
    expect(view).to.be.a Backbone.Marionette.Layout

  it "template is layouts/top", ->
    expect(view.template).to.be template

  describe "onRender", ->
    beforeEach ->
      sinon.spy view, "showTracks"
      view.onRender()

    it "artistSearch region has artist_search view", ->
      expect(view.artistSearch.currentView).to.be.a ArtistSearchView

    it "artist_search view has models/artist", ->
      expect(view.artistSearch.currentView.model).to.be.a Artist

    it "listenTo tracks's reset event, trigger showTracks", ->
      tracks.reset []
      expect(view.showTracks.calledOnce).to.be.ok()

  describe "showTracks", ->
    beforeEach ->
      view.showTracks()

    it "topTracks region has tracks view", ->
      expect(view.topTracks.currentView).to.be.a TracksView

    it "tracks view has collections/tracks", ->
      expect(view.topTracks.currentView.collection).to.be tracks
```

## まとめ

* まだまだ情報が少ない気がしますが、依存関係を意識せずrequireでライブラリを使えるのはわかりやすくてよさそうに感じました。
* https://github.com/koba04/backbone-boilerplate

## 参考

* http://aeflash.com/2014-03/a-year-with-browserify.html
