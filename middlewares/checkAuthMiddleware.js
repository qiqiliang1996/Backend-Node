const config = require('config');
const jwt = require('jsonwebtoken');

function checkAuthMiddleware(req, res, next) {
  if (!config.get('requiresAuth')) return next();
  const token = req.header('x-auth-token');

  // console.log(token, 'token backend 111');
  //
  if (!token) return res.status(401).send('Access denied, no token provided');

  try {
    const decode = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decode; //重点
    next();
  } catch (error) {
    console.log(error.message, 'error from checkAuthMiddleware');
    res.status(400).send('Invalid Token');
  }
}

module.exports = checkAuthMiddleware;
