const generateSignedJWTFromRequest = require('../../../../util/jwt/generateSignedJWTFromRequest');
const { sendAuthSuccessfulResponseWithToken } = require('../../../../util/responses');

function loginHandler(req, res) {
  try {
    const token = generateSignedJWTFromRequest(req, res);
    return sendAuthSuccessfulResponseWithToken(res, token);
  } catch (errorResponse) {
    return errorResponse;
  }
}

module.exports = loginHandler;
