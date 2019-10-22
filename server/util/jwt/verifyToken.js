const jwt = require('jsonwebtoken');

const exitIfEnvVarNotSpecified = require('../exitIfEnvVarNotSpecified');

const JWT_SECRET = process.env.JWT_SECRET;
exitIfEnvVarNotSpecified('JWT_SECRET');

const verifyToken = token => new Promise((resolve, reject) => {
  jwt.verify(token, JWT_SECRET, (err, decodedJWT) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(decodedJWT);
  });
});

module.exports = verifyToken;
