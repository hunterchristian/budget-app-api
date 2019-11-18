import readSpreadsheetValues from '../../../google-sheets/readSpreadsheetValues';

async function dayHandler(req, res) {
  const values = await readSpreadsheetValues();
  res.json({
    budgetRemaining: values.monthSummary.monthRemaining,
    totalSpent: values.monthSummary.monthSpent,
    transactions: values.monthSummary.transactions,
  });
}

export default dayHandler;