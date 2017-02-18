var db = require('../../../db');
var inputRecords = require('./issource');

module.exports = function() {
    return new Promise(function(resolve, reject) {
        console.log('Starting to insert Data');

        var toInsert = [];

        inputRecords.forEach(function(record) {
            toInsert.push({
                imei : record['imei'],
                name : record['name'],
                lat : record['lat'],
                lng : record['lng']
            });
        });

        db.indiaSpendCrawler.bulkCreate(toInsert).then(function(record) {
            resolve(record);
        }).catch(function(error) {
            reject(error);
        });
    });
};