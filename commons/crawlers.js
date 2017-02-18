var storage = require('node-persist');
var moment = require('moment');

var db = require('../db');
var constants = require('./constants');

var indiaSpendCrawlerFunction = require('./crawlers/indiaspend');
var indiaSpendInsertToCrawlerTable = require('./crawlers/indiaSpendSetup/tempInsert');
var indiaSpendInsertToSource = require('./crawlers/indiaSpendSetup/insertSource');

var waqiCrawlerFunction = require('./crawlers/waqi');

storage.initSync();

var i=0;
var errors = [];
var success = [];
var hasInserted = false;
var recentRequest = false;

function indiaSpendCrawler() {
    var isFirstCrawl = storage.getItemSync(constants.INDIA_SPEND_OBJ.FIRST_CRAWL);
    if(isFirstCrawl === undefined || isFirstCrawl === true) {
        console.log('Starting India Spend Setup');
        indiaSpendSetup().then(function(message) {
            console.log(message);
            storage.setItemSync(constants.INDIA_SPEND_OBJ.FIRST_CRAWL, false);
            indiaSpendSiteCralwer();
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        indiaSpendSiteCralwer();
    }
}

function indiaSpendSetup() {
    return new Promise(function(resolve, reject) {
        db.indiaSpendCrawler.destroy({where : {}}).then(function() {
            return db.source.destroy({
                where: {
                    sourcetype: 'indiaSpend'
                }
            });
        }).then(function() {
            return indiaSpendInsertToCrawlerTable();
        }).then(function(crawlerRecords) {
            return indiaSpendInsertToSource();
        }).then(function(sourceRecords) {
            resolve('IndiaSpend Setup Successful. Inserted ' + sourceRecords.length + ' source records');
        }).catch(function(err) {
            reject(err);
        });
    });
}

function indiaSpendSiteCralwer() {
    var res = {};

    i=0;
    errors=[];
    success=[];
    hasInserted = false;
    recentRequest = false;

    var lastCrawlTime = storage.getItemSync(constants.INDIA_SPEND_CRAWL_TIME);
    if(lastCrawlTime !== undefined && lastCrawlTime > moment().subtract(constants.REFRESH_INTERVAL, 'minutes'))
        recentRequest = true;

    if(recentRequest) {
        res.json = {
            "error" : "Last crawl not more than " + constants.REFRESH_INTERVAL + " minutes ago. So, not crawling again"
        };
        console.log(res.json);
        return;
    }

    //Added so that newer crawl does not start before 15 minutes
    recentRequest = true;
    storage.setItemSync(constants.INDIA_SPEND_CRAWL_TIME, moment());

    db.source.findAll({
        where : {
            sourcetype : constants.INDIA_SPEND
        }
    }).then(function(allRecords) {
        allRecords.forEach(function(record) {
            indiaSpendCrawlerFunction(record.sourcecode).then(function(data) {
                success.push({
                    sourceid : record.id,
                    aqi : data.aqi,
                    pm25 : data.pm25,
                    pm10 : data.pm10,
                    windspeed : data.windspeed,
                    winddirection : data.winddirection,
                    createtime : data.createtime
                });
                i++;

                console.log('Completed ' + i + '/' + allRecords.length);
                if(i >= allRecords.length && !hasInserted) {
                    res.json = {
                        "errors" : errors,
                        "success" : success
                    };
                    console.log(res.json);
                    insertAQI(success);
                    hasInserted = true;
                }
            }).catch(function(e) {
                errors.push({
                    imei : record.imei,
                    error : e
                });
                i++;

                console.log('Completed ' + i + '/' + allRecords.length);
                if(i >= allRecords.length && !hasInserted) {
                    res.json = {
                        "errors" : errors,
                        "success" : success
                    };
                    console.log(res.json);
                    insertAQI(success);
                    hasInserted = true;
                }
            });
        });
    }).catch(function(e) {
        console.log('ERROR Reading records');
    });
}

function waqiCrawler() {
    var res = {};
    recentRequest = false;

    var lastCrawlTime = storage.getItemSync(constants.WAQI_CRAWLER.CRAWL_TIME);
    if(lastCrawlTime != undefined && lastCrawlTime > moment().subtract(constants.REFRESH_INTERVAL, 'minutes'))
        recentRequest = true;

    if(recentRequest) {
        res.json = {
            "error" : "Last crawl not more than " + constants.REFRESH_INTERVAL + " minutes ago. So, not crawling again"
        };
        console.log(res.json);
        return;
    }

    recentRequest = true;
    storage.setItemSync(constants.WAQI_CRAWLER.CRAWL_TIME, moment());

    //Real Work Begin
    var sendString = '';

    db.waqiCrawler.destroy({where: {}});                                //Truncate waqi
    sendString += 'Destroyed WaqiCrawler Table.\n';
    console.log(sendString);

    waqiCrawlerFunction.getSources().then(function(allRecords) {        //Read from waqi site
        sendString += 'Read from Waqi site.\n';
        console.log(sendString);
        return waqiCrawlerFunction.insertToWaqi(allRecords.data);       //Store to waqiCrawl
    }).then(function(insertedWaqi) {                                    //Insert the sources which are not present
        sendString += 'Inserted to WaqiCrawler.\n';
        console.log(sendString);
        return waqiCrawlerFunction.insertToSource();
    }).then(function(insertedSource) {                                  //Read data from source table again
        sendString += 'Total records inserted to source: ' + insertedSource.length + '.\n';
        console.log(sendString);
        return db.source.findAll({
            where: {
                sourcetype: constants.WAQI_CRAWLER.NAME
            }
        });
    }).then(function(allSource) {
        var sourceNV = {};
        allSource.forEach(function(source) {
            sourceNV[source.sourcecode] = source.id;
        });


        db.waqiCrawler.findAll().then(function(allWaqi) {
            var toInsert = [];
            allWaqi.forEach(function(waqi) {
                if(sourceNV.hasOwnProperty(waqi.x)) {
                    toInsert.push({
                        sourceid: sourceNV[waqi.x],
                        aqi: waqi.aqi,
                        createtime: waqi.readTime
                    });
                }
            });

            insertAQI(toInsert);

            sendString += 'Now inserting the data to aqiAll and aqiLatest.\n';
            console.log(sendString);
            res.json = {
                "message" : sendString
            };
            console.log(res.json);
        }).catch(function(err) {
            res.json = {
                "message" : sendString,
                "error" : err
            };
            console.log(res.json);
        });
    }).catch(function(err) {
        res.json = {
            "message" : sendString,
            "error" : err
        };
        console.log(res.json);
    })
}


function insertAQI(allRecords) {
    db.aqiAll.bulkCreate(allRecords).then(function(records) {
        insertLatestAQI(0, allRecords);
    }).catch(function(e) {
        insertLatestAQI(0, allRecords);
    });
}

function insertLatestAQI(index, allRecords) {
    if(index >= allRecords.length)
        return;
    db.aqiLatest.upsert(allRecords[index]).then(function(record) {
        //console.log('Insert to Latest AQI');
        //console.log(record);
        insertLatestAQI(++index, allRecords);
    }).catch(function(e) {
        insertLatestAQI(++index, allRecords);
    });
}


module.exports = {
    indiaSpendCrawler: indiaSpendCrawler,
    waqiCrawler: waqiCrawler
};
