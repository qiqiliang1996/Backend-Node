const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
});

const Genre = mongoose.model('Genre', genreSchema);

const genreValidation = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });
  const result = schema.validate(genre);
  return result;
};

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.genreValidation = genreValidation;
