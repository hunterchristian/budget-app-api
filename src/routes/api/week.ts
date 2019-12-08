import { Response } from 'express';

import readSpreadsheetValues from '../../../google-sheets/readSpreadsheetValues';
import { RequestWithJWT } from '../../types/jwt';

async function weekHandler(req: RequestWithJWT, res: Response) {
  // TODO: remove once migrated to postgres
  // tslint:disable-next-line: no-unsafe-any
  const values = await readSpreadsheetValues();
  res.json({
    // tslint:disable-next-line: no-unsafe-any
    budgetRemaining: values.weekSummary.weekRemaining,
    // tslint:disable-next-line: no-unsafe-any
    totalSpent: values.weekSummary.weekSpent,
    // tslint:disable-next-line: no-unsafe-any
    transactions: values.weekSummary.transactions,
  });
}

export default weekHandler;
