// const config = require('config');
// const jwt = require('jsonwebtoken');
const express = require('express');
const auth = require('../middlewares/checkAuthMiddleware');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express.Router();
const { User, userValidation } = require('../models/user');

router.get('/', async (req, res) => {
  const user = await User.find().select('-password');
  res.send(user);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const result = userValidation(req.body);

  if (result.error) {
    res
      .status(400)
      .send(' SORRY, BAD REQUEST 400 xoxo' + result.error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res
      .status(400)
      .send('SORRY, BAD REQUEST 400. This email has already been used');
    return;
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // const jwtPrivateKey = config.get('jwtPrivateKey');
  // //jwtPrivateKey:Node101

  // const token = jwt.sign(
  //   { _id: user._id, name: user.name, email: user.email },
  //   jwtPrivateKey
  // );

  const token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});

module.exports = router;
