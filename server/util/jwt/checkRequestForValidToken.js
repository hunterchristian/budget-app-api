const getTokenFromRequest = require('./getTokenFromRequest');
const verifyToken = require('./verifyToken');
const {
  sendAuthTokenInvalidResponse,
  sendAuthTokenMissingResponse,
} = require('../responses');

const checkRequestForValidToken = (req, res) => new Promise(async (resolve, reject) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    reject(sendAuthTokenMissingResponse(res));
    return;
  }

  try {
    const decodedJWT = await verifyToken(token);
    resolve(decodedJWT);
  } catch (err) {
    reject(sendAuthTokenInvalidResponse(res));
  }
});

module.exports = checkRequestForValidToken;
