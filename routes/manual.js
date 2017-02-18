var express = require('express');
var writeTable = require('../commons/crawlers/indiaSpendSetup/tempInsert');
var readTable = require('../commons/crawlers/indiaSpendSetup/tempRead');
var insertSourceTable = require('../commons/crawlers/indiaSpendSetup/insertSource');
var router = express.Router();

router.get('/first', function (req, res, next) {
    writeTable().then(function(record) {
        console.log('Inserted Successfully');
        console.log(record);
        res.status(200);
        res.json({
            "status" : "Success",
            "record" : record
        });
    }).catch(function(error) {
        console.log('ERROR!');
        console.log(error);
        res.status(400);
        res.json({
            "status" : "Failure",
            "error-msg" : error
        });
    });
});

//router.get('/first/read', function(req, res, next) {
//    readTable().then(function(records) {
//        res.json(records);
//    }).catch(function(e) {
//        res.json(e);
//    });
//});

router.get('/second', function(req, res, next) {
    insertSourceTable().then(function(records) {
        res.json(records);
    }).catch(function(e) {
        res.json(e);
    });
});

module.exports = router;
