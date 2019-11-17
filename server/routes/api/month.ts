import readSpreadsheetValues from '../../../google-sheets/readSpreadsheetValues';

async function dayHandler(req, res) {
  const values = await readSpreadsheetValues();
  res.json({ transactions: values.monthSummary.transactions });
}

export default dayHandler;