# dev-injector

Injection source code into required source in Node.js.

## install

```sh
$ npm i dev-injector -D
```

## How to use

```js
const {injection} = require('dev-injector')

const conf = {
    './hoge.js': {
        replace: {
            'const hoge =': '"const hoge replaced"',
            'function fuga': 'function fuga() {console.log("function fuga replaced")}',
            'class Piyo': 'class Piyo { constructor() {console.log("class Piyo replaced")}}'
        }
    }
}
injection(conf)

require('./hoge')
```

### hoge.js

```js
const hoge = 'hoge'

console.log(hoge)

function fuga() {
    console.log('fuga')
}

fuga()

class Piyo {
}

const piyo = new Piyo()
```

### not injected result

```
$ node hoge.js
hoge
fuga
```

### injected result

```
$ node index.js
const hoge replaced
function fuga replaced
class Piyo replaced
```
