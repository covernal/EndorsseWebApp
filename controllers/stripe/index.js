var express = require('express');
var StripeCtrl = require('./stripe.controller');
var router = express.Router();

router.post('/api/connect-stripe', StripeCtrl.connectToStripe);
router.get('/api/get-test', StripeCtrl.getTest);

module.exports = router;
