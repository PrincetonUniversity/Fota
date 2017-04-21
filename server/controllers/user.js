var User = require('../models').User;

module.exports.post = (req, res) => {
  var data = req.body;
  if (!data.id) return res.status(400).send({error: "must provide user id"});

  User.create({
    id: data.id
  }).then((User) => {
    res.status(200).send({message: "user successfully created"})
  }).catch((err) => {
    res.status(400).send({error: err})
  });
};

module.exports.get = (req, res) => {
  var id = req.params.id;
  if (!id) return res.status(400).send({error: "must supply an id"});

  User.findById(id).then((user) => {
    if (!user) return res.status(404).send({error: "user not found"});

    user.getPhotos({
      order: [['createdAt', 'DESC']]
    }).then((photos) => {
      return res.status(200).send({
        uploadedPhotos: photos,
        likedPhotos: user.likedPhotos
      })
    })
  }).catch((e) => {
    console.log(e);
    res.status(400).send({error: "bad request"});
  })
};
