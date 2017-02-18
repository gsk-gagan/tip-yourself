var express = require('express');
var router = express.Router();
var _ = require('underscore');
var db = require('../db');
var crypto = require('crypto');

/*login Post Request*/
router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    db.user.findOne({
        where: {
            email: email,
            password: password
        }
    }).then(function(user) {
        if(!user) {
            res.status(401).json({
                "status": "Error",
                "message": "Username or Password Mismatch"
            })
        } else {
            var token = crypto.randomBytes(64).toString('hex');

            user.updateAttributes({
                "authtoken" : token
            }).then(function() {
                res.status(200).json({
                    "status": "Success",
                    "message" : token
                });
            }).catch(function(err) {
                res.status(400).json({
                    "status" : "Error",
                    "message": err
                });
            });
        }
    }).catch(function(err) {
        res.status(401).json({
            "status" : "Error",
            "message": err
        });
    });
});

router.post('/logout', function (req, res, next) {
    var email = req.body.email;
    var token = req.body.token;

    db.user.findOne({
        where: {
            email: email,
            authtoken: token
        }
    }).then(function(user) {
        if(!user) {
            res.status(200).json({
                "status" : "Warning",
                "message": "Invalid Token, Invalid Session. Please logout from app"
            });
        } else {
            user.updateAttributes({
                authtoken: null
            }).then(function() {
                res.status(200).json({
                    "status" : "Success",
                    "message": "Logout Successful"
                });
            }).catch(function(err) {
                res.status(401).json({
                    "status" : "Error",
                    "message": err
                });
            });
        }
    }).catch(function(err) {
        res.status(401).json({
            "status" : "Error",
            "message": err
        });
    });
});

/*Sign Up Post Request*/
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

