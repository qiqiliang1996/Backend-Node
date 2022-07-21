const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => {
    console.log('connected to mongodb..');
  })
  .catch((error) => {
    console.log('Error occured: ', error.message);
  });

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Course = mongoose.model('Genre', genreSchema);
const genre = new Course({
  name: 'Comedy',
});
