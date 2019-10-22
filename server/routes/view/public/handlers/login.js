const loginPage = require('../../pages/login');

function loginHandler(req, res) {
  res.status(200).send(loginPage);
}

module.exports = loginHandler;
