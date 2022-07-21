const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  isGold: { type: Boolean, required: true },
  phone: { type: String, required: true, minlength: 10, maxlength: 10 },
});

const Customer = mongoose.model('Customer', customerSchema);

const customerValidation = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string().min(10).max(10).required(),
  });
  const result = schema.validate(customer);
  return result;
};

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.customerValidation = customerValidation;
