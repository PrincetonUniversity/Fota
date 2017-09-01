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

  // static navigationOptions = ({ screenProps }) => ({
  //   tabBarLabel: ({ focused, tintColor }) => {
  //     const numColor = focused ? '#ff9700' : 'rgba(0, 0, 0, 0.23)';
  //     let labelText = ' PHOTOS';
  //     if (screenProps.photos.length === 1) {
  //       labelText = ' PHOTO';
  //     }
  //     return (
  //       <View style={{ flexDirection: 'row' }}>
  //         <Text style={[tabLabelStyle, { color: numColor }]}>
  //           {screenProps.photos.length}
  //         </Text>
  //         <Text style={[tabLabelStyle, { color: tintColor }]}>
  //           {labelText}
  //         </Text>
  //       </View>
  //     );
  //   },
  // });

  constructor(props) {
    super(props);

    //const scrollY = new Animated.Value(0);
    // const panResponder = PanResponder.create({
    //   onStartShouldSetPanResponder: () => true,
    //   onPanResponderMove: (event, gesture) => {
    //     console.log(`Move OffsetY: ${this.state.offsetY._value}`);
    //     // if (this.state.offsetY._value < 5 && gesture.dy > 0) {
    //     //   console.log(`GestureY: ${gesture.dy}`);
    //     //   this.props.screenProps.startScrollUp(gesture.dy);
    //     // }
    //   },
    //   onPanResponderRelease: (event, gesture) => {
    //     console.log(`release OffsetY: ${this.state.offsetY._value}`);
    //   },
    //   onPanResponderReject: (e, gestureState) => {
    //     console.log(`reject OffsetY: ${this.state.offsetY._value}`);
    //   },
    //   onPanResponderGrant: (e, gestureState) => {
    //     console.log(`grant OffsetY: ${this.state.offsetY._value}`);
    //   },
    //   onPanResponderStart: (e, gestureState) => {
    //     console.log(`start OffsetY: ${this.state.offsetY._value}`);
    //   },
    //   onPanResponderEnd: (e, gestureState) => {
    //     console.log(`end OffsetY: ${this.state.offsetY._value}`);
    //   },
    //   onPanResponderTerminate: (event, gesture) => {
    //    console.log(`terminating OffsetY: ${this.state.offsetY._value}`);
    //   },
    //   onPanResponderTerminationRequest: (event, gesture) => {
    //     console.log(`terminationrequest OffsetY: ${this.state.offsetY._value}`);
    //     //this.resetPosition();
    //   }
  // });

    this.state = {
      photos: [],
      selectedPhoto: null,
      modalVisible: false,
      //offsetY: new Animated.Value(0),
      //atTop: true,
      //panResponder,
      //scrollY
    };
  }

  componentWillMount() {
    this.setState({ photos: this.props.screenProps.photos });
    // this.props.screenProps.scrollY.addListener((e) => {
    //   this.setState({
    //     offsetY: e.value
    //   });
    // });
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

  // checkScroll() {
  //   //console.log(this.state.scrollY);
  //   console.log(this.props.screenProps.headerScrollDistance);
  //   if (this.state.offsetY < this.props.screenProps.headerScrollDistance) {
  //     return false;
  //   }
  //   return true;
  // }

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
              closeModal={() => this.setState({ modalVisible: false })}
              photos={photoLinks}
              initialIndex={this.state.selectedPhoto}
              onSwipeVertical={this.resetSelectedPhoto.bind(this)}
            />
          </View>
        </Modal>

        <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
          <View
            //{...this.state.panResponder.panHandlers}
            style={{ flex: 1 }}
          >
            <FlatList
              data={this.state.photos}
              keyExtractor={(photo, index) => index}
              // {...this.state.panResponder.panHandlers}
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
