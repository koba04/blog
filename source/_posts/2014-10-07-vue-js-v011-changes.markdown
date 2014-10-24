---
layout: post
title: "Vue.js v0.11の変更点(予定)まとめ"
date: 2014-10-07 13:04:51 +0900
comments: true
categories: vue.js
---

Vue.js v0.11のrc版もリリースされて、v0.10からの変更点が多いのでchangesを参考にまとめてみました。

** rc3がリリースされたので修正・追記しました **

APIの変更も多いですが、data継承の仕組みが完全に変わっているのでその辺りは注意が必要ですね。

```
npm install vue@0.11.0-rc2
```

<!-- more -->

まだ安定してなかったりドキュメントはv0.10のものしかなくてchangesとmergeしながら読む必要があったりするので、これから開発する人は今のタイミングはどのバージョンを使えばいいのかちょっと悩ましいですね。v0.11系を使っていった方がいいとは思いつつ。

今回の変更でも見えるのですが、Angular.js以外にもBackbone.jsやReact.jsなど様々なフレームワークからいいところを持ってきてるところがVue.jsの面白いところですね。

https://github.com/yyx990803/vue/blob/0.11.0-rc3/changes.md

## Instantiation process

`el`オプションがインスタンス化する際に指定されていなかった場合、以前は空のdivを作成していましたが"unmounted"な状態となり新しく追加された`$mount`メソッドにquerySelectorを渡すことでViewと紐付けるようになりました。

``` js
var vm = new Vue({ data: {a:1} }) // only observes the data
vm.$mount('#app') // actually compile the DOM

// in comparison, this will compile instantly just like before.
var vm = new Vue({ el: '#app', data: {a: 1} })
```

* `$mount()`を引数なしで呼ぶと空の`<div>`が作成されます。


## New Scope Inheritance Model

以前のバージョンではprototypeなデータ継承の仕組みを持っていませんでした。にも関わらず`this.$parent`や`this.$get`を使って親scopeの値を参照することが出来ました。

新しいバージョンでは、Angular.jsに似た継承システムを持っていて、直接親scopeの値を参照することが出来ます。
大きな違いは子scopeで値を設定するとそれは親scopeにも影響することです。

この例がわかりやすいです。 http://jsfiddle.net/Px2n6/2/

デフォルトではtemplate内で入れ子にしても親scopeは継承しません。これは意図せず親scopeの値を書き換えないようにするためです。
もし親scopeを継承したい場合は`inherit: true`オプションをつける必要があります。

`v-repeat`と`v-if`は親scopeをデフォルトで継承します。


## Instance Option changes

### `Vue.extend`内で`el`と`data`を使用する場合は関数定義にする必要があります。

```js
var MyComponent = Vue.extend({
  el: function () {
    var el = document.createElement('p')
    // you can initialize your element here.
    // you can even return a documentFragment to create
    // a block instance.
    el.className = 'content'
    return el
  },
  data: function () {
    // similar to ReactComponent.getInitialState
    return {
      a: {
        b: 123
      }
    }
  }
})
```

### `events`オプション追加されました

Backbone.jsのeventsみたいな感じですね。
$emitで発行する独自イベント以外にも`hook:created`のようなライフサイクルイベントについても定義することが出来ます。

```js
var vm = new Vue({
  events: {
    'hook:created': function () {
      console.log('created!')
    },
    greeting: function (msg) {
      console.log(msg)
    },
    // can also use a string for methods
    bye: 'sayGoodbye'
  },
  methods: {
    sayGoodbye: function () {
      console.log('goodbye!')
    }
  }
})
// -> created!
vm.$emit('greeting', 'hi!')
// -> hi!
vm.$emit('bye')
// -> goodbye!
```

### `watch`オプションが追加されました

`events`のようにwatchしたい対象の評価式とコールバックをオブジェクトの形式で定義することが出来ます。
わかりやすく書けるようになっていいですね。

### `inherit`オプションが追加されました(デフォルトはfalse)

親scopeの`data`を継承するかどうかの設定です。
継承することで

1. 親scopeの値をtemplateで参照することが出来るようになります
1. 親scopeの値をインスタンスから直接アクセス出来るようになります

### `mixin`オプションが追加されました

いわゆるmixinってやつです。

