"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_map_support_1 = require("source-map-support");
exports.injection = (conf) => {
    source_map_support_1.install({ hookRequire: true });
    console.log(Object.keys(require.extensions));
    // const olds = {}
    // const register = (ext, cb) => {
    //     olds[ext] = require.extensions[ext]
    //     require.extensions[ext] = (m, filename) => {
    //         const projectPath = path.resolve('./')
    //         if (filename.substr(0, projectPath.length) !== projectPath || filename.indexOf('node_modules') !== -1) {
    //             olds[ext](m, filename)
    //             return
    //         }
    //         const code = cb(filename)
    //         m._compile(code, filename)
    //     }
    // }
    // const stripNode = node => {
    //     switch (node.type) {
    //         case 'File': {
    //             return stripNode(node.program)
    //         }
    //         case 'Program': {
    //             return stripNode(node.body[0])
    //         }
    //         default: {
    //             return node
    //         }
    //     }
    // }
    // const createNode = (sourceCode) => {
    //     const ast = babylon.parse(sourceCode)
    //     return stripNode(ast)
    // }
    // const plugin = {
    //     name: 'injector',
    //     visitor,
    // }
    // const convertFromFile = filename => {
    //     const {code} = transformFileSync(filename, {plugins: [plugin]})
    //     return code
    // }
    // register('.js', filename => {
    //     return convertFromFile(filename)
    // }
};
//# sourceMappingURL=injection.js.map