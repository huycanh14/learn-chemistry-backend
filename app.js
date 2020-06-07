var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// declare mongoose
var mongoose = require('mongoose');

// require dotenv => process.env.MONGODB_URI
require('dotenv').config();


// declare routers
var accountRouter = require('./routes/account');
var gradeRouter = require('./routes/grade');
var chapterRouter = require("./routes/chapter");

// declare TokenCheckMiddleware
const TokenCheckMiddleware = require('./helpers/middleware.js');

var app = express();

// connect to mongodb
const uri = `mongodb://${process.env.MONGODB_URI}/${process.env.DATA_BASE_URI}`
mongoose.connect(uri,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use TokenCheckMiddleware
app.use(TokenCheckMiddleware);  

// use routers

app.use(`${process.env.api}${process.env.account}`, accountRouter);
app.use(`${process.env.api}${process.env.grade}`, gradeRouter);
app.use(`${process.env.api}${process.env.chapter}`, chapterRouter);

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

module.exports = app;