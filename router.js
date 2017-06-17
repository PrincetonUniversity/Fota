const Restaurant = require('./server/controllers/restaurant');
const Photo = require('./server/controllers/photo');
const Comment = require('./server/controllers/comment');
const User = require('./server/controllers/user');

module.exports = (app) => {
  // Enable CORS for development Purposes
  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });

  app.get('/', (req, res) => { res.send("hello") });

  app.post('/api/restaurant', Restaurant.post);
  app.get('/api/restaurant', Restaurant.getRestaurants);
  app.get('/api/restaurant/:restaurantId', Restaurant.getPhotos);
  app.get('/api/restaurantnear', Restaurant.getNearbyRestaurants);

  app.post('/api/photo', Photo.post);
  app.get('/api/photo', Photo.get);
  app.delete('/api/photo', Photo.delete);
  app.patch('/api/photo/:id', Photo.patch);

  app.post('/api/comment', Comment.post);
  app.get('/api/comment/:restaurantId', Comment.get);

  app.post('/api/user', User.post);
  app.get('/api/user/:id', User.get);
}
