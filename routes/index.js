var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({"INFO": "Root of Tip Yourself Web Server"});
});

module.exports = router;
