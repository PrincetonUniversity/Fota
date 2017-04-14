const axios = require('axios');
var Restaurant = require ('../models').Restaurant;

// Seed the database with top 30 Princeton restaurants from yelp.
axios.get('https://api.yelp.com/v3/businesses/search?term=food&latitude=40.3573&longitude=-74.6672&radius=4000&limit=30', {
  headers: {Authorization: 'Bearer kuAOnCz9HL6BXgUKDvVgLlQ2ODiGiPYbzGUm9HFBTU8xnteXI6L7UXh70OI5NmMbLvvWABU6HYXOe-HNWOH1bnbZQKXcOEQxT26oiXjkqm79bGd3MfHK7tIlmDrtWHYx'}
}).then((response) => {
  response.data.businesses.map((data) => {

    const type = [];
    data.categories.map((category) => {
      type.push(category.title);
    })

    const address = `${data.location.address1} ${data.location.city} ${data.location.state} ${data.location.zip_code}`;

    Restaurant.create({
      name: data.name,
      phoneNumber: data.phone,
      lat: data.coordinates.latitude,
      lng: data.coordinates.longitude,
      address: address,
      type: type,
    })
  })
}).catch((e) => {
  console.log(e);
})
