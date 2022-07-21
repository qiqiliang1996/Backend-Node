const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('../models/genre');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 50 },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: { type: Number, required: true, min: 0, max: 100 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 10 },
});

const Movie = mongoose.model('Movie', movieSchema);

const movieValidation = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.string().min(3).required(),
    numberInStock: Joi.number().min(0).max(100).required(),
    dailyRentalRate: Joi.number().min(0).max(10).required(),
  });
  const result = schema.validate(movie);
  return result;
};

module.exports.Movie = Movie;
module.exports.movieValidation = movieValidation;
