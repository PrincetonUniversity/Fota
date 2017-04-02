var Photo = require('../models').Photo;
var Restaurant = require('../models').Restaurant;
var sequelize = require('sequelize');

// create a new photo with given parameters
module.exports.post = (req, res) => {
  data = req.body
  Photo.create({
    RestaurantId: data.RestaurantId,
    UserId: data.UserId,
    likecount: 0,
    link: data.link
  }).then((photo) => {
    res.status(200).send(photo);
  }).catch((err) => {
    console.log(err);
  })
}

module.exports.get = (req, res) => {
  order = req.query.order;
  if (order == 'hot') {
    order = ['likecount', 'DESC']
  } else if (order == 'new') {
    order = ['createdAt', 'DESC']
  } else {
    return res.status(400).send({error: "sorting order incorrect"})
  }

  // geographical data accessible as req.query.lat and req.query.lng
  Photo.findAll({
    order: [
      order
    ]
  }).then((photos) => {
    Restaurant.findAll({
    }).then((restaurants) => {
      res.status(200).send({photos, restaurants});
    })
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

module.exports.patch = (req, res) => {
  ups = req.body.upvote;
  downs = req.body.downvote;
  if (!ups && !downs)
    return res.status(400).send({error: "no photo id supplied"})

  if (ups) {
    Photo.update({
      likecount: sequelize.literal("likecount + 1")
    }, {where: {
      id: ups
    }}).catch((e) => console.log(e))
  }

  if (downs) {
    Photo.update({
      likecount: sequelize.literal("likecount - 1")
    }, {where: {
      id: ups
    }}).catch((e) => console.log(e))
  }

  response = {
    message: "Your upvote downvote request has been successfully processed."
  };
  return res.send(response);

}
