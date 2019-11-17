import express from 'express';
import verifyJWTAndAppendToRequest from '../../middleware/verifyJWTAndAppendToRequest';
import readSpreadsheetValues from '../../../google-sheets/readSpreadsheetValues';
import loginHandler from './login';
import dayHandler from './day';
import weekHandler from './week';
import monthHandler from './month';

const apiRouter = express.Router();

apiRouter.post('/login', loginHandler);

apiRouter.get('/day', verifyJWTAndAppendToRequest, dayHandler);
apiRouter.get('/week', verifyJWTAndAppendToRequest, weekHandler);
apiRouter.get('/month', verifyJWTAndAppendToRequest, monthHandler);

apiRouter.get('/', verifyJWTAndAppendToRequest, async (req, res) => {
  const values = await readSpreadsheetValues();
  res.json({ ...values });
});

export default apiRouter;
