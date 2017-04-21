var Restaurant = require('../models').Restaurant;
var Photo = require('../models').Photo;

module.exports.post = (req, res) => {
  data = req.body
  Restaurant.create({
    name: data.name,
    phoneNumber: data.phoneNumber,
    lat: data.lat,
    lng: data.lng,
    address: data.address,
    website: data.website,
    cuisine: data.cuisine,
    openTime: data.openTime,
    closeTime: data.closeTime,
  }).then((restaurant) => {
    res.status(200).send(restaurant);
  }).catch((err) => {
    console.log(err);
  })
}

module.exports.getRestaurants = (req, res) => {
  Restaurant.findAll({
    order: [['name', 'ASC']]
  }).then((restaurants) => {
    res.status(200).send(restaurants);
  });
}

module.exports.getPhotos = (req, res) => {
  Restaurant.findById(req.params.restaurantId).then((rest) => {
    if (!rest) {
      return res.status(404).send({
        message: "Restaurant not Found"
      });
    }
    rest.getPhotos({
      order: [['createdAt', 'DESC']]
    }).then((photos) => {
      return res.status(200).send(photos);
    });
  }).catch((err) => {
    console.log(err);
  })
}
