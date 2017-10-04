const {transform} = require('babel-core')
const babylon = require('babylon')
const t = require('babel-types')
const assert = require('power-assert')

const stripNode = node => {
    switch (node.type) {
        case 'File': {
            return stripNode(node.program)
        }
        case 'Program': {
            return stripNode(node.body[0])
        }
        default: {
            return node
        }
    }
}

const createNode = (sourceCode) => {
    const ast = babylon.parse(sourceCode)

    return stripNode(ast)
}

const injectionToFunction = (path, name, code) => {
    const n = path.node
    const info = `enter ${name}:${n.loc.start.line}:${n.loc.start.column}`

    const node = createNode(`console.log('${info}')`)

    const body = path.get('body')
    if (t.isBlock(body)) {
        body.unshiftContainer('body', node)
    } else if (t.isStatement(body)) {
        // body.replaceWith(t.blockStatement([node, body]))
        body.replaceWithSourceString()
    } else if (t.isExpression(body)) {
        body.replaceWith(t.blockStatement([node, t.returnStatement(body.node)]))
    } else {
        throw new Error('unkown pattern')
    }
}

// const conf = {
//     replace: {
//         'let hoge': 'const hoge = 2',
//         'function fuga': 'function fuga(arg) {console.log(arg)}',
//         'class Hoge': `
//         class Hoge {
//             constructor() {
//                 console.log(1000)
//             }

//             hoge() {
//                 return 'hoge'
//             }
//         }
//         `
//     }
// }

class Injector {
    constructor(conf) {
        const {targetId, replaceCode} = {}

        const replacers = Object.assign({}, conf.replace)
        // FIXME: key の正規化

        const visitor = {
            Program: (nodePath) => {
                // console.log(nodePath.get('body'))
            },
            VariableDeclarator: (nodePath) => {
                const {kind} = nodePath.parent

                if (t.isIdentifier(nodePath.node.id)) {
                    const replaceCode = replacers[`${kind} ${nodePath.node.id.name} =`]
                    if (replaceCode) {
                        nodePath.get('init').replaceWith(createNode(replaceCode))
                    }
                }
            },
            FunctionDeclaration: (nodePath) => {
                if (t.isIdentifier(nodePath.node.id)) {
                    const replaceCode = replacers[`function ${nodePath.node.id.name}`]
                    if (replaceCode) {
                        nodePath.insertBefore(createNode(replaceCode))
                        nodePath.remove()
                    }
                }
            },
            ClassDeclaration: (nodePath) => {
                const replaceCode = replacers[`class ${nodePath.node.id.name}`]
                if (replaceCode) {
                    nodePath.insertBefore(createNode(replaceCode))
                    nodePath.remove()
                }
            },
        }

        this.plugin = {
            name: 'injector',
            visitor,
        }
    }

    transform(src) {
        const {code} = transform(src, {plugins: [this.plugin]})
        return code
    }

    getPlugin() {
        return this.plugin
    }
}

module.exports = Injector
