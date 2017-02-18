var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var manual = require('./routes/manual');
var crawler = require('./routes/crawler');
var aqi = require('./routes/aqi');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//The path here is relative
app.use('/', index);
app.use('/api/manual', manual);
app.use('/api/aqi', aqi);
app.use('/api/crawler', crawler);



module.exports = app;
