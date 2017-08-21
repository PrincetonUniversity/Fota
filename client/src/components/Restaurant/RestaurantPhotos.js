import React, { Component } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, Modal
} from 'react-native';
import { PhotoGallery } from '../common';

class RestaurantPhotos extends Component {
  static defaultProps = {
    photos: []
  }

  static navigationOptions = {
    tabBarLabel: 'Photos'
  };

  state = { photos: [], loading: true, selectedPhoto: null, modalVisible: false }

  componentWillMount() {
    this.setState({ photos: this.props.screenProps.photos, loading: false });
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.screenProps.photos !== nextProps.screenProps.photos) {
  //     this.setState({ photos: nextProps.screenProps.photos, loading: false });
  //   }
  // }

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
        <View key={index} style={photoFrameStyle}>
          <Image
            source={{ uri: photo.url }}
            style={photoStyle}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    console.log(this.state);
    
    if (!this.state.loading && this.state.photos.length === 0) {
      return (
        <View style={{ height: 150, justifyContent: 'center' }}>
          <Text style={emptyTextStyle}>
            Be the first to upload a photo here!
          </Text>
        </View>
      );
    }

    const photoLinks = this.state.photos.map((photo) => photo.url);
    
    return (
      <View style={{ flex: 1, paddingTop: 5, paddingLeft: 7 }}>
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => { this.resetSelectedPhoto(); }}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <PhotoGallery
              photos={photoLinks}
              initialIndex={this.state.selectedPhoto}
              onSwipeVertical={this.resetSelectedPhoto.bind(this)}
            />
          </View>
        </Modal>

        <View style={{ height: 500 }}>
          <FlatList
            data={this.state.photos}
            keyExtractor={(photo, index) => index}
            renderItem={(photo) => this.renderPhoto(photo.item, photo.index)}
            showsHorizontalScrollIndicator={false}
            numColumns={3}
            removeClippedSubviews={false}
          />
        </View>
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
  photoFrameStyle: {
    backgroundColor: 'gray',
    borderRadius: 4,
    marginVertical: 5,
    marginHorizontal: 5,
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { height: 1 }
  },
  photoStyle: { // Individual photos
    height: 110,
    width: 110,
  }
};

const {
  emptyTextStyle,
  photoFrameStyle,
  photoStyle
} = styles;

export default RestaurantPhotos;
