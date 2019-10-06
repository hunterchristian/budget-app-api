const express = require('express');
const createError = require('http-errors');
const readSpreadsheetValues = require('../google-sheets/readSpreadsheetValues');

const app = express();

app.get('/', async (req, res) => {
  const spreadsheetValues = await readSpreadsheetValues();
  res.json({ spreadsheetValues });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
