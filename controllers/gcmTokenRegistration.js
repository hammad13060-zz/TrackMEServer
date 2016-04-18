var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.js');
var url = require('../lib/url.js');
var keys = require('../private/keys.js');
var User = require('../models/userModel.js');

router.use(auth.validate);

router.post('/', function(req, res) {
    var contactNumber = req.body._id;
    var gcmToken = req.body._gcm_token;
    console.log("gcm token: " + gcmToken);
    var newUser = new User(contactNumber, gcmToken);
    newUser.saveGCMToken(function(msg) {
        res.send(msg);
    });
});

module.exports = router;