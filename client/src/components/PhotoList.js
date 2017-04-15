// List of all the photos in their visual component PhotoDetail

import React, { Component } from 'react';
import { ListView, View, AsyncStorage } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import PhotoDetail from './PhotoDetail';
import { getPhotosAndRests } from '../actions/index';

class PhotoList extends Component {
  state = { spinnerVisible: true, liked: null, disliked: null };

  componentWillMount() {
    this.getLikedAndDisliked().done();
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.props.getPhotosAndRests('hot', lat, lng);
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ spinnerVisible: false });
    }, 300);
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

  renderPhoto(photo) {
    return (
      <PhotoDetail
        key={photo.id}
        photo={photo}
        vote={this.findVote(photo.id)}
        restaurant={this.findRestaurant(photo.RestaurantId)}
      />
    );
  }

  render() {
    const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
    return (
      <View>
        <ListView
          dataSource={dataSource.cloneWithRows(this.props.photos)}
          renderRow={photo => this.renderPhoto(photo)}
          initialListSize={15}
          enableEmptySections
        />
        <Spinner visible={this.state.spinnerVisible} color='#ff9700' />
      </View>
    );
  }
}

function mapStateToProps({ photos, restaurants }) {
  return { photos, restaurants };
}

export default connect(mapStateToProps, { getPhotosAndRests })(PhotoList);
