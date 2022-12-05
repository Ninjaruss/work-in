const express = require('express');
const path = require('path');

const colors = require('colors');
const connectDB = require('./db/conn');
const dotenv = require('dotenv').config()

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

connectDB();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

// error handling
app.use(errorHandler)

module.exports = app;
