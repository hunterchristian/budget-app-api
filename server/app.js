const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const createError = require('http-errors');

const apiRouter = require('./routes/api');
const viewRouter = require('./routes/view');

const app = express();

// log all reqruests to the server
app.use(morgan('combined'));

// parse application/x-www-form-urlencoded from request body
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json from request body
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use('/view', viewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
