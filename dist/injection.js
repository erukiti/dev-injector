"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_map_support_1 = require("source-map-support");
const path = require("path");
const injector_1 = require("./injector");
exports.injection = (conf) => {
    source_map_support_1.install({ hookRequire: true });
    const injectors = {};
    Object.keys(conf).forEach(key => {
        const injector = new injector_1.Injector(conf[key]);
        injectors[key] = (filename) => injector.transformFileSync(filename);
    });
    const olds = {};
    const register = (ext) => {
        olds[ext] = require.extensions[ext];
        require.extensions[ext] = (m, filename) => {
            let isInjected = false;
            Object.keys(injectors).forEach(key => {
                if (key.substr(0, 1) === '.') {
                    const targetPath = path.resolve(path.dirname(m.parent.filename), key);
                    if (targetPath === m.filename) {
                        isInjected = true;
                        const code = injectors[key](m.filename);
                        m._compile(code, filename);
                    }
                }
            });
            if (!isInjected) {
                olds[ext](m, filename);
            }
        };
    };
    register('.js');
};
//# sourceMappingURL=injection.js.map