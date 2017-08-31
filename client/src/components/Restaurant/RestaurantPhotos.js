import React, { Component } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, Modal, Dimensions, Animated,
  PanResponder
} from 'react-native';
import { PhotoGallery, NotFoundText } from '../common';
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
  });

  constructor(props) {
    super(props);

    const scrollY = new Animated.Value(0);
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        console.log(gesture.dy);
        scrollY.setValue(gesture.dy);
      },
      onPanResponderRelease: (event, gesture) => {
        console.log('release');
      },
      onPanResponderReject: (e, gestureState) => {
        console.log('reject');
      },
      onPanResponderGrant: (e, gestureState) => {
        console.log('grant');
      },
      onPanResponderStart: (e, gestureState) => {
        console.log('start');
      },
      onPanResponderEnd: (e, gestureState) => {
        console.log('end');
      },
      onPanResponderTerminate: (event, gesture) => {
       console.log('terminating panresponder');
      },
      onPanResponderTerminationRequest: (event, gesture) => {
        console.log('terminationrequest');
        //this.resetPosition();
      }
    });

    this.state = {
      photos: [],
      selectedPhoto: null,
      modalVisible: false,
      offsetY: 0,
      panResponder,
      scrollY
    };
  }

  componentWillMount() {
    this.setState({ photos: this.props.screenProps.photos });
    this.props.screenProps.scrollY.addListener((e) => {
      this.setState({
        offsetY: e.value
      });
    });
  }

  componentDidMount() {
    // console.log(this.props.screenProps.scrollY);
    // this.props.screenProps.scrollY.addListener((e) => {
    //   this.setState({
    //     scrollY: e
    //   });
    // });
    //this.props.screenProps.scrollY.addListener(this.state.scrollY.bind(this));
  }

  setSelectedPhoto(index) {
    this.setState({ selectedPhoto: index, modalVisible: true });
  }

  resetSelectedPhoto() {
    this.setState({ selectedPhoto: null, modalVisible: false });
  }

  checkScroll() {
    // sconsole.log(this.state.offsetY);
    //console.log(this.props.screenProps.headerScrollDistance);
    if (this.state.offsetY < this.props.screenProps.headerScrollDistance) {
      return false;
    }
    return true;
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
    if (this.state.photos.length === 0) {
      return <NotFoundText height={150} text='Be the first to upload a photo here!' />;
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
            //onScroll={(e) => console.log(e.nativeEvent.contentOffset.y)}
            showVerticalScrollIndicator={false}
            scrollEnabled={this.checkScroll()}
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
    borderWidth: 1,
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
  photoStyle: {
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
