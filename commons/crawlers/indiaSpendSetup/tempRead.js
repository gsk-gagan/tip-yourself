var db = require('../../../db');

module.exports = function() {
    return new Promise(function(resolve, reject) {
        console.log('Starting to read Data');

        db.indiaSpendCrawler.findAll({attributes: ['imei', 'name', 'lat', 'lng']})
            .then(function(records) {
                resolve(records);
            })
            .catch(function(e) {
                reject(e);
            });
    });
};