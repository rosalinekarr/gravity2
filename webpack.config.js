var HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: false
  },
  plugins: [
    new HTMLWebpackPlugin()
  ]
};
