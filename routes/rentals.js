const express = require('express');
const auth = require('../middlewares/checkAuthMiddleware');
const router = express.Router();
const { Rental, rentalValidation } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    res.status(404).send('sorry, rental with the given id is not found');
    return;
  } else {
    res.send(rental);
  }
});

router.post('/', auth, async (req, res) => {
  const result = rentalValidation(req.body);
  if (result.error) {
    res
      .status(400)
      .send(' SORRY, BAD REQUEST 400 ' + result.error.details[0].message);
    return;
  } else {
    //多了这两步，反正user传进来的是 customerId & movieId
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
      return res.status(404).send('Invalid customer.');
    }

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) {
      return res.status(404).send('Invalid movie.');
    }

    if (movie.numberInStock === 0)
      return res.status(400).send('Movie not in stock.');

    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
      dataOut: req.body.dataOut,
      dateReturn: req.body.dateReturn,
      rentalFee: req.body.rentalFee,
    });

    // without mongoose transaction //
    // const result = await rental.save();
    //rental.save() --> movie.save() 这里中间可能会crashed,有error什么的,所以要用transaction//
    // movie.numberInStock--;
    // movie.save();
    // res.send(result);

    //

    //mongoose transaction
    try {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        const result = await rental.save();
        movie.numberInStock--;
        movie.save();
        res.send(result);
      });

      session.endSession();
      console.log('success');
    } catch (error) {
      console.log('error111', error.message);
    }
    //
  }
});

router.delete('/:id', auth, async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);

  if (!rental) {
    res.status(404).send('sorry, rental with the given id is not found');
    return;
  }

  res.send(rental);
});

module.exports = router;
