const express = require('express');
const auth = require('../middlewares/checkAuthMiddleware');
const router = express.Router();
const { Movie, movieValidation } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
  const movies = await Movie.find().populate('genre').sort('name');
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('genre');
  if (!movie) {
    res.status(404).send('sorry, movie with the given id is not found');
    return;
  } else {
    res.send(movie);
  }
});

router.post('/', auth, async (req, res) => {
  const result = movieValidation(req.body);
  if (result.error) {
    res
      .status(400)
      .send(' SORRY, BAD REQUEST 400 ' + result.error.details[0].message);
    return;
  } else {
    //多了这两步，反正user传进来的是genreId
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      return res.status(404).send('Invalid genre.');
    }

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    const result = await movie.save();
    console.log(result, 'result on POST');
    res.send(result);
  }
});

router.put('/:id', auth, async (req, res) => {
  const result = movieValidation(req.body);
  if (result.error) {
    res
      .status(400)
      .send(' SORRY, BAD REQUEST 400 ' + result.error.details[0].message);
    return;
  }

  //多了这两步，反正user传进来的是genreId
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) {
    res.status(404).send('sorry, genre with the given id is not found');
    return;
  }

  res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    res.status(404).send('sorry, genre with the given id is not found');
    return;
  }

  res.send(movie);
});

module.exports = router;
