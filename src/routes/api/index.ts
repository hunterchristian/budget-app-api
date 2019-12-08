import express from 'express';
import readSpreadsheetValues from '../../../google-sheets/readSpreadsheetValues';
import verifyJWTAndAppendToRequest from '../../middleware/verifyJWTAndAppendToRequest';
import dayHandler from './day';
import loginHandler from './login';
import monthHandler from './month';
import weekHandler from './week';

const apiRouter = express.Router();

apiRouter.post('/login', loginHandler);

apiRouter.get('/day', verifyJWTAndAppendToRequest, dayHandler);
apiRouter.get('/week', verifyJWTAndAppendToRequest, weekHandler);
apiRouter.get('/month', verifyJWTAndAppendToRequest, monthHandler);

apiRouter.get('/', verifyJWTAndAppendToRequest, async (req, res) => {
  // TODO: remove once migrated to postgres
  // tslint:disable-next-line: no-unsafe-any
  const values = await readSpreadsheetValues();
  res.json({ ...values });
});

export default apiRouter;
