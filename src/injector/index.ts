import {transform, transformFileSync} from 'babel-core'
import * as babylon from 'babylon'
import * as t from 'babel-types'
import assert from 'power-assert'

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
    return stripNode(ast.program)
}

export class Injector {
    plugin
    babelConf
    constructor(conf) {
        const replacers = Object.assign({}, conf.replace)
        // FIXME: key の正規化
        const inserters = Object.assign({}, conf.insert)

        const visitor = {
            Program: {
                exit: (nodePath) => {
                    if (inserters.last) {
                        const bodies = nodePath.get('body')
                        const replaceCode = inserters.last
                        bodies[bodies.length - 1].insertAfter(createNode(replaceCode))
                    }
                }
            },
            VariableDeclarator: (nodePath) => {
                const {kind} = nodePath.parent

                if (t.isIdentifier(nodePath.node.id)) {
                    const replaceCode = replacers[`${kind} ${nodePath.node.id.name} =`]
                    if (replaceCode) {
                        nodePath.get('init').replaceWith(babylon.parseExpression(replaceCode))
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

        this.babelConf = {
            plugins: [this.plugin]
        }
    }

    transform(src: string) {
        return transform(src, this.babelConf).code
    }

    transformFileSync(filename: string) {
        return transformFileSync(filename, this.babelConf).code
    }

    getPlugin() {
        return this.plugin
    }
}


