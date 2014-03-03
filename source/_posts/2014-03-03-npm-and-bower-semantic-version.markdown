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

npmやbowerにはGemのGemfile.lockやCartonのcpanfile.snapshotのように依存も含めたバージョンを固定するような仕組みはないと思います。

かと言ってnode_modulesとかbower_componentsをrepositoryの中にも入れたくないので今のプロジェクトでは"x.y.z"とバージョンを固定しています。

この辺りはみんなどうしてるんですかね？


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