```js
var mixin = {
  created: function () { console.log(2) }
}
var vm = new Vue({
  created: function () { console.log(1) },
  mixins: [mixin]
})
// -> 1
// -> 2
```

### `name`オプションが追加されました

デバッグしやすさのために名前をつけることが出来るようになりました。

```js
var SubClass = Vue.extend({
  name: 'MyComponent'
})
var instance = new SubClass()
console.log(instance) // -> MyComponent { $el: ... }
```

### `parent`オプションが削除されました

かわりに$addChildを使うことが出来ます。

```js
var child = parent.$addChild(options, [contructor])
```

### `lazy`が削除されました

ViewModelに指定するのではなくて、`v-model`毎に設定すべきだからということで`v-model`のoptionになりました。

### `id`、`tagName`、`className`、`attributes`も削除されました

代わりに`el`に関数定義して指定するようにします

### `created`のhookの挙動が変更されました

データバインディングされた後に呼ばれるにようになったので、dataを追加する場合は$addや$removeを使わないとデータバインディングの対象にならなくなりました。

### `ready`のhookの挙動が変更されました

documentに初めて追加されるときだけに呼ばれるようになりました。これまでと同じように使いたい場合は`compiled`を使ってください。

### `beforeCompile`のhookが追加されました

インスタンス化されてDOMのcompileが開始される前に呼ばれます。

### `compiled`のhookが追加されました

これまでの`ready`のタイミングで呼ばれて、初期のデータでのcompileが終了したタイミングで呼ばれます。

### `afterDestroy`のhookが`destroy`に変更されました


## Instance methods change

### `$watch`に評価式を渡せるようになりました

```js
vm.$watch('a + b', function (newVal, oldVal) {
  // do something
})
```

### `$watch`でのdeep watchの挙動が変わりました

デフォルトではwatchに渡した値に対する変更しか監視しなくなったので、ネストしたオブジェクトの評価をしたい場合は、第三引数に`true`を渡す必要があります。

```js
vm.$watch('someObject', callback, true)
vm.someObject.nestedValue = 123
// callback is fired
```

### `$watch`の即時実行

第四引数にtrueを渡すことで初回に値をセットするときにもcallbackを実行させることが出来ます。

```js
vm.$watch('a', callback, false, true)
// callback is fired immediately with current value of `a`
```

この辺、deepWatchと合わせて第三引数をoptionsなオブジェクトにしたほうがいいと思う。

### `$unwatch`は削除されて、`$watch`の戻り値である関数を呼ぶことでunwatchされます

```js
var unwatch = vm.$watch('a', cb)
// later, teardown the watcher
unwatch()
```

### `vm.$get`に評価式を渡せるようになりました

```js
var value = vm.$get('a + b')
```

### `vm.$add`と`vm.$delete`が追加されました

ViewModelのプロパティを追加・削除するときに使います。
まぁでも、インスタンス化する際に全てのプロパティをnullなどで設定しておく方がいいです。

### `vm.$eval`が追加されました

filterも適用することが出来ます。

```js
var value = vm.$eval('msg | uppercase')
```

### `vm.$interpolate`が追加されました

template文字列を評価することが出来ます。

```js
var markup = vm.$interpolate('<p>{{msg | uppercase}}</p>')

```

### `vm.$log`が追加されました

インスタンスのdataを生のオブジェクトとしてみることが出来ます(getter/setterなし)。

```js
vm.$log() // logs entire ViewModel data
vm.$log('item') // logs vm.item
```

### `vm.$compile`が追加されました

DOMをcompileすることが出来て、戻り値としてteardownするときに使うdecompileする関数を返します。
decompile関数ではDOMは削除されません。
主にカスタムdirectiveを書く人のためのメソッドです。


## Computed Properties API Change

### `$get`、`$set`は`get`、`set`になりました

```js
computed: {
  fullName: {
    get: function () {},
    set: function () {}
  }
}
```


## Directive API change

### directiveに動的な値を指定出来るようになりました

こんな感じでv-viewみたいなことが出来るようになりました

{% raw %}
```html
<div v-component="{{test}}"></div>
```
{% endraw %}

今サポートしているのは`v-component`だけで、独自directiveを作る時は`update`関数を実装することでハンドリング出来ます。


