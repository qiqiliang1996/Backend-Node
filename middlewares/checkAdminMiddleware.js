function checkAdminMiddleware(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send('Access Denied. Admin Users Only');

  next();
}

module.exports = checkAdminMiddleware;
