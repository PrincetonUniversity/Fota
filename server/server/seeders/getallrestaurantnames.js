var Restaurant = require('../models').Restaurant;

Restaurant.findAll().then((rests) => {
  rests.map(rest => {
    console.log(rest.name);
  })
})
