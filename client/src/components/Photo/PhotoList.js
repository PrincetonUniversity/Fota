/******************************************************************************
 * Called by: Base,
 * Dependencies: lodash, redux, common/Spinner, helpers/axioshelper,
 * Photo/PhotoDetail, Headbar, actions/getPhotosAndRests, actions/loadingTrue
 *
 * Description: The home page. Retrieves and displays a list of nearby photos
 * from the server (radius set by user through settings page), as well as a
 * list of liked/disliked photos by the user from either the server or the
 * device depending on whether or not the user is logged in. Pulling up past
 * the top refreshes the list of photos.
 *
 * Bugs/Todo: Change the order toggler (OrderToggler) to react navigation
 * instead of the current implementation.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { FlatList, View, AsyncStorage } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import request from '../../helpers/axioshelper';
import PhotoDetail from './PhotoDetail';
import Headbar from './Headbar';
import { getPhotosAndRests, loadingTrue } from '../../actions/index';

class PhotoList extends Component {
  state = { refreshing: false, liked: null, disliked: null };

  // static navigationOptions = {
  //   tabBarIcon: ({ tintColor }) => (
  //     <Image
  //       source={homeUnactivated}
  //       style={{ width: 26, height: 26, tintColor }}
  //     />
  //   ),
  // };

  componentWillMount() {
    this.getPhotoList();
  }

  getPhotoList() {
    if (!this.state.refreshing) {
      this.props.loadingTrue();
    }
    navigator.geolocation.getCurrentPosition(position => {
      const lat = 40.34; // position.coords.latitude
      const lng = -74.656; // position.coords.longitude
      AsyncStorage.getItem('SearchRadius').then(radius => {
        this.props.getPhotosAndRests(this.props.sorting, lat, lng, parseInt(radius, 10));
        this.setState({ refreshing: false });
      });
    });
  }

  // given an id of a picutre, returns "liked" if the user has liked it,
  // "disliked" if user has not liked it, and null if neither.
  findVote(upvote, downvote) {
    if (upvote) return 'liked';
    if (downvote) return 'disliked';
    return null;
  }

  // Returns the restaurant associated with a given id
  // findRestaurant(restaurantid) {
  //   for (let i = 0; i < this.props.restaurants.length; i++) {
  //     if (restaurantid === this.props.restaurants[i].id) {
  //       return this.props.restaurants[i];
  //     }
  //   }
  //   return null;
  // }

  refreshListView() {
    this.setState({ refreshing: true }, () => this.getPhotoList());
    this.setState({ refreshing: false });
  }

  renderPhoto(photo) {
    return (
      <View style={{ marginLeft: 30, marginRight: 30, marginTop: 20, marginBottom: 20 }}>
        <PhotoDetail
          key={photo.id}
          photo={photo}
          vote={this.findVote(photo.user_upvote, photo.user_downvote)}
          restaurantid={photo.rest_id}
        />
      </View>
    );
  }

  render() {
    if (this.props.loading || this.state.refreshing) {
      return (
        <View>
          <Headbar />
          <Spinner visible color='#ff9700' />
        </View>
      );
    }
    return (
      <View style={{ backgroundColor: '#FFFFFF' }}>
        <FlatList
          data={this.props.photos}
          extraData={Headbar}
          keyExtractor={photo => photo.id}
          renderItem={photo => this.renderPhoto(photo.item)}
          ListHeaderComponent={() => <Headbar update={this.getPhotoList.bind(this)} />}
          onRefresh={() => this.refreshListView()}
          refreshing={this.state.refreshing}
          showVerticalScrollIndicator={false}
          windowSize={10}
        />
      </View>
    );
  }
}

function mapStateToProps({ photos, restaurants, loginState, loading, sorting }) {
  return { photos, restaurants, loginState, loading, sorting };
}

export default connect(mapStateToProps, { getPhotosAndRests, loadingTrue })(PhotoList);
