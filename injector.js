const {transform} = require('babel-core')
const babylon = require('babylon')
const t = require('babel-types')

const src = `
const fuga = 1
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

const visitor = {
    VariableDeclarator: (nodePath) => {
        nodePath.get('init').replaceWith(createNode('1 + 1'))
    }
}

const plugin = {
    name: 'debug',
    visitor,
}

const {code} = transform(src, {plugins: [plugin]})

console.log(code)
