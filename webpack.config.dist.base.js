const path = require('path')
const _ = require('lodash')
const pkg = require('./package.json')

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: 'dist',
    library: 'react-highlight-words'
  },
  plugins: [
  ],
  externals: _.chain({})
      .assign(
        pkg.dependencies,
        pkg.peerDependencies
      )
      .mapValues((value, key) => key)
      .value(),
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules)/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules&importLoaders=1', 'cssnext'],
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  }
}
