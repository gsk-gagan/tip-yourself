var data = {};

data.INDIA_SPEND = 'indiaSpend';
data.INDIA_SPEND_CRAWL_TIME = 'indiaSpendCrawlTime';
data.REFRESH_INTERVAL = 1;         //Crawl Refresh interval

data.INDIA_SPEND_OBJ = {
    FIRST_CRAWL: 'indiaSpendFirstCrawl'
};

data.WAQI_CRAWLER = {
    NAME: 'waqi',
    LIMIT: 16,
    CRAWL_TIME: 'waqiCrawlTime'
};

data.IST_MINUTES = 330;

data.SCHEDULER = {
    INTERVAL: 30*60*1000,            //To change this to 30/60 minutes, As in milliseconds
    LAST_CRAWL_TIME: 'scheduler-lastCrawlTime',
    CRAWL_COUNT: 'scheduler-crawlCount'
};

module.exports = data;
