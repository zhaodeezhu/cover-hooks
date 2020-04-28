const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const path = require('path')
module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: 'cover.js',
    path: path.join(__dirname, '../lib'),
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}