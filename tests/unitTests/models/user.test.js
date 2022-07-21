const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const { User } = require('../../../models/user');

describe('user.generateAuthToken', () => {
  test('should return valid JWT', () => {
    const payload = {
      //   _id: new mongoose.Types.ObjectId(),
      name: 'Qiqi',
      isAdmin: true,
    };
    const user = new User(payload);

    const token = user.generateAuthToken();

    const decode = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decode).toMatchObject(payload);
  });
});
