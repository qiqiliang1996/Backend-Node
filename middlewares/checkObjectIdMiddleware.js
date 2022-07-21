const mongoose = require('mongoose');
function checkObjectIdMiddleware(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('sorry, invalid genre ID');

  next();
}

module.exports = checkObjectIdMiddleware;
