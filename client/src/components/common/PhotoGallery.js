import React, { Component } from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Pages } from 'react-native-pages';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
// const SWIPE_THRESHOLD = SCREEN_HEIGHT / 4;
// const SWIPE_OUT_DURATION = 250;

class PhotoGallery extends Component {
  static defaultProps = {
    initialIndex: 0
  }

  constructor(props) {
    super(props);
    this.state = {
      index: this.props.initialIndex
    };
  }

  renderPhotos() {
    return this.props.photos.map((photo, index) =>
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={this.props.closeModal}
        style={{ flex: 1 }}
      >
        <View style={styles.photoFrameStyle}>
          <Image
            source={{ uri: photo }}
            style={styles.photoStyle}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Pages startPage={this.props.initialIndex}>
        {this.renderPhotos()}
      </Pages>
    );
  }
}

const styles = {
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoFrameStyle: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  photoStyle: {
    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').width - 50,
    backgroundColor: '#d3d3d3',
    borderRadius: 9
  }
};

export { PhotoGallery };
