// List of all the photos in their visual component PhotoDetail

import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import axios from 'axios';
import _ from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay';
import PhotoDetail from './PhotoDetail';

class PhotoList extends Component {
  state = { photos: [], restaurants: [], spinnerVisible: true, liked: null, disliked: null };

  componentWillMount() {
    this.getLikedAndDisliked().done();
    axios.get('https://fotafood.herokuapp.com/api/photo?order=hot&lat=55.1234&lng=-123.551')
      .then(response => this.setState({ photos: response.data.photos,
                                        restaurants: response.data.restaurants,
                                        spinnerVisible: false }));
  }

  getLikedAndDisliked = async () => {
    try {
      // await AsyncStorage.clear();
      const liked = await AsyncStorage.getItem('liked');
      const disliked = await AsyncStorage.getItem('disliked');
      this.setState({ liked: JSON.parse(liked), disliked: JSON.parse(disliked) });
    } catch (error) {
      console.log(error);
    }
  };

  // given an id of a picutre, returns "liked" if the user has liked it,
  // "disliked" if user has not liked it, and null if neither.
  findVote(id) {
    //if (id === 19) console.log(this.state.liked);
    //if (id === 19) console.log(this.state.disliked);
    if (_.includes(this.state.liked, id)) return 'liked';
    if (_.includes(this.state.disliked, id)) return 'disliked';
    return null;
  }

  // Returns the restaurant associated with a given id
  findRestaurant(restaurantid) {
    for (let i = 0; i < this.state.restaurants.length; i++) {
      if (restaurantid === this.state.restaurants[i].id) {
        return this.state.restaurants[i];
      }
    }
    return null;
  }

  renderPhotos() {
    return this.state.photos.map(photo =>
      <PhotoDetail
        key={photo.id}
        photo={photo}
        vote={this.findVote(photo.id)}
        restaurant={this.findRestaurant(photo.RestaurantId)}
      />
      // Later on key should be id of user who uploaded it
    );
  }

  render() {
    //console.log(this.state);
    return (
      <View>
        <Spinner visible={this.state.spinnerVisible} color='#ff9700' />
        {this.renderPhotos()}
      </View>
    );
  }
}

export default PhotoList;
