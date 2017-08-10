import React, { Component } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, Modal
} from 'react-native';
import request from '../../helpers/axioshelper';
import { PhotoGallery } from '../common';

const restaurantDetails = 'https://fotafood.herokuapp.com/api/restaurant/';

class RestaurantPhotos extends Component {
  static navigationOptions = {
    tabBarLabel: 'Photos'
  };

  state = { photos: [], loading: true, selectedPhoto: null, modalVisible: false }

  componentWillMount() {
    request.get(restaurantDetails + this.props.screenProps.restaurant.id)
    .then(response => this.setState({
      photos: response.data,
      loading: false,
    })).catch(e => request.showErrorAlert(e));
  }

  setSelectedPhoto(index) {
    this.setState({ selectedPhoto: index, modalVisible: true });
  }

  resetSelectedPhoto() {
    this.setState({ selectedPhoto: null, modalVisible: false });
  }

  renderPhoto(photo, index) {
    return (
      <TouchableOpacity
        onPress={() => this.setSelectedPhoto(index)}
      >
        <View key={photo.id} style={photoContainerStyle}>
          <Image
            source={{ uri: photo.link }}
            style={photoStyle}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if (!this.state.loading && this.state.photos.length === 0) {
      return (
        <View style={{ height: 150, justifyContent: 'center' }}>
          <Text style={emptyTextStyle}>
            Be the first to upload a photo here!
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, paddingTop: 5, paddingLeft: 7 }}>
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => { this.resetSelectedPhoto(); }}
        >
          <PhotoGallery
            data={this.state.photos}
            initialIndex={this.state.selectedPhoto || undefined}
            onSwipeVertical={this.resetSelectedPhoto.bind(this)}
          />
        </Modal>

        <FlatList
          data={this.state.photos}
          keyExtractor={photo => photo.id}
          renderItem={(photo) => this.renderPhoto(photo.item, photo.index)}
          showsHorizontalScrollIndicator={false}
          numColumns={3}
          removeClippedSubviews={false}
        />
      </View>
    );
  }
}

const styles = {
  emptyTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
    fontFamily: 'Avenir',
  },
  photoContainerStyle: {
    backgroundColor: 'gray',
    marginVertical: 5,
    marginHorizontal: 5,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { height: 1 }
  },
  photoStyle: { // Individual photos
    height: 110,
    width: 110,
    borderRadius: 4
  }
};

const {
  emptyTextStyle,
  photoContainerStyle,
  photoStyle
} = styles;

export default RestaurantPhotos;
