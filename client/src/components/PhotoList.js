// List of all the photos in their visual component PhotoDetail

import React, { Component } from 'react';
import { FlatList, View, AsyncStorage } from 'react-native';
import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import PhotoDetail from './PhotoDetail';
import Headbar from './Headbar';
import { getPhotosAndRests } from '../actions/index';

class PhotoList extends Component {
  state = { spinnerVisible: true, refreshing: false, liked: null, disliked: null };

  componentWillMount() {
    this.getPhotoList();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ spinnerVisible: false });
    }, 300);
  }

  getPhotoList() {
    if (!this.props.loginState) {
      this.getLikedAndDislikedFromDevice().done();
    } else {
      this.getLikedAndDislikedFromServer().done();
    }
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.props.getPhotosAndRests('hot', lat, lng);
    });
  }

  getLikedAndDislikedFromServer = async () => {
    try {
      axios.get(`https://fotafood.herokuapp.com/api/user/${this.props.loginState.uid}`)
      .then((userInfo) => {
        let liked = userInfo.data.likedPhotoIds;
        let disliked = userInfo.data.dislikedPhotoIds;
        if (!liked) liked = [];
        if (!disliked) disliked = [];
        console.log(liked);
        console.log(disliked);
        this.setState({ liked, disliked });
      });
    } catch (error) {
      console.log('Error at line 42 in Photolist.js');
      console.log(error);
    }
  }

  getLikedAndDislikedFromDevice = async () => {
    try {
      // await AsyncStorage.clear();
      const liked = await AsyncStorage.getItem('liked');
      const disliked = await AsyncStorage.getItem('disliked');
      this.setState({ liked: JSON.parse(liked), disliked: JSON.parse(disliked) });
    } catch (error) {
      // console.log(error);
    }
  };

  // given an id of a picutre, returns "liked" if the user has liked it,
  // "disliked" if user has not liked it, and null if neither.
  findVote(id) {
    if (_.includes(this.state.liked, id)) return 'liked';
    if (_.includes(this.state.disliked, id)) return 'disliked';
    return null;
  }

  // Returns the restaurant associated with a given id
  findRestaurant(restaurantid) {
    for (let i = 0; i < this.props.restaurants.length; i++) {
      if (restaurantid === this.props.restaurants[i].id) {
        return this.props.restaurants[i];
      }
    }
    return null;
  }

  refreshListView() {
    this.setState({ refreshing: true });
    this.getPhotoList();
    this.setState({ refreshing: false });
  }

  renderPhoto(photo) {
    return (
      <PhotoDetail
        key={photo.item.id}
        photo={photo.item}
        vote={this.findVote(photo.item.id)}
        restaurant={this.findRestaurant(photo.item.RestaurantId)}
      />
    );
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.photos}
          keyExtractor={photo => photo.id}
          renderItem={photo => this.renderPhoto(photo)}
          ListHeaderComponent={Headbar}
          onRefresh={() => this.refreshListView()}
          refreshing={this.state.refreshing}
        />
        <Spinner visible={this.state.spinnerVisible} color='#ff9700' />
      </View>
    );
  }
}

function mapStateToProps({ photos, restaurants, loginState }) {
  return { photos, restaurants, loginState };
}

export default connect(mapStateToProps, { getPhotosAndRests })(PhotoList);
