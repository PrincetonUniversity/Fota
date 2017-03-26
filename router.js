const Restaurant = require('./server/controllers/restaurant');
const Photo = require('./server/controllers/photo');

module.exports = (app) => {
  app.get('/', (req, res) => { res.send("hello") });

  app.post('/restaurant', Restaurant.post);
  app.get('/restaurant/:restaurantId', Restaurant.getPhotos);

  app.post('/photo', Photo.post);
  app.get('/photo', Photo.get);
}
