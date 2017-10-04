const test = require('ava')

const Injector = require('./')

test('', t => {
    const conf = {
        replace: {
            'const hoge =': '1000'
        }
    }

    const src = 'const hoge = 10'
    const injector = new Injector(conf)
    const res = injector.transform(src)
    t.true(res === 'const hoge = 1000;')
})
