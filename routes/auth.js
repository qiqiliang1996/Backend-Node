// const config = require('config');
// const jwt = require('jsonwebtoken');
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models/user');

router.post('/', async (req, res) => {
  const authValidation = (user) => {
    const schema = Joi.object({
      email: Joi.string().email().min(5).max(255).required(),
      password: Joi.string().min(6).required(),
    });
    const result = schema.validate(user);
    return result;
  };

  const result = authValidation(req.body);

  if (result.error) {
    res
      .status(400)
      .send(' SORRY, BAD REQUEST 400 ' + result.error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send('SORRY, BAD REQUEST 400. Invalid email or password');
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send('SORRY, BAD REQUEST 400. Invalid email or password');
    return;
  }

  //   const jwtPrivateKey = config.get('jwtPrivateKey');
  //jwtPrivateKey:Node101

  //   const token = jwt.sign(
  //     { _id: user._id, name: user.name, email: user.email },
  //     config.get('jwtPrivateKey')
  //   );

  const token = user.generateAuthToken();

  res.send(token);
});

module.exports = router;
