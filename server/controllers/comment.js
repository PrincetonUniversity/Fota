var Comment = require('../models').Comment;
var Restaurant = require('../models').Restaurant;

// create a new comment with given parameters
module.exports.post = (req, res) => {
  data = req.body;

  if (!data.noun || !data.adj || !data.rest)
    return res.status(400).send({error: "Must supply adjective, noun, and restId"});

  // If comment already exists, increment it. Else, create it then increment it.
  Comment.findOrCreate({
    where: {
      adj: data.adj,
      noun: data.noun,
      RestaurantId: data.rest
    },
    defaults: {
      count: 0
    }
  }).then((comment, created) => {
    comment[0].increment('count', {by: 1}).then(() => {
      res.status(200).send({message: "Your request has been processed successfully"});
    });
  }).catch((e) => {
    console.log(e);
  })
}

// retrieve all comments, given a valid restaurant ID.
module.exports.get = (req, res) => {
  const id = req.params.restaurantId;
  if (!id)
    return res.status(400).send({error: "Must supply restaurantId"})

  Restaurant.findById(id).then((rest) => {
    if (!rest)
      return res.status(404).send({error: "Restaurant with given id does not exist"});

    rest.getComments().then((comments) => {
      return res.status(200).send(comments);
    });
  }).catch((e) => {
    console.log(e);
  })
}
