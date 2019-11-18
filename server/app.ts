import * as dotenv from 'dotenv';
import onlyAllowWhitelistedOrigins from './middleware/onlyAllowWhitelistedOrigins';

// Load environment variables from a local .env file, if present
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import createError from 'http-errors';
import apiRouter from './routes/api';

const app = express();

// log all requests to the server
app.use(morgan('combined'));

// Restrict API access to whitelisted origins
const allowedOrigins = [
  'https://budget-view-hunterhod.herokuapp.com'
];
if (!!process.env.IS_DEV) {
  allowedOrigins.push('http://localhost:3000');
}
app.use(onlyAllowWhitelistedOrigins(allowedOrigins, !!process.env.IS_DEV));

// parse application/x-www-form-urlencoded from request body
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json from request body
app.use(bodyParser.json());

app.use('/api', apiRouter);

// Host static files
app.use('/build', express.static('build'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

export default app;
