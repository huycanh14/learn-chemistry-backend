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
var lessonRouter = require('./routes/lesson');
var theoryRouter = require('./routes/theory');
var typeOfLessonRouter = require('./routes/type_of_lesson');
var questionRouter = require('./routes/question');
var answerRouter = require('./routes/answer');
var explainRouter = require('./routes/explain');

// declare TokenCheckMiddleware
const TokenCheckMiddleware = require('./helpers/middleware.js');

var app = express();

// connect to mongodb
// const uri = `mongodb://${process.env.MONGODB_URI}/${process.env.DATA_BASE_URI}`;
const uri = `mongodb://${process.env.USER_NAME}:${process.env.PASSWORD}@databases-demo-shard-00-00-46pba.gcp.mongodb.net:27017,databases-demo-shard-00-01-46pba.gcp.mongodb.net:27017,databases-demo-shard-00-02-46pba.gcp.mongodb.net:27017/${process.env.DATA_BASE_URI}?ssl=true&replicaSet=databases-demo-shard-0&authSource=admin&retryWrites=true&w=majority`
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


app.use((req, res, next) => {
  const test = /\?[^]*\//.test(req.url);
  if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
    res.redirect(301, req.url.slice(0, -1));
  else
    next();
});

// use TokenCheckMiddleware
app.use(TokenCheckMiddleware);  

// use routers

app.use(`${process.env.api}${process.env.account}`, accountRouter);
app.use(`${process.env.api}${process.env.grade}`, gradeRouter);
app.use(`${process.env.api}${process.env.chapter}`, chapterRouter);
app.use(`${process.env.api}${process.env.lesson}`, lessonRouter);
app.use(`${process.env.api}${process.env.theory}`, theoryRouter);
app.use(`${process.env.api}${process.env.type_of_lesson}`, typeOfLessonRouter);
app.use(`${process.env.api}${process.env.question}`, questionRouter);
app.use(`${process.env.api}${process.env.answer}`, answerRouter);
app.use(`${process.env.api}${process.env.explain}`, explainRouter);

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