const express = require('express');
const indexHandler = require('./handlers');
const dayHandler = require('./handlers/day');
const weekHandler = require('./handlers/week');
const monthHandler = require('./handlers/month');

const protectedRouter = express.Router();
protectedRouter.get('/', indexHandler);
protectedRouter.get('/day', dayHandler);
protectedRouter.get('/week', weekHandler);
protectedRouter.get('/month', monthHandler);

module.exports = protectedRouter;
