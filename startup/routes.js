const express = require('express');
const genresRouter = require('../routes/genres');
const moviesRouter = require('../routes/movies');
const rentalsRouter = require('../routes/rentals');
const customersRouter = require('../routes/customers');
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const checkErrorMiddleware = require('../middlewares/checkErrorMiddleware');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/genres', genresRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/rentals', rentalsRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/auth', authRouter);
  //这个要和 express-async-errors搭配使用，不然要自己写try catch block
  app.use(checkErrorMiddleware);
};