### `v-model`に`lazy`属性と`number`属性が追加されました

`lazy`はこれまでインスタンスオプションにあった、enterキー押したときかフォーカス外れた時だけにchangeイベントが発行されるものがv-modelの属性になりました。

`number`はmodelに反映されるときにNumber型にすることが出来ます。

### select要素に`v-model`としてtextとvalueを含んだオブジェクトの配列を渡すとoption要素として評価してくれます

```js
[
  { text: 'A', value: 'a' },
  { text: 'B', value: 'b' }
]
```

```html
<select>
  <option value="a">A</option>
  <option value="b">B</option>
</select>
```

### select要素に`v-model`としてlabelとoptionsを含んだオブジェクトの配列を渡すとoptgroup要素として評価してくれます

```js
[
  { label: 'A', options: ['a', 'b']},
  { label: 'B', options: ['c', 'd']}
]
```

```html
<select>
  <optgroup label="A">
    <option value="a">a</option>
    <option value="b">b</option>
  </optgroup>
  <optgroup label="B">
    <option value="c">c</option>
    <option value="d">d</option>
  </optgroup>
</select>
```

### `v-component`に`keep-alive`属性を指定するとインスタンスを破棄せずにキャッシュしておいてくれるようになります

Viewの切り替えを`v-component`で行うときに使うとよさそうです。使い方間違うとリークしそうですが...。

### `v-repeat`に`trackby`を指定することで、配列の値を再利用することが出来るようになりました

配列のdataにAPIのレスポンスなどを適用してswapされた場合など、今までは全部の要素を作りなおしていたのですがtrackbyを指定することで既存の値は再利用してくれるようになりました。React.jsのkeyみたいな感じ。

```js
items: [
  { _id: 1, ... },
  { _id: 2, ... },
  { _id: 3, ... }
]
```

```html
<li v-repeat="items" trackby="_id">...</li>
```

### `v-with`で親と子のインスタンスの間で2wayバインディングされないようになりました

`v-with`で作られた子のインスタンスの値を変更しても親には反映されなくなります。親のインスタンスの変更は子に反映されます。

### `v-el`が追加されました

`v-ref`で似た感じですが、こちらは`vm.$$.xxx`とすることでDOM Nodeを参照することが出来ます。

### `twoWay`のオプションが追加されました

このオプションはdirectiveが2wayデータバインディングをするかどうかを指定します。
これを指定することで`this.set(value)`をdirectiveの内部で使用することが出来ます。

* ちょっとどういう使われ方するのかよくわかってないです...

### `acceptStatement`のオプションが追加されました

このオプションはdirectiveが`v-on`のようにインラインステートメントを受け付けるかどうかを指定します。

```html
<a v-on="click: a++"></a>
```

指定したステートメントは関数としてラップされてdirectiveの`update`関数に渡されます。

### `isEmpty`と`isFn`オプションが削除されました


## Interpolation change

### textのバインディング自動的にstringifyしなくなりました。

`json`filterを使いましょう。

### One time interpolationsが指定出来るようになりました

変更されない値に指定することでrenderingのパフォーマンスを向上させることが出来ます。

{% raw %}
```html
<span>{{* hello }}</span>
```
{% endraw %}


## Config API change

### Vue.configがメソッド形式からpropertyアクセスに変更されました

```js
// old
// Vue.config('debug', true)

// new
Vue.config.debug = true
```

### `config.prefix`の値にハイフンが必須になりました

```js
Vue.config.prefix = "data-"
```

### `config.delimiters`が少し柔軟に指定出来るようになりました

これまでは`['{','}']`というような指定しか出来なかったのが`['(%', '%)']`という指定も出来るようになりました。

```js
Vue.config.delimiters = ['(%', '%)']
// tags now are (% %) for text
// and ((% %)) for HTML
```

### 'proto'optionをfalseにすることでArrayの`__proto__`の書き換えを禁止することが出来ます

NativeのArrayのsubclassなどを作っている場合で、`__proto__`の書き換えされると困る場合にfalseにすることで`__proto__`の書き換えがされなくなります
(配列のオブジェクトに追加される)

{% img /images/vue-config-proto.png 'Vue.config.proto = false' %}

