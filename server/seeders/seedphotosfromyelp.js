var axios = require('axios');
var Photo = require('../models').Photo;
var Restaurant = require('../models').Restaurant;


Restaurant.findAll().then(restaurants => {
  restaurants.forEach((rest, index) => {
    setTimeout(() => {
      axios.get(`https://api.yelp.com/v3/businesses/${rest.id}`, {
        headers: {Authorization: 'Bearer kuAOnCz9HL6BXgUKDvVgLlQ2ODiGiPYbzGUm9HFBTU8xnteXI6L7UXh70OI5NmMbLvvWABU6HYXOe-HNWOH1bnbZQKXcOEQxT26oiXjkqm79bGd3MfHK7tIlmDrtWHYx'}
      }).then((result) => {
        result.data.photos.forEach((photoURL) => {
          Photo.create({
            link: photoURL,
            likeCount: Math.floor(Math.random()*4),
            RestaurantId: rest.id
          }).catch((e) => console.log(e));
        })
      });
    }, index * 500)
  });
});
