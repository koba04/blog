---
layout: post
title: "Reusable components by Vue.js and Browserify"
date: 2014-04-17 01:27:24 +0900
comments: true
categories: vue.js browserify
---

最近Vue.jsについて調べたり試したりしていて、browserifyと組み合わせたexampleがなかなか興味深かったので参考に自分でも作ってみました。

参考

* https://github.com/vuejs/vue-browserify-example


作ったサンプル

* https://github.com/koba04/vue-boilerplate
* http://koba04.com/vue-boilerplate/

<!-- more -->

## browserify

Vue.js自体はビルドに[Compoment](https://github.com/component/component)を使っているのですが、ここでは個人的な好みによりbrowserifyを使っています。

上記のexampleではbrowserifyにプラスしてwatchifyとpartialifyを使っていたのですが、今回はlivereloadもしたかったのでwatchifyではなくて[beefy](https://github.com/chrisdickinson/beefy)にして、さらにcoffeeifyとstylifyも使ってcoffeescriptとstylusのcompileも任せることにしました。

その結果の起動scriptはこんな感じで、**npm run dev**するとlivereload + auto buildな環境が立ち上がり、**npm run build**するとbundle.jsが生成されるようになっています。

* https://github.com/koba04/vue-boilerplate/blob/master/package.json
```javascript
  "scripts": {
    "dev": "beefy src/index.coffee:bundle.js --live -- -t partialify -t coffeeify -t stylify --extension=coffee",
    "build": "browserify src/index.coffee -t partialify -t coffeeify -t stylify --extension=coffee > bundle.js"
  }
```

ちなみに[partialify](https://github.com/bclinkinbeard/partialify)はhtmlをrequireで読み込むのに使っています。

これで、gruntを使うことなくbrowserifyだけでlivereload + auto buildが出来るようになりました。便利！


## Reusable components

Vue.jsを使っていると、ViewModelをCompomentとして組み合わせてアプリケーションを作る感じになっていくので、Component単位でhtml、js、cssをまとめたくなります(ならない？)。

Vue.jsにはcompomentという概念があるのでこんな感じでViewModelをcompomentとして登録することが出来ます。

```coffeescript
# グローバルにcompomentを登録
Vue.component 'artist',   require './artist/index.coffee'

# or

# ViewModelに紐づけて登録
module.exports = Vue.extend
  components:
    "nav":          require '../nav/index.coffee'
```

exampleでもそのようになっていて、partialifyでhtmlとcssをrequireして読み込んでcssの方はinsert-cssで追加する感じになっています。

* insert-cssというのはsubstackが作っているライブラリで、CSSを渡すとDOMにstyle要素を作ってhead要素にappendしてくれるというライブラリです。
  * https://www.npmjs.org/package/insert-css

ただCSSはグローバルに作用してしまいます。なので名前ベースで解決したくなりますがCSSではネストした記述をサポートしていません。そこでstylusを使ってネストで書きやすくしてみました。

* https://github.com/koba04/vue-boilerplate/blob/master/src/top/index.coffee
```coffeescript
require('insert-css')(require('./index.styl'))

Vue = require 'vue'
module.exports = Vue.extend
  template: require './index.html'
  className: 'top'
  components:
    "nav":          require '../nav/index.coffee'
```

* https://github.com/koba04/vue-boilerplate/blob/master/src/top/index.styl
```sass
.top
  h1
    font-family: 'Playfair Display SC', serif
```

こんな感じにすると、Compoment単位でディレクトリ作ってindex.coffeeの中でinsert-cssを使ってcssを追加しつつpartialifyでhtmlをtemplateとして設定することで、javascriptとhtmlとcssをまとめることが出来ます。

* ファイル名の付け方は悩ましいですが・・・。


* https://github.com/koba04/vue-boilerplate
```sh
src
├── artist
│   ├── components
│   │   └── input-artist
│   │       ├── index.coffee
│   │       ├── index.html
│   │       └── index.styl
│   ├── index.coffee
│   ├── index.html
│   └── index.styl
├── country
│   ├── components
│   │   └── select-country
│   │       ├── index.coffee
│   │       ├── index.html
│   │       └── index.styl
│   ├── index.coffee
│   ├── index.html
│   └── index.styl
├── index.coffee
├── index.html
├── index.styl
├── nav
│   ├── index.coffee
│   ├── index.html
│   └── index.styl
├── partials
│   └── footer.html
├── top
│   ├── index.coffee
│   ├── index.html
│   └── index.styl
└── tracks
    ├── index.coffee
    ├── index.html
    └── index.styl
```

まぁ実際はcompoment化してもなかなか再利用は難しいのですが、こういう分け方もありかなーと思いました。


## routing animation by v-view and css animation

余談ですが、今回作ったサンプルの遷移時のウザイアニメーションは、v-viewとv-animationを組み合わせています。

* http://koba04.com/vue-boilerplate/

routingは[director](https://www.npmjs.org/package/director)とv-viewとVue.compomentを組み合わせています。

* angular.jsのng-animateみたいな感じでv-enterとv-leaveというクラスがあてられるのでそれを使ってアニメーションさせています。

v-viewとv-animationの組み合わせについては、v-leaveのanimation-endで要素が削除されるためアニメーションが指定されていないと古い要素が残ったりと若干ハマりどころもあるのですが、それはまた別の機会にまとめたいと思います。

* https://github.com/koba04/vue-boilerplate/blob/master/src/index.html
```html
<div v-view="view" v-animation></div>
```

* https://github.com/koba04/vue-boilerplate/blob/master/src/index.styl
```sass
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
```

## more?

本当はここにtestling + mocha + power-assertな組み合わせのテストも含めたかったのですが間に合わず・・。

Vue.js自体についても下記のメモをスライドにでもまとめようかなと思っています..そのうち..

* https://gist.github.com/koba04/9776792



