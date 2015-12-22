/**
 * Created by hammad on 18/12/15.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/userModel.js');

router.post('/', function(req, res) {
    console.log('registration url invoked');
    var contactNumber = req.body._id;
    var newUser = new User(contactNumber);
    newUser.registerUser(function(msg){
        res.send(msg);
    });
});


module.exports = router;