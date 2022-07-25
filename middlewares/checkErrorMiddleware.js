const winston = require('winston');

function checkErrorMiddleware(error, req, res, next) {
  winston.error(error.message, '111 error from backend errorMiddleware');
  winston.error(error, '222');
  res.status(500).send('333 Sorry, unexpect connection error');
  next();
}

module.exports = checkErrorMiddleware;
