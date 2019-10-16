const express = require('express');
const createError = require('http-errors');
const readSpreadsheetValues = require('../google-sheets/readSpreadsheetValues');

const app = express();

app.get('/', async (req, res) => {
  const values = await readSpreadsheetValues();
  res.json({ ...values });
});

app.get('/day', async (req, res) => {
  const values = await readSpreadsheetValues();
  res.json({ transactions: values.daySummary.transactions });
});

app.get('/week', async (req, res) => {
  const values = await readSpreadsheetValues();
  res.json({ transactions: values.weekSummary.transactions });
});

app.get('/month', async (req, res) => {
  const values = await readSpreadsheetValues();
  res.json({ transactions: values.monthSummary.transactions });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
