var HTMLWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devServer: {
    contentBase: false
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.css$/, use: [ MiniCssExtractPlugin.loader, 'css-loader' ] },
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Gravity 2',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css'
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};
