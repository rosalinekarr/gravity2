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
    new HTMLWebpackPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};
