var crypto = require('crypto');
var keys = require('../private/keys.js');

var mask_unmask = {};
mask_unmask.encrypt = function(_id, _digest) {
    var cipher = crypto.createCipher(keys.encryptionAlgo, _digest);
    var crypted = cipher.update(_id,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

mask_unmask.decrypt = function(_token, _digest) {
    var decipher = crypto.createDecipher(keys.encryptionAlgo,_digest)
    var dec = decipher.update(_token,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
};

module.exports = mask_unmask;

