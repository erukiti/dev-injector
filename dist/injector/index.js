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
    return stripNode(ast.program);
};
class Injector {
    constructor(conf) {
        const replacers = Object.assign({}, conf.replace);
        // FIXME: key の正規化
        const visitor = {
            VariableDeclarator: (nodePath) => {
                const { kind } = nodePath.parent;
                if (t.isIdentifier(nodePath.node.id)) {
                    const replaceCode = replacers[`${kind} ${nodePath.node.id.name} =`];
                    if (replaceCode) {
                        nodePath.get('init').replaceWith(babylon.parseExpression(replaceCode));
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
        this.babelConf = {
            plugins: [this.plugin]
        };
    }
    transform(src) {
        return babel_core_1.transform(src, this.babelConf).code;
    }
    transformFileSync(filename) {
        return babel_core_1.transformFileSync(filename, this.babelConf).code;
    }
    getPlugin() {
        return this.plugin;
    }
}
exports.Injector = Injector;
//# sourceMappingURL=index.js.map