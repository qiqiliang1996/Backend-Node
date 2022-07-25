const config = require('config');
function checkAdminMiddleware(req, res, next) {
  if (!config.get('requiresAuth')) return next();
  if (!req.user.isAdmin)
    return res.status(403).send('Access Denied. Admin Users Only');

  next();
}

module.exports = checkAdminMiddleware;
