---
layout: post
title: "npmやbowerライブラリのバージョン管理"
date: 2014-03-03 23:11:37 +0900
comments: true
categories: node javascript
---

## npmとbowerライブラリのバージョン管理

npmやbowerのライブラリをプロジェクトに導入するときは、"npm install --save xxx"や"bower install --save xxx"のような形で指定してインストールとpackage(bower).jsonへの記録をしたりします。

その場合、package(bower).jsonには"xxx": "~x.y.z"という形式で記録されます。

"~x.y.z"という表記は、"~1.2.3"だとすると1.2.3 <= x.x.x < 1.3.0 の間での最新バージョンがインストールされます。

<!-- more -->

* https://www.npmjs.org/doc/misc/semver.html


なので"~"で指定していると、同じpackage(bower).jsonでもインストールするタイミングによって微妙に異なるバージョンがインストールされることになります。

~~npmやbowerにはGemのGemfile.lockやCartonのcpanfile.snapshotのように依存も含めたバージョンを固定するような仕組みはないと思います。~~

~~かと言ってnode_modulesとかbower_componentsをrepositoryの中にも入れたくないので今のプロジェクトでは"x.y.z"とバージョンを固定しています。~~

~~この辺りはみんなどうしてるんですかね？~~

**[追記:2013-03-04] yosuke_furukawaさんに教えていただきました!ありがとうございます！**

>
npm shrinkwrapってコマンドがあって、それを使うとライブラリのバージョンを固定できる。bower shrinkwrapは実装待ち https://github.com/bower/bower/issues/505


というわけでnpmはnpm-shrinkwrapを使って管理することにしました yosuke\_furukawa++


## npm-shrinkwrap

https://www.npmjs.org/doc/cli/npm-shrinkwrap.html

node\_modulesにライブラリがインストールされている状態でnpm shrinkwrapするとnpm-shrinkwrap.jsonという依存しているライブラリのバージョンが記載されたファイルがつくられます。

devDependenciesも含めたい場合は、--devオプションを付ける必要があります
```
% npm shrinkwrap --save
wrote npm-shrinkwrap.json

% cat npm-shrinkwrap.json
{
  "name": "myapp",
  "version": "0.0.1",
  "dependencies": {
    "grunt-contrib-concat": {
      "version": "0.3.0",
      "from": "grunt-contrib-concat@"
    },
    "grunt-remove-logging": {
      "version": "0.1.1",
      "from": "grunt-remove-logging@",
      "resolved": "https://registry.npmjs.org/grunt-remove-logging/-/grunt-remove-logging-0.1.1.tgz"
    },
    "grunt-contrib-coffee": {
      "version": "0.7.0",
      "from": "grunt-contrib-coffee@",
      "dependencies": {
        "coffee-script": {
          "version": "1.6.3",
          "from": "coffee-script@~1.6.2"
        }
      }
    },
    "grunt-contrib-compass": {
      "version": "0.6.0",
      "from": "grunt-contrib-compass@",
      "resolved": "https://registry.npmjs.org/grunt-contrib-compass/-/grunt-contrib-compass-0.6.0.tgz",
      "dependencies": {
        "tmp": {
          "version": "0.0.21",
          "from": "tmp@0.0.21"
        },
        "dargs": {
          "version": "0.1.0",
          "from": "dargs@~0.1.0"
        },
        "async": {
          "version": "0.2.9",
          "from": "async@~0.2.0"
        }
      }
    },
:
```

npm-shrinkwrap.jsonがある状態でnpm installするとnpm-shrinkwrap.json記載されてるバージョンでインストールされます。
```
% npm install
```

package.jsonで"x.y.z"指定でバージョン固定した場合でもそのライブラリが依存しているライブラリは"~x.y.z"で指定されているためバージョンがズレることがあったのですが、npm-shrinkwrapを使うと依存しているライブラリのバージョンも固定出来て素晴らしい！


## Semantic Versioning

上の辺りを調べているときにSemantic Versioningというサイトがあるのをしりました。

* http://semver.org/

これによるとバージョンニングをMAJOR.MINOR.PATCHと定義していて、

* MAJORは互換性のない変更
* MINORは後方互換性のある追加機能
* PATCHは後方互換性のあるBugFix

とされています。(1.0.0未満は開発版なので上の限りではない)

さきほどのnpmやbowerの--saveが"~x.y.z"となっているのも上のバージョニングだと考えると納得がいきます。

ただ、実際その通りになっているライブラリばかりではなく、PATCHバージョンあげたら動かなくなることもありますし、そもそも1.0.0未満だと対象外なので"~x.y.z"の指定で大丈夫というわけにはいきません。

BackboneにもSemantic Versioninigに従うべきというissueがあったりしますが、実際はなかなかむずかしそうです。(jashkenasもその通りにしていたらBackbone 43.0.0になってるとコメントしたりしています)

https://github.com/jashkenas/backbone/issues/2888

普段使っているようなライブラリも依存関係を"~x.y.z"という形式で指定されていることが多いのですが、それによって依存ライブラリのPATCHレベルでの変更で壊れることもあったりして、なかなか難しい...

(結論なし..)

