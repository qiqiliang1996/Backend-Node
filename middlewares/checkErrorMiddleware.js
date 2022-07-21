const winston = require('winston');

function checkErrorMiddleware(error, req, res, next) {
  winston.error(error.message, error);
  res.status(500).send('333 Sorry, unexpect connection error');
  next();
}

module.exports = checkErrorMiddleware;
