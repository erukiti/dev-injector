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
            'class Piyo': `
            class Piyo {
                constructor() {
                    console.log('class Piyo replaced')
                }

                get() {
                    return 'piyo'
                }
            }
            `
        },
        insert: {
            last: 'module.exports.Piyo = Piyo'
        }
    }
}
injection(conf)

const {Piyo} = require('./hoge')

const piyo = new Piyo()
console.log('export succeeded:', piyo.get() === 'piyo')
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
    constructor() {
        console.log('piyo')
    }

    get() {
        return null
    }
}
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
export succeeded: true
```
