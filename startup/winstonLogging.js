const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors'); //no need try catch block each time for catch error

module.exports = function () {
  winston.exceptions.handle(
    // new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'exceptions.log' })
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: 'mongodb://localhost/vidly',
  //     level: 'error',
  //     options: { useUnifiedTopology: true },
  //   })
  // );

  // process.on('uncaughtException', (ex) => {
  //   console.log('uncaught Exception');
  //   winston.error(ex.message, ex);
  //   // process.exit(1);
  // });

  //模仿uncaught Exception
  // throw new Error('throw error');

  //模仿unhandled promise rejection
  // const p = Promise.reject(new Error('rejected promise'));
  // p.then(() => {
  //   console.log('promise resolved');
  // });
};
