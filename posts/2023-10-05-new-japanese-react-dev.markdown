---
title: "ja.react.dev の紹介"
date: 2023-10-05 00:00:00 +0900
---

2023 年の 5 月に [Introducing react.dev](https://react.dev/blog/2023/03/16/introducing-react-dev) というブログにて新しい React のサイトが公開されました。

そこから翻訳の準備が整った後に、有志の方達による翻訳が進んできて主要な部分の翻訳が終わってきたので紹介したいと思います。

![ja.react.dev のトップ](/images/posts/new-japanese-react-dev/ja-react-top.png)

オリジナルのサイトからリンクされていないけど URL は https://ja.react.dev/ です。

↑のブログの記事は [react.dev のご紹介](https://ja.react.dev/blog/2023/03/16/introducing-react-dev) です。

私自身はレビューをやっているだけなのでたいした貢献はしてなくて、[@smikitky](https://github.com/smikitky) さんをはじめとするコントリビュータの方のおかげです。

[New Translation Progress Checklist #452 ](https://github.com/reactjs/ja.react.dev/issues/452)

まだ英語のままのドキュメントもありますがすでにレビュー待ちのものもあるので順次翻訳が公開されていく予定です。

全体的に実際に動かして試せるサンドボックスが特徴的です。どういうコンセプトで書かれているのかについては前述した紹介ブログに書かれていますが軽く紹介を。

## Reference セクション

Reference セクションにも各種組み込みの Hooks に対するドキュメントが用意されています。普段から毎日 React 使っていて知っているという人も、`<Suspense />` や `useTransition`、`useDeferredValue` など比較的最近追加された API のドキュメントを読んでみるとそんな使い方もあったのかという学びもあると思います。

- [useTransition](https://ja.react.dev/reference/react/useTransition)
- [useDeferredValue](https://ja.react.dev/reference/react/useDeferredValue)
- [Suspense](https://ja.react.dev/reference/react/Suspense)

## Learn セクション

新しいドキュメントはただの API Reference ではなく、[Learn セクション](https://ja.react.dev/learn) においては考え方について詳しく解説されているので、基本的な使い方を知っている人も読んでみると発見があると思います。
Effect 系のドキュメントは話題になりましたが、それ以外のドキュメントも面白いものが多いです。

各ページはこのようになっています。

- [UI の記述](https://ja.react.dev/learn/describing-the-ui)
  - 初めてのコンポーネントの書き方
  - コンポーネントファイルを複数に分ける理由とその方法
  - JSX を使って JavaScript にマークアップを追加する方法
  - JSX 内で波括弧を使って JavaScript の機能にアクセスする方法
  - コンポーネントを props を使ってカスタマイズする方法
  - コンポーネントを条件付きでレンダーする方法
  - 複数のコンポーネントを同時にレンダーする方法
  - コンポーネントを純粋に保つことで混乱を避ける方法
- [インタラクティビティの追加](https://ja.react.dev/learn/adding-interactivity)
  - ユーザが発生させるイベントの扱い方
  - state でコンポーネントに情報を 「記憶」させる方法
  - React が 2 段階で UI を更新する仕組み
  - 変更後すぐに state が更新されない理由
  - 複数の state の更新をキューに入れる方法
  - state 内のオブジェクトを更新する方法
  - state 内の配列を更新する方法
- [state の管理](https://ja.react.dev/learn/managing-state)
  - UI の変化を state の変化として捉える方法
  - state を適切に構造化する方法
  - コンポーネント間で state を共有するために状態を “リフトアップ” する方法
  - state が保持されるかリセットされるかを制御する方法
  - 複雑な state ロジックを関数にまとめる方法
  - “props の穴掘り作業” なしで情報を渡す方法
  - アプリの成長に合わせて state 管理をスケーリングする方法
- [避難ハッチ](https://ja.react.dev/learn/escape-hatches)
  - 再レンダーせずに情報を「記憶」する方法
  - React が管理している DOM 要素にアクセスする方法
  - コンポーネントを外部システムと同期させる方法
  - 不要なエフェクトをコンポーネントから削除する方法
  - エフェクトのライフサイクルとコンポーネントのライフサイクルの違い
  - 値がエフェクトを再トリガするのを防ぐ方法
  - エフェクトの再実行頻度を下げる方法
  - コンポーネント間でロジックを共有する方法


## 余談

これまでは `noindex` によるブロックされていたために、Google などで検索してもヒットせずにそもそも存在に気づいていない人も多いと思いますが、下記の PR にて削除されたため今後は検索から流入していく人も増えていくといいなと思います。

[Remove "robots=noindex" meta tag to allow translated pages in search results #6260](https://github.com/reactjs/react.dev/pull/6260)

というわけで、あまり [ja.react.dev](https://ja.react.dev/) の存在に気づいてない人が多そうだったので改めて紹介してみました。
