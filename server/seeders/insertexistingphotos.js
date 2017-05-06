const fs = require('fs');
const Photo = require('../models').Photo;

fs.readFile(process.argv[2], 'utf8', (err, data) => {
  if (err) throw err;
  var restaurants = data.split('\n');
  restaurants.pop();
  restaurants.forEach((line) => {
    // entry[0] is the id, entry[2,3,4] are URLs
    var entry = line.split(',');
    const RestaurantId = entry[0];
    const URLs = [entry[2], entry[3], entry[4]];

    URLs.forEach((link) => {
      Photo.create({
        RestaurantId: RestaurantId,
        UserId: null,
        likecount: Math.floor(Math.random() * (20000-3000) + 3000),
        link: link
      })
    })
  })
});
