var db = require('../../../db');
var constants = require('../../constants');

module.exports = function() {
    return new Promise(function(resolve, reject) {
        console.log('Starting to insert Data to Source');

        var toInsert = [];

        db.indiaSpendCrawler.findAll().then(function(allRecords) {
            allRecords.forEach(function(record) {
                toInsert.push({
                    sourcecode : record.imei,
                    sourcetype : constants.INDIA_SPEND,
                    lat : record.lat,
                    lng : record.lng
                });
            });
            
            db.source.bulkCreate(toInsert).then(function(records) {
                resolve(records);
            }).catch(function(e) {
                reject(e);
            });
            
        }).catch(function(e) {
            reject(e);
        });
    });
};
