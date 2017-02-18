var path = require('path');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if(env == 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect' : 'sqlite',
        'storage' : path.join(__dirname, 'data', 'air-app-database.sqlite')
    });
}

var db = {};

//Table Definitions
db.indiaSpendCrawler = sequelize.import(path.join(__dirname, 'models', 'indiaSpendCrawler.js'));
db.waqiCrawler = sequelize.import(path.join(__dirname, 'models', 'waqiCrawler.js'));
db.source = sequelize.import(path.join(__dirname, 'models', 'source.js'));
db.aqiAll = sequelize.import(path.join(__dirname, 'models', 'aqiAll.js'));
db.aqiLatest = sequelize.import(path.join(__dirname, 'models', 'aqiLatest.js'));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;