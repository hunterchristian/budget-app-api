const readSpreadsheetValues = require('../../../../../google-sheets/readSpreadsheetValues');

async function dayHandler(req, res) {
  const values = await readSpreadsheetValues();
  res.json({ transactions: values.monthSummary.transactions });
}

module.exports = dayHandler;