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
import { FlatList, View, Dimensions } from 'react-native';
import PhotoDetail from './PhotoDetail';

const itemHeight = Dimensions.get('window').width - 20;

class PhotoList extends Component {
  // given an id of a picutre, returns "liked" if the user has liked it,
  // "disliked" if user has not liked it, and null if neither.
  findVote(upvote, downvote) {
    if (upvote) return 'liked';
    if (downvote) return 'disliked';
    return null;
  }

  renderPhoto(photo) {
    return (
      <View style={{ marginLeft: 25, marginRight: 25, marginTop: 15, marginBottom: 15 }}>
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
    return (
      <FlatList
        data={this.props.list}
        extraData={this.props.extraData}
        keyExtractor={photo => photo.id}
        renderItem={photo => this.renderPhoto(photo.item)}
        ListHeaderComponent={() => <View style={{ backgroundColor: 'white', height: 5 }} />}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        windowSize={10}
        initialNumToRender={2}
        getItemLayout={(data, index) => (
          { length: itemHeight, offset: itemHeight * index, index }
        )}
      />
    );
  }
}


export default PhotoList;