またrc2からオブジェクトの場合に`__proto__`の書き換えがされることはなくなりました。ただObject.prototypeに$addと$delete、Array.prototypeに$removeと$setが追加されています。

dataに生のオブジェクトを使っている場合には影響無いですが、Constructorから作ったオブジェクトを使っている場合にはprototypeが残るようになります。

```js
var Hoge = function () {
  this.name = "foo";
};
Hoge.prototype.foo = function() { console.log(this.name) };
```

{% img /images/vue-object-prototype.png 'Vue object prototype' %}

### async optionをtrueにすることで即時にDOMが更新することが出来ます

通常は、batch方式によってDOMの更新はまとめて行われるのですが、このオプションをtrueにすることで即時にDOMに反映することが出来るようになります。

## Transition API change

### `v-transition`と`v-animation`と`v-effect`の違いはなくなりました

どれかに統一されるのかな？

### `Vue.config`でenter/leaveの指定が設定出来なくなりました

### `Vue.effect`は`Vue.transition`に変更されました。`effects`オプションも`transitions`に変更されました。

### `v-transition="my-transition"`とした場合、

1. `Vue.transition(id, def)`で登録されているオブジェクトまたは、`transitions`オプションを"my-transition"をkeyとして探します。
1. 上記で見つからなかった場合、CSS transitionsまたはCSS animationsを適用します。
1. 上記でもアニメーションしなかった場合、DOM操作を即時に行われます。

### JavaScript transitionsのAPIがAngular.jsっぽく変更されました

```js
Vue.transition('fade', {
  beforeEnter: function (el) {
    // a synchronous function called right before the
    // element is inserted into the document.
    // you can do some pre-styling here to avoid FOC.
  },
  enter: function (el, done) {
    // element is already inserted into the DOM
    // call done when animation finishes.
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 1000, done)
    // optionally return a "cancel" function
    // to clean up if the animation is cancelled
    return function () {
      $(el).stop()
    }
  },
  leave: function (el, done) {
    // same as enter
    $(el)
      .animate({ opacity: 0 }, 1000, done)
    return function () {
      $(el).stop()
    }
  }
})
```


## Events API change

### `$dispatch`と`broadcast`で発行されるイベントのコールバックでfalseを返すと、伝播を止めることが出来るようになりました。

```js
var a = new Vue()
var b = new Vue({
  parent: a
})
var c = new Vue({
  parent: b
})

a.$on('test', function () {
  console.log('a')
})
b.$on('test', function () {
  console.log('b')
  return false
})
c.$on('test', function () {
  console.log('c')
})
c.$dispatch('test')
// -> 'c'
// -> 'b'
```


## Two Way filters

### filterに関数を渡すとreadのfilterとして扱われますが、`v-model`のような2wayバインディングのdirectiveと組み合わせることでwriteのfilterも定義出来るようになりました

```js
Vue.filter('format', {
  read: function (val) {
    return val + '!'
  },
  write: function (val, oldVal) {
    return val.match(/ok/) ? val : oldVal
  }
})
```


## Block logic control

### template要素を制御ブロックとして扱うことが出来るようになりました

```js
items: [
  {
    title: 'title-1',
    subtitle: 'subtitle-1',
    content: 'content-1'
  },
  {
    title: 'title-2',
    subtitle: 'subtitle-2',
    content: 'content-2'
  }
]
```

```html
<template v-repeat="item:items">
  <h2>{{item.title}}</h2>
  <p>{{item.subtitle}}</p>
  <p>{{item.content}}</p>
</template>
```

```html
<!--v-block-start-->
<h2>title-1</h2>
<p>subtitle-1</p>
<p>content-1</p>
<!--v-block-end-->
<!--v-block-start-->
<h2>title-2</h2>
<p>subtitle-2</p>
<p>content-2</p>
<!--v-block-end-->
```

`v-partial`にtemplateと一緒に使うことが出来ますし、下記のようにすることでpartialを動的に選択することが出来ます

```html
<template v-partial="{{partialId}}"></template>
```

## Misc

### `$destroy()`はdefaultだと`$el`はそのまま残すので、`$el`も削除したい場合は`$destroy(true)`としてください

### `v-model`と一緒に`value`属性を指定するとvmの値を上書きして初期値として設定されます


------------------------------

vue.js bookもv0.11対応して続きを書かないと....

