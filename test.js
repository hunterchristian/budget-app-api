const readSpreadsheetValues = require('./google-sheets/readSpreadsheetValues');

(async function () {
  const spreadsheetValues = await readSpreadsheetValues();
}())