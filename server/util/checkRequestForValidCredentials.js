const exitIfEnvVarNotSpecified = require('./exitIfEnvVarNotSpecified');
const {
  sendMissingParamResponse,
  sendIncorrectCredentialsResponse,
} = require('./responses');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
exitIfEnvVarNotSpecified('ADMIN_USERNAME');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
exitIfEnvVarNotSpecified('ADMIN_PASSWORD');

function checkRequestForValidCredentials(req, res) {
  const username = req.body.username;
  if (!username) {
    return sendMissingParamResponse(res, 'username');
  }
  const password = req.body.password;
  if (!password) {
    return sendMissingParamResponse(res, 'password');
  }
  const credentialsAreValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  if (!credentialsAreValid) {
    return sendIncorrectCredentialsResponse(res);
  }

  return null;
}

module.exports = checkRequestForValidCredentials;
