const Restaurant = require('./server/controllers/restaurant');
const Photo = require('./server/controllers/photo');

module.exports = (app) => {
  app.get('/', (req, res) => { res.send("hello") });

  app.post('/api/restaurant', Restaurant.post);
  app.get('/api/restaurant/:restaurantId', Restaurant.getPhotos);

  app.post('/api/photo', Photo.post);
  app.get('/api/photo', Photo.get);
  app.delete('/api/photo', Photo.delete);
  app.patch('/api/photo/:id', Photo.patch)
}
