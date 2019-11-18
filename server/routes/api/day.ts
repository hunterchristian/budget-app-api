import readSpreadsheetValues from '../../../google-sheets/readSpreadsheetValues';

async function dayHandler(req, res) {
  const values = await readSpreadsheetValues();
  res.json({
    budgetRemaining: values.daySummary.dayRemaining,
    totalSpent: values.daySummary.daySpent,
    transactions: values.daySummary.transactions,
  });
}

export default dayHandler;