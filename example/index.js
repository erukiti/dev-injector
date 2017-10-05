const {injection} = require('../dist')

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

