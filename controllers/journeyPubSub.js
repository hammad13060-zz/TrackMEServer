var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.js');
var url = require('../lib/url.js');
var keys = require('../private/keys.js');
var User = require('../schema/user.js');
var gcm = require('node-gcm');
var randomstring = require('randomstring');

router.use(auth.validate);


router.post('/newJourney', function(req, res) {


    







    console.log('/newJourney: ' + req.body._src_lat);
    var _id = req.body._id.replace('+', '');

    //generating topic for new journey
    var _journey_topic = _id + randomstring.generate();


    // Set up the sender with you API key
    var sender = new gcm.Sender(keys.gcmAPIKey);


    //latitudes and longitudes
    var srcLat = req.body._src_lat;
    var srcLong = req.body._src_long;

    var dstLat = req.body._dst_lat;
    var dstLong = req.body._dst_long;

    var currentLat = req.body._current_lat;
    var currentLong = req.body._current_long;

    //setting up new journey messsage
    var message = new gcm.Message({
        notification : {
            body : "Hey, you have a new journey to track",
            title : "New Journey Notification",
            icon : "ic_launcher"
        }
    });
    message.addData('_msg_type', 'new-journey');
    message.addData('_topic', _journey_topic);

    message.addData('_from', "+" + _id);

    message.addData('_src_lat', srcLat.toString());
    message.addData('_src_long', srcLong.toString());

    message.addData('_dst_lat', dstLat.toString());
    message.addData('_dst_long', dstLong.toString());

    message.addData('_current_lat', currentLat.toString());
    message.addData('_current_long', currentLong.toString());



    var locationUpdateMessage = new gcm.Message();
    locationUpdateMessage.addData("_from", _id);
    locationUpdateMessage.addData("_topic", _id);
    locationUpdateMessage.addData("_update_type", "location");
    locationUpdateMessage.addData("_current_lat", currentLat.toString());
    locationUpdateMessage.addData("_current_long", currentLong.toString());

    sender.send(locationUpdateMessage, {topic: '/topics/' + _journey_topic}, function(err, res) {
        if (err) {
            console.log("/newJourney: topic error " + err)
        } else {
            console.log("/newJourney: topic shared " + res);
            var _numbers = req.body._numbers;
            console.log("numbers: " + JSON.stringify(_numbers));
            User.find(
                {
                    _id: {$in: _numbers}
                },
                function(err, docs) {
                    if (!err) {
                        docs.forEach(function (doc) {
                            console.log("newJourney gcm token: " + doc._gcm_token);
                            //gcm_tokens.push(doc._gcm_token);
                            sender.send(message, {to: doc._gcm_token}, function (err, res) {
                                if (err) console.log("gcm sending error: " + err);
                                else {
                                    console.log("gcm sending response: " + res);
                                }
                            });
                        });
                    }



                }
            );
        }
    });


    var response = {};
    response._blocked = false;
    response._journey_topic = _journey_topic;
    res.send(response);
});

router.post('/updateTopic', function(req, res) {
    console.log('/updateTopic');
    var _id = req.body._id.replace('+','');
    var _journey_topic = req.body._journey_topic;
    var _update_type = req.body._update_type;
    var _current_lat = req.body._current_lat;
    var _current_long = req.body._current_long;

    //setting up new journey messsage
    var message = null;

    if (_update_type === "termination") {
        message = new gcm.Message({
            notification : {
                body : "Hey, a journey tracked by you is complete",
                title : "Active journey update",
                icon : "ic_launcher"
            },
            collapseKey: "location_update"
        })
    } else {
        message = new gcm.Message({
            collapseKey: "location_update"
        });
    }

    message.addData("_from", "+" + _id);
    message.addData("_topic", _journey_topic);
    message.addData("_update_type", _update_type);
    message.addData("_current_lat", _current_lat.toString());
    message.addData("_current_long", _current_long.toString());

    // Set up the sender with you API key
    var sender = new gcm.Sender(keys.gcmAPIKey);


    sender.send(message, {topic: '/topics/' + _journey_topic}, function(err, resp) {
        var response = {};
        response._blocked = false;
        if (err) {
            response._notified = false;
            console.log("/updateTopic(failure): " + err);
        }
        else {
            response._notified = true;
            console.log("/updateTopic(success): " + resp);
        }

        res.send(response);
    });

});

module.exports = router;