import { Response } from 'express';

import readSpreadsheetValues from '../../../google-sheets/readSpreadsheetValues';
import { RequestWithJWT } from '../../types/jwt';

async function dayHandler(req: RequestWithJWT, res: Response) {
  // TODO: remove once migrated to postgres
  // tslint:disable-next-line: no-unsafe-any
  const values = await readSpreadsheetValues();
  res.json({
    // tslint:disable-next-line: no-unsafe-any
    budgetRemaining: values.daySummary.dayRemaining,
    // tslint:disable-next-line: no-unsafe-any
    totalSpent: values.daySummary.daySpent,
    // tslint:disable-next-line: no-unsafe-any
    transactions: values.daySummary.transactions,
  });
}

export default dayHandler;
