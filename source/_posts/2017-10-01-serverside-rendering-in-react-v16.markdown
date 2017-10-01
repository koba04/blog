---
layout: post
title: "React v16でのサーバーサイドレンダリング"
date: 2017-10-01 23:02:46 +0900
comments: true
categories: react.js
---

React v16について書いたブログの中の、サーバーサイドレンダリングについての部分に間違いがあったので修正しつつ、v16のサーバーサイドレンダリングについて補足します。

http://blog.koba04.com/post/2017/09/27/react-v16-changes/

**Hydrationしたい場合は、renderToStringまたはrenderToNodeStreamで行う必要があります。**

`data-reactroot`以外にも変数部分を識別するためのコメントノードなどが挿入されている必要があるためです。

それでは、v15とv16でのサーバーサイドレンダリングの違いを見てみます。

<!-- more -->

以下、長いのでサーバーサイドレンダリングはSSRとします。

## v15まで

ReactでSSRしたコンテンツをクライアントでも再利用したい場合、これまではSSRしたHTMLを元に生成されたchecksumとクライアントサイドで構築したReactElementから生成したchecksumが一致する必要がありました。

これはつまり、ReactDOMServer.renderToStringのエントリーポイントと、ReactDOM.renderのエントリーポイントが一致する必要があることを示します。

つまりHTML全体をReactで構築しようとするとこんな感じになります。

* App.js

```js
import React from 'react';
const App = (props) => {
    return <div>Hello {props.name}</div>;
};
export default App;
```

* Html.js

```js
import React from 'react';

const Html = (props) => {
    return (
        <html>
            <head>
                <title>App</title>
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={ {__html: props.markup} }></div>
                <script id="initial-data" type="text/plain" data-json={props.initialData}></script>
                <script src="/static/bundle.js"></script>
            </body>
        </html>
    );
};

export default Html;
```

* server.js

```js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';

import Html from './Html';
import App from './App';

const app = express();

const initialData = {
    name: 'World'
};

app.get('/', (req, res) => {
    res.send(
        ReactDOMServer.renderToStaticMarkup(
            <Html
                markup={ReactDOMServer.renderToString(<App {...initialData} />)}
                initialData={JSON.stringify(initialData)}
            />
        )
    );
});

app.listen(3000);
```

* browser.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));

ReactDOM.render(<App {...initialData} />, document.getElementById('app'));
```

上記のように`Html.js`ではdangerouslySetInnerHTMLを使い、アプリケーションのComponentをrenderToStringによりchecksumなどが付与されたHTML文字列として埋め込む必要があります。

また`server.js`では、HTML全体の部分はrenderToStaticMarkupで、アプリケーションの部分はrenderToStringでと、別々に生成する必要があります。

これにより、renderToStringとReactDOM.renderで構築される内容が一致するため、SSRによって生成されたDOMが再利用されます。

## v16

v16では、checksumによりチェックは行われず、可能な限りすでに構築されているDOMを再利用しようとします。
また、ReactDOM.hydrateという明示的なAPIを使うことで、サーバー側とクライアント側でエントリーポイントを合わせる必要はありません。
（ReactDOM.renderを使う場合は、`data-reactroot`の属性がDOMにあるかをチェックしているのでエントリーポイントを合わせる必要があります）

そのためv15のように、エントリーポイントを一致させるために、アプリケーションのComponentを別途HTML文字列として生成する必要はありません。

したがって、上記の例は、v16で追加されたrenderToNodeStreamを使うと

* App.js

```js
import React from 'react';
const App = (props) => {
    return <div>Hello {props.name}</div>;
};
export default App;
```

* Html.js

```js
import React from 'react';

const Html = (props) => {
    return (
        <html>
            <head>
                <title>App</title>
            </head>
            <body>
                <div id="app">{props.children}</div>
                <script id="initial-data" type="text/plain" data-json={props.initialData}></script>
                <script src="/static/bundle.js"></script>
            </body>
        </html>
    );
};

export default Html;
```

* server.js

```js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';

import Html from './Html';
import App from './App';

const app = express();

const initialData = {
    name: 'World'
};

app.get('/', (req, res) => {
    ReactDOMServer.renderToNodeStream(
        <Html initialData={JSON.stringify(initialData)}>
            <App {...initialData} />
        </Html>
    ).pipe(res);
});

app.listen(3000);
```

* browser.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));

ReactDOM.hydrate(<App {...initialData} />, document.getElementById('app'));
```

上記ではHtmlのComponent内で、アプリケーションのComponentを、ReactDOM.hydrateの対象となるDOMの子要素として渡しているだけです。
HTML文字列として渡したりする必要はありません。

また全体もrenderToNodeStreamでまとめて構築できるため、コードもシンプルになります。

というわけで、v16ではSSRのコードもよりシンプルに書けるように効率的になっています。