var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountRouter = require('./routes/account');
var gradeLevelRouter = require('./routes/grade_level');
const TokenCheckMiddleware = require('./helpers/middleware.js');
const router_config = require('./helpers/router-config.js');

var app = express();

let uri = "mongodb://localhost/learn_chemistry"
mongoose.connect(uri,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});
// mongoose.set('useUnifiedTopology', true);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(TokenCheckMiddleware);

// app.use('/', indexRouter);
// app.use(router_config.api + router_config.account.url, usersRouter);
app.use(router_config.api + router_config.account.url, accountRouter);
app.use(router_config.api + router_config.grade_level.url, gradeLevelRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
let use = app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
