const express = require('express');
const mongoose = require('mongoose');
// const asyncMiddleware = require('../middlewares/asyncMiddleware');
const auth = require('../middlewares/checkAuthMiddleware');
const admin = require('../middlewares/checkAdminMiddleware');
const checkObjectIdMiddleware = require('../middlewares/checkObjectIdMiddleware');
const router = express.Router();
const { Genre, genreValidation } = require('../models/genre');

router.get('/', async (req, res) => {
  // throw new Error('x0x06 something wrong getting the genres');
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', checkObjectIdMiddleware, async (req, res) => {
  //第一步，看是不是valid genreId  --> checkObjectIdMiddleware

  //第二步：如果valid,去db找这个genre object
  const genre = await Genre.findById(req.params.id);
  // const genre = Genre.find((g) => g.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send('sorry, genre with the given id is not found');
    return;
  } else {
    res.send(genre);
  }
});

router.post('/', auth, async (req, res) => {
  const result = genreValidation(req.body);
  if (result.error) {
    res
      .status(400)
      .send(' SORRY, BAD REQUEST 400 ' + result.error.details[0].message);
    return;
  } else {
    const genre = new Genre({
      name: req.body.name,
    });

    const result = await genre.save();
    // console.log(result, 'result on POST');
    res.send(result);
  }
});

router.put('/:id', auth, async (req, res) => {
  const result = genreValidation(req.body);
  if (result.error) {
    res
      .status(400)
      .send(' SORRY, BAD REQUEST 400 ' + result.error.details[0].message);
    return;
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) {
    res.status(404).send('sorry, genre with the given id is not found');
    return;
  }

  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre) {
    res.status(404).send('sorry, genre with the given id is not found');
    return;
  }

  res.send(genre);
});

module.exports = router;
