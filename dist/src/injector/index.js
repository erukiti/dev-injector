"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babel_core_1 = require("babel-core");
const babylon = require("babylon");
const t = require("babel-types");
const stripNode = node => {
    switch (node.type) {
        case 'File': {
            return stripNode(node.program);
        }
        case 'Program': {
            return stripNode(node.body[0]);
        }
        default: {
            return node;
        }
    }
};
const createNode = (sourceCode) => {
    const ast = babylon.parse(sourceCode);
    return stripNode(ast);
};
class Injector {
    constructor(conf) {
        const replacers = Object.assign({}, conf.replace);
        // FIXME: key の正規化
        const visitor = {
            Program: (nodePath) => {
                // console.log(nodePath.get('body'))
            },
            VariableDeclarator: (nodePath) => {
                const { kind } = nodePath.parent;
                if (t.isIdentifier(nodePath.node.id)) {
                    const replaceCode = replacers[`${kind} ${nodePath.node.id.name} =`];
                    if (replaceCode) {
                        nodePath.get('init').replaceWith(createNode(replaceCode));
                    }
                }
            },
            FunctionDeclaration: (nodePath) => {
                if (t.isIdentifier(nodePath.node.id)) {
                    const replaceCode = replacers[`function ${nodePath.node.id.name}`];
                    if (replaceCode) {
                        nodePath.insertBefore(createNode(replaceCode));
                        nodePath.remove();
                    }
                }
            },
            ClassDeclaration: (nodePath) => {
                const replaceCode = replacers[`class ${nodePath.node.id.name}`];
                if (replaceCode) {
                    nodePath.insertBefore(createNode(replaceCode));
                    nodePath.remove();
                }
            },
        };
        this.plugin = {
            name: 'injector',
            visitor,
        };
    }
    transform(src) {
        const { code } = babel_core_1.transform(src, { plugins: [this.plugin] });
        return code;
    }
    getPlugin() {
        return this.plugin;
    }
}
exports.Injector = Injector;
//# sourceMappingURL=index.js.map