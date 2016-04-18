var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.js');
var url = require('../lib/url.js');
var keys = require('../private/keys.js');
var request = require('request')


var directionAPIKey = keys.directionAPIKey;

//router.use(auth.validate);

router.post("/", function(req, res) {

    console.log("directions url invoked");

    var directions = req.body._directions;

    var srcLat = directions["_src_lat"];
    var srcLong = directions["_src_long"];
    var dstLat = directions["_dst_lat"];
    var dstLong = directions["_dst_long"];


    request(
        'https://maps.googleapis.com/maps/api/directions/json?'
        + "origin=" + srcLat + "," + srcLong
        + "&destination=" + dstLat + "," + dstLong
        + "&key=" + directionAPIKey
        , function (error, response, body) {

            var _fetched = false;

        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Google homepage.
            _fetched = true;
        }
            try {
                var response = {
                    "_blocked": false,
                    "_fetched": _fetched,
                    "_directions": JSON.parse(body)
                };
                console.log(response);
                res.send(response);
            } catch(err) {
                _fetched = false;
                var response = {
                    "_blocked": false,
                    "_fetched": _fetched
                };
                res.send(response);
            }
    })

});


module.exports = router;