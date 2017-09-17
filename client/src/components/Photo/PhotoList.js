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

import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import PhotoDetail from './PhotoDetail';
import { setScrollingList } from '../../actions';

//const itemHeight = Dimensions.get('window').width - 20;

class PhotoList extends PureComponent {
  componentDidMount() {
    if (this.props.name) {
      this.props.setScrollingList(this.list, this.props.name);
    }
  }

  componentWillUnmount() {
    if (this.props.name) {
      this.props.setScrollingList(null, this.props.name);
    }
  }

  renderPhoto(photo) {
    return (
      <View style={{ marginLeft: 25, marginRight: 25, marginTop: 15, marginBottom: 15 }}>
        <PhotoDetail
          key={photo.id}
          photo={photo}
          options={this.props.options}
          shouldRenderWithRedux={this.props.shouldRenderWithRedux}
        />
      </View>
    );
  }

  render() {
    return (
      <FlatList
        ref={list => { this.list = list; }}
        data={this.props.list}
        extraData={this.props.extraData}
        keyExtractor={photo => photo.id}
        renderItem={photo => this.renderPhoto(photo.item)}
        ListHeaderComponent={() => <View style={{ backgroundColor: 'white', height: 5 }} />}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        windowSize={10}
        initialNumToRender={10}
      />
    );
  }
}

export default connect(null, { setScrollingList })(PhotoList);
