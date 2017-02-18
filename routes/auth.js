var express = require('express');
var router = express.Router();
var _ = require('underscore');
var db = require('../db');


/* GET home page. */
router.get('/sing_in', function (req, res, next) {
    res.json({"INFO": "Login GET page"});
});

router.post('/sing_in', function(req, res, next) {
    var userName = req.body.user;
    var password = req.body.password;

    //console.log("Username: " + userName + " Password: " + password);

    res.status(200);
    res.json({
        "status" : "Success",
        "token" : "This is the randomly generated token"
    });
    res.end("Username: " + userName + " Password: " + password);
});

router.post('/sign_up', function (req, res, next) {
    var body = _.pick(req.body, 'firstname', 'lastname', 'email', 'homeaddress', 'officeaddress',
            'avgmnthspending', 'mintip', 'maxtip', 'password');

    db.user.create(body).then(function(user) {
        res.status(200);
        res.json({
            "status" : "Success",
            "message" : "Created new user " + user.firstname + " with email: " + user.email
        });
    }).catch(function(err) {
        res.status(400).json({
            "status" : "Error",
            "message": err.errors
        });
    });

});

module.exports = router;

