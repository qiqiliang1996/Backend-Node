const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe('GET /', () => {
    test('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'Genre1' },
        { name: 'Genre2' },
      ]);

      const response = await request(server).get('/api/genres');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(
        response.body.some((genre) => genre.name === 'Genre1')
      ).toBeTruthy();
      expect(
        response.body.some((genre) => genre.name === 'Genre2')
      ).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    test('should return a genre object with given valid genreId', async () => {
      const genre = new Genre({ name: 'Genre 3' });

      await genre.save();

      const response = await request(server).get('/api/genres/' + genre._id);

      expect(response.status).toBe(200);
      // expect(response.body).toMatchObject(genre); //this will fail bc genre._id is objectId, but response.body's genreId is string
      expect(response.body).toHaveProperty('name', 'Genre 3');
    });

    test('should return 404 with given invalid genreId', async () => {
      const response = await request(server).get('/api/genres/1');
      expect(response.status).toBe(404);
    });

    test('should return 404 with given valid objectId, but not valid genreId', async () => {
      const id = mongoose.Types.ObjectId();
      const response = await request(server).get('/api/genres/' + id);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /', () => {
    test('should return 401 if user did not logged in', async () => {
      const response = await request(server)
        .post('/api/genres')
        .send({ name: 'Genre 4' });

      expect(response.status).toBe(401);
    });

    test('should return 400 if genre name is less than 5 charactoers', async () => {
      const token = new User().generateAuthToken();
      const response = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: '12' });

      expect(response.status).toBe(400);
    });

    test('should return 400 if genre name is more than 50 charactoers', async () => {
      const token = new User().generateAuthToken();
      const name = new Array(52).join('a');
      const response = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: name });

      expect(response.status).toBe(400);
    });

    test('should save to db if genre name is valid', async () => {
      const token = new User().generateAuthToken();

      const response = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'Genre 5' });

      const genre = Genre.find({ name: 'Genre 5' }); //check whether or not save to db successfully

      expect(genre).not.toBeNull;
    });

    test('should send the POST object back to user in response if genre name is valid', async () => {
      const token = new User().generateAuthToken();

      const response = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'Genre 5' });

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', 'Genre 5');
    });
  });

  describe('PUT /:id', () => {
    test('should return 401 if user did not loggin', async () => {
      const res = await request(server).put('/api/genres/1234');
      expect(res.status).toBe(401);
    });

    test('should return 400 if genre is less than 3 characters', async () => {
      const genre = new Genre({ name: 'Genre PUT' });
      const token = new User().generateAuthToken();
      const res = await request(server)
        .put('/api/genres/' + genre.id)
        .set('x-auth-token', token)
        .send({ name: '12' });
      expect(res.status).toBe(400);
    });

    test('should return 400 if genre is more than 50 characters', async () => {
      const name = new Array(52).join('a');
      const genre = new Genre({ name: 'Genre PUT' });
      const token = new User().generateAuthToken();
      const res = await request(server)
        .put('/api/genres/' + genre.id)
        .set('x-auth-token', token)
        .send({ name: name });
      expect(res.status).toBe(400);
    });

    test('should return 404 if format-valid genreId is not found in db', async () => {
      const id = mongoose.Types.ObjectId();
      const token = new User().generateAuthToken();
      const res = await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name: 'Genre PUT 2' });
      expect(res.status).toBe(404);
    });

    test('should update the genre in db if input is valid', async () => {
      const genre = new Genre({ name: 'genre1 PUT' });
      await genre.save();

      const token = new User().generateAuthToken();

      const res = await request(server)
        .put('/api/genres/' + genre._id)
        .set('x-auth-token', token)
        .send({ name: 'PUT updatedName' });

      const updatedGenre = await Genre.findById(genre._id);

      expect(updatedGenre.name).toBe('PUT updatedName');
    });

    test('should return updated the genre back to user if update successfully', async () => {
      const genre = new Genre({ name: 'genre1 PUT' });
      await genre.save();

      const token = new User().generateAuthToken();

      const res = await request(server)
        .put('/api/genres/' + genre._id)
        .set('x-auth-token', token)
        .send({ name: 'PUT updatedName' });

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'PUT updatedName');
    });
  });

  describe('DELETE /:id', () => {
    test('should return 401 if user did not loggin', async () => {
      const res = await request(server).delete('/api/genres/1234');
      expect(res.status).toBe(401);
    });

    test('should return 403 if user is not admin', async () => {
      const genre = new Genre({ name: 'genre1 DELETE' });
      await genre.save();

      const token = new User().generateAuthToken();

      const res = await request(server)
        .delete('/api/genres/' + genre._id)
        .set('x-auth-token', token);
      expect(res.status).toBe(403);
    });

    test('should return 404 if passed valid-format genreId but is not found in db', async () => {
      // const genre = new Genre({ name: 'genre1 DELETE' });
      // await genre.save();
      const id = mongoose.Types.ObjectId();

      const token = new User({ isAdmin: true }).generateAuthToken();

      const res = await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token);
      expect(res.status).toBe(404);
    });

    test('should return deledted object back to user if delete successfully in db', async () => {
      const genre = new Genre({ name: 'genre1 DELETE' });
      await genre.save();
      // const id = mongoose.Types.ObjectId();

      const token = new User({ isAdmin: true }).generateAuthToken();

      const res = await request(server)
        .delete('/api/genres/' + genre._id)
        .set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', 'genre1 DELETE');
    });
  });
});
