'use strict';

// Babel ES6/JSX Compiler
require('babel-register');
require('babel-polyfill');

var error = require('../../controllers/error');

module.exports = function(app){
  app.use(require('../../controllers/stripe'));
  app.route('/:url(auth|components|app)/*')
   .get(error[404]);
};
