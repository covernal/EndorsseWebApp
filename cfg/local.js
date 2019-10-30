'use strict';

var path = require('path');
var webpack = require('webpack');
var baseConfig = require('./base');
var defaultSettings = require('./defaults');
var nodeCfg = require('./NodeJS');

//Postcss plugins
var autoprefixer = require('autoprefixer');
var postUrl = require('postcss-url');

// Add needed plugins here
var config = Object.assign({}, baseConfig, {
  devtool: 'eval-source-map',
  entry: {
    app: [
      'webpack-hot-middleware/client',
      'webpack/hot/only-dev-server',
      './src/index',
    ],
    vendor: ['react']
  },
  cache: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: "jquery",
      parsley: "parsleyjs"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'BROWSER': JSON.stringify(true),
        'PARSE_SERVER_URL': JSON.stringify('https://backend-staging.endorsse.com/parse'),
        'NODE_ENV': JSON.stringify('development'),
        'REACT_WEBPACK_ENV': JSON.stringify(process.env.REACT_WEBPACK_ENV)
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js')
  ],
  module: defaultSettings.getDefaultModules(),
  postcss: function (webpack) {
    return [
      require('postcss-import')({
        addDependencyTo: webpack
      }),
      autoprefixer,
      postUrl
    ];
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "node_modules")]
  }
});

// Add needed loaders
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'react-hot!babel-loader',
  include: path.join(__dirname, '/../src')
});

module.exports = config;
