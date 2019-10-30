'use strict';

var path = require('path');
var defaultSettings = require('./defaults');
var additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  port: defaultSettings.port,
  debug: true,
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'bundle.js',
    publicPath: defaultSettings.publicPath
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: true,
    compress: true,
    inline: true,
    proxy: {
      '/functions/**': {
        target: process.env.PARSE_SERVER_URL,
        secure: false
      }
    }
    // https: true
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      actions: defaultSettings.srcPath + '/actions/',
      components: defaultSettings.srcPath + '/components/',
      sources: defaultSettings.srcPath + '/sources/',
      stores: defaultSettings.srcPath + '/stores/',
      styles: defaultSettings.srcPath + '/styles/',
      config: defaultSettings.srcPath + '/config/' + process.env.REACT_WEBPACK_ENV
    }
  },
  module: {}
};
