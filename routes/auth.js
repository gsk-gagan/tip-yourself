var express = require('express');
var router = express.Router();

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

router.post('/sing_up', function (req, res, next) {

});

module.exports = router;

