var User = require('../schema/user.js');
var mask_unmask = require('../lib/mask-unmask.js');
var auth = {};

auth.validate = function(req, res, next) {
    var _id = req.body._id;
    var _token = req.body._token;
    User.findOne({_id: _id}, function (err, doc)  {
        if (err) {
            res.send({
                _blocked: true
            });
        } else {
            var _digest = doc._digest;
            console.log("digest: " + _digest);
            var dec = mask_unmask.decrypt(_token, _digest)
            if (dec !== _id) {
                res.send({
                    _blocked: true
                });
            } else {
                next();
            }
        }
    });
};

module.exports = auth;