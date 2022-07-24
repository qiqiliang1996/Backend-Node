const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 10 },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true, min: 6 },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

//在这里generate auth token, 不然all over the place
//jwtPrivateKey：Node101
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get('jwtPrivateKey')
  );

  return token;
};

const User = mongoose.model('User', userSchema);

const userValidation = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(6).required(),
    isAdmin: Joi.boolean(),
  });
  const result = schema.validate(user);
  return result;
};

module.exports.User = User;
module.exports.userValidation = userValidation;
