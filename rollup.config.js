import path from 'path'
import babel from 'rollup-plugin-babel'
import clear from 'rollup-plugin-clear'
import commonjs from 'rollup-plugin-commonjs'
import license from 'rollup-plugin-license'
import resolve from 'rollup-plugin-node-resolve'

import pkg from './package.json'

module.exports = [
  // browser-friendly UMD build
  {
    input: './index.js',
    output: {
      name: 'HeatMap',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      clear({
        targets: ['dist']
      }),
      resolve(),
      commonjs(),
      babel({
        exclude: ['node_modules/**']
      }),
      license({
        banner: { file: path.join(__dirname, 'LICENSE') }
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: './index.js',
    // external: ['ms'],
    output: [
      { file: pkg.main, format: 'cjs' }
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: ['node_modules/**']
      }),
      license({
        banner: { file: path.join(__dirname, 'LICENSE') }
      })
    ]
  }
]
