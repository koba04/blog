---
layout: post
title: "ブログ移行しました"
date: 2014-03-02 03:07:09 +0900
comments: true
categories: blog octopress
---

これまでははてなダイアリーでブログを書いていたのですが、ふと思い立ってブログを移行しました。

旧ブログ: http://d.hatena.ne.jp/koba04/

<!-- more -->

ページのフッターにある通り、Octopressを使ってGithubPagesで公開しています。テーマは一覧から「Octoflat」を選んでいます。

* http://octopress.org/
* https://github.com/imathis/octopress/wiki/3rd-Party-Octopress-Themes

ドメインはblog.koba04.comにkoba04.github.ioをCNAMEとして割り当てています(設定するときに間違ってAレコード消しちゃってしばらくアクセス出来なくしてしまいましたが...)

## なぜ移行したのかとなぜOctopress？

はてなダイアリーだったのではてなブログとかにそろそろ移行しないとなぁと思っていたのが主な理由です。はてなブログでもよかったのですがせっかくなので色々自分で設定したいなと思い既存のブログサービスは選択しませんでした。

Octopressにした理由はGithubと親和性が高いのとRuby触るきっかけになるかなと思ったくらいです。[Ghost](https://ghost.org/)と少し悩みましたがインフラをGithubに任せられるのがいいなと思ってOctopressにしました。

Github上で管理出来るのでissueをTODOとして使えるので便利ですね。ブラウザでmarkdown編集してcommit hookでdeploy出来るようにするとさらに便利そうだなぁと思ったりしてます。

## やったこと

基本的にはSocial系のアカウント設定したりちょっとスタイル修正したりした程度ですが、わからないことが多くて結構詰まってました...でも楽しいです。

特にOctopressの仕組みがわかってなくて、sourceブランチとmasterブランチの関係とか、sourceの\_deployにmasterが入っていて、そこからmasterのブランチをpushしてるのとか。。

* Twitter, Facebook, HatenaBookmarkのリンクを設置
* Google Analyticsの設定
* Disqusの設定
* styleの修正
* headerにブログ名をリンクを移動


見にくい部分とか色々あるのでこれから徐々に直していきたいと思います！
