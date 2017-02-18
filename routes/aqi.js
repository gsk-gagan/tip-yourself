var express = require('express');
var router = express.Router();
var json2csv = require('json2csv');
var aqiRead = require('./aqi/aqiRead');
var db = require('../db');
var filterHelper = require('./aqi/filterHelper');

router.get('/', function (req, res, next) {
    var filter = filterHelper.getQueryParams(req.query);

    aqiRead().then(function(allRecords) {
        var fResults = filterHelper.filterResult(allRecords, filter);
        if(filter.hasOwnProperty('csv') && filter.csv === true) {
            var fields = ['id', 'lat', 'lng', 'aqi', 'pm25', 'pm10', 'windspeed', 'winddirection', 'updatetime'];
            var result = json2csv({data: fResults, fields: fields});

            var header = { 'Content-Type': 'text/plane' };
            var fileName = (new Date()).toISOString();
            if(filter.hasOwnProperty('download') && filter.download === true)
                header = {
                    'Content-Type': 'application/force-download',
                    'Content-disposition':'attachment; filename=' + fileName + '.csv'};
            res.writeHead(200, header);
            res.end(result);
        } else {
            res.json(fResults);
        }
    }).catch(function(e) {
        res.json({
            "error" : e
        });
    });
});

router.get('/:id', function (req, res, next) {
    var id = parseInt(req.params.id);
    console.log(req.param.id);
    var filter = {
        where : {sourceid : id},
        order : 'createtime DESC'
    };

    if(req.query.hasOwnProperty('limit')) {
        filter.limit = req.query.limit;
    }

    var result = [];
    db.source.findById(id).then(function(sourceRecord) {
        db.aqiAll.findAll(filter).then(function(allRecords) {
            allRecords.forEach(function(record) {
                result.push({
                    lat : sourceRecord.lat,
                    lng : sourceRecord.lng,
                    aqi : record.aqi,
                    pm25 : record.pm25,
                    pm10 : record.pm10,
                    windspeed : record.windspeed,
                    winddirection : record.winddirection,
                    updatetime : record.createtime.toISOString()
                });
            });

            if(req.query.hasOwnProperty('csv') && req.query.csv === 'true') {
                var fields = ['lat', 'lng', 'aqi', 'pm25', 'pm10', 'windspeed', 'winddirection', 'updatetime'];
                var csvResult = json2csv({data: result, fields: fields});

                var header = { 'Content-Type': 'text/plane' };
                var fileName = id + '_' + (new Date()).toISOString();
                if(req.query.hasOwnProperty('download') && req.query.download === 'true') {
                    header = {
                        'Content-Type': 'application/force-download',
                        'Content-disposition':'attachment; filename=' + fileName + '.csv'
                    };
                }
                res.writeHead(200, header);
                res.end(csvResult);
            } else {
                res.json(result);
            }
        }).catch(function(e){
            res.json({
                "error" : e
            });
        });
    }).catch(function(e) {
        res.json({
            "error" : e
        });
    });
});

module.exports = router;