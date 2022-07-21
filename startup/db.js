const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
  mongoose
    .connect(config.get('db'), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      winston.info(`connected to ${config.get('db')}`);
    });
  // .catch((error) => {
  //   console.log('Error occured: ', error.message);
  // });

  // we do not need catch, bc winston will detect rejected promise and log using winston.error
};
