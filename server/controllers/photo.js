var Photo = require ('../models').Photo;

// create a new photo with given parameters
module.exports.post = (req, res) => {
  data = req.body
  Photo.create({
    RestaurantId: data.RestaurantId,
    UserId: data.UserId,
    likeCount: 0,
    link: data.link
  }).then((photo) => {
    res.status(200).send(photo);
  }).catch((err) => {
    console.log(err);
  })
}

module.exports.get = (req, res) => {
  // geographical data accessible as req.query.lat and req.query.lng
  Photo.findAll().then((photos) => {
    res.status(200).send(photos);
  });
}

module.exports.delete = (req, res) => {
  id = req.body.id;
  Photo.destroy({where: {
    id: id
  }}).then((results) => {
    res.send("Delete Successful")
  }).catch((e) => {
    console.log(e);
  })
}
