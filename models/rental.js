const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { customerSchema } = require('../models/customer');
const { movieSchema } = require('../models/movie');

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      dailyRentalRate: { type: Number, required: true, min: 0, max: 10 },
    }),
    required: true,
  },
  dataOut: {
    type: Date,
    default: Date.now,
  },
  dateReturn: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Rental = mongoose.model('Rental', rentalSchema);

const rentalValidation = (rental) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
    rentalFee: Joi.number().required(),
  });
  const result = schema.validate(rental);
  return result;
};

module.exports.Rental = Rental;
module.exports.rentalSchema = rentalSchema;
module.exports.rentalValidation = rentalValidation;
