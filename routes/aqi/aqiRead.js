var db = require('../../db');

module.exports = function() {
    return new Promise(function(resolve, reject) {
        console.log('Starting to read Data from AQI Latest');

        db.source.findAll().then(function(allRecords) {
            console.log('Total Sources : ' + allRecords.length);
            var sourceMap = {};
            allRecords.forEach(function(record) {
                sourceMap[record.id] = {
                    lat : record.lat,
                    lng : record.lng
                };
            });


            db.aqiLatest.findAll().then(function(allData) {
                console.log('Total Records : ' + allData.length);
                var result = [];
                allData.forEach(function(datum) {
                    var res = {
                        id: datum.sourceid,
                        lat : sourceMap[datum.sourceid].lat,
                        lng : sourceMap[datum.sourceid].lng,
                        aqi : datum.aqi,
                        pm25 : datum.pm25,
                        pm10 : datum.pm10,
                        windspeed : datum.windspeed,
                        winddirection : datum.winddirection,
                        updatetime : datum.createtime.toISOString()
                    };
                    result.push(res);
                });

                resolve(result);

            }).catch(function(e) {
                reject(e);
            });

        }).catch(function(e) {
            reject(e);
        });
    });
};