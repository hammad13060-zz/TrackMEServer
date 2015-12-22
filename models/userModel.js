var mongoose = require("mongoose");
var UserModel = require('../schema/user.js');
var randomstring = require('randomstring');
var mask_unmask = require('../lib/mask-unmask');

//constructor
var User = function(contactNumber) {
    this.contactNumber = contactNumber;
};

//function for registering user
User.prototype.registerUser = function(callback) {

    var _id = this.contactNumber;
    var _digest = randomstring.generate();
    var _token = mask_unmask.encrypt(_id, _digest);

    var user = new UserModel({
        _id: _id,
        _digest: _digest,
        _token: _token
    });

    user.save(function(err) {
        var res = {};
        if (err) res._registered = false;
        else {
            res._registered = true;
            res._id = this.contactNumber;
            res._token = _token;
        }

        callback(res);

    });
};

module.exports = User;