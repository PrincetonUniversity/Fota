var Photo = require('../models').Photo;
var Restaurant = require('../models').Restaurant;

Photo.destroy({where: {}}).then((m) => {
  console.log('Delete Successful');
  console.log(m);
}).catch((e) => {
  console.log(e);
});

Restaurant.destroy({where: {}}).then((m) => {
  console.log('Delete Successful');
  console.log(m);
}).catch((e) => {
  console.log(e);
});
