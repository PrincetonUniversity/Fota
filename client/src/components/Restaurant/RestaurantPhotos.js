import React, { Component } from 'react';
import { View, FlatList, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { PhotoGallery, NotFoundText } from '../common';
import { dealWithAndroidBeingStupid } from '../common/GradientImage';

const photoSize = (Dimensions.get('window').width - 44) / 3;

class RestaurantPhotos extends Component {
  static defaultProps = {
    photos: []
  }

  static navigationOptions = {
    tabBarVisible: false
  }

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      selectedPhoto: null,
      modalVisible: false,
    };
  }

  componentWillMount() {
    this.setState({ photos: this.props.screenProps.photos });
  }

  setSelectedPhoto(index) {
    this.setState({ selectedPhoto: index, modalVisible: true });
  }

  resetSelectedPhoto() {
    this.setState({ selectedPhoto: null, modalVisible: false });
  }

  renderPhoto(photo, index) {
    if (photo.url_small == null) {
      return (
        <TouchableOpacity
          onPress={() => this.setSelectedPhoto(index)}
        >
          <View key={index} style={photoFrameStyle}>
            <View style={{ width: photoSize, height: photoSize, borderRadius: 4, backgroundColor: 'blue' }} />
            {dealWithAndroidBeingStupid(4)}
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => this.setSelectedPhoto(index)}
      >
        <View key={index} style={photoFrameStyle}>
          <Image
            source={{ uri: photo.url_small }}
            style={photoStyle}
          />
          {dealWithAndroidBeingStupid(4)}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.state.photos.length === 0) {
      return (
        <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
          <NotFoundText height={150} text='Be the first to upload a photo here!' />
        </TouchableOpacity>
      );
    }
    const photoLinks = this.state.photos.map(photo => photo.url);
    return (
      <View style={tabContainerStyle}>
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => { this.resetSelectedPhoto(); }}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <PhotoGallery
              closeModal={() => this.setState({ modalVisible: false })}
              photos={photoLinks}
              initialIndex={this.state.selectedPhoto}
              onSwipeVertical={this.resetSelectedPhoto.bind(this)}
            />
          </View>
        </Modal>

        <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.photos}
              keyExtractor={(photo, index) => index}
              renderItem={(photo) => this.renderPhoto(photo.item, photo.index)}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              bounces={false}
              numColumns={3}
              removeClippedSubviews={false}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  tabContainerStyle: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 7
  },
  emptyTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
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
  photoStyle: {
    height: photoSize,
    width: photoSize,
  }
};

const {
  tabContainerStyle,
  photoFrameStyle,
  photoStyle
} = styles;

export default RestaurantPhotos;
