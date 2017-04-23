var Photo = require('../models').Photo;
var Restaurant = require('../models').Restaurant;
var User = require('../models').User;
var sequelize = require('sequelize');

// create a new photo with given parameters
module.exports.post = (req, res) => {
  const { RestaurantId, UserId, link } = req.body;

  // Make sure the user exists and is authroized
  if (!UserId) return res.status(401).send({error: "Must provide user ID"});
  User.findById(UserId).then((user) => {
    if (!user) return res.status(404).send({error: "User not found"});
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: "Internal server error"});
  })

  Photo.create({
    RestaurantId,
    UserId,
    likecount: 0,
    link
  }).then((photo) => {
    res.status(200).send({message: "creation successful"});
  }).catch((err) => {
    console.log(err);
  })
}

module.exports.get = (req, res) => {
  // sequelizeInstance = new sequelize('fota_dev', 'postgres', '123', {dialect: 'postgres'});
  order = req.query.order;
  // distance = req.query.distance;
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
    });
  });

  // sequelizeInstance.query(`SELECT * FROM "Restaurants" WHERE 2 * 3961 * asin(sqrt((sin(radians((lat - 40.3468210) / 2))) ^ 2 + cos(radians(40.3468210)) * cos(radians(lat)) * (sin(radians((lng - -74.6552090) / 2))) ^ 2)) <= ${distance}`)
  // .then((rest) => {
  //   restaurants = rest[0];
  //   photos = [];
  //   restaurants.map((rest) => {
  //     rest.getPhotos((photo) => {
  //       photos.push(photo);
  //     })
  //   })
  // })

}

module.exports.delete = (req, res) => {
  id = req.body.id;
  Photo.destroy({where: {
    id: id
  }}).then((results) => {
    res.send("Delete Successful");
  }).catch((e) => {
    console.log(e);
  })
}

module.exports.patch = (req, res) => {
  userID = req.query.user;
  type = req.query.type;
  amount = req.query.amount || "1";

  if (type != "upvote" && type != "downvote")
    return res.status(400).send({error: "no vote type supplied"});

  if (type == "upvote") {
    if (userID) {
      User.findById(userID).then((user) => {
        if (!user) return res.status(404).send({error: "no user found"});

        var liked = user.likedPhotos;
        if (liked) {
          liked.push(req.params.id);
        } else {
          liked = [req.params.id];
        }
        user.update({likedPhotos: liked}).catch((e) => {
          console.log(e);
          return res.status(400).send({error: "error in accessing user information"})
        });
      })
    }

    Photo.update({
      likecount: sequelize.literal(`likecount + ${amount}`)
    }, {where: {
      id: req.params.id
    }}).catch((e) => console.log(e))
  }

  if (type == "downvote") {
    Photo.update({
      likecount: sequelize.literal(`likecount - ${amount}`)
    }, {where: {
      id: req.params.id
    }}).catch((e) => console.log(e))
  }

  response = {
    message: "Your upvote/downvote request has been successfully processed."
  };
  return res.send(response);
}
