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

function getAdjArray(comments, noun) {
  totalCount = 0;
  adjectives = [];
  comments.forEach((comment) => {
    if (comment.noun === noun) {
      adjectives.push({ word: comment.adj, count: comment.count });
      totalCount += comment.count;
    }
  });

  // Numbers in comparator below switched intentionally
  // This allows for descending sorting
  adj = adjectives.sort((a1, a2) => {
    if (a1.count >= a2.count) return -1;
    if (a1.count <= a2.count) return 1;
    else return 0;
  });

  return { adj, totalCount }
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
      let nouns = [];
      // First get all the nouns
      comments.forEach((comment) => {
        if (!nouns.includes(comment.noun))
          nouns.push(comment.noun);
      });

      // Compile an array of objects
      let result = [];
      nouns.forEach((noun) => {
        const { adj, totalCount } = (getAdjArray(comments, noun));
        result.push({
          noun,
          adj,
          totalCount
        });
      });

      const sortedResult = result.sort((a1, a2) => {
        if (a1.totalCount >= a2.totalCount) return -1;
        if (a1.totalCount <= a2.totalCount) return 1;
        else return 0;
      })

      return res.status(200).send(sortedResult);
    });
  }).catch((e) => {
    console.log(e);
  })
}
