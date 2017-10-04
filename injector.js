const {transform} = require('babel-core')
const babylon = require('babylon')
const t = require('babel-types')

const src = `
let hoge = 2
function hoge() {
    console.log(1)
}
class Hoge{
    constructor() {
        console.log(1)
    }
}


`

// const createNode = sourceCode => babylon.parseExpression(sourceCode)

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

const targetId = 'Hoge'
const replaceCode = 'class Hoge {}'

const visitor = {
    VariableDeclarator: (nodePath) => {
        if (t.isIdentifier(nodePath.node.id)) {
            if (nodePath.node.id.name === targetId) {
                nodePath.get('init').replaceWith(createNode(replaceCode))
            }
        }
    },
    FunctionDeclaration: (nodePath) => {
        if (t.isIdentifier(nodePath.node.id)) {
            if (nodePath.node.id.name === targetId) {
                nodePath.get('body').replaceWith(createNode(replaceCode))
            }
        }
    },
    ClassDeclaration: (nodePath) => {
        if (t.isIdentifier(nodePath.node.id)) {
            if (nodePath.node.id.name === targetId) {
                nodePath.insertBefore(createNode(replaceCode))
                nodePath.remove()
            }
        }
    },
}

const plugin = {
    name: 'debug',
    visitor,
}

const {code} = transform(src, {plugins: [plugin]})

console.log(code)
