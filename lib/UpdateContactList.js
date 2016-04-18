/**
 * Created by hammad on 19/1/16.
 */
var User = require('../models/userModel.js');



module.exports = function() {
    var generateAppContactList = function(contacts) {
        contacts.forEach(function (contact) {
            var numbers = contact["_numbers"];
            User.find({ _id: { $in:  numbers  }}, function(err, docs){
                var registeredNumbers = [];
                if (!err) {

                    docs.forEach(function(user){
                        registeredNumbers.push(user['_id']);
                    });

                    contact["_numbers"] = registeredNumbers;
                }
            });
        });
    };

    this.onmessage = function (event) {
        postMessage(generateAppContactList(event.data));
    };
}