var express = require('express');
var router = express.Router();
var User = require('../models/userModel.js');
var updateContactList = require('../lib/UpdateContactList.js');
var Worker = require('webworker-threads').Worker;
var User = require('../schema/user.js');
var async = require("async");


router.post('/', function(req, res) {
    //console.log('getContactList url invoked');
    var contacts = req.body._contacts;

    var updatedContacts = [];

    console.log("contacts: " + JSON.stringify(contacts));

    async.forEach(contacts,
        function (contact, callback) {
            var numbers = contact["_numbers"];
            User.find({ _id: { $in:  numbers  }}, function(err, docs){
                var registeredNumbers = [];
                if (!err) {

                    docs.forEach(function(user){
                        registeredNumbers.push(user['_id']);
                    });

                    if (registeredNumbers.length > 0) {
                        var newContact = {
                            _id: contact._id,
                            _name: contact._name,
                            _numbers: registeredNumbers
                        };

                        updatedContacts.push(newContact);
                    }

                    callback();
                }
            });
            
        }, function (err) {
            res.send({"_contacts": updatedContacts});
        }
    );
});


module.exports = router;
