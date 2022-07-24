const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('check x-auth-token middleware', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  test('should return 401 if token is not provided', async () => {
    const res = await request(server)
      .post('/api/genres')
      .send({ name: 'genre1' });
    expect(res.status).toBe(401);
  });

  test('should return 400 if token is invalid', async () => {
    const token = new User().generateAuthToken();
    const res = await request(server)
      .post('/api/genres')
      .set('x-auth-token', token + '1')
      .send({ name: 'genre1' });
    expect(res.status).toBe(400);
  });
  test('should return 200 if token is valid', async () => {
    const token = new User().generateAuthToken();
    const res = await request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
    expect(res.status).toBe(200);
  });
});
