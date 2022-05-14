---
title: "TechFeed Conference 2022 で React の useEvent について話した"
date: 2022-05-14 01:00:00 +0900
---

TechFeed Conference 2022 という LT 会のイベントで React の提案中の Hooks である `useEvent` について話しました。

- イベント
    - https://techfeed.io/events/techfeed-conference-2022
- 発表資料
    - https://speakerdeck.com/koba04/how-useevent-would-change-our-applications

当初は React v18 で Suspense を Data Fetching に対して使うことについての現状について話す予定だったのですが、この `useEvent` という提案が出てきてこれは React の書き方や考え方を変えるポテンシャルがあるものなので急遽差し替えて紹介しました。

詳しくは資料を見つつ、RFC を見てもらえればと思います。

https://github.com/reactjs/rfcs/pull/220

まだ Draft ですが PR もあったりします。

https://github.com/facebook/react/pull/24505

トーク中でも触れた通り、個人的には依存の配列がすっきりするだけでなく、`useEffect` (`useLayoutEffect`) に指定する依存配列に対して副作用に対する依存のみを指定できるようになる点はわかりやすいメリットだなと感じています。

時間なくて省略した部分としては、`useEvent` はただの Hooks の一つというよりも Hooks や Component のような新しい概念になることが意図されているということです。

RFC の議論は 8 割くらいが名前についてのコメントで溢れているのですが、それに対する一つの回答として下記があります。

> A lot of the comments so far are about the naming. I want to clarify a few constraints.
>
> We expect the usage of this Hook to be very common. So it can't be two words. This is why like useStableCallback, useEventHandler, useLatestClosure are out. Also, one thing we've learned is that everybody wants a new concept to be longer and descriptive, and then a few months in everybody wants them to be short and concise. It's important for this one to feel "vanilla" and be something you'll enjoy seeing and typing in most files every day. So it also shouldn't feel obscure.
>
> We also don't think about this solely as an optimization. Conceptually, it is more of a "type of function". For example, there are "async functions" and "generator functions" in JavaScript. In React there's "hooks" and "components". We think of events as also a type of function with certain rules. So whatever the single word we pick, it would be good if "word_we_pick function" didn't sound awkward. "Event function" or "handler function" are ok. Something like "function function" (which we'd get from useFunction) doesn't work. This is also an argument against repurposing useCallback (although there are also other arguments against that which I'll mention later).
>
> Thinking of this as a "type" of function may not be very important now. But like mentioned in the RFC, part of the future vision for this is better static enforcement for React rules. E.g. like #220 (comment) implies, the rules about where you can assign or read refs are not enforced now which can be frustrating. As mentioned in the RFC, we think we can leverage this concept to provide opt-in compile-time checks (for example, to flag accidental DOM manipulation during render) in the future. So we need a name not only for this Hook, but for the kind of functions in which it's allowed to do these things. No name is going to be perfect but I hope this better clarifies what we're looking for in the chosen term.

https://github.com/reactjs/rfcs/pull/220#issuecomment-1118034666

この中で `useEvent` は JavaScript でいう Async Functions や Generator Functions のような Type of Functions であるとコメントされています。
つまり今後の React において Event Functions という概念を導入していきたいということです。

この Event Functions は ESLint のチェックでも他の関数とは異なるものとして処理されたり、型レベルでも他の関数とは異なるものとして扱うことができるようにすることも検討されています（これは別の RFC として提案予定）。

余談としてちょっと面白いなと思ったところは、この Hooks の名前は `useStableCallback` のように 2 つの単語の組み合わせにすることはできないという説明があって、上記のような説明的な名前を求める人は多いけど、結局数ヶ月になると短く簡潔な名前を好むようになるという解説があります。また、この Hooks は頻繁に使うことになるので親しみやすく typing するのが楽しく感じることも考慮されています。

これは完全な邪推ですが、Meta の OSS は短い一般的な名前が多い（React, Flow, Hack etc）のもこの辺りの考えに基づいているのかなと感じました。

今回のイベントは LT であり、オンラインだったのでトークをもとにした議論ができませんでしたが、またカンファレンスに参加して色々な技術話をできるようになるといいなと感じました。`useEvent` の話や今回話さなかった Suspense for Data Fetching の話も色々面白いポイントがあるのでまたどこかで話せたらいいなと思います。

運営の皆様、ありがとうございました！

