"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const babel_core_1 = require("babel-core");
const _1 = require("./");
const f = src => {
    const { code } = babel_core_1.transform(src);
    return code;
};
ava_1.default('Variable.init replace', t => {
    const conf = {
        replace: {
            'const hoge =': '1000'
        }
    };
    const src = 'const hoge = 10';
    const injector = new _1.Injector(conf);
    const res = injector.transform(src);
    t.true(f(res) === f('const hoge = 1000'));
});
ava_1.default('Function replace', t => {
    const conf = {
        replace: {
            'function fuga': 'function piyo() {console.log(1000)}'
        }
    };
    const src = 'function fuga() {console.log(1)}';
    const injector = new _1.Injector(conf);
    const res = injector.transform(src);
    t.true(f(res) === f('function piyo() {console.log(1000)}'));
});
ava_1.default('Class replace', t => {
    const conf = {
        replace: {
            'class Hoge': 'class Hoge{ constructor() {console.log(1)} hoge() {return "hoge"}}'
        }
    };
    const src = 'class Hoge{ constructor() {}}';
    const injector = new _1.Injector(conf);
    const res = injector.transform(src);
    t.true(f(res) === f('class Hoge {constructor() {console.log(1)} hoge() {return "hoge"}}'));
});
//# sourceMappingURL=index.test.js.map