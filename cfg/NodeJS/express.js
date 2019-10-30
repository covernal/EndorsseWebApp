'use strict';

/**
 * Express configuration
 */
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var path = require('path');
var session = require('cookie-session');
var logger = require('connect-logger');
var cookieParser = require('cookie-parser');
var jade = require('jade');
var config = require('./index');

module.exports = function(app){
  //Use jade as the template engine
  app.set('views', config.root + '/views');
  app.set('view engine', 'jade');
  app.set('view cache', true);

  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(config.root + '/dist'));
  app.use(logger());
};
