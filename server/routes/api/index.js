const express = require('express');

const verifyJWTAndAppendToRequest = require('../../middleware/verifyJWTAndAppendToRequest');
const protectedRouter = require('./protected');
const publicRouter = require('./public');

const apiRouter = express.Router();

apiRouter.use('/protected', verifyJWTAndAppendToRequest, protectedRouter);
apiRouter.use('/public', publicRouter);

module.exports = apiRouter;
