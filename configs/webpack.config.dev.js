module.exports = {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: '[name][hash:8].js'
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hot: true
  }
}