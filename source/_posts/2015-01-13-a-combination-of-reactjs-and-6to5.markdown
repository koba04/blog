---
layout: post
title: "A combination of React.js and 6to5"
date: 2015-01-13 18:50:28 +0900
comments: true
categories: react.js es6
---

今までは、react-toolsを使ってjsxのharmony optionを有効にして書くことで一部のES6のfeatureが使えて満足していたのですが、azuさんの記事を見て6to5を試したくなったのでReact.js + 6to5の組み合わせで書いてみました。

* https://6to5.org/
* http://efcl.info/2015/01/09/write-es6/


結論から言うと6to5自体がjsxのサポートもしているので何も意識することなく書けていい感じでした。

コードはこんな感じ。

https://github.com/koba04/react-boilerplate

<!-- more -->

## structure


### browserify + 6to5ify

変換の流れはbrowserifyのtransformである6to5ifyを使うので、

```
ES6  ->   CommonJS(ES5)      ->       bundle.js
    6to5                 browserify
```

な形になっています。

AltJSで書くときと同じ流れです。


## configuration

https://github.com/koba04/react-boilerplate/blob/master/package.json


### bundle.js

bundle.jsの作成はただ、6to5ifyをtransformとして指定するだけです。

```js
  "scripts": {
    "watch": "watchify app/index.js -o dist/bundle.js -v",
    "build": "browserify app/index.js > dist/bundle.js"
  },
  "browserify": {
    "transform": [
      [ "6to5ify" ]
    ]
  }
```


### start server

serverを立ち上げる時は、entry pointとなるserver.jsもES6で書きたいので、6to5に含まれている`6to5-node`コマンドを利用します。

```
  "scripts": {
    "start": "6to5-node server"
  },
```

これによってserver.jsもES6で書くことが出来るようになります。

```js
'use strict';

import express  from 'express';
import React    from 'react';
import App      from './app/components/App';

let app     = express();
let handler = (name) => {
  return (req, res) => {
    let html = React.renderToString(React.createElement(App, {
      path: "/" + name
    }));
    res.send(html);
  };
};

app.get('/',        handler(''));
app.get('/artist',  handler('artist'));
app.get('/country', handler('country'));

app.use(express.static(__dirname+'/dist'));

let port = process.env.PORT || 5000;
console.log("listening..." + port);
app.listen(port);
```


### test by Jest

Jestのテストについても`6to5-jest`というmoduleがあるのでそれをinstallして、scriptPreprocessorに指定するだけです。

```js
  "jest": {
    "scriptPreprocessor": "<rootDir>/node_modules/6to5-jest",
  }
```

こんな感じで書けます。

```js
'use strict';

jest.dontMock('../InputArtist');

import React                    from 'react/addons';
import InputArtist              from '../InputArtist';
import AppTracksActionCreators  from '../../actions/AppTracksActionCreators';

describe("inputArtist", () => {
  let inputArtist;
  beforeEach(() => {
    inputArtist = React.addons.TestUtils.renderIntoDocument(<InputArtist />);
  });

  describe("state",  () => {
    it("set inputArtist radiohead", () => {
      expect(inputArtist.state.inputArtist).toBe("radiohead");
    });
  });

  describe("handleSubmit", () => {
    let preventDefault;
    beforeEach(() => {
      preventDefault = jest.genMockFunction();
      inputArtist.setState({ inputArtist: 'travis' });
      React.addons.TestUtils.Simulate.submit(inputArtist.getDOMNode(), {
        preventDefault: preventDefault
      });
    });
    it ("calls AppTracksActionCreators.fetchByArtist with state.inputArtist", () => {
      expect(AppTracksActionCreators.fetchByArtist).toBeCalled();
      expect(AppTracksActionCreators.fetchByArtist).toBeCalledWith('travis');
    });
    it ("calls e.preventDefault", () => {
      expect(preventDefault).toBeCalled();
    });

  });

});
```


## code


### JSX

6to5ではjsxもサポートしているので、何も意識することなくjsxを書いておくことが出来ます。

https://6to5.org/docs/usage/jsx/


### ES6 modules

今までは、ES6を感じながらcommonJS styleで書くのもちょっとなぁという気持ちがありましたがこれによってES6 modulesのstyleで書くことが出来ていい感じです。

```js
'use strict';

import React        from 'react';
import Nav          from './Nav';
import Footer       from './Footer';
import InputArtist  from './InputArtist';
import Tracks       from './Tracks';
import TrackStore   from '../stores/TrackStore';

export default React.createClass({
  displayName: 'Artist',
  render() {
    let style = {
      title: {
        fontFamily: "'Poiret One', cursive"
      }
    };
    return (
      <div>
        <header className="page-header">
          <h1 style={style.title}>Artist Top Tracks <small>by Last.FM</small></h1>
        </header>
        <Nav current="artist" />
        <article className="main-content">
          <InputArtist />
          <Tracks />
        </article>
        <Footer />
      </div>
    );
  }
});
```

直接export defaultにComponentのClassを渡しているので、displayNameは明示的に指定しています。

------------

というわけでReact.jsのコードを6to5使ってES6で簡単に書くことが出来るという話でした。

個人的には今後書くコードはES6で書いていきたい感じです。

6to5シンプルに使えていいですね。
