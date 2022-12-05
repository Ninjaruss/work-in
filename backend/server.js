const express = require('express');
const path = require('path');

const colors = require('colors');
const connectDB = require('./db/conn');
const dotenv = require('dotenv').config()

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const createError = require("http-errors");

connectDB();
const app = express();

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api', require('./routes/indexRouter'));
app.use('/api/users',  require('./routes/userRouter'));

// serve frontend build at root directory uri
app.use(
  express.static(path.join(__dirname, "../frontend/build"))
)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// error handling
app.use(errorHandler)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
