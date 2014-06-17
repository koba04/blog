---
layout: post
title: "Don't use Backbone.Model#toJSON for render"
date: 2014-06-17 23:32:16 +0900
comments: true
categories: backbone.js
---


Marionette.jsのrepoを見ていて知ったのですが、BackboneのtoJSONをViewをrenderするデータを作る目的では使うべきではないということです。

* https://github.com/marionettejs/backbone.marionette/issues/1476

<!-- more -->

## toJSON

Backbone.ModelやBackbone.CollectionはtoJSONというメソッドを持っていて実装はattributesをcloneして返すようになっています。

* Model(https://github.com/jashkenas/backbone/blob/master/backbone.js#L296-L298)

```js
toJSON: function(options) {
  return _.clone(this.attributes);
},
```

* Collection(https://github.com/jashkenas/backbone/blob/master/backbone.js#L645-L647)

```js
toJSON: function(options) {
  return this.map(function(model){ return model.toJSON(options); });
},
```

toJSONはBackbone内では、ajaxリクエストを行うBackbone.syncの中でModelのデータをシリアライズするために使われています。


## The many uses of Model#toJSON()

* https://github.com/jashkenas/backbone/issues/2134

Backbone.syncの中で使われているこのtoJSONですが、以前のBackboneのドキュメント内ではtemplateをrenderする際に下記のような感じでtoJSONが使われていたため、toJSONをrenderするときに使うことが広まってしまっているようです。

```js
this.$el.html(this.template(this.model.toJSON()));
```

というわけで、サーバーに送るデータを作るメソッドとtemplateに渡すデータを作るメソッドが同じなのは２つの全く違う役割を持っている点もよくないし、サーバーに送りたい形式とtemplateで使いたい形式が異なる場合などに不都合が生じるのでよくないとして、ドキュメントは修正されました。


## Marionette.js

https://github.com/marionettejs/backbone.marionette/pull/745

Marionette.jsではItemViewにtemplateに渡すデータを作るためのserializeDataというメソッドがあって、その中ではtoJSONが呼ばれています。

```js
serializeData: function(){
  var data = {};

  if (this.model) {
    data = this.model.toJSON();
  }
  else if (this.collection) {
    data = { items: this.collection.toJSON() };
  }

  return data;
},
```

ですが上記の理由から2.0またはそれ以降からはtoJSONが使われなくなりそうです。

このpullreqだと、serializeModel(Collection)というメソッドを定義してそのなかではtoJSONと同じくcloneしたattributesを返す形になっています。

```js
serializeModel: function(model){
  return _.clone(model.attributes);
},
```

```js
serializeCollection: function(collection){
  return collection.map(function(model){ return this.serializeModel(model); }, this);
},
```

## Conclusion

Backboneでtemplateに渡すデータを作るためにtoJSONを使うことは推奨されていないので注意しましょう。


