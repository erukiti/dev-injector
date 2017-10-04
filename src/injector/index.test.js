const test = require('ava')

const Injector = require('./')

test('Variable.init replace', t => {
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

test('Function replace', t => {
    const conf = {
        replace: {
            'function fuga': 'function piyo() {console.log(1000)}'
        }
    }

    const src = 'function fuga() {console.log(1)}'
    const injector = new Injector(conf)
    const res = injector.transform(src)
    t.true(res === `function piyo() {
  console.log(1000);
}`)
})

test('Class replace', t => {
    const conf = {
        replace: {
            'class Hoge': 'class Hoge{ constructor() {console.log(1)} hoge() {return "hoge"}}'
        }
    }
    const src = 'class Hoge{ constructor() {}}'
    const injector = new Injector(conf)
    const res = injector.transform(src)
    t.true(res === `class Hoge {
  constructor() {
    console.log(1);
  }

  hoge() {
    return "hoge";
  }

}`)
})
