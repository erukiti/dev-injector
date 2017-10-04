import {transformFileSync} from 'babel-core'
import {install} from 'source-map-support'
import * as babylon from 'babylon'
import * as path from 'path'

import {Injector} from './injector'

export const injection = (conf) => {
    install({hookRequire: true})

    const injectors = {}
    Object.keys(conf).forEach(key => {
        const injector = new Injector(conf[key])
        injectors[key] = (filename: string) => injector.transformFileSync(filename)
    })

    const olds = {}
    const register = (ext: string) => {
        olds[ext] = require.extensions[ext]
        require.extensions[ext] = (m: any, filename) => {
            let isInjected = false
            Object.keys(injectors).forEach(key => {
                if (key.substr(0, 1) === '.') {
                    const targetPath = path.resolve(path.dirname(m.parent.filename), key)
                    if (targetPath === m.filename) {
                        isInjected = true
                        const code = injectors[key](m.filename)
                        m._compile(code, filename)
                    }
                }
            })

            if (!isInjected) {
                olds[ext](m, filename)
            }
        }
    }

    register('.js')
}

