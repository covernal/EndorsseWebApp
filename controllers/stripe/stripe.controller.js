var request = require('request');
var ServerConfig = require('../../cfg/NodeJS');

module.exports = {
  connectToStripe: function(req, res){
    var options = {
      url: 'https://connect.stripe.com/oauth/token',
      form: {
        'client_secret': req.body.client_secret,
        'code': req.body.code,
        'grant_type': req.body.grant_type
      }
    };

    request.post(options, function(error, response, body) {
      res.json(body);
    });
  },

  getTest: function(req, res){
    res.json({
      code: '200',
      request: 'get'
    });
  }
}
