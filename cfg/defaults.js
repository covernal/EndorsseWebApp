'use strict';

var path = require('path');
var srcPath = path.join(__dirname, '/../src');
var modulePath = path.join(__dirname, '/../node_modules');
var defaultPort = process.env.PORT || 9000;

function getDefaultModules() {
  return {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        include: srcPath,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.(svg|ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpg|gif|svg|png|ico)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      },
      {
        test: /\.(json)$/,
        loader: 'file-loader!json-loader?name=data/[name].[ext]'
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader?outputStyle=expanded&indentedSyntax"
      }
    ]
  };
}

module.exports = {
  srcPath: srcPath,
  modulePath: modulePath,
  publicPath: '/assets/',
  port: defaultPort,
  getDefaultModules: getDefaultModules
};
