import readSpreadsheetValues from '../../../google-sheets/readSpreadsheetValues';

async function weekHandler(req, res) {
  const values = await readSpreadsheetValues();
  res.json({
    budgetRemaining: values.weekSummary.weekRemaining,
    totalSpent: values.weekSummary.weekSpent,
    transactions: values.weekSummary.transactions,
  });
}

export default weekHandler;