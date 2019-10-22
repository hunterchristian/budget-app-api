const readSpreadsheetValues = require('../../../../../google-sheets/readSpreadsheetValues');

async function indexHandler(req, res) {
  const values = await readSpreadsheetValues();
  res.json({ ...values });
}

module.exports = indexHandler;
