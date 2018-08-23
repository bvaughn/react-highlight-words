const baseDistConfig = require('./webpack.config.dist.base')
const _ = require('lodash')

const cjsDistConfig = {
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  }
}

module.exports = _.merge(baseDistConfig, cjsDistConfig)
