const express = require('express');
const loginHandler = require('./handlers/login');

const publicRouter = express.Router();
publicRouter.get('/login', loginHandler);

module.exports = publicRouter;
