/**
 * Created by hammad on 18/12/15.
 */
var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    _id: String,
    _digest: String,
    _token: String,
    _gcm_token: String
});

module.exports = mongoose.model('User', UserSchema);
