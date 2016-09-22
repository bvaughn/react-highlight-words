const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: 'dist',
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    library: 'highlight-words-core'
  },
  plugins: [
  ],
  externals: {
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules)/,
        include: path.join(__dirname, 'src')
      }
    ]
  }
}
