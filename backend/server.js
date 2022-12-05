var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const colors = require('colors');
const connectDB = require('./db/conn');
var dotenv = require('dotenv').config()

const errorHandler = require('./middleware/errorHandler');

connectDB();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorHandler)

// routers
var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/usersRouter');

// routes
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

// serve frontend build at root directory uri
app.use(
  express.static(path.join(__dirname, "../frontend/build"))
)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
