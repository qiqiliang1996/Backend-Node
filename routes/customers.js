const express = require('express');
const auth = require('../middlewares/checkAuthMiddleware');
const router = express.Router();

const { Customer, customerValidation } = require('../models/customer');

router.get('/', async (req, res) => {
  const customer = await Customer.find().sort('name');
  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  // const genre = Genre.find((g) => g.id === parseInt(req.params.id));
  if (!customer) {
    res.status(404).send('sorry, genre with the given id is not found');
    return;
  } else {
    res.send(customer);
  }
});

router.post('/', auth, async (req, res) => {
  const result = customerValidation(req.body);
  if (result.error) {
    res
      .status(400)
      .send(' SORRY, BAD REQUEST 400 ' + result.error.details[0].message);
    return;
  } else {
    const customer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    });

    const result = await customer.save();
    console.log(result, 'result on POST');
    res.send(result);
  }
});

router.put('/:id', auth, async (req, res) => {
  const result = customerValidation(req.body);
  if (result.error) {
    res
      .status(400)
      .send(' SORRY, BAD REQUEST 400 ' + result.error.details[0].message);
    return;
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );

  if (!customer) {
    res.status(404).send('sorry, genre with the given id is not found');
    return;
  }

  res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    res.status(404).send('sorry, genre with the given id is not found');
    return;
  }

  res.send(customer);
});

module.exports = router;
