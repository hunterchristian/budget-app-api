const readSpreadsheetValues = require('../../../../../google-sheets/readSpreadsheetValues');

async function weekHandler(req, res) {
  const values = await readSpreadsheetValues();
  res.json({ transactions: values.weekSummary.transactions });
}

module.exports = weekHandler;