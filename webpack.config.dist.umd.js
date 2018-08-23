const baseDistConfig = require('./webpack.config.dist.base')
const _ = require('lodash')

const umdDistConfig = {
  output: {
    filename: '[name].umd.js',
    libraryTarget: 'umd'
  }
}

module.exports = _.merge(baseDistConfig, umdDistConfig)
