var User = require('../models').User;
var Photo = require('../models').Photo;

module.exports.post = (req, res) => {
  var data = req.body;
  if (!data.id) return res.status(400).send({error: "must provide user id"});

  User.create({
    id: data.id
  }).then((User) => {
    res.status(200).send({message: "user successfully created"})
  }).catch((err) => {
    res.status(400).send({error: "error; please make sure your id is unique"})
  });
};

module.exports.get = (req, res) => {
  var id = req.params.id;
  if (!id) return res.status(400).send({error: "must supply an id"});

  User.findById(id).then((user) => {
    if (!user) return res.status(404).send({error: "user not found"});

    // Find User's uploaded photos
    user.getPhotos({
      order: [['createdAt', 'DESC']]
    }).then((uploadedPhotos) => {
      console.log(user);
      // Return the actual liked photos
      Photo.findAll({where: {
        id: user.likedPhotos
      }}).then((likedPhotos) => {
        return res.status(200).send({
          uploadedPhotos: uploadedPhotos,
          likedPhotos: likedPhotos,
          likedPhotoIds: user.likedPhotos
        })
      })
    })
  }).catch((e) => {
    console.log(e);
    res.status(400).send({error: "bad request"});
  })
};
