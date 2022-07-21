function asyncMiddleware(routerHandler) {
  return async (req, res, next) => {
    try {
      await routerHandler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = asyncMiddleware;
