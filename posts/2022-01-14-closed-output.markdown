---
title: "クローズドアウトプット"
date: 2022-01-14 00:00:00 +0900
---

振り返ってみると最近ブログなどでアウトプットしてないので、変えていこうかなと思いどうしようか考えてました。
そもそもブログなどのアウトプットしなくなった原因はいくつかあるのですが、一番の原因はハードルを上げていたことかなと思います。

アウトプットが習慣になっているとインプットの質も変わってくるのでアウトプットはしていきたい。でも上がったハードルを下げるのも難しい。なので一旦ハードルを下げるアウトプットの場を作ることにしました。具体的には GitHub の Private Repository に色んなことをアウトプットする場を作ってそこに書いていくことにしました。
アウトプットのハードルについては別途記事を書きたいなと思っています。

ただ、誰も見ない個人のアウトプットする場は Dropbox Paper などすでにあり、それだけだといずれやらなくなるのは目に見えていたのでクローズドな形で共有することにしました。具体的にはそれ用の GitHub Sponsors の Tier を作成しそれに参加してくれた人に対してアクセス権を与える形にしています。
それによって、一人でも参加してくれた場合には書かねばという強制力になることを期待しています。

GitHub Sponsors の Ideas の例の中にある下記に近いイメージです。

> 📓 Community and education

> You'll receive my weekly newsletter updates $10 a month

内容としてはブログなどでまとめる前の段階のかなりラフなメモだったり、OSS work に関するメモなので全然整っているものではないです。

例としては下記のような感じです。

```
# react-transition-group

https://github.com/reactjs/react-transition-group

## 2022/01/08

https://github.com/reactjs/react-transition-group/pull/777

この Issue について見てた。
これ、報告者は `utils/PropTypes.js` にある `process.env.NODE_ENV` によるエラーだと言っているけど、
よく見ると `babel-plugin-transform-react-remove-prop-types` が自動で差し込んでるものが原因なので、
この対応方法では解決しない。

そもそもブラウザでそのまま動かない状態なのが微妙なのはわかるけど、
JSPM で使ってる人みたいに直接ブラウザで使うアプローチしてなければ特に問題ないのでどうするか悩ましい。

やるなら `PropTypes` をやめてメジャーリリースの方向でいきたい。
ただ、サイトの API ドキュメントが Gatsby で
PropTypes につけられている JSDoc に依存してるのでこれをどうにかする必要がある...。

こういう本質ではない部分で頑張らないといけないのはツライ...。

返信した。

https://github.com/reactjs/react-transition-group/pull/777#issuecomment-1007996342

あと、PropTypes 削除と IE サポート終了を入れたいけど、
CI で自動リリースされちゃうと個別のメジャーバージョンになっちゃうからそれもやめたいってコメントした。

https://github.com/reactjs/react-transition-group/pull/772#discussion_r780670954
```

あとは、読んだ本や聴いた Podcast、観た動画についてもメモしてます。

今年は、ここでのアウトプットのドラフトを持ってパブリックなアウトプットを増やしていこうと思います。日本語も英語も。
