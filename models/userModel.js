var mongoose = require("mongoose");
var UserModel = require('../schema/user.js');
var randomstring = require('randomstring');
var mask_unmask = require('../lib/mask-unmask');

//constructor
var User = function(contactNumber, gcm_token, journey_topic) {
    this.contactNumber = contactNumber;
    this._gcm_token = gcm_token;
    this._journey_topic = journey_topic;
};

//function for registering user
User.prototype.registerUser = function(callback) {

    var _id = this.contactNumber;
    var _digest = randomstring.generate();
    var _token = mask_unmask.encrypt(_id, _digest);


    UserModel.update(
        {_id: _id},
        {
            $set: {
                _id: _id,
                _digest: _digest,
                _token: _token
            }
        },
        {
            upsert: true
        },
        function(err, res) {
            var res = {};
            if (err) res._registered = false;
            else {
                res._registered = true;
                res._id = this.contactNumber;
                res._token = _token;
            }

            callback(res);
        }
    );
};

User.prototype.saveGCMToken = function(callback) {
    var _id = this.contactNumber;
    var _gcm_token = this._gcm_token;
    console.log("user model id: " + _id);
    console.log("user model gcm token: " + _gcm_token);
    UserModel.update(
        {
            _id: _id
        },
        {
            $set : {
                _gcm_token: _gcm_token
            }
        },
        {
            //OPTIONS
        },
        function (err) {
            var response = {};
            if (err) {
                response._gcm_token_saved = false;
            } else {
                response._gcm_token_saved = true;
            }
            response._blocked = false;
            callback(response);
        });
};

User.prototype.updateJourneyTopic = function() {
    var _journey_topic = this._journey_topic;
    var _id = this._id;
    UserModel.update(
        {_id: _id},
        {
            $set: {
                _journey_topic: _journey_topic
            }
        },
        function(err, res) {
            if (err) console.log(err);
            else console.log(res);
        }
    )
}

module.exports = User;