const {injection} = require('../dist')

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


