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
        'storage' : path.join(__dirname, 'data', 'tip-yourself.sqlite')
    });
}

var db = {};

//Table Definitions
db.user = sequelize.import(path.join(__dirname, 'models', 'user.js'));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;