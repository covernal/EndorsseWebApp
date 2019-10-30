'use strict';

var path = require('path');

var settings = {
  env: process.env.NODE_ENV,
  root: path.dirname(require.main.filename),
  port: process.env.PORT || 9000,
  parse: {
    local:{
      PARSE_APP_ID: '57492d707e9ea36b0981d0f08c2e8f07',
      PARSE_SERVER_URL: 'https://endorsse-staging-1650.nodechef.com/parse'
    },
    dev: {},
    dist: {}
  },
  stripe: {
    local: {
      STRIPE_PUBLIC_KEY: 'pk_test_WXlDxstQTbj6vnpFOfNc8iYt',
      STRIPE_SECRET_KEY: 'sk_test_wcYqXMxBCTJRcGeHiVLjnsRv',
      STRIPE_CLIENT_ID:'ca_9enoorsJ0eecLNgUnSbcWkkzpy67bpn0',
      STRIPE_API: 'https://connect.stripe.com/oauth/token'
    },
    dev: {},
    dist: {}
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = settings;
