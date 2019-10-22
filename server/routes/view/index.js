const express = require('express');
const publicRouter = require('./public');

const viewRouter = express.Router();
viewRouter.use('/public', publicRouter);

module.exports = viewRouter;
