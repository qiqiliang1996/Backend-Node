// const jest = require('jest');
const mongoose = require('mongoose');
const checkAuthMiddleware = require('../../../middlewares/checkAuthMiddleware');
const { User } = require('../../../models/user');

describe('check authorization middleware', () => {
  test('should contain valid jwt inside req.user', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      idAdmin: true,
    };

    const token = new User(user).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};
    const next = jest.fn();
    checkAuthMiddleware(req, res, next);
    // expect(req.user).toMatchObject(user);
    expect(req.user).toHaveProperty('_id');
    expect(req.user).toHaveProperty('isAdmin');
  });
});
