var HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: false
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Gravity 2',
      hash: true
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};
