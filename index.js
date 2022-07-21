const config = require('config');
const express = require('express');

const app = express();
require('./startup/winstonLogging')(); //error first
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/production')(app);

if (!config.get('jwtPrivateKey')) {
  throw new Error('101 Fatal Error, jwtPrivateKey is not defined');
}

const port = process.env.PORT || 5200;
const server = app.listen(port, () => {
  console.log(`Connection is on port ${port}...`);
});

module.exports = server;
