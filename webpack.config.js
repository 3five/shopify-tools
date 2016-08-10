var externals = require('webpack-node-externals')
var path = require('path')

module.exports = {
  context: path.resolve('src'),
  entry: ['./index'],
  output: {
      path: path.resolve('lib'),
      filename: 'index.js',
      libraryTarget: 'commonjs'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, include: path.resolve('src'), loader: 'babel-loader' }
    ]
  },
  externals: [externals()],
  target: 'node',
  node: {
    process: false,
  }
}
