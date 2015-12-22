/**
 * Created by hammad on 18/12/15.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var registrationRouter = require("./controllers/registration.js");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;       // set our port


//configuring registration router
app.use('/registration', registrationRouter);

//connecting with mongodb and starting up the server
mongoose.connect("mongodb://localhost/trackMe");

var db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error"));
db.once('open', function () {
    console.log("Connection to trackMe db is open...");
    app.listen(port);
    console.log('app server started on port: ' + port);
});