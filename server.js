/**
 * Created by hammad on 18/12/15.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var registrationRouter = require("./controllers/registration.js");
var getContactListRouter = require("./controllers/getContactList.js");
var directionsRouter = require("./controllers/directions.js");
var gcmTokenRegistrationRouter = require("./controllers/gcmTokenRegistration.js");
var pubsub = require("./controllers/journeyPubSub.js");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT;       // set our port


//configuring registration router
app.use('/registration', registrationRouter);

//configuring getContactList router
app.use('/getContactList', getContactListRouter);


//configuring directions api router
app.use("/getDirections", directionsRouter);

//configuring gcm token registration api
app.use("/registerGCMToken", gcmTokenRegistrationRouter);

app.use("/pubsub", pubsub);

//connecting with mongodb and starting up the server
mongoose.connect("mongodb://hammad:hammad@ds017070.mlab.com:17070/followme");

var db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error"));
db.once('open', function () {
    console.log("Connection to trackMe db is open...");
    app.listen(port);
    console.log('app server started on port: ' + port);
});