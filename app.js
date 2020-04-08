var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://heroku_z845v6qz:ancvrkna3eucjpq9rivufajnos@ds033113.mlab.com:33113/heroku_z845v6qz');
// var db = monk('process.env.MONGODB_URI');

var indexRouter = require('./routes/index');
var endpointRouter = require('./routes/endpoints');
var dbEndpointRouter = require('./routes/dbEndpoints');
const port = 3000;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
	req.db = db;
	next();
});

app.use('/', indexRouter);
app.use('/teams', endpointRouter);
app.use('/db', dbEndpointRouter);
app.disable('etag');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(port);

module.exports = app;

