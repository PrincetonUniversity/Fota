import React, { Component } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, Modal, Dimensions
} from 'react-native';
import { PhotoGallery } from '../common';
import { dealWithAndroidBeingStupid } from '../common/GradientImage';

const photoSize = (Dimensions.get('window').width - 44) / 3;

class RestaurantPhotos extends Component {
  static defaultProps = {
    photos: []
  }

  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: ({ focused, tintColor }) => {
      const numColor = focused ? '#ff9700' : 'rgba(0, 0, 0, 0.23)';
      let labelText = ' PHOTOS';
      if (screenProps.photos.length === 1) {
        labelText = ' PHOTO';
      }
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={[tabLabelStyle, { color: numColor }]}>
            {screenProps.photos.length}
          </Text>
          <Text style={[tabLabelStyle, { color: tintColor }]}>
            {labelText}
          </Text>
        </View>
      );
    },
    // tabBar: () => ({
    //   indicatorStyle: {
    //     marginLeft: 50
    //   },
    //   labelStyle: {
    //     fontSize: 100,
    //     fontWeight: '900'
    //   },
    // })
  });

  // static navigationOptions = ({ screenProps }) => ({
  //   tabBarLabel: `${screenProps.photos.length} PHOTOS`
  // });

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
          {dealWithAndroidBeingStupid(4)}
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
              photos={photoLinks}
              initialIndex={this.state.selectedPhoto}
              onSwipeVertical={this.resetSelectedPhoto.bind(this)}
            />
          </View>
        </Modal>

        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.photos}
            keyExtractor={(photo, index) => index}
            renderItem={(photo) => this.renderPhoto(photo.item, photo.index)}
            showVerticalScrollIndicator={false}
            bounces={false}
            numColumns={3}
            removeClippedSubviews={false}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  tabLabelStyle: {
    fontSize: 14,
    fontWeight: '900',
    paddingVertical: 5
  },
  tabContainerStyle: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 7,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowRadius: 5,
    shadowOpacity: 0.5,
    //shadowOffset: { width: 0, height: 2 }
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
  photoStyle: { // Individual photos
    height: photoSize,
    width: photoSize,
  }
};

const {
  tabLabelStyle,
  tabContainerStyle,
  emptyTextStyle,
  photoFrameStyle,
  photoStyle
} = styles;

export default RestaurantPhotos;
