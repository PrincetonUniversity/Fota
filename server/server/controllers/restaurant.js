var Restaurant = require('../models').Restaurant;
var Photo = require('../models').Photo;
var sequelize = require('sequelize');

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

module.exports.getNearbyRestaurants = (req, res) => {
  if (process.env.DATABASE_URL) {
    sequelizeInstance = new sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      port: '5432',
      host: 'ec2-23-23-223-2.compute-1.amazonaws.com'
    })
  } else sequelizeInstance = new sequelize('fota_dev', 'postgres', '123', {dialect: 'postgres'});

  let { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).send({error: 'Must provide lat, lng'});

  sequelizeInstance.query(`SELECT id, name, 2 * 3961 * asin(sqrt((sin(radians((lat - ${lat}) / 2))) ^ 2 + cos(radians(${lat})) * cos(radians(lat)) * (sin(radians((lng - ${lng}) / 2))) ^ 2)) AS distance FROM "Restaurants"`)
  .then((restaurants) => {
    let closeRestaurants = restaurants[0].filter((rest) => {
      return (rest.distance <= 1)
    });
    // distance comparator
    sortedRestaurants = closeRestaurants.sort((a, b) => {
      if (a.distance == b.distance) return 0;
      if (a.distance > b.distance) return 1;
      if (a.distance < b.distance) return -1;
    });
    return res.status(200).send(sortedRestaurants);
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: 'Internal Server Error'});
  });
}
