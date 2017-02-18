var storage = require('node-persist');
var moment = require('moment');
var crawlers = require('./crawlers');
var constants = require('./constants');

storage.initSync();

module.exports.startScheduler = function(interval) {
    console.log('Starting scheduled tasks in ' + interval/60000 + ' minutes');

    //To run when the server starts
    schedulerTasks();

    setInterval(function() {
        storage.setItemSync(constants.SCHEDULER.LAST_CRAWL_TIME, moment.utc().add(constants.IST_MINUTES, 'minutes'));
        var count = storage.getItemSync(constants.SCHEDULER.CRAWL_COUNT);
        if(count === undefined)
            count = 1;
        storage.setItemSync(constants.SCHEDULER.CRAWL_COUNT, ++count);

        schedulerTasks();
    }, interval);
};


function schedulerTasks() {
    crawlers.indiaSpendCrawler();
    crawlers.waqiCrawler();
}