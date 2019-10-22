const jwt = require('jsonwebtoken');

const checkRequestForValidCredentials = require('../checkRequestForValidCredentials');
const exitIfEnvVarNotSpecified = require('../exitIfEnvVarNotSpecified');

const JWT_SECRET = process.env.JWT_SECRET;
exitIfEnvVarNotSpecified('JWT_SECRET');

function generateSignedJWTFromResponse(req, res) {
  const errorResponse = checkRequestForValidCredentials(req, res);
  if (errorResponse) {
    throw errorResponse;
  }

  return jwt.sign({ username: req.body.username }, JWT_SECRET, { expiresIn: '24h' });
}

module.exports = generateSignedJWTFromResponse;
